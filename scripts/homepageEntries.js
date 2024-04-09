/* 
    Need to work on: 
        - a message if there are no entries today 
        - a message if there are no entries at all (done)
        - have today's entries reset end of day if daily
            -  have the entries reset for select-days somehow 
        - deal with cut off end date with entries
*/

// these 2 get the current date:
var date = new Date();
var currDay = date.getDay();
// reference to the entry template DOM:
let entryTemp = document.getElementById("entry-template");
/* 
    This function is responsible for displaying the medication entries on the homepage
    It calls other functions to help it do it's tasks.
 */
function displayEntries() {
    firebase.auth().onAuthStateChanged(user => {
        const userID = user.uid;

        refreshEntries();

        db.collection("MedicationInfo").where("user", "==", userID).orderBy("timeNum").get().then((entries) => {
            // if I dont make in past this line i have no entries
            if (entries.empty) {
                displayNoEntriesMessage();
            } else {
                // displays the view entry btn only if there are entries
                document.getElementById("view-entries-btn").toggleAttribute("hidden");
            }

            entries.forEach((entry) => {
                // check if first daily type and handle it a different way
                if (entry.data().scheduleType == "daily") {
                    // display regardless of day
                    // this also means that no matter the day there will be an entry
                    displayDailyEntries(entry);
                } else {
                    // if not then handle it select-day way
                    // this is where we handle to cases of there not being an entry
                    displaySelectDayEntries(entry);
                }
            });
            //displayNoEntryToday();
        }).catch((e) => {
            console.error("Could not find the user's entries: ", e);
        });
    });
}

function displayDailyEntries(entry) {
    db.collection("MedicationInfo").doc(entry.id).collection("scheduleInfo").get().then((schedules) => {
        if (!schedules.empty) {
            schedules.forEach((scheDaily) => {
                // defining data needed to display entry
                let mediTime = new Date(entry.data().time.seconds * 1000);
                let newEntry = entryTemp.content.cloneNode(true);
                let mediName = entry.data().name;
                let mediDose = entry.data().dose;
                let mediHours = mediTime.getHours();
                let mediMinutes = ((mediTime.getMinutes() < 10)? "0" + mediTime.getMinutes() : mediTime.getMinutes());
                let mediStatus;

                if (entry.data().timeNum - 1200 < 0) {
                    //the AM assignment
                    mediTime = mediHours + ":" + mediMinutes + " AM";
                } else {
                    //the PM assignment
                    // checks if time is greater than or equal to 1300 and minus 12 to display 12 hour time format
                    entry.data().timeNum >= 1300 ? mediTime = (mediHours - 12) + ":" + mediMinutes + " PM" : mediTime = mediHours + ":" + mediMinutes + " PM";
                }

                mediStatus = scheDaily.data().status ? "Completed" : "Not Yet Taken";

                newEntry.querySelector('.entry-btn').id = "entry-" + scheDaily.id;
                newEntry.querySelector('.entry-card').id = "entry-card-" + scheDaily.id;
                newEntry.querySelector('.medi-time').id = "entry-time-" + scheDaily.id;
                newEntry.querySelector('.medi-time').innerHTML = mediTime;
                newEntry.querySelector('#medi-name').innerHTML = mediName;
                newEntry.querySelector('#medi-dose').innerHTML = mediDose;
                newEntry.querySelector('#medi-status').innerHTML = mediStatus;

                //attach this entry to MedicationInfo-display div
                document.getElementById("MedicationInfo-display").appendChild(newEntry);
                //changing color of entry on homepage if completed
                if (scheDaily.data().status) {
                    document.getElementById("entry-card-" + scheDaily.id).style.backgroundColor = "#457B9D";
                    document.getElementById("entry-time-" + scheDaily.id).style.textDecoration = "line-through";
                }
                // adding an event listening to the entry do it gives the modal when clicked
                document.getElementById("entry-" + scheDaily.id).addEventListener('click', (e) => {
                    handleEntryModal(entry, scheDaily, mediStatus, scheDaily.data().status);
                });
            });
        } else {
            // used for displaying "no medication today"
            display = false;
            console.log("No daily schedule");
        }
    }).catch((e) => {
        console.error("Cound not find daily schedules: ", e);
    });
}

function displaySelectDayEntries(entry) {
    db.collection("MedicationInfo").doc(entry.id).collection("scheduleInfo").where("day", "==", currDay)
        .get().then((schedules) => {
            if (!schedules.empty) {
                //displaying the entries that occur today ONLY
                schedules.forEach((scheSelect) => {
                    let mediTime = new Date(entry.data().time.seconds * 1000);
                    let newEntry = entryTemp.content.cloneNode(true);
                    let mediName = entry.data().name;
                    let mediDose = entry.data().dose;
                    let mediHours = mediTime.getHours();
                    let mediMinutes = ((mediTime.getMinutes() < 10)? "0" + mediTime.getMinutes() : mediTime.getMinutes());
                    let mediStatus;

                    if (entry.data().timeNum - 1200 < 0) {
                        //the AM assignment
                        mediTime = mediHours + ":" + mediMinutes + " AM";
                    } else {
                        //the PM assignment
                        // checks if time is greater than or equal to 1300 and minus 12 to display 12 hour time format
                        entry.data().timeNum >= 1300 ? mediTime = (mediHours - 12) + ":" + mediMinutes + " PM" : mediTime = mediHours + ":" + mediMinutes + " PM";
                    }

                    mediStatus = scheSelect.data().status ? "Completed" : "Not Yet Taken";

                    newEntry.querySelector('.entry-btn').id = "entry-" + scheSelect.id;
                    newEntry.querySelector('.entry-card').id = "entry-card-" + scheSelect.id;
                    newEntry.querySelector('.medi-time').id = "entry-time-" + scheSelect.id;
                    newEntry.querySelector('.medi-time').innerHTML = mediTime;
                    newEntry.querySelector('#medi-name').innerHTML = mediName;
                    newEntry.querySelector('#medi-dose').innerHTML = mediDose;
                    newEntry.querySelector('#medi-status').innerHTML = mediStatus;

                    //attach this entry to MedicationInfo-display div
                    document.getElementById("MedicationInfo-display").appendChild(newEntry);
                    //changing color of entry on homepage if completed
                    if (scheSelect.data().status) {
                        document.getElementById("entry-card-" + scheSelect.id).style.backgroundColor = "#457B9D";
                        document.getElementById("entry-time-" + scheSelect.id).style.textDecoration = "line-through";
                    }
                    // adding an event listening to the entry do it gives the modal when clicked
                    document.getElementById("entry-" + scheSelect.id).addEventListener('click', (e) => {
                        handleEntryModal(entry, scheSelect, mediStatus, scheSelect.data().status);
                    });
                });
            } else {
                console.log("No select-type scehdules today");
            }
        }).catch((e) => {
            console.error("Could not find today's entries: ", e);
        });
}

function displayNoEntryToday() {
    console.log("displayNoEntryToday has been called");
    //display msg
    if (!document.getElementById("MedicationInfo-display").hasChildNodes()) {
        let heading = document.createElement("h5");
        let card = document.createElement("div");
        heading.innerHTML = "No medication today"
        card.setAttribute("class", "no-schedule-card");
        card.appendChild(heading);
        document.getElementById("MedicationInfo-display").appendChild(card);
    }
}

function displayNoEntriesMessage() {
    // show create entry button since there is no entries
    document.getElementById("create-entries-btn").toggleAttribute("hidden");

    let noEntryDisplay = document.createElement("div");
    let heading = document.createElement("h5");

    heading.innerHTML = "You have no entries currently.";
    noEntryDisplay.setAttribute("class", "no-entries-card");

    noEntryDisplay.appendChild(heading);
    document.getElementById("MedicationInfo-display").appendChild(noEntryDisplay);
}

function handleEntryModal(entryRef, scheduleRef, statusAsString, status) {
    const entryConf = new bootstrap.Modal(document.getElementById("home-entry-conf"));
    entryConf.show();
    //check if status is true then display undo btn and hide take btn
    if (status) {
        document.getElementById("undo-entry-display").style.display = "block";
        document.getElementById("take-entry-display").style.display = "none";
    } else {
        document.getElementById("undo-entry-display").style.display = "none";
        document.getElementById("take-entry-display").style.display = "block";
    }

    db.collection("MedicationInfo").doc(entryRef.id).get().then((doc) => {
        document.getElementById('modal-medi-name').innerHTML = doc.data().name;
        document.getElementById('modal-medi-dose').innerHTML = doc.data().dose;
        document.getElementById('modal-medi-status').innerHTML = statusAsString;
    });

    // event listeners for buttons on modal
    $('#undo-entry-btn').on('click', (e) => {
        db.collection("MedicationInfo").doc(entryRef.id).collection("scheduleInfo").doc(scheduleRef.id)
            .update({
                status: false
            }).then((schedule) => {
                console.log("medication status undone!");
                // update homepage view
                location.reload();
            }).catch((e) => {
                console.error("Could not update status: ", e);
            });
            // hidding again to make sure entries that don't have true status don't have this button
            document.getElementById("undo-entry-display").toggleAttribute("hidden");
    });

    $('#take-entry-btn').on('click', (e) => {
        // update database status        
        db.collection("MedicationInfo").doc(entryRef.id).collection("scheduleInfo").doc(scheduleRef.id)
            .update({
                status: true
            }).then((schedule) => {
                console.log("medication taken!");
                // update homepage view
                location.reload();
            }).catch((e) => {
                console.error("Could not update status: ", e);
            });
    });

    
}

function getTime(doc) {
    let mediTime = new Date(doc.data().time.seconds * 1000);
    let mediHours = mediTime.getHours();
    let mediMinutes = ((mediTime.getMinutes() < 10)? "0" + mediTime.getMinutes() : mediTime.getMinutes());
    if (doc.data().timeNum - 1200 < 0) {
        //the AM assignment
        mediTime = mediHours + ":" + mediMinutes + " AM";
    } else {
        //the PM assignment
        // checks if time is greater than or equal to 1300 and minus 12 to display 12 hour time format
        doc.data().timeNum >= 1300 ? mediTime = (mediHours - 12) + ":" + mediMinutes + " PM" : mediTime = mediHours + ":" + mediMinutes + " PM";
    }
    return mediTime;
}

function doctersInfo() {
    firebase.auth().onAuthStateChanged(user => {
        const userID = user.uid;
        console.log("doctah is running");

        // Reference to the Firestore database
        const db = firebase.firestore();

        // Reference to the specific document in Firestore
        const docRef = db.collection("users").doc(userID);

        // Fetch the document from Firestore
        docRef.get().then((doc) => {
            if (doc.exists) {
                // Access the data from the document
                const data = doc.data();
                const name2 = data.name2;
                const num = data.num;
                const email2 = data.email2;
                const address = data.address;

                // Concatenate or format both values together with a newline
                const outputText = `<p> <b>Name: ${name2}<p> Phone Number:  ${num} <p> Email: ${email2}<p> Location: ${address} </b>`;

                // Update the HTML with the concatenated value
                document.getElementById("doctor-info-here").innerHTML += outputText;
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    })
}


function refreshEntries() {
    // reset entries to uncomplete and reset progress
}

doctersInfo(); //runs the function

// create a function to update the date and time
// this is mainly for testing values
function updateDateTime() {
    // create a new `Date` object
    const now = new Date();

    // get the current date and time as a string
    const currentDateTime = now.toLocaleString();

    // update the `textContent` property of the `span` element with the `id` of `datetime`
    document.querySelector('#datetime').textContent = currentDateTime;
    var d = new Date(); // for now
    const hr = d.getHours(); // => 
    const min = d.getMinutes(); // => 
    const sec = d.getSeconds();


    combi = "" + hr + min;
    typeof Number(combi);
    console.log(combi);
}

// call the `updateDateTime` function every second
setInterval(updateDateTime, 1000);

//create a function that compares the date object to the time in our database
function notifPop(collection) {
    firebase.auth().onAuthStateChanged(user => {
        const toastLiveExample = document.getElementById('liveToast');
        // create a new `Date` object
        const now = new Date();

        // get the current date and time as a string
        const currentDateTime = now.toLocaleString();

        // update the `textContent` property of the `span` element with the `id` of `datetime`
        document.querySelector('#datetime').textContent = currentDateTime;

        const userID = user.uid;
        //initialize time
        const time =
            console.log("notif is running");

        // Reference to the Firestore database
        const db = firebase.firestore();

        // Reference to the specific document in Firestore
        const docRef = db.collection("users").doc(userID);

        // Fetch the document from Firestore
        docRef.get().then((doc) => {
            if (doc.exists) {
                userid = user.uid;
                const data = doc.data();
                const time = data.time;
                // create a new `Date` object
                const now = new Date();

                // get the current date and time as a string
                const currentDateTime = now.toLocaleString();

                // update the `textContent` property of the `span` element with the `id` of `datetime`
                document.querySelector('#datetime').textContent = currentDateTime;
                var d = new Date(); // for now
                const hr = d.getHours(); // => getting hours of the current time
                const min = d.getMinutes(); // =>  getting minutes of the current time
                const sec = d.getSeconds();

                console.log("current: " + hr + " " + min + " " + sec);

                //concatenating both of them together
                combi = "" + hr + min;
                //typecast that to a number
                typeof Number(combi);
                //print out to see current number
                console.log(combi);


                db.collection(collection).where("user", "==", userid).get()
                    .then(allEntries => {
                        allEntries.forEach(doc => { //iterate thru each doc
                            let mediTime = new Date(doc.data().time.seconds * 1000);
                            let mediHour = mediTime.getHours();
                            let mediMin = mediTime.getMinutes();
                            let mediSec = mediHour * 3600 + mediMin * 60 + mediTime.getSeconds();

                            let curSec = hr * 3600 + min * 60 + sec;

                            let milliSec = mediSec * 1000;
                            let currMilliSec = curSec * 1000;

                            if (milliSec - currMilliSec > 0) {
                                setTimeout(function() {
                                    //alert(doc.data().name + "hehhehehhe");
                                    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                                    document.getElementById("medi-name-nofi").innerHTML = doc.data().name;
                                    document.getElementById("medi-time-nofi").innerHTML = getTime(doc);
                                    toastBootstrap.show();
                                }, milliSec - currMilliSec);
                            }
                        })
                    })
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    })
};

notifPop("MedicationInfo");
displayEntries();  