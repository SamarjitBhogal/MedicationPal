//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyAqupA6k32OE27N_N9COAToRVqu9XrLjh0",
    authDomain: "bby06-8ff4b.firebaseapp.com",
    projectId: "bby06-8ff4b",
    storageBucket: "bby06-8ff4b.appspot.com",
    messagingSenderId: "999215274406",
    appId: "1:999215274406:web:68284ec27d4d161a0e5767"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
