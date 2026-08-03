const OPENAI_SPEECH_URL = 'https://api.openai.com/v1/audio/speech';
const MAX_TEXT_LENGTH = 4096;

/**
 * Detect whether the supplied text contains Arabic characters.
 */
function isArabic(text) {
  return /[\u0600-\u06FF]/.test(String(text || ''));
}

/**
 * Build voice instructions according to the detected/requested language.
 */
function buildVoiceInstructions(text, requestedLanguage) {
  const language =
    requestedLanguage === 'ar' || isArabic(text)
      ? 'ar'
      : 'en';

  if (language === 'ar') {
    return [
      'Speak in clear, natural Arabic.',
      'Use a warm Egyptian conversational character.',
      'Sound energetic, confident, friendly, and human.',
      'Pronounce all Arabic words fully and clearly.',
      'Read numbers and currencies clearly in Arabic.',
      'Use natural pauses and executive-assistant intonation.',
      'Do not translate, summarize, or omit any content.',
    ].join(' ');
  }

  return [
    'Speak in clear, natural English.',
    'Sound energetic, confident, friendly, and human.',
    'Use natural pauses and executive-assistant intonation.',
    'Read numbers and currencies clearly.',
    'Do not translate, summarize, or omit any content.',
  ].join(' ');
}

/**
 * Register:
 * POST /tts
 *
 * Expected body:
 * {
 *   "text": "Text to read",
 *   "language": "ar" | "en"
 * }
 */
function registerTTSRoute(app) {
  if (!app || typeof app.post !== 'function') {
    throw new Error(
      'registerTTSRoute requires a valid Express app instance.'
    );
  }

  app.post('/tts', async (req, res) => {
    try {
      const apiKey = String(
        process.env.OPENAI_API_KEY || ''
      ).trim();

      if (!apiKey) {
        return res.status(500).json({
          success: false,
          error:
            'OPENAI_API_KEY is not configured on the backend.',
        });
      }

      const text = String(
        req.body?.text || ''
      ).trim();

      const language =
        req.body?.language === 'ar' || isArabic(text)
          ? 'ar'
          : 'en';

      if (!text) {
        return res.status(400).json({
          success: false,
          error: 'text is required.',
        });
      }

      if (text.length > MAX_TEXT_LENGTH) {
        return res.status(400).json({
          success: false,
          error:
            `text must not exceed ${MAX_TEXT_LENGTH} characters.`,
        });
      }

      console.log('==================================');
      console.log('TTS Request Received');
      console.log({
        language,
        textLength: text.length,
      });
      console.log('==================================');

      const openAIResponse = await fetch(
        OPENAI_SPEECH_URL,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini-tts',
            voice: 'marin',
            input: text,
            instructions: buildVoiceInstructions(
              text,
              language
            ),
            response_format: 'mp3',
          }),
        }
      );

      if (!openAIResponse.ok) {
        const upstreamText =
          await openAIResponse.text();

        console.error(
          '[TTS] OpenAI provider error:',
          openAIResponse.status,
          upstreamText
        );

        return res.status(502).json({
          success: false,
          error:
            `Speech provider failed with HTTP ${openAIResponse.status}.`,
          providerDetails: upstreamText,
        });
      }

      const audioArrayBuffer =
        await openAIResponse.arrayBuffer();

      const audioBuffer =
        Buffer.from(audioArrayBuffer);

      if (!audioBuffer.length) {
        return res.status(502).json({
          success: false,
          error:
            'The speech provider returned an empty audio file.',
        });
      }

      res.setHeader(
        'Content-Type',
        'audio/mpeg'
      );

      res.setHeader(
        'Content-Length',
        audioBuffer.length
      );

      res.setHeader(
        'Content-Disposition',
        'inline; filename="speech.mp3"'
      );

      res.setHeader(
        'Cache-Control',
        'no-store'
      );

      res.setHeader(
        'X-Content-Type-Options',
        'nosniff'
      );

      return res.send(audioBuffer);
    } catch (error) {
      console.error(
        '[TTS] Unexpected error:',
        error
      );

      return res.status(500).json({
        success: false,
        error:
          error?.message ||
          'Could not generate speech.',
      });
    }
  });
}

module.exports = {
  registerTTSRoute,
};