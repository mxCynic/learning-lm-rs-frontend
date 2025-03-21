import { useState, useRef, useEffect } from 'react';

function Story() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    try {
      setLoading(true);
      // 添加用户消息
      const userMessage = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      
      // 发送请求到原Story接口
      const res = await fetch('http://127.0.0.1:3000/api/Story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });
      
      if (!res.ok) throw new Error(`HTTP错误! 状态码: ${res.status}`);
      
      const data = await res.json();
      // 添加助手回复
      const assistantMessage = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);
      setInput('');
    } catch (error) {
      console.error('请求失败:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: `请求失败: ${error.message}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h1>Story </h1>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.role === 'user' ? (
                <strong>You: </strong>
              ) : (
                <strong>StoryBot: </strong>
              )}
              {msg.content.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="输入你的故事提示..."
          disabled={loading}
          rows={3}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? '生成中...' : '生成故事'}
        </button>
      </div>
    </div>
  );
}

export default Story;
