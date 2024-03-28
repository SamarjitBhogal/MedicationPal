/* Color changing on select for the day buttons: */
const dayBtn = document.querySelectorAll(".day-btn");
var fireStorageImageLocation;

// adds an event listener to each day button and handles the color change
dayBtn.forEach(button => {
    button.addEventListener('click', () => {
        if (button.getAttribute("aria-pressed") == "false") {
            button.style.backgroundColor = "#457B9D";
        } else {
            button.style.backgroundColor = "#1d3557";
        }
        button.style.color = "#f1faee";
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
document.getElementById("medImg-1").addEventListener('change', () => {
        console.log("file input1 change noticed.");
        imageFile1 = e.target.files[0];
        // displaying conformation message in HTML:
        document.getElementById("image-conf-msg").toggleAttribute("hidden");

        // make image upload cancel sequence
});

// Reference to the collection
var colMedicationRef = db.collection('MedicationInfo');

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
    const dose = document.getElementById('dose').value;
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

    if (daysArray.length == 7) {
        scheduleType = "daily";
    } else {
        scheduleType = "select-days";
    }

    console.log("Form data:", name, type, days, time, desc, repeat); // Debugging

    // Adding medication entry
    colMedicationRef.add({
        user: userID,
        name: name,
        type: type,
        dose: dose,
        desc: desc,
        repeat: repeat,
        scheduleType: scheduleType,
    })
    .then(function(docRefMedication) {
        // adding the specific schedule in the scheduleInfo collection 
        if (scheduleType == "daily") {
            // adding a daily schedule
            colMedicationRef.doc(docRefMedication.id).collection('scheduleInfo').add({
                time: time,
                status: false
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
                    day: daysArray[i],
                    time: time,
                    staus: false
                }).then(() => {
                    console.log(i + "day is added in select-days schedule.");
                }).catch((e) => {
                    console.error("Select-days schedule cannot be added: ", e);
                });
            }
        } else {
            console.log("No schedule type is defined! Schedule doc not created!");
        }
        console.log("Medication entry written with ID: ", docRefMedication.id);
        //upload the image to Storage on Firebase
        uploadImage(docRefMedication.id);
        // Reset the form
        document.getElementById('medicationForm').reset();
        // reset the day selectors too with a function call.
        resetDayBtns();
        // gives modal feedback of entry being created with a function call.
        const entryConf = new bootstrap.Modal(document.getElementById("entry-conf"));
        entryConf.show();

        //event listener for the entry-conf modal's undo button that pops up when submitting an entry
        document.getElementById("undo-btn").addEventListener('click', () => {
            var j = Array();
            // remove schedule collection first then the actual medication entry doc and then finally the image if there was any.
            db.collection('MedicationInfo').doc(docRefMedication.id).collection('scheduleInfo')
            .get().then((schedules) => {
                schedules.forEach((schedule) => {
                    schedule.delete().then(() => {
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
        console.log("Uploaded image1.");
    }
}

/* Puts the image in the Storage (not Firebase database) and updates the MedicationInfo doc with the proper ID */
function putAndUpdate(img, docID) {
    fireStorageImageLocation = storage.ref("images/" + docID + ".jpg");

    fireStorageImageLocation.put(img).then(() => {
        console.log("put images.");
        fireStorageImageLocation.getDownloadURL().then((url) => {
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

//resets the day buttons to unselected and back to their normal colors
function resetDayBtns() {
    dayBtn.forEach(button => {
        button.setAttribute('aria-pressed', false);
        button.style.backgroundColor = "#457B9D";
    });
}