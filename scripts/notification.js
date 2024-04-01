var currentUser;          //put this right after you start script tag before writing any functions.
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    let userEmail3 = userDoc.data().email3;
                    let DocNum = userDoc.data().PhoneNum; //name of field in db

                    //if the data fields are not empty, then write them in to the form.
                    if (userEmail3 != null) {
                        document.getElementById("email3").value = userEmail3; //uhh
                    }
                    if (DocNum != null) {
                        document.getElementById("phoneNum").value = DocNum; //one of these is for the phone
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//call the function to run it 
populateUserInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
 }

function saveUserInfo() {
    //enter code here

    //a) get user entered values
    userEmail3 = document.getElementById('email3').value;       //good
    DocNum = document.getElementById('phoneNum').value;     //bad?

    //b) update user's document in Firestore
    currentUser.update({
        email3: userEmail3,
        PhoneNum: DocNum, //good
    })
        .then(() => {
            console.log("Document successfully updated!");
        })
}


document.getElementById("toggleNotifications").addEventListener('click', (e) => {
    document.getElementById("bannerCheck").toggleAttribute("disabled");
    document.getElementById("smsCheck").toggleAttribute("disabled");
    document.getElementById("emailCheck").toggleAttribute("disabled");
    document.getElementById("save-btn").toggleAttribute("disabled");
});

document.getElementById("smsCheck").addEventListener('click', (e) => {
    document.getElementById("phoneNum").toggleAttribute("disabled");
});

document.getElementById("emailCheck").addEventListener('click', (e) => {
    document.getElementById("email3").toggleAttribute("disabled");
});