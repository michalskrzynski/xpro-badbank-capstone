import React from "react";
import { Routes, Route, Link, HashRouter } from "react-router-dom";

import Nav from "./Nav"
import Home from "./Home";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import AllData from "./AllData";
//PRIVATE COMPONENTS
import Welcome from "./Welcome";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

import { UserContextProvider, UserContext } from "./Context";
import * as APIClient from "../comms/APIClient";

export default function App() {
  const {contextValue, updateContextValue} = React.useContext(UserContext);
  console.log("Context User", contextValue );
  const [pageHash, setPageHash] = React.useState( 
    () => window.location.hash === "" ? "#/" : window.location.hash 
  );


  React.useEffect(() => {
    if( APIClient.userHasBeenLoggedInBefore() ) {
      console.log("User has been logged before, will try to login with RefreshToken");
      
      APIClient.refreshUser( (err, payload) => {
        if( err != null ) {
          alert('Login by Refresh failed.');
        }
        else {
          updateContextValue( {user: payload.user, auth: payload.aws_auth});
          window.location.href= '/#/welcome';
        }
      } );
    }
  }, []);


  return (
    <div id="content">
      <HashRouter>
        <Nav pageHash={pageHash} handlePageHashChange={setPageHash} />
        <div id="mainblock" className="m-2">
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/login/" element={<Login />} />
              <Route path="/create-account/" element={<CreateAccount />} />
              <Route path="/welcome/" element={<Welcome />} />
              <Route path="/deposit/" element={<Deposit />} />
              <Route path="/withdraw/" element={<Withdraw />} />
              <Route path="/all-data/" element={<AllData />} />
            </Routes>
        </div>
      </HashRouter>
      <hr />
      <footer>
        <div className="p-2">
          License: MIT. 
          {/* Project made by{" "}
          <a href="https://michalskrzynski.github.io/">Michal</a> for MIT xPro
          MERN stack course. */}
        </div>
      </footer>
    </div>
  );
}
