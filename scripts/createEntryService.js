/* Color changing on select for the day buttons: */
const dayBtn = document.querySelectorAll(".day-btn");
var fireStorageImageLocation;
var scheduleDocs = Array();

// adds an event listener to each day button and handles the color change
dayBtn.forEach(button => {
    button.addEventListener('click', () => {
        if (button.getAttribute("aria-pressed") == "false") {
            button.style.backgroundColor = "#457B9D";
        } else {
            button.style.backgroundColor = "#1d3557";
        }
        button.style.color = "#f1faee";
        checkAllButtons();
    });
});

//responsible for listening to the buttons beside dosage to increment and decrement
document.getElementById('add1').addEventListener('click', () => {
    let val = document.getElementById('dose').value;
    document.getElementById('dose').value = ++val;
});

document.getElementById('remove1').addEventListener('click', () => {
    let val = document.getElementById('dose').value;
    // make sure no negative values
    if (val != 1) {
        document.getElementById('dose').value = --val;
    }
});

/* Holds the images uploaded be the user */
var imageFile1;
//event listener for the file input
document.getElementById("medImg-1").addEventListener('change', (e) => {
        imageFile1 = e.target.files[0];
        // displaying conformation message in HTML:
        document.getElementById("image-conf-msg").toggleAttribute("hidden");
});

// Reference to the collection
var colMedicationRef = db.collection('MedicationInfo');

// Event listener for form submission
document.getElementById('medicationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form data
    const userID = firebase.auth().currentUser.uid;

    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const time = document.getElementById('time').value;
    /* 
        these 2 values below are used to make a Date object that we can use to easily get the hours and minutes 
        to do these use: getHours() and getMinutes() on the date object
    */
    var hours;
    var mins;
    const desc = document.getElementById('desc').value;
    const repeat = document.getElementById('repeat').value;
    const dose = document.getElementById('dose').value;
    const endDate = document.getElementById('endDate').value;
    var scheduleType;

    //translates the buttons and stores the data accordingly
    // 0-6 == sun-sat
    var days = "";

    dayBtn.forEach(element => {
        if (element.getAttribute("aria-pressed") == "true") {
            if(days == "")
            days += element.value;
        else
            days += "-" + element.value;
        }        
    });
    // make the days selected populate an array:
    var daysArray = days.split('-');
    // deduce what the schedule type will be:
    if (daysArray.length == 7) {
        scheduleType = "daily";
    } else {
        scheduleType = "select-days";
    }

    // making time as a number:
    var timeArray = time.split(":");
    var timeAsString = "";
    timeArray.forEach((t) => {
        timeAsString += t;
    });
    var timeAsNumber = parseInt(timeAsString);
    // these values are assigned
    hours = timeArray[0];
    mins = timeArray[1];

    // Adding medication entry
    /* 
        We are no longer storing time as a String. We will have 2 options
        1. time as a number
        2. time from a Date object    
    */
    colMedicationRef.add({
        user: userID,
        name: name,
        type: type,
        dose: parseInt(dose),
        desc: desc,
        repeat: repeat,
        end: endDate,
        time: new Date(0, 0, 0, hours, mins),
        timeNum: timeAsNumber,
        scheduleType: scheduleType,
    })
    .then(function(docRefMedication) {
        // adding the specific schedule in the scheduleInfo collection 
        if (scheduleType == "daily") {
            // adding a daily schedule
            colMedicationRef.doc(docRefMedication.id).collection('scheduleInfo').add({
                time: timeAsNumber,
                status: false,
                day: "daily"
            }).then(() => {
                console.log("daily schedule added.");
            }).catch((e) => {
                console.error("Daily schedule cannot be added: ", e);
            });
        } else if (scheduleType == "select-days") {
            // adding each selected day as it's own doc
            for (let i = 0; i < daysArray.length; i++) {
                // day will be one of 0-6 which is sun-sat
                colMedicationRef.doc(docRefMedication.id).collection('scheduleInfo').add({
                    day: parseInt(daysArray[i]),
                    time: timeAsNumber,
                    status: false
                }).then((scheduleDoc) => {
                    scheduleDocs.push(scheduleDoc);
                    console.log(i + "day is added in select-days schedule.");
                }).catch((e) => {
                    console.error("Select-days schedule cannot be added: ", e);
                });
            }
        } else {
            console.log("No schedule type is defined! Schedule doc not created!");
        }
        //upload the image to Storage on Firebase
        uploadImage(docRefMedication.id);
        // gives modal feedback of entry being created with a function call.
        const entryConf = new bootstrap.Modal(document.getElementById("entry-conf"));
        entryConf.show();

        //event listener for the entry-conf modal's undo button that pops up when submitting an entry
        document.getElementById("undo-btn").addEventListener('click', () => {
            // remove schedule collection first then the actual medication entry doc and then finally the image if there was any.
            db.collection('MedicationInfo').doc(docRefMedication.id).collection('scheduleInfo')
            .get().then((schedules) => {
                schedules.forEach((schedule) => {
                    db.collection('MedicationInfo').doc(docRefMedication.id).collection('scheduleInfo').doc(schedule.id).delete().then(() => {
                        console.log("Deleted a schedule doc.");
                    }).catch((e) => {
                        console.error("Could not delete schedule doc: ", e);
                    });
                });
            }).catch((e) => {
                console.error("Could not get any schedules! ", e);
            });
            //removing the medication entry and the image if there is one
            docRefMedication.delete().then(() => {
                if (imageFile1) {
                    fireStorageImageLocation.delete().then(() => {
                        console.log("Image removed from Firebase Storage.")
                    }).catch((e) => {
                        console.error("Image cound not be removed from Firebase Storage: ", e);
                    });
                }
                console.log("Removed medication entry.");
            }).catch((e) => {
                console.error("Medication entry cound not be removed from database: ", e);
            })
            
        });
    }).catch(function(error) {
        console.error("Error adding Medication entry: ", error);
    });
});

function uploadImage(docID) {
    if(imageFile1) {
        putAndUpdate(imageFile1, docID);
    }
}

/* Puts the image in the Storage (not Firebase database) and updates the MedicationInfo doc with the proper ID */
function putAndUpdate(img, docID) {
    fireStorageImageLocation = storage.ref("images/" + docID + ".jpg");

    fireStorageImageLocation.put(img).then(() => {
        fireStorageImageLocation.getDownloadURL().then((url) => {
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

function checkAllButtons() {
    let count = 0;
    dayBtn.forEach(button => {
        if (button.getAttribute("aria-pressed") == "true") {
            count++;
        }
    });

    if (count == 7) {
        document.getElementById("repeat").value = "daily";
    } else {
        document.getElementById("repeat").value = "weekly";
    }
}

/*
    Resets the form.
*/
function refreshForm() {
    document.getElementById('medicationForm').reset();
    resetDayBtns();
}

//resets the day buttons to unselected and back to their normal colors
function resetDayBtns() {
    dayBtn.forEach(button => {
        button.setAttribute('aria-pressed', false);
        button.style.backgroundColor = "#457B9D";
    });
}