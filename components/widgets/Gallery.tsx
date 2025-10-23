"use client";

import { motion } from "framer-motion";
import { ExternalLink, Eye, Heart, Download } from "lucide-react";
import { useState } from "react";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  description?: string;
  category?: string;
  stats?: {
    views?: number;
    likes?: number;
    downloads?: number;
  };
}

interface GalleryProps {
  title?: string;
  items: GalleryItem[];
  variant?: "grid" | "masonry" | "carousel";
  columns?: 2 | 3 | 4;
}

export default function Gallery({
  title = "Gallery",
  items,
  variant = "grid",
  columns = 3,
}: GalleryProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const renderGrid = () => (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          onHoverStart={() => setHoveredItem(item.id)}
          onHoverEnd={() => setHoveredItem(null)}
          className="group relative overflow-hidden rounded-2xl shadow-xl cursor-pointer"
        >
          {/* Image */}
          <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-6xl">🖼️</span>
              </div>
            )}
          </div>

          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end"
          >
            {/* Category Badge */}
            {item.category && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                {item.category}
              </span>
            )}

            {/* Title & Description */}
            <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
            {item.description && (
              <p className="text-white/80 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Stats */}
            {item.stats && (
              <div className="flex items-center gap-4 text-white/90 text-sm mb-3">
                {item.stats.views !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{item.stats.views}</span>
                  </div>
                )}
                {item.stats.likes !== undefined && (
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{item.stats.likes}</span>
                  </div>
                )}
                {item.stats.downloads !== undefined && (
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{item.stats.downloads}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <button className="w-full py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <span>Ver detalles</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );

  const renderMasonry = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="break-inside-avoid mb-6"
        >
          <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <div className="bg-gradient-to-br from-gray-200 to-gray-300">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center text-gray-400">
                  <span className="text-6xl">🖼️</span>
                </div>
              )}
            </div>
            <div className="p-4 bg-white">
              {item.category && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-2">
                  {item.category}
                </span>
              )}
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-8"
    >
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {title}
        </h2>
        <p className="text-gray-600">{items.length} items</p>
      </div>

      {/* Gallery */}
      {variant === "grid" && renderGrid()}
      {variant === "masonry" && renderMasonry()}
    </motion.div>
  );
}
