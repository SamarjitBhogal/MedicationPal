/**
 * This script is to help load the navbar and footer on any page we create.
 * 
 * TODO: implement firebase login auth to display full navbar and when not auth display limited navbar
 */

function loadSkeleton() {
    console.log($("#nav-placeholder").load("./components/navbar.html"));
    console.log($("#footer-placeholder").load("./components/footer.html"));
}
loadSkeleton();