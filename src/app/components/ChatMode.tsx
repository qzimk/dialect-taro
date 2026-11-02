import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, Copy, RefreshCw, Radio, Play, ChevronDown, ChevronUp, StopCircle, Paperclip, Trash2, History, Plus, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { SessionHistorySidebar } from './SessionHistorySidebar';

type Message = {
  id: string;
  type: 'user' | 'assistant' | 'realtime-session';
  text: string;
  language?: string;
  hasAudio?: boolean;
  timestamp: Date;
  sessionId?: string;
  sessionData?: RealtimeSession;
};

type RealtimeSession = {
  id: string;
  startTime: Date;
  endTime?: Date;
  speakers: SpeakerSegment[];
  status: 'active' | 'ended';
};

type SpeakerSegment = {
  id: string;
  speaker: string;
  text: string;
  translation: string;
  timestamp: Date;
  language: string;
  verticalPosition?: number;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
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

// 解析消息文本中的嵌入语音
const parseMessageContent = (text: string) => {
  const parts = [];
  const regex = /\[\[\s*语音\s*\|\s*([^\]]+)\s*\]\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      });
    }
    
    parts.push({
      type: 'audio',
      content: match[1].trim(),
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex),
    });
  }
  
  return parts.length > 0 ? parts : [{ type: 'text', content: text }];
};

// 格式化时间
const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
};

// 生成对话标题
const generateTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find(m => m.type === 'user');
  if (firstUserMessage) {
    return firstUserMessage.text.slice(0, 20) + (firstUserMessage.text.length > 20 ? '...' : '');
  }
  return '新对话';
};

export function ChatMode() {
  // 对话历史状态
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      title: '上海话学习',
      messages: [
        {
          id: '1',
          type: 'assistant',
          text: '你好！我是方言助手，支持多种方言和多语混杂识别。',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'conv-2',
      title: '粤语翻译练习',
      messages: [
        {
          id: '2',
          type: 'user',
          text: '靓仔，你好啊',
          language: '粤语',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('conv-1');
  
  // 获取当前对话
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const [messages, setMessages] = useState<Message[]>(currentConversation?.messages || [
    {
      id: '1',
      type: 'assistant',
      text: '你好！我是方言助手，支持多种方言和多语混杂识别。你可以用任何方言或语言跟我聊天。',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'assistant',
      text: '侬这个字发[[ 语音 | 5" ]]的音，上海话里很常见。',
      hasAudio: true,
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('普通话');
  const [isRecording, setIsRecording] = useState(false);
  
  // 实时翻译状态
  const [isRealtimeOpen, setIsRealtimeOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<RealtimeSession | null>(null);
  const [realtimeSpeakers, setRealtimeSpeakers] = useState<SpeakerSegment[]>([]);
  const [displayMode, setDisplayMode] = useState<'merged' | 'separated'>('merged');
  const [isRecordingRealtime, setIsRecordingRealtime] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<RealtimeSession[]>([]);
  const [isHistoryViewOpen, setIsHistoryViewOpen] = useState(false);
  const [realtimePanelHeight, setRealtimePanelHeight] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartHeight, setDragStartHeight] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const realtimeEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isRealtimeOpen) {
      realtimeEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [realtimeSpeakers, isRealtimeOpen]);

  // 更新当前对话的消息
  useEffect(() => {
    if (currentConversationId) {
      const conv = conversations.find(c => c.id === currentConversationId);
      if (conv) {
        setMessages(conv.messages);
      }
    }
  }, [currentConversationId, conversations]);

  // 保存消息到当前对话
  const saveMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId
        ? { 
            ...conv, 
            messages: newMessages,
            updatedAt: new Date(),
            title: generateTitle(newMessages)
          }
        : conv
    ));
  };

  // 新建对话
  const createNewConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: '新对话',
      messages: [
        {
          id: `${Date.now()}`,
          type: 'assistant',
          text: '你好！我是方言助手，支持多种方言和多语混杂识别。你可以用任何方言或语言跟我聊天。',
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
    setIsHistoryOpen(false);
    toast.success('已创建新对话');
  };

  // 切换对话
  const switchConversation = (convId: string) => {
    setCurrentConversationId(convId);
    setIsHistoryOpen(false);
    toast.success('已切换对话');
  };

  // 删除对话
  const deleteConversation = (convId: string) => {
    if (conversations.length === 1) {
      toast.error('至少需要保留一个对话');
      return;
    }
    
    setConversations(prev => prev.filter(c => c.id !== convId));
    
    if (convId === currentConversationId) {
      const remaining = conversations.filter(c => c.id !== convId);
      setCurrentConversationId(remaining[0].id);
    }
    
    toast.success('已删除对话');
  };

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

    const newMessages = [...messages, userMessage];
    saveMessages(newMessages);
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
      saveMessages([...newMessages, assistantMessage]);
    }, 500);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success('开始录音...');
      setTimeout(() => {
        setIsRecording(false);
        setInput('这个事情我真的是hold不住了（模拟语音输入）');
        toast.success('语音识别完成');
      }, 2000);
    }
  };

  const toggleRealtimeTranslation = (checked: boolean) => {
    if (!currentSession) {
      toast.error('请先创建实时翻译会话');
      return;
    }
    
    setIsRecordingRealtime(checked);
    
    if (checked) {
      toast.success('开始实时录音');
      simulateRealtimeInput();
    } else {
      toast.success('停止实时录音');
    }
  };

  // 创建新会话
  const createRealtimeSession = () => {
    const newSession: RealtimeSession = {
      id: `session-${Date.now()}`,
      startTime: new Date(),
      speakers: [],
      status: 'active',
    };
    
    setCurrentSession(newSession);
    setRealtimeSpeakers([]);
    
    // 在聊天中添加会话创建气泡
    const sessionMessage: Message = {
      id: `session-msg-${newSession.id}`,
      type: 'realtime-session',
      text: `实时翻译会话 - 进行中`,
      timestamp: new Date(),
      sessionId: newSession.id,
      sessionData: newSession,
    };
    
    saveMessages([...messages, sessionMessage]);
    
    toast.success('已创建实时翻译会话');
  };

  // 结束当前会话
  const endRealtimeSession = () => {
    if (!currentSession) return;
    
    if (isRecordingRealtime) {
      setIsRecordingRealtime(false);
    }

    setIsHistoryViewOpen(false);

    const endedSession: RealtimeSession = {
      ...currentSession,
      endTime: new Date(),
      speakers: realtimeSpeakers,
      status: 'ended',
    };

    // 保存到历史记录
    setSessionHistory(prev => [endedSession, ...prev]);
    
    // 更新聊天消息中的会话气泡
    const updatedMessages = messages.map(msg => 
      msg.sessionId === currentSession.id
        ? {
            ...msg,
            text: `实时翻译会话 - 已结束 · ${endedSession.speakers.length} 条记录`,
            sessionData: endedSession,
          }
        : msg
    );
    
    saveMessages(updatedMessages);
    
    setCurrentSession(null);
    setRealtimeSpeakers([]);
    toast.success(`会话已结束，共记录 ${realtimeSpeakers.length} 条内容`);
  };

  // 删除历史会话
  const deleteHistorySession = (sessionId: string) => {
    setSessionHistory(prev => prev.filter(s => s.id !== sessionId));
    toast.success('已删除会话');
  };

  const simulateRealtimeInput = () => {
    const mockDialogues = [
      { speaker: 'A', text: '侬好啊，今朝天气老好个！', language: '上海话' },
      { speaker: 'B', text: 'Hello! Yes, the weather is nice.', language: '英语' },
      { speaker: 'A', text: '阿拉一道去公园耍耍伐？', language: '上海话' },
      { speaker: 'B', text: 'Sure! Sounds like a great idea.', language: '英语' },
      { speaker: 'C', text: '我也想去！', language: '普通话' },
    ];

    mockDialogues.forEach((dialogue, index) => {
      setTimeout(() => {
        const verticalPos = Math.random() * 80 + 10;
        const segment: SpeakerSegment = {
          id: `segment-${Date.now()}-${index}`,
          speaker: dialogue.speaker,
          text: dialogue.text,
          translation: mockTranslate(dialogue.text, '普通话'),
          timestamp: new Date(),
          language: dialogue.language,
          verticalPosition: verticalPos,
        };
        
        setRealtimeSpeakers((prev) => [...prev, segment]);
      }, (index + 1) * 2000);
    });
  };

  const playAudio = (messageId: string) => {
    toast.success('播放语音');
  };

  const playInlineAudio = (duration: string) => {
    toast.success(`播放嵌入语音 (${duration})`);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('已复制到剪贴板');
  };

  const retranslate = (text: string) => {
    toast.success('重新翻译中...');
  };

  const viewSessionDetail = (sessionData: RealtimeSession) => {
    if (currentSession) {
      toast.error('请先结束当前会话');
      return;
    }
    
    setCurrentSession(sessionData);
    setRealtimeSpeakers(sessionData.speakers);
    setIsRealtimeOpen(true);
    
    toast.success('已进入会话编辑模式，可继续录音');
  };

  const deleteSession = (sessionId: string) => {
    const updatedMessages = messages.filter((msg) => msg.id !== sessionId);
    saveMessages(updatedMessages);
    toast.success('已删除会话记录');
  };

  // 拖拽调整面板高度
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newHeight = dragStartHeight - dragStartY + e.clientY;
      const clampedHeight = Math.max(150, Math.min(600, newHeight));
      setRealtimePanelHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, dragStartY, dragStartHeight]);

  return (
    <div className="flex h-full relative">
      {/* History Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-10 ${
          isHistoryOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full w-64">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">历史记录</h2>
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="收起侧边栏"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* New Conversation Button */}
          <div className="p-3 border-b border-gray-200">
            <button
              onClick={createNewConversation}
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
                  onClick={() => switchConversation(conv.id)}
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
                  
                  {conversations.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
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

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between gap-4">
            {/* Left: History Button */}
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={`flex items-center gap-2 bg-white border border-gray-200 px-3.5 py-2 hover:border-gray-300 hover:shadow-sm transition-all duration-300 ${
                isHistoryOpen 
                  ? 'rounded-l-xl rounded-r-none border-r-0' 
                  : 'rounded-xl'
              }`}
            >
              {isHistoryOpen ? (
                <ChevronLeft className="w-4 h-4 text-blue-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-blue-400" />
              )}
              <History className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">历史</span>
            </button>

            {/* Center: Language Selector */}
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
            
            {/* Right: Realtime Toggle */}
            <button
              onClick={() => setIsRealtimeOpen(!isRealtimeOpen)}
              className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Radio className={`w-4 h-4 ${currentSession ? 'text-purple-600' : 'text-gray-700'}`} />
              <span className="text-sm text-gray-700">实时翻译</span>
              {isRealtimeOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>

          {/* Realtime Translation Window */}
          {isRealtimeOpen && (
            <div className="relative border-t border-gray-200 bg-gradient-to-b from-purple-50 to-white">
              <div 
                className="px-4 py-3" 
                style={{ height: `${realtimePanelHeight}px` }}
              >
                {/* Control Bar */}
                <div className="flex items-center justify-between mb-3">
                  {/* Left: Session Controls */}
                  <div className="flex items-center gap-2">
                    {currentSession && (
                      <button
                        onClick={() => setIsHistoryViewOpen(!isHistoryViewOpen)}
                        className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
                          isHistoryViewOpen
                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <History className={`w-4 h-4 ${isHistoryViewOpen ? 'text-purple-600' : 'text-gray-500'}`} />
                        <span>{isHistoryViewOpen ? '收起历史' : '展开历史'} ({sessionHistory.length})</span>
                        {isHistoryViewOpen ? (
                          <ChevronRight className="w-3.5 h-3.5 text-purple-500 ml-0.5" />
                        ) : (
                          <ChevronLeft className="w-3.5 h-3.5 text-gray-500 ml-0.5" />
                        )}
                      </button>
                    )}
                    
                    {currentSession ? (
                      <button
                        onClick={endRealtimeSession}
                        className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        <StopCircle className="w-4 h-4" />
                        结束会话
                      </button>
                    ) : (
                      <button
                        onClick={createRealtimeSession}
                        className="flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        创建会话
                      </button>
                    )}
                  </div>
                  
                  {/* Center: Display Mode Selector */}
                  {currentSession && (
                    <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                      <button
                        onClick={() => setDisplayMode('merged')}
                        className={`px-4 py-1.5 text-sm rounded-md transition-colors font-medium ${
                          displayMode === 'merged'
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        合并模式
                      </button>
                      <button
                        onClick={() => setDisplayMode('separated')}
                        className={`px-4 py-1.5 text-sm rounded-md transition-colors font-medium ${
                          displayMode === 'separated'
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        弹幕模式
                      </button>
                    </div>
                  )}
                  
                  {/* Right: Recording Control */}
                  {currentSession && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {isRecordingRealtime ? (
                          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-red-700">录音中</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 font-medium">未录音</span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => toggleRealtimeTranslation(!isRecordingRealtime)}
                        className={`relative inline-flex h-9 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                          isRecordingRealtime ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform ${
                            isRecordingRealtime ? 'translate-x-8' : 'translate-x-1'
                          }`}
                        >
                          <Mic className={`w-4 h-4 m-1.5 ${isRecordingRealtime ? 'text-red-500' : 'text-gray-400'}`} />
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div style={{ height: `${realtimePanelHeight - 60}px` }} className="relative flex gap-0">
                  <div className={`transition-all duration-300 ${isHistoryViewOpen && sessionHistory.length > 0 ? 'flex-1' : 'w-full'}`}>
                    {currentSession ? (
                      displayMode === 'merged' ? (
                        <div className="grid grid-cols-2 gap-3 h-full">
                          <div className="bg-white rounded-lg border border-purple-100 p-3 overflow-y-auto">
                            <h4 className="text-xs font-medium text-purple-700 mb-2">原文</h4>
                            <div className="text-sm text-gray-900 leading-relaxed">
                              {realtimeSpeakers.length > 0 ? (
                                <>
                                  {realtimeSpeakers.map((segment, index) => (
                                    <span key={segment.id}>
                                      {segment.text}
                                      {index < realtimeSpeakers.length - 1 && ' '}
                                    </span>
                                  ))}
                                  <div ref={realtimeEndRef} />
                                </>
                              ) : (
                                <p className="text-xs text-gray-400 italic">等待录音内容...</p>
                              )}
                            </div>
                          </div>

                          <div className="bg-white rounded-lg border border-purple-100 p-3 overflow-y-auto">
                            <h4 className="text-xs font-medium text-purple-700 mb-2">翻译</h4>
                            <div className="text-sm text-gray-900 leading-relaxed">
                              {realtimeSpeakers.length > 0 ? (
                                realtimeSpeakers.map((segment, index) => (
                                  <span key={segment.id}>
                                    {segment.translation}
                                    {index < realtimeSpeakers.length - 1 && ' '}
                                  </span>
                                ))
                              ) : (
                                <p className="text-xs text-gray-400 italic">等待翻译内容...</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative h-full bg-white rounded-lg border border-purple-100 overflow-hidden">
                          <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-500 z-10 shadow-lg"></div>
                          <div className="absolute inset-0 pr-4">
                            {realtimeSpeakers.length > 0 ? (
                              realtimeSpeakers.map((segment) => {
                                const elapsedTime = Date.now() - segment.timestamp.getTime();
                                const maxDuration = 10000;
                                const progress = Math.min(elapsedTime / maxDuration, 1);
                                const width = `${progress * 80 + 20}%`;
                                
                                return (
                                  <div
                                    key={segment.id}
                                    className="absolute right-4 transition-all duration-300 ease-out"
                                    style={{
                                      top: `${segment.verticalPosition}%`,
                                      width: width,
                                      transform: 'translateY(-50%)',
                                    }}
                                  >
                                    <div className="bg-gradient-to-l from-purple-100 to-purple-50 border border-purple-200 rounded-lg p-2 shadow-md">
                                      <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                          segment.speaker === 'A' ? 'bg-blue-500 text-white' :
                                          segment.speaker === 'B' ? 'bg-green-500 text-white' :
                                          'bg-orange-500 text-white'
                                        }`}>
                                          {segment.speaker}
                                        </div>
                                        <span className="text-xs text-gray-600">{segment.language}</span>
                                      </div>
                                      <p className="text-sm text-gray-900 mb-1">{segment.text}</p>
                                      <p className="text-xs text-gray-600">→ {segment.translation}</p>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-gray-400 italic">等待录音内容...</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <History className="w-10 h-10 mb-3 opacity-50 text-gray-400" />
                        <p className="text-sm font-medium mb-1 text-gray-700">点击"创建会话"开始实时翻译</p>
                        <p className="text-xs text-gray-500">录音内容将实时显示在这里</p>
                      </div>
                    )}
                  </div>
                  
                  <SessionHistorySidebar
                    isOpen={isHistoryViewOpen}
                    sessions={sessionHistory}
                    onClose={() => setIsHistoryViewOpen(false)}
                    onViewSession={viewSessionDetail}
                    onDeleteSession={deleteHistorySession}
                  />
                </div>
              </div>
              
              {/* Resize Handle */}
              <div
                onMouseDown={(e) => {
                  setIsResizing(true);
                  setDragStartY(e.clientY);
                  setDragStartHeight(realtimePanelHeight);
                }}
                className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-purple-300 transition-colors z-20 group"
                title="拖拽调整高度"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-gray-300 rounded-full group-hover:bg-purple-400 transition-colors" />
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => {
            if (message.type === 'realtime-session') {
              return (
                <div key={message.id} className="flex justify-center group">
                  <div className="relative">
                    <button
                      onClick={() => message.sessionData && viewSessionDetail(message.sessionData)}
                      className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 hover:bg-purple-100 transition-colors"
                    >
                      <Radio className="w-4 h-4 text-purple-600" />
                      <div className="text-sm">
                        <span className="font-medium text-purple-900">实时翻译会话</span>
                        <span className="text-purple-600 ml-2">
                          {message.sessionData?.status === 'active' ? '进行中' : '已结束'}
                        </span>
                      </div>
                      {message.sessionData?.status === 'ended' && (
                        <span className="text-xs text-purple-600">
                          {message.sessionData.speakers.length} 条记录
                        </span>
                      )}
                    </button>
                    
                    <button
                      onClick={() => deleteSession(message.id)}
                      className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-300"
                      title="删除会话"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className={`flex flex-col gap-1.5 ${message.type === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {message.language && (
                    <div className="text-xs mb-2 flex items-center gap-1">
                      <span className={`px-2 py-0.5 rounded-full ${
                        message.type === 'user' 
                          ? 'bg-blue-900 bg-opacity-60 text-white' 
                          : 'bg-gray-700 text-white'
                      }`}>
                        {message.language}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-1">
                    {parseMessageContent(message.text).map((part, index) => {
                      if (part.type === 'text') {
                        return <span key={index}>{part.content}</span>;
                      } else {
                        return (
                          <button
                            key={index}
                            onClick={() => playInlineAudio(part.content)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                              message.type === 'user'
                                ? 'bg-white bg-opacity-20 hover:bg-opacity-30'
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                            }`}
                            title="点击播放语音"
                          >
                            <Play className="w-3 h-3" />
                            <span className="text-xs">{part.content}</span>
                          </button>
                        );
                      }
                    })}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 px-2">
                  {message.hasAudio && (
                    <button
                      onClick={() => playAudio(message.id)}
                      className="p-1.5 rounded-full transition-colors hover:bg-gray-200"
                      title="播放完整语音"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  )}
                  <button
                    onClick={() => copyText(message.text)}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-200"
                    title="复制文本"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  {message.type === 'user' && (
                    <button
                      onClick={() => retranslate(message.text)}
                      className="p-1.5 rounded-full transition-colors hover:bg-gray-200"
                      title="重新翻译"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 pb-safe">
          <div className="flex items-center gap-2">
            <Button
              variant={isRecording ? 'default' : 'outline'}
              size="icon"
              onClick={handleVoiceInput}
              className={isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}
              title="语音输入"
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toast.success('选择附件...')}
              title="添加附件"
            >
              <Paperclip className="w-5 h-5" />
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
    </div>
  );
}
