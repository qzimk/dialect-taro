import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, Copy, RefreshCw, Languages } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

type Message = {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  language?: string;
  hasAudio?: boolean;
  timestamp: Date;
};

// Mock dialect detection
const detectDialect = (text: string): string => {
  if (text.includes('咋') || text.includes('嘎哈')) return '东北话';
  if (text.includes('嘛') || text.includes('靓仔')) return '粤语';
  if (text.includes('啥子') || text.includes('巴适')) return '四川话';
  if (text.includes('侬') || text.includes('阿拉')) return '上海话';
  return '普通话';
};

// Mock translation
const mockTranslate = (text: string, targetLang: string): string => {
  const responses: Record<string, string> = {
    '普通话': `${text}（已翻译为普通话）`,
    '粤语': `${text}（已翻译为粤语）`,
    '四川话': `${text}（已翻译为四川话）`,
    '英语': `${text} (Translated to English)`,
  };
  return responses[targetLang] || text;
};

export function ChatMode({ onAnalyzeDialect }: { onAnalyzeDialect: (text: string) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      text: '你好！我是方言助手，支持多种方言和多语混杂识别。你可以用任何方言或语言跟我聊天。',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('普通话');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const detectedDialect = detectDialect(input);
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      language: detectedDialect,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate assistant response
    setTimeout(() => {
      const response = mockTranslate(input, targetLanguage);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: `收到！检测到您使用的是${detectedDialect}。回复：${response}`,
        hasAudio: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success('开始录音...');
      // Simulate voice input
      setTimeout(() => {
        setIsRecording(false);
        setInput('这个事情我真的是hold不住了（模拟语音输入）');
        toast.success('语音识别完成');
      }, 2000);
    }
  };

  const playAudio = (messageId: string) => {
    toast.success('播放语音');
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('已复制到剪贴板');
  };

  const retranslate = (text: string) => {
    toast.success('重新翻译中...');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Language Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">回复语言：</span>
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="普通话">普通话</SelectItem>
              <SelectItem value="粤语">粤语</SelectItem>
              <SelectItem value="四川话">四川话</SelectItem>
              <SelectItem value="东北话">东北话</SelectItem>
              <SelectItem value="上海话">上海话</SelectItem>
              <SelectItem value="英语">英语</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                message.type === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {message.language && (
                <div className="text-xs mb-1 flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded-full ${
                    message.type === 'user' 
                      ? 'bg-blue-900 bg-opacity-60 text-white' 
                      : 'bg-gray-700 text-white'
                  }`}>
                    {message.language}
                  </span>
                </div>
              )}
              <p>{message.text}</p>
              
              {/* Message Actions */}
              <div className={`flex items-center gap-2 mt-2 pt-2 border-t ${
                message.type === 'user'
                  ? 'border-white border-opacity-20'
                  : 'border-gray-200'
              }`}>
                <button
                  onClick={() => onAnalyzeDialect(message.text)}
                  className={`p-1 rounded transition-colors ${
                    message.type === 'user'
                      ? 'hover:bg-white hover:bg-opacity-20'
                      : 'hover:bg-gray-100'
                  }`}
                  title="分析方言用法"
                >
                  <Languages className={`w-4 h-4 ${
                    message.type === 'user' ? 'text-white' : 'text-gray-600'
                  }`} />
                </button>
                {message.hasAudio && (
                  <button
                    onClick={() => playAudio(message.id)}
                    className={`p-1 rounded transition-colors ${
                      message.type === 'user'
                        ? 'hover:bg-white hover:bg-opacity-20'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Volume2 className={`w-4 h-4 ${
                      message.type === 'user' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </button>
                )}
                <button
                  onClick={() => copyText(message.text)}
                  className={`p-1 rounded transition-colors ${
                    message.type === 'user'
                      ? 'hover:bg-white hover:bg-opacity-20'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Copy className={`w-4 h-4 ${
                    message.type === 'user' ? 'text-white' : 'text-gray-600'
                  }`} />
                </button>
                {message.type === 'user' && (
                  <button
                    onClick={() => retranslate(message.text)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    title="重新翻译"
                  >
                    <RefreshCw className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant={isRecording ? 'default' : 'outline'}
            size="icon"
            onClick={handleVoiceInput}
            className={isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}
          >
            <Mic className="w-5 h-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息...支持方言和多语混杂"
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          提示：可以在普通话中混入方言词汇，或在方言中混入英文，系统会自动识别
        </p>
      </div>
    </div>
  );
}