import { useEffect, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { AvailabilityUpdate, BookingUpdate, BookingCancellation } from '../types/availability';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

interface UseRealTimeAvailabilityProps {
  propertyId: string;
}

export const useRealTimeAvailability = ({ propertyId }: UseRealTimeAvailabilityProps) => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [availabilityUpdates, setAvailabilityUpdates] = useState<AvailabilityUpdate[]>([]);
  const [newBookings, setNewBookings] = useState<BookingUpdate[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 5000; // 5 seconds

  const connect = useCallback(() => {
    try {
      setConnectionStatus('connecting');
      setError(null);

      const newSocket = io(BACKEND_URL, {
        reconnection: true,
        reconnectionDelay: RECONNECT_INTERVAL,
        reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
        timeout: 10000,
      });

      newSocket.on('connect', () => {
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        newSocket.emit('join-property', propertyId);
      });

      newSocket.on('connect_error', (err: Error) => {
        setError(`Connection error: ${err.message}`);
        setConnectionStatus('disconnected');
      });

      newSocket.on('disconnect', (reason: string) => {
        setConnectionStatus('disconnected');
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, attempt to reconnect
          setTimeout(() => {
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
              setReconnectAttempts(prev => prev + 1);
              connect();
            } else {
              setError('Maximum reconnection attempts reached');
            }
          }, RECONNECT_INTERVAL);
        }
      });

      // Setup event listeners with error handling
      newSocket.on('availability-update', (update: AvailabilityUpdate) => {
        try {
          setAvailabilityUpdates(prev => [...prev, update]);
        } catch (err) {
          setError(`Failed to process availability update: ${(err as Error).message}`);
        }
      });

      newSocket.on('new-booking', (booking: BookingUpdate) => {
        try {
          setNewBookings(prev => [...prev, booking]);
        } catch (err) {
          setError(`Failed to process new booking: ${(err as Error).message}`);
        }
      });

      newSocket.on('booking-cancelled', ({ bookingId }: BookingCancellation) => {
        try {
          setCancelledBookings(prev => [...prev, bookingId]);
        } catch (err) {
          setError(`Failed to process booking cancellation: ${(err as Error).message}`);
        }
      });

      setSocket(newSocket);
    } catch (err) {
      setError(`Failed to initialize socket: ${(err as Error).message}`);
      setConnectionStatus('disconnected');
    }
  }, [propertyId, reconnectAttempts]);

  // Initialize connection
  useEffect(() => {
    connect();
    return () => {
      if (socket) {
        socket.emit('leave-property', propertyId);
        socket.disconnect();
      }
    };
  }, [connect, propertyId, socket]);

  const reconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
    }
    setReconnectAttempts(0);
    connect();
  }, [connect, socket]);

  return {
    availabilityUpdates,
    newBookings,
    cancelledBookings,
    connectionStatus,
    error,
    reconnect,
    reconnectAttempts,
    isConnected: connectionStatus === 'connected'
  };
};
