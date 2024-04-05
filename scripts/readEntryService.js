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
                        // document.getElementById("medicationMedal").innerHTML = desc + "<br>" + dose + "<br>" + "Take Pills in following days: " + days;
                        // modal.style.display = "block";

                        db.collection("MedicationInfo").doc(doc.id).get().then(async doc => {
                            document.getElementById('modal-medi-name').innerHTML = doc.data().name;
                            document.getElementById('dose').innerHTML = doc.data().dose;
                            document.getElementById('schedule-type').innerHTML = await getScheduleType(doc).then(value => {
                                return value;
                            });
                            document.getElementById('desc').innerHTML = doc.data().desc;
                            document.getElementById('time').innerHTML = getTime(doc);
                            if (doc.data().image != null && !document.getElementById('medi-img').hasChildNodes()) {
                                let img = document.createElement('img');
                                img.setAttribute('id', 'img-' + doc.id);
                                img.setAttribute('class', 'modal-medi-image');
                                img.setAttribute('src', doc.data().image);
                                document.getElementById('medi-img').appendChild(img);
                            }
                            const entryConf = new bootstrap.Modal(document.getElementById("entry-info"));
                            entryConf.show();
                        });
                    };
                    var td1 = tr.appendChild(document.createElement('td'));
                    td1.innerHTML = name;
                    var td2 = tr.appendChild(document.createElement('td'));
                    td2.innerHTML = type;
                    var td5 = tr.appendChild(document.createElement('td'));
                    td5.innerHTML = time;
                    console.log(name);
                    document.getElementById(collection + "-go-here").appendChild(tr);
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

async function getScheduleType(doc) {
    let scheType = doc.data().scheduleType;

    if (scheType == "daily") {
        return "Daily";
    }

    let selectDay = "Every";
    let i = 0;

    await db.collection("MedicationInfo").doc(doc.id).collection("scheduleInfo")
    .get().then((schedules) => {
       schedules.forEach(schedule => {
            // Remember 0-6 == sun-sat
            (i < 0)? selectDay += ", " : selectDay += " ";
            switch (schedule.data().day) {
                case 0:
                    selectDay += "Sunday";
                    break;
                case 1:
                    selectDay += "Monday";
                    break;
                case 2:
                    selectDay += "Tuesday";
                    break;
                case 3:
                    selectDay += "Wednesday";
                    break;
                case 4:
                    selectDay += "Thursday";
                    break;
                case 5:
                    selectDay += "Friday";
                    break;
                case 6:
                    selectDay += "Saturday";
                    break;
            }
            i--;
        });
        // console.log("here " + selectDay);
        // return selectDay;
    }).catch((e) => {
        console.error("Could not find select days: ", e);
    });

    return selectDay;
}

function getTime(doc) {
    let mediTime = new Date(doc.data().time.seconds * 1000);
    let mediHours = mediTime.getHours();
    let mediMinutes = mediTime.getMinutes();
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

displayCardsDynamically("MedicationInfo");  //input param is the name of the collection