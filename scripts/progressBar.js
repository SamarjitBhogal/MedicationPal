var userid;
var medicineItem = 0;
var doneItem = 0;
var date = new Date();
var currDay = date.getDay();
function setProgressBar(collection1, collection2) {
    firebase.auth().onAuthStateChanged(user => {
        userid = user.uid;
        db.collection(collection1).where("user","==",userid).get()
        .then(allEntries => {
            allEntries.forEach(async doc => {
                await doc.ref.collection(collection2).where("day", "==", currDay).get().then(
                    allSchedule => {
                        allSchedule.forEach(async doc => {
                            medicineItem += 1;
                            if (doc.data().status == true){
                                doneItem += 1;
                            }
                        })    
                    })
                updateProgressBar();
            });

            allEntries.forEach(async doc => {
                await doc.ref.collection(collection2).where("day", "==", "daily").get().then(
                    allSchedule => {
                        allSchedule.forEach(async doc => {
                            medicineItem += 1;
                            if (doc.data().status == true){
                                doneItem += 1;
                            }
                        })    
                    })
                updateProgressBar();
            });
            updateProgressBar();
        })      
    })
};

function updateProgressBar() {
    // Check if both medicineItem and doneItem are defined before calculating ratio
    if (typeof medicineItem !== 'undefined' && typeof doneItem !== 'undefined' && medicineItem != 0) {
        var ratio = doneItem / medicineItem * 100;
        document.getElementById("Progress-bar-here").setAttribute('style','width:'+ratio+'%');
        if (ratio == 0) {
            document.getElementById("progress-msg").innerHTML = "Remember to take your medication!";
            document.getElementById("Progress-bar-here").setAttribute('style',"width:10%");
        } else if (ratio <= 50) {
            document.getElementById("progress-msg").innerHTML = "Almost there!";
        } else if (ratio <= 100) {
            document.getElementById("progress-msg").innerHTML = "Well done! Keep up the good work!";
        }
    } else {
        document.getElementById("progress-msg").innerHTML = "Create an entry to start tracking your progress!";
    }
        
};

setProgressBar("MedicationInfo","scheduleInfo");