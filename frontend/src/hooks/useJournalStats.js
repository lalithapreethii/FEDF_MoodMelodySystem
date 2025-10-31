import { useMemo } from 'react';
export default function useJournalStats(journalEntries) {
  // Example returns word count
  return useMemo(() => journalEntries.reduce((acc, je) => acc + (je.text.length || 0), 0), [journalEntries]);
}
