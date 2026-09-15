'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Notification {
  id: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setNotifications(data as Notification[]);
    }
    setLoading(false);
  }, []);

  // Mark a single notification as read
  const markAsRead = async (id: string) => {
    const supabase = createClient();
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const supabase = createClient();
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', unreadIds);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  // Subscribe to Realtime for live bell updates
  useEffect(() => {
    fetchNotifications();

    const supabase = createClient();

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const formatTime = (ts: string) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString();
  };

  const typeColor: Record<string, string> = {
    attendance_risk: 'bg-red-100 text-red-700',
    leave_status: 'bg-amber-100 text-amber-700',
    broadcast: 'bg-blue-100 text-blue-700',
    general: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition relative"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          id="notification-dropdown"
          className="absolute right-0 top-11 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-800">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs font-semibold text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  All read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <Bell className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                  className={`px-4 py-3 cursor-pointer transition hover:bg-slate-50 ${
                    !n.is_read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                        typeColor[n.type] || typeColor.general
                      }`}
                    >
                      {n.type.replace('_', ' ')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${!n.is_read ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatTime(n.created_at)}</p>
                    </div>
                    {!n.is_read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
