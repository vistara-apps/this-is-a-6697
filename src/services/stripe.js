// Note: In production, Stripe operations should be handled on the backend for security
// This is a client-side implementation for demonstration purposes

export const stripeService = {
  /**
   * Initialize Stripe (would typically be done with Stripe.js library)
   * For now, this is a mock implementation
   */
  async initialize() {
    // In production, you would load Stripe.js and initialize it
    // const stripe = Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    // return stripe;
    
    console.log('Stripe service initialized (mock)');
    return {
      mock: true,
      publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    };
  },

  /**
   * Create a payment intent for subscription
   * @param {string} planId - The subscription plan ID
   * @param {Object} customerInfo - Customer information
   */
  async createSubscription(planId, customerInfo) {
    try {
      // In production, this would be a call to your backend API
      // which would then create the subscription with Stripe
      
      const mockResponse = await this.mockStripeCall({
        action: 'create_subscription',
        planId,
        customerInfo,
        amount: this.getPlanAmount(planId)
      });

      return {
        success: true,
        subscriptionId: mockResponse.subscriptionId,
        clientSecret: mockResponse.clientSecret,
        status: 'active'
      };
    } catch (error) {
      console.error('Stripe subscription creation failed:', error);
      return {
        success: false,
        error: error.message || 'Payment processing failed'
      };
    }
  },

  /**
   * Create a one-time payment intent
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code
   * @param {Object} metadata - Additional metadata
   */
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const mockResponse = await this.mockStripeCall({
        action: 'create_payment_intent',
        amount,
        currency,
        metadata
      });

      return {
        success: true,
        paymentIntentId: mockResponse.paymentIntentId,
        clientSecret: mockResponse.clientSecret,
        status: 'requires_payment_method'
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      return {
        success: false,
        error: error.message || 'Payment processing failed'
      };
    }
  },

  /**
   * Cancel a subscription
   * @param {string} subscriptionId - The subscription ID to cancel
   */
  async cancelSubscription(subscriptionId) {
    try {
      const mockResponse = await this.mockStripeCall({
        action: 'cancel_subscription',
        subscriptionId
      });

      return {
        success: true,
        status: 'canceled',
        canceledAt: mockResponse.canceledAt
      };
    } catch (error) {
      console.error('Stripe subscription cancellation failed:', error);
      return {
        success: false,
        error: error.message || 'Cancellation failed'
      };
    }
  },

  /**
   * Update subscription plan
   * @param {string} subscriptionId - Current subscription ID
   * @param {string} newPlanId - New plan ID
   */
  async updateSubscription(subscriptionId, newPlanId) {
    try {
      const mockResponse = await this.mockStripeCall({
        action: 'update_subscription',
        subscriptionId,
        newPlanId,
        amount: this.getPlanAmount(newPlanId)
      });

      return {
        success: true,
        subscriptionId: mockResponse.subscriptionId,
        status: 'active',
        updatedAt: mockResponse.updatedAt
      };
    } catch (error) {
      console.error('Stripe subscription update failed:', error);
      return {
        success: false,
        error: error.message || 'Update failed'
      };
    }
  },

  /**
   * Get subscription details
   * @param {string} subscriptionId - The subscription ID
   */
  async getSubscription(subscriptionId) {
    try {
      const mockResponse = await this.mockStripeCall({
        action: 'get_subscription',
        subscriptionId
      });

      return {
        success: true,
        subscription: mockResponse.subscription
      };
    } catch (error) {
      console.error('Failed to get subscription:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve subscription'
      };
    }
  },

  /**
   * Get customer's payment methods
   * @param {string} customerId - The customer ID
   */
  async getPaymentMethods(customerId) {
    try {
      const mockResponse = await this.mockStripeCall({
        action: 'get_payment_methods',
        customerId
      });

      return {
        success: true,
        paymentMethods: mockResponse.paymentMethods
      };
    } catch (error) {
      console.error('Failed to get payment methods:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve payment methods'
      };
    }
  },

  /**
   * Create a customer portal session for managing subscriptions
   * @param {string} customerId - The customer ID
   * @param {string} returnUrl - URL to return to after managing subscription
   */
  async createPortalSession(customerId, returnUrl) {
    try {
      const mockResponse = await this.mockStripeCall({
        action: 'create_portal_session',
        customerId,
        returnUrl
      });

      return {
        success: true,
        url: mockResponse.url
      };
    } catch (error) {
      console.error('Failed to create portal session:', error);
      return {
        success: false,
        error: error.message || 'Failed to create portal session'
      };
    }
  },

  /**
   * Get plan amount in cents
   * @param {string} planId - The plan ID
   */
  getPlanAmount(planId) {
    const plans = {
      'basic': 99, // $0.99
      'premium': 299 // $2.99
    };
    return plans[planId] || 0;
  },

  /**
   * Get plan details
   * @param {string} planId - The plan ID
   */
  getPlanDetails(planId) {
    const plans = {
      'basic': {
        id: 'basic',
        name: 'Basic',
        price: 0.99,
        currency: 'usd',
        interval: 'month',
        features: [
          'Basic interaction scripts',
          'State-specific rights info',
          'Audio recording',
          'Basic incident reports',
          'Email support'
        ]
      },
      'premium': {
        id: 'premium',
        name: 'Premium',
        price: 2.99,
        currency: 'usd',
        interval: 'month',
        features: [
          'All Basic features',
          'AI-generated custom scripts',
          'Video recording',
          'Advanced incident analytics',
          'Shareable professional reports',
          'Priority support',
          'Legal resource library',
          'Multi-language support'
        ]
      }
    };
    return plans[planId] || null;
  },

  /**
   * Mock Stripe API call for development/testing
   * In production, these would be actual API calls to your backend
   */
  async mockStripeCall(params) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Simulate occasional failures for testing
    if (Math.random() < 0.05) { // 5% failure rate
      throw new Error('Payment processing temporarily unavailable');
    }

    const mockId = () => Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();

    switch (params.action) {
      case 'create_subscription':
        return {
          subscriptionId: `sub_${mockId()}`,
          clientSecret: `seti_${mockId()}_secret_${mockId()}`,
          status: 'active',
          createdAt: now
        };

      case 'create_payment_intent':
        return {
          paymentIntentId: `pi_${mockId()}`,
          clientSecret: `pi_${mockId()}_secret_${mockId()}`,
          status: 'requires_payment_method',
          createdAt: now
        };

      case 'cancel_subscription':
        return {
          subscriptionId: params.subscriptionId,
          status: 'canceled',
          canceledAt: now
        };

      case 'update_subscription':
        return {
          subscriptionId: params.subscriptionId,
          status: 'active',
          updatedAt: now
        };

      case 'get_subscription':
        return {
          subscription: {
            id: params.subscriptionId,
            status: 'active',
            currentPeriodStart: now,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            plan: this.getPlanDetails('premium')
          }
        };

      case 'get_payment_methods':
        return {
          paymentMethods: [
            {
              id: `pm_${mockId()}`,
              type: 'card',
              card: {
                brand: 'visa',
                last4: '4242',
                expMonth: 12,
                expYear: 2025
              }
            }
          ]
        };

      case 'create_portal_session':
        return {
          url: `https://billing.stripe.com/session/${mockId()}`
        };

      default:
        throw new Error('Unknown action');
    }
  },

  /**
   * Format amount for display
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code
   */
  formatAmount(amount, currency = 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  },

  /**
   * Validate card number (basic validation)
   * @param {string} cardNumber - Card number
   */
  validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  },

  /**
   * Validate expiry date
   * @param {string} expiry - Expiry in MM/YY format
   */
  validateExpiry(expiry) {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;
    const now = new Date();
    const expiryDate = new Date(year, month - 1);

    return month >= 1 && month <= 12 && expiryDate > now;
  },

  /**
   * Validate CVV
   * @param {string} cvv - CVV code
   */
  validateCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
  }
};
