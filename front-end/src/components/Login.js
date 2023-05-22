import React, {useState, useEffect} from "react";
//import {firebase, auth, signInWithEmailAndPassword}  from '../firebase';

import { Card } from "./Card";

import { useFormik } from "formik";
import * as Yup from "yup";

import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyABVg9VyGIfZSxvp-ueNL_0HvPH5yMQprg",
  authDomain: "qwerty-40e94.firebaseapp.com",
  databaseURL: "https://qwerty-40e94-default-rtdb.firebaseio.com",
  projectId: "qwerty-40e94",
  storageBucket: "qwerty-40e94.appspot.com",
  messagingSenderId: "95281575596",
  appId: "1:95281575596:web:2481d742750bd44ded1109"
}
 

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


export default function Login() {

  const [authUser, setAuthUser] = useState( null );


  useEffect( () => {
    const unregisterAuthoObserver = auth().onAuthStateChanged( (user) => {
      setAuthUser( user );
    });

    return () => unregisterAuthoObserver();
  }, [] );


  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },

    onSubmit: (values) => {
      console.log(`Login Pressed`);

      // const promise = signInWithEmailAndPassword(
      //   formik.values.email,
      //   formik.values.password
      // );
      // promise.then((resp) => {
      //   console.log('User Login Response: ', resp);
      // });
      // promise.catch((e) => console.log(e.message));
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .required()
        .email("Please provide a valid email address."),
      password: Yup.string()
        .required("You need to give a password.")
    }),
  });

  return (
    // <div>
    //   {isSignedIn ? (
    //     <div>
    //       <p>Welcome, {firebase.auth().currentUser.displayName}!</p>
    //       <button onClick={() => firebase.auth().signOut() }>Sign out</button>
    //     </div>
    //   ) : (
    //     <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    //   )}
    // </div>
    <Card header="Login">
      <form onSubmit={formik.handleSubmit}>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          {formik.touched.email && formik.errors.email && (
            <div className="alert alert-danger py-1 px-3 mb-1" role="alert">
              <small>{formik.errors.email}</small>
            </div>
          )}
          <input
            type="text"
            className="form-control"
            id="email"
            placeholder="john@doe.com"
            value={formik.values.email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </div>

        <div className="form-group mt-2">
          <label htmlFor="password">Password</label>
          {formik.touched.password && formik.errors.password && (
            <div className="alert alert-danger py-1 px-3 mb-1" role="alert">
              <small>{formik.errors.password}</small>
            </div>
          )}
          <input
            type="password"
            className="form-control"
            id="password"
            value={formik.values.password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </div>

        <div className="d-flex justify-content-end">  
          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={!(Object.keys(formik.errors).length === 0) && "disabled"}
          >
            Login
          </button>
        </div>
      </form>
    </Card>
  )
}
