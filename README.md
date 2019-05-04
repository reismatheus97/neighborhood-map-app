# neighborhood-map-app
The fifth project into the Udacity's Full Stack Developer Nanodegree.  
This isn't a commercial project and has only academic purposes.

# About
This is an [Single Page Application](https://en.wikipedia.org/wiki/Single-page_application) that features a map whose provides information about a location and its nearby venues.  
Its called "The Neighborhood Map App" because it allows the users to search and explore places around a location they wanted to go.  

The application was written using the following features:
- [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/), a JavaScript library to render interactive maps.
- [Mapbox Search Service](https://docs.mapbox.com/api/search/) and its [Geocoding API](https://docs.mapbox.com/api/search/#geocoding) to perform [Geocoding and Reverse Geocoding](https://developers.google.com/maps/documentation/geocoding/start)
- [Mapbox Navigation Service](https://docs.mapbox.com/api/navigation/) and its [Directions API](https://docs.mapbox.com/api/navigation/#directions) to discover routes between two places with different travel profiles: walking, cycling and driving
- [Foursquare Places API](https://developer.foursquare.com/places-api) to discover nearby locations around a specific place.
- [Knockout.js](http://knockoutjs.com), a JavaScript library to create rich, responsive display and editor user interfaces with a clean underlying data model.
- [Material Design](https://material.io/) design system and component library  

It explores some concepts about:
- [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)
- The MVVM (Model-View-ViewModel) design pattern
- Asynchronous programming via AJAX
- Working with distributed APIs 
- Error handling
- UI elements provided by **Material Design components for Web** and UX improved.
- Responsiveness across modern desktop, tablet, and phone browsers.

# How it works
There are two main modes: **markers** and **directions**  
## Markers:  
![alt text](https://github.com/reismatheus97/neighborhood-map-app/blob/master/assets/markers_mode.png "Markers mode")   
In this mode the user can feels free to click on the map and **create a marker on the clicked position**.  
The arrow keys are used to **move around the map**. This is also possible to drag-and-move (click+click and hold).  
In this mode, when the user clicks on **a saved marker inside the his locations' list items** it will center on a marker at the map.

## Directions:  
![alt text](https://github.com/reismatheus97/neighborhood-map-app/blob/master/assets/directions_mode.png "Directions mode")  
In this mode the user can **select two markers inside the his locations' list items** and wait for a route between these two points. There are different travel options available to go.

# Requirements
Any web browser and available internet connection. 

# Used content
[Mapbox](https://www.mapbox.com/maps/)   
[Foursquare](https://developer.foursquare.com/)  
[Material Design](https://material.io/)  
[Knockout.js](http://knockoutjs.com)  
