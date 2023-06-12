import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./Context";
import { frontLogout } from "../misc/frontLogout";
import * as APIClient from "../comms/APIClient";


const menuOptions = [
  { hash: "#/", desc: "Home", secure: false, default: true },
  { hash: "#/login", secure: false, desc: "Login" },
  { hash: "#/create-account/", secure: false, desc: "Create Account" },
  { hash: "#/welcome", secure: true, desc: "Welcome" },
  { hash: "#/deposit/", secure: true, desc: "Deposit" },
  { hash: "#/withdraw/", secure: true, desc: "Withdraw" },
  { hash: "#/all-data/", desc: "All Data" },
];

function menuElements(secure, pageHash, handlePageHashChange) {
  const theElements = menuOptions.filter((e) => e.secure === secure || e.secure === undefined);
  return theElements.map((o, i) => (
    <li key={i} className={`"nav-item" ${pageHash === o.hash ? "active" : ""}`}>
      <Link
        to={o.hash.slice(1)}
        className={`nav-link ps-2`}
        onClick={() => handlePageHashChange(o.hash)}
      >
        {o.desc}
      </Link>
    </li>
  ));
}

export default function Nav({ pageHash, handlePageHashChange }) {
  const { contextValue, updateContextValue } = React.useContext(UserContext);

  const logout = function () {
    console.log("Trying to log out, token: ", contextValue.token);
    APIClient.logout( contextValue.token )
      .then( response => console.log('Logout outcome: ', response ) )
      .catch( err => console.log(err) );

    updateContextValue( frontLogout() );
    setTimeout( () => {document.location.href = "#/"; window.location.reload();}, 50);
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-2 d-flex">
      <a className="navbar-brand ps-2" href="#/">
        Bad Bank
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {contextValue.user.name
            ? menuElements(true, pageHash, handlePageHashChange)
            : menuElements(false, pageHash, handlePageHashChange)}
        </ul>
      </div>
      <div className="ms-auto me-4">
        <b>
          {contextValue ? contextValue.user.name : ""}{" "}&nbsp;
          {contextValue.user.name !== null ? (
          <button
            type="button"
            className="btn btn-dark"
            onClick={logout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-box-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
              ></path>
              <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
              ></path>
            </svg>
            &nbsp;Logout
          </button>
          ) : ""}
        </b>
      </div>
    </nav>
  );
}
