"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Metric {
  value: string;
  label: string;
  color: string;
  change?: string;
}

interface DashboardProps {
  title: string;
  metrics: Metric[];
}

const colorMap: Record<string, string> = {
  "text-green-600": "bg-green-100 text-green-700 border-green-200",
  "text-blue-600": "bg-blue-100 text-blue-700 border-blue-200",
  "text-purple-600": "bg-purple-100 text-purple-700 border-purple-200",
  "text-orange-600": "bg-orange-100 text-orange-700 border-orange-200",
  "text-red-600": "bg-red-100 text-red-700 border-red-200",
};

export default function Dashboard({ title, metrics }: DashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        📊 {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const isPositive = metric.change?.startsWith("+");
          const bgColor = colorMap[metric.color] || "bg-gray-100 text-gray-700 border-gray-200";

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`${bgColor} rounded-xl p-6 border-2 hover:shadow-lg transition-all duration-300 hover:scale-105`}
            >
              <p className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-80">
                {metric.label}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold">{metric.value}</p>
              </div>
              {metric.change && (
                <div className="flex items-center gap-1 mt-3">
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-bold ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        Datos actualizados: {new Date().toLocaleDateString("es-ES")}
      </div>
    </motion.div>
  );
}
