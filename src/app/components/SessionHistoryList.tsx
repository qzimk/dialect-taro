import { History } from 'lucide-react';
import { SessionHistoryCard } from './SessionHistoryCard';

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
      <div className="flex flex-col items-center justify-center h-full">
        <History className="w-10 h-10 mb-3 opacity-50 text-gray-400" />
        <p className="text-sm font-medium mb-1 text-gray-700">{emptyMessage}</p>
        <p className="text-xs text-gray-500">点击"创建会话"开始第一次实时翻译</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-2">
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
    </div>
  );
}
