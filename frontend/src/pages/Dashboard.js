import React, { useEffect, useState } from 'react';
import { fetchLiveFlights } from '../api/flights';

const Dashboard = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFlights = async () => {
      try {
        const data = await fetchLiveFlights();
        setFlights(data.states); // OpenSky API uses 'states' key
      } catch (error) {
        console.error('Failed to fetch flights:', error);
      } finally {
        setLoading(false);
      }
    };

    getFlights();
  }, []);

  return (
    <div>
      <h1>Live Flights</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {flights.map((flight, index) => (
            <li key={index}>
              ICAO24: {flight[0]} | Callsign: {flight[1]} | Altitude: {flight[7]} | Velocity: {flight[9]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
