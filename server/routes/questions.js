const express = require('express');
const router = express.Router();
require('dotenv').config();

const { OpenAI } = require('openai');

/*

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY   // GPTTTTTTTTTTTTTTTTTTTTTTTTTT
});

*/

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'  // OpenRouterrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
});


// Route to generate AI-based questions
router.post('/', async (req, res) => {
  const { jobDescription } = req.body;

  try {
    const prompt = `Generate 5 technical interview questions for this job: ${jobDescription}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = completion.choices[0].message.content;
    const questions = content.split('\n').filter(q => q.trim());

    res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

/*

// Route to generate AI-based feedback
router.post('/feedback', async (req, res) => {
  const { questions, userAnswers } = req.body;

  const formattedQnA = questions.map((q, i) => `Q: ${q}\nA: ${userAnswers[i] || 'N/A'}`).join('\n\n');
  const prompt = `You are an interview coach. Give feedback based on these answers:\n\n${formattedQnA}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const feedback = completion.choices[0].message.content;

    res.json({ feedback });
  } catch (error) {
    console.error("Error generating feedback:", error);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});

*/

module.exports = router;


// faceeeeeeeeeeeeeeeee

router.post('/feedback', async (req, res) => {
  const { questions, userAnswers, facialData } = req.body;

  const formattedQnA = questions.map((q, i) => `Q: ${q}\nA: ${userAnswers[i] || 'N/A'}`).join('\n\n');

  let extraObservation = '';
  if (facialData) {
    if (facialData.sad > 0.4 || facialData.fearful > 0.3) {
      extraObservation = 'The candidate appeared nervous or uncomfortable during the session.';
    } else if (facialData.happy > 0.4) {
      extraObservation = 'The candidate appeared confident and relaxed.';
    }
  }

  const prompt = `You are an interview coach. Based on these answers and observations, give feedback:\n\n${formattedQnA}\n\nNotes: ${extraObservation}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const feedback = completion.choices[0].message.content;

    res.json({ feedback });
  } catch (error) {
    console.error("Error generating feedback:", error);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});
