import * as script from './scripts'
import * as dom from './domUpdate'

function fetchData(endpoint) {
    return fetchPoint(endpoint)
    .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch ${endpoint}`);
        }
        return response.json();
      })
      .catch((error) => console.log(`Error fetching ${endpoint}:`, error));
  }

  function fetchPoint(endpoint) {
    switch(endpoint){
        case 'travelers': return fetch('http://localhost:3001/api/v1/travelers')
         break;
        case 'trips': return fetch('http://localhost:3001/api/v1/trips')
        break;
        case 'destinations': return fetch('http://localhost:3001/api/v1/destinations')
        break;
    }
  }

  // script.readyToPost(script.testBooking,'http://localhost:3001/api/v1/trips')

  function postData(data, endpoint) {
    console.log(data, endpoint);
    fetch(endpoint, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        } else {
            return response.json().then(error => { throw error; }); // Parse the error message if response is not OK
        }
    })
    .then(data => {
        console.log(data.message)
        dom.showUserMsg(data.message); // Log the response message
    })
    .catch(error => {
        console.log(error.message); // Log the error message
    });
}

function deleteData(endpoint) {
  fetch(endpoint, {
      method: 'DELETE',
      headers: {
          "Content-Type": "application/json"
      },
  })
  .then(response => {
      if(response.ok) {
          return response.json();
      } else {
          return response.json().then(error => { throw error; }); // Parse the error message if response is not OK
      }
  })
  .then(data => {
      console.log(data.message)
      dom.showUserMsg(data.message);
  })
  .catch(error => {
      console.log(error.message); 
  });
}
  

export {
    fetchData,
    postData,
    deleteData
}
