import axios from 'axios';

// Function to fetch live flight data from the backend
export const fetchLiveFlights = async () => {
  const response = await axios.get('http://localhost:5000/api/flights');
  return response.data;
};
