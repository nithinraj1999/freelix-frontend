import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000"; 

const socket = io(SOCKET_SERVER_URL, {
  withCredentials: true, // To send cookies with requests
});

export default socket;
