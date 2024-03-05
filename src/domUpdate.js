
import * as vrbl from "./globalVariables"
import * as script from "./scripts"
import * as evt from "./eventListeners"
const { differenceInDays } = require('date-fns')
const { addDays, format } = require('date-fns')
// import * as map from "./map"


function updateDOM(data, type) {
}

function displayRawData() {
    vrbl.rawDataContainer.classList.toggle('hidden')
}

function userLogin() {
    if(vrbl.userName && vrbl.password.value === 'travel'){
        dynamicCrossfade(vrbl.landing, vrbl.clientOverview)
        updateUserInfo(vrbl.userName.value)
    } else {
        alert('credentials incorrect')
    }
    
}

function userDropDown(text) {
    const len = text.length
        
    document.querySelector('.userNames').innerHTML = ""
    
    if(len > 0){
        vrbl.travelers.data.forEach((traveler) => {
        let user = traveler.name.toLowerCase().slice(0, len)
            if(user === text){
                vrbl.userList.innerHTML += `<option class="user" value="Traveler${traveler.id}">${traveler.name}</option>`
            }
        })
    }
        vrbl.userList.classList.remove('hidden')

}

function selectedUser(e) {
    vrbl.userName.value = e.target.value
    vrbl.password.value = "travel"
    vrbl.userList.classList.add('hidden')
}

function updateUserInfo(user) {
    // console.log(user)
    vrbl.currUserName.innerText = script.storeCurrentUser(user)
    displayTrips(script.updateUserTrips(user))
    displayTripCost(script.updateUserTrips(user))
}


function toggleCollapsible(e) {
    if(e.target.classList.contains('totalSpent')){
        vrbl.spentList.classList.toggle('collapsed')
    } else{
        vrbl.tripList.classList.toggle('collapsed')
    }
        e.target.classList.toggle('expanded')
}

function displayTrips(data) {
    data.forEach((trip) => {
        const newLink = document.createElement('p');
        newLink.textContent = `${trip.dest} \u21d7`;
        newLink.value = trip.dest
        newLink.depDate = trip.depDate
        newLink.id = trip.tripID
        newLink.addEventListener('click', (e) => {
            showTripDetails(e.target.value, e.target.depDate, e.target.id, vrbl.tripInfo, e)
        });

        const newCell = document.createElement('td');
        newCell.appendChild(newLink);

        const dateCell = document.createElement('td');
        dateCell.textContent = trip.depDate;

        const statusCell = document.createElement('td')
        statusCell.textContent = trip.status;

        // const imgCell = document.createElement('td');
        // const img = document.createElement('img');
        // img.src = trip.photo;
        // imgCell.appendChild(img);

        const newTripElement = document.createElement('tr');
        newTripElement.appendChild(newCell);
        newTripElement.appendChild(dateCell);
        newTripElement.appendChild(statusCell);
        // newTripElement.appendChild(imgCell);

        vrbl.tripData.appendChild(newTripElement);
    });
}

let approvedSum
let pendingSum

function separateCostByType(type, trip) {
    let inputTable = document.querySelector(`.${type}`);
    const newLink = document.createElement('p');
    newLink.textContent = `${trip.dest} \u21d7`;
    newLink.value = trip.dest
    newLink.depDate = trip.depDate
    newLink.id = trip.tripID
    newLink.addEventListener('click', (e) => {
        showTripDetails(e.target.value, e.target.depDate, e.target.id, vrbl.costInfo,e)
    });

    const newCell = document.createElement('td');
    newCell.appendChild(newLink);

    const dateCell = document.createElement('td');
    dateCell.textContent = trip.depDate;

    const flightCostCell = document.createElement('td');
    flightCostCell.textContent = trip.flightCost;

    const lodgingCostCell = document.createElement('td');
    lodgingCostCell.textContent = trip.lodgingCost;

    const statusCell = document.createElement('td')
    statusCell.textContent = trip.status;

    const totalCost = (trip.flightCost + trip.lodgingCost * 1.10).toFixed(2);

    const updatedCosts = splitCost(type, pendingSum, approvedSum, totalCost);
    approvedSum = updatedCosts[1]; // Update approvedSum with the returned value
    pendingSum = updatedCosts[0]; // Update pendingSum with the returned value

    const totalCostCell = document.createElement('td');
    totalCostCell.textContent = totalCost;

    const newTripElement = document.createElement('tr');
    newTripElement.appendChild(newCell);
    newTripElement.appendChild(dateCell);
    newTripElement.appendChild(flightCostCell);
    newTripElement.appendChild(lodgingCostCell);
    newTripElement.appendChild(totalCostCell);
    newTripElement.appendChild(statusCell);

    inputTable.appendChild(newTripElement);

    vrbl.approvedCost.innerText = `Total approved cost ${approvedSum.toFixed(2)}`;
    vrbl.pendingCost.innerText = `Total pending cost ${pendingSum.toFixed(2)}`;
}

function splitCost(type, currPending, currApproved, addAmount) {
    let approvedSum = currApproved;
    let pendingSum = currPending;

    switch (type) {
        case 'approved':
            approvedSum += parseFloat(addAmount);
            break;

        case 'pending':
            pendingSum += parseFloat(addAmount);
            break;
    }


    return [pendingSum, approvedSum];
}

function displayTripCost(data) {
pendingSum = 0
approvedSum = 0

    data.forEach((trip) => {
        separateCostByType(trip.status, trip)
    })
}

function showTripDetails(trip, depDate, tripID, contName, e) {
    vrbl.tripName.innerText = trip
    vrbl.tripDate.innerText = depDate
    findTripDetails(tripID, contName)
    vrbl.tripModal.showModal()
}

function findTripDetails(tripID, contName) {
  let userTrips = script.promiseState.singleTravelerTrips
    const thisTrip = userTrips.find((trip) => trip.tripID == tripID)
    // console.log(tripID)
    Object.values(vrbl.tripModal.querySelectorAll('p')).forEach((elem) => {
        elem.innerText=""
        Object.entries(thisTrip).forEach((item) => {
            if(item[0]==elem.id){
                elem.innerText += `${item[1]}`
            }
        })
    })
}

function displayDestinations(sortBy) {
    const destinations = script.promiseState.destinations;
    const inputTable = vrbl.destList;
    clearTable(inputTable);

    destinations.forEach((dest) => {
        dest['country'] = dest.destination.split(',')[1].trim();
        dest['city'] = dest.destination.split(',')[0];
    });

    const sortedDest = getSort(destinations, sortBy)

    sortedDest.forEach((dest) => {
        let tableRow = document.createElement('tr');
        const row = setKeys(dest);
        Object.values(row).forEach((key) => {
            let tableData = document.createElement('td');
            tableData.innerText = key;
            tableData.addEventListener('click', (e) => {
                vrbl.searchDest.value = `${dest.city}`
                vrbl.destName.value = `${dest.destination}`
                vrbl.destID.value = dest.id
                vrbl.destFlight.value = `${dest.estimatedFlightCostPerPerson}`
                vrbl.destLodging.value = `${dest.estimatedLodgingCostPerDay}`
                vrbl.searchDest.dispatchEvent(new Event('change'))
                vrbl.destModal.close()
                console.log(vrbl.destID.value,vrbl.destFlight.value,vrbl.destLodging.value)
            })
            tableRow.appendChild(tableData);
        });
        inputTable.appendChild(tableRow);
    });
    

}

function clearTable(table) {
    const rows = table.getElementsByTagName('tr');
    for (let i = rows.length - 1; i > 0; i--) {
        table.removeChild(rows[i]); 
    }
}

function getSort(destinations, sortBy) {

    let sortedDest;

    switch (sortBy) {
        case 'city':
        case 'country':
            sortedDest = destinations.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
            break;

        case 'estimatedLodgingCostPerDay':
        case 'estimatedFlightCostPerPerson':
            sortedDest = destinations.sort((a, b) => a[sortBy] - b[sortBy]);
            break;

        default:
            sortedDest = destinations; // If sortBy is not recognized, return unsorted array
            break;
    }

    return sortedDest;

}

function setKeys(thisDest) {

    const dest = {}
    
    dest['city'] = thisDest.city
    dest['country'] = thisDest.country
    dest['lodging'] = thisDest.estimatedLodgingCostPerDay
    dest['flight'] = thisDest.estimatedFlightCostPerPerson

    return dest
}

function displayDuration(e) {
    const startDate = new Date(vrbl.depDate.value);
    const endDate = new Date(e.target.value);
    
    const difference = differenceInDays(endDate, startDate);
    vrbl.tripDur.innerText = ''
    vrbl.tripDur.innerText += `  ${difference} day(s)`
    vrbl.bookingForm.querySelector('#duration').value = difference
    vrbl.bookingForm.querySelector('#duration').dispatchEvent(new Event('change'))
}

function bookingFormPg2 () {
    const detailFields = vrbl.bookingPg2.getElementsByTagName('h4')
    const flightCost = vrbl.bookingPg2.querySelector('#destFlight')
    const lodgingCost = vrbl.bookingPg2.querySelector('#destLodging')
    const totalCost = vrbl.bookingPg2.querySelector('#totalCost')

    const lodging = script.booking.destLodging * script.booking.numTravelers
    const flight = script.booking.destFlight * script.booking.duration

    lodgingCost.innerText = ''
    flightCost.innerText = ''
    totalCost.innerText = ''

    console.log(script.booking)
    Array.from(detailFields).forEach((field) => {
        field.innerText = script.booking[field.id]
    })
    flightCost.innerText += `$${flight}`
    if(script.booking.lodging){
        lodgingCost.innerText += `$${lodging}`
    }

    totalCost.innerText += `$${((lodging+flight)*1.10).toFixed(2)}`
}

function showUserMsg(msg) {
    vrbl.userMsg.querySelector('h3').innerText = msg
    vrbl.userMsg.showModal()

    setTimeout(() => {
       vrbl.userMsg.close() 
    }, 2500);
}



function editBooking(tripID) {
    vrbl.bookingForm.reset()
    const userData = script.promiseState.singleTraveler
    const tripData = script.promiseState.singleTravelerTrips.filter((trip) => trip.tripID == tripID)

    const input = Array.from(vrbl.bookingForm.querySelectorAll('* > input'))
    const retDate = vrbl.bookingForm.querySelector('#retDate')
   
    input.reduce((acc, fld) => {

        input[acc].value = convertKeys(input[acc].id, input[acc])
        acc++
        return acc
    }, 0)

    function convertKeys(input, inputField) {
        switch(input) {
            case 'travelerID': return userData.id
            break;
            case 'firstName' : return userData.name.split(' ')[0]
            break;
            case 'lastName' : return userData.name.split(' ')[1]
            break;
            case 'edit' : return 'edit'
            break;
            case 'dest' :      return tripData[0].dest.split(',')[0]
            break;
            case 'depDate' : return format(tripData[0].depDate, 'yyyy-MM-dd')
            break;
            case 'retDate' :    let date = new Date(format(tripData[0].depDate, 'yyyy-MM-dd'))
                                let duration = parseInt(tripData[0].duration.split('')[0])
                                let daySum = addDays(date, duration)
                                return format(daySum, 'yyyy-MM-dd') 
            break;
            case 'numTravelers' : return tripData[0].numTravelers
            break;
            case 'lodgingTrue' :  if(tripData[0].lodgingCost > 0){inputField.checked = true} else {inputField.checked = true}
            break;
            case 'createReq' :  return 'Update booking'
            break;
            case 'deleteReq' :  return 'Delete booking'
            break;
        }
    }

        vrbl.bookingForm.querySelector('.editLabel').classList.toggle('hidden')
        vrbl.bookingForm.querySelector('.editLabel').innerText = `Editing booking number: ${tripData[0].tripID}`
        vrbl.tripDur.innerText = `Trip duration: ${tripData[0].duration}`

}

function confirmDelete(msg) {
    vrbl.userMsg.querySelector('h3').innerText = msg
    vrbl.userMsg.querySelector('.deleteBooking').classList.toggle('hidden')
    vrbl.userMsg.querySelector('.cancel').classList.toggle('hidden')
    vrbl.userMsg.show()
}

function resetBookingForm(e) {

    let inputArray = [vrbl.travelerID, vrbl.firstName, vrbl.lastName]

    inputArray.forEach((input) => {
        input.classList.remove('readOnly')
        input.readOnly = true
        input.disabled = false
    })
    vrbl.retDate.disabled = true

    vrbl.bookingForm.reset()
    vrbl.bookingPg2.reset()
}

function showUserTab(user) {
    const fields = vrbl.userInfo.querySelectorAll('p')
    const userData = {
        id: user.singleTraveler.id,
        name: user.singleTraveler.name,
        travelerType: user.singleTraveler.travelerType,
        tripCount: Array.from(user.singleTravelerTrips).length
        }

        fields.forEach((field)=>{
            Object.entries(userData).forEach((key)=> {
              if(key[0] === field.id){
                field.innerText = `${key[0]}:  ${key[1]}`
              }
            })
        })

        vrbl.userInfo.classList.toggle('hidden')
}

function dynamicCrossfade(startEl, endEl) {
    let opacity = 1;
    console.log(endEl)
    fadeOut(startEl);

    function fadeOut(startEl) {
        if (opacity > 0) {
            opacity -= 0.01;
            startEl.style.opacity = opacity;
            setTimeout(() => fadeOut(startEl), 1);
        } else {
            startEl.classList.add('hidden')
           fadeIn(endEl);
        }
    }

    function fadeIn(endEl) {
        endEl.classList.remove('hidden')
        if (opacity < 1) {
            opacity += 0.01;
            endEl.style.opacity = opacity;
            setTimeout(() => fadeIn(endEl), 1);
        } else {
            
            // setTimeout(() => fadeOut(endEl), 100); 
        }
    }
}

export {
    updateDOM,
    displayRawData,
    userLogin, 
    userDropDown,
    selectedUser,
    toggleCollapsible,
    displayTrips,
    displayDestinations,
    updateUserInfo,
    displayDuration,
    bookingFormPg2,
    showUserMsg,
    editBooking,
    confirmDelete,
    resetBookingForm,
    dynamicCrossfade,
    showUserTab
}

