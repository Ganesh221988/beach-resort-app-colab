import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

export class RealTimeService {
  private io: SocketServer;

  constructor(server: HttpServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle joining property-specific rooms
      socket.on('join-property', (propertyId: string) => {
        socket.join(`property-${propertyId}`);
      });

      // Handle leaving property-specific rooms
      socket.on('leave-property', (propertyId: string) => {
        socket.leave(`property-${propertyId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  // Notify all clients about availability changes for a specific property
  public notifyAvailabilityChange(propertyId: string, updates: any) {
    this.io.to(`property-${propertyId}`).emit('availability-update', {
      propertyId,
      updates
    });
  }

  // Notify about new bookings
  public notifyNewBooking(propertyId: string, bookingData: any) {
    this.io.to(`property-${propertyId}`).emit('new-booking', {
      propertyId,
      booking: bookingData
    });
  }

  // Notify about booking cancellations
  public notifyBookingCancellation(propertyId: string, bookingId: string) {
    this.io.to(`property-${propertyId}`).emit('booking-cancelled', {
      propertyId,
      bookingId
    });
  }
}
