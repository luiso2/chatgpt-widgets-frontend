"use client";

import { motion } from "framer-motion";

interface TableProps {
  title: string;
  headers: string[];
  rows: string[][];
}

export default function Table({ title, headers, rows }: TableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        📋 {title}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider first:rounded-tl-xl last:rounded-tr-xl"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                className={`${
                  rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition-colors duration-200`}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 text-sm text-gray-700 border-b border-gray-200"
                  >
                    {cell}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        Total de registros: <span className="font-bold text-gray-700">{rows.length}</span>
      </div>
    </motion.div>
  );
}
