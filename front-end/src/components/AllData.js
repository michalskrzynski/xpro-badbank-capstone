import React from "react";
import { useEffect } from "react";
import { Card } from "./Card";
import * as APIClient from "../comms/APIClient";
import moment from 'moment'

import { oneFormat } from "../misc/oneFormat";

// All Data page includes the following functionality:
// Track User Submissions: All user submissions appear on All Data page.
// All Data Displayed On Bootstrap Card: All Data is styled and displayed on a Bootstrap card instead of JSON.

export default function AllData() {
  const [userList, setUserList] = React.useState([]);

  useEffect( () => {
    APIClient.allUsers()
      .then( users => {
        setUserList( users.body.data );
        console.log("Retrieved users for display.");
      }) 
      .catch( err => {
        console.log("Something went wrong when retrieving users.");
      }) 
  }, [])



  let userElements = [];
  if( userList.length > 0 ) userElements = userList.map((u) => {
    const createdAt = moment( u.created_at );
    const createdAtFormatted = createdAt.format('YYYY-MM-DD, HH:mm');

    return (
      <Card
        bgcolor="light"
        key={u._id}
        header={u.name}
      >
        <p>Email: {u.email}</p>
        <p>Password: <span className="badge bg-primary">stored in Amazon Cognito, hashed</span></p>
        <hr/>
        <p>Account #: {u.account_number}</p>
        <p>Balance: <b>{oneFormat(u.balance)}</b></p>
        <hr/>
        <p>Created at: {createdAtFormatted}</p>
      </Card>
    )
  });



  return (
    <div>
      <h1>All Users</h1>
      <div>{userElements}</div>
    </div>
  );
}
