/*
    ICS 128 Term Project: Map Builder
    Natalie Perelygin
*/

class MapBuilder {
    constructor(maplocations, items) {
        this._locations = maplocations;
        this._assets = items;
    }

    get locations() {
        return this._locations;
    }

    set locations(x) {
        this._locations = x;
    }

    get assets() {
        return this._assets;
    }

    set assets(x) {
        this._assets = x;
    }

    // Load the MapBuilder
    async LoadMapBuilder() {
        try {
            let itemResponse = await fetch('https://natalie.json.compsci.cc/items');
            let locationResponse = await fetch('https://natalie.json.compsci.cc/locations');
            if (itemResponse.status === 200 && locationResponse.status === 200) {
                this.locations = await locationResponse.json();
                this.assets = await itemResponse.json();
                console.log("Map data loaded");
            }
        } catch(e) {
            console.log("Map data could not be loaded");
        }
    }
}

let myMap = new MapBuilder();

$("#load-map").on("click", myMap.LoadMapBuilder);

$("#map-container").on("dragover", (event) => {
    event.preventDefault();
});

$(".marker").on("dragstart", (event) => {
    event.dataTransfer.setData("text", event.target.id);
});


$("#map-container").on("drop", (event) => {
    event.preventDefault();
    console.log(event.dataTransfer.getData("text"));
})