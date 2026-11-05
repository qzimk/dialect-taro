import { History } from './ui/icons';
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

interface SessionHistoryListProps {
  sessions: RealtimeSession[];
  onViewSession: (session: RealtimeSession) => void;
  onDeleteSession: (sessionId: string) => void;
  emptyMessage?: string;
}

export function SessionHistoryList({
  sessions,
  onViewSession,
  onDeleteSession,
  emptyMessage = '暂无历史会话',
}: SessionHistoryListProps) {
  if (sessions.length === 0) {
    return (
      <View className="flex flex-col items-center justify-center h-full">
        <History className="w-10 h-10 mb-3 opacity-50 text-gray-400" />
        <Text className="block text-sm font-medium mb-1 text-gray-700">{emptyMessage}</Text>
        <Text className="block text-xs text-gray-500">点击"创建会话"开始第一次实时翻译</Text>
      </View>
    );
  }

  return (
    <ScrollView scrollY className="h-full space-y-2">
      {sessions.map((session) => (
        <SessionHistoryCard
          key={session.id}
          session={session}
          onClick={() => onViewSession(session)}
          onDelete={(e) => {
            e.stopPropagation();
            onDeleteSession(session.id);
          }}
        />
      ))}
    </ScrollView>
  );
}
