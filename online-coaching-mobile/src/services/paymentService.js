import RazorpayCheckout from 'razorpay-react-native';

class PaymentService {
  constructor() {
    this.razorpayKey = 'YOUR_RAZORPAY_KEY'; // Replace with your actual Razorpay key
  }

  async initiatePayment(options) {
    try {
      const {
        amount,
        currency = 'INR',
        orderId,
        description = 'Course Enrollment',
        name = 'Online Coaching',
        email,
        contact,
        notes = {},
      } = options;

      const paymentOptions = {
        key: this.razorpayKey,
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        name,
        description,
        order_id: orderId,
        prefill: {
          email,
          contact,
        },
        notes,
        theme: {
          color: '#4F46E5',
        },
      };

      const result = await RazorpayCheckout.open(paymentOptions);
      
      return {
        success: true,
        paymentId: result.razorpay_payment_id,
        orderId: result.razorpay_order_id,
        signature: result.razorpay_signature,
      };
    } catch (error) {
      console.log('Payment error:', error);
      return {
        success: false,
        error: error.description || error.code || 'Payment failed',
        code: error.code,
      };
    }
  }

  async processRefund(paymentId, amount) {
    // This would typically call your backend API for refund processing
    // Razorpay refunds need to be processed server-side for security
    try {
      // const response = await paymentAPI.refundPayment(paymentId, amount);
      return {
        success: true,
        refundId: 'refund_' + Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: 'Refund processing failed',
      };
    }
  }

  async getPaymentStatus(paymentId) {
    // This would call your backend API to check payment status
    try {
      // const response = await paymentAPI.getPaymentStatus(paymentId);
      return {
        success: true,
        status: 'captured',
        amount: 0,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch payment status',
      };
    }
  }

  async createOrder(amount, currency = 'INR', receipt) {
    // This would call your backend API to create a Razorpay order
    // Orders should be created server-side for security
    try {
      // const response = await paymentAPI.createOrder(amount, currency, receipt);
      return {
        success: true,
        orderId: 'order_' + Date.now(),
        amount,
        currency,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create order',
      };
    }
  }
}

export default new PaymentService();
