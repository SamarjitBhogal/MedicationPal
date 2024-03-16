function displayEntries() {
    firebase.auth().onAuthStateChanged(user => {
        userID = user.uid;

    db.collection("MedicationInfo").where("user", "==", userID).get().then((userEntries) => {
        var btnNum = 1;
        userEntries.forEach((entry) => {
            var name = entry.data().name;  
            var type = entry.data().type; 
            var date = entry.data().date;  
            var time = entry.data().time; 
            var status = entry.data().status; 

            var tr = document.createElement("tr");
            var td = markerBtn(btnNum);
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
            $("#marker-btn" + btnNum).load("../components/markerBtn.html");
            btnNum++;
        });
    });
});
}

function markerBtn(num) {
    var td = document.createElement("td");
    var markerDiv = document.createElement("div");
    markerDiv.setAttribute("id", "marker-btn" + num);
    td.appendChild(markerDiv);
    return td;
}

displayEntries();