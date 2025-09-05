import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import ScriptCard from './ScriptCard';
import RecordButton from './RecordButton';
import IncidentList from './IncidentList';

const Dashboard = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('scripts');

  const scenarios = [
    {
      id: 'traffic_stop',
      title: 'Traffic Stop',
      description: 'What to say and do during a traffic stop',
      script: "Officer, I'm going to remain silent. I want to speak to a lawyer. I do not consent to any searches. I am not resisting arrest. If you're arresting me, I want to know why.",
      locked: false
    },
    {
      id: 'consent_search',
      title: 'Consent to Search',
      description: 'How to refuse consent to search your person or property',
      script: "Officer, I do not consent to any searches of my person, my belongings, or any area under my control. I am invoking my right to remain silent and I want to speak to a lawyer.",
      locked: false
    },
    {
      id: 'detention',
      title: 'Detention/Stop & Frisk',
      description: 'Your rights during detention or stop and frisk',
      script: "Am I free to leave? I'm going to remain silent. I want to speak to a lawyer. I do not consent to any searches. Please don't touch me.",
      locked: true
    },
    {
      id: 'home_search',
      title: 'Home Search',
      description: 'Protecting your home from warrantless searches',
      script: "I do not consent to your entry or to any search of these premises. I am invoking my right to remain silent and want to speak to a lawyer. Please show me a warrant.",
      locked: true
    },
    {
      id: 'arrest',
      title: 'Arrest Situation',
      description: 'What to do if you are being arrested',
      script: "I am invoking my right to remain silent. I want to speak to a lawyer. I do not consent to any searches. I am not resisting arrest. Please tell me why I am being arrested.",
      locked: true
    },
    {
      id: 'questioning',
      title: 'Police Questioning',
      description: 'How to handle police questions and interrogation',
      script: "I am invoking my Fifth Amendment right to remain silent. I want to speak to a lawyer before answering any questions. I do not waive any of my rights.",
      locked: true
    }
  ];

  const jurisdictionInfo = {
    state: state.location?.state || 'CA',
    rights: [
      'You have the right to remain silent',
      'You have the right to refuse consent to searches',
      'You have the right to ask if you are free to leave',
      'You have the right to an attorney',
      'You have the right to record police interactions in public'
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Location Banner */}
      <div className="bg-primary text-white rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">
          📍 Current Location: {state.currentLocation}
        </h2>
        <p className="text-blue-100 text-sm">
          Legal information below is specific to {jurisdictionInfo.state} state laws
        </p>
      </div>

      {/* Emergency Notice */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h3 className="text-red-800 font-semibold mb-2">⚠️ Emergency Situations</h3>
        <p className="text-red-700 text-sm">
          If you feel your safety is threatened, call 911. This app provides guidance for peaceful interactions.
          Always prioritize your safety over any legal rights.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('scripts')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'scripts'
              ? 'bg-surface text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Scripts & Rights
        </button>
        <button
          onClick={() => setActiveTab('record')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'record'
              ? 'bg-surface text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Quick Record
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'incidents'
              ? 'bg-surface text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          My Incidents ({state.incidents.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'scripts' && (
        <div className="space-y-6">
          {/* Your Rights Section */}
          <div className="bg-surface rounded-lg shadow-card p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              Your Rights in {jurisdictionInfo.state}
            </h3>
            <ul className="space-y-2">
              {jurisdictionInfo.rights.map((right, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2.5 flex-shrink-0"></div>
                  <span className="text-text-primary">{right}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Scenario Scripts */}
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">Interaction Scripts</h3>
            <div className="grid gap-4">
              {scenarios.map((scenario) => (
                <ScriptCard
                  key={scenario.id}
                  scenario={scenario.id}
                  title={scenario.title}
                  description={scenario.description}
                  script={scenario.script}
                  locked={scenario.locked}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'record' && (
        <div className="max-w-md mx-auto">
          <RecordButton />
          
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Recording Tips</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Keep your phone visible and announce you're recording</li>
              <li>• Record from a safe distance</li>
              <li>• Stay calm and don't interfere with police duties</li>
              <li>• Know that recording police in public is legal in most states</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'incidents' && (
        <div>
          <IncidentList />
        </div>
      )}
    </div>
  );
};

export default Dashboard;