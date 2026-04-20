import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { MessageThread, AppMessage } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MessageSquare, Send, Plus, ChevronLeft } from "lucide-react";

const PortalMessages = () => {
  const { profile } = useAuth();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [activeThread, setActiveThread] = useState<MessageThread | null>(null);
  const [body, setBody] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadThreads = useCallback(async () => {
    if (!profile) return;
    const { data } = await supabase
      .from("message_threads")
      .select("*")
      .eq("student_id", profile.id)
      .order("last_message_at", { ascending: false, nullsFirst: false });
    if (data) setThreads(data as MessageThread[]);
    setLoading(false);
  }, [profile]);

  const loadMessages = useCallback(async (threadId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*, profiles(full_name, avatar_url, role)")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as AppMessage[]);
  }, []);

  useEffect(() => { loadThreads(); }, [loadThreads]);

  useEffect(() => {
    if (!activeThread) return;
    loadMessages(activeThread.id);

    const sub = supabase
      .channel(`thread-${activeThread.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `thread_id=eq.${activeThread.id}` },
        (payload) => setMessages((prev) => [...prev, payload.new as AppMessage]))
      .subscribe();

    return () => { sub.unsubscribe(); };
  }, [activeThread, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!body.trim() || !profile || !activeThread) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      thread_id: activeThread.id,
      sender_id: profile.id,
      body: body.trim(),
      attachments: [],
      read_by: [profile.id],
    });
    if (error) { toast.error("Failed to send message."); setSending(false); return; }
    await supabase.from("message_threads").update({ last_message_at: new Date().toISOString() }).eq("id", activeThread.id);
    setBody("");
    setSending(false);
  };

  const handleNewThread = async () => {
    if (!newSubject.trim() || !profile) return;
    const { data, error } = await supabase
      .from("message_threads")
      .insert({ student_id: profile.id, subject: newSubject.trim(), status: "open" })
      .select()
      .single();
    if (error) { toast.error("Failed to create conversation."); return; }
    const thread = data as MessageThread;
    setThreads((prev) => [thread, ...prev]);
    setActiveThread(thread);
    setMessages([]);
    setNewSubject("");
    setShowNew(false);
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(iso).toLocaleDateString();
  };

  return (
    <div className="section-padding">
      <div className="container-custom max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">Chat directly with the DGEC team.</p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-4 h-[600px]">
          {/* Thread List */}
          <div className={`md:col-span-2 flex flex-col ${activeThread ? "hidden md:flex" : "flex"}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Conversations</span>
              <Button size="sm" variant="outline" onClick={() => setShowNew(true)}>
                <Plus className="w-3 h-3 mr-1" /> New
              </Button>
            </div>

            {showNew && (
              <div className="mb-3 flex gap-2">
                <Input
                  placeholder="Subject (e.g. Visa inquiry)"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNewThread()}
                  className="text-sm"
                />
                <Button size="sm" onClick={handleNewThread}>Go</Button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-sm text-muted-foreground text-center py-4">Loading…</div>
              ) : threads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No conversations yet.</p>
                </div>
              ) : (
                threads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveThread(t)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      activeThread?.id === t.id ? "bg-primary/10 border-primary/30" : "bg-background hover:bg-muted border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate max-w-[140px]">{t.subject}</span>
                      <Badge variant={t.status === "open" ? "default" : "secondary"} className="text-xs">{t.status}</Badge>
                    </div>
                    {t.last_message_at && (
                      <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(t.last_message_at)}</p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message Pane */}
          <div className={`md:col-span-3 flex flex-col ${activeThread ? "flex" : "hidden md:flex"}`}>
            {!activeThread ? (
              <Card className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Select a conversation to start chatting.</p>
                </div>
              </Card>
            ) : (
              <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader className="py-3 px-4 border-b flex-row items-center gap-3">
                  <Button variant="ghost" size="icon" className="md:hidden w-7 h-7" onClick={() => setActiveThread(null)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div>
                    <CardTitle className="text-base">{activeThread.subject}</CardTitle>
                    <p className="text-xs text-muted-foreground">DGEC Support</p>
                  </div>
                </CardHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => {
                      const isOwn = msg.sender_id === profile?.id;
                      const senderName = (msg.profiles as any)?.full_name ?? "Staff";
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                        >
                          {!isOwn && (
                            <Avatar className="w-7 h-7 shrink-0">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {senderName[0]}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                            {!isOwn && <span className="text-xs text-muted-foreground">{senderName}</span>}
                            <div className={`px-3 py-2 rounded-2xl text-sm ${isOwn ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}>
                              {msg.body}
                            </div>
                            <span className="text-[10px] text-muted-foreground">{timeAgo(msg.created_at)}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={bottomRef} />
                </div>

                <div className="p-3 border-t flex gap-2">
                  <Textarea
                    placeholder="Type a message…"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    rows={1}
                    className="resize-none text-sm"
                  />
                  <Button size="icon" onClick={handleSend} disabled={sending || !body.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalMessages;
