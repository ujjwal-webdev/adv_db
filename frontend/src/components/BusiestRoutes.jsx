import { useEffect, useState } from 'react';
import api from '../services/api'; // Axios instance

function BusiestRoutes() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchBusiestRoutes();
  }, []);

  const fetchBusiestRoutes = async () => {
    try {
      const res = await api.get('/flights/busiest'); 
      setRoutes(res.data);
    } catch (err) {
      console.error('Error fetching busiest routes', err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">🌍 Busiest Flight Routes</h1>
      <table className="min-w-full bg-white rounded shadow-md">
        <thead className="bg-gray-200 text-gray-600">
          <tr>
            <th className="py-3 px-6 text-left">Origin</th>
            <th className="py-3 px-6 text-left">Destination</th>
            <th className="py-3 px-6 text-left">Flights</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-6">{route.origin}</td>
              <td className="py-2 px-6">{route.destination}</td>
              <td className="py-2 px-6">{route.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BusiestRoutes;
