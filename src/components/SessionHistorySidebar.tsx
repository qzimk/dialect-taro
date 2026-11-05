import { ChevronRight } from './ui/icons';
import { SessionHistoryCard } from './SessionHistoryCard';
import { View, Text, ScrollView } from '@tarojs/components';

type SpeakerSegment = {
  id: string;
  speaker: string;
  text: string;
  translation: string;
  timestamp: Date;
  language: string;
  verticalPosition?: number;
};

type RealtimeSession = {
  id: string;
  startTime: Date;
  endTime?: Date;
  speakers: SpeakerSegment[];
  status: 'active' | 'ended';
};

interface SessionHistorySidebarProps {
  isOpen: boolean;
  sessions: RealtimeSession[];
  onClose: () => void;
  onViewSession: (session: RealtimeSession) => void;
  onDeleteSession: (sessionId: string) => void;
}

export function SessionHistorySidebar({
  isOpen,
  sessions,
  onClose,
  onViewSession,
  onDeleteSession,
}: SessionHistorySidebarProps) {
  return (
    <View className={`transition-all duration-300 bg-white border-l border-purple-200 overflow-hidden ${
      isOpen && sessions.length > 0 ? 'w-80' : 'w-0'
    }`}>
      <View className="w-80 h-full flex flex-col">
        {/* 侧边栏头部 */}
        <View className="flex items-center justify-between p-3 border-b border-purple-200 bg-purple-50">
          <Text className="block text-sm font-semibold text-purple-900">历史会话</Text>
          <View
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </View>
        </View>
        
        {/* 会话列表 */}
        <ScrollView scrollY className="flex-1 p-3 space-y-2">
          {sessions.map((session) => (
            <SessionHistoryCard
              key={session.id}
              session={session}
              variant="compact"
              onClick={() => {
                onClose();
                onViewSession(session);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
