//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
   
    db.collection(collection).get()   //the collection called "MedicationInfo"
        .then(allEntries => {
            var i = 1;  //Optional: if you want to have a unique ID for each hike
            allEntries.forEach(doc => { //iterate thru each doc
                var name = doc.data().name;       // get value of the "name" key
                var type = doc.data().type;  // get value of the "details" key
                var date = doc.data().date;    //get unique ID to each hike to be used for fetching right image
                var time = doc.data().time; //gets the length field
                var desc = doc.data().desc; //gets the length field
                
                var tr = document.createElement('tr');
                var th = tr.appendChild(document.createElement('th'));
                th.innerHTML = i;
                var td1 = tr.appendChild(document.createElement('td'));
                td1.innerHTML = name;
                var td2 = tr.appendChild(document.createElement('td'));
                td2.innerHTML = type;
                var td3 = tr.appendChild(document.createElement('td'));
                td3.innerHTML = desc;
                console.log(name);
                //update title and text and image
                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(tr);

                i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("MedicationInfo");  //input param is the name of the collection

