import { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import { askAiChat } from "../api/aiChat";

const subjects = ["Math", "Physics", "Chemistry", "Biology"];

const suggestions = [
  "Explain Newton's 2nd Law",
  "Help me with Quadratic Equations",
  "What is Photosynthesis?",
  "How does DNA replication work?",
  "Explain the Periodic Table trends",
];

function getTime() {
  const now = new Date();
  return now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatTab() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg = { role: "user", text: msg, time: getTime(), subject };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Call real AI backend
    setTyping(true);
    try {
      const res = await askAiChat({
        message: msg,
        subjectContext: subject || "",
        messageHistory: messages.slice(-5),
      });

      const aiMsg = {
        role: "ai",
        text: res.data.text,
        time: getTime(),
        messagesUsed: res.data.messagesUsed,
        messagesLimit: res.data.messagesLimit,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to get AI response. Please try again.";
      setError(errMsg);
      // Show error as an AI message so the user sees it inline
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: `⚠️ ${errMsg}`, time: getTime() },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  const toggleSubject = (s) => {
    setSubject((prev) => (prev === s ? "" : s));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] sm:h-[calc(100vh-10rem)]">
      {/* Rate limit warning */}
      {error && error.includes("daily limit") && (
        <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Bot className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              Ask me anything about your studies
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              I can help explain concepts, solve problems, and create practice
              questions. Try one of the suggestions below!
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} />
        ))}

        {typing && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompts (when chat is empty) */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(s)}
              className="px-3 py-1.5 text-xs text-gray-400 bg-dark-800 border border-dark-700 hover:border-indigo-500/30 hover:text-indigo-300 rounded-xl transition-all duration-200 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Subject context chips */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-500">Context:</span>
        {subjects.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => toggleSubject(s)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-200 cursor-pointer ${
              subject === s
                ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                : "bg-dark-800 text-gray-500 border-dark-600 hover:border-gray-500"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="relative flex items-end gap-2 bg-dark-800/80 border border-dark-700 rounded-2xl p-2 focus-within:border-indigo-500/40 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all duration-200">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={`Ask about ${subject || "any subject"}...`}
          rows={1}
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none resize-none px-2 py-1.5 max-h-[120px]"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!input.trim() || typing}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-dark-700 disabled:text-gray-500 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed cursor-pointer shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Chat usage indicator */}
      {messages.length > 0 && messages[messages.length - 1]?.messagesUsed && (
        <div className="mt-2 text-center">
          <span className="text-[10px] text-gray-600">
            AI messages used: {messages[messages.length - 1].messagesUsed}/{messages[messages.length - 1].messagesLimit}
          </span>
        </div>
      )}
    </div>
  );
}
