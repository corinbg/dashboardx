import React from 'react';
import { User, Clock, Star, MessageCircle, Phone } from 'lucide-react';

interface ConversationCardProps {
  conversation: {
    id: string;
    user_id: string;
    started_at: string;
    is_closed: boolean;
  };
  lastMessage?: {
    text_line: string;
    timestamp: string;
    sender_type: 'Cliente' | 'Agente';
  };
  clientName?: string;
  phoneNumber: string;
  unreadCount?: number;
  isStarred?: boolean;
  assignedAgent?: string;
  onClick: () => void;
  onToggleStar?: () => void;
}

export function ConversationCard({ 
  conversation, 
  lastMessage, 
  clientName, 
  phoneNumber,
  unreadCount = 0,
  isStarred = false,
  assignedAgent,
  onClick,
  onToggleStar 
}: ConversationCardProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Ora';
    if (diffMinutes < 60) return `${diffMinutes} min fa`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h fa`;
    
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateMessage = (text: string, maxLength = 60) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition-all duration-200 ${
        conversation.is_closed 
          ? 'border-gray-200 dark:border-gray-700' 
          : 'border-l-4 border-l-green-500 dark:border-l-green-400 border-gray-200 dark:border-gray-700'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between">
        {/* Left Section - Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            {/* Client Avatar/Icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            
            {/* Client Name/Phone */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {clientName || phoneNumber}
                </h3>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold bg-blue-500 text-white rounded-full min-w-[20px] h-5">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              {clientName && (
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Phone className="h-3 w-3" />
                  <span>{phoneNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Last Message Preview */}
          {lastMessage && (
            <div className="pl-13">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                <span className={`font-medium ${
                  lastMessage.sender_type === 'Agente' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {lastMessage.sender_type === 'Agente' ? 'Tu: ' : ''}
                </span>
                {truncateMessage(lastMessage.text_line)}
              </p>
            </div>
          )}
        </div>

        {/* Right Section - Metadata & Actions */}
        <div className="flex flex-col items-end space-y-2 ml-4 flex-shrink-0">
          {/* Timestamp */}
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{formatTimestamp(lastMessage?.timestamp || conversation.started_at)}</span>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              conversation.is_closed
                ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
            }`}>
              {conversation.is_closed ? 'Chiusa' : 'Aperta'}
            </span>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2">
            {/* Star/Favorite Icon */}
            {onToggleStar && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar();
                }}
                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                }`}
                title={isStarred ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
              >
                <Star className={`h-4 w-4 ${isStarred ? 'fill-current' : ''}`} />
              </button>
            )}

            {/* Assigned Agent Indicator */}
            {assignedAgent && (
              <div className="flex items-center justify-center w-6 h-6 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                {assignedAgent.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Message Icon */}
            <MessageCircle className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}