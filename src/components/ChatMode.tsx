import { useState, useRef, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView, type ITouchEvent } from '@tarojs/components';
import { Send, Mic, Copy, RefreshCw, Radio, Play, Pause, Paperclip, Trash2, Plus, MessageSquare, ChevronLeft, ChevronRight, BookmarkPlus, Keyboard, Type, X, Maximize, Minimize } from './ui/icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from './ui/sonner';
import { useDeviceLayout } from '../utils/deviceTier';

type Message = {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  language?: string;
  hasAudio?: boolean;
  duration?: string;
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

type MessagePart = { type: 'text' | 'audio'; content: string };

// 解析消息文本中的嵌入语音
const parseMessageContent = (text: string): MessagePart[] => {
  const parts: MessagePart[] = [];
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

const formatDuration = (seconds: number): string => {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
};

const BOARD_DIVIDER_ID = 'board-divider';

// 波形条只按固定高度序列排布：真实音源仍是 mock，这里只为让「音频为主」的界面有可读的体量感。
const WAVE_HEIGHTS = [35, 62, 88, 48, 74, 30, 95, 55, 40, 80, 66, 28, 90, 50, 72, 38, 84, 44, 60, 32, 76, 52, 68, 26];

function Waveform({ color, playedColor, progress = -1, className = '' }: {
  color: string;
  playedColor: string;
  progress?: number;
  className?: string;
}) {
  const played = progress < 0 ? 0 : Math.round((progress / 100) * WAVE_HEIGHTS.length);
  return (
    <View className={`flex items-center gap-[2px] h-5 flex-1 min-w-0 overflow-hidden ${className}`}>
      {WAVE_HEIGHTS.map((height, index) => (
        <View
          key={index}
          className="w-[2px] flex-shrink-0 rounded-full"
          style={{
            height: `${height}%`,
            backgroundColor: index < played ? playedColor : color,
          }}
        />
      ))}
    </View>
  );
}

// 语音优先的消息气泡：播放器占主体，文字退为按需展开的辅助层。
function AudioPlayer({ duration, active, progress, onToggle, dark }: {
  duration: string;
  active: boolean;
  progress: number;
  onToggle: () => void;
  dark: boolean;
}) {
  return (
    <View className="flex items-center gap-2">
      <View
        onClick={onToggle}
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          dark ? 'bg-white bg-opacity-25' : 'bg-blue-600'
        }`}
      >
        {active
          ? <Pause size={14} color="#ffffff" />
          : <Play size={14} color="#ffffff" />}
      </View>
      <Waveform
        color={dark ? 'rgba(255,255,255,0.5)' : '#cbd5e1'}
        playedColor={dark ? '#ffffff' : '#2563eb'}
        progress={active ? progress : -1}
      />
      <Text className={`block text-xs flex-shrink-0 ${dark ? 'text-white' : 'text-gray-500'}`}>
        {duration}
      </Text>
    </View>
  );
}

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
  const { metrics } = useDeviceLayout();
  // ========== 实时翻译状态 ==========
  const [realtimeHeight, setRealtimeHeight] = useState(metrics.boardSplitHeight);
  // 两板三态：both=分庭抗礼（中间有分板），realtime/chat=独占聚焦该板；不存在两块全收起
  // 起手一律分庭：竖屏机型高度富裕（比例 >2 意味着 390 宽对 800+ 高），挤的是横向而非纵向，
  // 所以窄屏靠标题栏降级布局解决，不靠藏掉一块板。
  const [boardFocus, setBoardFocus] = useState<'both' | 'realtime' | 'chat'>('both');
  const isRealtimeExpanded = boardFocus !== 'chat';
  const isChatExpanded = boardFocus !== 'realtime';
  const isRealtimeFullscreen = boardFocus === 'realtime';
  const isChatFullscreen = boardFocus === 'chat';
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
  const [realtimeTargetLanguage, setRealtimeTargetLanguage] = useState('普通话');
  const [isRecording, setIsRecording] = useState(false);
  // 语音是主输入，文字输入退到次要模式，需要点键盘图标才展开
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  // 待发送的录音片段：停止录音先进输入栏叠加，点发送才统一发出
  const [draftClips, setDraftClips] = useState<{ id: string; seconds: number }[]>([]);
  const [recordSeconds, setRecordSeconds] = useState(0);

  // 音频为主：每条消息的文字层默认折叠，按需展开
  const [openTranscripts, setOpenTranscripts] = useState<Record<string, boolean>>({});
  const [playing, setPlaying] = useState<{ id: string; progress: number } | null>(null);

  // ========== 拖拽调整 ==========
  const [isResizing, setIsResizing] = useState(false);
  const heightRef = useRef(300);
  const dragRef = useRef({ active: false, y: 0, height: 0 });

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

  // 分板拖拽：小程序端由 View 的 touch 事件驱动。h5 桌面端浏览器不会把鼠标事件合成为 touch，
  // 而 Taro 的 ViewProps 里没有鼠标事件，所以 h5 只能在真实 DOM 上原生绑定 mousedown。
  const applyHeight = (next: number) => {
    const clamped = Math.max(180, Math.min(560, next));
    heightRef.current = clamped;
    setRealtimeHeight(clamped);
  };

  // 标题栏右上角的开关：点某块板的「全屏」即独占（另一板收起成标题栏），全屏态下同一位置变「还原」回到分庭抗礼。
  const toggleRealtimeBoard = () => setBoardFocus(boardFocus === 'realtime' ? 'both' : 'realtime');

  const toggleChatBoard = () => setBoardFocus(boardFocus === 'chat' ? 'both' : 'chat');

  const startResize = (clientY: number) => {
    if (!isRealtimeExpanded) return;
    dragRef.current = { active: true, y: clientY, height: heightRef.current };
    setIsResizing(true);
    if (process.env.TARO_ENV === 'h5') {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ns-resize';
    }
  };

  const moveResize = (clientY: number) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    applyHeight(drag.height + (clientY - drag.y));
  };

  const endResize = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsResizing(false);
    if (process.env.TARO_ENV === 'h5') {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  };

  useEffect(() => {
    if (process.env.TARO_ENV !== 'h5') return;
    const element = document.getElementById(BOARD_DIVIDER_ID);
    if (!element) return;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startResize(e.clientY);
    };
    const onMouseMove = (e: MouseEvent) => moveResize(e.clientY);
    const onMouseUp = () => endResize();

    element.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      element.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  // 依赖两板同展：分板只在 both 态渲染，焦点切换后要重新抓取节点挂监听
  }, [isRealtimeExpanded, isChatExpanded]);

  // 录音计时：语音是主输入，录音时长必须可见
  useEffect(() => {
    if (!isRecording) return;
    setRecordSeconds(0);
    const timer = setInterval(() => setRecordSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  // 模拟播放进度：音源仍是 mock，但进度推进让「音频为主」的操作有真实反馈
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setPlaying((prev) => (prev ? (prev.progress >= 100 ? null : { ...prev, progress: prev.progress + 2 }) : null));
    }, 100);
    return () => clearInterval(timer);
  }, [playing?.id]);

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

  // 对话板是和 AI 助手聊天，不做翻译改写；方言只作识别提示
  const pushAssistantReply = (detectedDialect: string, baseMessages: Message[]) => {
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: `收到！检测到您使用的是${detectedDialect}。请问还有什么可以帮您？`,
        hasAudio: true,
        duration: '0:06',
        timestamp: new Date(),
      };
      saveMessages([...baseMessages, assistantMessage]);
    }, 500);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text && draftClips.length === 0) {
      toast.success('输入文字或先录一段语音');
      return;
    }

    let newMessages = messages;
    let replySource = '';
    if (text) {
      const detectedDialect = detectDialect(text);
      newMessages = [...newMessages, {
        id: Date.now().toString(),
        type: 'user',
        text,
        language: detectedDialect,
        timestamp: new Date(),
      }];
      replySource = text;
    }
    if (draftClips.length > 0) {
      // 多段录音合成一条语音消息，时长取累加值
      const total = draftClips.reduce((sum, clip) => sum + clip.seconds, 0);
      const recognized = '这个事情我真的是hold不住了';
      newMessages = [...newMessages, {
        id: `${Date.now()}-voice`,
        type: 'user',
        text: `[[ 语音 | ${formatDuration(total)} ]]${recognized}`,
        language: detectDialect(recognized),
        hasAudio: true,
        duration: formatDuration(total),
        timestamp: new Date(),
      }];
      replySource = recognized;
    }

    saveMessages(newMessages);
    setInput('');
    setDraftClips([]);
    pushAssistantReply(detectDialect(replySource), newMessages);
  };

  // 主输入路径：短按开始录音，再点停止；片段进输入栏叠加，不立即发送
  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      const seconds = Math.max(1, recordSeconds);
      setDraftClips((prev) => [...prev, { id: `${Date.now()}`, seconds }]);
      toast.success(`已添加语音片段 ${formatDuration(seconds)}`);
      return;
    }
    setIsRecording(true);
  };

  const handleVoiceSend = () => {
    if (isRecording) {
      toast.success('先点麦克风停止录音');
      return;
    }
    handleSend();
  };

  const toggleTranscript = (messageId: string) => {
    setOpenTranscripts((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  };

  const togglePlay = (messageId: string) => {
    setPlaying((prev) => (prev?.id === messageId ? null : { id: messageId, progress: 0 }));
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
    
    if (boardFocus === 'chat') {
      setBoardFocus('both');
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
          translation: mockTranslate(dialogue.text, realtimeTargetLanguage),
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
    
    if (boardFocus === 'chat') {
      setBoardFocus('both');
    }
    
    toast.success('已进入会话编辑模式，可继续录音');
  };

  const saveSegmentToNotebook = (segment: SpeakerSegment) => {
    const existing = Taro.getStorageSync('favoriteRecords');
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
    Taro.setStorageSync('favoriteRecords', JSON.stringify(records));
    toast.success('已保存到收藏');
  };

  const saveMessageToNotebook = (message: Message) => {
    const existing = Taro.getStorageSync('chatRecords');
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
    Taro.setStorageSync('chatRecords', JSON.stringify(records));
    toast.success('已保存到记录本');
  };

  const copyText = (text: string) => {
    Taro.setClipboardData({ data: String(text) });
    toast.success('已复制到剪贴板');
  };

  const retranslate = () => {
    toast.success('重新翻译中...');
  };

  // 会话板的次级控件：宽屏跟在标题栏同一行末尾，窄屏整组挪到第二行，两处引用同一份 markup。
  const realtimeSecondary = (
    <View className="flex items-center gap-2 flex-shrink-0">
      <View className="flex items-center gap-1.5">
        <Text className="block text-xs text-gray-500 whitespace-nowrap">译入:</Text>
        <Select value={realtimeTargetLanguage} onValueChange={setRealtimeTargetLanguage}>
          <SelectTrigger className="w-28 h-8 text-xs">
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
      </View>

      {currentSession && (
        <View className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
          <View
            onClick={() => setDisplayMode('merged')}
            className={`px-3 py-1.5 text-xs font-medium ${
              displayMode === 'merged' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600'
            }`}
          >
            合并
          </View>
          <View className="w-px self-stretch bg-gray-200" />
          <View
            onClick={() => setDisplayMode('separated')}
            className={`px-3 py-1.5 text-xs font-medium ${
              displayMode === 'separated' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600'
            }`}
          >
            弹幕
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex flex-col h-full">
      {/* ========== 板块一：实时翻译（会话）；对话全屏时整板不渲染 ========== */}
      {isRealtimeExpanded && (
      <View
        className={`flex flex-col bg-white overflow-hidden ${
          isRealtimeExpanded && !isChatExpanded ? 'flex-1 min-h-0' : 'flex-shrink-0'
        }`}
        style={isRealtimeExpanded && isChatExpanded ? { height: `${realtimeHeight}px` } : {}}
      >
        {/* 板块标题栏：左侧标题兼任历史面板开关，右上角的开关负责全屏/还原。
            窄屏一排放不下：麦克风与全屏退成纯图标，译入和显示模式整组降到第二行。 */}
        <View className="bg-white border-b border-gray-200 flex-shrink-0">
          <View className={`flex items-center gap-2 px-3 ${metrics.compact ? 'h-11' : 'h-12'}`}>
            <View
              onClick={() => setIsRealtimeHistoryOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-100 flex-shrink-0 cursor-pointer"
            >
              <Radio size={13} color="#0d9488" />
              <Text className="block text-xs font-semibold text-teal-700">
                会话历史
              </Text>
              {isRealtimeHistoryOpen
                ? <ChevronLeft size={13} color="#9ca3af" />
                : <ChevronRight size={13} color="#9ca3af" />}
            </View>

            <View className="w-px h-4 bg-gray-200 flex-shrink-0" />

            {currentSession && (
              <View
                onClick={() => toggleRealtimeTranslation(!isRecordingRealtime)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg flex-shrink-0 ${
                  isRecordingRealtime
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Mic
                  size={14}
                  color={isRecordingRealtime ? '#ffffff' : '#374151'}
                  className={isRecordingRealtime ? 'animate-pulse' : ''}
                />
                {(!metrics.compact || isRecordingRealtime) && (isRecordingRealtime ? '录音中' : '麦克风')}
              </View>
            )}

            <View
              onClick={currentSession ? endRealtimeSession : createRealtimeSession}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex-shrink-0 ${
                currentSession
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              {currentSession ? '结束会话' : '创建会话'}
            </View>

            <View className="flex-1" />

            {metrics.compact ? null : realtimeSecondary}

            <View
              onClick={toggleRealtimeBoard}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-gray-600 hover:bg-gray-100 flex-shrink-0 cursor-pointer"
            >
              {isRealtimeFullscreen ? <Minimize size={13} color="#6b7280" /> : <Maximize size={13} color="#6b7280" />}
              {!metrics.compact && (
                <Text className="block text-xs text-gray-600">{isRealtimeFullscreen ? '还原' : '全屏'}</Text>
              )}
            </View>
          </View>
        </View>

        {isRealtimeExpanded && (
          <View className="flex-1 flex overflow-hidden min-h-0">
            {/* 左：历史会话 */}
            <View
              className={`bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 overflow-hidden ${
                isRealtimeHistoryOpen ? metrics.historyPanelWidth : 'w-0'
              }`}
            >
              <View className={`${metrics.historyPanelWidth} h-full flex flex-col`}>
                <ScrollView scrollY className="flex-1 p-2 space-y-2">
                  {sessionHistory.length === 0 ? (
                    <Text className="block text-xs text-gray-400 p-2">还没有结束的会话</Text>
                  ) : (
                    sessionHistory.map((session) => (
                      <View
                        key={session.id}
                        onClick={() => viewSessionDetail(session)}
                        className="group bg-teal-50 border border-teal-200 rounded-lg p-2 hover:shadow-md cursor-pointer"
                      >
                        <View className="flex items-start justify-between mb-1">
                          <Text className="block text-xs font-semibold text-gray-900 truncate flex-1">
                            {session.name}
                          </Text>
                          <View
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHistorySession(session.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-50"
                          >
                            <Trash2 size={12} color="#ef4444" />
                          </View>
                        </View>
                        <Text className="block text-xs text-teal-600 font-medium">
                          {session.speakers.length} 条记录
                        </Text>
                      </View>
                    ))
                  )}
                </ScrollView>
              </View>
            </View>

            {/* 右：实时内容 */}
            <View className="flex-1 flex flex-col overflow-hidden min-w-0">
              {/* 窄屏一排放不下的次级控件挤进右栏首行：跟着内容走，不横压在左侧历史面板之上 */}
              {metrics.compact && (
                <View className="flex items-center px-3 py-2 border-b border-gray-100 flex-shrink-0">
                  {realtimeSecondary}
                </View>
              )}
              {currentSession ? (
                displayMode === 'merged' ? (
                  <ScrollView scrollY className="h-full p-3 space-y-2">
                    {realtimeSpeakers.length > 0 ? (
                      <>
                        {realtimeSpeakers.map((segment) => (
                          <View
                            key={segment.id}
                            className="group flex items-start gap-2 bg-white rounded-lg border border-gray-200 p-2 hover:border-teal-300"
                          >
                            <View className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                              segment.speaker === 'A' ? 'bg-blue-500' :
                              segment.speaker === 'B' ? 'bg-green-500' :
                              'bg-orange-500'
                            }`}>
                              {segment.speaker}
                            </View>

                            <View className="flex-1 grid grid-cols-2 gap-2 min-w-0">
                              <View>
                                <Text className="text-xs text-teal-600 font-medium block mb-0.5">{segment.language}</Text>
                                <Text className="block text-sm text-gray-900">{segment.text}</Text>
                              </View>
                              <View className="border-l border-gray-200 pl-2">
                                <Text className="text-xs text-gray-400 font-medium block mb-0.5">翻译</Text>
                                <Text className="block text-sm text-gray-600">{segment.translation}</Text>
                              </View>
                            </View>

                            <View
                              onClick={() => saveSegmentToNotebook(segment)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-teal-50 flex-shrink-0"
                            >
                              <BookmarkPlus size={14} color="#0d9488" />
                            </View>
                          </View>
                        ))}
                        <View ref={realtimeEndRef} />
                      </>
                    ) : (
                      <View className="flex items-center justify-center h-full">
                        <Text className="block text-sm text-gray-400">等待录音内容...</Text>
                      </View>
                    )}
                  </ScrollView>
                ) : (
                  <View className="relative h-full bg-white overflow-hidden">
                    <View className="absolute right-0 top-0 bottom-0 w-1 bg-red-500 z-10" />
                    <View className="absolute inset-0 pr-4">
                      {realtimeSpeakers.map((segment) => (
                        <View
                          key={segment.id}
                          className="absolute right-4"
                          style={{
                            top: `${segment.verticalPosition}%`,
                            transform: 'translateY(-50%)',
                          }}
                        >
                          <View className="bg-teal-50 border border-teal-200 rounded-lg p-2 shadow-md">
                            <View className="flex items-center gap-2 mb-1">
                              <View className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                segment.speaker === 'A' ? 'bg-blue-500' :
                                segment.speaker === 'B' ? 'bg-green-500' :
                                'bg-orange-500'
                              }`}>
                                {segment.speaker}
                              </View>
                              <Text className="text-xs text-gray-600">{segment.language}</Text>
                            </View>
                            <Text className="block text-sm text-gray-900 mb-1">{segment.text}</Text>
                            <Text className="block text-xs text-gray-600">→ {segment.translation}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )
              ) : (
                <View className="flex flex-col items-center justify-center h-full">
                  <Radio size={48} color="#0d9488" className="mb-3" />
                  <Text className="block text-base font-semibold mb-2 text-gray-900">开始实时翻译</Text>
                  <Text className="block text-sm text-gray-500 text-center max-w-md">
                    点击「创建会话」开始实时识别多人对话
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
      )}

      {/* ========== 分板：位于两板之间，不隶属任何一板；只在两板都展开时出现 ========== */}
      {isRealtimeExpanded && isChatExpanded && (
        <View
          id={BOARD_DIVIDER_ID}
          onTouchStart={(e: ITouchEvent) => startResize(e.touches[0].clientY)}
          onTouchMove={(e: ITouchEvent) => moveResize(e.touches[0].clientY)}
          onTouchEnd={endResize}
          onTouchCancel={endResize}
          catchMove
          className={`flex-shrink-0 h-3 flex items-center justify-center border-y border-gray-200 cursor-ns-resize ${
            isResizing ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <View className={`w-16 h-1 rounded-full ${isResizing ? 'bg-gray-500' : 'bg-gray-300'}`} />
        </View>
      )}

      {/* ========== 板块二：对话；会话全屏时整板不渲染 ========== */}
      {isChatExpanded && (
      <View className="flex flex-col bg-white overflow-hidden flex-1 min-h-0">
        {/* 板块标题栏：左侧标题兼任历史面板开关，右上角的开关负责全屏/还原 */}
        <View className="flex items-center gap-2 px-3 h-12 bg-white border-b border-gray-200 flex-shrink-0">
          <View
            onClick={() => setIsChatHistoryOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-100 flex-shrink-0 cursor-pointer"
          >
            <MessageSquare size={13} color="#2563eb" />
            <Text className="block text-xs font-semibold text-blue-700">对话历史</Text>
            {isChatHistoryOpen
              ? <ChevronLeft size={13} color="#9ca3af" />
              : <ChevronRight size={13} color="#9ca3af" />}
          </View>

          <View className="w-px h-4 bg-gray-200 flex-shrink-0" />

          <View
            onClick={createNewConversation}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex-shrink-0"
          >
            <Plus size={13} color="#ffffff" />
            新建对话
          </View>

          <View className="flex-1 flex items-center justify-end gap-2 min-w-0">
            <View
              onClick={toggleChatBoard}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-gray-600 hover:bg-gray-100 flex-shrink-0 cursor-pointer"
            >
              {isChatFullscreen ? <Minimize size={13} color="#6b7280" /> : <Maximize size={13} color="#6b7280" />}
              {!metrics.compact && (
                <Text className="block text-xs text-gray-600">{isChatFullscreen ? '还原' : '全屏'}</Text>
              )}
            </View>
          </View>
        </View>

        {isChatExpanded && (
        <View className="flex-1 flex overflow-hidden min-h-0">
          {/* 左：对话历史 */}
          <View
            className={`bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 overflow-hidden ${
              isChatHistoryOpen ? metrics.historyPanelWidth : 'w-0'
            }`}
          >
            <View className={`${metrics.historyPanelWidth} h-full flex flex-col`}>
              <ScrollView scrollY className="flex-1 p-2 space-y-1">
                {conversations.map((conv) => (
                  <View
                    key={conv.id}
                    className={`group relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      conv.id === currentConversationId
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => switchConversation(conv.id)}
                  >
                    <MessageSquare size={14} color="#6b7280" className="mt-0.5 flex-shrink-0" />
                    <View className="flex-1 min-w-0">
                      <Text className="block text-sm font-medium text-gray-900 truncate">
                        {conv.title}
                      </Text>
                      <Text className="block text-xs text-gray-500 mt-0.5">
                        {formatTime(conv.updatedAt)}
                      </Text>
                    </View>

                    {conversations.length > 1 && (
                      <View
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50"
                      >
                        <Trash2 size={13} color="#9ca3af" />
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* 右：消息与输入 */}
          <View className="flex-1 flex flex-col overflow-hidden min-w-0">
            <ScrollView scrollY className="flex-1 px-4 py-4 space-y-4 bg-gray-50">
              {messages.map((message) => {
                const parts = parseMessageContent(message.text);
                const transcript = parts
                  .filter((part) => part.type === 'text')
                  .map((part) => part.content)
                  .join('')
                  .trim();
                const audioDuration =
                  message.duration || parts.find((part) => part.type === 'audio')?.content || '0:03';
                const isAudio = Boolean(message.hasAudio) || parts.some((part) => part.type === 'audio');
                const isUser = message.type === 'user';
                const isPlaying = Boolean(playing && playing.id === message.id);
                const transcriptOpen = Boolean(openTranscripts[message.id]);

                return (
                  <View
                    key={message.id}
                    className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <View
                      className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                        isUser ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'
                      }`}
                    >
                      {message.language && (
                        <View className="text-xs mb-2">
                          <Text className={`block px-2 py-0.5 rounded-full ${
                            isUser ? 'bg-white bg-opacity-20 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {message.language}
                          </Text>
                        </View>
                      )}

                      {/* 音频为主 */}
                      {isAudio ? (
                        <View className="w-56">
                          <AudioPlayer
                            duration={audioDuration}
                            dark={isUser}
                            active={isPlaying}
                            progress={isPlaying && playing ? playing.progress : 0}
                            onToggle={() => togglePlay(message.id)}
                          />
                        </View>
                      ) : (
                        <Text className={`block text-sm leading-relaxed ${isUser ? 'text-white' : 'text-gray-900'}`}>
                          {transcript || message.text}
                        </Text>
                      )}

                      {/* 文字为辅：默认收起，按需展开 */}
                      {isAudio && (
                        transcriptOpen ? (
                          <View className={`mt-2 pt-2 border-t ${isUser ? 'border-white border-opacity-30' : 'border-gray-200'}`}>
                            <Text className={`block text-sm leading-relaxed ${isUser ? 'text-white' : 'text-gray-700'}`}>
                              {transcript}
                            </Text>
                            <View onClick={() => toggleTranscript(message.id)} className="mt-1.5 flex items-center gap-1">
                              <Type size={12} color={isUser ? '#ffffff' : '#2563eb'} />
                              <Text className={`block text-xs ${isUser ? 'text-white' : 'text-blue-600'}`}>收起文字</Text>
                            </View>
                          </View>
                        ) : (
                          <View onClick={() => toggleTranscript(message.id)} className="mt-2 flex items-center gap-1">
                            <Type size={12} color={isUser ? '#ffffff' : '#2563eb'} />
                            <Text className={`block text-xs ${isUser ? 'text-white' : 'text-blue-600'}`}>转文字</Text>
                          </View>
                        )
                      )}
                    </View>

                    <View className="flex items-center gap-1 px-2">
                      <View
                        onClick={() => copyText(message.text)}
                        className="p-1.5 rounded-full hover:bg-gray-200"
                      >
                        <Copy size={14} color="#6b7280" />
                      </View>
                      {isUser && (
                        <View onClick={retranslate} className="p-1.5 rounded-full hover:bg-gray-200">
                          <RefreshCw size={14} color="#6b7280" />
                        </View>
                      )}
                      <View
                        onClick={() => saveMessageToNotebook(message)}
                        className="p-1.5 rounded-full hover:bg-gray-200"
                      >
                        <BookmarkPlus size={14} color="#6b7280" />
                      </View>
                    </View>
                  </View>
                );
              })}
              <View ref={messagesEndRef} />
            </ScrollView>

            {/* ========== 输入区：语音为主，文字为辅 ========== */}
            <View className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
              {inputMode === 'voice' ? (
                <View className="flex items-center gap-2">
                  <View
                    onClick={() => setInputMode('text')}
                    className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
                  >
                    <Keyboard size={20} color="#6b7280" />
                  </View>

                  <View
                    onClick={handleVoiceInput}
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isRecording ? 'bg-red-500' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    style={isRecording ? { boxShadow: '0 0 0 4px rgba(239,68,68,0.15)' } : {}}
                  >
                    <Mic size={18} color="#ffffff" className={isRecording ? 'animate-pulse' : ''} />
                  </View>

                  {/* 片段栏：录音片段在此叠加；整行高度与文字输入锁定一致 */}
                  <View className="flex-1 flex items-center gap-2 min-w-0 overflow-x-auto">
                    {isRecording ? (
                      <View className="flex items-center gap-2 flex-1 min-w-0">
                        <Waveform color="#fecaca" playedColor="#ef4444" progress={100} className="animate-pulse" />
                        <Text className="block text-xs text-red-500 flex-shrink-0">录音中 {formatDuration(recordSeconds)} · 再点停止</Text>
                      </View>
                    ) : draftClips.length > 0 ? (
                      draftClips.map((clip, index) => (
                        <View key={clip.id} className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-full bg-blue-50 border border-blue-100 flex-shrink-0">
                          <View className="w-10 flex">
                            <Waveform color="#93c5fd" playedColor="#2563eb" progress={-1} />
                          </View>
                          <Text className="block text-xs text-blue-700 flex-shrink-0">片段{index + 1} · {formatDuration(clip.seconds)}</Text>
                          <View
                            onClick={() => setDraftClips((prev) => prev.filter((c) => c.id !== clip.id))}
                            className="p-0.5 rounded-full hover:bg-blue-100 flex-shrink-0"
                          >
                            <X size={12} color="#2563eb" />
                          </View>
                        </View>
                      ))
                    ) : (
                      <Text className="block text-xs text-gray-400 truncate">轻点麦克风说话，录音片段会叠加在这里</Text>
                    )}
                  </View>

                  <View
                    onClick={() => toast.success('选择附件...')}
                    className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
                  >
                    <Paperclip size={20} color="#6b7280" />
                  </View>

                  <Button onClick={handleVoiceSend} size="icon">
                    <Send size={18} color="#ffffff" />
                  </Button>
                </View>
              ) : (
                <View className="flex items-center gap-2">
                  <View
                    onClick={() => setInputMode('voice')}
                    className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
                  >
                    <Mic size={20} color="#6b7280" />
                  </View>
                  {draftClips.length > 0 && (
                    <View
                      onClick={() => setInputMode('voice')}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 border border-blue-100 flex-shrink-0"
                    >
                      <Mic size={12} color="#2563eb" />
                      <Text className="block text-xs text-blue-700 flex-shrink-0">{draftClips.length} 段</Text>
                    </View>
                  )}
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="输入消息...支持方言和多语混杂"
                    className="flex-1"
                  />
                  <Button onClick={handleSend} size="icon">
                    <Send size={18} color="#ffffff" />
                  </Button>
                </View>
              )}

              <Text className="block text-xs text-gray-400 mt-2">
                提示：可以在普通话中混入方言词汇，或在方言中混入英文，系统会自动识别
              </Text>
            </View>
          </View>
        </View>
        )}
      </View>
      )}
    </View>
  );
}
