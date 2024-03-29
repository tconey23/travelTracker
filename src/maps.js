import { Loader } from "@googlemaps/js-api-loader"
import * as dom from './domUpdate'
import * as script from './scripts'
import * as evt from './eventListeners'
import * as vrbl from './globalVariables'
import * as api from './apiCalls'

//AIzaSyBtbEun6JAJ82Jw8QoQ8qSIT_4EzDX6gIw


async function setPins(destinations, map) {
    var locations = destinations;
    var infoWindow = new google.maps.InfoWindow();
    let progress = 0;
    let count = 0;
    
    for (const location of locations) {
        count++;
        progress = (100 / locations.length) * count;
        await updateWidth(progress);
        
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });

        marker.addListener('click', function() {
            var content = `<div id="infoWindowContent">
                            <h3>${location.name}</h3>
                            <p>Would you like to book a new trip to</p>
                            <p>${location.name}</p>
                            <button class="makeBooking" id="${location.id}">Yes!</button>
                            <br><br>
                            <button id="${location.name}" class="moreInfo">More Info</button>
                           </div>`;
            
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
            
            google.maps.event.addListenerOnce(infoWindow, 'domready', function() {
                var infoWindowContent = document.getElementById('infoWindowContent');
                
                infoWindowContent.addEventListener('click', function(event) {
                    var target = event.target;
                    if (target && target.classList.contains('makeBooking')) {
                        // Call your function here
                    } else if (target && target.classList.contains('moreInfo')) {
                        // Call your function here
                    }
                });
            });
        });
    }
}

function updateWidth(progress) {
    if(progress < 100){
    return new Promise(resolve => {
        setTimeout(() => {
            vrbl.mapModal.querySelector('.progressBar > .bar').style.width = `${progress}%`;
            resolve();
        }, 40);
    });
    } else {
        dom.dynamicCrossfade(vrbl.mapModal.querySelector('.progressBar'), vrbl.mapModal.querySelector('#map'))
    }
}

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
          gestureHandling: "cooperative" 
        });
        setPins(destinations, map)
    });
    
}

function getDestPins(destinationNames) {
    // const destinationNames = script.promiseState.destinations.map(dest => `${dest.destination}-${dest.id}`);

    async function fetchLatLng(destinationName) {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destinationName)}&key=AIzaSyBtbEun6JAJ82Jw8QoQ8qSIT_4EzDX6gIw`);
            const data = await response.json();
            if (data.results.length > 0) {
                const location = data.results[0].geometry.location;
                return { name: destinationName.split('-')[0], id: destinationName.split('-')[1], lat: location.lat, lng: location.lng };
            } else {
                console.error(`No results found for destination: ${destinationName}`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching data for destination: ${destinationName}`, error);
            return null;
        }
    }

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

    // Return the promise from fetchAllLatLng
    return fetchAllLatLng(destinationNames);
}

  export {
    getDestPins,
    initMap
  }