/**
 * This script is to help load the navbar and footer on any page we create.
 */

// function loadSkeleton() {
//     console.log($("#nav-placeholder").load("../components/navbar.html"));
//     console.log($("#footer-placeholder").load("../components/footer.html"));
// }
// loadSkeleton();

function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log($("#nav-placeholder").load("../components/navbar.html"));
            console.log($("#footer-placeholder").load("../components/footer.html"));
        } else {
            // No user is signed in.
            console.log($("#nav-placeholder").load("../components/navbar_before_login.html"));
            console.log($("#footer-placeholder").load("../components/footer.html"));
        }
    });
}
loadSkeleton();