"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

interface ComparisonItem {
  name: string;
  price: string;
  features: string[];
  highlight: boolean;
}

interface ComparisonProps {
  title: string;
  items: ComparisonItem[];
}

export default function Comparison({ title, items }: ComparisonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        ⚖️ {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`relative rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-2xl ${
              item.highlight
                ? "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-400 shadow-lg transform scale-105"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            {item.highlight && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                <Star className="w-4 h-4 fill-current" />
                RECOMENDADO
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {item.name}
              </h3>
              {item.price && (
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {item.price}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">
                Características
              </p>
              {item.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>

            {item.highlight && (
              <button className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Elegir Plan
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
