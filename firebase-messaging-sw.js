
importScripts('https://www.gstatic.com/firebasejs/5.5.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.6/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyDqcXlXth2r-3nA-nWxUTlcm5-vgq2ZQgA",
    authDomain: "pixcel-272e8.firebaseapp.com",
    projectId: "pixcel-272e8",
    storageBucket: "pixcel-272e8.appspot.com",
    messagingSenderId: "527485563587",
    appId: "1:527485563587:web:59c6c095e772a028802876",
    measurementId: "G-49V48L8TZR",
    databaseURL: "https://pixcel-272e8-default-rtdb.firebaseio.com",
};

firebase.initializeApp(firebaseConfig);

//initializing messaging service
const messaging = firebase.messaging();

//Handles background messages when tab is in background.
messaging.setBackgroundMessageHandler(function(payload) {
    console.log(
        '"Firebase-messaging-sw.js" file is recieved.',payload
    );

    const notificationTitle = "Pixcel";
    const notificationOptions = {
        body: "Hello there! I am hoping that you can see this little notification test. Please tell BlueProgrammer on discord that this notification test worked.",
        icon: "https://firebasestorage.googleapis.com/v0/b/pixcel-272e8.appspot.com/o/logo_icon.png?alt=media&token=2e685f22-a5a9-4a1a-b4c5-a2cd91641b09",
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
    );
})