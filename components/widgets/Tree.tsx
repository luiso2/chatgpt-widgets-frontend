"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  FolderOpen,
  Database,
  Code,
  Package,
  Settings,
  Users,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
} from "lucide-react";
import { useTreeData, useTreeSelection, type TreeNode } from "@/app/hooks";

interface TreeProps {
  title?: string;
  data: TreeNode[];
  expandAll?: boolean;
  multiSelect?: boolean;
  showSearch?: boolean;
  animated?: boolean;
  variant?: "default" | "premium" | "minimal" | "neon";
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  folder: Folder,
  "folder-open": FolderOpen,
  file: File,
  database: Database,
  code: Code,
  package: Package,
  settings: Settings,
  users: Users,
  document: FileText,
  image: ImageIcon,
  video: Video,
  music: Music,
};

const variantStyles = {
  default: {
    container: "bg-gradient-to-br from-gray-50 to-white",
    header: "bg-gradient-to-r from-blue-600 to-purple-600",
    node: "hover:bg-blue-50 border-l-4 border-transparent hover:border-blue-500",
    selected: "bg-blue-100 border-l-4 border-blue-600",
  },
  premium: {
    container: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    header: "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600",
    node: "hover:bg-white/10 backdrop-blur-sm border-l-4 border-transparent hover:border-amber-400",
    selected: "bg-white/20 border-l-4 border-amber-500 shadow-lg shadow-amber-500/50",
  },
  minimal: {
    container: "bg-white",
    header: "bg-gray-900",
    node: "hover:bg-gray-50 border-l-2 border-transparent hover:border-gray-400",
    selected: "bg-gray-100 border-l-2 border-gray-900",
  },
  neon: {
    container: "bg-gradient-to-br from-black via-purple-950 to-black",
    header: "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500",
    node: "hover:bg-purple-500/20 border-l-4 border-transparent hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50",
    selected: "bg-purple-500/30 border-l-4 border-pink-500 shadow-lg shadow-pink-500/50",
  },
};

export default function Tree({
  title = "File Explorer",
  data,
  expandAll = false,
  multiSelect = false,
  showSearch = false,
  animated = true,
  variant = "premium",
}: TreeProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { tree, toggleExpansion, expandAll: expandAllNodes, collapseAll } = useTreeData(data);
  const { selectedSet, toggle, isSelected } = useTreeSelection([], multiSelect);

  const styles = variantStyles[variant];
  const isPremium = variant === "premium" || variant === "neon";

  React.useEffect(() => {
    if (expandAll) {
      expandAllNodes();
    }
  }, [expandAll, expandAllNodes]);

  const getIcon = (iconName?: string, isExpanded?: boolean, hasChildren?: boolean) => {
    if (hasChildren) {
      const Icon = isExpanded ? FolderOpen : Folder;
      return <Icon className={`w-5 h-5 ${isPremium ? "text-amber-400" : "text-blue-600"}`} />;
    }

    if (iconName && iconMap[iconName]) {
      const Icon = iconMap[iconName];
      return <Icon className={`w-5 h-5 ${isPremium ? "text-gray-300" : "text-gray-600"}`} />;
    }

    return <File className={`w-5 h-5 ${isPremium ? "text-gray-400" : "text-gray-500"}`} />;
  };

  const filterTree = (nodes: TreeNode[], term: string): TreeNode[] => {
    if (!term) return nodes;

    return nodes
      .filter((node) => {
        const matchesSearch = node.label.toLowerCase().includes(term.toLowerCase());
        const childrenMatch = node.children && filterTree(node.children, term).length > 0;
        return matchesSearch || childrenMatch;
      })
      .map((node) => ({
        ...node,
        children: node.children ? filterTree(node.children, term) : undefined,
        isExpanded: true, // Auto-expand when searching
      }));
  };

  const renderNode = (node: TreeNode, depth: number = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const selected = isSelected(node.id);
    const ChevronIcon = node.isExpanded ? ChevronDown : ChevronRight;

    return (
      <motion.div
        key={node.id}
        initial={animated ? { opacity: 0, x: -20 } : undefined}
        animate={animated ? { opacity: 1, x: 0 } : undefined}
        exit={animated ? { opacity: 0, x: -20 } : undefined}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <div
          className={`
            flex items-center gap-2 px-4 py-2.5 cursor-pointer
            transition-all duration-200 group
            ${styles.node}
            ${selected ? styles.selected : ""}
          `}
          style={{ paddingLeft: `${depth * 24 + 16}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpansion(node.id);
            }
            toggle(node.id);
          }}
        >
          {hasChildren && (
            <ChevronIcon
              className={`w-4 h-4 transition-transform ${
                isPremium ? "text-amber-400" : "text-gray-600"
              }`}
            />
          )}
          {!hasChildren && <div className="w-4" />}

          {getIcon(node.icon, node.isExpanded, hasChildren)}

          <span
            className={`flex-1 font-medium ${
              isPremium ? "text-gray-100" : "text-gray-800"
            } ${selected ? "font-semibold" : ""}`}
          >
            {node.label}
          </span>

          {node.badge && (
            <span
              className={`
                px-2.5 py-0.5 rounded-full text-xs font-bold
                ${
                  isPremium
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black"
                    : "bg-blue-600 text-white"
                }
                shadow-lg ${isPremium ? "shadow-amber-500/50" : "shadow-blue-500/50"}
              `}
            >
              {node.badge}
            </span>
          )}
        </div>

        <AnimatePresence>
          {node.isExpanded && hasChildren && (
            <motion.div
              initial={animated ? { height: 0, opacity: 0 } : undefined}
              animate={animated ? { height: "auto", opacity: 1 } : undefined}
              exit={animated ? { height: 0, opacity: 0 } : undefined}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {node.children!.map((child) => renderNode(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const filteredTree = filterTree(tree, searchTerm);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl shadow-2xl overflow-hidden ${styles.container} ${
        isPremium ? "border-2 border-amber-500/30" : "border border-gray-200"
      }`}
    >
      {/* Header */}
      <div className={`${styles.header} px-6 py-5 shadow-lg relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 animate-pulse" />
        <div className="relative flex items-center justify-between">
          <h2
            className={`text-2xl font-bold ${
              isPremium ? "text-black" : "text-white"
            } flex items-center gap-3`}
          >
            <Database className="w-7 h-7" />
            {title}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={expandAllNodes}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-semibold
                ${
                  isPremium
                    ? "bg-black/20 hover:bg-black/30 text-white"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }
                transition-all duration-200
              `}
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-semibold
                ${
                  isPremium
                    ? "bg-black/20 hover:bg-black/30 text-white"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }
                transition-all duration-200
              `}
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="px-6 py-4 border-b border-gray-200/20">
          <input
            type="text"
            placeholder="Search files and folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`
              w-full px-4 py-2.5 rounded-lg
              ${
                isPremium
                  ? "bg-white/10 text-white placeholder-gray-400 border border-amber-500/30"
                  : "bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-300"
              }
              focus:outline-none focus:ring-2
              ${isPremium ? "focus:ring-amber-500" : "focus:ring-blue-500"}
              transition-all duration-200
            `}
          />
        </div>
      )}

      {/* Tree Content */}
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        {filteredTree.length > 0 ? (
          filteredTree.map((node) => renderNode(node))
        ) : (
          <div className="py-12 text-center">
            <p className={`text-lg ${isPremium ? "text-gray-400" : "text-gray-500"}`}>
              No items found
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div
        className={`
          px-6 py-3 border-t
          ${isPremium ? "border-amber-500/20 bg-black/20" : "border-gray-200 bg-gray-50"}
          flex items-center justify-between
        `}
      >
        <p className={`text-sm font-medium ${isPremium ? "text-gray-300" : "text-gray-600"}`}>
          {filteredTree.length} items {searchTerm && `(filtered)`}
        </p>
        {selectedSet.size > 0 && (
          <p
            className={`text-sm font-bold ${
              isPremium
                ? "text-amber-400"
                : "text-blue-600"
            }`}
          >
            {selectedSet.size} selected
          </p>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isPremium ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.05)"};
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isPremium ? "rgba(251, 191, 36, 0.5)" : "rgba(59, 130, 246, 0.5)"};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isPremium ? "rgba(251, 191, 36, 0.8)" : "rgba(59, 130, 246, 0.8)"};
        }
      `}</style>
    </motion.div>
  );
}
