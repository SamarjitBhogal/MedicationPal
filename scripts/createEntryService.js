// Reference to the collection
const colRef = db.collection('MedicationInfo');

// Event listener for form submission
document.getElementById('medicationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    console.log("Form submitted"); // Debugging

    // Get form data
    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const desc = document.getElementById('desc').value;

    console.log("Form data:", name, type, date, time, desc); // Debugging

    // Add data to Firestore
    colRef.add({
        name: name,
        type: type,
        date: date,
        time: time,
        desc: desc
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        // Reset the form
        document.getElementById('medicationForm').reset();
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
});
