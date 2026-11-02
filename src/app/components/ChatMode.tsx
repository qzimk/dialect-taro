import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, Copy, RefreshCw, Radio, Play, ChevronDown, ChevronUp, StopCircle, Paperclip, Trash2, History, Plus, MessageSquare, ChevronLeft, ChevronRight, BookmarkPlus } from 'lucide-react';
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

type RealtimeSession = {
  id: string;
  name: string;
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
  return `${text}（翻译为${targetLang}）`;
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
  // ========== 实时翻译状态 ==========
  const [isRealtimeExpanded, setIsRealtimeExpanded] = useState(false);
  const [realtimeHeight, setRealtimeHeight] = useState(300);
  const [currentSession, setCurrentSession] = useState<RealtimeSession | null>(null);
  const [realtimeSpeakers, setRealtimeSpeakers] = useState<SpeakerSegment[]>([]);
  const [displayMode, setDisplayMode] = useState<'merged' | 'separated'>('merged');
  const [isRecordingRealtime, setIsRecordingRealtime] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<RealtimeSession[]>([]);
  const [isRealtimeHistoryOpen, setIsRealtimeHistoryOpen] = useState(false);
  
  // ========== 对话状态 ==========
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
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
  ]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('conv-1');
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const [messages, setMessages] = useState<Message[]>(currentConversation?.messages || []);
  const [input, setInput] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('普通话');
  const [isRecording, setIsRecording] = useState(false);
  
  // ========== 拖拽调整 ==========
  const [isResizing, setIsResizing] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartHeight, setDragStartHeight] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const realtimeEndRef = useRef<HTMLDivElement>(null);

  // ========== Effects ==========
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    realtimeEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [realtimeSpeakers]);

  useEffect(() => {
    if (currentConversationId) {
      const conv = conversations.find(c => c.id === currentConversationId);
      if (conv) {
        setMessages(conv.messages);
      }
    }
  }, [currentConversationId, conversations]);

  // 拖拽调整高度
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newHeight = dragStartHeight + (e.clientY - dragStartY);
      const clampedHeight = Math.max(150, Math.min(500, newHeight));
      setRealtimeHeight(clampedHeight);
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

  // ========== 对话相关函数 ==========
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

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: '新对话',
      messages: [
        {
          id: `${Date.now()}`,
          type: 'assistant',
          text: '你好！我是方言助手，支持多种方言和多语混杂识别。',
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
    setIsChatHistoryOpen(false);
    toast.success('已创建新对话');
  };

  const switchConversation = (convId: string) => {
    setCurrentConversationId(convId);
    setIsChatHistoryOpen(false);
    toast.success('已切换对话');
  };

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

  // ========== 实时翻译相关函数 ==========
  const createRealtimeSession = () => {
    const sessionName = `会话 ${new Date().toLocaleString('zh-CN', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`; 
    
    const newSession: RealtimeSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      name: sessionName,
      startTime: new Date(),
      speakers: [],
      status: 'active',
    };
    
    setCurrentSession(newSession);
    setRealtimeSpeakers([]);
    
    if (!isRealtimeExpanded) {
      setIsRealtimeExpanded(true);
    }
    
    // 自动打开麦克风
    setIsRecordingRealtime(true);
    toast.success('已创建实时翻译会话并开启麦克风');
    simulateRealtimeInput();
  };

  const endRealtimeSession = () => {
    if (!currentSession) return;
    
    if (isRecordingRealtime) {
      setIsRecordingRealtime(false);
    }

    const endedSession: RealtimeSession = {
      ...currentSession,
      endTime: new Date(),
      speakers: realtimeSpeakers,
      status: 'ended',
    };

    const isEditingExisting = sessionHistory.some(s => s.id === currentSession.id);
    
    if (isEditingExisting) {
      setSessionHistory(prev => prev.map(s => 
        s.id === currentSession.id ? endedSession : s
      ));
      toast.success(`会话已更新，共记录 ${realtimeSpeakers.length} 条内容`);
    } else {
      setSessionHistory(prev => [endedSession, ...prev]);
      toast.success(`会话已结束，共记录 ${realtimeSpeakers.length} 条内容`);
    }
    
    setCurrentSession(null);
    setRealtimeSpeakers([]);
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
          id: `segment-${Date.now()}-${Math.random().toString(36).slice(2, 11)}-${index}`,
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

  const deleteHistorySession = (sessionId: string) => {
    setSessionHistory(prev => prev.filter(s => s.id !== sessionId));
    toast.success('已删除会话');
  };

  const viewSessionDetail = (sessionData: RealtimeSession) => {
    if (currentSession) {
      toast.error('请先结束当前会话');
      return;
    }
    
    setCurrentSession(sessionData);
    setRealtimeSpeakers(sessionData.speakers);
    setIsRealtimeHistoryOpen(false);
    
    if (!isRealtimeExpanded) {
      setIsRealtimeExpanded(true);
    }
    
    toast.success('已进入会话编辑模式，可继续录音');
  };

  const saveSegmentToNotebook = (segment: SpeakerSegment) => {
    const existing = localStorage.getItem('favoriteRecords');
    const records = existing ? JSON.parse(existing) : [];
    const newRecord = {
      id: `notebook-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text: segment.text,
      translation: segment.translation,
      language: segment.language,
      speaker: segment.speaker,
      mode: 'live' as const,
      timestamp: new Date().toISOString(),
    };
    records.unshift(newRecord);
    localStorage.setItem('favoriteRecords', JSON.stringify(records));
    toast.success('已保存到收藏');
  };

  const saveMessageToNotebook = (message: Message) => {
    const existing = localStorage.getItem('chatRecords');
    const records = existing ? JSON.parse(existing) : [];
    const newRecord = {
      id: `notebook-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text: message.text,
      language: message.language,
      mode: 'chat' as const,
      role: message.type as 'user' | 'assistant',
      timestamp: new Date().toISOString(),
      hasAudio: message.hasAudio,
    };
    records.unshift(newRecord);
    localStorage.setItem('chatRecords', JSON.stringify(records));
    toast.success('已保存到记录本');
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

  return (
    <div className="flex flex-col h-full">
      {/* ========== 上半部分：实时翻译区域 ========== */}
      <div 
        className={`flex-shrink-0 border-b-2 border-purple-300 bg-gradient-to-b from-purple-50 to-purple-100 relative ${
          isRealtimeExpanded ? '' : 'h-auto'
        }`}
        style={isRealtimeExpanded ? { height: `${realtimeHeight}px` } : {}}
      >
        {isRealtimeExpanded ? (
          <div className="h-full flex overflow-hidden">
            {/* 左侧：会话历史侧边栏 */}
            <div
              className={`bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ${
                isRealtimeHistoryOpen ? 'w-64' : 'w-0'
              } overflow-hidden`}
            >
              <div className="w-64 h-full flex flex-col">
                <div className="flex items-center justify-between p-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">历史会话</h3>
                  <button
                    onClick={() => setIsRealtimeHistoryOpen(false)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {sessionHistory.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => viewSessionDetail(session)}
                      className="group bg-purple-50 border border-purple-200 rounded-lg p-2 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-xs font-semibold text-gray-900 truncate flex-1">
                          {session.name}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHistorySession(session.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                      <p className="text-xs text-purple-600 font-medium">
                        {session.speakers.length} 条记录
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧：实时翻译主区域 */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              {/* 实时翻译顶部栏 */}
              <div className="flex items-center px-4 py-3 border-b border-purple-200/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  {!isRealtimeHistoryOpen && (
                    <>
                      <button
                        onClick={() => setIsRealtimeHistoryOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-purple-200 rounded-lg transition-all"
                      >
                        <ChevronRight className="w-4 h-4" />
                        会话历史
                      </button>
                      
                      <div className="w-px h-4 bg-purple-300"></div>
                    </>
                  )}
                  
                  {currentSession && (
                    <>
                      <button
                        onClick={() => toggleRealtimeTranslation(!isRecordingRealtime)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                          isRecordingRealtime
                            ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        <Mic className={`w-4 h-4 ${isRecordingRealtime ? 'animate-pulse' : ''}`} />
                        {isRecordingRealtime ? '录音中' : '开启麦克风'}
                      </button>
                      
                      <div className="w-px h-4 bg-purple-300"></div>
                    </>
                  )}
                  
                  <button
                    onClick={currentSession ? endRealtimeSession : createRealtimeSession}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      currentSession
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        : 'bg-purple-500 text-white hover:bg-purple-600 shadow-sm font-semibold'
                    }`}
                  >
                    {currentSession ? '结束会话' : '创建会话'}
                  </button>
                </div>
                
                <div className="flex-1 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setDisplayMode('merged')}
                    disabled={!currentSession}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      !currentSession
                        ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                        : displayMode === 'merged' 
                        ? 'bg-purple-500 text-white shadow-sm font-semibold' 
                        : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                    }`}
                  >
                    合并模式
                  </button>
                  <button
                    onClick={() => setDisplayMode('separated')}
                    disabled={!currentSession}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      !currentSession
                        ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                        : displayMode === 'separated' 
                        ? 'bg-purple-500 text-white shadow-sm font-semibold' 
                        : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                    }`}
                  >
                    弹幕模式
                  </button>
                </div>
                
                <button
                  onClick={() => setIsRealtimeExpanded(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-purple-200 rounded-lg transition-all"
                >
                  <Radio className="w-4 h-4" />
                  实时翻译
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>

              {/* 实时翻译内容区域 */}
              <div className="flex-1 overflow-hidden">
                {currentSession ? (
                  displayMode === 'merged' ? (
                    <div className="h-full overflow-y-auto p-3 space-y-2">
                      {realtimeSpeakers.length > 0 ? (
                        <>
                          {realtimeSpeakers.map((segment) => (
                            <div
                              key={segment.id}
                              className="group flex items-start gap-2 bg-white rounded-lg border border-purple-100 p-2 hover:border-purple-300"
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                segment.speaker === 'A' ? 'bg-blue-500 text-white' :
                                segment.speaker === 'B' ? 'bg-green-500 text-white' :
                                'bg-orange-500 text-white'
                              }`}>
                                {segment.speaker}
                              </div>

                              <div className="flex-1 grid grid-cols-2 gap-2 min-w-0">
                                <div>
                                  <span className="text-xs text-purple-500 font-medium block mb-0.5">{segment.language}</span>
                                  <p className="text-sm text-gray-900">{segment.text}</p>
                                </div>
                                <div className="border-l border-purple-100 pl-2">
                                  <span className="text-xs text-gray-400 font-medium block mb-0.5">翻译</span>
                                  <p className="text-sm text-gray-600">{segment.translation}</p>
                                </div>
                              </div>

                              <button
                                onClick={() => saveSegmentToNotebook(segment)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-purple-100 flex-shrink-0"
                              >
                                <BookmarkPlus className="w-3.5 h-3.5 text-purple-500" />
                              </button>
                            </div>
                          ))}
                          <div ref={realtimeEndRef} />
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-sm text-gray-400">等待录音内容...</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-full bg-white overflow-hidden">
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-500 z-10"></div>
                      <div className="absolute inset-0 pr-4">
                        {realtimeSpeakers.map((segment) => (
                          <div
                            key={segment.id}
                            className="absolute right-4 group"
                            style={{
                              top: `${segment.verticalPosition}%`,
                              transform: 'translateY(-50%)',
                            }}
                          >
                            <div className="bg-purple-100 border border-purple-200 rounded-lg p-2 shadow-md">
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
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Radio className="w-12 h-12 mb-3 text-purple-400" />
                    <p className="text-base font-semibold mb-2">开始实时翻译</p>
                    <p className="text-sm text-gray-600 text-center max-w-md">
                      点击"创建会话"开始实时识别多人对话
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* 收起状态的精简顶部栏 */
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-purple-200/50">
            <div className="flex items-center gap-3">
              <button
                disabled
                className="px-3 py-1.5 text-sm font-medium text-gray-400 cursor-not-allowed bg-gray-100 rounded-lg"
              >
                会话历史
              </button>
              
              <div className="w-px h-4 bg-purple-300"></div>
              
              {currentSession && (
                <>
                  <button
                    onClick={() => toggleRealtimeTranslation(!isRecordingRealtime)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      isRecordingRealtime
                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    <Mic className={`w-4 h-4 ${isRecordingRealtime ? 'animate-pulse' : ''}`} />
                    {isRecordingRealtime ? '录音中' : '开启麦克风'}
                  </button>
                  
                  <div className="w-px h-4 bg-purple-300"></div>
                </>
              )}
              
              <button
                onClick={currentSession ? endRealtimeSession : createRealtimeSession}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  currentSession
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'bg-purple-500 text-white hover:bg-purple-600 shadow-sm font-semibold'
                }`}
              >
                {currentSession ? '结束会话' : '创建会话'}
              </button>
            </div>
            
            <button
              onClick={() => setIsRealtimeExpanded(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-purple-200 rounded-lg transition-all"
            >
              <Radio className="w-4 h-4" />
              实时翻译
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 拖拽分隔条（仅展开时显示） */}
        {isRealtimeExpanded && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
              setDragStartY(e.clientY);
              setDragStartHeight(realtimeHeight);
            }}
            className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize hover:bg-purple-300 hover:bg-opacity-50 transition-colors z-20 group"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1.5 bg-purple-400 rounded-full group-hover:bg-purple-600 transition-all" />
          </div>
        )}
      </div>

      {/* ========== 下半部分：对话区域 ========== */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：对话历史侧边栏 */}
        <div
          className={`border-r border-gray-200 bg-white transition-all duration-300 ${
            isChatHistoryOpen ? 'w-64' : 'w-0'
          } overflow-hidden flex-shrink-0`}
        >
          <div className="w-64 h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">对话历史</h2>
              <button
                onClick={() => setIsChatHistoryOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-3 border-b border-gray-200">
              <button
                onClick={createNewConversation}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">新建对话</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
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
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-600" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：对话主区域 */}
        <div className="flex-1 flex flex-col">
          {/* 对话顶部栏 */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center flex-shrink-0">
            {!isChatHistoryOpen ? (
              <button
                onClick={() => setIsChatHistoryOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ChevronRight className="w-4 h-4" />
                对话历史
              </button>
            ) : (
              <div className="w-[100px]"></div>
            )}

            <div className="flex-1 flex items-center justify-center gap-2">
              <span className="text-sm text-gray-600">回复语言:</span>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="w-[120px] h-8 text-sm">
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

            <Volume2 className="w-5 h-5 text-gray-500" />
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
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
                    <div className="text-xs mb-2">
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
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
                              message.type === 'user'
                                ? 'bg-white bg-opacity-20 hover:bg-opacity-30'
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                            }`}
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
                      className="p-1.5 rounded-full hover:bg-gray-200"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  )}
                  <button
                    onClick={() => copyText(message.text)}
                    className="p-1.5 rounded-full hover:bg-gray-200"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  {message.type === 'user' && (
                    <button
                      onClick={() => retranslate(message.text)}
                      className="p-1.5 rounded-full hover:bg-gray-200"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  )}
                  <button
                    onClick={() => saveMessageToNotebook(message)}
                    className="p-1.5 rounded-full hover:bg-gray-200"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Button
                variant={isRecording ? 'default' : 'outline'}
                size="icon"
                onClick={handleVoiceInput}
                className={isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toast.success('选择附件...')}
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
    </div>
  );
}