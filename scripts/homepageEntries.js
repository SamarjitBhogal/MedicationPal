/* 
    Need to work on: 
        - a message if there are no entries today (done)
        - a message if there are no entries at all 
        - have today's entries reset end of day if daily
            -  have the entries reset for select-days somehow 
        - deal with cut off end date with entries
*/

// these 2 get the current date:
var date = new Date();
var currDay = date.getDay();
// reference to the entry template DOM:
let entryTemp = document.getElementById("entry-template");
// these 2 used for displaying "no medication today":
let display = true;
let selectDayCount = 0;

/* This function is responsible for displaying the medication entries on the homepage */
function displayEntries() { 
    firebase.auth().onAuthStateChanged(user => {
        const userID = user.uid;        
        // if I dont make in past this line i have no entries
        db.collection("MedicationInfo").where("user", "==", userID).orderBy("timeNum").get().then((entries) => {
            entries.forEach((entry) => {
                // check if first daily type and handle it a different way
                if (entry.data().scheduleType == "daily") {
                    // display regardless of day
                    displayDailyEntries(entry);                                       
                } else {
                    // if not then handle it select-day way
                    displaySelectDayEntries(entry);                    
                }
            });
        }).catch((e) => {
            console.error("Could not find the user's entries: ", e);
        });         
    });
    //reset values
    display = true;
    selectDayCount = 0;
}

function displayDailyEntries(entry) {
    db.collection("MedicationInfo").doc(entry.id).collection("scheduleInfo").get().then((schedules) => {
        if (!schedules.empty) {
            schedules.forEach((scheDaily) => {
                let mediTime = new Date(entry.data().time.seconds*1000);
                let newEntry = entryTemp.content.cloneNode(true);
                let mediName = entry.data().name;
                let mediDose = entry.data().dose;
                let mediHours = mediTime.getHours();
                let mediMinutes = mediTime.getMinutes();
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
                newEntry.querySelector('.medi-time').id = "entry-time-" +  scheDaily.id;                 
                newEntry.querySelector('.medi-time').innerHTML = mediTime;
                newEntry.querySelector('#medi-name').innerHTML = mediName;
                newEntry.querySelector('#medi-dose').innerHTML = mediDose;
                newEntry.querySelector('#medi-status').innerHTML = mediStatus;                           
                
                //attach this entry to MedicationInfo-display div
                document.getElementById("MedicationInfo-display").appendChild(newEntry);
                //changing color of entry on homepage if completed
                if (scheDaily.data().status) {
                    document.getElementById("entry-card-" + scheDaily.id).style.backgroundColor = "#457B9D";
                    document.getElementById("entry-time-" +  scheDaily.id).style.textDecoration = "line-through";
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
                let mediTime = new Date(entry.data().time.seconds*1000);
                let newEntry = entryTemp.content.cloneNode(true);
                let mediName = entry.data().name;
                let mediDose = entry.data().dose;
                let mediHours = mediTime.getHours();
                let mediMinutes = mediTime.getMinutes();
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
                newEntry.querySelector('.medi-time').id = "entry-time-" +  scheSelect.id;                    
                newEntry.querySelector('.medi-time').innerHTML = mediTime;
                newEntry.querySelector('#medi-name').innerHTML = mediName;
                newEntry.querySelector('#medi-dose').innerHTML = mediDose;
                newEntry.querySelector('#medi-status').innerHTML = mediStatus;
                
                //attach this entry to MedicationInfo-display div
                document.getElementById("MedicationInfo-display").appendChild(newEntry);
                //changing color of entry on homepage if completed
                if (scheSelect.data().status) {
                    document.getElementById("entry-card-" + scheSelect.id).style.backgroundColor = "#457B9D";
                    document.getElementById("entry-time-" +  scheSelect.id).style.textDecoration = "line-through";
                }     
                // adding an event listening to the entry do it gives the modal when clicked
                document.getElementById("entry-" + scheSelect.id).addEventListener('click', (e) => {
                    handleEntryModal(entry, scheSelect, mediStatus, scheSelect.data().status);
                });
                // used for displaying "no medication today"
                selectDayCount++;
            });
        } else {
            console.log("No select-type scehdules today");
            // used for displaying "no medication today"
            display = false;
        }  
        // used for displaying "no medication today"
        // if (!display && selectDayCount == 0) {
        //     // handle no schedule
        //     let heading = document.createElement("h5");
        //     let card = document.createElement("div");
        //     heading.innerHTML= "No medication today"
        //     card.setAttribute("class", "no-schedule-card");
        //     card.appendChild(heading);
        //     document.getElementById("MedicationInfo-display").appendChild(card);
        // }                     
    }).catch((e) => {
        console.error("Could not find today's entries: ", e);
    });
}

function handleEntryModal(entryRef, scheduleRef, statusAsString, status) {
    const entryConf = new bootstrap.Modal(document.getElementById("home-entry-conf"));
    entryConf.show();
    //check if status is true then display undo btn
    if (status) {
        document.getElementById("undo-entry-display").toggleAttribute("hidden");
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

    // hidding again to make sure entries that don't have true status don't have this button
    document.getElementById("undo-entry-display").toggleAttribute("hidden");
}
function doctersInfo() {
    console.log("doctah is running");

    // Reference to the Firestore database
    const db = firebase.firestore();

    // Reference to the specific document in Firestore
    const docRef = db.collection("users").doc("gj57GjCGhMYzroanUf9U3YU6hEU2");

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
}

function notifPop(){
    db.collection("MedicationInfo").doc(entry.id).collection("scheduleInfo").doc(time);

}



doctersInfo(); //runs the function

displayEntries();