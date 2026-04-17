import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";

interface Message {
  id: string;
visitorId: string;
  text: string;
  sender: "visitor" | "admin";
  createdAt: Timestamp | null;
}

// Generate or retrieve a unique visitor ID
const getVisitorId = (): string => {
  let id = localStorage.getItem("chat_visitor_id");
  if (!id) {
    id = "visitor-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem("chat_visitor_id", id);
  }
  return id;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const visitorId = useRef(getVisitorId());

  useEffect(() => {
    // Listen to messages for this visitor in real-time
    const q = query(
      collection(db, "chats", visitorId.current, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      setMessages(msgs);
      setLoading(false);
    }, () => {
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");

    try {
      // Save message to Firestore
      await addDoc(collection(db, "chats", visitorId.current, "messages"), {
        text,
        sender: "visitor",
        visitorId: visitorId.current,
        createdAt: serverTimestamp(),
      });

      // Update the chat metadata document
      const { setDoc, doc } = await import("firebase/firestore");
      await setDoc(doc(db, "chats", visitorId.current), {
        visitorId: visitorId.current,
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        unread: true,
      }, { merge: true });
    } catch (e) {
      console.error("Failed to send message:", e);
    }
  };

  const formatTime = (ts: Timestamp | null) => {
    if (!ts) return "";
    const d = ts.toDate();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 pt-20 pb-4">
        <div className="text-center py-6">
          <h1 className="text-2xl font-heading font-bold text-foreground">Chat with Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Send a message and I'll respond as soon as possible.</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {loading && (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading messages...</div>
          )}
          {!loading && messages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No messages yet. Send a message to start the conversation!
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === "visitor" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
              }`}>
                {msg.sender === "admin" ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div>
                <div className={msg.sender === "visitor" ? "chat-bubble-user" : "chat-bubble-admin"}>
                  {msg.text}
                </div>
                <p className={`text-xs text-muted-foreground mt-1 ${msg.sender === "visitor" ? "text-right" : ""}`}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 border-t border-border pt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} size="icon" disabled={!input.trim()}>
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;