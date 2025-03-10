import { API_BASE_URL } from '../config/config';

// Example API call
const fetchData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/endpoint`);
  return response.json();
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to connect to the server');
  }
}; 