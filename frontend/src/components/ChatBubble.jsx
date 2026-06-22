import { Bot } from "lucide-react";

export default function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} animate-fade-in`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[80%] sm:max-w-[70%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        {!isUser && (
          <span className="text-[10px] text-gray-500 mb-1 ml-1">StudyFlow AI</span>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-indigo-600 text-white rounded-br-md"
              : "bg-dark-800 border border-dark-700 text-gray-200 rounded-bl-md"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>

        {/* Practice Question card (only on AI responses) */}
        {!isUser && message.practiceQuestion && (
          <div className="mt-2 p-3 rounded-xl bg-dark-800/50 border border-dark-700/50 hover:border-indigo-500/20 transition-all duration-200">
            <p className="text-xs font-medium text-indigo-400 mb-1">📝 Practice Question</p>
            <p className="text-xs text-gray-400">{message.practiceQuestion}</p>
          </div>
        )}

        <span className={`text-[10px] text-gray-600 mt-1 ${isUser ? "text-right mr-1" : "ml-1"}`}>
          {message.time}
        </span>
      </div>
    </div>
  );
}
