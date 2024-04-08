/* displays the name of the user in elements with ID: user-name */
function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            userName = user.displayName;

            //method #1:  insert with JS
            document.getElementById("user-name").innerText = userName;

        } else {
            // No user is signed in.
            console.log ("No user is logged in");
        }
    });
}
getNameFromAuth(); //run the function