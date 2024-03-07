import chai from 'chai';
import { getUserInfo, getDestination, storeCurrentUser, updateUserTrips, correctCountries} from '../test/test-functions'
const expect = chai.expect;
export { promiseState }
let promiseState;

describe('User data gathering', function() {
  this.beforeEach(() => {
    promiseState = {
      trips: [
        {
          id: 41,
          userID: 27,
          destinationID: 12,
          travelers: 10,
          date: '2024/03/02',
          duration: 9,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 19,
          userID: 22,
          destinationID: 21,
          travelers: 7,
          date: '2024/07/23',
          duration: 11,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 2,
          userID: 28,
          destinationID: 24,
          travelers: 1,
          date: '2024/03/01',
          duration: 10,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 38,
          userID: 27,
          destinationID: 7,
          travelers: 9,
          date: '2024/12/14',
          duration: 2,
          status: 'pending',
          suggestedActivities: []
        },
      ],
      travelers: [
        {id: 1, name: 'Ham Leadbeater', travelerType: 'relaxer'},
        {id: 2, name: 'Rachael Vaughten', travelerType: 'thrill-seeker'},
        {id: 3, name: 'Sibby Dawidowitsch', travelerType: 'shopper'},
        {id: 4, name: 'Leila Thebeaud', travelerType: 'photographer'},
        {id: 5, name: 'Tiffy Grout', travelerType: 'thrill-seeker'},
        {id: 6, name: 'Laverna Flawith', travelerType: 'shopper'},
        {id: 7, name: 'Emmet Sandham', travelerType: 'relaxer'},
        {id: 8, name: "Carlin O'Reilly", travelerType: 'history buff'},
        {id: 9, name: 'Natalee Deegin', travelerType: 'relaxer'},
        {id: 10, name: 'Rickie Jodlowski', travelerType: 'relaxer'}
      ],
      singleTraveler: null,
      singleTravelerTrips: null,
      destinations: [
        {id: 1, destination: 'Lima, Peru', estimatedLodgingCostPerDay: 70, estimatedFlightCostPerPerson: 400, },
        {id: 2, destination: 'Stockholm, Sweden', estimatedLodgingCostPerDay: 100, estimatedFlightCostPerPerson: 780},
        {id: 12, destination: 'Sydney, Austrailia', estimatedLodgingCostPerDay: 130, estimatedFlightCostPerPerson: 950},
        {id: 7, destination: 'Cartagena, Colombia', estimatedLodgingCostPerDay: 65, estimatedFlightCostPerPerson: 350}
      ]
    }
  });

  it('should taken in a traveler ID and return a user object', () => {
    const user = getUserInfo(9);
    expect(user).to.be.an('object');
  });

  it('should only return the correct data for the given user', () => {
    const user = getUserInfo(9);
    expect(user).to.deep.equal({id: 9, name: 'Natalee Deegin', travelerType: 'relaxer'})
  });

  it('should return the user name when stored in the promiseState Object', () => {
    const currentUser = storeCurrentUser(8)
    expect(currentUser).to.equal("Carlin O'Reilly")
  });

  it('should store the entire user object as the singleTraveler', () => {
    const currentUser = storeCurrentUser(8)
    expect(currentUser).to.equal("Carlin O'Reilly")
    expect(promiseState.singleTraveler).to.deep.equal({id: 8, name: "Carlin O'Reilly", travelerType: 'history buff'})
  });
});

describe('Trip data gathering', function() {
  this.beforeEach(() => {
    promiseState = {
      trips: [
        {
          id: 41,
          userID: 27,
          destinationID: 12,
          travelers: 10,
          date: '2024/03/02',
          duration: 9,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 19,
          userID: 22,
          destinationID: 21,
          travelers: 7,
          date: '2024/07/23',
          duration: 11,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 2,
          userID: 28,
          destinationID: 24,
          travelers: 1,
          date: '2024/03/01',
          duration: 10,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 38,
          userID: 27,
          destinationID: 7,
          travelers: 9,
          date: '2024/12/14',
          duration: 2,
          status: 'pending',
          suggestedActivities: []
        },
      ],
      travelers: [
        {id: 1, name: 'Ham Leadbeater', travelerType: 'relaxer'},
        {id: 2, name: 'Rachael Vaughten', travelerType: 'thrill-seeker'},
        {id: 3, name: 'Sibby Dawidowitsch', travelerType: 'shopper'},
        {id: 4, name: 'Leila Thebeaud', travelerType: 'photographer'},
        {id: 5, name: 'Tiffy Grout', travelerType: 'thrill-seeker'},
        {id: 6, name: 'Laverna Flawith', travelerType: 'shopper'},
        {id: 7, name: 'Emmet Sandham', travelerType: 'relaxer'},
        {id: 8, name: "Carlin O'Reilly", travelerType: 'history buff'},
        {id: 9, name: 'Natalee Deegin', travelerType: 'relaxer'},
        {id: 10, name: 'Rickie Jodlowski', travelerType: 'relaxer'}
      ],
      singleTraveler: null,
      singleTravelerTrips: null,
      destinations: [
        {id: 1, destination: 'Lima, Peru', estimatedLodgingCostPerDay: 70, estimatedFlightCostPerPerson: 400, },
        {id: 2, destination: 'Stockholm, Sweden', estimatedLodgingCostPerDay: 100, estimatedFlightCostPerPerson: 780},
        {id: 12, destination: 'Sydney, Austrailia', estimatedLodgingCostPerDay: 130, estimatedFlightCostPerPerson: 950},
        {id: 7, destination: 'Cartagena, Colombia', estimatedLodgingCostPerDay: 65, estimatedFlightCostPerPerson: 350}
      ]
    }
  });
  it('should update a users trips to the promiseState object', () => {
    const currentUserTrips = updateUserTrips(27)
    expect(currentUserTrips.length).to.be.above(0)
  });

  it('Should add all of the users trips to the promiseState object', () => {
    const currentUserTrips = updateUserTrips(27)
    expect(currentUserTrips.length).to.equal(2)
  });

  it('Should include a trip ID and destination', () => {
    const currentUserTrips = updateUserTrips(27)
    expect(currentUserTrips[0].tripID).to.equal(41)
    expect(currentUserTrips[1].tripID).to.equal(38)

    expect(currentUserTrips[0].dest).to.equal('Sydney, Austrailia')
    expect(currentUserTrips[1].dest).to.equal('Cartagena, Colombia')
  });

  it('Should include a number of travelers and duration', () => {
    const currentUserTrips = updateUserTrips(27)
    expect(currentUserTrips[0].numTravelers).to.equal(10)
    expect(currentUserTrips[1].numTravelers).to.equal(9)

    expect(currentUserTrips[0].duration).to.equal('9')
    expect(currentUserTrips[1].duration).to.equal('2')
  });


});


describe('Trip cost', function() {
  this.beforeEach(() => {
    promiseState = {
      trips: [
        {
          id: 41,
          userID: 27,
          destinationID: 12,
          travelers: 10,
          date: '2024/03/02',
          duration: 9,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 19,
          userID: 22,
          destinationID: 21,
          travelers: 7,
          date: '2024/07/23',
          duration: 11,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 2,
          userID: 28,
          destinationID: 24,
          travelers: 1,
          date: '2024/03/01',
          duration: 10,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 38,
          userID: 27,
          destinationID: 7,
          travelers: 9,
          date: '2024/12/14',
          duration: 2,
          status: 'pending',
          suggestedActivities: []
        },
      ],
      travelers: [
        {id: 1, name: 'Ham Leadbeater', travelerType: 'relaxer'},
        {id: 2, name: 'Rachael Vaughten', travelerType: 'thrill-seeker'},
        {id: 3, name: 'Sibby Dawidowitsch', travelerType: 'shopper'},
        {id: 4, name: 'Leila Thebeaud', travelerType: 'photographer'},
        {id: 5, name: 'Tiffy Grout', travelerType: 'thrill-seeker'},
        {id: 6, name: 'Laverna Flawith', travelerType: 'shopper'},
        {id: 7, name: 'Emmet Sandham', travelerType: 'relaxer'},
        {id: 8, name: "Carlin O'Reilly", travelerType: 'history buff'},
        {id: 9, name: 'Natalee Deegin', travelerType: 'relaxer'},
        {id: 10, name: 'Rickie Jodlowski', travelerType: 'relaxer'}
      ],
      singleTraveler: null,
      singleTravelerTrips: null,
      destinations: [
        {id: 1, destination: 'Lima, Peru', estimatedLodgingCostPerDay: 70, estimatedFlightCostPerPerson: 400, },
        {id: 2, destination: 'Stockholm, Sweden', estimatedLodgingCostPerDay: 100, estimatedFlightCostPerPerson: 780},
        {id: 12, destination: 'Sydney, Austrailia', estimatedLodgingCostPerDay: 130, estimatedFlightCostPerPerson: 950},
        {id: 7, destination: 'Cartagena, Colombia', estimatedLodgingCostPerDay: 65, estimatedFlightCostPerPerson: 350}
      ]
    }
  });

  it('Should return flight cost per trip', () => {
    const currentUserTrips = updateUserTrips(27)
    expect(currentUserTrips[0].flightCost).to.equal(9500)
    expect(currentUserTrips[1].flightCost).to.equal(3150)
  });

  it('Should return lodging cost per trip', () => {
    const currentUserTrips = updateUserTrips(27)
    expect(currentUserTrips[0].lodgingCost).to.equal(1170)
    expect(currentUserTrips[1].lodgingCost).to.equal(130)
  });

  it('Should return total cost per trip', () => {
    const currentUserTrips = updateUserTrips(27)
    expect(currentUserTrips[0].totalCost).to.equal(10670)
    expect(currentUserTrips[1].totalCost).to.equal(3280)
  });
});

describe('Destination Data', function() {
  this.beforeEach(() => {
    promiseState = {
      trips: [
        {
          id: 41,
          userID: 27,
          destinationID: 12,
          travelers: 10,
          date: '2024/03/02',
          duration: 9,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 19,
          userID: 22,
          destinationID: 21,
          travelers: 7,
          date: '2024/07/23',
          duration: 11,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 2,
          userID: 28,
          destinationID: 24,
          travelers: 1,
          date: '2024/03/01',
          duration: 10,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 38,
          userID: 27,
          destinationID: 7,
          travelers: 9,
          date: '2024/12/14',
          duration: 2,
          status: 'pending',
          suggestedActivities: []
        },
      ],
      travelers: [
        {id: 1, name: 'Ham Leadbeater', travelerType: 'relaxer'},
        {id: 2, name: 'Rachael Vaughten', travelerType: 'thrill-seeker'},
        {id: 3, name: 'Sibby Dawidowitsch', travelerType: 'shopper'},
        {id: 4, name: 'Leila Thebeaud', travelerType: 'photographer'},
        {id: 5, name: 'Tiffy Grout', travelerType: 'thrill-seeker'},
        {id: 6, name: 'Laverna Flawith', travelerType: 'shopper'},
        {id: 7, name: 'Emmet Sandham', travelerType: 'relaxer'},
        {id: 8, name: "Carlin O'Reilly", travelerType: 'history buff'},
        {id: 9, name: 'Natalee Deegin', travelerType: 'relaxer'},
        {id: 10, name: 'Rickie Jodlowski', travelerType: 'relaxer'}
      ],
      singleTraveler: null,
      singleTravelerTrips: null,
      destinations: [
        {id: 1, destination: 'Lima, Peru', estimatedLodgingCostPerDay: 70, estimatedFlightCostPerPerson: 400, },
        {id: 2, destination: 'Stockholm, Sweden', estimatedLodgingCostPerDay: 100, estimatedFlightCostPerPerson: 780},
        {id: 12, destination: 'Sydney, Austrailia', estimatedLodgingCostPerDay: 130, estimatedFlightCostPerPerson: 950},
        {id: 7, destination: 'Cartagena, Colombia', estimatedLodgingCostPerDay: 65, estimatedFlightCostPerPerson: 350}
      ]
    }
  });

  it('Should take in a destination ID and type and return the requested data (destination name)', () => {
    const destData = getDestination(12, 'name')
    expect(destData).to.equal('Sydney, Austrailia')
  });

  it('Should take in a destination ID and type and return the requested data (flight cost)', () => {
    const destData = getDestination(12, 'flight')
    expect(destData).to.equal(950)
  });

  it('Should take in a destination ID and type and return the requested data (lodging cost)', () => {
    const destData = getDestination(12, 'lodging')
    expect(destData).to.equal(130)
  });
});

describe('Split city/state/country', function() {
  this.beforeEach(() => {
    promiseState = {
      destinations: [
        {id: 1, destination: 'Anchorage, Alaska', estimatedLodgingCostPerDay: 70, estimatedFlightCostPerPerson: 400, },
        {id: 2, destination: 'Miami, Florida', estimatedLodgingCostPerDay: 100, estimatedFlightCostPerPerson: 780},
        {id: 12, destination: 'New York, New York', estimatedLodgingCostPerDay: 130, estimatedFlightCostPerPerson: 950},
        {id: 7, destination: 'San Juan, Puerto Rico', estimatedLodgingCostPerDay: 65, estimatedFlightCostPerPerson: 350},
        {id: 10, destination: 'San Francisco, California', estimatedLodgingCostPerDay: 65, estimatedFlightCostPerPerson: 350}
      ]
    }
  });

  it('Should find destinations in the US and return the corrected destination format for US', () => {
    const correctedCountries = correctCountries()
    expect(correctedCountries[0].destination).to.equal('Anchorage (Alaska), United States')
    expect(correctedCountries[1].destination).to.equal('Miami (Florida), United States')
  });
});

