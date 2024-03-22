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

function markerBtn(num) {
    var td = document.createElement("td");
    var markerDiv = document.createElement("div");
    markerDiv.setAttribute("id", "marker-btn" + num);
    td.appendChild(markerDiv);
    return td;
}

function undoBtn(num) {
    var td = document.createElement("td");
    var markerDiv = document.createElement("div");
    markerDiv.setAttribute("id", "completed-btn" + num);
    td.appendChild(markerDiv);
    return td;
}

displayEntries();