import { initializeApp } from 'firebase/app'
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import {getFirestore} from 'firebase/firestore'
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyDYcmrOk3ku6uA31_7HEafidSDyWyqHNmo",
  authDomain: "myproject01-72d61.firebaseapp.com",
  projectId: "myproject01-72d61",
  storageBucket: "myproject01-72d61.appspot.com",
  messagingSenderId: "288464878754",
  appId: "1:288464878754:web:97f4b5b0705823ac44ebfb",
  measurementId: "G-29BXF8XR5H"
}

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)

}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export {firebase,db,getStorage,getDownloadURL,ref};




