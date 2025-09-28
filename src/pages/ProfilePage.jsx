import React from "react";
import { useContext } from "react";
import { UserDataContext } from "../contexts/userDataContext.jsx";


export default function Profile() {
const { userData } = useContext(UserDataContext);
console.log("From Context", userData)
  return (
    <>
      <h1>Profile Page</h1>
    </>
  );
}
