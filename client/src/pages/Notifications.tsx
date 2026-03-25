import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CalendarClock, Check, MessageCircle, ShieldCheck, Users, X } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import PitchOverlay from "@/components/PitchOverlay";
import StatBlock from "@/components/StatBlock";

type Notification = {
  id: string;
  type: "group" | "match" | "message" | "integrity";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable?: "friend-request" | "rate";
};

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "match",
    title: "Game spot available",
    message: "Balanced Midweek 5v5 matches your level.",
    time: "6m ago",
    read: false,
  },
  {
    id: "n2",
    type: "group",
    title: "Group overlap found",
    message: "Friday Core has 4 members available Fri 8:30 PM.",
    time: "42m ago",
    read: false,
  },
  {
    id: "n3",
    type: "message",
    title: "New group message",
    message: "Sarah: Can we lock the Wed slot tonight?",
    time: "1h ago",
    read: true,
  },
  {
    id: "n4",
    type: "integrity",
    title: "Pending feedback",
    message: "Rate players from your last game.",
    time: "1d ago",
    read: true,
    actionable: "rate",
  },
  {
    id: "n5",
    type: "group",
    title: "Friend request",
    message: "Jamie Wilson wants to connect.",
    time: "2d ago",
    read: false,
    actionable: "friend-request",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const removeNotification = (id: string, message: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success(message);
  };

  const iconFor = (type: Notification["type"]) => {
    if (type === "group") return <Users className="h-4 w-4 text-[#9dff3f]" />;
    if (type === "message") return <MessageCircle className="h-4 w-4 text-[#c3cdc5]" />;
    if (type === "integrity") return <ShieldCheck className="h-4 w-4 text-[#9dff3f]" />;
    return <CalendarClock className="h-4 w-4 text-[#9dff3f]" />;
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <PitchOverlay variant="header" />
        <div className="flex items-center gap-3">
          <Link href="/profile" className="btn-secondary relative z-10 !min-h-10 !px-3" aria-label="Back to profile">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="relative z-10">
            <h1 className="text-2xl font-semibold text-[#f2f7f2]">Notifications</h1>
            <p className="text-xs text-[#95a39a]">{unreadCount} unread</p>
          </div>
        </div>
        <div className="relative z-10 mt-3 max-w-[200px]">
          <StatBlock variant="compact" label="Inbox" value={notifications.length} subValue={`${unreadCount} unread`} />
        </div>
      </header>

      <main className="space-y-2 p-4">
        {notifications.map((notification) => (
          <article
            key={notification.id}
            onClick={() => markRead(notification.id)}
            className={`surface-card ${notification.read ? "" : "border-[#4d5f4e]"}`}
          >
            <div className="flex items-start gap-3">
              <div className="surface-inner !p-2">{iconFor(notification.type)}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-[#edf3ee]">{notification.title}</p>
                  <span className="text-xs text-[#92a096]">{notification.time}</span>
                </div>
                <p className="mt-1 text-xs text-[#9aa79e]">{notification.message}</p>

                {notification.actionable === "friend-request" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id, "Friend request accepted");
                      }}
                      className="btn-primary flex-1 !py-2 text-xs"
                    >
                      <Check className="mr-1 h-3.5 w-3.5" /> Accept
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id, "Friend request declined");
                      }}
                      className="btn-secondary flex-1 !py-2 text-xs"
                    >
                      <X className="mr-1 h-3.5 w-3.5" /> Decline
                    </button>
                  </div>
                )}

                {notification.actionable === "rate" && (
                  <Link href="/feedback/c1" onClick={(e) => e.stopPropagation()} className="btn-primary mt-3 !min-h-9 !py-2 text-xs">
                    Open Feedback
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </main>

      <Navigation />
    </div>
  );
}
