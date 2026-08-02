require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { askClaude } = require('./services/claudeService');
const RequestModel = require('./models/requestModel');

const app = express();

// مهم مع Railway
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.send('AI Layer is working');
});

// اختبار سريع
app.get('/chat', (req, res) => {
    res.send('Chat endpoint is working');
});

// الـ AI Endpoint
app.post('/ask', async (req, res) => {

    try {

        const request = new RequestModel(req.body);

        if (!request.question) {
            return res.status(400).json({
                success: false,
                error: "Question is required"
            });
        }

        console.log("==================================");
        console.log("Request Received");
        console.log(request);
        console.log("==================================");

        const answer = await askClaude(request);

        res.json({
            success: true,
            answer: answer
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

app.listen(PORT, () => {
    console.log(`AI Layer is running on port ${PORT}`);
});