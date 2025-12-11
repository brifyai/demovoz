# DemoVoz - Chat con Voz Chilena

Aplicación de chat con texto a voz utilizando Gemini 2.5 ProTTS con acento chileno y voz femenina.

## Características

- 🎤 **Conversión de texto a voz** en tiempo real
- 🇨🇱 **Acento chileno auténtico** con pausas y entonación natural
- 👩 **Voz Achernar (Femenina)** con lenguaje Spanish (Mexico)
- ⚡ **Configuración de audio optimizada**:
  - Audio Encoding: Linear16
  - Sample Rate: 44.1 kHz
  - Speed: 1.29x
  - Volume Gain: -5dB
- 💬 **Interfaz de chat moderna** con React y Bootstrap 5
- 🎧 **Reproducción de audio integrada** con controles

## Capturas de Pantalla

La aplicación incluye:
- Interfaz de chat intuitiva
- Mensajes con timestamp
- Controles de reproducción de audio
- Indicadores de estado
- Diseño responsive

## Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/brifyai/demovoz.git
   cd demovoz
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar la aplicación**:
   ```bash
   npm start
   ```

4. **Abrir en el navegador**:
   La aplicación se abrirá automáticamente en `http://localhost:3000`

## Uso

1. **Escribe tu mensaje** en el campo de texto
2. **Presiona Enter o clic en "Enviar"** para convertir el texto a voz
3. **Escucha el audio** con acento chileno generado automáticamente
4. **Usa los controles** para reproducir o detener el audio

## Configuración Técnica

### API de Gemini 2.5 ProTTS
- **API Key**: Configurada en `src/geminiTTS.js`
- **Modelo**: gemini-2.0-flash-exp
- **Voz**: Achernar (Female)
- **Idioma**: Spanish (Mexico) - es-MX

### Parámetros de Audio
```javascript
{
  audioEncoding: "LINEAR16",
  sampleRateHertz: 44100,
  speakingRate: 1.29,
  volumeGainDb: -5.0,
  pitch: 0.0
}
```

### Prompt del Locutor
```
Eres un lector de noticias de radio en chile, por ello debes leer con acento chileno, pausado y manejando los tiempos, tanto de silencios como puntuación.
```

## Tecnologías Utilizadas

- **React 18** - Framework frontend
- **Bootstrap 5** - Framework CSS
- **React Bootstrap** - Componentes React
- **Axios** - Cliente HTTP
- **Gemini 2.5 ProTTS** - API de texto a voz

## Estructura del Proyecto

```
demovoz/
├── public/
│   └── index.html
├── src/
│   ├── App.js              # Componente principal
│   ├── geminiTTS.js        # Servicio de Gemini TTS
│   ├── index.css           # Estilos personalizados
│   └── index.js            # Punto de entrada
├── package.json
└── README.md
```

## Notas Importantes

- La API key está configurada para usar el endpoint de Gemini 2.5 ProTTS
- El audio se genera en formato WAV con encoding Linear16
- La configuración de voz está optimizada para un sonido natural chileno
- La aplicación maneja errores de conexión y muestra mensajes apropiados

## Desarrollo

Para realizar cambios en la aplicación:

1. Modificar los componentes en `src/`
2. Los estilos personalizados están en `src/index.css`
3. La configuración de TTS está en `src/geminiTTS.js`
4. La aplicación se recarga automáticamente con `npm start`

## Branch

Este proyecto está en la rama `colivares` y está listo para su uso y desarrollo.

## Autor

Desarrollado para DemoVoz en la rama colivares.