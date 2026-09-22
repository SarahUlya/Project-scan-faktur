import { useEffect } from "react";

/**
 * Hook untuk mengelola keyboard shortcuts global.
 * Auto-disable kalau ada modal open.
 *
 * @param {Object} handlers — { F2, F4, F6, F8, Escape }
 * @param {Object} options  — { disabled, disabledKeys: ["F2","F4",...] }
 */
export default function useKeyboardShortcuts(handlers = {}, options = {}) {
  const { disabled = false, disabledKeys = [] } = options;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      if (disabledKeys.includes(e.key)) return;

      const handler = handlers[e.key];
      if (handler) {
        e.preventDefault();
        handler(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers, disabled, disabledKeys]);
}