export{ clientInterface, costInfo, tripInfo, pendingCost, approvedCost, totalCost, costData, tripName, tripDate, tripModal, tripLinks, dashboard, tripList, spentList, totalSpent, myTrips, currUserName, password, travelers, userList, userName, loginPanel, loginButton, hidden, travelerData, tripData, destinationData, rawData, rawDataContainer }
import * as script from "./scripts"

const rawDataContainer = document.querySelector('#tableContainer')
const hidden = document.querySelectorAll('.hidden')
const travelerData = document.querySelector('.travelerData')
const tripData = document.querySelector('.tripData')
const costData = document.querySelector('.costData')
const destinationData = document.querySelector('.destinationData')
const rawData = document.querySelector('.rawDataButton')
const loginButton = document.querySelector('.loginButton')
const loginPanel = document.querySelector('.welcomeContainer')
const userName = document.querySelector('#userNameField')
const password = document.querySelector('#passwordField')
const userList = document.querySelector('.userNames')
const currUserName = document.querySelector('section.currentUser > h3')
const myTrips = document.querySelector('.myTrips')
const totalSpent = document.querySelector('.totalSpent')
const dashboard = document.querySelector(".clientDashboard")
const tripList = document.querySelector(".tripList")
const spentList = document.querySelector(".spentList")
const tripLinks = document.querySelectorAll('#dataDump > tr > th > a')
const tripModal = document.querySelector('.tripModal')
const tripDate = document.querySelector('.tripDate')
const tripName = document.querySelector('.tripName')
const totalCost = document.querySelector('.totalCost')
const approvedCost = document.querySelector('#totalSpent > h3.totalCost.approved')
const pendingCost = document.querySelector('#totalSpent > h3.totalCost.pending')
const tripInfo = document.querySelector('.tripInfo')
const costInfo = document.querySelector('.costInfo')
const clientInterface = document.querySelector('.clientInteraction')
const travelers = {}