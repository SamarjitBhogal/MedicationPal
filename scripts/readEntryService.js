//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    var userid;
    // Get the modal
    var modal = document.getElementById("myModal");
    firebase.auth().onAuthStateChanged(user => {
        userid = user.uid;
        console.log(userid);

        db.collection(collection).where("user", "==", userid).get()
            .then(allEntries => {
                var i = 1;
                allEntries.forEach(async doc => { //iterate thru each doc
                    var name = doc.data().name;
                    var type = doc.data().type;
                    var desc = "Medication Description: " + doc.data().desc;
                    var time = doc.data().timeNum;
                    var dose = "Medication dosage: " + doc.data().dose + " Pills every time.";
                    var days ="";   
                    var DaysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];               
                    await doc.ref.collection("scheduleInfo").orderBy("day").get().then(
                        allEntries => {
                            allEntries.forEach(doc => {
                                if (days == "")
                                days += DaysName[doc.data().day];
                                else
                                days += "/" + DaysName[doc.data().day];
                                console.log(days);
                            }
                            )
                        }
                    )
                    var tr = document.createElement('tr');
                    tr.className = "medicationRow";
                    tr.onclick = function () {
                        document.getElementById("medicationMedal").innerHTML = desc + "<br>" + dose + "<br>" + "Take Pills in following days: " + days;
                        modal.style.display = "block";
                    };
                    var th = tr.appendChild(document.createElement('th'));
                    th.innerHTML = i;
                    var td1 = tr.appendChild(document.createElement('td'));
                    td1.innerHTML = name;
                    var td2 = tr.appendChild(document.createElement('td'));
                    td2.innerHTML = type;
                    var td5 = tr.appendChild(document.createElement('td'));
                    td5.innerHTML = time;
                    console.log(name);
                    document.getElementById(collection + "-go-here").appendChild(tr);

                    i++;   //Optional: iterate variable to serve as unique ID
                })
            })
    });
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    // When the user clicks on <span> (x), close the modal
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    }
}


displayCardsDynamically("MedicationInfo");  //input param is the name of the collection