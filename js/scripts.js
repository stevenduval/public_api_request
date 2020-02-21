// select the gallery div
const gallery = document.querySelector('#gallery');
// select the searchContainer div
const searchContainer = document.querySelector('.search-container');

// insert loading message which shows if api is slow to respond
gallery.insertAdjacentHTML('beforebegin', '<div class="loading" style="margin-top: 50vh;">Loading....</div>');

// fetch 12 random users from randomuser API
fetch('https://randomuser.me/api/?results=12&nat=US')
    // change the response to JSON format
    .then(response => response.json())
    // send the data to the generateEmployee function
    .then(generateEmployee)
    // generate search box
    .then(generateSearch)
    //throw an error if something is wrong and place an error message onto the page
    .catch((error) => gallery.insertAdjacentHTML('beforebegin', `<div class="loading" style="margin-top: 50vh;">Oops something went wrong. Please try again!${error}</div>`))
    // remove loading message on success
    .finally(() => document.querySelector('.loading').remove());

function generateEmployee(data) {
    // store data results in dataResults const
    const dataResults = data.results;
    // for each employee do the following
    dataResults.forEach(employee => {
        // create a div to store the employee
        const card = document.createElement('div');
        // set the div to have a class name of card
        card.className = 'card';
        // append the card to the gallery div
        gallery.appendChild(card);
        // set the inner html of the current card to have the information below
        card.innerHTML = `
        <div class="card-img-container">
            <img class="card-img" src="${employee.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
            <p class="card-text">${employee.email}</p>
            <p class="card-text cap">${employee.location.city}</p>
        </div>`
    });
    // creates an array of all of the cards on the page
    Array.from(gallery.childNodes)
    // for each card add an event listener that, when clicked, passes that cards information to the generateModal
        .forEach((card, index) => card.addEventListener('click', () => {
            generateModal(dataResults, index)
        }));
}

function generateModal(dataResults, index) {
    // set current employee
    const employee = dataResults[index];
    // dob format
    const dob = new Date(employee.dob.date);
    const dobNewFormat = (dob.getMonth() + 1) + '/' + dob.getDate() + '/' +  dob.getFullYear();
    // insert the following html into the page when a card is clicked
    gallery.insertAdjacentHTML('afterend', `
        <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="modal-text">${employee.email}</p>
                <p class="modal-text cap">${employee.location.city}</p>
                <hr>
                <p class="modal-text">${employee.phone}</p>
                <p class="modal-text">
                    ${employee.location.street.number} ${employee.location.street.name}., ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}
                </p>
                <p class="modal-text">Birthday: ${dobNewFormat}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    `);

    // select the modal window
    const modal = document.querySelector('.modal-container');
    // listen for clicks on the modal
    modal.addEventListener('click', (e) => {
        // create an empty array to use to store indices of non hidden elements
        let activeEmployees = [];
        // loop through each card and those that do not have style attribute push their index to activeEmployees
        Array.from(gallery.childNodes)
            .forEach((card, index) => {
                if (!card.hasAttribute('style')) { activeEmployees.push(index);}
            }); 
        // close modal if button or x is clicked
        if (e.target.id === 'modal-close-btn' || e.target.parentNode.id === 'modal-close-btn' || e.target.id === 'modal-prev' || e.target.id === 'modal-next') { modal.remove(); } 
        // listen for activity on modal prev button and generate new modal data
        if (e.target.id === 'modal-prev') { 
            (activeEmployees.indexOf(index) > 0 ) ? index = activeEmployees[activeEmployees.indexOf(index) - 1] : index = activeEmployees[activeEmployees.length - 1];
            generateModal(dataResults, index);
        }
        // listen for activity on modal next button and generate new modal data
         if (e.target.id === 'modal-next') { 
            (activeEmployees.indexOf(index) < activeEmployees.length - 1 ) ? index = activeEmployees[activeEmployees.indexOf(index) + 1] : index = activeEmployees[0];
             generateModal(dataResults, index);
        } 
    });   
}

function generateSearch() {
    // insert below html code into search-container div
    searchContainer.innerHTML = `
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form> `
}

function search(e) {
    // prevent submit when search icon is clicked
    if (e.target.id === 'search-submit') { e.preventDefault(); } 
    // create an array of all of the cards
    Array.from(gallery.childNodes)
        .forEach(card => {
            // if card has style attribute remove it so all can be displayed
            if (card.hasAttribute('style')) { card.removeAttribute('style') };
            // check that the box is not zero characters before trying to match data
            if (searchContainer.querySelector('#search-input').value.length > 0) { 
                // set variables for text content of current card h3
                const cardNameVal = card.querySelector('.card-info-container h3').textContent.toLowerCase();
                // set variable for value of input
                const inputNameVal = searchContainer.querySelector('input').value.toLowerCase();
                // if card does not match the input set the display to none
                if (!cardNameVal.includes(inputNameVal)) { card.style.display = 'none'; }
            } 
        });
}
// listen for click on search icon
searchContainer.addEventListener('click', (e) => search(e));
// listen for key event in search box
searchContainer.addEventListener('keyup', search);