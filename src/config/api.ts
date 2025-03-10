const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://car-auction-backend.onrender.com';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login/`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup/`,
  AUCTIONS: `${API_BASE_URL}/api/auctions/`,
  // Add other endpoints as needed
};
