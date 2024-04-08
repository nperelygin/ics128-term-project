/*
    ICS 128 Term Project: Map Builder
    Natalie Perelygin
*/

// Ensures that a name was entered for each item
let validateItem = (item) => {
    let re = /\S/;

    if (re.test(item)) {
        return true;
    } else {
        return false;
    }
}

// Class definition for MapBuilder objects
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
            $("#feedback").html("Loading map data...");
            $("#feedback").fadeIn();

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
                $("#feedback").fadeOut(1000);
                reloadMap();
            }
        } catch(e) {
            $("#feedback").html("Map data could not be loaded. Try again later!");
        }
    }

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

// Drag and drop functions
// Get the id of the element being dragged
let startDrag = (event) => {
    event.dataTransfer.setData("text/plain", event.target.id);
};

// When dropped, get the id of the dragged element, and append it to the element it has been dropped on
let afterDrop = (event) => {
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
};

// Function that reloads the map
const reloadMap = () => {
    $("#map-container").children().html("");

    for (let i = 0; i < myMap.locations.length; i++) {
        let cellName = myMap.locations[i].cell;
        let cellContent = myMap.locations[i].location_type;
        // $(`#${cellName}`).append(`<img id='tile-${i}' class='tile' src='includes/images/${cellContent}.png' >`);
        $(`#${cellName}`).append(`<div id='tile-${i}' class='tile' draggable="true" style="background-image: url('includes/images/${cellContent}.png');"></div>`)

        // Make the newly created tile draggable
        document.querySelector(`#tile-${i}`).addEventListener("dragstart", startDrag);

        document.querySelector(`#tile-${i}`).addEventListener("touchmove", (event) => {
            let touch = event.targetTouches[0];
            document.querySelector(`#tile-${i}`).style.left = touch.pageX + "px";
            document.querySelector(`#tile-${i}`).style.top = touch.pageY + "px";
        });
    }

    for (let k = 0; k < myMap.assets.length; k++) {
        let cellName = myMap.assets[k].cell;
        // let cellContent = myMap.assets[k].item_name + " " + myMap.assets[k].item_color;
        let cellContent = `<div id='marker-${k}' class="marker ${myMap.assets[k].item_color}" draggable="true"></div>`;
        $(`#${cellName}`).append(cellContent);

        // Make the new marker draggable
        document.querySelector(`#marker-${k}`).addEventListener("dragstart", startDrag);
    }
}

const saveMap = async () => {
    // Save the locations data
    for(let i = 0; i < myMap.locations.length; i++) {
            try {
                // Check if the record already exists
                let itemID = i + 1;
                let responseURL = "https://natalie.json.compsci.cc/locations/" + itemID.toString();
                let response = await fetch(responseURL, {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-Type":"application/json",
                    },
                });
               
                if (response.status === 200) {
                    // Update the existing record using PUT
                    await fetch(responseURL, {
                        method: "PUT",
                        mode: "cors",
                        headers: {
                            "Content-Type":"application/json",
                        },
                        body: JSON.stringify(myMap.locations[i]),
                    });

                } else {
                    // Otherwise, add a new record with post
                    await fetch("https://natalie.json.compsci.cc/locations", {
                        method: "POST",
                        mode: "cors",
                        headers: {
                            "Content-Type":"application/json",
                        },
                        body: JSON.stringify(myMap.locations[i]),
                    });
                }

                $("#feedback").html("Map successfully saved!");
                $("#feedback").fadeIn(200);
                $("#feedback").fadeOut(1000);
                 
            } catch(error) {
                $("#feedback").html("Error in saving data, please try again later");
                $("#feedback").fadeIn();
            }
    }

    // Save the items/assets data
    for (let k = 0; k < myMap.assets.length; k++) {
        try {
            // Check if the record already exists
            let itemID = k + 1;
            let responseURL = "https://natalie.json.compsci.cc/items/" + itemID.toString();
            let response = await fetch(responseURL, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type":"application/json",
                },
            });
           
            if (response.status === 200) {
                // Update the existing record using PUT
                await fetch(responseURL, {
                    method: "PUT",
                    mode: "cors",
                    headers: {
                        "Content-Type":"application/json",
                    },
                    body: JSON.stringify(myMap.assets[k]),
                });

            } else {
                // Otherwise, add a new record with post
                await fetch("https://natalie.json.compsci.cc/items", {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type":"application/json",
                    },
                    body: JSON.stringify(myMap.assets[k]),
                });
            }

            $("#feedback").html("Map successfully saved!");
            $("#feedback").fadeIn(200);
            $("#feedback").fadeOut(1000);
             
        } catch(error) {
            $("#feedback").html("Error in saving data, please try again later");
            $("#feedback").fadeIn();
        }
    }
}

// Clear the map of all its data
const purgeMap = async () => {
    // Clear the locations data
    for (i = 0; i < myMap.locations.length; i++) {
        let itemID = i + 1;
        let responseURL = "https://natalie.json.compsci.cc/locations/" + itemID.toString();

        try {
            // Check if the location exists
            let response = await fetch(responseURL, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type":"application/json",
                },
            });

            // If it does, delete it
            if (response.status === 200) {
                await fetch(responseURL, {
                    method: "DELETE",
                    mode: "cors",
                    headers: {
                        "Content-Type":"application/json",
                    },
                });
            }
        } catch (error) {
            $("#feedback").html("Map data could not be deleted, please try again later");
            $("#feedback").fadeIn();
        }
        
    }

    for (k = 0; k < myMap.assets.length; k++) {
        let itemID = k + 1;
        let responseURL = "https://natalie.json.compsci.cc/items/" + itemID.toString();

        try {
            // Check if the location exists
            let response = await fetch(responseURL, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type":"application/json",
                },
            });

            // If it does, delete it
            if (response.status === 200) {
                await fetch(responseURL, {
                    method: "DELETE",
                    mode: "cors",
                    headers: {
                        "Content-Type":"application/json",
                    },
                });
            }
        } catch(error) {
            $("#feedback").html("Map data could not be deleted, please try again later");
            $("#feedback").fadeIn();
        }
    }

    // Refresh the page
    location.reload();

}

// Display the data in the MapBuilder object when clicked
$("#load-map").on("click", reloadMap);

// Save the map data when the button is clicked
$("#save-map").on("click", saveMap);

// Purge the map of all its data when the button is clicked
$("#clear-map").on("click", purgeMap);

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
        // Allow the map cells to be dropped
        event.preventDefault();
    });
}

for (let k = 0; k < mapCells.length; k++) {
    mapCells[k].addEventListener("drop", afterDrop);
}
