import { ChevronLeft, Plus, MessageSquare, Trash2 } from 'lucide-react';

type Message = {
  id: string;
  type: 'user' | 'assistant' | 'realtime-session';
  text: string;
  language?: string;
  hasAudio?: boolean;
  timestamp: Date;
  sessionId?: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

interface ConversationHistorySidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
  currentConversationId: string;
  onClose: () => void;
  onCreateNew: () => void;
  onSwitch: (convId: string) => void;
  onDelete: (convId: string) => void;
}

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
};

export function ConversationHistorySidebar({
  isOpen,
  conversations,
  currentConversationId,
  onClose,
  onCreateNew,
  onSwitch,
  onDelete,
}: ConversationHistorySidebarProps) {
  return (
    <div
      className={`absolute top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-10 ${
        isOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}
    >
      <div className="flex flex-col h-full w-64">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">历史记录</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="收起侧边栏"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* New Conversation Button */}
        <div className="p-3 border-b border-gray-200">
          <button
            onClick={onCreateNew}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">新建对话</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  conv.id === currentConversationId
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSwitch(conv.id)}
              >
                <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {conv.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatTime(conv.updatedAt)}
                  </p>
                </div>
                
                {/* Delete Button */}
                {conversations.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 transition-opacity"
                    title="删除对话"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-600" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
