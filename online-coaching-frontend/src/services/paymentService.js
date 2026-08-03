import { paymentAPI } from './api';

class PaymentService {
  constructor() {
    this.razorpayKey = 'YOUR_RAZORPAY_KEY'; // Replace with actual key
  }

  setRazorpayKey(key) {
    this.razorpayKey = key;
  }

  async createOrder(studentId, courseId, amount, currency = 'INR', planType = 'FULL') {
    try {
      const response = await paymentAPI.createOrder({
        studentId,
        courseId,
        amount,
        currency,
        planType,
        receipt: `receipt_${Date.now()}`,
        notes: `Course enrollment - ${planType} plan`,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async verifyPayment(orderId, paymentId, signature) {
    try {
      const response = await paymentAPI.verifyPayment(orderId, paymentId, signature);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  async processRefund(paymentId) {
    try {
      const response = await paymentAPI.processRefund(paymentId);
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      const response = await paymentAPI.getPaymentStatus(paymentId);
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  initiatePayment(options) {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded'));
        return;
      }

      const razorpayOptions = {
        key: this.razorpayKey,
        amount: options.amount * 100, // Amount in paise
        currency: options.currency || 'INR',
        name: 'Online Coaching System',
        description: options.description || 'Course Enrollment',
        order_id: options.orderId,
        handler: async (response) => {
          try {
            const verification = await this.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            resolve({
              success: true,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              verification,
            });
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: options.name || '',
          email: options.email || '',
          contact: options.contact || '',
        },
        theme: {
          color: '#4F46E5',
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
        },
      };

      const rzp = new window.Razorpay(razorpayOptions);
      rzp.open();
    });
  }
}

export default new PaymentService();
