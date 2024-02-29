import * as vrbl from "./globalVariables"
import * as dom from "./domUpdate"

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

    vrbl.dashboard.addEventListener('click', (e) => {

        dom.toggleCollapsible(e)

    })

    const tripModal = document.querySelector('.tripModal');
    const cancelButton = tripModal.querySelector('button[value="cancel"]');
    cancelButton.addEventListener('click', (event) => {
        vrbl.tripModal.close()
    })
    
}

function secondaryListeners(type){
    // switch (type) {
    //     case 'a': tripLinks()
    // }
}

function tripLinks(){
    vrbl.tripLinks.forEach((link) => {
        console.log(link)
        link.addEventListener('click', (e) => {
            console.log(e.target)
        })
    })
}

export { setUpListeners, secondaryListeners }


