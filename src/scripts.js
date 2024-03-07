import { setUpListeners } from './eventListeners';
import * as gmap from './maps'
import * as vrbl from "./globalVariables"
import './css/main.scss'
import './images/turing-logo.png'
import './images/pexels-bri-schneiter-346529.jpg'
import './images/pexels-aleksandar-pasaric-325185.jpg'
import './images/pexels-engin-akyurt-1435752.jpg'
import './images/pexels-simon-berger-1323550.jpg'
import './images/pexels-aleksandar-pasaric-325185.jpg'
import './images/pexels-vincent-rivaud-2265876.jpg'
import './images/pexels-sheila-condi-731217.jpg'
import './images/pexels-max-ravier-2253821.jpg'
import './images/pexels-pixabay-38238.jpg'
import './images/pexels-cameron-casey-1157255.jpg'
import './images/pexels-symeon-ekizoglou-2105937.jpg'
import './images/compass-logo.png'
  
import * as dom from "./domUpdate"
import * as api from "./apiCalls"
  
getData(['travelers', 'destinations', 'trips'])
let promiseState
  
promiseState = {
  travelers: null,
  singleTraveler: null,
  trips: null,
  destinations: null,
  singleTravelerTrips: null,
  displayedBooking: null
}
  
let booking = {
  id: null,
  bookingID: null,
  firstName: null,
  lastName: null,
  dest: null,
  destName: null,
  destinationID: null,
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
  
vrbl.userName.value = `traveler${Math.floor(Math.random() * 50)}`


  
function readyToPost(booking, endpoint) {
  api.postData(booking, endpoint)
  getData(['trips'])
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
      gmap.getDestPins()
  
    })
    .catch(error => {
      console.error(error);
    });
  
}
setUpListeners()
  
function storeCurrentUser(user) {
  promiseState.singleTraveler = getUserInfo(user)
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
    if (trip.userID == user) {
      const flightCost = getTripCost(trip.destinationID, trip.travelers, 'flight');
      const lodgingCost = getTripCost(trip.destinationID, trip.duration, 'lodging');
      const totalCost = flightCost + lodgingCost
  
      acc.push({
        ['tripID']: trip.id,
        ['dest']: getDestination(trip.destinationID, 'name'),
        ['depDate']: trip.date,
        ['numTravelers']: trip.travelers,
        ['duration']: `${trip.duration}`,
        ['status']: trip.status,
        ['photo']: getDestination(trip.destinationID, 'photo'),
        ['flightCost']: flightCost,
        ['lodgingCost']: lodgingCost,
        ['totalCost']: totalCost
      })
    }
    return acc
  }, [])
  promiseState.singleTravelerTrips = filterTrips
  dom.showUserTab(promiseState)
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
  const destination = promiseState.destinations.filter((dst) => dst.id == dest)
  
  switch (type) {
  case 'photo':
    return destination[0].image
  
  case 'name':
    return destination[0].destination
  
  case 'flight':
    return destination[0].estimatedFlightCostPerPerson
  
  case 'lodging':
    return destination[0].estimatedLodgingCostPerDay
  }
}
  
function correctCountries() {
  let states = ['Alaska', 'Florida', 'New York', 'California', 'Puerto Rico']
  
  promiseState.destinations.forEach((dest) => {
    states.forEach((state) => {
      if (dest.destination.includes(state)) {
        let city = dest.destination.split(',')[0]
        let state = dest.destination.split(',')[1].trim()
        dest.destination = `${city} (${state}), United States`
      }
    })
  })
}

  
export {
  getUserInfo,
  promiseState,
  updateUserTrips,
  storeCurrentUser,
  getDestination,
  booking,
  postBooking,
  readyToPost,
  getData
}