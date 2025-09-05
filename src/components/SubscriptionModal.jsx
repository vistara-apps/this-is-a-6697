import React, { useState } from 'react';
import { Check, X, Crown, Shield } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const SubscriptionModal = ({ onClose }) => {
  const { setSubscription } = useApp();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$0.99',
      period: 'month',
      description: 'Core scripts and basic documentation',
      features: [
        'Basic interaction scripts',
        'State-specific rights info',
        'Audio recording',
        'Basic incident reports',
        'Email support'
      ],
      icon: Shield,
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$2.99',
      period: 'month',
      description: 'Advanced scripts and enhanced documentation',
      features: [
        'All Basic features',
        'AI-generated custom scripts',
        'Video recording',
        'Advanced incident analytics',
        'Shareable professional reports',
        'Priority support',
        'Legal resource library',
        'Multi-language support'
      ],
      icon: Crown,
      popular: true
    }
  ];

  const handleSubscribe = async (planId) => {
    setLoading(true);
    
    // Mock Stripe integration
    try {
      // In a real app, you would integrate with Stripe here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setSubscription(planId);
      alert(`Successfully subscribed to ${planId} plan!`);
      onClose();
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Choose Your Plan</h2>
              <p className="text-text-secondary mt-1">
                Upgrade to access premium features and enhanced protection
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-lg border-2 p-6 ${
                    plan.popular
                      ? 'border-accent bg-green-50'
                      : 'border-gray-200 bg-surface'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <Icon className={`h-12 w-12 mx-auto mb-4 ${plan.popular ? 'text-accent' : 'text-primary'}`} />
                    <h3 className="text-xl font-semibold text-text-primary">{plan.name}</h3>
                    <p className="text-text-secondary text-sm mt-1">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
                      <span className="text-text-secondary">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-text-primary text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-md font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-accent hover:bg-green-600 text-white'
                        : 'bg-primary hover:bg-blue-600 text-white'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Processing...' : `Subscribe to ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-2">
                ✓ Cancel anytime • ✓ 30-day money-back guarantee • ✓ Secure payment with Stripe
              </p>
              <button
                onClick={onClose}
                className="text-primary hover:text-blue-600 text-sm font-medium"
              >
                Continue with Free Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;