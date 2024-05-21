
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json(url).then(function(item){
    createFeatures(item.features) //read GeoJSON structure
})

function createFeatures(earthquakeData) {

    function getColor(magnitude) {
        // Define color based on the magnitude
        if (magnitude > 5) return "#ff0000";
        else if (magnitude > 4) return "#ff6600";
        else if (magnitude > 3) return "#ffcc00";
        else if (magnitude > 2) return "#ccff33";
        else return "#33ff33";
    }

    // GeoJSON optional
    function onEachFeatureFn(feature, layer) {
        // Binds a popup with place and time
        layer.bindPopup(`<h3>${feature.properties.place}</h3><h3>${new Date(feature.properties.time)}</h3>`);
    }

    // GeoJSON optional
    function circleMarkerFn(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: feature.properties.mag * 5, 
            fillColor: getColor(feature.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
        });
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: circleMarkerFn,
        onEachFeature: onEachFeatureFn
    });

    createMap(earthquakes); 
}




function createMap(earthquakes) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });


    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo,
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes //argument
    };
  
    // Create our map
    let usa = L.map("map", {
      center: [
        47.165596, -116.630859
      ],
      zoom: 4,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(usa);


     // Add legend to the map
     let legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        const title = "Earthquake Depths in km"; // Define the title text
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = [
            "#33ff33", 
            "#ccff33", 
            "#ffcc00", 
            "#ee9c00",
            "#ff6600", 
            "#ff0000",
        ];
        // Add title to the legend
        div.innerHTML = `<h4>${title}</h4>`;
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                `<li style="background: ${colors[i]}"></li> ` +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    legend.addTo(usa);


    // Find lat lng function onclick
    function onMapClick(e) {
        L.popup()
         .setLatLng(e.latlng)
         .setContent(e.latlng.toString())
         .openOn(usa);
    }
    
    usa.on('click', onMapClick);
  }


