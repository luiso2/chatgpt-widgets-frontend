"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  title: string;
  type: "bar" | "line" | "pie" | "doughnut";
  data: number[];
  labels: string[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

export default function Chart({ title, type, data, labels }: ChartProps) {
  // Transform data for recharts
  const chartData = labels.map((label, index) => ({
    name: label,
    value: data[index],
  }));

  const typeEmoji: Record<string, string> = {
    bar: "📊",
    line: "📈",
    pie: "🥧",
    doughnut: "🍩",
  };

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
      case "doughnut":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                innerRadius={type === "doughnut" ? 60 : 0}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const total = data.reduce((a, b) => a + b, 0);
  const average = (total / data.length).toFixed(2);
  const max = Math.max(...data);
  const maxLabel = labels[data.indexOf(max)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        {typeEmoji[type]} {title}
      </h2>

      <div className="mb-6">{renderChart()}</div>

      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-800">{total.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Promedio</p>
          <p className="text-2xl font-bold text-gray-800">{average}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Máximo</p>
          <p className="text-2xl font-bold text-gray-800">
            {max} ({maxLabel})
          </p>
        </div>
      </div>
    </motion.div>
  );
}
