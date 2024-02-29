

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
  

export {
    fetchData
}
