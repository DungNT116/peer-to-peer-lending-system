import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyD4dJc_Vy2MdPLEbLupE2KistPAXDqrKO4",
    authDomain: "agri-scm.firebaseapp.com",
    databaseURL: "https://agri-scm.firebaseio.com",
    projectId: "agri-scm",
    storageBucket: "agri-scm.appspot.com",
    messagingSenderId: "411639807473",
    appId: "1:411639807473:web:2d26f55f5d0c3653"
};

firebase.initializeApp(config);

const database = firebase.database();

export {
  database,
};