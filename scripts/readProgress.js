function readProgressDynamically(collection) {
    var userid;
    firebase.auth().onAuthStateChanged(user => {
        userid = user.uid;
        db.collection(collection).where("user", "==", userid).get()
            .then(allEntries => {
                allEntries.forEach(async doc => { //iterate thru each doc
                    var name = doc.data().name;
                    let mediTime = new Date();
                    const offset = mediTime.getTimezoneOffset()
                    mediTime = new Date(mediTime.getTime() - (offset*60*1000))
                    await doc.ref.collection("scheduleInfo").where("status", "==", true).get().then(
                        allEntries => {
                            allEntries.forEach(doc1 => {
                                var tr = document.createElement('tr');
                                var th = tr.appendChild(document.createElement('th'));
                                th.innerHTML = name;
                                var td4 = tr.appendChild(document.createElement('td'));
                                td4.innerHTML = mediTime.toISOString().split('T')[0];
                                var td5 = tr.appendChild(document.createElement('td'));
                                td5.innerHTML = getTime(doc);
                                document.getElementById("History-go-here").appendChild(tr);
                            }
                            )
                        }
                    )

                })
            })
    })
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

readProgressDynamically("MedicationInfo");  //input param is the name of the collection

