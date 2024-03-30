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
                            let userName2 = userDoc.data().name2;
                            let userNum = userDoc.data().num;
                            let userEmail2 = userDoc.data().email2;
                            let userAddress = userDoc.data().address;
                            let userDesc = userDoc.data().desc;

                            //if the data fields are not empty, then write them in to the form.
                            if (userName2 != null) {
                                document.getElementById("nameInput2").value = userName2;
                            }
                            if (userNum != null) {
                                document.getElementById("numInput").value = userNum;
                            }
                            if (userEmail2 != null) {
                                document.getElementById("emailInput2").value = userEmail2;
                            }
                            if (userAddress != null) {
                                document.getElementById("addressInput").value = userAddress;
                            }
                            if (userDesc != null) {
                                document.getElementById("descInput").value = userDesc;
                            }
                        })
                } else {
                    // No user is signed in.
                    console.log ("No user is signed in");
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
    userName2 = document.getElementById('nameInput2').value;       //get the value of the field with id="nameInput2"
    userNum = document.getElementById('numInput').value;  
    userEmail2 = document.getElementById('emailInput2').value;     
    userAddress = document.getElementById('addressInput').value;     
    userDesc = document.getElementById('descInput').value;       
    
    //b) update user's document in Firestore
    currentUser.update({
        name2: userName2,
        num: userNum,
        email2: userEmail2,
        address: userAddress,
        desc: userDesc
    })
    .then(() => {
        console.log("Document successfully updated!");
    })

    //c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}