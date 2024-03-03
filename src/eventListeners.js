import * as vrbl from "./globalVariables"
import * as dom from "./domUpdate"
import * as script from './scripts'


function setUpListeners() {
    vrbl.rawData.addEventListener('click', () => {
        dom.displayRawData()
    })

    vrbl.loginButton.addEventListener('click', () => {
        dom.userLogin()
    })

    vrbl.userName.addEventListener('keyup', (e) => {
        e.preventDefault()
        // dom.userDropDown(e.target.value)

        // Array.from(vrbl.userList.children).forEach((child) => {
        //     child.addEventListener('click', (e) => {
        //         dom.selectedUser(e);
        //     });
        // });


        
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

    // vrbl.travSlider.addEventListener('input', () => {
    //     vrbl.travLabel.innerText = vrbl.travSlider.value
    // })

    vrbl.bookTrip.addEventListener('click', () => {

        let inputArray = [vrbl.travelerID, vrbl.firstName, vrbl.lastName]

        let user = script.promiseState.currentUser
        let name = user.name.split(" ")
        vrbl.travelerID.value = user.id
        vrbl.firstName.value = name[0]
        vrbl.lastName.value = name[1]

        inputArray.forEach((input) => {
            input.classList.add('readOnly')
            input.readOnlly = true
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


