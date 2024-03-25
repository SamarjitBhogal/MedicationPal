function displaySchedule() {
    var sche = [];
    sche[0] = [];
    sche[0][0] = "Sunday";
    sche[1] = [];
    sche[1][0] = "Monday";
    sche[2] = [];
    sche[2][0] = "Tuesday";
    sche[3] = [];
    sche[3][0] = "Wensday";
    sche[4] = [];
    sche[4][0] = "Thursday";
    sche[5] = [];
    sche[5][0] = "Friday";
    sche[6] = [];
    sche[6][0] = "Saturday";

    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.
            const userID = user.uid;
            console.log("User ID:", userID);

            const userEntriesSnapshot = await db.collection("MedicationInfo").where("user", "==", userID).get();
            const promises = userEntriesSnapshot.docs.map(async (entry) => {
                const name = entry.data().name;
                const scheInfo = entry.data().schedule;
                console.log(scheInfo); // for debug 
                await db.collection("schedule").where(firebase.firestore.FieldPath.documentId(), '==', scheInfo).get().then(
                    (userSchedules) => {
                        userSchedules.forEach(
                            (doc) => {
                                let days = doc.data().days.split("-");
                                let realTime = doc.data().time;
                                let time = parseInt(realTime);
                                let j;
                                if (time < 8)
                                    j = 1;
                                else if (time < 10)
                                    j = 2;
                                else if (time < 12)
                                    j = 3;
                                else if (time < 14)
                                    j = 4;
                                else if (time < 16)
                                    j = 5;
                                else if (time < 18)
                                    j = 6;
                                else if (time < 20)
                                    j = 7;
                                else
                                    j = 8;
                                console.log(j);  // for debug
                                days.forEach(
                                    (day) => {
                                        switch (day) {
                                            case "sun":
                                                sche[0][j] = name + "\n" + realTime;
                                                console.log(sche[0][j]);  // for debug
                                                break;
                                            case "mon":
                                                sche[1][j] = name + "\n" + realTime; break;
                                            case "tues":
                                                sche[2][j] = name + "\n" + realTime; break;
                                            case "wed":
                                                sche[3][j] = name + "\n" + realTime; break;
                                            case "thurs":
                                                sche[4][j] = name + "\n" + realTime; break;
                                            case "fri":
                                                sche[5][j] = name + "\n" + realTime; break;
                                            case "sat":
                                                sche[6][j] = name + "\n" + realTime; break;
                                            default:
                                                console.log("Wrong date!")

                                        }
                                    }
                                )
                            }
                        )
                    }
                )

            });
            await Promise.all(promises);
            // create table tr from firebase data.
            for (var i = 0; i < 7; i++) {
                var tr = document.createElement('tr');
                var th = tr.appendChild(document.createElement('th'));
                th.innerHTML = sche[i][0];
                for (var j = 1; j < 9; j++) {
                    var td1 = tr.appendChild(document.createElement('td'));
                    if (sche[i][j] == null)
                        td1.innerHTML = "";
                    else
                        td1.innerHTML = sche[i][j];
                    console.log(sche[i][j]);
                }
                document.getElementById("schedule-go-here").appendChild(tr);
            }
        } else {
            // No user is signed in.
            console.log("No user signed in.");
        }
    })
}

displaySchedule();