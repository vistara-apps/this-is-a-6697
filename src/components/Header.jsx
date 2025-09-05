import React, { useState } from 'react';
import { Shield, Menu, X, User, Settings } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import SubscriptionModal from './SubscriptionModal';

const Header = () => {
  const { state } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  const getSubscriptionBadge = () => {
    if (state.subscriptionStatus === 'premium') return 'Premium';
    if (state.subscriptionStatus === 'basic') return 'Basic';
    return 'Free';
  };

  const getSubscriptionColor = () => {
    if (state.subscriptionStatus === 'premium') return 'bg-accent text-white';
    if (state.subscriptionStatus === 'basic') return 'bg-primary text-white';
    return 'bg-gray-200 text-gray-700';
  };

  return (
    <>
      <header className="bg-surface shadow-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-text-primary">Guardian Guide</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button className="text-text-secondary hover:text-text-primary transition-colors">
                Dashboard
              </button>
              <button className="text-text-secondary hover:text-text-primary transition-colors">
                My Incidents
              </button>
              <button className="text-text-secondary hover:text-text-primary transition-colors">
                Rights Guide
              </button>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {/* Location */}
              <div className="hidden sm:block text-sm text-text-secondary">
                📍 {state.currentLocation}
              </div>

              {/* Subscription Badge */}
              <span 
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${getSubscriptionColor()}`}
                onClick={() => setShowSubscription(true)}
              >
                {getSubscriptionBadge()}
              </span>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Desktop User Menu */}
              <div className="hidden md:flex items-center space-x-2">
                <button className="p-2 rounded-md hover:bg-gray-100">
                  <User className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-md hover:bg-gray-100">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="space-y-2">
                <button className="block w-full text-left px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-md">
                  Dashboard
                </button>
                <button className="block w-full text-left px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-md">
                  My Incidents
                </button>
                <button className="block w-full text-left px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-md">
                  Rights Guide
                </button>
                <button className="block w-full text-left px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-md">
                  Profile
                </button>
                <button className="block w-full text-left px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-md">
                  Settings
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {showSubscription && (
        <SubscriptionModal onClose={() => setShowSubscription(false)} />
      )}
    </>
  );
};

export default Header;