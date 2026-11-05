import { ChevronLeft, Plus, MessageSquare, Trash2 } from './ui/icons';
import { View, Text, ScrollView } from '@tarojs/components';

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
    <View
      className={`absolute top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-10 ${
        isOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}
    >
      <View className="flex flex-col h-full w-64">
        {/* Sidebar Header */}
        <View className="flex items-center justify-between p-4 border-b border-gray-200">
          <Text className="block text-lg font-semibold text-gray-900">历史记录</Text>
          <View
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </View>
        </View>

        {/* New Conversation Button */}
        <View className="p-3 border-b border-gray-200">
          <View
            onClick={onCreateNew}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <Text className="text-sm font-medium">新建对话</Text>
          </View>
        </View>

        {/* Conversations List */}
        <ScrollView scrollY className="flex-1">
          <View className="p-2 space-y-1">
            {conversations.map((conv) => (
              <View
                key={conv.id}
                className={`group relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  conv.id === currentConversationId
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSwitch(conv.id)}
              >
                <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <View className="flex-1 min-w-0">
                  <Text className="block text-sm font-medium text-gray-900 truncate">
                    {conv.title}
                  </Text>
                  <Text className="block text-xs text-gray-500 mt-0.5">
                    {formatTime(conv.updatedAt)}
                  </Text>
                </View>
                
                {/* Delete Button */}
                {conversations.length > 1 && (
                  <View
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-600" />
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
