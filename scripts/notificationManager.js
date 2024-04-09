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

// create a function to update the date and time
// this is mainly for testing values
function updateDateTime() {
    // create a new `Date` object
    const now = new Date();

    // get the current date and time as a string
    const currentDateTime = now.toLocaleString();

    // update the `textContent` property of the `span` element with the `id` of `datetime`
    //document.querySelector('#datetime').textContent = currentDateTime;
    var d = new Date(); // for now
    const hr = d.getHours(); // => 
    const min = d.getMinutes(); // => 
    const sec = d.getSeconds();


    combi = "" + hr + min;
    typeof Number(combi);
}

// call the `updateDateTime` function every second
setInterval(updateDateTime, 1000);

//create a function that compares the date object to the time in our database
function notifPop(collection) {
    firebase.auth().onAuthStateChanged(user => {
        const toastLiveExample = document.getElementById('liveToast');
        // create a new `Date` object
        const now = new Date();

        // get the current date and time as a string
        const currentDateTime = now.toLocaleString();

        // update the `textContent` property of the `span` element with the `id` of `datetime`
        //document.querySelector('#datetime').textContent = currentDateTime;

        const userID = user.uid;

        // Reference to the Firestore database
        const db = firebase.firestore();

        // Reference to the specific document in Firestore
        const docRef = db.collection("users").doc(userID);

        // Fetch the document from Firestore
        docRef.get().then((doc) => {
            if (doc.exists) {
                userid = user.uid;
                const data = doc.data();
                const time = data.time;
                // create a new `Date` object
                const now = new Date();

                // get the current date and time as a string
                const currentDateTime = now.toLocaleString();

                // update the `textContent` property of the `span` element with the `id` of `datetime`
                //document.querySelector('#datetime').textContent = currentDateTime;
                var d = new Date(); // for now
                const hr = d.getHours(); // => getting hours of the current time
                const min = d.getMinutes(); // =>  getting minutes of the current time
                const sec = d.getSeconds();

                //concatenating both of them together
                combi = "" + hr + min;
                //typecast that to a number
                typeof Number(combi);
                //print out to see current number


                db.collection(collection).where("user", "==", userid).get()
                    .then(allEntries => {
                        allEntries.forEach(doc => { //iterate thru each doc
                            let mediTime = new Date(doc.data().time.seconds * 1000);
                            let mediHour = mediTime.getHours();
                            let mediMin = mediTime.getMinutes();
                            let mediSec = mediHour * 3600 + mediMin * 60 + mediTime.getSeconds();

                            let curSec = hr * 3600 + min * 60 + sec;

                            let milliSec = mediSec * 1000;
                            let currMilliSec = curSec * 1000;

                            if (milliSec - currMilliSec > 0) {
                                setTimeout(function() {
                                    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                                    
                                    toastBootstrap.show();
                                    document.getElementById("medi-name-nofi").innerHTML = doc.data().name;
                                    document.getElementById("medi-dose-nofi").innerHTML = doc.data().dose;
                                }, milliSec - currMilliSec);
                            }
                        })
                    })
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    })
};

notifPop("MedicationInfo");