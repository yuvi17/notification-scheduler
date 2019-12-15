import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [email, setEmail] = useState("");

  function submitForm(event) {
    event.preventDefault();
    console.log(email, source, destination, time);
    postData({
      email: email,
      source: source,
      destination: destination,
      time: new Date(time).toString
    });
  }


  function postData(options) {
    fetch('/when-to-book', {
      method: 'POST',
      body: JSON.stringify(options),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={submitForm}>
          <label> Source </label>
          <input 
            type="text" 
            onChange={(event) => { setSource(event.target.value)} }
            valeu = {source}
            placeholder="Comma Separated Values of Lat,Long" 
          />
          <label> Destination </label>
          <input 
            type="text" 
            onChange={(event) => { setDestination(event.target.value)} }
            valeu = {destination}
            placeholder="Comma Separated Values of Lat,Long" 
          />
          <label> Email </label>
          <input
            type="text" 
            onChange={(event) => { setEmail(event.target.value)} }
            valeu = {email}
            placeholder="youremail@example.com" 
          />
          <label> Arrival Time </label>
          <input
            type="datetime-local" 
            onChange={(event) => { setTime(event.target.value)} }
            valeu = {time}
            placeholder="Time"
          />
          <button type="submit"> Submit </button>
        </form>
      </header>
    </div>
  );
}

export default App;
