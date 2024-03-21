/* Color changing on select for the day buttons: */
const dayBtn = document.querySelectorAll(".day-btn");

dayBtn.forEach(element => {
    element.addEventListener('click', () => {
        if (element.getAttribute("aria-pressed") == "false") {
            element.style.backgroundColor = "#457B9D";
        } else {
            element.style.backgroundColor = "#1d3557";
        }
        element.style.color = "#f1faee";
    });
});

// Reference to the collection
const colRef = db.collection('MedicationInfo');

// Event listener for form submission
document.getElementById('medicationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    console.log("Form submitted"); // Debugging

    // Get form data
    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const time = document.getElementById('time').value;
    const desc = document.getElementById('desc').value;
    const repeat = document.getElementById('repeat').value;
    const date = "temporary date placeholder";
    var days = "";

    dayBtn.forEach(element => {
        if (element.getAttribute("aria-pressed") == "true") {
            days += "-" + element.value;
        }        
    });

    console.log("Form data:", name, type, date, days, time, desc, repeat); // Debugging

    const userID = firebase.auth().currentUser.uid;

    // Add data to Firestore
    // NOTE: days will be the new date, date is kepts for now so things do not break
    colRef.add({
        user: userID,
        name: name,
        type: type,
        date: date,
        days: days,
        time: time,
        desc: desc,
        repeat: repeat,
        status: false
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        // Reset the form
        document.getElementById('medicationForm').reset();
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
});

function uploadImage() {
    console.log("supposed to upload image.");
}