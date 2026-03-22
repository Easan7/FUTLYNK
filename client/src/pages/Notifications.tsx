/**
 * Notifications Page
 * Shows game confirmations, friend requests, chat messages, and reminders
 */

import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { ArrowLeft, Check, X, MessageCircle, Users, Trophy, Clock, Bell } from "lucide-react";
import { toast } from "sonner";
import wallpaperImage from "@/assets/images/wallpaper.jpg";

type Notification = {
  id: string;
  type: "game_confirmed" | "friend_request" | "chat_message" | "game_reminder" | "rating_reminder";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable?: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "game_confirmed",
    title: "Game Confirmed!",
    message: "Downtown Sports Arena game on Feb 15 at 7:00 PM has reached threshold (7/10 players)",
    time: "5 min ago",
    read: false,
    actionable: false,
  },
  {
    id: "2",
    type: "friend_request",
    title: "Friend Request",
    message: "Alex Chen sent you a friend request",
    time: "1 hour ago",
    read: false,
    actionable: true,
  },
  {
    id: "3",
    type: "chat_message",
    title: "New Message",
    message: "Jordan Smith: \"See you at the game tonight!\"",
    time: "2 hours ago",
    read: false,
    actionable: false,
  },
  {
    id: "4",
    type: "game_reminder",
    title: "Game Starting Soon",
    message: "Your game at Metro Futsal Complex starts in 1 hour",
    time: "3 hours ago",
    read: true,
    actionable: false,
  },
  {
    id: "5",
    type: "rating_reminder",
    title: "Rate Your Teammates",
    message: "Don't forget to rate players from your game at Westgate Indoor Sports",
    time: "1 day ago",
    read: true,
    actionable: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "game_confirmed":
        return <Trophy className="w-5 h-5 text-[#39ff14]" />;
      case "friend_request":
        return <Users className="w-5 h-5 text-[#00d9ff]" />;
      case "chat_message":
        return <MessageCircle className="w-5 h-5 text-[#00d9ff]" />;
      case "game_reminder":
        return <Clock className="w-5 h-5 text-[#39ff14]" />;
      case "rating_reminder":
        return <Bell className="w-5 h-5 text-[#39ff14]" />;
    }
  };

  const handleAccept = (id: string) => {
    toast.success("Friend request accepted!");
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleDecline = (id: string) => {
    toast.info("Friend request declined");
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Hero */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
        <img
          src={wallpaperImage}
          alt="Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/profile">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Notifications
            </h1>
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-[#39ff14]">
              {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.read && markAsRead(notification.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                notification.read
                  ? "bg-[#1a1a1a] border-[#2a2a2a]"
                  : "bg-[#1a1a1a] border-[#39ff14]/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-white font-bold text-sm">{notification.title}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{notification.message}</p>

                  {notification.actionable && notification.type === "friend_request" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(notification.id);
                        }}
                        className="flex-1 px-4 py-2 bg-[#39ff14] text-black rounded-lg font-bold text-sm hover:bg-[#2de00f] transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecline(notification.id);
                        }}
                        className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 rounded-lg font-bold text-sm hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Decline
                      </button>
                    </div>
                  )}

                  {notification.actionable && notification.type === "rating_reminder" && (
                    <Link href="/feedback/c2">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="w-full mt-3 px-4 py-2 bg-[#39ff14] text-black rounded-lg font-bold text-sm hover:bg-[#2de00f] transition-colors"
                      >
                        Rate Players
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Navigation />
    </div>
  );
}
