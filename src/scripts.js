import { fetchData, postData } from './APICalls';
import { dataDump } from './globalVariables';
import { updateDOM } from './domUpdate'
import { setUpListeners } from './eventListeners';
import * as vrbl from "./globalVariables"
// import './css/styles.css';
import './css/main.scss'
import './images/turing-logo.png'
import * as dom from "./domUpdate"
import { addDays } from "date-fns";

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

function readyToPost(booking, endpoint) {
    postData(booking, endpoint)
}




let promiseState

promiseState = {
    travelers: null,
    singleTraveler: null,
    trips: null,
    destinations: null,
    currentUser: null,
    currentUserTrips: null,
    currentUserSpend: null,
}

const argumentsArray = ['travelers', 'destinations', 'trips'];

const promises = [];

argumentsArray.forEach(arg => {
    promises.push(fetchData(arg));
});


Promise.all(promises)
    .then(results => {
        updateData(results);
        correctCountries()
        dom.updateUserInfo(25)
    })
    .catch(error => {
        console.error(error);
    });


    setUpListeners()

    function storeCurrentUser(user) {
        promiseState.currentUser = getUserInfo(user)
        updateDOM(promiseState.currentUserTrips)
        return promiseState.currentUser.name
        }

    function updateData(data) {
        data.forEach((res) => {
          let key = Object.keys(res)
            promiseState[key] = res[key]
        })

        promiseState.destinations.forEach((dest) => {
        })
        console.log(promiseState.trips.length)
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
                    ['date']: trip.date,
                    ['numTravelers']: trip.travelers,
                    ['duration']: `${trip.duration} Day(s)`,
                    ['status']: trip.status,
                    ['photo']: getDestination(trip.destinationID, 'photo'),
                    ['suggActivities']: promiseState.currentUser.travelerType,
                    ['flightCost']: flightCost,
                    ['lodgingCost']: lodgingCost,
                    ['totalCost']: totalCost
                })
            }
            return acc
        }, [])
        promiseState.currentUserTrips = filterTrips
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




export {
    promiseState,
    updateUserTrips,
    storeCurrentUser,
    getDestination,
    booking,
    postBooking,
    readyToPost
}



    
