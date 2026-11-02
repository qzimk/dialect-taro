import { useState } from 'react';
import { Mic, Square, Volume2, Users, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

type TranslationSegment = {
  id: string;
  speaker: 'A' | 'B';
  originalText: string;
  translatedText: string;
  originalLanguage: string;
  timestamp: string;
};

export function LiveTranslationMode() {
  const [isRecording, setIsRecording] = useState(false);
  const [segments, setSegments] = useState<TranslationSegment[]>([]);
  const [targetLanguage, setTargetLanguage] = useState('普通话');
  const [speakerCount, setSpeakerCount] = useState('2');

  const mockSegments: TranslationSegment[] = [
    {
      id: '1',
      speaker: 'A',
      originalText: '你好啊，今天巴适得很！',
      translatedText: '你好啊，今天很舒服！',
      originalLanguage: '四川话',
      timestamp: '00:01',
    },
    {
      id: '2',
      speaker: 'B',
      originalText: 'Hello! I think it\'s a wonderful day.',
      translatedText: '你好！我觉得今天天气很好。',
      originalLanguage: '英语',
      timestamp: '00:05',
    },
    {
      id: '3',
      speaker: 'A',
      originalText: '对头，咱们出去耍一哈嘛',
      translatedText: '对啊，我们出去玩一会儿吧',
      originalLanguage: '四川话',
      timestamp: '00:09',
    },
  ];

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.success('开始实时翻译');
      
      // Simulate real-time translation
      let index = 0;
      const interval = setInterval(() => {
        if (index < mockSegments.length) {
          setSegments((prev) => [...prev, mockSegments[index]]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 3000);
      
      // Store interval ID for cleanup
      (window as any).translationInterval = interval;
    } else {
      setIsRecording(false);
      if ((window as any).translationInterval) {
        clearInterval((window as any).translationInterval);
      }
      toast.success('已停止实时翻译');
    }
  };

  const playOriginalAudio = (segmentId: string) => {
    toast.success('播放原始语音');
  };

  const playTranslatedAudio = (segmentId: string) => {
    toast.success('播放翻译语音');
  };

  const clearTranscript = () => {
    setSegments([]);
    toast.success('已清空记录');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Settings Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">说话人数：</span>
            <Select value={speakerCount} onValueChange={setSpeakerCount}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 人</SelectItem>
                <SelectItem value="3">3 人</SelectItem>
                <SelectItem value="4">4 人</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Settings className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">翻译为：</span>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="普通话">普通话</SelectItem>
                <SelectItem value="英语">英语</SelectItem>
                <SelectItem value="粤语">粤语</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Translation Display */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {segments.length === 0 && !isRecording && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <Mic className="w-16 h-16 mb-4 text-gray-300" />
            <p>点击下方按钮开始实时翻译</p>
            <p className="text-sm mt-2">系统将自动识别说话人并实时翻译</p>
          </div>
        )}

        {segments.map((segment) => (
          <Card
            key={segment.id}
            className={`${
              segment.speaker === 'A' ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'
            }`}
          >
            <CardContent className="pt-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={segment.speaker === 'A' ? 'border-blue-400 text-blue-700' : 'border-green-400 text-green-700'}
                  >
                    说话人 {segment.speaker}
                  </Badge>
                  <Badge variant="secondary">{segment.originalLanguage}</Badge>
                  <span className="text-xs text-gray-500">{segment.timestamp}</span>
                </div>
              </div>

              {/* Original Text */}
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">原文</p>
                    <p className="font-medium">{segment.originalText}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => playOriginalAudio(segment.id)}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Translated Text */}
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">翻译</p>
                    <p>{segment.translatedText}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600"
                    onClick={() => playTranslatedAudio(segment.id)}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex flex-col items-center gap-3">
          {isRecording && (
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium">正在实时翻译...</span>
            </div>
          )}
          
          <div className="flex items-center gap-3 w-full">
            {segments.length > 0 && (
              <Button
                variant="outline"
                onClick={clearTranscript}
                disabled={isRecording}
              >
                清空
              </Button>
            )}
            <Button
              onClick={toggleRecording}
              className={`flex-1 gap-2 ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5" />
                  停止翻译
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  开始实时翻译
                </>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            支持多语混杂识别 • 自动区分说话人 • 实时字幕生成
          </p>
        </div>
      </div>
    </div>
  );
}
