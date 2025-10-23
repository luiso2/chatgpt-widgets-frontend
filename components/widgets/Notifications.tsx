"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  AlertTriangle,
  MessageSquare,
  Heart,
  UserPlus,
  Settings,
} from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info" | "message" | "like" | "follow" | "system";
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
  avatar?: string;
}

interface NotificationsProps {
  title?: string;
  notifications: Notification[];
  variant?: "list" | "compact" | "cards";
  allowDismiss?: boolean;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  message: MessageSquare,
  like: Heart,
  follow: UserPlus,
  system: Settings,
};

const colorMap = {
  success: {
    bg: "bg-green-50",
    border: "border-green-500",
    icon: "text-green-600",
    badge: "bg-green-500",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-500",
    icon: "text-red-600",
    badge: "bg-red-500",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-500",
    icon: "text-yellow-600",
    badge: "bg-yellow-500",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    icon: "text-blue-600",
    badge: "bg-blue-500",
  },
  message: {
    bg: "bg-purple-50",
    border: "border-purple-500",
    icon: "text-purple-600",
    badge: "bg-purple-500",
  },
  like: {
    bg: "bg-pink-50",
    border: "border-pink-500",
    icon: "text-pink-600",
    badge: "bg-pink-500",
  },
  follow: {
    bg: "bg-cyan-50",
    border: "border-cyan-500",
    icon: "text-cyan-600",
    badge: "bg-cyan-500",
  },
  system: {
    bg: "bg-gray-50",
    border: "border-gray-500",
    icon: "text-gray-600",
    badge: "bg-gray-500",
  },
};

export default function Notifications({
  title = "Notifications",
  notifications: initialNotifications,
  variant = "list",
  allowDismiss = true,
}: NotificationsProps) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const renderList = () => (
    <div className="space-y-3">
      <AnimatePresence>
        {notifications.map((notification, index) => {
          const Icon = iconMap[notification.type];
          const colors = colorMap[notification.type];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                relative flex items-start gap-4 p-4 rounded-xl border-l-4
                ${colors.bg} ${colors.border}
                ${notification.read ? "opacity-60" : ""}
                hover:shadow-lg transition-all
              `}
            >
              {/* Icon */}
              <div className={`mt-1 ${colors.icon}`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {notification.title}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {notification.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>

              {/* Unread Badge */}
              {!notification.read && (
                <div className={`w-2 h-2 rounded-full ${colors.badge} mt-2`} />
              )}

              {/* Dismiss Button */}
              {allowDismiss && (
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  const renderCompact = () => (
    <div className="space-y-2">
      <AnimatePresence>
        {notifications.map((notification, index) => {
          const Icon = iconMap[notification.type];
          const colors = colorMap[notification.type];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`
                flex items-center gap-3 p-3 rounded-lg
                ${notification.read ? "bg-gray-50" : "bg-white border border-gray-200"}
                hover:shadow-md transition-all
              `}
            >
              <div className={`${colors.icon}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{notification.title}</p>
              </div>
              <span className="text-xs text-gray-400">{notification.timestamp}</span>
              {allowDismiss && (
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="p-0.5 hover:bg-gray-200 rounded"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  const renderCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnimatePresence>
        {notifications.map((notification, index) => {
          const Icon = iconMap[notification.type];
          const colors = colorMap[notification.type];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`
                relative p-5 rounded-2xl shadow-lg border-2
                ${colors.bg} ${colors.border}
                ${notification.read ? "opacity-70" : ""}
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white ${colors.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {allowDismiss && (
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="p-1 hover:bg-white/50 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Content */}
              <h4 className="font-bold text-gray-900 mb-2">{notification.title}</h4>
              <p className="text-sm text-gray-700 mb-3">{notification.message}</p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{notification.timestamp}</span>
                {!notification.read && (
                  <span className="px-2 py-0.5 bg-white rounded-full text-xs font-semibold text-gray-700">
                    Nueva
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <button className="text-sm text-blue-600 hover:underline font-medium">
          Marcar todas como leídas
        </button>
      </div>

      {/* Notifications */}
      {variant === "list" && renderList()}
      {variant === "compact" && renderCompact()}
      {variant === "cards" && renderCards()}

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay notificaciones</p>
        </div>
      )}
    </motion.div>
  );
}
