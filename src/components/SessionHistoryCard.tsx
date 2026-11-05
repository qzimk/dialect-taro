import { Radio, Trash2, X } from './ui/icons';
import { View, Text, type ITouchEvent } from '@tarojs/components';

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
  onDelete: (e: ITouchEvent) => void;
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
    <View
      onClick={onClick}
      className="bg-white rounded-lg border border-purple-100 p-3 hover:border-purple-300 hover:shadow-md transition-all group cursor-pointer"
    >
      <View className="flex items-center justify-between mb-2">
        <View className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-purple-600" />
          <Text className="text-sm font-medium text-gray-900">
            {session.startTime.toLocaleString('zh-CN', { 
              month: 'numeric', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
        <View className="flex items-center gap-2">
          {variant === 'default' && (
            <Text className="text-xs text-gray-500">
              {session.speakers.length} 条记录
            </Text>
          )}
          <View
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 transition-opacity"
          >
            {variant === 'compact' ? (
              <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-600" />
            ) : (
              <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-600" />
            )}
          </View>
        </View>
      </View>
      
      {variant === 'default' && (
        <View className="text-xs text-gray-500 mb-2">
          {session.speakers.length} 条记录
        </View>
      )}
      
      {/* 会话内容预览 */}
      {session.speakers.length > 0 && (
        <View className="text-xs text-gray-600 space-y-1 text-left">
          {session.speakers.slice(0, maxPreviewItems).map((speaker) => (
            <View key={speaker.id} className="truncate">
              <Text className="font-medium">{speaker.speaker}:</Text> {speaker.text}
            </View>
          ))}
          {session.speakers.length > maxPreviewItems && (
            <View className="text-gray-400 italic">
              还有 {session.speakers.length - maxPreviewItems} 条...
            </View>
          )}
        </View>
      )}
      
      {/* 时长显示 */}
      {showDuration && session.endTime && (
        <View className={`${variant === 'compact' ? 'mt-2 pt-2 border-t border-gray-100' : 'mt-2'} text-xs text-gray-500`}>
          时长: {Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000)}秒
        </View>
      )}
    </View>
  );
}
