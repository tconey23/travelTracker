import { Loader } from "@googlemaps/js-api-loader"
import * as dom from './domUpdate'
import * as script from './scripts'
import * as evt from './eventListeners'
import * as vrbl from './globalVariables'

//AIzaSyBtbEun6JAJ82Jw8QoQ8qSIT_4EzDX6gIw

function initMap(destinations) {
    
    
    const loader = new Loader({
        apiKey: "AIzaSyBtbEun6JAJ82Jw8QoQ8qSIT_4EzDX6gIw",
        version: "weekly",
        // ...additionalOptions,
      });
      
      loader.load().then(async () => {
        const { Map } = await google.maps.importLibrary("maps");
      
       let map = new Map(document.getElementById("map"), {
          center: { lat: 0, lng: 3},
          zoom: 2,
          gestureHandling: "cooperative" // or "none" if you want to completely disable scrolling
        });
      

        // Array of locations (latitude and longitude)
        var locations = destinations

        var infoWindow = new google.maps.InfoWindow();

        // Loop through locations and add a marker for each one
        locations.forEach(function(location) {
            var marker = new google.maps.Marker({
                position: location,
                map: map
            });

marker.addListener('click', function() {
        // Construct HTML content for the info window
        var content = '<div id="infoWindowContent">' +
                        '<h3>' + location.name + '</h3>' +
                        '<p>Would you like to book a new trip to</p>' +
                        '<p>' + location.name + '?</p>' +
                        '<button id="makeBooking">Yes!</button>' +
                        '<br>'+
                        '<br>'+
                        '<button id="' + location.name + '"class="moreInfo">More Info</button>'
                      '</div>';

        // Set the content of the info window
        infoWindow.setContent(content);

        // Open the info window at the marker's position
        infoWindow.open(map, marker);
        evt.secondaryListeners()
    });

        });
    });
}

function getDestPins() {


// Sample array of destination names
const destinationNames = script.promiseState.destinations.map((dest) => dest.destination)

// Function to fetch latitude and longitude for a destination name
async function fetchLatLng(destinationName) {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destinationName)}&key=AIzaSyBtbEun6JAJ82Jw8QoQ8qSIT_4EzDX6gIw`);
        const data = await response.json();
        if (data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return { name: destinationName, lat: location.lat, lng: location.lng };
        } else {
            console.error(`No results found for destination: ${destinationName}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching data for destination: ${destinationName}`, error);
        return null;
    }
}

// Function to fetch latitude and longitude for all destination names
async function fetchAllLatLng(destinationNames) {
    const locations = [];
    for (const destinationName of destinationNames) {
        const location = await fetchLatLng(destinationName);
        if (location) {
            locations.push(location);
        }
    }
    return locations;
}

// Usage example
fetchAllLatLng(destinationNames)
    .then(locations => {
        initMap(locations)
    })
    .catch(error => console.error("Error fetching locations:", error));

}

  export {
    getDestPins,
    initMap
  }