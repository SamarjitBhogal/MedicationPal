function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            $("#nav-placeholder").load("../components/navbar.html");
            $("#footer-placeholder").load("../components/hot-bar.html");
        } else {
            // No user is signed in.
            $("#nav-placeholder").load("../components/navbar_before_login.html");
            $("#footer-placeholder").load("../components/footer.html");
        }
    });
}
loadSkeleton();