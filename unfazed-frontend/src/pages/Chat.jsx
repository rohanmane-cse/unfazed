import { useEffect, useState } from "react";
import { Send, MessageCircle, Wifi, WifiOff } from "lucide-react";
import socket from "../services/socket";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      return;
    }

    socket.auth = { token };
    socket.connect();

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleReceiveMessage = (data) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + Math.random(),
          text: data.message,
          sender: data.sender || "Client",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("receive_message", handleReceiveMessage);
      socket.disconnect();
    };
  }, [token]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const newMessage = {
      id: Date.now(),
      text: trimmedMessage,
      sender: "You",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((previousMessages) => [...previousMessages, newMessage]);

    if (socket.connected) {
      socket.emit("send_message", { message: trimmedMessage });
    }

    setMessage("");
  };

  return (
    <main className="min-h-screen bg-[#f5f4f1] p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="panel p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <MessageCircle size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-[-0.05em] text-slate-900">Chat</h1>
                <p className="mt-1 text-sm text-slate-500">Communicate with your clients in real time.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
              {connected ? <Wifi size={16} className="text-emerald-600" /> : <WifiOff size={16} className="text-red-500" />}
              {connected ? "Connected" : "Disconnected"}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
          <div className="flex min-h-[520px] flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 sm:p-6">
              {messages.length === 0 ? (
                <div className="flex h-[420px] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
                      <MessageCircle size={28} />
                    </div>
                    <h2 className="mt-5 text-lg font-bold text-slate-900">No messages yet</h2>
                    <p className="mt-2 text-sm text-slate-500">Start a conversation with your client.</p>
                  </div>
                </div>
              ) : (
                messages.map((item) => (
                  <div key={item.id} className={`flex ${item.sender === "You" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${item.sender === "You" ? "bg-slate-900 text-white" : "bg-white text-slate-900 ring-1 ring-slate-200"}`}>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-current/75">{item.sender}</p>
                      <p className="mt-2 text-sm leading-6">{item.text}</p>
                      <p className={`mt-2 text-[11px] ${item.sender === "You" ? "text-slate-300" : "text-slate-500"}`}>{item.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="border-t border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="input-field flex-1"
                />
                <button type="submit" disabled={!message.trim()} className="primary-btn disabled:cursor-not-allowed disabled:opacity-40">
                  <Send size={18} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Chat;