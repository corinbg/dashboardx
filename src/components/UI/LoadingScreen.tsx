import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({ message = 'Caricamento...', fullScreen = true }: LoadingScreenProps) {
  const containerClasses = fullScreen
    ? 'min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
        {message && (
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
}

export function InlineLoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
