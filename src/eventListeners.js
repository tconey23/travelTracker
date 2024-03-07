import * as vrbl from "./globalVariables"
import * as dom from "./domUpdate"
import * as script from './scripts'
import * as api from './apiCalls'
const {
  format
} = require('date-fns')

function setUpListeners() {

  vrbl.loginPanel.addEventListener('click', (e) => {
    switch (e.target.id) {
    case 'clientLogin':
      vrbl.userName.value = Math.floor(Math.random() * 50)
      vrbl.password.value = 'travel'
      break;
    case "agentLogin":
      vrbl.userName.value = 'agency'
      vrbl.password.value = 'travel'
      break;
    }
  })

  document.addEventListener('DOMContentLoaded', () => {

    const imageUrls = [
      {src: './images/pexels-bri-schneiter-346529.jpg', alt: 'A lake surrounded by mountains'},
      {src: './images/pexels-aleksandar-pasaric-325185.jpg', alt: 'A busy city covered in low hanging clouds'},
      {src: './images/pexels-engin-akyurt-1435752.jpg', alt: 'Tropical blue sea water'},
      {src: './images/pexels-simon-berger-1323550.jpg', alt: 'A rainbow sunset over hills'},
      {src: './images/pexels-vincent-rivaud-2265876.jpg', alt: 'Fishing boats at anchor in tropical water'},
      {src: './images/pexels-sheila-condi-731217.jpg', alt: 'A view from a passenger window on a jet'},
      {src: './images/pexels-max-ravier-2253821.jpg', alt: 'The coast of a lush green island'},
      {src: './images/pexels-pixabay-38238.jpg', alt: 'Island-style huts on a tropical beach'},
      {src: './images/pexels-cameron-casey-1157255.jpg', alt: 'A jet flying over skyscrapers'},
      {src: './images/pexels-symeon-ekizoglou-2105937.jpg', alt: 'A person snorkeling in tropical blue water'}
    ];

    const imgElement = document.querySelector('.landing > section > img');
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
      if (!vrbl.landing.classList.contains('hidden')) {
        if (index !== imageUrls.length - 1) {
          index++
          imgElement.src = imageUrls[index]['src']
          imgElement.alt = imageUrls[index]['alt']
          setTimeout(fadeIn, 1)
        } else {
          index = 0
          imgElement.src = imageUrls[index]['src']
          imgElement.alt = imageUrls[index]['alt']
          setTimeout(fadeIn, 1)
        }
      }
    }

    fadeOut()
  })

  vrbl.logOut.addEventListener('click', () => {
    vrbl.userDetails.classList.add('hidden')
    location.reload()
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
    dom.userLogin()
  })

  document.querySelector(".clientDashboard").addEventListener('click', (e) => {
    if (e.target.classList.contains('totalSpent') || e.target.classList.contains('myTrips')) {
      dom.toggleCollapsible(e)
    }
  })

  const tripCancelButton = vrbl.tripModal.querySelector('button[value="cancel"]');
  tripCancelButton.addEventListener('click', () => {
    vrbl.tripModal.close()
  })

  const destCancelButton = vrbl.destModal.querySelector('button[value="cancel"]');
  destCancelButton.addEventListener('click', () => {
    vrbl.destModal.close()
  })

  vrbl.submitBooking.addEventListener('click', (e) => {
    e.preventDefault()
    let booking
    booking = script.booking

    let formattedDate = format(booking.depDate, 'yyyy/MM/dd')

    script.postBooking['id'] = script.promiseState.trips.length + 1
    script.postBooking['userID'] = booking.id
    script.postBooking['destinationID'] = parseInt(booking.destinationID)
    script.postBooking['travelers'] = booking.numTravelers
    script.postBooking['date'] = formattedDate
    script.postBooking['duration'] = booking.duration
    script.postBooking['status'] = 'pending'
    script.postBooking['suggestedActivities'] = 'unknown'
    script.readyToPost(script.postBooking, 'http://localhost:3001/api/v1/trips')


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

  vrbl.searchDest.addEventListener('click', () => {
    dom.displayDestinations('city')
    secondaryListeners()
    vrbl.mapModal.show()
    // vrbl.destModal.showModal()
    // secondaryListeners()
  })

  vrbl.nextButton.addEventListener('click', (e) => {
    e.preventDefault()

    const checkInputs = dom.verifyFields()

    if (checkInputs == 0) {
      dom.dynamicCrossfade(vrbl.bookingForm, vrbl.bookingPg2)
      const pageOne = vrbl.bookingForm.querySelectorAll('* > input')
      pageOne.forEach((input) => {
        script.booking[input.id] = input.value
      })
      dom.bookingFormPg2(script.booking)
    } else {
      dom.showUserMsg('Please complete the highlighted fields')
    }
  })

  vrbl.bookingForm.querySelector('#lodgingTrue').addEventListener('change', () => {
    if (vrbl.bookingForm.querySelector('#lodgingTrue').checked) {
      vrbl.bookingForm.querySelector('#lodging').value = true
    }
  })

  vrbl.bookingForm.querySelector('#lodgingFalse').addEventListener('change', () => {
    if (vrbl.bookingForm.querySelector('#lodgingFalse').checked) {
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

  vrbl.mapButton.addEventListener('click', () => {
    secondaryListeners()
    vrbl.mapModal.show()
  })

  vrbl.closeModal.addEventListener('click', () => {
    vrbl.wikiModal.querySelector('iframe').src = ''
    vrbl.wikiModal.close()
  })

  vrbl.closeMap.addEventListener('click', () => {
    console.log("123")
    vrbl.mapModal.close()
  })

}

function secondaryListeners() {

  document.querySelectorAll('.moreInfo').forEach((btn) => {
    console.log(btn)
    btn.addEventListener('click', (e) => {
      api.wikiSearch(e.target.id)
      console.log(e.target.id)
    })
  })


  document.querySelectorAll('.tableHeader a').forEach((a) => {
    a.addEventListener('click', (e) => {
      document.querySelectorAll('.tableHeader a').forEach((a) => {
        if (a === e.target) {
          a.style = "text-decoration: underline;"

        } else {
          a.style = "text-decoration: none;"
        }

      })

      dom.displayDestinations(e.target.id)
    })
  })
}

function tripLinks() {
  vrbl.costData.querySelectorAll('tr').forEach((row) => {
    if (!row.classList.contains('tableHeader')) {
      row.addEventListener('click', (e) => {
        const thisTrip = script.promiseState.singleTravelerTrips.find((trip) => trip['tripID'] === parseInt(e.target.id))
        script.promiseState.displayedBooking = thisTrip
        dom.showTripDetails(thisTrip)
      })
    }
  })
}

export {
  setUpListeners,
  secondaryListeners,
  tripLinks
}