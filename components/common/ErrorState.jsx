import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Error state component
 */
export function ErrorState({ message, onRetry, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Something went wrong</h3>
      <p className="text-sm text-slate-600 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}

/**
 * Empty state component
 */
export function EmptyState({ message, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <p className="text-base text-slate-600 text-center">{message}</p>
    </div>
  );
}
