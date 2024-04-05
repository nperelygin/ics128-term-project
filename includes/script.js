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
        let itemType = $("#location-type").prop("value");
        let item = {
                location_type: itemType,
                cell: "B6"
        };
            
        this.locations.push(item);
        
    }
        
}

// Instantiate a new MapBuilder object
let myMap = new MapBuilder();

// Function that reloads the map
const reloadMap = () => {
    $("#map-container").children().html("");

    for (let i = 0; i < myMap.locations.length; i++) {
        let cellName = myMap.locations[i].cell;
        let cellContent = myMap.locations[i].location_type;
        // $(`#${cellName}`).append(`<img id='tile-${i}' class='tile' src='includes/images/${cellContent}.png' >`);
        $(`#${cellName}`).append(`<div id='tile-${i}' class='tile' draggable="true" style="background-image: url('includes/images/${cellContent}.png');"></div>`)

        // Make the newly created tile draggable
        document.querySelector(`#tile-${i}`).addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", event.target.id);
        })
    }

    for (let k = 0; k < myMap.assets.length; k++) {
        let cellName = myMap.assets[k].cell;
        // let cellContent = myMap.assets[k].item_name + " " + myMap.assets[k].item_color;
        let cellContent = `<div id='marker-${k}' class="marker ${myMap.assets[k].item_color}" draggable="true"></div>`;
        $(`#${cellName}`).append(cellContent);

        // Make the new marker draggable
        document.querySelector(`#marker-${k}`).addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", event.target.id);
        })
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
});

$("#add-item-form").on("submit", (event) => {
    event.preventDefault();
    myMap.addItem();
    reloadMap();
});

// Make the map cells droppable elements
let mapCells = document.querySelectorAll(".map-cell");

for (let i = 0; i < mapCells.length; i++) {
    mapCells[i].addEventListener("dragover", (event) => {
        event.preventDefault();

    })
}

for (let k = 0; k < mapCells.length; k++) {
    mapCells[k].addEventListener("drop", (event) => {
        event.preventDefault();
        let tile = event.dataTransfer.getData("text/plain");
        event.target.appendChild(document.querySelector(`#${tile}`));

        // Extract the numerical index from the id of the thing that was dragged
        let re = /\d+/g;
        let targetID = re.exec(tile);

        let isLocation = /tile/g; // Check if it is a location or an item

        if (isLocation.test(tile)) {
            // Update the JS object of the locations to the new cell
            myMap.locations[targetID].cell = document.querySelector(`#${tile}`).parentElement.id;
        } else {
            // Update the JS object of the items to the new cell
            myMap.assets[targetID].cell = document.querySelector(`#${tile}`).parentElement.id;
        }
        
    })
}