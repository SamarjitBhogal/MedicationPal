/* 
    Need to work on: 
        - visual confirmation of completing entry
        - a message if there are no entries today
        - a message if there are no entries at all  
*/

/* This function is responsible for displaying the medication entries on the homepage */
var date = new Date();
var currDay = date.getDay();
function displayEntries() {
    firebase.auth().onAuthStateChanged(user => {
        const userID = user.uid;
        let entryTemp = document.getElementById("entry-template");

        db.collection("MedicationInfo").where("user", "==", userID).orderBy("timeNum").get().then((entries) => {
            entries.forEach((entry) => {
                // check if first daily type and handle it a different way
                if (entry.data().scheduleType == "daily") {
                    // display regardless of day
                    db.collection("MedicationInfo").doc(entry.id).collection("scheduleInfo").get().then((schedules) => {
                        schedules.forEach((scheDaily) => {
                            let mediTime = new Date(entry.data().time.seconds*1000);
                            let newEntry = entryTemp.content.cloneNode(true);
                            //newEntry.id = "entry-" + sche.id;
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
                                // checks if time is greater than or equal to 1300 and minus 12 to displat 12 hour time format
                                entry.data().timeNum >= 1300 ? mediTime = (mediHours -12) + ":" + mediMinutes + " PM" : mediTime = mediHours + ":" + mediMinutes + " PM";
                            }
                            
                            newEntry.querySelector('.entry-btn').id = "entry-" + scheDaily.id;
                            newEntry.querySelector('.entry-card').id = "entry-card-" + scheDaily.id;
                            
                            if (scheDaily.data().status) {
                                mediStatus = "Completed";
                                //document.getElementById("entry-card-" + scheDaily.id).style.backgroundColor = "#457B9D";
                            } else {
                                mediStatus = "Not Yet Taken";
                            }                            

                            newEntry.querySelector('#medi-time').innerHTML = mediTime;
                            newEntry.querySelector('#medi-name').innerHTML = mediName;
                            newEntry.querySelector('#medi-dose').innerHTML = mediDose;
                            newEntry.querySelector('#medi-status').innerHTML = mediStatus;                            
                            

                            //attach this entry to MedicationInfo-display div
                            document.getElementById("MedicationInfo-display").appendChild(newEntry);
                            // adding an event listening to the entry do it gives the modal when clicked
                            document.getElementById("entry-" + scheDaily.id).addEventListener('click', (e) => {
                                handleEntryModal(entry, scheDaily, mediStatus, scheDaily.data().status);
                            });
                        });
                    }).catch((e) => {
                        console.error("Cound not find dailiy schedules: ", e);
                    })
                } else {
                    // if not then handle it select-day way
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
                                    // checks if time is greater than or equal to 1300 and minus 12 to displat 12 hour time format
                                    entry.data().timeNum >= 1300 ? mediTime = (mediHours -12) + ":" + mediMinutes + " PM" : mediTime = mediHours + ":" + mediMinutes + " PM";
                                }

                                newEntry.querySelector('.entry-btn').id = "entry-" + scheSelect.id;
                                newEntry.querySelector('.entry-card').id = "entry-card-" + scheSelect.id;
                                
                                if (scheSelect.data().status) {
                                    mediStatus = "Completed";
                                    //document.getElementById("entry-card-" + scheSelect.id).style.backgroundColor = "#457B9D";
                                } else {
                                    mediStatus = "Not Yet Taken";
                                }                            

                                newEntry.querySelector('#medi-time').innerHTML = mediTime;
                                newEntry.querySelector('#medi-name').innerHTML = mediName;
                                newEntry.querySelector('#medi-dose').innerHTML = mediDose;
                                newEntry.querySelector('#medi-status').innerHTML = mediStatus;
                                
                                //attach this entry to MedicationInfo-display div
                                document.getElementById("MedicationInfo-display").appendChild(newEntry);
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
            });
        }).catch((e) => {
            console.error("Could not find the user's entries: ", e);
        });
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

// old way
function displayEntries2() {
    firebase.auth().onAuthStateChanged(user => {
        const userID = user.uid;

        db.collection("MedicationInfo").where("user", "==", userID).get().then((userEntries) => {
            var markerNum = 1;
            var completedNum = 1;
            userEntries.forEach((entry) => {
                var status = entry.data().status; 

                if (!status) {
                    displayUpcoming(entry, markerNum);
                    markerNum++;
                } else {
                    displayCompleted(entry, completedNum);
                    completedNum++;
                }            
            });
        });
    });
}

function displayUpcoming(e, n) {
    var name = e.data().name;
    var type = e.data().type;
    var date = e.data().date;
    var time = e.data().time;
    var status = e.data().status;

    var tr = document.createElement("tr");
    var td = markerBtn(n);
    tr.appendChild(td);
    var tdName = document.createElement("td");
    tdName.innerHTML = name;
    tr.appendChild(tdName);
    var tdType = document.createElement("td");
    tdType.innerHTML = type;
    tr.appendChild(tdType);
    var tdTime = document.createElement("td");
    tdTime.innerHTML = time;
    tr.appendChild(tdTime);
    var tdDate = document.createElement("td");
    tdDate.innerHTML = date;
    tr.appendChild(tdDate);

    document.getElementById("hpage-upcoming-tb").appendChild(tr);
    $("#marker-btn" + n).load("../components/markerBtn.html");
}

//e is entity, n is number in the current iteration
function displayCompleted(e, n) {
    var name = e.data().name;
    var type = e.data().type;
    var date = e.data().date;
    var time = e.data().time;
    var status = e.data().status;

    var tr = document.createElement("tr");
    var td = undoBtn(n);
    tr.appendChild(td);
    var tdName = document.createElement("td");
    tdName.innerHTML = name;
    tr.appendChild(tdName);
    var tdType = document.createElement("td");
    tdType.innerHTML = type;
    tr.appendChild(tdType);
    var tdTime = document.createElement("td");
    tdTime.innerHTML = time;
    tr.appendChild(tdTime);
    var tdDate = document.createElement("td");
    tdDate.innerHTML = date;
    tr.appendChild(tdDate);

    document.getElementById("hpage-completed-tb").appendChild(tr);
    $("#completed-btn" + n).load("../components/undoBtn.html");
}


function undoBtn(num) {
    var td = document.createElement("td");
    var markerDiv = document.createElement("div");
    markerDiv.setAttribute("id", "completed-btn" + num);
    td.appendChild(markerDiv);
    return td;
}

function markerBtn(num) {
    var td = document.createElement("td");
    var markerDiv = document.createElement("div");
    markerDiv.setAttribute("id", "marker-btn" + num);
    markerDiv.addEventListener("click", function() {
        moveRowToCompleted(num); // Call function to move row to completed table
        saveCompletedRow(num); // Save completed row to Firestore
    });
    td.appendChild(markerDiv);
    return td;
}

function moveRowToCompleted(num) {
    console.log("button click is working for function moverow") //working
    // Get the row to move
    var rowToMove = document.getElementById("hpage-upcoming-tb").querySelector("tr:nth-child(" + num + ")");
    
    if (rowToMove) {
        // Remove the row from the upcoming table
        rowToMove.parentNode.removeChild(rowToMove);
        // Add the row to the completed table
        document.getElementById("hpage-completed-tb").appendChild(rowToMove);
    } else {
        console.log("Row not found in the upcoming table.");
    }
}

function saveCompletedRow(num) {
    console.log("button click is working for function saverow") //working
    var user = firebase.auth().currentUser;
        var userID = user.uid;
        var docRef = db.collection("MedicationInfo").doc(userID);
        // Update the status field to true (but not really tho)
        docRef.update({
            status: true
        })
        .then(() =>{
        console.log("document successfully updated");
    })
    .catch((error) =>{
        console.log("error", error);
    });


}
displayEntries();
//displayEntries2();