"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search, Menu, X } from "lucide-react";
import { initSocket, getSocket } from "@/lib/socket";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

/**
 * Realtime ChatPage
 * - uses socket.io-client
 * - emits: register, join-chat, send-message, typing, stop-typing, seen-messages
 * - listens: new-message, typing, stop-typing, presence-update, messages-seen
 *
 * NOTE: For demo we compute a chatId from userId and member name:
 * chatId = `chat:${[userId, member.name].sort().join('-')}`
 * Make sure your server uses the same room naming or adapt accordingly.
 */

export default function ChatPage() {
  const userId = process.env.NEXT_PUBLIC_APP_USER_ID || "demo-user-1";
  const userName = process.env.NEXT_PUBLIC_APP_USER_NAME || "You";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [membersState, setMembersState] = useState(members); // keep local mutable copy for presence updates
  const [selectedMember, setSelectedMember] = useState(members[0]);
  const [messagesState, setMessagesState] = useState(messages); // message list for selected chat
  const [typingUsers, setTypingUsers] = useState([]); // list of users typing in current chat

  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // helper: canonical chat id used for rooms (client+server must agree)
  const getChatId = useCallback((uId, member) => {
    // deterministic id so both sides compute same room
    const parts = [String(uId), String(member.name)].map((s) => s.replace(/\s+/g, "-").toLowerCase());
    return `chat:${parts.sort().join("-")}`;
  }, []);

  // scroll when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight + 200;
    }
  }, [messagesState, typingUsers]);

  // initialize socket and listeners
  useEffect(() => {
    const socket = initSocket();
    socketRef.current = socket;

    // on connect -> register presence
    socket.on("connect", () => {
      socket.emit("register", { userId, name: userName });
    });

    // new message arrives
    socket.on("new-message", (msg) => {
      // if message belongs to current chat, append to messages
      const currentChatId = getChatId(userId, selectedMember);
      if (`${msg.chat}` === `${currentChatId}`) {
        setMessagesState((prev) => [...prev, convertServerMsgToClient(msg)]);
        // auto mark seen when message arrives and chat is open
        socket.emit("seen-messages", { chatId: currentChatId, userId });
      } else {
        // message for another chat: update member preview and optionally show a notification
        setMembersState((prev) =>
          prev.map((m) => {
            const id = getChatId(userId, m);
            if (`${msg.chat}` === `${id}`) {
              return { ...m, lastMessage: msg.content, lastAt: msg.createdAt };
            }
            return m;
          })
        );
        // simple notify using browser Notification if permission granted
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification("New message", { body: msg.content });
        }
      }
    });

    // typing events
    socket.on("typing", ({ chatId, userId: who }) => {
      const curChat = getChatId(userId, selectedMember);
      if (chatId === curChat && who !== userId) {
        setTypingUsers((t) => Array.from(new Set([...t, who])));
      }
    });
    socket.on("stop-typing", ({ chatId, userId: who }) => {
      const curChat = getChatId(userId, selectedMember);
      if (chatId === curChat) {
        setTypingUsers((t) => t.filter((u) => u !== who));
      }
    });

    // presence updates (online/offline)
    socket.on("presence-update", ({ userId: uid, online }) => {
      setMembersState((prev) => prev.map(m => {
        if (m.name.replace(/\s+/g, "-").toLowerCase() === String(uid).replace(/\s+/g, "-").toLowerCase()) {
          return { ...m, status: online ? "online" : "offline" };
        }
        return m;
      }));
    });

    // messages seen by others
    socket.on("messages-seen", ({ chatId, userId: who }) => {
      // add seen info to messages for the current chat if needed
      // For demo we just console log; you can add seen flag per message if server returns message ids
      console.log("messages seen", chatId, who);
    });

    // request notification permission once
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    return () => {
      socket.off("connect");
      socket.off("new-message");
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("presence-update");
      socket.off("messages-seen");
      // do not disconnect socket here if other pages/components may need it
      // socket.disconnect();
    };
  }, [getChatId, selectedMember, userId, userName]);

  // When selecting a member -> join that room and load messages (server must support)
  useEffect(() => {
    if (!selectedMember || !socketRef.current) return;

    const chatId = getChatId(userId, selectedMember);
    const socket = socketRef.current;

    // join room
    socket.emit("join-chat", { chatId });

    // clear typing list
    setTypingUsers([]);

    // mark messages seen when opening
    socket.emit("seen-messages", { chatId, userId });

    // optionally fetch message history via REST if you have an endpoint.
    // For demo we keep existing local messages state. If you have an API:
    // axios.get(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chats/${chatId}/messages`).then(...)

    // update selectedMember status from server presence map is handled by presence-update listener

  }, [selectedMember, getChatId, userId]);

  // helper: convert server message object to client format (demo-friendly)
  function convertServerMsgToClient(msg) {
    // server may return { _id, chat, sender, content, createdAt, seenBy }
    return {
      from: (String(msg.sender) === String(userId) ? "me" : "other"),
      text: msg.content || msg.text || "",
      time: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"}) : new Date().toLocaleTimeString(),
      raw: msg,
    };
  }

  // send a message
  function handleSendMessage(text) {
    if (!text || !selectedMember || !socketRef.current) return;
    const socket = socketRef.current;
    const chatId = getChatId(userId, selectedMember);

    // optimistic UI: add to messages immediately
    const optimistic = {
      from: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"}),
      tempId: `temp-${Date.now()}`,
    };
    setMessagesState((prev) => [...prev, optimistic]);
    // emit to server
    socket.emit("send-message", { chatId, senderId: userId, content: text, tempId: optimistic.tempId });
    // after sending, also emit stop-typing
    socket.emit("stop-typing", { chatId, userId });
    isTypingRef.current = false;
  }

  // typing handlers (debounced stop)
  function handleTyping(isTyping) {
    if (!socketRef.current || !selectedMember) return;
    const socket = socketRef.current;
    const chatId = getChatId(userId, selectedMember);

    if (isTyping) {
      if (!isTypingRef.current) {
        socket.emit("typing", { chatId, userId });
        isTypingRef.current = true;
      }
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", { chatId, userId });
        isTypingRef.current = false;
      }, 900);
    } else {
      socket.emit("stop-typing", { chatId, userId });
      isTypingRef.current = false;
      clearTimeout(typingTimeoutRef.current);
    }
  }

  // UI handlers
  function onMemberClick(m) {
    setSelectedMember(m);
    setSidebarOpen(false);
    // optionally fetch messages for that chat here
  }

  // render
  return (

     <div className="min-h-screen bg-[var(--background)] flex  text-[var(--foreground)] ">
          <Sidebar />
          <div className="flex-1 bg-[var(--background)]">
            <Topbar />
    <div className="flex h-screen overflow-hidden scrollbar-hide  bg-[var(--background)] ">

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-14 bg-[var(--background)] border-b border-white/10 z-30 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <h2 className="font-semibold bg-[var(--background)]">Team Collaboration</h2>
        <div></div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Members Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-72 bg-[var(--background)] border-r border-white/10 p-4 flex flex-col transform transition-transform duration-300 z-30
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-3 mt-8 lg:mt-0">
          Team Collaboration
        </h2>

        {/* Search Box */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-3 text-white/60" />
          <input
            placeholder="Search members..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Member List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
          {membersState.map((m, id) => (
            <button
              key={id}
              onClick={() => { onMemberClick(m); }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition
                ${selectedMember.name === m.name ? "bg-white/10" : "hover:bg-white/5"}
              `}
            >
              <Image
                src={m.avatar}
                width={44}
                height={44}
                className="rounded-full"
                alt={m.name}
              />

              <div className="flex flex-col text-left">
                <span className="font-medium">{m.name}</span>
                <span className="text-xs text-white/60">{m.role}</span>
              </div>

              <span
                className={`ml-auto px-2 py-1 rounded-md text-xs capitalize
                  ${m.status === "online" ? "bg-green-500/20 text-green-400" : m.status === "offline" ? "bg-gray-500/20 text-gray-400" : "bg-yellow-500/20 text-yellow-300"}
                `}
              >
                {m.status}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col h-screen pt-14 lg:pt-0">

        {/* Chat Header */}
        <div className="h-16 border-b border-white/10 bg-[var(--background)] px-6 flex items-center gap-3">
          <Image
            src={selectedMember.avatar}
            width={40}
            height={40}
            className="rounded-full"
            alt={selectedMember.name}
          />
          <div>
            <div className="font-semibold">{selectedMember.name}</div>
            <div className="flex items-center gap-1 text-xs text-white/60">
              <span
                className={`w-2 h-2 rounded-full 
                ${selectedMember.status === "online" ? "bg-green-500" : selectedMember.status === "offline" ? "bg-gray-500" : "bg-yellow-400"}
              `}
              />
              {selectedMember.status}
            </div>
          </div>
        </div>

        {/* Message List */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide bg-[var(--background)]"
        >
          {messagesState.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-3 ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              {msg.from !== "me" && (
                <Image src={selectedMember.avatar} width={32} height={32} className="rounded-full" alt="avatar" />
              )}

              <div>
                <div className={`max-w-sm px-4 py-3 rounded-xl text-sm ${msg.from === "me" ? "bg-violet-600 text-white" : "bg-[#1B1F36] text-white/90"}`}>
                  {msg.text}
                </div>
                <div className="text-xs text-white/40 mt-1">{msg.time}</div>
              </div>

              {msg.from === "me" && (
                <Image src="/avatar.jpg" width={32} height={32} className="rounded-full" alt="me" />
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--background)]animate-pulse" />
              <div className="bg-[var(--background)] px-4 py-2 rounded-xl text-sm text-white/80">Typing…</div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-white/10 bg-[var(--background)] flex items-center gap-3">
          <input
            ref={inputRef}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none"
            onChange={(e) => handleTyping(e.target.value.length > 0)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const val = e.target.value.trim();
                if (val) {
                  handleSendMessage(val);
                  e.target.value = "";
                }
              }
            }}
          />
          <button
            className="px-5 py-3 bg-blue-600 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            onClick={() => {
              const val = inputRef.current?.value?.trim();
              if (val) {
                handleSendMessage(val);
                inputRef.current.value = "";
              }
            }}
          >
            Send
          </button>
        </div>
      </main>
    </div>

    </div>
    </div>
  );
}

/* ===== Dummy Data ===== */

const members = [
  {
    name: "Mostafa Mahmoud",
    role: "Admin",
    avatar: "/avatar.jpg",
    status: "online",
  },
  {
    name: "Jamie Chen",
    role: "Member",
    avatar: "/avatar2.jpg",
    status: "online",
  },
  {
    name: "Taylor Swift",
    role: "Member",
    avatar: "/avatar3.jpg",
    status: "offline",
  },
  {
    name: "Morgan Freeman",
    role: "Viewer",
    avatar: "/avatar4.jpg",
    status: "away",
  },
  {
    name: "Riley Johnson",
    role: "Member",
    avatar: "/avatar5.jpg",
    status: "online",
  },
];

const messages = [
  { from: "other", text: "Hi there! How's the project coming along?", time: "10:15 AM" },
  { from: "me", text: "It's going well! I've completed the first milestone.", time: "10:17 AM" },
  { from: "other", text: "That's great news! Any blockers I should know about?", time: "10:20 AM" },
  { from: "me", text: "Nothing major, but I might need help with the database integration.", time: "10:22 AM" },
  { from: "other", text: "No problem, I can help with that. Let's schedule a call tomorrow.", time: "10:25 AM" },
];
