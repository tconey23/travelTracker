
import * as vrbl from "./globalVariables"
import * as script from "./scripts"
import * as evt from "./eventListeners"

function updateDOM(data, type) {
}

function displayRawData() {
    vrbl.rawDataContainer.classList.toggle('hidden')
}

function userLogin() {
    if(vrbl.userName && vrbl.password.value === 'travel'){
        vrbl.loginPanel.classList.toggle('hidden')
        vrbl.dashboard.classList.toggle('hidden')
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

// function displayTrips(data) {
//     console.log(data)
//     data.forEach((trip) => {
//         vrbl.tripData.innerHTML += `<th><a>${trip.dest} &#x21d7</a></th><th>${trip.date}</th><th><img src="${trip.photo}"></th>`
//     })
//     evt.secondaryListeners('a')
// }

function displayTrips(data) {
    data.forEach((trip) => {
        const newLink = document.createElement('p');
        newLink.textContent = `${trip.dest} \u21d7`;
        newLink.value = trip.dest
        newLink.date = trip.date
        newLink.addEventListener('click', (e) => {
            showTripDetails(e.target.value, e.target.date)
        });

        const newCell = document.createElement('th');
        newCell.appendChild(newLink);

        const dateCell = document.createElement('th');
        dateCell.textContent = trip.date;

        const statusCell = document.createElement('th')
        statusCell.textContent = trip.status;

        const imgCell = document.createElement('th');
        const img = document.createElement('img');
        img.src = trip.photo;
        imgCell.appendChild(img);

        const newTripElement = document.createElement('tr');
        newTripElement.appendChild(newCell);
        newTripElement.appendChild(dateCell);
        newTripElement.appendChild(statusCell);
        newTripElement.appendChild(imgCell);

        vrbl.tripData.appendChild(newTripElement);
    });
}

let approvedSum
let pendingSum

function separateCostByType(type, trip) {
    let inputTable = document.querySelector(`.${type}`);
    const newLink = document.createElement('p');
    newLink.textContent = `${trip.dest} \u21d7`;
    newLink.value = trip.dest;
    newLink.date = trip.date;
    newLink.addEventListener('click', (e) => {
        showTripDetails(e.target.value, e.target.date);
    });

    const newCell = document.createElement('th');
    newCell.appendChild(newLink);

    const dateCell = document.createElement('th');
    dateCell.textContent = trip.date;

    const flightCostCell = document.createElement('th');
    flightCostCell.textContent = trip.flightCost;

    const lodgingCostCell = document.createElement('th');
    lodgingCostCell.textContent = trip.lodgingCost;

    const statusCell = document.createElement('th')
    statusCell.textContent = trip.status;

    const totalCost = (trip.flightCost + trip.lodgingCost * 1.10).toFixed(2);

    const updatedCosts = splitCost(type, pendingSum, approvedSum, totalCost);
    approvedSum = updatedCosts[1]; // Update approvedSum with the returned value
    pendingSum = updatedCosts[0]; // Update pendingSum with the returned value

    const totalCostCell = document.createElement('th');
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

function showTripDetails(trip, date) {
    vrbl.tripName.innerText = trip
    vrbl.tripDate.innerText = date
    vrbl.tripModal.showModal()
}


export {
    updateDOM,
    displayRawData,
    userLogin, 
    userDropDown,
    selectedUser,
    toggleCollapsible,
    displayTrips
}

