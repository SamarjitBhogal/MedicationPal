const colUserRef = db.collection("users");

document.getElementById("medi-pals-form").addEventListener('submit', (e) => {
    e.preventDefault();

    const userID = firebase.auth().currentUser.uid;
    const palEmail = $("#palsEmail").val();
    console.log(palEmail);
    var date = new Date();
    console.log(date.getDay());

    // colUserRef.where("email", "==", palEmail).get().

    // colPalsRef.add({
    //     user: userID
    // })
});