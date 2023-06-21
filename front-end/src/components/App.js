import React from "react";
import { Routes, Route, Link, HashRouter } from "react-router-dom";


import { UserContext } from "./Context";
import * as APIClient from "../comms/APIClient";
import decodeJwt from "../misc/decodeJwt";
import { frontLogout } from "../misc/frontLogout";
import { getRefreshToken, saveRefreshToken } from "../misc/tokenStorage";



import ConnectionMonitor from "./ConnectionMonitor";
//
//  SCREEENS
//
import Nav from "./Nav"
import Home from "./Home";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import AllData from "./AllData";
//SECURE COMPONENTS
import Welcome from "./Welcome";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import WireTransfer from "./WireTransfer";






export default function App() {
  const {contextValue, updateContextValue} = React.useContext(UserContext);
  const [userLoggedInBefore, setUserLoggedInBefore] = React.useState( APIClient.userHasBeenLoggedInBefore() )
  
  console.log("Context User", contextValue );
  const [pageHash, setPageHash] = React.useState( 
    () => window.location.hash === "" ? "#/" : window.location.hash 
  );


  React.useEffect(() => {
    if( userLoggedInBefore ) {
      console.log("User has been logged before, will try to login with RefreshToken");
      
      APIClient.refreshUser()
        .then( response => {
          console.log("Refresh Login Successful!");
          const token = response.body.token;
          const payload = decodeJwt( token );
          
          updateContextValue( {token, user: payload.user, aws_auth: payload.aws_auth});
          window.location.href= '/#/welcome';

          saveRefreshToken(response.body.RefreshToken);
          //saveAccessToken( token );
        })
        .catch( err => {
          console.log('Login by Refresh failed, user/password login required.', err);
          updateContextValue( frontLogout() );
          setUserLoggedInBefore( false );
          window.location.href= '/#/';
        });
    }
  }, []);


  return (
    contextValue.user.name === null && userLoggedInBefore ? (
      <p>Reinitiating session...</p>
    ) : (
      <div id="content" className="container m-auto" style={{maxWidth: "720px", width:"80%"}}>
      <ConnectionMonitor>
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
              <Route path="/wire-transfer/" element={<WireTransfer />} />
              <Route path="/all-data/" element={<AllData />} />
            </Routes>
        </div>
      </HashRouter>
      </ConnectionMonitor>
      <hr />
      <footer>
        <div className="p-2">
          License: MIT. | Project made by&nbsp;
          <a href="https://michalskrzynski.github.io/">Michal</a> for MIT xPro
          MERN stack course.
        </div>
      </footer>
      </div>
    )
  );
}
