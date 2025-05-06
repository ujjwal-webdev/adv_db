import axios from 'axios';

export const getRestrictedAirspaces = async () => {
  const res = await axios.get('/api/airspaces/restricted');
  return res.data;
};
