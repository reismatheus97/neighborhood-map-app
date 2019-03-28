var MapViewModel = function () {
    var self = this;
    self.numberOfMarkers = ko.observable(0);
    self.markers = ko.observableArray();
    self.filterQuery = ko.observable();
    self.filteredElements = ko.observableArray();

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

    self.addMarker = function (marker) {
        self.markers.push(marker);
        self.numberOfMarkers(self.numberOfMarkers() + 1);
    }

};

ko.applyBindings(new MapViewModel());