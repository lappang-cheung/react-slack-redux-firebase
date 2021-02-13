import firebase from 'firebase';

import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

var firebaseConfig = {
    apiKey: "AIzaSyBfxj-ZI1wjnUCeSwEWrWaPhOL6JhBFcTQ",
    authDomain: "slack-firebase-react.firebaseapp.com",
    projectId: "slack-firebase-react",
    storageBucket: "slack-firebase-react.appspot.com",
    messagingSenderId: "727124769853",
    appId: "1:727124769853:web:cf980089adbe4ea1f93e54",
    measurementId: "G-9LYSY5G8T2"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  export default firebase;