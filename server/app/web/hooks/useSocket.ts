import socket from '@/io';
import { useEffect } from 'react';

export default ({
  dispatch: any,
}) => {
  useEffect(() => {
    socket.on('connect', () => {
      const id = socket.id;
      
      socket.on(id, msg => {
        console.log('#receive,', msg);
      });
    });

    return () => {
      socket.disconnect();
    }
  }, [])
}