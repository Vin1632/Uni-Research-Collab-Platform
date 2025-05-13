

import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then((response) => response.json()) 
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error('There was an error fetching the message!', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>{message}</h1>
      <h3>Uni is here, Love</h3>
    </div>
  );
}

export default App;
