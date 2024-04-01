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
            })
        })      
    })
};

function updateProgressBar() {
    console.log('Number of doneItem:', doneItem);
    console.log('Number of medicineItem:', medicineItem);
    // Check if both medicineItem and doneItem are defined before calculating ratio
    if (typeof medicineItem !== 'undefined' && typeof doneItem !== 'undefined') {
        var ratio = doneItem / medicineItem * 100;
        console.log('Progress ratio:', ratio);
        document.getElementById("Progress-bar-here").setAttribute('style','width:'+ratio+'%'); ;
    }
};

setProgressBar("MedicationInfo","scheduleInfo");