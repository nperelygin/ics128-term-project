/*
    ICS 128 Term Project: Map Builder
    Natalie Perelygin
*/

let validateItem = (item) => {
    let re = /\S/;

    if (re.test(item)) {
        return true;
    } else {
        return false;
    }
}

class MapBuilder {
    constructor() {
        this.LoadMapBuilder();
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
            let itemResponse = await fetch('https://natalie.json.compsci.cc/items', {
                method: "GET",
                mode: "cors",
                cache: "default",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            let locationResponse = await fetch('https://natalie.json.compsci.cc/locations', {
                method: "GET",
                mode: "cors",
                cache: "default",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (itemResponse.status === 200 && locationResponse.status === 200) {
                this.locations = await locationResponse.json();
                this.assets = await itemResponse.json();
                $("#feedback").html("Map data ready to use");
                $("#feedback").show();
                
            }
        } catch(e) {
            $("#feedback").html("Map data could not be loaded. Try again later!");
            $("#feedback").show();
        }
    }

    // Save the MapBuilder
    // NOT WORKING YET
    /* async SaveMap() {
        try {
            const locationResponse = await fetch("https://natalie.json.compsci.cc/locations", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(this.locations),
            });

            const result = await locationResponse.json();
            console.log("Success", result);

            const itemResponse = await fetch("https://natalie.json.compsci.cc/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.assets),
            });

            const result2 = await itemResponse.json();
            console.log("Success", result2);

        } catch (e) {
            console.log("Error in saving data");
        }
    }

    // Clear the map and its data
    async ClearMap() {
        
    } */

    addItem() {
        let itemName = $("#item-name").prop("value");
        let itemColor = $("#item-color").prop("value");

        if (validateItem(itemName)) {
            let item = {
                item_name: itemName,
                item_color: itemColor
            };

            this.assets.push(item);
        }
    }

    addLocation() {
        let itemName = $("#location-name").prop("value");
        let itemType = $("#location-type").prop("value");

        if (validateItem(itemName)) {
            let item = {
                location_name: itemName,
                location_type: itemType
            };
            
            this.locations.push(item);
        }
    }
        
}

// Instantiate a new MapBuilder object
let myMap = new MapBuilder();

// Display the data in the MapBuilder object when clicked
$("#load-map").on("click", () => {
    $("#map-container").html("");

    for (let i = 0; i < myMap.locations.length; i++) {
        for (let key in myMap.locations[i]) {
            document.querySelector("#map-container").innerHTML += `${key}: ${myMap.locations[i][key]}`;
        }
    }
});

// Show/hide the form to add a new item/asset
$("#add-item").on("click", () => {
    // myMap.assets.push({asset_name: "some asset", asset_color:"red"});
    $("#add-item-form").toggle();
    $("#add-location-form").hide();
});

// Show/hide the form to add a new location
$("#add-location").on("click", () => {
    // myMap.locations.push({location_name: "some location", location_type: "some type"});
    $("#add-location-form").toggle();
    $("#add-item-form").hide();
});