import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./Context";

const menuOptions = [
  { hash:'#/', desc:'Home', secure: false, default:true },
  { hash:'#/login', secure: false, desc:'Login'},
  { hash:'#/create-account/', secure: false, desc:'Create Account'},
  { hash:'#/all-data/', secure: false, desc:'All Data'},
  { hash:'#/welcome', secure: true, desc:'Welcome' },
  { hash:'#/deposit/', secure: true, desc:'Deposit'},
  { hash:'#/withdraw/', secure: true, desc:'Withdraw'}
]

function menuElements( secure, pageHash, handlePageHashChange ) {
  const theElements = menuOptions.filter( e => e.secure === secure );
  return theElements.map( (o, i) => (
    <li key={i} className={`"nav-item" ${pageHash === o.hash ? 'active' : ''}`}>
      <Link to={o.hash.slice(1)} className={`nav-link ps-2`} onClick={() => handlePageHashChange( o.hash )}>
        {o.desc}
      </Link>
    </li>
  ))
}

export default function Nav({pageHash, handlePageHashChange}) {
  const {contextValue, updateContextValue} = React.useContext(UserContext);

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
            
            {contextValue && contextValue.auth ?
              menuElements(true,pageHash, handlePageHashChange) :
              menuElements(false,pageHash, handlePageHashChange)
            }
          
          </ul>
        </div>
        <div className="ms-auto me-4">
          <b>{contextValue ? contextValue.user.name : ""}</b>
        </div>
      </nav>
  );
}
