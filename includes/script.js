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
                mode: "cors",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(this.locations),
            });

            const result = await locationResponse.json();
            console.log("Success", result);

            const itemResponse = await fetch("https://natalie.json.compsci.cc/items", {
                method: "POST",
                mode: "cors",
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
    } */

    // Clear the map and its data
    /*async ClearMap() {
        await fetch('https://natalie.json.compsci.cc/locations/1', {
                method: "DELETE",
                mode: "cors",
                cache: "default",
                headers: {
                    "Content-Type": "application/json",
                }
            });
    }*/

    addItem() {
        let itemName = $("#item-name").prop("value");
        let itemColor = $("#item-color").prop("value");

        if (validateItem(itemName)) {
            let item = {
                item_name: itemName,
                item_color: itemColor,
                cell: "B6"
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
                location_type: itemType,
                cell: "B6"
            };
            
            this.locations.push(item);
        }
    }
        
}

let dropItem = (event) => {
    event.preventDefault();
    event.dataTransfer.getData("text");
    

}

// Instantiate a new MapBuilder object
let myMap = new MapBuilder();

// Function that reloads the map
const reloadMap = () => {
    $("#map-container").children().html("");

    for (let i = 0; i < myMap.locations.length; i++) {
        let cellName = myMap.locations[i].cell;
        let cellContent = myMap.locations[i].location_name + " " + myMap.locations[i].location_type;
        $(`#${cellName}`).append(cellContent);
    }

    for (let k = 0; k < myMap.assets.length; k++) {
        let cellName = myMap.assets[k].cell;
        // let cellContent = myMap.assets[k].item_name + " " + myMap.assets[k].item_color;
        let cellContent = `<div class="marker ${myMap.assets[k].item_color}" draggable="true"></div>`;
        $(`#${cellName}`).append(cellContent);
    }
}

// Display the data in the MapBuilder object when clicked
$("#load-map").on("click", reloadMap);

// Show/hide the form to add a new item/asset
$("#add-item").on("click", () => {
    $("#add-item-form").toggle();
    $("#add-location-form").hide();
});

// Show/hide the form to add a new location
$("#add-location").on("click", () => {
    $("#add-location-form").toggle();
    $("#add-item-form").hide();
});

$("#add-location-form").on("submit", (event) => {
    event.preventDefault();
    myMap.addLocation();
    reloadMap();
})

$("#add-item-form").on("submit", (event) => {
    event.preventDefault();
    myMap.addItem();
    reloadMap();
})

// Allow drag and drop on the map container's children

$("#map-container").children().on("dragover", (event) => {
    event.preventDefault();
})