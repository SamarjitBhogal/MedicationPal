/* Color changing on select for the day buttons: */
const dayBtn = document.querySelectorAll(".day-btn");

/* Holds the images uploaded be the user */
var imageFile1;
var imageFile2;

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

function listenUpload() {
    var input1 = document.getElementById("medImg-1");
    var input2 = document.getElementById("medImg-2");

    input1.addEventListener('change', (e) => {
        console.log("file input1 change noticed.");
        imageFile1 = e.target.files[0];
    });

    input2.addEventListener('change', (e) => {
        console.log("file input2 change noticed.");
        imageFile2 = e.target.files[0];
    });
}

listenUpload();

// Reference to the collection
const colMedicationRef = db.collection('MedicationInfo');
const colScheduleRef = db.collection('schedule');

// Event listener for form submission
document.getElementById('medicationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    console.log("Form submitted"); // Debugging

    // Get form data
    const userID = firebase.auth().currentUser.uid;

    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const time = document.getElementById('time').value;
    const desc = document.getElementById('desc').value;
    const repeat = document.getElementById('repeat').value;
    const date = "date field is deprecated";
    var days = "";

    dayBtn.forEach(element => {
        if (element.getAttribute("aria-pressed") == "true") {
            if(days == "")
            days += element.value;
        else
            days += "-" + element.value;
        }        
    });

    console.log("Form data:", name, type, date, days, time, desc, repeat); // Debugging

    //makes the schedule doc in the schedule collection
    colScheduleRef.add({
        time: time,
        repeat: repeat,
        days: days,
        sun: false,
        mon: false,
        tues: false,
        wed: false,
        thurs: false,
        fri: false,
        sat: false
    }).then((docRefSchedule) => {
        console.log("Schedule written with ID", docRefSchedule.id);

        // Adding medication entry
        colMedicationRef.add({
            user: userID,
            schedule: docRefSchedule.id,
            name: name,
            type: type,
            date: date,
            desc: desc,
            status: false
        })
        .then(function(docRefMedication) {
            console.log("Medication entry written with ID: ", docRefMedication.id);
            //upload the image to Storage on Firebase
            uploadImage(docRefMedication.id);

            //add medication entry id to schedule
            colScheduleRef.doc(docRefSchedule.id).update({
                medication: docRefMedication.id
            }).then(() => {
                console.log("added medication docID to schedule doc.");
            }).catch((e) => {
                console.error("Failed to add medication docID to schedule doc: ", e);
            });

            // Reset the form
            document.getElementById('medicationForm').reset();
        })
        .catch(function(error) {
            console.error("Error adding Medication entry: ", error);
        });
    }).catch((e) => {
        console.error("Error adding Schedule: ", e);
    });
});

function uploadImage(docID) {
    if(imageFile1) {
        putAndUpdate(imageFile1, docID);
        console.log("Uploaded image1.");
    } 
    if(imageFile2) {
        putAndUpdate(imageFile2, docID);
        console.log("Uploaded image2.");
    }
}

/* Puts the image in the Storage (not Firebase database) and updates the MedicationInfo doc with the proper ID */
function putAndUpdate(img, docID) {
    var fireStorage = storage.ref("images/" + docID + ".jpg");

    fireStorage.put(img).then(() => {
        console.log("put images.");
        fireStorage.getDownloadURL().then((url) => {
            console.log("downloaded URL.");
            colMedicationRef.doc(docID).update({
                "image": url
            }).then(() => {
                console.log("updated firestore.");
            }).catch((e) => {
                console.error("Error updating medication doc with image URL: ", e);
            });
        });
    }).catch((error) => {
        console.error("Image upload failed: ", error);
    });
}