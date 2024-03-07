import * as vrbl from "./globalVariables"
import * as script from "./scripts"
import * as evt from "./eventListeners"
const { differenceInDays } = require("date-fns")


function userLogin() {
  if (vrbl.userName && vrbl.password.value === "travel") {
    dynamicCrossfade(vrbl.landing, vrbl.clientOverview)
    updateUserInfo(vrbl.userName.value.replace('traveler', ''))
  } else {
    alert("credentials incorrect")
  }

}

function selectedUser(e) {
  vrbl.userName.value = e.target.value
  vrbl.password.value = "travel"
  vrbl.userList.classList.add("hidden")
}

function updateUserInfo(user) {
  vrbl.currUserName.innerText = script.storeCurrentUser(user)
  vrbl.clientMain.querySelector(".approvedCost > p").innerText = ""
  vrbl.clientMain.querySelector(".pendingCost > p").innerText = ""
  displayTrips(script.updateUserTrips(user))
}


function toggleCollapsible(e) {
  if (e.target.classList.contains("totalSpent")) {
    vrbl.tripList.classList.toggle("collapsed")
  }
  e.target.classList.toggle("expanded")
}


function displayTrips(trip) {

  let totalCost = 0
  let inputTable = vrbl.costData
  let tripCol = ["tripID", "dest", "depDate", "status", "numTravelers", "duration", "flightCost", "lodgingCost"]
  let tableRow = ""

  trip.forEach((t) => {
    t["flightCost"] = t["flightCost"] * t["numTravelers"]
    t["lodgingCost"] = t["lodgingCost"] * t["duration"]

    totalCost = ((t["flightCost"] + t["lodgingCost"]) * 1.10).toFixed(2)
    t["totalCost"] = totalCost
    tripCol.forEach((c) => {
      if (c.includes("Cost")) {
        tableRow += `<td tabindex="0" id="${t.tripID}">$${t[c]}</td>`
      } else {
        tableRow += `<td tabindex="0" id="${t.tripID}">${t[c]}</td>`
      }
    })
    inputTable.innerHTML += `<tr tabindex="0" id="${t.tripID}">${tableRow}<td tabindex="0" id="${t.tripID}">$${totalCost}</td></tr>`
    tableRow = ""

  })
  getCost()
}

let approvedCost = 0;
let pendingCost = 0;

function splitCost(status, amount) {

  switch (status) {
  case "approved":
    approvedCost += parseFloat(amount);
    break;

  case "pending":
    pendingCost += parseFloat(amount);
    break;
  }
}

function getCost() {
  approvedCost = 0
  pendingCost = 0
  vrbl.costData.querySelectorAll("tr").forEach((row) => {
    if (row.querySelector("td:nth-child(4)")) {
      const status = row.querySelector("td:nth-child(4)").textContent;
      const total = row.querySelector("td:nth-child(9)").textContent.replace("$", "").replace(",", "");
      splitCost(status, total);
    }
  });

  vrbl.clientMain.querySelector(".approvedCost > p").innerText = approvedCost.toFixed(2);
  vrbl.clientMain.querySelector(".pendingCost > p").innerText = pendingCost.toFixed(2);
  evt.tripLinks()
}


function showTripDetails(trip) {

  const fields = vrbl.tripInfo.querySelectorAll("table > tbody > tr > th > p")
  vrbl.tripName.textContent = trip["dest"]
  vrbl.tripDate.textContent = trip["depDate"]
  fields.forEach((fld) => {
    const detail = trip[`${fld.id}`]
    fld.textContent = detail
  })

  vrbl.tripModal.showModal()
}

function findTripDetails(tripID) {
  let userTrips = script.promiseState.singleTravelerTrips
  const thisTrip = userTrips.find((trip) => trip.tripID == tripID)
  Object.values(vrbl.tripModal.querySelectorAll("p")).forEach((elem) => {
    elem.innerText = ""
    Object.entries(thisTrip).forEach((item) => {
      if (item[0] == elem.id) {
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
    dest["country"] = dest.destination.split(",")[1].trim();
    dest["city"] = dest.destination.split(",")[0];
  });

  const sortedDest = getSort(destinations, sortBy)

  sortedDest.forEach((dest) => {
    let tableRow = document.createElement("tr");
    const row = setKeys(dest);
    Object.values(row).forEach((key) => {
      let tableData = document.createElement("td");
      tableData.innerText = key;
      tableData.addEventListener("click", () => {
        vrbl.searchDest.value = `${dest.city}`
        vrbl.destName.value = `${dest.destination}`
        vrbl.destID.value = dest.id
        vrbl.destFlight.value = `${dest.estimatedFlightCostPerPerson}`
        vrbl.destLodging.value = `${dest.estimatedLodgingCostPerDay}`
        vrbl.searchDest.dispatchEvent(new Event("change"))
        vrbl.destModal.close()
      })
      tableRow.appendChild(tableData);
    });
    inputTable.appendChild(tableRow);
  });


}

function clearTable(table) {
  const rows = table.getElementsByTagName("tr");
  for (let i = rows.length - 1; i > 0; i--) {
    table.removeChild(rows[i]);
  }
}

function getSort(destinations, sortBy) {

  let sortedDest;

  switch (sortBy) {
  case "city":
  case "country":
    sortedDest = destinations.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    break;

  case "estimatedLodgingCostPerDay":
  case "estimatedFlightCostPerPerson":
    sortedDest = destinations.sort((a, b) => a[sortBy] - b[sortBy]);
    break;

  default:
    sortedDest = destinations; 
    break;
  }

  return sortedDest;

}

function setKeys(thisDest) {

  const dest = {}

  dest["city"] = thisDest.city
  dest["country"] = thisDest.country
  dest["lodging"] = thisDest.estimatedLodgingCostPerDay
  dest["flight"] = thisDest.estimatedFlightCostPerPerson

  return dest
}

function displayDuration(e) {
  const startDate = new Date(vrbl.depDate.value);
  const endDate = new Date(e.target.value);

  const difference = differenceInDays(endDate, startDate);
  vrbl.tripDur.innerText = ""
  vrbl.tripDur.innerText += `  ${difference} day(s)`
  vrbl.bookingForm.querySelector("#duration").value = difference
  vrbl.bookingForm.querySelector("#duration").dispatchEvent(new Event("change"))
}

function bookingFormPg2(booking) {
  let lodgingCost
  const pageOne = vrbl.bookingForm.querySelectorAll("* > input")
  const pageTwo = vrbl.bookingPg2.querySelectorAll("* > h4")

  pageTwo.forEach((fld) => {
    pageOne.forEach((input) => {
      if (input.id === fld.id) {
        fld.textContent = input.value
      }
    })
  })

  vrbl.bookingPg2.querySelector("#duration").textContent = `${booking.duration}`

  if (vrbl.bookingForm.querySelector("#lodgingTrue").checked) {
    vrbl.bookingPg2.querySelector("#lodging").textContent = "YES"
    lodgingCost = booking.destLodging * booking.duration
  } else {
    vrbl.bookingPg2.querySelector("#lodging").textContent = "NO"
    lodgingCost = 0
  }

  const flightCost = booking.destFlight * booking.numTravelers
  const totalCost = flightCost + lodgingCost
  const markup = totalCost * 1.10
  booking.destFlight = flightCost
  booking.destLodging = lodgingCost

  vrbl.bookingPg2.querySelector("#destFlight").textContent = flightCost
  vrbl.bookingPg2.querySelector("#destLodging").textContent = lodgingCost
  vrbl.bookingPg2.querySelector("#totalCost").textContent = markup.toFixed(2)

  booking["id"] = vrbl.bookingForm.querySelector("#travelerID").value
  booking["destinationID"] = script.promiseState.destinations.find((dest) => dest["destination"] === booking.destName)["id"]
}

function showUserMsg(msg) {
  vrbl.userMsg.querySelector("h3").innerText = msg
  vrbl.userMsg.showModal()

  setTimeout(() => {
    vrbl.userMsg.close()
  }, 2500);
}

function resetBookingForm() {

  let inputArray = [vrbl.travelerID, vrbl.firstName, vrbl.lastName]

  inputArray.forEach((input) => {
    input.classList.remove("readOnly")
    input.readOnly = true
    input.disabled = false
  })
  vrbl.retDate.disabled = true
  vrbl.bookingForm.reset()
  vrbl.bookingPg2.reset()
}

function showUserTab(user) {
  const fields = vrbl.userDetails.querySelectorAll("p")
  const userData = {
    id: user.singleTraveler.id,
    name: user.singleTraveler.name,
    travelerType: user.singleTraveler.travelerType,
    tripCount: Array.from(user.singleTravelerTrips).length
  }

  fields.forEach((field) => {
    Object.entries(userData).forEach((key) => {
      if (key[0] === field.id) {
        field.innerText = `${key[0]}:  ${key[1]}`
      }
    })
  })
}

function updateBookings(e) {
  clearTable(vrbl.costData)
  updateUserInfo(script.promiseState.singleTraveler.id)
  dynamicCrossfade(vrbl.clientInterface, vrbl.dashboard)
  resetBookingForm(e)
}

function verifyFields() {
  let fields = ["travelerID", "firstName", "lastName", "dest", "depDate", "retDate"];
  const inputArray = Array.from(vrbl.bookingForm.querySelectorAll("*"));
  let missingData = 0; 

  fields.forEach((fld) => {
    const inputFld = inputArray.find((input) => input.id === fld);
    inputFld.classList.remove("dataValidation");
    if (!inputFld.value) {
      inputFld.classList.add("dataValidation");
      missingData++;
    }
  });

  return missingData;
}

function dynamicCrossfade(startEl, endEl) {
  let opacity = 1;
  fadeOut(startEl);

  function fadeOut(startEl) {
    if (opacity > 0) {
      opacity -= 0.01;
      startEl.style.opacity = opacity;
      setTimeout(() => fadeOut(startEl), 1);
    } else {
      startEl.classList.add("hidden")
      fadeIn(endEl);
    }
  }

  function fadeIn(endEl) {
    endEl.classList.remove("hidden")
    if (opacity < 1) {
      opacity += 0.01;
      endEl.style.opacity = opacity;
      setTimeout(() => fadeIn(endEl), 1);
    }
  }
}

function getMapDest(destID) {
  console.log(destID)
  const dest = script.promiseState.destinations.find((destination) => destination['id'] === parseInt(destID, 10))
  vrbl.searchDest.value = `${dest.destination}`
  vrbl.destName.value = `${dest.destination}`
  vrbl.destID.value = dest.id
  vrbl.destFlight.value = `${dest.estimatedFlightCostPerPerson}`
  vrbl.destLodging.value = `${dest.estimatedLodgingCostPerDay}`
  vrbl.searchDest.dispatchEvent(new Event("change"))
  vrbl.mapModal.close()
  vrbl.bookingForm.classList.remove('hidden')
}

export {
  userLogin,
  selectedUser,
  toggleCollapsible,
  displayTrips,
  displayDestinations,
  updateUserInfo,
  displayDuration,
  bookingFormPg2,
  showUserMsg,
  resetBookingForm,
  dynamicCrossfade,
  showUserTab,
  showTripDetails,
  updateBookings,
  clearTable,
  findTripDetails,
  verifyFields,
  getMapDest
}