function getUrlParameters() {
	var url = window.location.href;
	var urlParts = url.split('?');

	if(urlParts.length == 1) {
		return [];
	}

	var queryString = urlParts[1];

	var parameters = queryString.split('&');


	var result = [];
	for(var i = 0; i < parameters.length; i++) {
		if(parameters[i].indexOf('=') == -1) {
			continue;
		}

		var parameter = parameters[i].split('=');

		if(parameter[1].length > 0) {
			result[parameter[0]] = parameter[1];
		}
	}

	return result;
}

function getCurrentTags() {
	var parameters = getUrlParameters();

	var result = [];
	var keys = Object.keys(parameters);
	for(var i = 0; i < keys.length; i++) {
		result.push(parameters[keys[i]]);
	}

	return result;
}

function initMap(currentTags) {
	console.log("initialising map with filters: " + currentTags);
	initMapData(currentTags);
	initMapify();
	initControls();
}

function initMapData(currentTags) {
	var map = $('#kintargoMap');
	map.empty();

	for(var i = 0; i < mapData.length; i++) {
		var mapItem = mapData[i];
		if(isVisible(currentTags, mapItem.tags)) {
			for(var j = 0; j < mapItem.shape.length; j++) {
				var mapElement = $('<area data-title="' + mapItem.title + 
					'" data-description="' + mapItem.description + 
					'" shape="' + mapItem.shape[j].type + 
					'" coords="' + mapItem.shape[j].coordinates + 
					'" data-hover-class="' + mapItem.type +
					'" data-group-id="' + (mapItem.shape.length > 1 ? 'mapArea'+i : '')+
					'" id="mapArea' + i + '" />');
				map.append(mapElement);
			}
		}
	}
}

function isVisible(currentTags, objectTags) {
	for(var i = 0; i < currentTags.length; i++) {
		if($.inArray(currentTags[i], objectTags) == -1) {
			return false;
		}

	}

	return true;
}

function initMapify() {
	$("img[usemap]").mapify({
		popOver: {
			content: function(zone){ 
				return "<strong>"+zone.attr("data-title")+"</strong>"+zone.attr("data-description");
			},
			delay: 0.7,
			margin: "15px",
			height: "90px",
			width: "240px"
		}
	});
}

function initControls() {
	$("input[type=radio]").change(function() {
		var value = $(this).val();
		var parameter = $(this).attr("name");

		var parameters = getUrlParameters();
		parameters[parameter] = value;

		filterPage(parameters);
	});

	$("#persistentLabels").change(function() {
		$('#kintargoMap').setAutoClearMap(!$(this).is(':checked'));
		applyFilters();
	});
}

function filterPage(parameters) {
	var url = createUrl(parameters);
	window.history.pushState(url, "kintargo", url);
	applyFilters();
}

function createUrl(parameters) {
	var url = window.location.href.split('?')[0];

	url = url + '?';
	var keys = Object.keys(parameters);
	for(var i = 0; i < keys.length; i++) {
		var param = keys[i];
		var value = parameters[param];
		url = url + param + '=' + value + '&';
	}

	return url;
}

function applyFilters() {
	var tags = getCurrentTags();

	forceClearMap();
	for(var i = 0; i < mapData.length; i++) {
		var mapItem = mapData[i];
		if(isVisible(tags, mapItem.tags)) {
			$('#kintargoMap').showZone($('#mapArea' + i)[0], mapItem.type == 'district');
		}
	}
}

function forceClearMap() {
	$('#kintargoMap').setAutoClearMap(true);
	$('#kintargoMap').clearMap();
	$('#kintargoMap').setAutoClearMap(!$("#persistentLabels").is(':checked'));
}


// script start on page loaded
$( document ).ready(function() {
	var currentTags = getCurrentTags();

	initMap(currentTags);
	applyFilters();
	$('#kintargoMap').setAutoClearMap(false);
});