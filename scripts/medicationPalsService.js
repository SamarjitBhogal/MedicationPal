const colUserRef = db.collection("users");

document.getElementById("medi-pals-form").addEventListener('submit', (e) => {
    e.preventDefault();

    const userID = firebase.auth().currentUser.uid;
    var palID;
    const palEmail = $("#palsEmail").val();
    console.log(palEmail);

    colUserRef.where("email", "==", palEmail).get().them((pal) => {
        pal.forEach((palDoc) => {
            palID = palDoc.id;
        })
    })
    
});