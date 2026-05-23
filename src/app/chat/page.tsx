"use client";
import { useState, useEffect } from "react";
// Tipo que define la estructura de un mensaje
type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  // Lista de mensajes en pantalla
  const [messages, setMessages] = useState<Message[]>([]);
  // Texto del input
  const [input, setInput] = useState("");
  // ID único de esta conversación — se genera una sola vez
  const [conversationId] = useState(() => {
    if (typeof window === "undefined") return "";

    const saved = localStorage.getItem("conversationId");
    if (saved) return saved;

    const newId = `conv-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("conversationId", newId);
    return newId;
  });
  // Estado de carga mientras Roma responde
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    // No enviamos si está vacío o cargando
    if (!input.trim() || loading) return;

    // Agregamos el mensaje del usuario a la pantalla
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Llamamos al backend
      const response = await fetch(
        "https://proyecto-roma-production.up.railway.app/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input, conversationId }),
        },
      );

      const data = await response.json();

      // Agregamos la respuesta de Roma a la pantalla
      const romaMessage: Message = {
        role: "assistant",
        content: data.reply,
      };
      setMessages((prev) => [...prev, romaMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carga el historial al abrir la página
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(
          `https://proyecto-roma-production.up.railway.app/conversations/${conversationId}/messages`,
        );
        const data = await response.json();
        setMessages(
          data.messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
        );
      } catch (error) {
        console.error("Error cargando historial:", error);
      }
    };

    loadHistory();
  }, [conversationId]);
  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-2xl text-sm">
              Roma está escribiendo...
            </div>
          </div>
        )}
      </div>

      {/* Input y botón */}
      <div className="flex gap-2 pt-4 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escríbele a Roma..."
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </main>
  );
}
