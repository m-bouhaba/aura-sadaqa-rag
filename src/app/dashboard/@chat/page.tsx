// src/app/dashboard/@chat/page.tsx
"use client";

import React, { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input) return;
    // Ici on pourrait appeler chat-action.ts
    setMessages([...messages, input, "Réponse IA simulée 🌙"]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 rounded-md bg-yellow-100">
            {msg}
          </div>
        ))}
      </div>

      <div className="mt-auto flex">
        <input
          className="flex-1 border border-gray-300 rounded-l-md p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question..."
        />
        <button
          className="bg-yellow-400 text-black px-4 rounded-r-md"
          onClick={handleSend}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
