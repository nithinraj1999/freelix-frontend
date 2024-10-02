import axios from 'axios';

const freelancerInstance = axios.create({
  baseURL: 'http://localhost:5000/api/freelancer',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default freelancerInstance;
