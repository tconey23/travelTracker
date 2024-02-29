import { fetchData } from './APICalls';
import { dataDump } from './globalVariables';
import { updateDOM } from './domUpdate'
import { setUpListeners } from './eventListeners';
import * as vrbl from "./globalVariables"
// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

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
        console.log(promiseState)

    }

    function updateUserTrips(user) {
        const filterTrips = promiseState.trips.reduce((acc, trip) => {
            if(trip.userID == user){
                acc.push({
                    ['tripID']: trip.id,
                    ['dest']: getDestination(trip.destinationID, 'name'),
                    ['date']: trip.date,
                    ['numTravelers']: trip.travelers,
                    ['duration']: `${trip.duration} Day(s)`,
                    ['status']: trip.status,
                    ['photo']: getDestination(trip.destinationID, 'photo'),
                    ['suggActivities']: promiseState.currentUser.travelerType
                })
            }
            return acc
        }, [])
        console.log(promiseState)
        promiseState.currentUserTrips = filterTrips
        return filterTrips
    }

    function updateUserSpent(user) {
        const filterCost = promiseState.trips.reduce((acc, trip) => {
            if(trip.userID == user){
                acc.push(trip)
            }
            return acc
        }, [])
        
        promiseState.currentUserSpend = filterCost
    }

    function getUserInfo(user) {
        console.log(user)
        const currentUser = promiseState.travelers.find((trav) => trav.id == user)
        console.log(currentUser)
        return currentUser
    }

    function getDestination(dest, type) {
        const destination = promiseState.destinations.filter((dst) => dst.id == dest )

        switch (type) {
            case 'photo': return destination[0].image
            break;

            case 'name': return destination[0].destination
            break;
        }
    }




export {
    promiseState,
    updateUserTrips,
    updateUserSpent,
    storeCurrentUser,
}



    
