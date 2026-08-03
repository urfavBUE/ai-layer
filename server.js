require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { askClaude } = require('./services/claudeService');
const RequestModel = require('./models/requestModel');
const { registerTTSRoute } = require('./ttsRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Register multilingual Text-to-Speech endpoint:
// POST /tts
registerTTSRoute(app);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ERP Intelligence AI Layer is working',
  });
});

app.get('/chat', (req, res) => {
  res.json({
    success: true,
    message: 'Chat endpoint is working',
  });
});

app.post('/ask', async (req, res) => {
  try {
    const request = new RequestModel(req.body);

    if (!request.question || !request.question.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Question is required',
      });
    }

    console.log('==================================');
    console.log('ERP Intelligence Request Received');
    console.log({
      question: request.question,
      session: request.session,
    });
    console.log('==================================');

    const result = await askClaude(request);

    return res.json({
      success: true,
      answer: result.answer,
      evidence: result.evidence || [],
      risks: result.risks || [],
      recommendations: result.recommendations || [],
      followUpSuggestions: result.followUpSuggestions || [],
      navigationTargets: result.navigationTargets || [],
    });
  } catch (err) {
    console.error('AI Layer Error:', err);

    return res.status(500).json({
      success: false,
      error: err.message || 'AI request failed',
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `ERP Intelligence AI Layer is running on port ${PORT}`
  );
});