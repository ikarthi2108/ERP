import axios from 'axios';

// const API_URL = 'http://13.127.69.100:5000/api/users'; 
// const API_URL = 'https://13.127.69.100:5000/api/users'; 

const API_URL = 'https://krishna-a4lf.onrender.com/api/users'; 
// const API_URL = 'http://172.20.10.7:5000/api/users';




export const login = async (username, password) => {
  console.log(username, password);

  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data.user; // Successfully return the user data
  } catch (error) {
    console.error('Error in login request:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Server error'); // Throw the error to the caller
  }
};
