import { EventEmitter } from 'events';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import User from '../models/User';

class NotificationService extends EventEmitter {
  private emailTransporter;
  private twilioClient;

  constructor() {
    super();
    
    // Initialize email transporter
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Initialize Twilio client
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Booking related events
    this.on('booking:created', this.handleBookingCreated);
    this.on('booking:confirmed', this.handleBookingConfirmed);
    this.on('booking:cancelled', this.handleBookingCancelled);

    // Payment related events
    this.on('payment:received', this.handlePaymentReceived);
    this.on('payment:failed', this.handlePaymentFailed);

    // Property related events
    this.on('property:updated', this.handlePropertyUpdated);
    this.on('property:maintenance', this.handlePropertyMaintenance);

    // User related events
    this.on('user:welcome', this.handleWelcomeUser);
    this.on('user:password-reset', this.handlePasswordReset);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.emailTransporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  private async sendSMS(to: string, message: string) {
    try {
      await this.twilioClient.messages.create({
        body: message,
        to,
        from: process.env.TWILIO_PHONE_NUMBER
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }

  private async sendWhatsApp(to: string, message: string) {
    try {
      await this.twilioClient.messages.create({
        body: message,
        to: `whatsapp:${to}`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`
      });
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
  }

  private async notifyUser(userId: string, notification: {
    email?: { subject: string; html: string };
    sms?: { message: string };
    whatsapp?: { message: string };
  }) {
    try {
      const user = await User.findByPk(userId);
      if (!user) return;

      const { notificationPreferences } = user;

      if (notification.email && notificationPreferences.email && user.email) {
        await this.sendEmail(user.email, notification.email.subject, notification.email.html);
      }

      if (notification.sms && notificationPreferences.sms && user.phone) {
        await this.sendSMS(user.phone, notification.sms.message);
      }

      if (notification.whatsapp && notificationPreferences.whatsapp && user.whatsapp) {
        await this.sendWhatsApp(user.whatsapp, notification.whatsapp.message);
      }
    } catch (error) {
      console.error('Error notifying user:', error);
    }
  }

  // Event handlers
  private async handleBookingCreated(booking: any) {
    const customerNotification = {
      email: {
        subject: 'Booking Confirmation',
        html: `Your booking for ${booking.propertyName} has been created. Booking ID: ${booking.id}`
      },
      sms: {
        message: `Your booking for ${booking.propertyName} has been created. Booking ID: ${booking.id}`
      }
    };

    const ownerNotification = {
      email: {
        subject: 'New Booking Request',
        html: `You have a new booking request for ${booking.propertyName}. Booking ID: ${booking.id}`
      },
      whatsapp: {
        message: `New booking request for ${booking.propertyName}. Booking ID: ${booking.id}`
      }
    };

    await Promise.all([
      this.notifyUser(booking.customerId, customerNotification),
      this.notifyUser(booking.ownerId, ownerNotification)
    ]);
  }

  private async handleBookingConfirmed(booking: any) {
    const notification = {
      email: {
        subject: 'Booking Confirmed',
        html: `Your booking for ${booking.propertyName} has been confirmed.`
      },
      sms: {
        message: `Your booking for ${booking.propertyName} has been confirmed.`
      },
      whatsapp: {
        message: `Your booking for ${booking.propertyName} has been confirmed.`
      }
    };

    await this.notifyUser(booking.customerId, notification);
  }

  private handleBookingCancelled() {
    // TODO: implement booking cancellation notification logic
  }

  private handlePaymentReceived() {
    // TODO: implement payment received notification logic
  }

  private handlePaymentFailed() {
    // TODO: implement payment failed notification logic
  }

  private handlePropertyUpdated() {
    // TODO: implement property updated notification logic
  }

  private handlePropertyMaintenance() {
    // TODO: implement property maintenance notification logic
  }

  private handleWelcomeUser() {
    // TODO: implement welcome user notification logic
  }

  private handlePasswordReset() {
    // TODO: implement password reset notification logic
  }

  // Add other event handlers...
}

export const notificationService = new NotificationService();
