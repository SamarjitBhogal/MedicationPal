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
