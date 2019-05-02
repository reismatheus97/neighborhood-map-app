var MapViewModel = function () {
    var self = this;
    self.numberOfMarkers = ko.observable(0);
    self.markers = ko.observableArray();
    self.filterQuery = ko.observable();
    self.filteredElements = ko.observableArray();
    self.venueMarkers = ko.observableArray();
    self.activeMarker = ko.observable();
    self.markersMode = ko.observable(true);
    self.directions = ko.observableArray();
    self.origin = ko.observable();
    self.destination = ko.observable();
    self.travelProfile = ko.observable("driving");
    self.isDrawerOpen = ko.observable(true);
    self.popups = ko.observableArray();

    self.addDirections = function (coordinate) {
        if (self.directions().length > 1) {
            alert("removing all directions...");
            self.directions.removeAll();
        } else {
            self.directions.push(coordinate);
        }
        
    }

    self.hasFilter = ko.computed(function() {
        let nonFilteredMarkers = []
        let filteredMarkers = []
        if (self.filterQuery()) {
            
            const filterQuery = self.filterQuery().toLowerCase();
            if (self.markers() && self.markers().length > 0) {
                const markers = self.markers();  
                markers.map(it => it.address_name.toLowerCase().includes(filterQuery) ? 
                    filteredMarkers.push(it) :
                    nonFilteredMarkers.push(it)
                );
                self.filteredElements.removeAll();
                self.filteredElements.push(...filteredMarkers);
                filteredMarkers.map(it => it.markerMapBox._element.style.display = "flex")
                nonFilteredMarkers.map(it => it.markerMapBox._element.style.display = "none")
            }
        } else {
            self.markers().map(it => it.markerMapBox._element.style.display = "flex")
            nonFilteredMarkers.map(it => it.markerMapBox._element.style.display = "flex")
        }
        return !!self.filterQuery();
    }, self);

    self.addVenueMarker = function (venueMarker) {
        self.venueMarkers.push(venueMarker);
    }

    self.addPopups = function (popup) {
        self.popups.push(popup);
    }

    self.addMarker = function (marker) {
        self.markers.push(marker);
        self.numberOfMarkers(self.numberOfMarkers() + 1);
    }

};

ko.applyBindings(new MapViewModel());