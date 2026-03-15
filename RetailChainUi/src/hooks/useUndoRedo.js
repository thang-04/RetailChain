import { useState, useCallback, useEffect } from "react";

const MAX_HISTORY = 50;

const useUndoRedo = (initialState = null) => {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const pushState = useCallback(
    (newState) => {
      setState(newState);

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);

      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      } else {
        setHistoryIndex(newHistory.length - 1);
      }

      setHistory(newHistory);
    },
    [history, historyIndex]
  );

  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setState(history[newIndex]);
    }
  }, [canUndo, historyIndex, history]);

  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setState(history[newIndex]);
    }
  }, [canRedo, historyIndex, history]);

  const reset = useCallback(
    (newState = null) => {
      setState(newState);
      setHistory([newState]);
      setHistoryIndex(0);
    },
    []
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return {
    state,
    setState: pushState,
    replaceState: setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    history,
    historyIndex,
  };
};

export default useUndoRedo;
