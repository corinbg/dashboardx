import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface UseKeyboardShortcutsProps {
  onFocusSearch?: () => void;
  onResetFilters?: () => void;
}

export function useKeyboardShortcuts({ 
  onFocusSearch, 
  onResetFilters 
}: UseKeyboardShortcutsProps = {}) {
  const { toggleDarkMode } = useTheme();

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      // Ignore if user is typing in an input field
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'f':
          event.preventDefault();
          onFocusSearch?.();
          break;
        case 'r':
          event.preventDefault();
          onResetFilters?.();
          break;
        case 'd':
          event.preventDefault();
          toggleDarkMode();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleDarkMode, onFocusSearch, onResetFilters]);
}