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
                this._locations = await locationResponse.json();
                this._assets = await itemResponse.json();
                console.log("Map data loaded");
            }
        } catch(e) {
            console.log("Map data could not be loaded");
        }
    }

    // Save the MapBuilder

    async SaveMap() {
        try {
            const locationResponse = await fetch("https://natalie.json.compsci.cc/locations", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(this._locations),
            });

            const result = await locationResponse.json();
            console.log("Success", result);

            const itemResponse = await fetch("https://natalie.json.compsci.cc/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this._assets),
            });

            const result2 = await itemResponse.json();
            console.log("Success", result2);

        } catch (e) {
            console.log("Error in saving data");
        }
    }

    async ClearMap() {
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

            let locations = locationResponse.json();
            console.log(locations);
            let items = itemResponse.json();

            for (let i = 1; i < locations.length; i++) {
                await fetch(`https://natalie.json.compsci.cc/locations/${i}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type":"appplication/json",
                    }
              });
            }
            
            for (let j = 1; j < items.length; j++) {
                await fetch(`https://natalie.json.compsci.cc/items/${i}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type":"appplication/json",
                    }
                });
            }

            console.log("Deleted");
        } catch (e) {
            console.log("could not delete data");
        }
    }
}

let myMap = new MapBuilder();

$("#load-map").on("click", myMap.LoadMapBuilder);
$("#load-map").on("click", () => {
    for (key in myMap) {
        $("#map-container").append(key);
    }
})

$("#save-map").on("click", myMap.SaveMap);

$("#clear-map").on("click", myMap.ClearMap);