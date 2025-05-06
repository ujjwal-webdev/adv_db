import React, { useEffect, useState } from 'react';
import api from '../services/api';

function WeatherAlertsTable() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/flights/alerts/all');
      setAlerts(res.data);
    } catch (err) {
      console.error('Failed to fetch weather alerts', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 pb-10 pt-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Weather Alerts</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p className="text-center text-green-600">No flights are currently flying into severe weather.</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-6 text-left">ICAO24</th>
              <th className="py-3 px-6 text-left">Condition</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-6">{alert.icao24}</td>
                <td className="py-2 px-6 text-red-600 font-semibold">{alert.condition}</td>
                <td className="py-2 px-6">{alert.description}</td>
                <td className="py-2 px-6">{new Date(alert.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WeatherAlertsTable;
