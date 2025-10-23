"use client";

import { motion } from "framer-motion";
import { MoreVertical, Plus, User, Calendar, Tag } from "lucide-react";

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  priority?: "low" | "medium" | "high";
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string;
}

interface KanbanProps {
  title?: string;
  columns: KanbanColumn[];
}

const priorityColors = {
  low: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  high: "bg-red-100 text-red-700 border-red-200",
};

const columnColors: Record<string, string> = {
  blue: "border-blue-500 bg-blue-50",
  green: "border-green-500 bg-green-50",
  purple: "border-purple-500 bg-purple-50",
  orange: "border-orange-500 bg-orange-50",
  red: "border-red-500 bg-red-50",
};

export default function Kanban({ title = "Project Board", columns }: KanbanProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-2xl shadow-2xl p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-gray-600 mt-2">
          {columns.reduce((sum, col) => sum + col.cards.length, 0)} tareas totales
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {columns.map((column, colIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIndex * 0.1 }}
            className={`
              rounded-xl border-t-4 p-4 bg-white shadow-lg
              ${columnColors[column.color || "blue"] || columnColors.blue}
            `}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800">{column.title}</h3>
                <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                  {column.cards.length}
                </span>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Cards */}
            <div className="space-y-3 min-h-[200px]">
              {column.cards.map((card, cardIndex) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: colIndex * 0.1 + cardIndex * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white rounded-lg p-4 shadow-md border border-gray-200 cursor-pointer hover:shadow-xl transition-all"
                >
                  {/* Priority Badge */}
                  {card.priority && (
                    <div className="mb-2">
                      <span
                        className={`
                        px-2 py-0.5 rounded text-xs font-semibold border
                        ${priorityColors[card.priority]}
                      `}
                      >
                        {card.priority.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {card.title}
                  </h4>

                  {/* Description */}
                  {card.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {card.description}
                    </p>
                  )}

                  {/* Tags */}
                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {card.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    {card.assignee && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{card.assignee}</span>
                      </div>
                    )}
                    {card.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{card.dueDate}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Add Card Button */}
              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2 group">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                <span className="text-sm font-medium">Agregar tarjeta</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
