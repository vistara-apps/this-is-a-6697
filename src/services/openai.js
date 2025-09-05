import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

export const openaiService = {
  /**
   * Generate a custom script for a specific scenario and jurisdiction
   * @param {string} scenario - The type of police interaction
   * @param {string} jurisdiction - State/location for jurisdiction-specific advice
   * @param {string} language - Language preference (en/es)
   * @param {string} customContext - Additional context from user
   */
  async generateScript(scenario, jurisdiction = 'CA', language = 'en', customContext = '') {
    try {
      const systemPrompt = `You are a legal rights advisor specializing in police interactions. Generate clear, concise scripts that help people exercise their constitutional rights during police encounters.

IMPORTANT GUIDELINES:
- Always emphasize constitutional rights (4th, 5th, 6th amendments)
- Keep language calm, respectful, and non-confrontational
- Include specific phrases that clearly invoke rights
- Adapt advice for ${jurisdiction} state laws when relevant
- Prioritize safety over legal technicalities
- Use ${language === 'es' ? 'Spanish' : 'English'} language
- Keep scripts under 150 words
- Include both what to say AND what not to do`;

      const userPrompt = `Generate a script for: ${scenario}
${customContext ? `Additional context: ${customContext}` : ''}
Jurisdiction: ${jurisdiction}
Language: ${language === 'es' ? 'Spanish' : 'English'}

The script should be practical, legally sound, and help the person safely exercise their rights.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 300,
        temperature: 0.3
      });

      return {
        script: completion.choices[0].message.content.trim(),
        error: null
      };
    } catch (error) {
      console.error('Error generating script:', error);
      return {
        script: null,
        error: error.message || 'Failed to generate script'
      };
    }
  },

  /**
   * Generate a summary for an incident report
   * @param {Object} incidentData - The incident data
   */
  async generateIncidentSummary(incidentData) {
    try {
      const systemPrompt = `You are an assistant that creates professional incident summaries for legal documentation. Create clear, factual summaries that could be useful for legal counsel or official reporting.`;

      const userPrompt = `Create a professional summary for this incident:
Date: ${incidentData.timestamp}
Location: ${incidentData.location?.name || 'Unknown'}
Type: ${incidentData.interactionType}
Duration: ${incidentData.duration ? `${Math.floor(incidentData.duration / 60)}:${(incidentData.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
Recording: ${incidentData.recordingUrl ? 'Available' : 'None'}
Notes: ${incidentData.notes || 'None provided'}

Create a concise, professional summary suitable for legal documentation.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 200,
        temperature: 0.2
      });

      return {
        summary: completion.choices[0].message.content.trim(),
        error: null
      };
    } catch (error) {
      console.error('Error generating summary:', error);
      return {
        summary: null,
        error: error.message || 'Failed to generate summary'
      };
    }
  },

  /**
   * Get jurisdiction-specific rights information
   * @param {string} state - State abbreviation
   * @param {string} language - Language preference
   */
  async getJurisdictionRights(state, language = 'en') {
    try {
      const systemPrompt = `You are a legal expert specializing in state-specific constitutional rights during police interactions. Provide accurate, up-to-date information about rights in specific jurisdictions.`;

      const userPrompt = `Provide the key constitutional rights and state-specific laws for police interactions in ${state}. 
Language: ${language === 'es' ? 'Spanish' : 'English'}

Include:
1. Core constitutional rights (4th, 5th, 6th amendments)
2. State-specific laws or procedures
3. Recording rights in public
4. Traffic stop procedures
5. Search and seizure limitations

Keep it concise and practical for citizens to understand.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 400,
        temperature: 0.2
      });

      return {
        rights: completion.choices[0].message.content.trim(),
        error: null
      };
    } catch (error) {
      console.error('Error getting jurisdiction rights:', error);
      return {
        rights: null,
        error: error.message || 'Failed to get jurisdiction rights'
      };
    }
  }
};

// Fallback scripts when AI is unavailable
export const fallbackScripts = {
  traffic_stop: {
    en: "Officer, I'm going to remain silent. I want to speak to a lawyer. I do not consent to any searches. I am not resisting arrest. If you're arresting me, I want to know why.",
    es: "Oficial, voy a permanecer en silencio. Quiero hablar con un abogado. No consiento a ningún registro. No me estoy resistiendo al arresto. Si me está arrestando, quiero saber por qué."
  },
  consent_search: {
    en: "Officer, I do not consent to any searches of my person, my belongings, or any area under my control. I am invoking my right to remain silent and I want to speak to a lawyer.",
    es: "Oficial, no consiento a ningún registro de mi persona, mis pertenencias, o cualquier área bajo mi control. Estoy invocando mi derecho a permanecer en silencio y quiero hablar con un abogado."
  },
  detention: {
    en: "Am I free to leave? I'm going to remain silent. I want to speak to a lawyer. I do not consent to any searches. Please don't touch me.",
    es: "¿Soy libre de irme? Voy a permanecer en silencio. Quiero hablar con un abogado. No consiento a ningún registro. Por favor no me toque."
  },
  home_search: {
    en: "I do not consent to your entry or to any search of these premises. I am invoking my right to remain silent and want to speak to a lawyer. Please show me a warrant.",
    es: "No consiento a su entrada o a ningún registro de estas instalaciones. Estoy invocando mi derecho a permanecer en silencio y quiero hablar con un abogado. Por favor muéstreme una orden judicial."
  },
  arrest: {
    en: "I am invoking my right to remain silent. I want to speak to a lawyer. I do not consent to any searches. I am not resisting arrest. Please tell me why I am being arrested.",
    es: "Estoy invocando mi derecho a permanecer en silencio. Quiero hablar con un abogado. No consiento a ningún registro. No me estoy resistiendo al arresto. Por favor dígame por qué me están arrestando."
  },
  questioning: {
    en: "I am invoking my Fifth Amendment right to remain silent. I want to speak to a lawyer before answering any questions. I do not waive any of my rights.",
    es: "Estoy invocando mi derecho de la Quinta Enmienda a permanecer en silencio. Quiero hablar con un abogado antes de responder cualquier pregunta. No renuncio a ninguno de mis derechos."
  }
};
