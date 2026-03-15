import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const DRAFT_KEY = "excel_import_draft";
const DRAFT_EXPIRY_HOURS = 24;

const useDraftManager = () => {
  const [hasDraft, setHasDraft] = useState(false);
  const [draftData, setDraftData] = useState(null);

  useEffect(() => {
    const checkDraft = () => {
      try {
        const stored = localStorage.getItem(DRAFT_KEY);
        if (!stored) {
          setHasDraft(false);
          return;
        }

        const { data, timestamp } = JSON.parse(stored);
        const now = Date.now();
        const expiryMs = DRAFT_EXPIRY_HOURS * 60 * 60 * 1000;

        if (now - timestamp > expiryMs) {
          localStorage.removeItem(DRAFT_KEY);
          setHasDraft(false);
        } else {
          setHasDraft(true);
          setDraftData(data);
        }
      } catch (error) {
        console.error("Error checking draft:", error);
        setHasDraft(false);
      }
    };

    checkDraft();
  }, []);

  const saveDraft = useCallback((data) => {
    try {
      const draft = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setHasDraft(true);
      toast.info("Đã lưu draft");
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  }, []);

  const loadDraft = useCallback(() => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      if (!stored) return null;

      const { data, timestamp } = JSON.parse(stored);
      const now = Date.now();
      const expiryMs = DRAFT_EXPIRY_HOURS * 60 * 60 * 1000;

      if (now - timestamp > expiryMs) {
        localStorage.removeItem(DRAFT_KEY);
        setHasDraft(false);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error loading draft:", error);
      return null;
    }
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
      setDraftData(null);
      toast.info("Đã xóa draft");
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  }, []);

  const confirmClearDraft = useCallback(() => {
    clearDraft();
  }, [clearDraft]);

  return {
    hasDraft,
    draftData,
    saveDraft,
    loadDraft,
    clearDraft: confirmClearDraft,
  };
};

export default useDraftManager;
