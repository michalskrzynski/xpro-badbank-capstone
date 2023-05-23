import React, {useState, useEffect} from "react";
import { UserContext } from "./Context";

import { Card } from "./Card";
import * as APIClient from "../comms/APIClient";

import { useFormik } from "formik";
import * as Yup from "yup";


export default function Login() {
  const ctx = React.useContext(UserContext);

  const [status, setStatus] = useState( null );
  const [authUser, setAuthUser] = useState( null );


  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },

    onSubmit: (values) => {
      console.log(`Login Pressed`);

      APIClient.loginUser( values.email, values.password, (err, token) => {
        if( err != null ) {
          setStatus( "Invalid login or password."); 
        }
        else {
          setStatus( null );
          ctx.user = {email: values.email, token: token};
          
          //fetch user from mongo, we will work with it
          //the current ctx.user, will become ctx.auth
          window.location.href= '/#/welcome';
        }
      } );
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
    <Card header="Login">
      <h1>{ctx.newUser ? ctx.newUser.email : ""}</h1>
      <form onSubmit={formik.handleSubmit}>
        {status ? (
          <div className="alert alert-danger py-1 px-3 mb-1" role="alert">
            <small>Invalid username or password</small>
          </div>
        ) : null}
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
