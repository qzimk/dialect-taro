import { Radio, Trash2, X } from 'lucide-react';

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

interface SessionHistoryCardProps {
  session: RealtimeSession;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  variant?: 'default' | 'compact';
  showDuration?: boolean;
}

export function SessionHistoryCard({
  session,
  onClick,
  onDelete,
  variant = 'default',
  showDuration = true,
}: SessionHistoryCardProps) {
  const maxPreviewItems = variant === 'compact' ? 2 : 3;
  
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-purple-100 p-3 hover:border-purple-300 hover:shadow-md transition-all group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-900">
            {session.startTime.toLocaleString('zh-CN', { 
              month: 'numeric', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {variant === 'default' && (
            <span className="text-xs text-gray-500">
              {session.speakers.length} 条记录
            </span>
          )}
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 transition-opacity"
            title="删除"
          >
            {variant === 'compact' ? (
              <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-600" />
            ) : (
              <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-600" />
            )}
          </button>
        </div>
      </div>
      
      {variant === 'default' && (
        <div className="text-xs text-gray-500 mb-2">
          {session.speakers.length} 条记录
        </div>
      )}
      
      {/* 会话内容预览 */}
      {session.speakers.length > 0 && (
        <div className="text-xs text-gray-600 space-y-1 text-left">
          {session.speakers.slice(0, maxPreviewItems).map((speaker) => (
            <div key={speaker.id} className="truncate">
              <span className="font-medium">{speaker.speaker}:</span> {speaker.text}
            </div>
          ))}
          {session.speakers.length > maxPreviewItems && (
            <div className="text-gray-400 italic">
              还有 {session.speakers.length - maxPreviewItems} 条...
            </div>
          )}
        </div>
      )}
      
      {/* 时长显示 */}
      {showDuration && session.endTime && (
        <div className={`${variant === 'compact' ? 'mt-2 pt-2 border-t border-gray-100' : 'mt-2'} text-xs text-gray-500`}>
          时长: {Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000)}秒
        </div>
      )}
    </div>
  );
}
