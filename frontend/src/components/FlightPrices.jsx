import { useState } from 'react';
import api from '../services/api';

const FlightPrices = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrices = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    try {
      const res = await api.get('/prices', {
        params: { origin, destination }
      });
      setPrices(res.data);
    } catch (err) {
      console.error('Error fetching prices:', err.message);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-4 shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Flight Price Explorer</h1>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
        <input
          type="text"
          placeholder="Origin (e.g. DEL)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value.toUpperCase())}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Destination (e.g. LHR)"
          value={destination}
          onChange={(e) => setDestination(e.target.value.toUpperCase())}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={fetchPrices}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Loading...' : 'Fetch Prices'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-sm">
              <th className="py-2 px-4 text-left">Airline</th>
              <th className="py-2 px-4 text-left">Departure</th>
              <th className="py-2 px-4 text-left">Return</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Currency</th>
              <th className="py-2 px-4 text-left">Transfers</th>
            </tr>
          </thead>
          <tbody>
            {prices.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-400">
                  No results found. Try a different route.
                </td>
              </tr>
            )}
            {prices.map((item, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{item.airline || 'N/A'}</td>
                <td className="py-2 px-4">{item.departure_date}</td>
                <td className="py-2 px-4">{item.return_date || '—'}</td>
                <td className="py-2 px-4 font-semibold">{item.price}</td>
                <td className="py-2 px-4">{item.currency}</td>
                <td className="py-2 px-4">{item.transfers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlightPrices;
