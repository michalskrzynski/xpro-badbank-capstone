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

import { UserContextProvider } from "./Context";
import * as APIClient from "../comms/APIClient";

export default function App() {
  const [pageHash, setPageHash] = React.useState( 
    () => window.location.hash === "" ? "#/" : window.location.hash 
  );


  React.useEffect(() => {
    if( APIClient.userHasBeenLoggedInBefore() ) {
      console.log("User has been logged before, will try to login with RefreshToken");
      
      APIClient.refreshUser( (token) => console.log("Refresh Callback", token) ); 
    }
  }, []);


  return (
    <div id="content">
      <UserContextProvider>
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
      </UserContextProvider>
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
