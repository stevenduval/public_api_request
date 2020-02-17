//global variables
const gallery = document.querySelector('#gallery');
const searchContainer = document.querySelector('.search-container');

// insert loading message if api is slow to respond
gallery.insertAdjacentHTML('beforebegin', '<div class="loading" style="margin-top: 50vh;">Loading....</div>');

// fetch 12 random users from randomuser API
fetch('https://randomuser.me/api/?results=12&nat=US')
    // change the response to JSON format
    .then(response => response.json())
    // send the data to the generateEmployee function
    .then(data => generateEmployee(data))
    // generate search box
    .then(() => search())
    //throw an error if something is wrong and place an error message onto the page
    .catch((error) => gallery.insertAdjacentHTML('beforebegin', `<div class="loading" style="margin-top: 50vh;">Oops something went wrong. Please try again!${error}</div>`))
    // remove loading message on success
    .finally(() => document.querySelector('.loading').remove());

const generateEmployee = (data) => {
    // for each employee do the following
    data.results.forEach(employee => {
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
            <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
        </div>`
    });
    // creates an array of all of the cards on the page
    Array.from(gallery.childNodes)
    // for each card add an event listener that, when clicked, passes that cards information to the generateModal
        .forEach((card, index) => card.addEventListener('click', () => generateModal(data.results[index-1])));
}

const generateModal = (employee) => {
    console.log(employee);
    const dob = new Date(employee.dob.date);
    const dobNewFormat = (dob.getMonth() + 1) + '/' + dob.getDate() + '/' +  dob.getFullYear();
    // insert the modal into the page when the information is sent over 
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
    // grab the close icon
    const close = document.querySelector('#modal-close-btn');
    // grab the modal
    const modal = document.querySelector('.modal-container');
    // listen for clicks on the close icon and then remove modal if clicked
    close.addEventListener('click', () => modal.remove());
}

const search = () => {
    searchContainer.innerHTML = `
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
    `
}

