import {initializeApp} from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyABVg9VyGIfZSxvp-ueNL_0HvPH5yMQprg",
  authDomain: "qwerty-40e94.firebaseapp.com",
  databaseURL: "https://qwerty-40e94-default-rtdb.firebaseio.com",
  projectId: "qwerty-40e94",
  storageBucket: "qwerty-40e94.appspot.com",
  messagingSenderId: "95281575596",
  appId: "1:95281575596:web:2481d742750bd44ded1109"
}
 

export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase)
//exportsignInWithEmailAndPassword;