var MapViewModel = function () {
    var self = this
    self.numberOfMarkers = ko.observable(0)
    self.markers = ko.observableArray()
    self.filterQuery = ko.observable()
    self.filteredElements = ko.observableArray()
    self.venueMarkers = ko.observableArray()
    self.activeMarker = ko.observable()
    self.markersMode = ko.observable(true)
    self.origin = ko.observable()
    self.destination = ko.observable()
    self.travelProfile = ko.observable("driving")
    self.isDrawerOpen = ko.observable(true)
    self.popups = ko.observableArray()
    self.numberOfPopupsOpen = ko.observable(0)

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

    self.hasAnyPopupOpen = ko.computed(function () {
        return !!self.numberOfPopupsOpen()
    }, self);

    self.addVenueMarker = function (venueMarker) {
        self.venueMarkers.push(venueMarker);
    }

    self.removeVenueMarkers = function () {
        self.venueMarkers().map(it => it.venueMarkerMapBox.remove())
        self.venueMarkers.removeAll();
    }

    self.addPopups = function (popup) {
        self.popups.push(popup);
        self.numberOfPopupsOpen(self.numberOfPopupsOpen() + 1);
    }

    self.closePopup = function () {
        self.numberOfPopupsOpen(self.numberOfPopupsOpen() - 1);
    }

    self.removePopups = function () {
        self.popups().map(it => it.remove())
        self.popups.removeAll()
        self.numberOfPopupsOpen(0);
    }

    self.addMarker = function (marker) {
        self.markers.push(marker);
        self.numberOfMarkers(self.numberOfMarkers() + 1);
    }

};

ko.applyBindings(new MapViewModel());