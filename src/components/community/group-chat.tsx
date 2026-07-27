"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null };
}

export function GroupChat({ groupId, currentUserId }: { groupId: string; currentUserId: string }) {
  const [draft, setDraft] = useState("");
  const [optimistic, setOptimistic] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, refetch } = useQuery<{ messages: ChatMessage[] }>({
    queryKey: ["group-chat", groupId],
    queryFn: async () => {
      const res = await fetch(`/api/groups/${groupId}/messages`);
      if (!res.ok) throw new Error("load failed");
      return res.json();
    },
    refetchInterval: 5000,
  });

  const messages = [...(data?.messages ?? []), ...optimistic.filter((o) => !(data?.messages ?? []).some((m) => m.id === o.id))];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;
    setDraft("");
    const temp: ChatMessage = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      user: { id: currentUserId, name: "You", avatarUrl: null },
    };
    setOptimistic((o) => [...o, temp]);
    await fetch(`/api/groups/${groupId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setOptimistic((o) => o.filter((m) => m.id !== temp.id));
    refetch();
  }

  return (
    <div className="flex h-[420px] flex-col overflow-hidden rounded-2xl border bg-card shadow-card">
      <div className="border-b bg-secondary/40 px-4 py-2.5 text-sm font-bold">💬 Group chat</div>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="pt-10 text-center text-sm text-muted-foreground">
            No messages yet — say Hallo! 👋
          </p>
        )}
        {messages.map((m) => {
          const mine = m.user.id === currentUserId;
          return (
            <div key={m.id} className={cn("flex gap-2.5", mine && "flex-row-reverse")}>
              <Avatar className="h-7 w-7">
                {m.user.avatarUrl ? <AvatarImage src={m.user.avatarUrl} alt={m.user.name} /> : null}
                <AvatarFallback className="text-[10px]">
                  {m.user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={cn("max-w-[75%] rounded-2xl px-3.5 py-2", mine ? "rounded-tr-md bg-primary text-primary-foreground" : "rounded-tl-md bg-secondary")}>
                {!mine && <div className="text-[10px] font-semibold text-muted-foreground">{m.user.name}</div>}
                <div className="whitespace-pre-line break-words text-sm">{m.content}</div>
                <div className={cn("mt-0.5 text-[9px]", mine ? "text-primary-foreground/60" : "text-muted-foreground/70")}>
                  {new Date(m.createdAt).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={send} className="flex gap-2 border-t p-3">
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Schreib eine Nachricht…" className="h-10" maxLength={1000} />
        <Button type="submit" size="icon" disabled={!draft.trim()} aria-label="Send">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
