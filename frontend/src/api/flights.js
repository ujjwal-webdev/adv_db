import axios from 'axios';

export const fetchLiveFlights = async () => {
  const response = await axios.get('http://localhost:5050/api/flights/live'); 
  return response.data;
};

