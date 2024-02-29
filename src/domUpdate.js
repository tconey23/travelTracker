
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
        document.querySelector(`#${e.target.classList[0]}`).classList.toggle('collapsed')
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

        const imgCell = document.createElement('th');
        const img = document.createElement('img');
        img.src = trip.photo;
        imgCell.appendChild(img);

        const newTripElement = document.createElement('tr');
        newTripElement.appendChild(newCell);
        newTripElement.appendChild(dateCell);
        newTripElement.appendChild(imgCell);

        vrbl.tripData.appendChild(newTripElement);
    });
}

function displayTripCost(data) {
    let totalCostSum = 0;

    data.forEach((trip) => {
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

        const totalCost = (trip.flightCost + trip.lodgingCost * 1.10).toFixed(2); 
        totalCostSum += parseFloat(totalCost);

        const totalCostCell = document.createElement('th');
        totalCostCell.textContent = totalCost;

        const newTripElement = document.createElement('tr');
        newTripElement.appendChild(newCell);
        newTripElement.appendChild(dateCell);
        newTripElement.appendChild(flightCostCell);
        newTripElement.appendChild(lodgingCostCell);
        newTripElement.appendChild(totalCostCell);
        
        vrbl.costData.appendChild(newTripElement);
    });

    vrbl.totalCost.innerText = `Total spent on travel $${totalCostSum.toFixed(2)}`; 
}

function showTripDetails(trip, date) {
    console.log(trip, date)
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

