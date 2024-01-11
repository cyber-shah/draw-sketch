import './App.css';
import { useEffect } from 'react';
import io from 'socket.io-client';

function App() {
  useEffect(() => {
    const socket = io('http://127.0.0.1:5000');

    socket.on('connect', () => {
      console.log('connected with the server');
    })
  }, []);

  return (
    <div className="App">

    </div>
  );
}

export default App;
