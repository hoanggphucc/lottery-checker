import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const lotteryApi = axios.create({
  baseURL: process.env.LOTTERY_API,
  headers: {
    'X-API-Key': process.env.LOTTERY_API_KEY,
  },
});

lotteryApi.interceptors.response.use(
  (response) => {
    // Return the response data directly (optional, saves you from typing .data everywhere)
    return response.data;
  },
  async (error) => {
    // Handle global errors here
    if (error.response && error.response.status === 401) {
      // Example: Redirect to login or attempt to refresh the access token
      console.log('Unauthorized! Redirecting to login...');
    }
    return Promise.reject(error);
  },
);

export default lotteryApi;
