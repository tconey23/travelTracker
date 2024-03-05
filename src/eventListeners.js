import * as vrbl from "./globalVariables"
import * as dom from "./domUpdate"
import * as script from './scripts'


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
        // setTimeout(() => {
        //     vrbl.loginButton.dispatchEvent(new Event('click'))
        // }, 1000);

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
        vrbl.userInfo.classList.toggle('hidden')
        dom.dynamicCrossfade(vrbl.clientOverview, vrbl.landing)

    })

    vrbl.userTab.addEventListener('click', () => {
        dom.showUserTab(script.promiseState)
    })

    vrbl.dashTab.addEventListener('click', (e) => {
        e.target.classList.add('clicked')
        vrbl.bkngTab.classList.remove('clicked')
        dom.dynamicCrossfade(vrbl.clientInterface, vrbl.dashboard)
        dom.resetBookingForm(e)
    })

    vrbl.bkngTab.addEventListener('click', (e) => {
        e.target.classList.add('clicked')
        vrbl.dashTab.classList.remove('clicked')
        dom.dynamicCrossfade(vrbl.dashboard, vrbl.clientInterface)
        dom.resetBookingForm(e)
    })

    vrbl.loginButton.addEventListener('click', () => {
        dom.userLogin()
    })

    vrbl.userName.addEventListener('keyup', (e) => {
        e.preventDefault()
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

    const tripEditButton = vrbl.tripModal.querySelector('button[value="edit"]');
    tripEditButton.addEventListener('click', (event) => {
        vrbl.bookingForm.querySelector('#deleteReq').classList.remove('hidden')
        dom.editBooking(document.querySelector("#tripID").innerText)
        vrbl.bkngTab.dispatchEvent(new Event('click'))
        vrbl.tripModal.close()
    })


    const destCancelButton = vrbl.destModal.querySelector('button[value="cancel"]');
    destCancelButton.addEventListener('click', (event) => {
        vrbl.destModal.close()
    })

    vrbl.submitBooking.addEventListener('click', (e) => {
        e.preventDefault()

        let formattedDate = script.booking.depDate.split('-')
        formattedDate = `${formattedDate[0]}/${formattedDate[1]}/${formattedDate[2]}`
        
        script.postBooking['id'] = script.promiseState.trips.length +1
        script.postBooking['userID'] = script.booking.travelerID
        script.postBooking['destinationID'] = parseInt(script.booking.destID)
        script.postBooking['travelers'] = script.booking.numTravelers
        script.postBooking['date'] = formattedDate
        script.postBooking['duration'] = script.booking.duration
        script.postBooking['status'] = 'pending'
        script.postBooking['suggestedActivities'] = 'unknown'
        script.readyToPost(script.postBooking,'http://localhost:3001/api/v1/trips')
        
        vrbl.bookingPg2.classList.toggle('hidden')
        vrbl.bookingForm.classList.toggle('hidden')
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

    vrbl.bookingFormInputs.forEach((input)=> {
        input.addEventListener('change', (e) => {
            script.booking[e.target.id] = e.target.value
        })
    })

    vrbl.nextButton.addEventListener('click', (e) => { 
        e.preventDefault()
        let inputArray = [vrbl.destID, vrbl.destFlight, vrbl.destLodging, vrbl.travelerID, vrbl.firstName, vrbl.lastName, vrbl.searchDest, vrbl.depDate, vrbl.retDate, vrbl.numTrav, vrbl.lodgingNeeded]
        let reqCount = 0
        inputArray.forEach((input) => {
            if(!input.value){
                console.log(input)
                input.style.border = '1px solid red'
            } else {
                reqCount ++
                input.style.border = '1px solid #e5e5e5'
                script.booking[input.id] = input.value
            }
        })

        if(reqCount == 11){
            script.booking.bookingID = "pending"
            dom.bookingFormPg2()
            vrbl.bookingForm.classList.toggle('hidden')
            vrbl.bookingPg2.classList.toggle('hidden')
        }

        console.log(script.booking)

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
        vrbl.bookingForm.classList.toggle('hidden')
        vrbl.bookingPg2.classList.toggle('hidden')
    })

    vrbl.bookingForm.querySelector('#deleteReq').addEventListener('click', (event) => {
        event.preventDefault()
        dom.confirmDelete('Are you sure you want to delete this booking?')
    })

    vrbl.userMsg.querySelector('.cancel').addEventListener('click', (e) => {
        e.preventDefault()
        vrbl.userMsg.querySelector('.cancel').classList.toggle('hidden')
        vrbl.userMsg.querySelector('.deleteBooking').classList.toggle('hidden')
        vrbl.userMsg.close()
    })

    vrbl.userMsg.querySelector('.deleteBooking').addEventListener('click', (e) => {
        e.preventDefault()
        vrbl.userMsg.querySelector('.cancel').classList.toggle('hidden')
        vrbl.userMsg.querySelector('.deleteBooking').classList.toggle('hidden')
        script.deleteBooking(vrbl.bookingForm.querySelector('.editLabel').innerText)
        vrbl.bookingForm.querySelector('.tripDur').innerText = 'Trip duration: '
        vrbl.bookingForm.querySelector('.editLabel').classList.add('hidden')
        vrbl.bookingForm.reset()
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
    vrbl.tripLinks.forEach((link) => {
        console.log(link)
        link.addEventListener('click', (e) => {
            console.log(e.target)
        })
    })
}

export { setUpListeners, secondaryListeners, }


