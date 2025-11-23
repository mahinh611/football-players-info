// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyAkMhvyt_Apl6GmrLOR5I17Yuqv5iOTxD0",
    authDomain: "login-and-signup-data-7f9ce.firebaseapp.com",
    databaseURL: "https://login-and-signup-data-7f9ce-default-rtdb.firebaseio.com",
    projectId: "login-and-signup-data-7f9ce",
    storageBucket: "login-and-signup-data-7f9ce.appspot.com",
    messagingSenderId: "970731311996",
    appId: "1:970731311996:web:ffbe48973c5ccea73a0af9"
};

// Prevent multiple Firebase instances
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}