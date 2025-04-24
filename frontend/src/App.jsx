import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AircraftMap from './components/AircraftMap';

function App() {
  return (
    <div className="w-screen h-screen">
      <AircraftMap />
    </div>
  );
}

export default App
