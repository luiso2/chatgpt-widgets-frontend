"use client";

import { motion } from "framer-motion";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  color: string;
}

interface TimelineProps {
  title: string;
  events: TimelineEvent[];
}

const colorMap: Record<string, { bg: string; border: string; dot: string }> = {
  blue: { bg: "bg-blue-100", border: "border-blue-400", dot: "bg-blue-600" },
  green: { bg: "bg-green-100", border: "border-green-400", dot: "bg-green-600" },
  red: { bg: "bg-red-100", border: "border-red-400", dot: "bg-red-600" },
  purple: { bg: "bg-purple-100", border: "border-purple-400", dot: "bg-purple-600" },
  orange: { bg: "bg-orange-100", border: "border-orange-400", dot: "bg-orange-600" },
};

export default function Timeline({ title, events }: TimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        🕐 {title}
      </h2>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

        {events.map((event, index) => {
          const colors = colorMap[event.color] || colorMap.blue;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative pl-20 pb-10 last:pb-0"
            >
              {/* Dot */}
              <div
                className={`absolute left-6 top-2 w-5 h-5 rounded-full ${colors.dot} border-4 border-white shadow-lg z-10`}
              ></div>

              {/* Content Card */}
              <div
                className={`${colors.bg} ${colors.border} border-l-4 rounded-lg p-6 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                    {event.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
