import React, {useState, useContext} from "react";
import { UserContext } from "./Context";

import { Card } from "./Card";
import * as APIClient from "../comms/APIClient";
import decodeJwt from "../misc/decodeJwt";
import {ConnectionMonitorContext} from "./ConnectionMonitor";

import { useFormik } from "formik";
import * as Yup from "yup";

import { saveRefreshToken } from "../misc/tokenStorage";


export default function Login() {
  const {contextValue, updateContextValue} = React.useContext(UserContext);
  const {state, setApiPromise } = useContext(ConnectionMonitorContext);

  const [status, setStatus] = useState( null );
  const [authUser, setAuthUser] = useState( null );


  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },

    onSubmit: (values) => {
      const promise = APIClient.loginUser( values.email, values.password ) 
        .then( response => {
          const token = response.body.token;
          console.log("Logged in, response: ", response);
          const payload = decodeJwt( token );

          setTimeout( () => window.location.href= '/#/welcome', 100);
          updateContextValue( {token, user: payload.user, aws_auth: payload.aws_auth});
          saveRefreshToken(response.body.RefreshToken);
        })
        .catch( err => {
          setStatus( "Invalid login or password."); 
        } );
      
      setApiPromise( promise );
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
      <h1>Please login</h1>
      <form onSubmit={formik.handleSubmit}>
        {status ? (
          <div className="alert alert-danger py-1 px-3 mb-1" role="alert">
            <small>Invalid username or password, or account not yet verified.</small>
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
            {state.loading ? "Loading..." : "Login"}
          </button>
        </div>
      </form>
    </Card>
  )
}
