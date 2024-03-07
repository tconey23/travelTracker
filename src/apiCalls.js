import * as dom from './domUpdate'
import * as vrbl from './globalVariables'

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
  switch (endpoint) {
  case 'travelers': return fetch('http://localhost:3001/api/v1/travelers')
  case 'trips': return fetch('http://localhost:3001/api/v1/trips')
  case 'destinations': return fetch('http://localhost:3001/api/v1/destinations')

  }
}


function postData(data, endpoint) {
  fetch(endpoint, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(error => {
          throw error; 
        });
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

function deleteData(endpoint) {
  fetch(endpoint, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    },
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(error => {
          throw error; 
        });
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

function wikiSearch(term) {
var url = "https://en.wikipedia.org/w/api.php"; 

var params = {
    action: "opensearch",
    search: term,
    limit: "1",
    namespace: "0",
    format: "json"
};

url = url + "?origin=*";
Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

fetch(url)
    .then(function(response){return response.json();})
    .then(function(response) {vrbl.wikiModal.querySelector('#wiki > iframe').src = response[3][0]; vrbl.wikiModal.show()})
    .catch(function(error){console.log(error);});
}

export {
  fetchData,
  postData,
  deleteData,
  wikiSearch
}
