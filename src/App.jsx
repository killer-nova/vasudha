
import { useState, useRef } from 'react';


function detectEmotion(text) {
  // Enhanced keyword-based emotion detection
  const lower = text.toLowerCase();
  if (/(sad|unhappy|depressed|upset|cry|down|miserable|tear|blue|hopeless|gloomy|heartbroken|sorrow|grief)/.test(lower)) return 'sad';
  if (/(happy|joy|excited|glad|yay|awesome|delighted|cheerful|elated|content|pleased|smile|grin|ecstatic|thrilled|bliss)/.test(lower)) return 'happy';
  if (/(angry|mad|furious|annoyed|hate|irritated|rage|frustrated|resent|outraged|cross|enraged|fuming|agitated)/.test(lower)) return 'angry';
  if (/(scared|afraid|fear|nervous|anxious|terrified|worried|panicked|petrified|apprehensive|shaky|timid|startled|alarmed)/.test(lower)) return 'scared';
  if (/(love|like|adore|fond|cherish|affection|devoted|caring|passion|crush|infatuated|admire|sweetheart|dear|beloved)/.test(lower)) return 'love';
  if (/(bored|meh|tired|sleepy|exhausted|dull|weary|fatigued|uninterested|listless|yawn|restless|sluggish|lazy)/.test(lower)) return 'bored';
  if (/(confused|uncertain|unsure|puzzled|lost|perplexed|bewildered|disoriented|hesitant)/.test(lower)) return 'confused';
  if (/(surprised|amazed|astonished|shocked|startled|stunned|speechless|flabbergasted)/.test(lower)) return 'surprised';
  return 'neutral';
}

function emotionToEmoji(emotion) {
  switch (emotion) {
    case 'happy': return '😊';
    case 'sad': return '😢';
    case 'angry': return '😠';
    case 'scared': return '😨';
    case 'love': return '❤️';
    case 'bored': return '😐';
    default: return '🙂';
  }
}

async function fetchAIResponse(userMessage, emotion) {
  const apiKey = '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';
  const prompt = `You are an empathetic AI. The user is feeling ${emotion}. Respond in a way that acknowledges their emotion and helps them.\nUser: ${userMessage}\nAI:`;
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        { role: 'system', content: 'You are an empathetic AI assistant that detects user emotion and responds accordingly.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 256,
      temperature: 0.7,
      n: 1
    })
  });
  const data = await res.json();
  // Perplexity API response structure is similar to OpenAI's
  return data.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not understand.';
}

function App() {
  const [messages, setMessages] = useState([
    { text: 'Hi! I am your Emotional AI. How are you feeling today?', isUser: false }
  ]);
  const [input, setInput] = useState('');


}
import { useEffect } from 'react';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Chat from './Chat';
import About from './About';

function App() {
  useEffect(() => {
    document.title = 'Emotional AI - Vasudha 2025';
  }, []);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}


export default App;
