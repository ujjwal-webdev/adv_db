import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import { Polyline } from 'react-leaflet';


const AircraftMap = () => {
  const [flights, setFlights] = useState([]);

  // Custom plane icon
  const planeIcon = new L.Icon({
    iconUrl: 'https://img.icons8.com/ios-filled/50/000000/airport.png',
    iconSize: [25, 25],
  });

  // Fetch flight data from backend
  const fetchFlights = async () => {
    try {
      const res = await api.get('/flights');
      setFlights(res.data);
    } catch (err) {
      console.error('Error fetching flights:', err.message);
    }
  };

  useEffect(() => {
    fetchFlights(); // Initial fetch
    const interval = setInterval(fetchFlights, 15000); // Refresh every 15s
    return () => clearInterval(interval); // Cleanup
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredFlights = flights.filter(flight => {
    const query = searchTerm.toLowerCase();
    return (
      flight.icao24?.toLowerCase().includes(query) ||
      flight.callsign?.toLowerCase().includes(query) ||
      flight.origin_country?.toLowerCase().includes(query)
    );
  });

  const [selectedTrail, setSelectedTrail] = useState([]);
  const fetchFlightTrail = async (icao24) => {
    try {
      const res = await api.get(`/flights/${icao24}/trail`);
      const trail = res.data.map(coord => [coord.latitude, coord.longitude]);
      setSelectedTrail(trail);
    } catch (err) {
      console.error('Error fetching trail:', err.message);
      setSelectedTrail([]);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <input
            type="text"
            placeholder="Search callsign / ICAO24 / country"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="absolute z-[1000] top-4 left-4 p-2 rounded shadow bg-white border"
        />
      <div className="w-[80vw] h-[80vh] rounded-lg shadow overflow-hidden border">
        <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full"
        >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {filteredFlights.map((flight) => (
          <Marker
            key={flight.icao24}
            position={[flight.latitude, flight.longitude]}
            icon={planeIcon}
            eventHandlers={{
              click: () => fetchFlightTrail(flight.icao24)
            }}
          >
            <Popup>
              <div>
                <p><strong>Icao24:</strong> {flight.icao24 || 'N/A'}</p>
                <p><strong>Callsign:</strong> {flight.callsign || 'N/A'}</p>
                <p><strong>Country:</strong> {flight.origin_country}</p>
                <p><strong>Altitude:</strong> {flight.altitude} m</p>
                <p><strong>Velocity:</strong> {flight.velocity} m/s</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {selectedTrail.length > 1 && (
          <Polyline positions={selectedTrail} color="blue" />
        )}
        </MapContainer>
      </div>
    </div>
  );
};

export default AircraftMap;
