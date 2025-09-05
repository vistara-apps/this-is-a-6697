// Jurisdiction-specific legal data for US states
// This data should be regularly updated by legal experts

export const jurisdictionData = {
  'AL': {
    state: 'Alabama',
    abbreviation: 'AL',
    stopAndIdentify: false,
    recordingLegal: true,
    rights: [
      'You have the right to remain silent',
      'You have the right to refuse consent to searches',
      'You have the right to ask if you are free to leave',
      'You have the right to an attorney',
      'You have the right to record police interactions in public'
    ],
    specificLaws: [
      'Alabama does not have a stop-and-identify statute',
      'Recording police in public is legal under First Amendment',
      'Consent searches require clear, voluntary consent'
    ],
    trafficStopProcedure: 'Officer must have reasonable suspicion for traffic stop. You must provide license, registration, and insurance when requested.',
    searchLimitations: 'Police need probable cause or consent for vehicle searches. Passengers have right to remain silent.',
    lastUpdated: '2024-01-01'
  },

  'AK': {
    state: 'Alaska',
    abbreviation: 'AK',
    stopAndIdentify: false,
    recordingLegal: true,
    rights: [
      'You have the right to remain silent',
      'You have the right to refuse consent to searches',
      'You have the right to ask if you are free to leave',
      'You have the right to an attorney',
      'You have the right to record police interactions in public'
    ],
    specificLaws: [
      'Alaska does not have a stop-and-identify statute',
      'Strong privacy protections under Alaska Constitution',
      'Recording police is protected under state constitution'
    ],
    trafficStopProcedure: 'Must provide license and registration when requested. Passengers not required to identify unless arrested.',
    searchLimitations: 'Alaska has stronger privacy protections than federal law. Warrant generally required for searches.',
    lastUpdated: '2024-01-01'
  },

  'AZ': {
    state: 'Arizona',
    abbreviation: 'AZ',
    stopAndIdentify: false,
    recordingLegal: true,
    rights: [
      'You have the right to remain silent',
      'You have the right to refuse consent to searches',
      'You have the right to ask if you are free to leave',
      'You have the right to an attorney',
      'You have the right to record police interactions in public'
    ],
    specificLaws: [
      'Arizona does not have a stop-and-identify statute',
      'SB 1070 immigration law affects some interactions',
      'Recording police is legal in public spaces'
    ],
    trafficStopProcedure: 'Driver must provide license, registration, insurance. Immigration status questions may arise.',
    searchLimitations: 'Consent searches must be voluntary. Vehicle searches require probable cause or consent.',
    lastUpdated: '2024-01-01'
  },

  'CA': {
    state: 'California',
    abbreviation: 'CA',
    stopAndIdentify: false,
    recordingLegal: true,
    rights: [
      'You have the right to remain silent',
      'You have the right to refuse consent to searches',
      'You have the right to ask if you are free to leave',
      'You have the right to an attorney',
      'You have the right to record police interactions in public',
      'Sanctuary state protections for immigrants'
    ],
    specificLaws: [
      'California does not have a stop-and-identify statute',
      'TRUTH Act limits cooperation with immigration enforcement',
      'Strong protections for recording police interactions',
      'AB 953 requires data collection on police stops'
    ],
    trafficStopProcedure: 'Driver must provide license, registration, insurance. Police cannot extend stop for immigration enforcement.',
    searchLimitations: 'California has strong privacy protections. Consent must be clear and voluntary.',
    lastUpdated: '2024-01-01'
  },

  'FL': {
    state: 'Florida',
    abbreviation: 'FL',
    stopAndIdentify: false,
    recordingLegal: true,
    rights: [
      'You have the right to remain silent',
      'You have the right to refuse consent to searches',
      'You have the right to ask if you are free to leave',
      'You have the right to an attorney',
      'You have the right to record police interactions in public',
      'Stand Your Ground law protections'
    ],
    specificLaws: [
      'Florida does not have a stop-and-identify statute',
      'Stand Your Ground law affects self-defense situations',
      'Recording police is legal in public spaces',
      'Strong sunshine laws for government transparency'
    ],
    trafficStopProcedure: 'Must provide license, registration, insurance when requested. Passengers not required to identify.',
    searchLimitations: 'Consent searches require voluntary consent. Vehicle searches need probable cause.',
    lastUpdated: '2024-01-01'
  },

  'NY': {
    state: 'New York',
    abbreviation: 'NY',
    stopAndIdentify: false,
    recordingLegal: true,
    rights: [
      'You have the right to remain silent',
      'You have the right to refuse consent to searches',
      'You have the right to ask if you are free to leave',
      'You have the right to an attorney',
      'You have the right to record police interactions in public',
      'Right to Know Act protections'
    ],
    specificLaws: [
      'New York does not have a stop-and-identify statute',
      'Right to Know Act requires officers to identify themselves',
      'Stop and frisk requires reasonable suspicion',
      'Recording police is protected under state law'
    ],
    trafficStopProcedure: 'Driver must provide license, registration, insurance. Officer must explain reason for stop.',
    searchLimitations: 'Stop and frisk requires reasonable suspicion. Consent searches must be voluntary.',
    lastUpdated: '2024-01-01'
  },

  'TX': {
    state: 'Texas',
    abbreviation: 'TX',
    stopAndIdentify: true,
    recordingLegal: true,
    rights: [
      'You have the right to remain silent',
      'You have the right to refuse consent to searches',
      'You have the right to ask if you are free to leave',
      'You have the right to an attorney',
      'You have the right to record police interactions in public',
      'Must identify if lawfully arrested'
    ],
    specificLaws: [
      'Texas has a stop-and-identify statute (Penal Code 38.02)',
      'Must provide name if lawfully arrested',
      'Open carry permitted with license',
      'Recording police is legal in public spaces'
    ],
    trafficStopProcedure: 'Must provide license, registration, insurance. Must identify if arrested.',
    searchLimitations: 'Consent searches require voluntary consent. Vehicle searches need probable cause or consent.',
    lastUpdated: '2024-01-01'
  },

  // Add more states as needed...
  'DEFAULT': {
    state: 'Unknown',
    abbreviation: 'XX',
    stopAndIdentify: false,
    recordingLegal: true,
    rights: [
      'You have the right to remain silent',
      'You have the right to refuse consent to searches',
      'You have the right to ask if you are free to leave',
      'You have the right to an attorney',
      'Constitutional rights apply nationwide'
    ],
    specificLaws: [
      'Constitutional rights apply in all US jurisdictions',
      'Local laws may vary - consult local legal resources',
      'Recording police in public is generally protected'
    ],
    trafficStopProcedure: 'Generally must provide license, registration, insurance when requested.',
    searchLimitations: 'Fourth Amendment protections apply nationwide.',
    lastUpdated: '2024-01-01'
  }
};

// Multi-language support for rights
export const rightsTranslations = {
  en: {
    'You have the right to remain silent': 'You have the right to remain silent',
    'You have the right to refuse consent to searches': 'You have the right to refuse consent to searches',
    'You have the right to ask if you are free to leave': 'You have the right to ask if you are free to leave',
    'You have the right to an attorney': 'You have the right to an attorney',
    'You have the right to record police interactions in public': 'You have the right to record police interactions in public'
  },
  es: {
    'You have the right to remain silent': 'Tienes el derecho a permanecer en silencio',
    'You have the right to refuse consent to searches': 'Tienes el derecho a rechazar el consentimiento para registros',
    'You have the right to ask if you are free to leave': 'Tienes el derecho a preguntar si eres libre de irte',
    'You have the right to an attorney': 'Tienes el derecho a un abogado',
    'You have the right to record police interactions in public': 'Tienes el derecho a grabar interacciones policiales en público'
  }
};

// Scenario-specific advice by jurisdiction
export const scenarioAdvice = {
  traffic_stop: {
    general: 'Remain calm, keep hands visible, provide required documents when requested.',
    CA: 'California officers cannot extend stops for immigration enforcement.',
    TX: 'You must identify yourself if lawfully arrested.',
    NY: 'Officer must explain reason for stop under Right to Know Act.',
    FL: 'Stand Your Ground law may apply in extreme situations.'
  },
  consent_search: {
    general: 'You have the right to refuse consent to searches.',
    CA: 'California has strong privacy protections - consent must be clear.',
    TX: 'Consent must be voluntary - you can withdraw consent.',
    NY: 'Stop and frisk requires reasonable suspicion.',
    FL: 'Consent searches require voluntary agreement.'
  },
  detention: {
    general: 'Ask if you are free to leave. If detained, ask for the reason.',
    CA: 'California does not require identification unless arrested.',
    TX: 'Must provide name if lawfully arrested.',
    NY: 'Stop and frisk requires reasonable suspicion of criminal activity.',
    FL: 'You are not required to identify unless arrested.'
  }
};

/**
 * Get jurisdiction data for a state
 * @param {string} state - State abbreviation
 * @param {string} language - Language preference
 */
export function getJurisdictionData(state, language = 'en') {
  const data = jurisdictionData[state] || jurisdictionData['DEFAULT'];
  
  // Translate rights if needed
  if (language === 'es') {
    const translatedRights = data.rights.map(right => 
      rightsTranslations.es[right] || right
    );
    return {
      ...data,
      rights: translatedRights
    };
  }
  
  return data;
}

/**
 * Get scenario-specific advice for a jurisdiction
 * @param {string} scenario - The scenario type
 * @param {string} state - State abbreviation
 */
export function getScenarioAdvice(scenario, state) {
  const advice = scenarioAdvice[scenario];
  if (!advice) return null;
  
  return {
    general: advice.general,
    specific: advice[state] || null
  };
}

/**
 * Check if a state has stop-and-identify laws
 * @param {string} state - State abbreviation
 */
export function hasStopAndIdentify(state) {
  const data = jurisdictionData[state] || jurisdictionData['DEFAULT'];
  return data.stopAndIdentify;
}

/**
 * Check if recording police is legal in a state
 * @param {string} state - State abbreviation
 */
export function isRecordingLegal(state) {
  const data = jurisdictionData[state] || jurisdictionData['DEFAULT'];
  return data.recordingLegal;
}

/**
 * Get all available states
 */
export function getAvailableStates() {
  return Object.keys(jurisdictionData).filter(key => key !== 'DEFAULT');
}
