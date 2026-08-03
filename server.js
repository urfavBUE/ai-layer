require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { askClaude } = require('./services/claudeService');
const RequestModel = require('./models/requestModel');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ERP Intelligence AI Layer is working',
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
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

    console.log('ERP Intelligence request:', {
      question: request.question,
      user: request.user,
      historyCount: request.conversationHistory?.length || 0,
    });

    const result = await askClaude(request);

    return res.json({
      success: true,
      answer: result.answer,
      evidence: result.evidence || [],
      risks: result.risks || [],
      recommendations: result.recommendations || [],
      followUpSuggestions: result.followUpSuggestions || [],
      navigationTargets: result.navigationTargets || [],
      conversationContext: result.conversationContext || {},
    });
  } catch (error) {
    console.error('AI Layer Error:', error);

    return res.status(500).json({
      success: false,
      error: error?.message || 'AI request failed',
    });
  }
});

app.listen(PORT, () => {
  console.log(`ERP Intelligence AI Layer running on port ${PORT}`);
});