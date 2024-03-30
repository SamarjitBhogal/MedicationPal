/* This function is responsible for displaying the medication entries on the homepage */
function displayEntries() {
    firebase.auth().onAuthStateChanged(user => {
        const userID = user.uid;
        var date = new Date();
        var currDay = date.getDay();

        let entryTemp = document.getElementById("entry-template");
        var mediName;
        var mediDose;
        var mediStatus;
        var mediTime;
        var mediHours;
        var mediMinutes;

        db.collection("MedicationInfo").where("user", "==", userID).orderBy("timeNum").get().then((entries) => {
            entries.forEach((entry) => {
                mediTime = entry.data().time;
                console.log(mediTime);
                // check if first daily type and handle it a different way
                if (entry.data().scheduleType == "daily") {
                    // display regardless of day

                } else {
                    // if not then handle it select-day way
                    db.collection("MedicationInfo").doc(entry.id).collection("scheduleInfo").where("day", "==", currDay)
                    .get().then((schedules) => {
                        if (!schedules.empty) {
                            //displaying the entries that occur today ONLY
                            schedules.forEach((sche) => {
                                let newEntry = entryTemp.content.cloneNode(true);
                                mediName = entry.data().name;
                                mediDose = entry.data().dose;
                                //mediHours = entry.data().time.getHours();
                                
                                if (entry.data().timeNum - 1200 < 0) {
                                    //the AM assignment
                                    mediTime = entry.data().time + " AM";
                                } else {
                                    //the PM assignment
                                    var test = new Date(0, 0, 0, 12, 16);

                                    let hour = test.getHours();
                                    let min = test.getMinutes();

                                    mediTime = hour + ":" + min + " PM";
                                }
                                
                                if (sche.data().status) {
                                    mediStatus = "Completed";
                                } else {
                                    mediStatus = "Not Yet Taken";
                                }                            

                                // is queryselector needed?
                                newEntry.querySelector('#medi-time').innerHTML = mediTime;
                                newEntry.querySelector('#medi-name').innerHTML = mediName;
                                newEntry.querySelector('#medi-dose').innerHTML = mediDose;
                                newEntry.querySelector('#medi-status').innerHTML = mediStatus;

                                //attach this entry to MedicationInfo-display div
                                document.getElementById("MedicationInfo-display").appendChild(newEntry);
                            });
                        } else {
                            console.log("No scehdules today");
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
displayEntries();

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
displayEntries2();