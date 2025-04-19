import React, { useEffect, useState } from 'react';
import { fetchLiveFlights } from '../api/flights';

const Dashboard = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const getFlights = async () => {
      try {
        const data = await fetchLiveFlights();
        setFlights(data);
      } catch (error) {
        console.error('Failed to fetch flights:', error);
      }
    };

    getFlights();
    const interval = setInterval(getFlights, 5000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div>
      <h1>Live Flights</h1>
      <ul>
        {flights.map((flight, index) => (
          <li key={index}>
            ICAO24: {flight.icao24} | Callsign: {flight.callsign} | Altitude: {flight.altitude} | Speed: {flight.speed}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
