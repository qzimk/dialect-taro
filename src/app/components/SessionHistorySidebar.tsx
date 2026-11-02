import { ChevronRight, History } from 'lucide-react';
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
    <div className={`transition-all duration-300 bg-white border-l border-purple-200 overflow-hidden ${
      isOpen && sessions.length > 0 ? 'w-80' : 'w-0'
    }`}>
      <div className="w-80 h-full flex flex-col">
        {/* 侧边栏头部 */}
        <div className="flex items-center justify-between p-3 border-b border-purple-200 bg-purple-50">
          <h4 className="text-sm font-semibold text-purple-900">历史会话</h4>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors"
            title="收起侧边栏"
          >
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </button>
        </div>
        
        {/* 会话列表 */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
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
        </div>
      </div>
    </div>
  );
}
