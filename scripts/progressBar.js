var userid;
var medicineItem;
var doneItem;
function setProgressBar(collection1, collection2) {
    firebase.auth().onAuthStateChanged(user => {
        userid = user.uid;
        db.collection(collection1).where("user","==",userid).get()
        .then(
            function(querySnapshot) {
                medicineItem = querySnapshot.size;
                console.log('Number of medicineItem:', medicineItem);
                updateProgressBar();
            }).catch(function(error) {
                console.error('Error getting medicineItem:', error);
            });
        db.collection(collection2).where("user","==",userid).get()
        .then(
            function(querySnapshot) {
                doneItem = querySnapshot.size;
                console.log('Number of doneItem:', doneItem);
                updateProgressBar();
            }).catch(function(error) {
                console.error('Error getting doneItem:', error);
            });
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

setProgressBar("MedicationInfo","Progress");