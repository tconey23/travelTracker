import {promiseState} from '../test/sample-test'

function getUserInfo(user) {
    const currentUser = promiseState.travelers.find((trav) => trav.id == user)
    return currentUser
}

function storeCurrentUser(user) {
    promiseState.singleTraveler = getUserInfo(user)
    return promiseState.singleTraveler.name
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
        return filterTrips
    }

    function getTripCost(dest, mult, type) {
        const costAmount = getDestination(dest, type)
        return costAmount * mult
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

    return promiseState.destinations
}



export {
    getUserInfo,
    getDestination,
    storeCurrentUser,
    getTripCost,
    updateUserTrips,
    correctCountries
}