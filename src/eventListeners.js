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

    vrbl.bookingForm.addEventListener('click', (e) => {
        let error = vrbl.bookingForm.querySelector('.error')
        let errorContent = error.getElementsByTagName('p')
        script.booking.numTravelers = vrbl.numTrav.value

        if(e.target.id === "createReq"){
            vrbl.bookingFormInputs.forEach((input)=> {
                if(!input.value && input.id !== 'submit' && input.id !== 'duration'){
                    input.style.border = '1px solid red'
                    error.innerHTML += `<p>${input.id}</p>`
                    error.showModal()
                    setTimeout(() => {
                        error.close()
                        if(errorContent){
                            Array.from(errorContent).forEach((elem) => {
                                elem.remove()
                            })
                             }
                    }, 2000);
                }
            })
            e.preventDefault()
            console.log(script.booking)
        }
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


