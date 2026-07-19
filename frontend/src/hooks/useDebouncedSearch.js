import { useEffect, useMemo, useState } from "react";
import { filesApi } from "../services/api.js";

/**
 * Debounces a search term and queries the /search Lambda once the user
 * pauses typing, falling back to the full (already-fetched) file list when
 * the query is cleared.
 */
export function useDebouncedSearch(allFiles, delayMs = 350) {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(term.trim()), delayMs);
    return () => clearTimeout(handle);
  }, [term, delayMs]);

  useEffect(() => {
    let cancelled = false;
    if (!debounced) {
      setResults(null);
      return;
    }
    setIsSearching(true);
    filesApi
      .search(debounced)
      .then((data) => {
        if (!cancelled) setResults(data.files || []);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const displayedFiles = useMemo(() => (results !== null ? results : allFiles), [results, allFiles]);

  return { term, setTerm, displayedFiles, isSearching, isActive: !!debounced };
}
