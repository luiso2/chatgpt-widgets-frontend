"use client";

import { motion } from "framer-motion";
import {
  User,
  UserPlus,
  Heart,
  MessageSquare,
  Share2,
  Star,
  Award,
  GitCommit,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

interface Activity {
  id: string;
  type: "user" | "like" | "comment" | "share" | "star" | "award" | "commit" | "post" | "image";
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  timestamp: string;
  details?: string;
}

interface ActivityFeedProps {
  title?: string;
  activities: Activity[];
  variant?: "timeline" | "compact" | "detailed";
  showAvatars?: boolean;
}

const iconMap = {
  user: UserPlus,
  like: Heart,
  comment: MessageSquare,
  share: Share2,
  star: Star,
  award: Award,
  commit: GitCommit,
  post: FileText,
  image: ImageIcon,
};

const colorMap = {
  user: "text-blue-600 bg-blue-100",
  like: "text-red-600 bg-red-100",
  comment: "text-green-600 bg-green-100",
  share: "text-purple-600 bg-purple-100",
  star: "text-yellow-600 bg-yellow-100",
  award: "text-orange-600 bg-orange-100",
  commit: "text-gray-600 bg-gray-100",
  post: "text-indigo-600 bg-indigo-100",
  image: "text-pink-600 bg-pink-100",
};

export default function ActivityFeed({
  title = "Activity Feed",
  activities,
  variant = "timeline",
  showAvatars = true,
}: ActivityFeedProps) {
  const renderTimeline = () => (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

      <div className="space-y-6">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          const colorClass = colorMap[activity.type];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-20"
            >
              {/* Timeline Icon */}
              <div
                className={`absolute left-4 w-8 h-8 rounded-full ${colorClass} flex items-center justify-center shadow-lg border-4 border-white`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Activity Card */}
              <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all border border-gray-100">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  {showAvatars && (
                    <div className="flex-shrink-0">
                      {activity.user.avatar ? (
                        <img
                          src={activity.user.avatar}
                          alt={activity.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {activity.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-gray-900">
                          {activity.user.name}
                        </span>
                        <span className="text-gray-600 ml-1">{activity.action}</span>
                        {activity.target && (
                          <span className="text-blue-600 font-medium ml-1">
                            {activity.target}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {activity.timestamp}
                      </span>
                    </div>
                    {activity.details && (
                      <p className="text-sm text-gray-600 mt-2">{activity.details}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderCompact = () => (
    <div className="space-y-2">
      {activities.map((activity, index) => {
        const Icon = iconMap[activity.type];
        const colorClass = colorMap[activity.type];

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${colorClass}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{activity.user.name}</span>{" "}
                <span className="text-gray-600">{activity.action}</span>
                {activity.target && (
                  <span className="text-blue-600 font-medium"> {activity.target}</span>
                )}
              </p>
            </div>
            <span className="text-xs text-gray-400">{activity.timestamp}</span>
          </motion.div>
        );
      })}
    </div>
  );

  const renderDetailed = () => (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = iconMap[activity.type];
        const colorClass = colorMap[activity.type];

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Icon & Avatar */}
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-xl ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {showAvatars && (
                  activity.user.avatar ? (
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="w-10 h-10 rounded-full border-2 border-white shadow"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow">
                      {activity.user.name.charAt(0).toUpperCase()}
                    </div>
                  )
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{activity.user.name}</h4>
                    <p className="text-gray-600 text-sm">
                      {activity.action}
                      {activity.target && (
                        <span className="text-blue-600 font-medium ml-1">
                          {activity.target}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.timestamp}</span>
                </div>
                {activity.details && (
                  <div className="bg-white rounded-lg p-3 border border-gray-100 mt-3">
                    <p className="text-sm text-gray-700">{activity.details}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {title}
        </h2>
        <p className="text-gray-600">{activities.length} actividades recientes</p>
      </div>

      {/* Feed */}
      {variant === "timeline" && renderTimeline()}
      {variant === "compact" && renderCompact()}
      {variant === "detailed" && renderDetailed()}

      {/* Empty State */}
      {activities.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay actividades recientes</p>
        </div>
      )}
    </motion.div>
  );
}
