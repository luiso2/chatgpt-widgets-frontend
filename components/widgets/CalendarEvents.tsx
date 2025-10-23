"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users as UsersIcon } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  attendees?: number;
  color?: string;
  description?: string;
}

interface CalendarEventsProps {
  title?: string;
  events: CalendarEvent[];
  variant?: "list" | "grid" | "timeline";
}

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-500" },
  green: { bg: "bg-green-100", text: "text-green-700", border: "border-green-500" },
  purple: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-500" },
  orange: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-500" },
  red: { bg: "bg-red-100", text: "text-red-700", border: "border-red-500" },
  pink: { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-500" },
};

export default function CalendarEvents({
  title = "Upcoming Events",
  events,
  variant = "list",
}: CalendarEventsProps) {
  const getColors = (color?: string) => {
    return colorClasses[color || "blue"] || colorClasses.blue;
  };

  const renderList = () => (
    <div className="space-y-4">
      {events.map((event, index) => {
        const colors = getColors(event.color);
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className={`
              bg-white rounded-xl p-5 shadow-md border-l-4 ${colors.border}
              hover:shadow-xl transition-all cursor-pointer
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.attendees && (
                    <div className="flex items-center gap-1">
                      <UsersIcon className="w-4 h-4" />
                      <span>{event.attendees} asistentes</span>
                    </div>
                  )}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-sm font-semibold`}>
                {event.time}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => {
        const colors = getColors(event.color);
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`
              bg-gradient-to-br from-white to-gray-50
              rounded-2xl p-6 shadow-lg border-t-4 ${colors.border}
              hover:shadow-2xl transition-all cursor-pointer
            `}
          >
            <div className={`inline-block px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-xs font-bold mb-3`}>
              {event.date}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {event.description}
              </p>
            )}
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.attendees && (
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4" />
                  <span>{event.attendees} asistentes</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderTimeline = () => (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

      <div className="space-y-8">
        {events.map((event, index) => {
          const colors = getColors(event.color);
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative pl-20"
            >
              {/* Timeline Dot */}
              <div className={`absolute left-5 w-6 h-6 rounded-full ${colors.bg} ${colors.border} border-4 bg-white shadow-lg`} />

              {/* Event Card */}
              <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-xs font-bold`}>
                    {event.date}
                  </div>
                  <span className="text-sm text-gray-500">{event.time}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.attendees && (
                    <div className="flex items-center gap-1">
                      <UsersIcon className="w-3 h-3" />
                      <span>{event.attendees} personas</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-8 border border-gray-200"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-gray-600 mt-2">{events.length} eventos programados</p>
      </div>

      {variant === "list" && renderList()}
      {variant === "grid" && renderGrid()}
      {variant === "timeline" && renderTimeline()}
    </motion.div>
  );
}
