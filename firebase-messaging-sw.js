
importScripts('https://www.gstatic.com/firebasejs/5.5.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.6/firebase-messaging.js');

firebase.initializeApp({
            apiKey: "Your API key.",
            authDomain: "Your auth domain",
            storageBucket: "Your storage bucket link",
            projectId: "Your project ID",
            storageBucket: "stotrageBucketID",
            messagingSenderId: "Sender ID",
            appId: "App ID",
            measurementId: "measurement ID"
});

//initializing messaging service
const messaging = firebase.messaging();

//Handles background messages when tab is in background.
messaging.setBackgroundMessageHandler(function(payload) {
    console.log(
        '"Firebase-messaging-sw.js" file is recieved.',payload
    );

    const notificationTitle = "Background Message Title";
    const notificationOptions = {
        body: "Background Message body.",
        icon: "--You can put you .png file here.--",
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
    );
})