function readProgressDynamically(collection) {
    var userid;
    firebase.auth().onAuthStateChanged(user => {
        userid = user.uid;
        db.collection(collection).where("user", "==", userid).get()
            .then(allEntries => {
                allEntries.forEach(async doc => { //iterate thru each doc
                    var name = doc.data().name;
                    var type = doc.data().type;
                    var dose = doc.data().dose + " Pills";
                    var time = doc.data().timeNum;
                    var DaysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    await doc.ref.collection("scheduleInfo").where("status", "==", true).get().then(
                        allEntries => {
                            allEntries.forEach(doc => {
                                var days = DaysName[doc.data().day];
                                var tr = document.createElement('tr');
                                var th = tr.appendChild(document.createElement('th'));
                                th.innerHTML = name;
                                var td1 = tr.appendChild(document.createElement('td'));
                                td1.innerHTML = dose;
                                var td2 = tr.appendChild(document.createElement('td'));
                                td2.innerHTML = type;
                                var td4 = tr.appendChild(document.createElement('td'));
                                td4.innerHTML = days;
                                var td5 = tr.appendChild(document.createElement('td'));
                                td5.innerHTML = time;
                                document.getElementById("History-go-here").appendChild(tr);
                            }
                            )
                        }
                    )

                })
            })
    })
}

readProgressDynamically("MedicationInfo");  //input param is the name of the collection

