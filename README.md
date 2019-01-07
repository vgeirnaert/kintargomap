# Kintargo map

Map of the city of Kintargo with toggleable labels and highlighted areas for the Hells Rebels adventure path for Pathfinder. Different labels can be made visible for different players, allowing each player to have their own unique knowledge of the city. This project be used as is (beware: it contains a lot of extra content not from the books, and is currently keyed to specific players), or can (should) be adapted to your own campaign.

This is provided as is, without support. For an example project, see here: http://kintargo.mindsoup.net

![screenshot](https://i.imgur.com/rdrGzNl.jpg)

# Adapting this for your own game

After checking out the project you'll need to make some changes. Then you will need to host it somewhere. The project only contains HTML, CSS and Javascript so any webhost should suffice.

## Choosing a map image

Choose a map image that is as big as possible without becoming unweildy when displayed in a browser at 100% size. Too big might make it more difficult for a user to maintain an overview of the city, while too small might make it difficult to see the different areas of the city underneath all the labels. My recommendation is no images wider than 1900 pixels or narrower than 1400. 

Since you will base your coordinates on this image, changing the image at a later date is a lot of work, so pick the right one at the start.

Replace the existing map.jpg with your new image.

## Change index.html

Index.html contains a background image and the names of the players in your group. Clicking on each name brings them to a personalized version of the map. If you do not wish to use this, you can remove this file and rename map.html to index.html. 

You can change the background image by changing the URL in the CSS background definition.

You can change (or add/remove) the player names in the body of the page. Make sure to change both the displayed name and the name in the URL. Any url parameters will be interpreted as tags. So with url parameter ?player=john, only map objects that have the tag "john" will be displayed. Technically, ?literally_anything=john would do the exact same thing, as the url parameter names are not important.

## Change map.html

Find the javascript code that defines the mapData array. Unless you're using the image included in the project, you'll want to delete all array items here and create your own. You can use the existing array as an example however.

Each map object has the following properties:

* title (mandatory): string, label to be displayed on the map
* description (optional): string, description to displayed on the tooltip
* tags (mandatory): array of strings - a map object will be displayed if all the currently user-selected tags are in this list
* type (mandatory): string, one of "event", "location", "district"
  * events will be coloured red, locations blue and districts green
* shape (mandatory): array of shape objects, must contain at least one shape object
  * shape objects have a type (string, either "triangle" or "poly") and coordinates (array of integers, get coordinates from image-map.net)
    * poly shapes are the image-map poly shape defined by their coordinates, triangles are just a small triangle located around 1 set of x,y coordinates

Example:

```javascript
  {
    "title":"Alabaster Arcana",
    "description":"Magic items and supplies",
    "tags":["villegre", "business", "shop", "ialon", "location", "majet", "dolores", "zero"],
    "type":"location",
    "shape": [{
      "type":"poly",
      "coordinates":[753,320,755,327,764,327,760,319]
    }]
  },
```
### Order of objects in the array

Map objects are drawn in the order of the array. So the first item of the array is on top of all others, while the last item is below all others. This is important if you have large map objects that overlap the same space as smaller objects, for example city districts vs individual locations. You should make sure the large map objects are ordered in the array after the smaller map objects.

### Getting the right coordinates

You can use the website image-map.net to obtain the coordinates for your shapes. Make sure you use the same image there as the one you're using in this project. If you don't, your coordinates will be completely off.

Using the image-map website, you can draw poly shapes on your map by selecting 'Poly' as shape for your active area and then clicking on your map. You can add multiple areas. To get the coordinates, click 'Show me the code!'. The resulting HTML is mostly unnecessary, but in it you can see for each area a set of coordinates. You can copy and paste those into your javascript mapData coordinates array.

### Creating your own filters

If you wish to create your own filters at the bottom of the page, or change the existing ones, you can find them in the html of the map.html file as html form inputs. Make sure that the radio values are the same as the tags you're entering in your map data. Keep in mind that only map objects that contain all the tags currently selected by a user will be shown.

To create a new tag you can use any name for it, it will be automatically picked up by the script.

Example:
```html
<form>
						<label><input type="radio" name="newfilter" value="" checked>Dont filter this</label>
						<label><input type="radio" name="newfilter" value="option1">Option 1</label>
						<label><input type="radio" name="newfilter" value="option2">Option 2</label>
</form>
```
