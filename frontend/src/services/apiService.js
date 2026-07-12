import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getAnalysis = async (company) => {
  const response = await axios.post(`${API_BASE_URL}/api/analyze`, { company });

  if (!response.data?.success) {
    throw new Error(response.data?.error || 'Analysis request failed.');
  }

  return response.data.data;
};
