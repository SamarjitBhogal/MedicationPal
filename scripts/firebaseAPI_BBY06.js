//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyAqupA6k32OE27N_N9COAToRVqu9XrLjh0",
    authDomain: "bby06-8ff4b.firebaseapp.com",
    databaseURL: "https://bby06-8ff4b-default-rtdb.firebaseio.com",
    projectId: "bby06-8ff4b",
    storageBucket: "bby06-8ff4b.appspot.com",
    messagingSenderId: "999215274406",
    appId: "1:999215274406:web:68284ec27d4d161a0e5767"
};

//--------------------------------------------
// Initialize the Firebase app
// Initialize Firestore database if using it
//--------------------------------------------
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Reference database
var medicationFormDB = firebase.database().ref("medicationForm");

// Event listener for form submission
document.getElementById("medicationForm").addEventListener("submit", submitForm);

// Prevent default action of form
//when you refresh it doesnt automatically deletes everything (or something)
function submitForm(e) {
    e.preventDefault();

    // Get inputs
    var name = getElementval("name");
    var type = getElementval("type");
    var date = getElementval("date");
    var time = getElementval("time");
    var desc = getElementval("desc");

    //call function
    saveMessages(name, type, date, time, desc);   

    //create alert
    document.get
}

//save message to firebase
const saveMessages = (name, type, date, time, desc) => {
    //push these values into our database
    var newMedicationForm = medicationFormDB.push();

    newMedicationForm.set({
        name : name,
        type : type,
        date : date,
        time : time,
        desc : desc,

    });
    //reset form
    document.getElementById("medicationForm").reset();

};

// Get value of each field
const getElementval = (id) => {
    return document.getElementById(id).value;
}

const db = firebase.firestore();
const storage = firebase.storage();
