import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { MessageThread, AppMessage } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { MessageSquare, Send, CheckCircle2, ChevronLeft } from "lucide-react";

type ThreadWithProfile = MessageThread & { profiles?: { full_name: string | null; email: string } };

const AdminMessages = () => {
  const { profile } = useAuth();
  const [threads, setThreads] = useState<ThreadWithProfile[]>([]);
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [active, setActive] = useState<ThreadWithProfile | null>(null);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadThreads = useCallback(async () => {
    const { data } = await supabase
      .from("message_threads")
      .select("*, profiles!student_id(full_name, email)")
      .in("status", ["open"])
      .order("last_message_at", { ascending: false, nullsFirst: false });
    if (data) setThreads(data as ThreadWithProfile[]);
    setLoading(false);
  }, []);

  const loadMessages = useCallback(async (threadId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*, profiles(full_name, role)")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as AppMessage[]);
  }, []);

  useEffect(() => { loadThreads(); }, [loadThreads]);

  useEffect(() => {
    if (!active) return;
    loadMessages(active.id);
    const sub = supabase
      .channel(`admin-thread-${active.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `thread_id=eq.${active.id}` },
        (payload) => setMessages((prev) => [...prev, payload.new as AppMessage]))
      .subscribe();
    return () => { sub.unsubscribe(); };
  }, [active, loadMessages]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!body.trim() || !profile || !active) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      thread_id: active.id,
      sender_id: profile.id,
      body: body.trim(),
      attachments: [],
      read_by: [profile.id],
    });
    if (!error) {
      await supabase.from("message_threads").update({ last_message_at: new Date().toISOString() }).eq("id", active.id);
      // Notify student
      await supabase.from("notifications").insert({
        user_id: active.student_id,
        type: "message",
        title: "New message from DGEC",
        body: `Reply in: ${active.subject}`,
        action_url: "/portal/messages",
      });
      setBody("");
    } else {
      toast.error("Failed to send.");
    }
    setSending(false);
  };

  const closeThread = async (thread: ThreadWithProfile) => {
    await supabase.from("message_threads").update({ status: "resolved" }).eq("id", thread.id);
    setThreads((prev) => prev.filter((t) => t.id !== thread.id));
    if (active?.id === thread.id) setActive(null);
    toast.success("Thread marked as resolved.");
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return new Date(iso).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage student conversations.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-4 h-[600px]">
        {/* Thread List */}
        <div className={`md:col-span-2 flex flex-col ${active ? "hidden md:flex" : "flex"}`}>
          <div className="flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-sm text-center text-muted-foreground py-4">Loading…</div>
            ) : threads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No open conversations.</p>
              </div>
            ) : (
              threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActive(t)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${active?.id === t.id ? "bg-primary/10 border-primary/30" : "bg-background hover:bg-muted border-border"}`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-medium text-sm truncate max-w-[130px]">{t.subject}</span>
                    <Badge variant="outline" className="text-[10px]">open</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.profiles?.full_name ?? "Unknown"}</p>
                  {t.last_message_at && <p className="text-[10px] text-muted-foreground">{timeAgo(t.last_message_at)}</p>}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Pane */}
        <div className={`md:col-span-3 flex flex-col ${active ? "flex" : "hidden md:flex"}`}>
          {!active ? (
            <Card className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select a thread.</p>
              </div>
            </Card>
          ) : (
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="py-3 px-4 border-b flex-row items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden w-7 h-7" onClick={() => setActive(null)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm">{active.subject}</CardTitle>
                  <p className="text-xs text-muted-foreground">{active.profiles?.full_name ?? "—"} · {active.profiles?.email}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => closeThread(active)}>
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Resolve
                </Button>
              </CardHeader>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => {
                    const isStaff = (msg.profiles as any)?.role !== "student";
                    const senderName = isStaff ? "DGEC Staff" : (active.profiles?.full_name ?? "Student");
                    return (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2 ${isStaff ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {!isStaff && (
                          <Avatar className="w-7 h-7 shrink-0">
                            <AvatarFallback className="text-xs">{senderName[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[75%] flex flex-col gap-0.5 ${isStaff ? "items-end" : "items-start"}`}>
                          {!isStaff && <span className="text-xs text-muted-foreground">{senderName}</span>}
                          <div className={`px-3 py-2 rounded-2xl text-sm ${isStaff ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}>
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
                  placeholder="Reply…"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  rows={1}
                  className="resize-none text-sm"
                />
                <Button size="icon" onClick={sendMessage} disabled={sending || !body.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
