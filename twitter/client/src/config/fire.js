import firebase from 'firebase'	

let config = {
	apiKey: "AIzaSyDY8ivzIZ_3rumcyCQ939sbtI44en2gy1A",
    authDomain: "twit-3f1c0.firebaseapp.com",
    databaseURL: "https://twit-3f1c0.firebaseio.com",
    projectId: "twit-3f1c0",
    storageBucket: "",
    messagingSenderId: "452144322485"

}

let fire = firebase.initializeApp(config)
export default fire