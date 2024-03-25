const colUserRef = db.collection("users");
const colPalRequestsRef = db.collection("palRequests");

firebase.auth().onAuthStateChanged(user => {
    const userID = user.uid;
    console.log("auth user id: " + user.uid);

    function displayPals() {
        console.log(userID);
        var thisUserDoc = colUserRef.doc(userID);
        
        thisUserDoc.get().then((user) => {
            if (!user.data().pal) {
                // checking if a request exists for this user
                colPalRequestsRef.doc(userID).get().then((request) => {
                    if(request.exists) {
                        //if a request is available, display the request window
                        // and nothing else
                        
                    } else {
                        // no request is available, display add a pal.

                    }
                }).catch((e) => {
                    console.error("Pal Request find failed: ", e);
                })
                //check if a request is available, if so display requests window
                //else display add a pal
            } else {
                //display pal's info since there is a pal
            }
        }).catch((e) => {
            console.error("Could not find user doc: ", e);
        })
    
        // colUserRef.get().then((users) => {
        //     users.forEach((user) => {
        //         const userData = user.data();
    
        //         console.log(userData["email"])
        //     })
        // })
    
    }
    displayPals();
});

document.getElementById("medi-pals-form").addEventListener('submit', (e) => {
    e.preventDefault();

    // this user's id:
    const userID = firebase.auth().currentUser.uid;
    // pal's id:
    var palID;
    const palEmail = $("#palsEmail").val();

    // get the pal's user id and put it in palID
    colUserRef.where("email", "==", palEmail).get().then((pal) => {
        pal.forEach((palDoc) => {
            palID = palDoc.id;
        })
    }).then(() => {
        console.log("pal's id recieved.");

        // send the request to the pal:
        colPalRequestsRef.doc(palID).set({
            request: userID
        }).then(() => {
            console.log("Sent pal request.");
            // remove add a pal and show request
        }).catch((e) => {
            console.error("Pal add failed: " + e);
        });
    }).catch((e) => {
        console.error("pal does not exist: " + e);
        // give the user the warning let them try another
    });

    // colUserRef.doc(userID).update({
    //     pal: palID
    // }).then(() => {
    //     console.log("Sent pal request.");
    // }).catch((e) => {
    //     console.error("Pal add failed: " + e);
    // });
});

