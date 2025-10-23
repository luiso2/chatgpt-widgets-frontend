"use client";

import { useState, useCallback } from "react";

export interface TreeNode<T = unknown> {
  id: string;
  label: string;
  children?: TreeNode<T>[];
  data?: T;
  isExpanded?: boolean;
  isSelected?: boolean;
  icon?: string;
  badge?: string | number;
}

/**
 * Hook to manage hierarchical tree data structures with advanced operations.
 *
 * @param initialData - Initial tree data
 * @returns Tree data state and manipulation functions
 *
 * @example
 * ```tsx
 * const { tree, addNode, removeNode, updateNode, findNode } = useTreeData(initialTree);
 *
 * // Add a child node
 * addNode("parent-id", { id: "child-1", label: "Child" });
 *
 * // Update node
 * updateNode("node-id", { label: "Updated Label" });
 * ```
 */
export function useTreeData<T = unknown>(initialData: TreeNode<T>[] = []) {
  const [tree, setTree] = useState<TreeNode<T>[]>(initialData);

  const findNode = useCallback(
    (nodeId: string, nodes: TreeNode<T>[] = tree): TreeNode<T> | null => {
      for (const node of nodes) {
        if (node.id === nodeId) return node;
        if (node.children) {
          const found = findNode(nodeId, node.children);
          if (found) return found;
        }
      }
      return null;
    },
    [tree]
  );

  const addNode = useCallback(
    (parentId: string | null, newNode: TreeNode<T>) => {
      setTree((prevTree) => {
        if (parentId === null) {
          return [...prevTree, newNode];
        }

        const addToParent = (nodes: TreeNode<T>[]): TreeNode<T>[] => {
          return nodes.map((node) => {
            if (node.id === parentId) {
              return {
                ...node,
                children: [...(node.children || []), newNode],
              };
            }
            if (node.children) {
              return { ...node, children: addToParent(node.children) };
            }
            return node;
          });
        };

        return addToParent(prevTree);
      });
    },
    []
  );

  const removeNode = useCallback((nodeId: string) => {
    setTree((prevTree) => {
      const removeFromTree = (nodes: TreeNode<T>[]): TreeNode<T>[] => {
        return nodes
          .filter((node) => node.id !== nodeId)
          .map((node) => ({
            ...node,
            children: node.children
              ? removeFromTree(node.children)
              : undefined,
          }));
      };

      return removeFromTree(prevTree);
    });
  }, []);

  const updateNode = useCallback(
    (nodeId: string, updates: Partial<TreeNode<T>>) => {
      setTree((prevTree) => {
        const updateInTree = (nodes: TreeNode<T>[]): TreeNode<T>[] => {
          return nodes.map((node) => {
            if (node.id === nodeId) {
              return { ...node, ...updates };
            }
            if (node.children) {
              return { ...node, children: updateInTree(node.children) };
            }
            return node;
          });
        };

        return updateInTree(prevTree);
      });
    },
    []
  );

  const toggleExpansion = useCallback((nodeId: string) => {
    setTree((prevTree) => {
      const toggleInTree = (nodes: TreeNode<T>[]): TreeNode<T>[] => {
        return nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, isExpanded: !node.isExpanded };
          }
          if (node.children) {
            return { ...node, children: toggleInTree(node.children) };
          }
          return node;
        });
      };

      return toggleInTree(prevTree);
    });
  }, []);

  const expandAll = useCallback(() => {
    setTree((prevTree) => {
      const expandInTree = (nodes: TreeNode<T>[]): TreeNode<T>[] => {
        return nodes.map((node) => ({
          ...node,
          isExpanded: true,
          children: node.children ? expandInTree(node.children) : undefined,
        }));
      };

      return expandInTree(prevTree);
    });
  }, []);

  const collapseAll = useCallback(() => {
    setTree((prevTree) => {
      const collapseInTree = (nodes: TreeNode<T>[]): TreeNode<T>[] => {
        return nodes.map((node) => ({
          ...node,
          isExpanded: false,
          children: node.children ? collapseInTree(node.children) : undefined,
        }));
      };

      return collapseInTree(prevTree);
    });
  }, []);

  return {
    tree,
    setTree,
    findNode,
    addNode,
    removeNode,
    updateNode,
    toggleExpansion,
    expandAll,
    collapseAll,
  };
}
