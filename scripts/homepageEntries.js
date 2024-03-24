function displayEntries() {
    firebase.auth().onAuthStateChanged(user => {
        userID = user.uid;

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
            status: true,
        })

}
displayEntries();