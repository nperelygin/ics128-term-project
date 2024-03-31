/*
    ICS 128 Term Project: Map Builder
    Natalie Perelygin
*/

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

    async SaveMap() {
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

    async ClearMap() {
        
    }

        
}

let myMap = new MapBuilder();

$("#load-map").on("click", () => {
    for (let i = 0; i < myMap.locations.length; i++) {
        document.querySelector("#map-container").innerHTML += `${i} ${myMap.locations[i]}`;
    }
})