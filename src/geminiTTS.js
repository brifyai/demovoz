import axios from 'axios';

class GeminiTTS {
  constructor() {
    this.apiKey = 'AQ.Ab8RN6LSwMMhIfqNhFb4BdigZBQDzJIEXz5uU4PamPYNDhyl_w';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  }

  async textToSpeech(text) {
    try {
      const requestBody = {
        contents: [{
          parts: [{
            text: `Eres un lector de noticias de radio en chile, por ello debes leer con acento chileno, pausado y manejando los tiempos, tanto de silencios como puntuación. Por favor, lee el siguiente texto: ${text}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          candidateCount: 1,
          responseMimeType: "audio/wav",
          responseSchema: {
            type: "string",
            format: "binary"
          }
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Achernar",
              languageCode: "es-MX"
            }
          },
          audioConfig: {
            audioEncoding: "LINEAR16",
            sampleRateHertz: 44100,
            pitch: 0.0,
              speakingRate: 1.29,
              volumeGainDb: -5.0
          }
        }
      };

      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer'
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error en Gemini TTS:', error);
      throw new Error('Error al generar el audio');
    }
  }

  // Método alternativo usando la API de Google Cloud Text-to-Speech
  async textToSpeechAlternative(text) {
    try {
      const requestBody = {
        input: {
          text: text
        },
        voice: {
          languageCode: "es-MX",
          name: "es-MX-Wavenet-A",
          ssmlGender: "FEMALE"
        },
        audioConfig: {
          audioEncoding: "LINEAR16",
          sampleRateHertz: 44100,
          speakingRate: 1.29,
          pitch: 0.0,
          volumeGainDb: -5.0,
          effectsProfileId: ["headphone-class-device"]
        }
      };

      // Nota: Esta sería la implementación para Google Cloud TTS
      // Se necesitaría una API key diferente de Google Cloud
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data.audioContent;
    } catch (error) {
      console.error('Error en TTS alternativo:', error);
      throw new Error('Error al generar el audio');
    }
  }
}

export default GeminiTTS;