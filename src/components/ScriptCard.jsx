import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Copy, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ScriptCard = ({ scenario, title, description, script, locked = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { state } = useApp();

  const canAccess = !locked || state.subscriptionStatus !== 'free';

  const handleCopy = async () => {
    if (!canAccess) return;
    
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePlayAudio = () => {
    if (!canAccess) return;
    
    // Mock audio playback
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className={`bg-surface rounded-lg shadow-card border ${locked && !canAccess ? 'opacity-60' : ''}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg text-text-primary">{title}</h3>
              {locked && !canAccess && (
                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                  Premium
                </span>
              )}
            </div>
            <p className="text-text-secondary text-sm mt-1">{description}</p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-md"
            disabled={locked && !canAccess}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {canAccess ? (
              <>
                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <p className="text-text-primary leading-relaxed">{script}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handlePlayAudio}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Play className="h-4 w-4" />
                    <span>Play Audio</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-text-secondary mb-3">Upgrade to access premium scripts</p>
                <button className="px-4 py-2 bg-accent text-white rounded-md hover:bg-green-600 transition-colors">
                  Upgrade Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptCard;