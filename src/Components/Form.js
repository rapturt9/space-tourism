// components/Form.js
import React, { useState } from "react";
import FileSelector from "./FileSelector";
import mintToken from "../flow/transaction/MintToken.tx";

// Collect the information of a pet and manage as a state
// and mint the NFT based on the information.
const Form = () => {
  const [pet, setPet] = useState({});

  // Helper functions to be passed to input elements' onChange.

  const setName = (event) => {
    const name = event.target.value;
    setPet({ ...pet, name });
  };

  const setBreed = (event) => {
    const breed = event.target.value;
    setPet({ ...pet, breed });
  };

  const setAge = (event) => {
    const age = event.target.value;
    setPet({ ...pet, age });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await mintToken(pet);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={style}>
      <form>
        <input className="button-primary" type="submit" value="Mint" />
      </form>
    </div>
  );
};

const style = {
  padding: "5rem",
  background: "white",
  maxWidth: 350,
};

export default Form;
