import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, InputGroup, FormControl, Button, Badge } from 'react-bootstrap';
import GeminiTTS from './geminiTTS';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const geminiTTS = new GeminiTTS();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('es-CL')
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsGenerating(true);

    try {
      // Generar audio usando Gemini TTS
      const audioData = await geminiTTS.textToSpeech(inputText);
      
      // Crear blob de audio
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const assistantMessage = {
        id: Date.now() + 1,
        text: inputText,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('es-CL'),
        audioUrl: audioUrl
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentAudio(audioUrl);
      
      // Reproducir audio automáticamente
      setTimeout(() => {
        playAudio(audioUrl);
      }, 500);
      
    } catch (error) {
      console.error('Error al generar audio:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Lo siento, no pude generar el audio. Por favor, intenta nuevamente.',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('es-CL'),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = (audioUrl) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('error', (e) => {
      console.error('Error reproduciendo audio:', e);
      setIsPlaying(false);
    });
    
    audio.play().catch(error => {
      console.error('Error al reproducir audio:', error);
      setIsPlaying(false);
    });
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <Container fluid className="py-3">
        <Row className="mb-3">
          <Col>
            <div className="text-center">
              <h1 className="h3 mb-0">
                <i className="bi bi-mic-fill text-primary me-2"></i>
                DemoVoz - Chat con Voz Chilena
              </h1>
              <p className="text-muted mb-0">
                Escribe tu mensaje y escúchalo con acento chileno
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={8} className="mx-auto">
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="text-center text-muted mt-5">
                  <i className="bi bi-chat-dots display-1"></i>
                  <p className="mt-3">¡Hola! Escribe un mensaje para comenzar a chatear con voz.</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.sender}`}>
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <Badge bg={message.sender === 'user' ? 'primary' : 'secondary'}>
                      {message.sender === 'user' ? 'Tú' : 'Voz'}
                    </Badge>
                    <small className="text-muted">{message.timestamp}</small>
                  </div>
                  <div className="message-content">
                    {message.text}
                  </div>
                  {message.audioUrl && (
                    <div className="audio-controls mt-2">
                      <Button
                        size="sm"
                        variant={isPlaying && currentAudio === message.audioUrl ? 'danger' : 'success'}
                        onClick={() => playAudio(message.audioUrl)}
                        disabled={isPlaying && currentAudio !== message.audioUrl}
                      >
                        <i className={`bi ${isPlaying && currentAudio === message.audioUrl ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                        {isPlaying && currentAudio === message.audioUrl ? ' Pausar' : ' Reproducir'}
                      </Button>
                    </div>
                  )}
                  {message.isError && (
                    <div className="text-danger mt-2">
                      <i className="bi bi-exclamation-triangle"></i>
                    </div>
                  )}
                </div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <InputGroup>
                <FormControl
                  placeholder="Escribe tu mensaje aquí..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isGenerating}
                  as="textarea"
                  rows={2}
                />
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Generando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill me-2"></i>
                      Enviar
                    </>
                  )}
                </Button>
              </InputGroup>
              
              {isPlaying && (
                <div className="mt-2 text-center">
                  <Button variant="outline-danger" size="sm" onClick={stopAudio}>
                    <i className="bi bi-stop-fill me-2"></i>
                    Detener reproducción
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <div className="text-center text-muted">
              <small>
                <i className="bi bi-info-circle me-1"></i>
                Configuración: Voz Achernar (Femenino) • Acento Chileno • 
                Velocidad: 1.29x • Volumen: -5dB • Sample Rate: 44.1kHz
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;