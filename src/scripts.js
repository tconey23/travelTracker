import { updateDOM } from './domUpdate'
import { setUpListeners } from './eventListeners';
import * as vrbl from "./globalVariables"
// import './css/styles.css';
import './css/main.scss'
import './images/turing-logo.png'
import './images/pexels-bri-schneiter-346529.jpg'
import * as dom from "./domUpdate"
import * as api from "./apiCalls"
import { addDays } from "date-fns";

getData(['travelers', 'destinations', 'trips'])
let promiseState

promiseState = {
    travelers: null,
    singleTraveler: null,
    trips: null,
    destinations: null,
    singleTravelerTrips: null,
}

let booking = {
    travelerID: null,
    bookingID: null,
    firstName: null,
    lastName: null,
    dest: null,
    destName: null,
    destID: null,
    depDate: null,
    retDate: null,
    duration: null,
    numTravelers: null,
    lodging: null,
    destFlight: null,
    destLodging: null
}

let postBooking = {
    id: null,
    userID: null,
    destinationID: null,
    travelers: null,
    date: null,
    duration: null,
    status: null,
    suggestedActivities: null
}

vrbl.userName.value = Math.floor(Math.random() * 50)

function readyToPost(booking, endpoint) {
    postData(booking, endpoint)
    getData(['trips'])
    updateDOM(promiseState.singleTravelerTrips)
}


function getData(argumentsArray) {

const promises = [];

argumentsArray.forEach(arg => {
    promises.push(api.fetchData(arg));
});


Promise.all(promises)
    .then(results => {
        updateData(results);
        correctCountries()
        
    })
    .catch(error => {
        console.error(error);
    });

}
    setUpListeners()

    function storeCurrentUser(user) {
        promiseState.singleTraveler = getUserInfo(user)
        updateDOM(promiseState.singleTravelerTrips)
        console.log(promiseState)
        return promiseState.singleTraveler.name
        }

    function updateData(data) {
        data.forEach((res) => {
          let key = Object.keys(res)
            promiseState[key] = res[key]
        })
    }

    function updateUserTrips(user) {
        const filterTrips = promiseState.trips.reduce((acc, trip) => {
            if(trip.userID == user){
                const flightCost = getTripCost(trip.destinationID, trip.travelers, 'flight');
                const lodgingCost = getTripCost(trip.destinationID, trip.duration, 'lodging');
                const totalCost = flightCost + lodgingCost

                acc.push({
                    ['tripID']: trip.id,
                    ['dest']: getDestination(trip.destinationID, 'name'),
                    ['depDate']: trip.date,
                    ['numTravelers']: trip.travelers,
                    ['duration']: `${trip.duration} Day(s)`,
                    ['status']: trip.status,
                    ['photo']: getDestination(trip.destinationID, 'photo'),
                    ['suggActivities']: promiseState.singleTraveler.travelerType,
                    ['flightCost']: flightCost,
                    ['lodgingCost']: lodgingCost,
                    ['totalCost']: totalCost
                })
            }
            return acc
        }, [])
        promiseState.singleTravelerTrips = filterTrips
        return filterTrips
    }

    function getTripCost(dest, mult, type) {
       const costAmount = getDestination(dest, type)
       return costAmount * mult
    }

    function getUserInfo(user) {
        const currentUser = promiseState.travelers.find((trav) => trav.id == user)
        return currentUser
    }

    function getDestination(dest, type) {
        const destination = promiseState.destinations.filter((dst) => dst.id == dest )

        switch (type) {
            case 'photo': return destination[0].image
            break;

            case 'name': return destination[0].destination
            break;

            case 'flight': return destination[0].estimatedFlightCostPerPerson
            break;

            case 'lodging': return destination[0].estimatedLodgingCostPerDay
            break;
        }
    }

    function correctCountries() {
        let states = ['Alaska', 'Florida', 'New York', 'California', 'Puerto Rico']

        promiseState.destinations.forEach((dest)=>{
            states.forEach((state)=> {
                if(dest.destination.includes(state)){
                    let city = dest.destination.split(',')[0]
                    let state = dest.destination.split(',')[1].trim()
                    dest.destination = `${city} (${state}), United States`
                }
            })
        })
    }

    function deleteBooking(tripID) {
        let id = tripID.split(': ')[1]
        api.deleteData(`http://localhost:3001/api/v1/trips/${id}`)
    }



export {
    promiseState,
    updateUserTrips,
    storeCurrentUser,
    getDestination,
    booking,
    postBooking,
    readyToPost,
    deleteBooking
}



    
