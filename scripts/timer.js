// Function to display the modal
function displayModal() {
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}
//get data
const time = document.getElementById('time').value;

// Function to check the current time and display the modal if it's the desired time
function checkTimeAndDisplayModal() {
    // Define the desired time (24-hour format)
    var targetHour = time;

    // Use setInterval to periodically check the current time
    var intervalId = setInterval(function() {
        var currentTime = new Date();
        var currentHour = currentTime.getHours();

        // Check if the current hour matches the target hour
        if (currentHour === targetHour) {
            // Display the modal
            displayModal();

            // Clear the interval to stop checking the time
            clearInterval(intervalId);
        }
    }, 60000); // Check every minute
}

// Call the function to check the time and display the modal when the page loads
window.onload = function() {
    checkTimeAndDisplayModal();
};
