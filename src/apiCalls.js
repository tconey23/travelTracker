import * as script from './scripts'

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
    console.log(data, endpoint)
    fetch(endpoint, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      response.json()
    })
    .then(data => {
      console.log(data)
    })
    .catch(error => {
      console.log(error)
    })
  }
  

export {
    fetchData,
    postData
}
