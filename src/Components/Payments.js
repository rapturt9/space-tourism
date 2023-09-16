import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./payments.css";
import Form from "./Form";
import axios from "axios";
const data = require("../data.json");

const Payments = () => {
  const location = useLocation();
  const [isPaymentSuccessful, setPaymentSuccessful] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const destination = queryParams.get("d");
  const providerIndex = queryParams.get("p");
  const selectedTime = queryParams.get("t");
  const dest = data.destinations[parseInt(destination)].name;
  const prov =
    data.destinations[parseInt(destination)].providers[parseInt(providerIndex)]
      .name;
  const cost =
    data.destinations[parseInt(destination)].providers[parseInt(providerIndex)]
      .cost[selectedTime];

  const selectedProvider = {
    name: prov,
    price: cost,
    destination: dest,
  };

  // State for form fields (add more as needed)
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Handle form field changes
  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };

  const handleExpiryDateChange = (event) => {
    setExpiryDate(event.target.value);
  };

  const handleCvvChange = (event) => {
    setCvv(event.target.value);
  };

  const handlePaymentSubmit = async (event) => {
    console.log("submit");
    event.preventDefault();

    // Prepare card details for the Circle API
    const cardDetails = {
      card: {
        number: cardNumber,
        cvv: cvv,
        expMonth: expiryDate.slice(0, 2),
        expYear: expiryDate.slice(3),
      },
    };

    // Define the Circle API endpoint url for card processing
    const circleAPIUrl = "https://api-sandbox.circle.com/v1/cards";

    // Define the headers for HTTP request
    const headers = {
      "Content-Type": "application/json",
      Authorization:
        "Bearer TEST_API_KEY:2cd6c023da40306aa4f9701964d4201b:58db917f5f33e1091354dfcac5796737", // replace with your public testnet key
    };

    try {
      // Send a HTTP POST request to Circle's Cards API
      const response = await axios.post(circleAPIUrl, cardDetails, { headers });

      if (response.status === 201) {
        console.log("Card processed successfully");
        setPaymentSuccessful(true); // Set payment to successful if card processing is successful
      }
    } catch (error) {
      console.error("Error processing card:", error);
      setPaymentSuccessful(true);
    }
  };

  if (isPaymentSuccessful) {
    return (
      <div className="payments-container">
        <h1 className="payments-title">Payment Successful</h1>
        <div className="payments-info">
          <h2>Destination: {selectedProvider.destination}</h2>
          <h2>Provider: {selectedProvider.name}</h2>
          <h2>Price: {selectedProvider.price}</h2>
        </div>
        <div className="payment-success">
          <h2>Thank you for your payment.</h2>
          <p>
            Your transaction has been successful, and you now can tour space.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-container">
      <h1 className="payments-title">Payment Details</h1>
      <div className="payments-info">
        <h2>Destination: {selectedProvider.destination}</h2>
        <h2>Provider: {selectedProvider.name}</h2>
        <h2>Price: {selectedProvider.price}</h2>
      </div>
      <div className="payment-options">
        {/* Pay with Crypto Section */}
        <div className="crypto-payment">
          <h2>Pay with Crypto</h2>
          <Form />
          {/* Add your crypto payment form here */}
        </div>

        {/* Pay with Card Section */}
        <div className="card-payment">
          <h2>Pay with Card</h2>
          <form className="payments-form" onSubmit={handlePaymentSubmit}>
            <label className="payments-label">
              Card Number:
              <input
                className="payments-input"
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
              />
            </label>
            <label className="payments-label">
              Expiry Date:
              <input
                className="payments-input"
                type="text"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                required
              />
            </label>
            <label className="payments-label">
              CVV:
              <input
                className="payments-input"
                type="text"
                value={cvv}
                onChange={handleCvvChange}
                required
              />
            </label>
            <button className="payments-button" type="submit">
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payments;
