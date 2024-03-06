import * as vrbl from "./globalVariables"
import * as dom from "./domUpdate"
import * as script from './scripts'
const { addDays, format } = require('date-fns')

function setUpListeners() {

    vrbl.loginPanel.addEventListener('click', (e) => {
        switch(e.target.id){
            case 'clientLogin': vrbl.userName.value = Math.floor(Math.random() * 50)
                                vrbl.password.value = 'travel'
            break;
            case "agentLogin": vrbl.userName.value = 'agency'
                               vrbl.password.value = 'travel'
            break;
        }
    })

    document.addEventListener('DOMContentLoaded', () => {

        const imageUrls = [
            './images/pexels-bri-schneiter-346529.jpg',
            './images/pexels-aleksandar-pasaric-325185.jpg',
            './images/pexels-engin-akyurt-1435752.jpg',
            './images/pexels-simon-berger-1323550.jpg',
            './images/pexels-aleksandar-pasaric-325185.jpg',
            './images/pexels-vincent-rivaud-2265876.jpg',
            './images/pexels-sheila-condi-731217.jpg',
            './images/pexels-max-ravier-2253821.jpg',
            './images/pexels-pixabay-38238.jpg',
            './images/pexels-cameron-casey-1157255.jpg',
            './images/pexels-symeon-ekizoglou-2105937.jpg'
          ];

            const imgElement = document.querySelector('.landing > section > img');
            let urlCount = imageUrls.length
            let index = 0

            let opacity = 1;

            function fadeOut() {
                if (opacity > 0) {
                    opacity -= 0.01;
                    imgElement.style.opacity = opacity;
                    setTimeout(fadeOut, 1);
                } else {
                    newImg();
                }
            }

            function fadeIn() {
                if (opacity < 1) {
                    opacity += 0.01;
                    imgElement.style.opacity = opacity;
                    setTimeout(fadeIn, 1);
                } else {
                    setTimeout(fadeOut, 7000); 
                }
            }

            function newImg() {
                if(!vrbl.landing.classList.contains('hidden')){
                    if(index !== imageUrls.length -1){
                        index++
                        imgElement.src = imageUrls[index]
                        setTimeout(fadeIn, 1)
                    } else {
                        index = 0
                        imgElement.src = imageUrls[index]
                        setTimeout(fadeIn, 1)
                    }
                }
            }

            fadeOut()
})

    vrbl.logOut.addEventListener('click', () => {
        vrbl.userDetails.classList.add('hidden')
        dom.dynamicCrossfade(vrbl.clientOverview, vrbl.landing)
    })

    vrbl.userTab.addEventListener('click', () => {
        dom.showUserTab(script.promiseState)
        vrbl.userDetails.classList.toggle('hidden')
    })

    vrbl.dashTab.addEventListener('click', (e) => {
        e.target.classList.add('clicked')
        vrbl.bkngTab.classList.remove('clicked')
        script.getData(['travelers', 'destinations', 'trips'])
        dom.updateBookings(e)
    })

    vrbl.bkngTab.addEventListener('click', (e) => {
        e.target.classList.add('clicked')
        vrbl.dashTab.classList.remove('clicked')
        dom.dynamicCrossfade(vrbl.dashboard, vrbl.clientInterface)
        dom.resetBookingForm(e)
    })

    vrbl.loginButton.addEventListener('click', () => {
        console.log(script.promiseState)
        dom.userLogin()
    })

    document.querySelector(".clientDashboard").addEventListener('click', (e) => {
        if(e.target.classList.contains('totalSpent') || e.target.classList.contains('myTrips')){
        dom.toggleCollapsible(e)
        }
    })

    const tripCancelButton = vrbl.tripModal.querySelector('button[value="cancel"]');
    tripCancelButton.addEventListener('click', (event) => {
        vrbl.tripModal.close()
    })

    const destCancelButton = vrbl.destModal.querySelector('button[value="cancel"]');
    destCancelButton.addEventListener('click', (event) => {
        vrbl.destModal.close()
    })

    vrbl.submitBooking.addEventListener('click', (e) => {
        e.preventDefault()
        let booking
         booking = script.booking

        let formattedDate = format(booking.depDate, 'yyyy/MM/dd')
        
        script.postBooking['id'] = script.promiseState.trips.length +1
        script.postBooking['userID'] = booking.id
        script.postBooking['destinationID'] = parseInt(booking.destinationID)
        script.postBooking['travelers'] = booking.numTravelers
        script.postBooking['date'] = formattedDate
        script.postBooking['duration'] = booking.duration
        script.postBooking['status'] = 'pending'
        script.postBooking['suggestedActivities'] = 'unknown'
        script.readyToPost(script.postBooking,'http://localhost:3001/api/v1/trips')
        

            setTimeout(() => {
                dom.updateUserInfo(script.promiseState.singleTraveler.id)
                dom.displayTrips(script.promiseState.singleTravelerTrips)
                dom.clearTable(vrbl.costData)
                dom.displayTrips(script.promiseState.singleTravelerTrips)
            }, 2000);

        dom.dynamicCrossfade(vrbl.bookingPg2, vrbl.bookingForm)
        dom.resetBookingForm(e) 
    })

    vrbl.bookTrip.addEventListener('click', () => {

        let inputArray = [vrbl.travelerID, vrbl.firstName, vrbl.lastName]

        let user = script.promiseState.singleTraveler
        let name = user.name.split(" ")
        vrbl.travelerID.value = user.id
        vrbl.firstName.value = name[0]
        vrbl.lastName.value = name[1]

        inputArray.forEach((input) => {
            input.classList.add('readOnly')
            input.readOnly = true
            input.disabled = true
            input.dispatchEvent(new Event('change'))
        })
    })

    vrbl.depDate.addEventListener('change', () => {
        vrbl.retDate.readOnly = false
        vrbl.retDate.disabled = false
        vrbl.retDate.classList.remove('readOnly')
    })

    vrbl.retDate.addEventListener('change', (e) => {
        dom.displayDuration(e)
    })

    vrbl.searchDest.addEventListener('click', (event) => {
        dom.displayDestinations('city')
        vrbl.destModal.showModal()
        secondaryListeners()
    })

    vrbl.nextButton.addEventListener('click', (e) => { 
        e.preventDefault()

            dom.dynamicCrossfade(vrbl.bookingForm, vrbl.bookingPg2)
            const pageOne = vrbl.bookingForm.querySelectorAll('* > input')
            pageOne.forEach((input) => {
                script.booking[input.id] = input.value
            })
            dom.bookingFormPg2(script.booking)
    
    })

    vrbl.bookingForm.querySelector('#lodgingTrue').addEventListener('change', () => {
        if(vrbl.bookingForm.querySelector('#lodgingTrue').checked) {
            vrbl.bookingForm.querySelector('#lodging').value = true
        }
    })

    vrbl.bookingForm.querySelector('#lodgingFalse').addEventListener('change', () => {
        if(vrbl.bookingForm.querySelector('#lodgingFalse').checked) {
            vrbl.bookingForm.querySelector('#lodging').value = false
        }
    })

    vrbl.returnButton.addEventListener('click', (e) => {
        e.preventDefault()
        dom.dynamicCrossfade(vrbl.bookingPg2, vrbl.bookingForm)
    })

    vrbl.userMsg.querySelector('.cancel').addEventListener('click', (e) => {
        e.preventDefault()
        vrbl.userMsg.querySelector('.cancel').classList.toggle('hidden')
        vrbl.userMsg.querySelector('.deleteBooking').classList.toggle('hidden')
        vrbl.userMsg.close()
    })
}


function secondaryListeners(){
    

    document.querySelectorAll('.tableHeader a').forEach((a) => {
        a.addEventListener('click', (e) => {
            document.querySelectorAll('.tableHeader a').forEach((a) => {
                if(a === e.target){
                    a.style="text-decoration: underline;"
                    
                } else {
                    a.style="text-decoration: none;"
                }
                
            })

            dom.displayDestinations(e.target.id)
        })
    })
}

function tripLinks(){
    vrbl.costData.querySelectorAll('tr').forEach((row) => {
        if(!row.classList.contains('tableHeader')){
            row.addEventListener('click', (e) => {
               const thisTrip = script.promiseState.singleTravelerTrips.find((trip) => trip['tripID'] === parseInt(e.target.id))
               script.promiseState.displayedBooking = thisTrip
               dom.showTripDetails(thisTrip)
            })
         }
    })
}

export { setUpListeners, secondaryListeners, tripLinks}


