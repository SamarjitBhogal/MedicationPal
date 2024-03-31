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
                const time = entry.data().timeNum;
                let j;
                if (time < 800)
                    j = 1;
                else if (time < 1000)
                    j = 2;
                else if (time < 1200)
                    j = 3;
                else if (time < 1400)
                    j = 4;
                else if (time < 1600)
                    j = 5;
                else if (time < 1800)
                    j = 6;
                else if (time < 2000)
                    j = 7;
                else
                    j = 8;
                await entry.ref.collection("scheduleInfo").get().then(
                    allEntries => {
                        allEntries.forEach(doc => {
                            let day = doc.data().day;
                            sche[day][j] = name + "<br>" + time;                           
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