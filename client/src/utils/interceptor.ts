import axios from 'axios';

axios.interceptors.response.use(
  (response) => {
    const newToken = response.headers['Token'];
    if (newToken) {
      localStorage.setItem('accessToken', newToken);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 403) {
    }
    return Promise.reject(error);
  }
);
