var MapViewModel = function () {
    var self = this;
    self.numberOfMarkers = ko.observable(0);
    self.markers = ko.observableArray();
    self.filterQuery = ko.observable();
    self.filteredElements = ko.observableArray();

    self.venues = ko.observableArray();

    self.markersMode = ko.observable(true);
    self.directions = ko.observableArray();
    self.origin = ko.observable();
    self.destination = ko.observable();
    self.travelProfile = ko.observable("driving");
    self.isDrawerOpen = ko.observable(true);

    self.addDirections = function (coordinate) {
        if (self.directions().length > 1) {
            alert("removing all directions...");
            self.directions.removeAll();
        } else {
            self.directions.push(coordinate);
        }
        
    }


    self.hasFilter = ko.computed(function() {
        if (self.filterQuery()) {
            const filterQuery = self.filterQuery().toLowerCase();
            if (self.markers() && self.markers().length > 0) {
                const markers = self.markers();
                let filteredMarkers = 
                    markers.filter(it => it.place_name.toLowerCase().includes(filterQuery));
                self.filteredElements.removeAll();
                self.filteredElements.push(...filteredMarkers);
            }
        }
        return !!self.filterQuery();
    }, self);

    self.addVenue = function (venue) {
        self.venues.push(venue);
        // self.numberOfVenues(self.numberOfVenues() + 1);
    }

    self.addMarker = function (marker) {
        self.markers.push(marker);
        self.numberOfMarkers(self.numberOfMarkers() + 1);
    }

};

ko.applyBindings(new MapViewModel());