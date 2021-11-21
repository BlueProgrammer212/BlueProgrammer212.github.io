importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDqcXlXth2r-3nA-nWxUTlcm5-vgq2ZQgA",
    authDomain: "pixcel-272e8.firebaseapp.com",
    projectId: "pixcel-272e8",
    storageBucket: "pixcel-272e8.appspot.com",
    messagingSenderId: "527485563587",
    appId: "1:527485563587:web:59c6c095e772a028802876",
    measurementId: "G-49V48L8TZR",
    databaseURL: "https://pixcel-272e8-default-rtdb.firebaseio.com",
});

const messaging = firebase.messaging();