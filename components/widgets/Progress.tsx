"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface ProgressItem {
  label: string;
  value: number; // 0-100
  color?: string;
  status?: "completed" | "in-progress" | "pending";
  subtitle?: string;
}

interface ProgressProps {
  title?: string;
  items: ProgressItem[];
  variant?: "bars" | "circles" | "skills" | "steps";
  showPercentage?: boolean;
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  pink: "bg-pink-500",
  cyan: "bg-cyan-500",
  indigo: "bg-indigo-500",
};

export default function Progress({
  title = "Progress Overview",
  items,
  variant = "bars",
  showPercentage = true,
}: ProgressProps) {
  const getColor = (color?: string) => {
    return colorMap[color || "blue"] || colorMap.blue;
  };

  const renderBars = () => (
    <div className="space-y-6">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-sm font-semibold text-gray-800">
                {item.label}
              </h4>
              {item.subtitle && (
                <p className="text-xs text-gray-500">{item.subtitle}</p>
              )}
            </div>
            {showPercentage && (
              <span className="text-sm font-bold text-gray-700">
                {item.value}%
              </span>
            )}
          </div>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
              className={`h-full ${getColor(item.color)} rounded-full relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderCircles = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item, index) => {
        const radius = 60;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (item.value / 100) * circumference;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-36 h-36">
              <svg className="transform -rotate-90 w-full h-full">
                {/* Background circle */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  className={getColor(item.color).replace("bg-", "text-")}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 1 }}
                  style={{
                    strokeDasharray: circumference,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">
                  {item.value}%
                </span>
              </div>
            </div>
            <h4 className="text-sm font-semibold text-gray-800 mt-3 text-center">
              {item.label}
            </h4>
            {item.subtitle && (
              <p className="text-xs text-gray-500 text-center">
                {item.subtitle}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-bold text-gray-800">{item.label}</h4>
            <span className={`text-sm font-bold ${getColor(item.color).replace("bg-", "text-")}`}>
              {item.value}%
            </span>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
              className={`h-full ${getColor(item.color)} rounded-full`}
            />
          </div>
          {item.subtitle && (
            <p className="text-xs text-gray-500 mt-2">{item.subtitle}</p>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderSteps = () => (
    <div className="space-y-6">
      {items.map((item, index) => {
        const StatusIcon =
          item.status === "completed"
            ? CheckCircle2
            : item.status === "in-progress"
            ? Clock
            : Circle;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4"
          >
            <div className="flex flex-col items-center">
              <StatusIcon
                className={`w-8 h-8 ${
                  item.status === "completed"
                    ? "text-green-500"
                    : item.status === "in-progress"
                    ? "text-blue-500"
                    : "text-gray-300"
                }`}
              />
              {index < items.length - 1 && (
                <div
                  className={`w-0.5 h-16 ${
                    item.status === "completed" ? "bg-green-200" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <div className="flex-1 pb-8">
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                {item.label}
              </h4>
              {item.subtitle && (
                <p className="text-sm text-gray-600 mb-3">{item.subtitle}</p>
              )}
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                  className={`h-full ${getColor(item.color)} rounded-full`}
                />
              </div>
              {showPercentage && (
                <span className="text-xs text-gray-500 mt-1 inline-block">
                  {item.value}% completado
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-8 border border-gray-200"
    >
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
        {title}
      </h2>

      {variant === "bars" && renderBars()}
      {variant === "circles" && renderCircles()}
      {variant === "skills" && renderSkills()}
      {variant === "steps" && renderSteps()}
    </motion.div>
  );
}
