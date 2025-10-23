"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  Eye,
  MessageSquare,
  Star,
  Heart,
  Download,
  Upload,
} from "lucide-react";

interface StatCard {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: string;
  color?: string;
}

interface StatsCardsProps {
  title?: string;
  stats: StatCard[];
  variant?: "default" | "gradient" | "glass" | "neon";
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  dollar: DollarSign,
  cart: ShoppingCart,
  activity: Activity,
  eye: Eye,
  message: MessageSquare,
  star: Star,
  heart: Heart,
  download: Download,
  upload: Upload,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
};

const colorMap: Record<string, string> = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  purple: "from-purple-500 to-purple-600",
  orange: "from-orange-500 to-orange-600",
  red: "from-red-500 to-red-600",
  pink: "from-pink-500 to-pink-600",
  cyan: "from-cyan-500 to-cyan-600",
  indigo: "from-indigo-500 to-indigo-600",
};

export default function StatsCards({
  title = "Statistics Overview",
  stats,
  variant = "gradient",
}: StatsCardsProps) {
  const getIcon = (iconName?: string) => {
    if (!iconName || !iconMap[iconName]) {
      return Activity;
    }
    return iconMap[iconName];
  };

  const getGradient = (color?: string) => {
    return colorMap[color || "blue"] || colorMap.blue;
  };

  const variantStyles = {
    default: {
      container: "bg-white border border-gray-200",
      title: "text-gray-900",
      value: "text-gray-800",
      change: "text-gray-600",
    },
    gradient: {
      container: "bg-gradient-to-br shadow-xl",
      title: "text-white/90",
      value: "text-white font-bold",
      change: "text-white/80",
    },
    glass: {
      container: "bg-white/10 backdrop-blur-lg border border-white/20",
      title: "text-white/90",
      value: "text-white font-bold",
      change: "text-white/70",
    },
    neon: {
      container: "bg-gray-900 border-2 shadow-2xl",
      title: "text-white",
      value: "text-white font-bold",
      change: "text-gray-300",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="space-y-6">
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {title}
        </motion.h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = getIcon(stat.icon);
          const gradient = getGradient(stat.color);
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`
                ${styles.container}
                ${variant === "gradient" ? `bg-gradient-to-br ${gradient}` : ""}
                ${variant === "neon" ? `border-${stat.color || "blue"}-500 shadow-${stat.color || "blue"}-500/50` : ""}
                rounded-2xl p-6 transition-all duration-300
                ${variant === "default" ? "hover:shadow-xl" : ""}
              `}
            >
              {/* Icon */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`
                  p-3 rounded-xl
                  ${variant === "gradient" ? "bg-white/20" : ""}
                  ${variant === "glass" ? "bg-white/10" : ""}
                  ${variant === "neon" ? `bg-${stat.color || "blue"}-500/20` : ""}
                  ${variant === "default" ? `bg-${stat.color || "blue"}-100` : ""}
                `}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      variant === "default"
                        ? `text-${stat.color || "blue"}-600`
                        : "text-white"
                    }`}
                  />
                </div>

                {/* Trend Badge */}
                {stat.trend && stat.change && (
                  <div
                    className={`
                    flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      stat.trend === "up"
                        ? variant === "gradient" || variant === "glass"
                          ? "bg-white/20 text-white"
                          : "bg-green-100 text-green-700"
                        : variant === "gradient" || variant === "glass"
                        ? "bg-white/20 text-white"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                  >
                    <TrendIcon className="w-3 h-3" />
                    {stat.change}
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <h3 className={`text-sm font-medium ${styles.title} mb-2`}>
                  {stat.title}
                </h3>
                <p className={`text-3xl font-bold ${styles.value}`}>
                  {stat.value}
                </p>
                {stat.change && !stat.trend && (
                  <p className={`text-sm mt-2 ${styles.change}`}>
                    {stat.change}
                  </p>
                )}
              </div>

              {/* Decorative Element */}
              {variant === "neon" && (
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-10 -z-10`}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
