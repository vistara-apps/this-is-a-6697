import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Copy, Check, Sparkles, RefreshCw, Globe } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ScriptCard = ({ scenario, title, description, script, locked = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customContext, setCustomContext] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [currentScript, setCurrentScript] = useState(script);
  const { state, generateScript, setLanguage } = useApp();

  const canAccess = !locked || state.subscriptionStatus !== 'free';
  const canGenerateAI = state.subscriptionStatus === 'premium';

  const handleCopy = async () => {
    if (!canAccess) return;
    
    try {
      await navigator.clipboard.writeText(currentScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePlayAudio = () => {
    if (!canAccess) return;
    
    const utterance = new SpeechSynthesisUtterance(currentScript);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.lang = state.language === 'es' ? 'es-ES' : 'en-US';
    speechSynthesis.speak(utterance);
  };

  const handleGenerateScript = async () => {
    if (!canGenerateAI) {
      alert('AI-generated scripts require a premium subscription. Please upgrade to access this feature.');
      return;
    }

    setIsGenerating(true);
    try {
      const generatedScript = await generateScript(scenario, customContext);
      setCurrentScript(generatedScript);
      setShowCustomInput(false);
      setCustomContext('');
    } catch (error) {
      console.error('Failed to generate script:', error);
      alert('Failed to generate custom script. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLanguageToggle = () => {
    const newLanguage = state.language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
  };

  const resetToOriginal = () => {
    setCurrentScript(script);
    setCustomContext('');
    setShowCustomInput(false);
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
              {canGenerateAI && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>AI</span>
                </span>
              )}
            </div>
            <p className="text-text-secondary text-sm mt-1">{description}</p>
            
            {/* Location and Language Info */}
            {state.location && (
              <div className="flex items-center space-x-4 mt-2 text-xs text-text-secondary">
                <span>📍 {state.location.state || 'Unknown'}</span>
                <span className="flex items-center space-x-1">
                  <Globe className="h-3 w-3" />
                  <span>{state.language === 'es' ? 'Español' : 'English'}</span>
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <button
              onClick={handleLanguageToggle}
              className="p-2 hover:bg-gray-100 rounded-md text-text-secondary hover:text-text-primary"
              title="Toggle Language"
            >
              <Globe className="h-4 w-4" />
            </button>
            
            {/* Expand/Collapse */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-md"
              disabled={locked && !canAccess}
            >
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {canAccess ? (
              <>
                {/* AI Generation Controls */}
                {canGenerateAI && (
                  <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-800">AI Script Generation</span>
                      <button
                        onClick={() => setShowCustomInput(!showCustomInput)}
                        className="text-purple-600 hover:text-purple-800 text-sm"
                      >
                        {showCustomInput ? 'Hide' : 'Customize'}
                      </button>
                    </div>
                    
                    {showCustomInput && (
                      <div className="mb-3">
                        <textarea
                          value={customContext}
                          onChange={(e) => setCustomContext(e.target.value)}
                          placeholder="Add specific context or details for your situation..."
                          className="w-full p-2 border border-purple-300 rounded-md text-sm resize-none"
                          rows="2"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleGenerateScript}
                        disabled={isGenerating}
                        className="flex items-center space-x-2 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        <span>{isGenerating ? 'Generating...' : 'Generate AI Script'}</span>
                      </button>
                      
                      {currentScript !== script && (
                        <button
                          onClick={resetToOriginal}
                          className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Script Display */}
                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <p className="text-text-primary leading-relaxed">{currentScript}</p>
                  {currentScript !== script && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <span className="text-xs text-purple-600 flex items-center space-x-1">
                        <Sparkles className="h-3 w-3" />
                        <span>AI-generated script</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 flex-wrap gap-2">
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

                {/* Jurisdiction Info */}
                {state.jurisdictionData && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                      {state.jurisdictionData.state} Specific Information
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      {state.jurisdictionData.specificLaws?.slice(0, 2).map((law, index) => (
                        <li key={index}>• {law}</li>
                      ))}
                    </ul>
                  </div>
                )}
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
