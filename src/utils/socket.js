import { io } from 'socket.io-client';

const socket = io('http://192.168.1.7:3001', {
  transports: ['websocket', 'polling'],
});

export default socket;
