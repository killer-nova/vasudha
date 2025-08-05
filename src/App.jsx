
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
  const [loading, setLoading] = useState(false);
  const [lastEmotion, setLastEmotion] = useState(null);
  const chatRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { text: input, isUser: true };
    setMessages(msgs => [...msgs, userMsg]);
    const emotion = detectEmotion(input);
    setLastEmotion(emotion);
    setInput('');
    setLoading(true);
    try {
      const aiText = await fetchAIResponse(input, emotion);
      setMessages(msgs => [...msgs, { text: aiText, isUser: false }]);
    } catch {
      setMessages(msgs => [...msgs, { text: 'Sorry, there was an error connecting to AI.', isUser: false }]);
    }
    setLoading(false);
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 100);
  };

  return (
    <div className="custom-bg">
      <div className="chat-card">
        <h1 className="chat-title">Emotional AI</h1>
        <p className="chat-desc">
          I detect your emotion, understand your tone, and respond empathetically.<br />
          <span className="chat-highlight">Your feelings matter here.</span>
        </p>
        {lastEmotion && (
          <div className="emotion-bar">
            <span className="emotion-emoji">{emotionToEmoji(lastEmotion)}</span>
            <span>
              Detected emotion: <b className="emotion-label">{lastEmotion.charAt(0).toUpperCase() + lastEmotion.slice(1)}</b>
            </span>
          </div>
        )}
        <div ref={chatRef} className="chat-box chat-box-wide">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-row ${msg.isUser ? 'chat-row-user' : 'chat-row-ai'}`}>
              <div className={`chat-bubble ${msg.isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-row chat-row-ai">
              <div className="chat-bubble chat-bubble-ai">Thinking...</div>
            </div>
          )}
        </div>
        <form className="chat-input-row" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            autoFocus
            className="chat-input"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="chat-send-btn"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
