
const mapBoxAccessToken = `pk.eyJ1IjoicmVpc21hdGhldXM5NyIsImEiOiJjanV5eHhtNjkxMjJnM3lydmFqdjBodXB4In0.B97LD8MDr6PdY2LiEWvhEA`
mapboxgl.accessToken = mapBoxAccessToken

// Mapbox Map instance
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: [-43.17614100000003, -22.910430000000034],
    zoom: 14,
})

// Used to draw a line between points
var linestring = {
    "type": "Feature",
    "geometry": {
        "type": "LineString",
        "coordinates": []
    }
}

// Add MapBox Geocoder element
map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    zoom: 17,
    placeholder: "Search around the world",
    reverseGeocode: true
}))

// Add MapBox Navigation Controls element
map.addControl(new mapboxgl.NavigationControl())

// Add Geolocate element (needs user allowment)
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}))

map.on('click', createMarker)

let fiveLocationsPoints = [
    [-43.201445115339766, -22.987260465122645],
    [-43.168741590995694, -22.964041378464472],
    [-40.50890807387938, -2.804778353498193],
    [-41.88850087705029, -22.770348294367736],
    [-41.90974685546715, -22.778699601373205]
]

// It includes 5 default locations on the map
fiveLocationsPoints.map(it => {
    let e = { lngLat: { lng: it[0], lat: it[1] } }
    createMarker(e)
})

// Create an marker and add it to the map.
// It fetches Mapbox Locations API 
function createMarker(e) {
    let center = [e.lngLat.lng, e.lngLat.lat]

    // URL with latitute and longitude (latlng)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
        `${center[0]},${center[1]}.json?access_token=${mapBoxAccessToken}`

    // the ViewModel instance 
    const viewModel = ko.dataFor(document.body)

    let address_name = "",
        place = "",
        country = "",
        isNoWhere = false

    // If not on directions mode, fetch Mapbox Locations API using jQuery's AJAX
    if (viewModel.markersMode()) {
        $.get({
            url,
            context: document.body
        }).done(function (result) {

            // If there are features, fill `address_name`, `place` and `country` values
            if (result.features && result.features.length > 0) {

                if (result.features[0].place_name) {
                    address_name = result.features[0].place_name.split(",").splice(0, 1).join()
                }

                place = result.features.find(it => it.place_type == "place")
                country = result.features.find(it => it.place_type == "country")

                if (place) {
                    address_name += ", " + place.text
                    place = place.text
                }

                if (country) {
                    let country_code = country.properties.short_code.toUpperCase()
                    address_name += ", " + country_code
                    contry = country_code
                }

            } else {
                address_name = "No where!"
                isNoWhere = true
            }

        }).fail(function (xhr, textStatus, errorThrown) {
            // Error handling
            console.warn("Fail to fetch mapbox geocoding API. " + (errorThrown || ""))
            address_name = ""
        }).always(function () {    // Do always, regardless of success or error    

            if (!isNoWhere) {
                // Only creates a popup if the address is specific enough
                // to perform a sense fetches on Foursquare API.
                let isSearchableAddress = address_name.split(",").length > 2
                if (isSearchableAddress) {
                    // Creates Mapbox Popup instance
                    var popup = new mapboxgl.Popup({
                        offset: 1,
                        anchor: 'top',
                        closeOnClick: false
                    })
                        .setDOMContent( // Setting popup's custom element
                            popupTemplate(
                                address_name
                            )
                        )
                        .setLngLat(center)

                }

                // Setting marker's custom element
                // First, creates a container to the marker
                let markerContainer = document.createElement('div');
                markerContainer.className = 'marker-container'

                // Second, creates the marker element
                let markerIcon = document.createElement('i')

                // Customizing marker element
                markerIcon.className = 'material-icons marker'
                markerIcon.textContent = 'place'
                markerIcon.onclick = function (e) {
                    e.stopPropagation()
                    if (isSearchableAddress) {
                        popup.addTo(map)

                        // It adds custom event to close the popup 
                        addClosePopupCustomEvent()

                        // Add popup instance to the ViewModel
                        viewModel.addPopups(popup)
                    }
                    viewModel.activeMarker({ center, address_name })
                    map.easeTo({ center })
                };

                // Append marker to its container
                markerContainer.appendChild(markerIcon)

                // Aligns viewport and map centers slowly
                map.easeTo({ center })

                // Creates Mapbox Marker instance and appends it to its marker container
                let marker = new mapboxgl.Marker(markerContainer)
                    .setLngLat(center)
                    .addTo(map)

                // Add marker instance to ViewModel
                viewModel.addMarker({
                    center,
                    address_name,
                    markerMapBox: marker
                })
            } else {
                invalidLocationSnackBar.open()
            }

        })
    } else {
        // Aligns viewport and map centers normally
        map.flyTo({ center });
    }
}
// End create marker

// It adds custom event to close the popup 
// On click, update the ViewModel
function addClosePopupCustomEvent() {
    document.querySelector('.mapboxgl-popup-close-button')
        .onclick = function () {
            ko.dataFor(document.body).closePopup()
        }
}

// It fetches the Foursquare API to retrieve information
// about nearby venues of a specific location.
function fetchFoursquareAPI() {

    // the ViewModel instance 
    const viewModel = ko.dataFor(document.body)

    // Get the active marker's center
    const center = viewModel.activeMarker().center

    // Foursquare URL with a longitude, latitude, client id and client secret
    const foursquareClientID = `EHBZPGPP5CFESEZAXKUORTOT5EMHUHKZPA1DRAXC3MYLFH2R`
    const foursquareClientSecret = `FFYFDZLLIYO2OKN3VUJZIQ0WM2GTQIPTZHXZAEDXSIWJFHE1`
    let foursquareUrl = `https://api.foursquare.com/v2/venues/search?ll=` +
        `${center[1] + ',' + center[0]}&client_id=${foursquareClientID}` +
        `&client_secret=${foursquareClientSecret}&v=20190401&limit=9&llAcc=1.0&radius=250`

    // Fetches Fourquare API using jQuery's AJAX
    $.get({
        url: foursquareUrl,
        context: document.body
    }).done(function (result) {
        if (
            result.response &&
            result.response.venues &&
            result.response.venues.length > 0
        ) {
            // If there are venues, fill temporaryVenues array
            let temporaryVenues = result.response.venues.map(
                it => {
                    let venue = {}
                    let address_name = ""

                    // A venue always need to has name and center (longitude, latitude)
                    venue = {
                        name: it.name,
                        center: [it.location.lng, it.location.lat]
                    }

                    // If there are a valid location and address,
                    // fill `adress_name` values
                    if (it.location.address) {
                        address_name = it.location.address
                        if (it.location.city) { ", " + it.location.city }
                        if (it.location.cc) { ", " + it.location.cc }
                        venue = { ...venue, address_name }

                        // Create Mapbox Popup instance
                        var popup = new mapboxgl.Popup({
                            offset: 1,
                            anchor: 'top',
                            closeOnClick: false
                        })
                            .setDOMContent( // Set custom popup element
                                popupTemplate(
                                    venue.name + "," + venue.address_name,
                                    true
                                )
                            )
                            .setLngLat(venue.center);

                        // Setting marker's custom element
                        // First, creates a container to the marker
                        let markerContainer = document.createElement('div');
                        markerContainer.className = 'marker-container';

                        // Second, creates the marker element
                        let markerIcon = document.createElement('i');

                        // Customizing venue marker element
                        markerIcon.className = 'material-icons venue';
                        markerIcon.textContent = 'place';
                        markerIcon.onclick = function (e) {
                            // Stop event propagation
                            // It doens't trigger Map's click event
                            e.stopPropagation();
                            popup.addTo(map)

                            // It adds custom event to close the popup 
                            addClosePopupCustomEvent()

                            // Add popup instance to the ViewModel
                            viewModel.addPopups(popup)

                            map.easeTo({ center: venue.center });
                        };

                        // Append venue marker to its container
                        markerContainer.appendChild(markerIcon);

                        // Creates Mapbox Marker instance and appends it to its marker container
                        let markerVenue = new mapboxgl.Marker(markerContainer)
                            .setLngLat(venue.center)
                            .addTo(map)

                        venue = { ...venue, venueMarkerMapBox: markerVenue }

                        // Add venue marker instance to the ViewModel
                        viewModel.addVenueMarker(venue)

                        return venue
                    }

                }
            )

        }

    }).fail(function (xhr, textStatus, errorThrown) {
        // Error handling
        console.warn("Fail to fetch Foursquare API. " + (errorThrown || ""));
    })

}

// Transform a string into a HTML element.
// It uses HTML5' template feature.
function htmlToElement(html) {
    let templateEl = document.createElement('template');
    html = html.trim();
    templateEl.innerHTML = html;
    return templateEl.content.firstChild;
}

// Function to create a custom popup template using Material Design' card component
function popupTemplate(text, withoutActions) {

    let title = text.split(",").splice(0, 1).join()
    let subtitle = text.split(",").splice(1).join()
    let templateActions = ``

    if (text.split(",").length > 2 && !withoutActions) {
        templateActions = `
                    <div class="mdc-card__actions">
                        <div class="mdc-card__action-buttons">
                        <button class="mdc-button mdc-card__action mdc-card__action--button" onclick="fetchFoursquareAPI(event)">
                            <span class="mdc-button__label" style="width: max-content;">Find nearby venues</span>
                            <img class="mdc-button__icon" src="assets/foursquare-icon.svg" onerror="this.src=assets/foursquar-icon.svg'"
                                style="width: 25px; height: 25px"
                            />
                        </button>
                        </div>
                    </div>
                `
    }

    let template = `
            <div class="mdc-card">
                <div class="mdc-card__primary-action mdc-card-title-custom">    
                    <span class="mdc-typography mdc-typography--subtitle1">${title}</span>
                    <span class="mdc-typography mdc-typography--subtitle2">${subtitle}</span>
                    <div id="ttt" style="display: none; height: 100px">
                        <hr/>    
                    </div>
                </div>
                ${templateActions}
            </div>
            `
    template = htmlToElement(template)
    return template
}

// It clears both points and route. (Element related with directions mode)
function clearPointsAndRoute() {
    // the ViewModel instance 
    const viewModel = ko.dataFor(document.body);

    if (viewModel.origin()) {
        document.querySelector(".directions-origin")
            .classList.remove("directions-origin");

        if (viewModel.destination()) {
            document.querySelector(".directions-destination")
                .classList.remove("directions-destination");

            map.removeLayer('route');
            map.removeSource('route');
        }

    }

    viewModel.origin("");
    viewModel.destination("");

}

// It fethces Mapbox Directrions API to discover directions between two points.
function discoverDirections() {

    // the ViewModel instance 
    const viewModel = ko.dataFor(document.body)

    // Origin
    const A = viewModel.origin()
    // Destination
    const B = viewModel.destination()
    // Travel profile (one of: 'walking', 'cycling', 'driving')
    const profile = viewModel.travelProfile();

    // URL to Mapbox Directions API with both origin and destination points (A and B, respectively)
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/${profile.toLowerCase()}/` +
        `${A.x},${A.y};${B.x},${B.y}?` +
        `overview=full&geometries=geojson&access_token=` + mapBoxAccessToken;

    // It uses jQuery's AJAX to perform GET request
    $.get({
        url: directionsUrl
    })
        .done(function (result) {
            // If there are routes between the given points
            if (result.routes && result.routes.length > 0) {

                // It stores in route's data and creates a feature
                // using GeoJSON feature. This makes possible to draw
                // the route on the map.
                let data = result.routes[0];
                let route = data.geometry.coordinates;
                let geojson = {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: route
                    }
                };

                // If already exists source 'route', just set new route
                // using the GeoJSON
                if (map.getSource('route')) {
                    map.getSource('route').setData(geojson);
                } else {
                    // Else, creates the layer source named 'route'
                    map.addLayer({
                        id: 'route',
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: {
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'LineString',
                                    coordinates: geojson
                                }
                            }
                        },
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#6200ee',  // Route's color
                            'line-width': 5,  // Route's width
                            'line-opacity': 1  // Route's opacity
                        }
                    })

                    // Set source's data with GeoJSON
                    map.getSource('route').setData(geojson);
                }

                // Toggle drawer's visibility
                if (drawer && !drawer.open) toggleDrawer()

            }
        }).fail(function (xhr, textStatus, errorThrown) {
            // Error handling
            console.warn("Fail to fetch mapbox directions API. " + (errorThrown || ""));
        })
}

// It closes all popups
function closePopups() {
    let viewModel = ko.dataFor(document.body)
    viewModel.removePopups()
}

// It closes all venue markers
function closeVenueMarkers() {
    let viewModel = ko.dataFor(document.body)
    viewModel.removeVenueMarkers()
    console.log(123)
}

