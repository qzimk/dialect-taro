import { useEffect, useState } from 'react';
import { X, Search, Filter, Trash2, Volume2, MessageSquare, Lightbulb, BookmarkPlus, ExternalLink, ArrowRight, Radio, User, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

type NotebookEntry = {
  id: string;
  dialectType: string;
  original: string;
  mandarinTranslation: string;
  explanation: string;
  tags: string[];
  savedAt: string;
};

type QueryHistoryEntry = {
  id: string;
  type: 'query' | 'analysis';
  input: string;
  result: any;
  timestamp: string;
};

type ChatRecord = {
  id: string;
  text: string;           // 原文内容
  translation?: string;   // 翻译内容（实时翻译场景）
  language?: string;      // 识别到的语言
  speaker?: string;       // 说话者标识（实时翻译）
  role?: 'user' | 'assistant'; // 聊天模式中的角色
  mode: 'chat' | 'live';  // 普通聊天气泡 | 实时翻译语句
  timestamp: string;
  hasAudio?: boolean;
};

type ResourceRecord = {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'link' | 'course';
  language: string;
  savedFrom: string; // 从哪里收藏的
  timestamp: string;
};

type NotebookDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type TabType = 'dialect' | 'chat' | 'translation';

export function NotebookDrawer({ open, onClose }: NotebookDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dialect');
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [chatRecords, setChatRecords] = useState<ChatRecord[]>([]);
  const [resourceRecords, setResourceRecords] = useState<ResourceRecord[]>([]);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDialect, setFilterDialect] = useState('all');
  const [filterTag, setFilterTag] = useState('all');

  useEffect(() => {
    if (open) {
      loadEntries();
      loadChatRecords();
      loadResourceRecords();
      loadQueryHistory();
    }
  }, [open]);

  const loadEntries = () => {
    const saved = localStorage.getItem('dialectNotebook');
    if (saved) {
      const parsed = JSON.parse(saved);
      setEntries(parsed);
    } else {
      // Add some mock data
      const mockEntries: NotebookEntry[] = [
        {
          id: '1',
          dialectType: '四川话',
          original: '巴适',
          mandarinTranslation: '很好，非常舒服',
          explanation: '表示舒服、满意、高兴的意思',
          tags: ['四川话', '形容词', '日常用语', '高频词'],
          savedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '2',
          dialectType: '粤语',
          original: '靓仔',
          mandarinTranslation: '帅哥',
          explanation: '对年轻男性的称呼，表示帅气、好看',
          tags: ['粤语', '称呼', '年轻人用语'],
          savedAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: '3',
          dialectType: '东北话',
          original: '嘎哈',
          mandarinTranslation: '干什么',
          explanation: '意思是"做什么"或"干什么"',
          tags: ['东北话', '疑问词', '口语'],
          savedAt: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          id: '4',
          dialectType: '上海话',
          original: '侬好',
          mandarinTranslation: '你好',
          explanation: '上海话的问候语',
          tags: ['上海话', '问候语', '基础用语'],
          savedAt: new Date(Date.now() - 345600000).toISOString(),
        },
        {
          id: '5',
          dialectType: '四川话',
          original: '雄起',
          mandarinTranslation: '加油、振作',
          explanation: '鼓励别人的用语，表示要努力、要振作精神',
          tags: ['四川话', '动词', '激励用语', '体育'],
          savedAt: new Date(Date.now() - 432000000).toISOString(),
        },
        {
          id: '6',
          dialectType: '粤语',
          original: '得闲',
          mandarinTranslation: '有空、空闲',
          explanation: '表示有时间、有空闲的意思',
          tags: ['粤语', '形容词', '时间相关', '高频词'],
          savedAt: new Date(Date.now() - 518400000).toISOString(),
        },
        {
          id: '7',
          dialectType: '东北话',
          original: '埋汰',
          mandarinTranslation: '脏、不干净',
          explanation: '形容东西很脏或人很邋遢',
          tags: ['东北话', '形容词', '日常用语'],
          savedAt: new Date(Date.now() - 604800000).toISOString(),
        },
        {
          id: '8',
          dialectType: '上海话',
          original: '阿拉',
          mandarinTranslation: '我们',
          explanation: '上海话中"我们"的说法',
          tags: ['上海话', '代词', '基础用语', '高频词'],
          savedAt: new Date(Date.now() - 691200000).toISOString(),
        },
      ];
      setEntries(mockEntries);
      localStorage.setItem('dialectNotebook', JSON.stringify(mockEntries));
    }
  };

  const loadChatRecords = () => {
    const saved = localStorage.getItem('chatRecords');
    if (saved) {
      const parsed = JSON.parse(saved);
      setChatRecords(parsed);
    } else {
      // Mock data: 每条记录是一个单独的气泡/语句
      const mockRecords: ChatRecord[] = [
        {
          id: '1',
          text: '侬好啊，今朝天气老好个！',
          translation: '你好啊，今天天气真好！',
          language: '上海话',
          speaker: 'A',
          mode: 'live',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '2',
          text: 'Hello! Yes, the weather is nice.',
          translation: '你好！是的，天气很好。',
          language: '英语',
          speaker: 'B',
          mode: 'live',
          timestamp: new Date(Date.now() - 3540000).toISOString(),
        },
        {
          id: '3',
          text: '靓仔，你好啊，今日天气几好啵。',
          language: '粤语',
          role: 'user',
          mode: 'chat',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '4',
          text: '收到！检测到您使用的是粤语。"靓仔"是粤语对帅气年轻男性的称呼。',
          language: '普通话',
          role: 'assistant',
          mode: 'chat',
          timestamp: new Date(Date.now() - 86390000).toISOString(),
          hasAudio: true,
        },
        {
          id: '5',
          text: '阿拉一道去公园耍耍伐？',
          translation: '我们一起去公园玩玩好吗？',
          language: '上海话',
          speaker: 'A',
          mode: 'live',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: '6',
          text: '巴适得板！这个火锅味道太棒了。',
          language: '四川话',
          role: 'user',
          mode: 'chat',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: '7',
          text: '很高兴您喜欢！"巴适得板"是四川话中表示"非常好、很舒服"的意思。',
          language: '普通话',
          role: 'assistant',
          mode: 'chat',
          timestamp: new Date(Date.now() - 7150000).toISOString(),
          hasAudio: true,
        },
        {
          id: '8',
          text: '今儿个天气真不错，嘎哈���？',
          translation: '今天天气真不错，干什么去？',
          language: '东北话',
          speaker: 'C',
          mode: 'live',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          id: '9',
          text: 'I think we should go to the park.',
          translation: '我觉得我们应该去公园。',
          language: '英语',
          speaker: 'B',
          mode: 'live',
          timestamp: new Date(Date.now() - 259100000).toISOString(),
        },
        {
          id: '10',
          text: '你这个想法蛮好的！',
          language: '普通话',
          role: 'user',
          mode: 'chat',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
        },
      ];
      setChatRecords(mockRecords);
      localStorage.setItem('chatRecords', JSON.stringify(mockRecords));
    }
  };

  const loadResourceRecords = () => {
    const saved = localStorage.getItem('resourceRecords');
    if (saved) {
      const parsed = JSON.parse(saved);
      setResourceRecords(parsed);
    } else {
      // Add some mock data
      const mockRecords: ResourceRecord[] = [
        {
          id: '1',
          title: '粤语日常对话速成',
          description: '包含100个日常场景的粤语对话练习',
          type: 'video',
          language: '粤语',
          savedFrom: '学习区推荐',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '2',
          title: '四川话发音技巧',
          description: '详细讲解四川话的声调和特殊发音规则',
          type: 'document',
          language: '四川话',
          savedFrom: '在线课程',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: '3',
          title: '东北方言词汇大全',
          description: '超过500个东北方言词汇及其普通话对照',
          type: 'document',
          language: '东北话',
          savedFrom: '学习区',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          id: '4',
          title: '上海话入门视频课程',
          description: '从零开始学习上海话，包含基础词汇和日常用语',
          type: 'course',
          language: '上海话',
          savedFrom: '视频网站',
          timestamp: new Date(Date.now() - 345600000).toISOString(),
        },
        {
          id: '5',
          title: '方言与普通话对照手册',
          description: '涵盖多个方言区的常用词汇对照表',
          type: 'link',
          language: '综合',
          savedFrom: '外部链接',
          timestamp: new Date(Date.now() - 432000000).toISOString(),
        },
      ];
      setResourceRecords(mockRecords);
      localStorage.setItem('resourceRecords', JSON.stringify(mockRecords));
    }
  };

  const loadQueryHistory = () => {
    const saved = localStorage.getItem('queryHistory');
    if (saved) {
      const parsed = JSON.parse(saved);
      setQueryHistory(parsed);
    } else {
      // Add some mock data
      const mockHistory: QueryHistoryEntry[] = [
        {
          id: '1',
          type: 'query',
          input: '巴适',
          result: '很好，非常舒服',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '2',
          type: 'analysis',
          input: '靓仔',
          result: '对年轻男性的称呼，表示帅气、好看',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: '3',
          type: 'query',
          input: '嘎哈',
          result: '意思是"做什么"或"干什么"',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          id: '4',
          type: 'analysis',
          input: '侬好',
          result: '上海话的问候语',
          timestamp: new Date(Date.now() - 345600000).toISOString(),
        },
      ];
      setQueryHistory(mockHistory);
      localStorage.setItem('queryHistory', JSON.stringify(mockHistory));
    }
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem('dialectNotebook', JSON.stringify(updated));
    toast.success('已删除');
  };

  const deleteChatRecord = (id: string) => {
    const updated = chatRecords.filter((r) => r.id !== id);
    setChatRecords(updated);
    localStorage.setItem('chatRecords', JSON.stringify(updated));
    toast.success('已删除');
  };

  const playPronunciation = (entry: NotebookEntry) => {
    toast.success(`播放 "${entry.original}" 的发音`);
  };

  // Get unique dialects and tags
  const dialects = Array.from(new Set(entries.map((e) => e.dialectType)));
  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags)));

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      searchQuery === '' ||
      entry.original.includes(searchQuery) ||
      entry.mandarinTranslation.includes(searchQuery) ||
      entry.explanation.includes(searchQuery);
    
    const matchesDialect = filterDialect === 'all' || entry.dialectType === filterDialect;
    const matchesTag = filterTag === 'all' || entry.tags.includes(filterTag);

    return matchesSearch && matchesDialect && matchesTag;
  });

  // Group by dialect
  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.dialectType]) {
      acc[entry.dialectType] = [];
    }
    acc[entry.dialectType].push(entry);
    return acc;
  }, {} as Record<string, NotebookEntry[]>);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Full screen container */}
      <div className="relative w-full bg-white h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">记录本</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            {/* Tabs */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'dialect' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('dialect')}
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                知识点
              </Button>
              <Button
                variant={activeTab === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('chat')}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                对话
              </Button>
              <Button
                variant={activeTab === 'translation' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('translation')}
              >
                <BookmarkPlus className="w-4 h-4 mr-1" />
                资源
              </Button>
            </div>
            
            <p className="text-sm text-gray-500">{entries.length} 条记录</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 py-3 border-b border-gray-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索记录..."
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterDialect} onValueChange={setFilterDialect}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="方言类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有方言</SelectItem>
                {dialects.map((dialect) => (
                  <SelectItem key={dialect} value={dialect}>
                    {dialect}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="标签" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有标签</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {activeTab === 'dialect' && (
            <>
              {filteredEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <Filter className="w-12 h-12 mb-3 text-gray-300" />
                  <p>没有找到匹配的记录</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedEntries).map(([dialect, dialectEntries]) => (
                    <div key={dialect}>
                      <h3 className="font-medium text-sm text-gray-700 mb-2 sticky top-0 bg-white py-2 z-10 border-b border-gray-100">
                        {dialect} ({dialectEntries.length})
                      </h3>
                      <div className="space-y-2">
                        {dialectEntries.map((entry) => (
                          <Card key={entry.id}>
                            <CardContent className="pt-4">
                              <div className="space-y-3">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold">{entry.original}</h4>
                                    <p className="text-sm text-gray-600">{entry.mandarinTranslation}</p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600"
                                    onClick={() => deleteEntry(entry.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>

                                {/* Explanation */}
                                <p className="text-sm text-gray-700">{entry.explanation}</p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1">
                                  {entry.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                  <span className="text-xs text-gray-500">
                                    {new Date(entry.savedAt).toLocaleDateString('zh-CN')}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => playPronunciation(entry)}
                                    className="gap-1 h-7 text-xs"
                                  >
                                    <Volume2 className="w-3 h-3" />
                                    发音
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'chat' && (
            <>
              {chatRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mb-3 text-gray-300" />
                  <p>暂无对话记录</p>
                  <p className="text-sm mt-2">点击聊天气泡或实时翻译条目旁的书签图标即可保存</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chatRecords.map((record) => (
                    <div
                      key={record.id}
                      className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all overflow-hidden"
                    >
                      {/* Card header: mode badge + language + timestamp */}
                      <div className="flex items-center justify-between px-3 pt-3 pb-2">
                        <div className="flex items-center gap-2">
                          {record.mode === 'live' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                              <Radio className="w-3 h-3" />
                              实时翻译
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                              <MessageSquare className="w-3 h-3" />
                              {record.role === 'user' ? '我说' : 'AI回复'}
                            </span>
                          )}
                          {record.language && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              {record.language}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-400">
                            {new Date(record.timestamp).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button
                            onClick={() => deleteChatRecord(record.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 transition-opacity"
                            title="删除"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="px-3 pb-3">
                        {record.mode === 'live' ? (
                          // 实时翻译：说话者 + 原文 + 翻译
                          <div className="flex items-start gap-2">
                            {record.speaker && (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                                record.speaker === 'A' ? 'bg-blue-500 text-white' :
                                record.speaker === 'B' ? 'bg-green-500 text-white' :
                                'bg-orange-500 text-white'
                              }`}>
                                {record.speaker}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 leading-relaxed">{record.text}</p>
                              {record.translation && (
                                <p className="text-xs text-gray-500 mt-1 pl-2 border-l-2 border-purple-200">
                                  → {record.translation}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          // 聊天气泡：user / assistant 样式
                          <div className={`flex items-start gap-2 ${record.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              record.role === 'user' ? 'bg-blue-500' : 'bg-gray-200'
                            }`}>
                              {record.role === 'user'
                                ? <User className="w-3.5 h-3.5 text-white" />
                                : <Bot className="w-3.5 h-3.5 text-gray-600" />
                              }
                            </div>
                            <div className={`flex-1 rounded-xl px-3 py-2 text-sm leading-relaxed ${
                              record.role === 'user'
                                ? 'bg-blue-50 text-blue-900'
                                : 'bg-gray-50 text-gray-800'
                            }`}>
                              {record.text}
                              {record.hasAudio && (
                                <button
                                  onClick={() => toast.success('播放语音')}
                                  className="ml-2 inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700"
                                >
                                  <Volume2 className="w-3 h-3" />
                                  播放
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'translation' && (
            <>
              {resourceRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <BookmarkPlus className="w-12 h-12 mb-3 text-gray-300" />
                  <p>暂无收藏资源</p>
                  <p className="text-sm mt-2">在学习区收藏的资源将显示在这里</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resourceRecords.map((resource) => (
                    <Card key={resource.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{resource.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                  {resource.type === 'video' ? '视频' : resource.type === 'document' ? '文档' : resource.type === 'link' ? '外链' : '课程'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {resource.language}
                                </Badge>
                                <span className="text-xs text-gray-500">来自：{resource.savedFrom}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-500">
                              {new Date(resource.timestamp).toLocaleDateString('zh-CN')}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 h-7 text-xs text-blue-600"
                              onClick={() => toast.success('打开资源')}
                            >
                              打开
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Stats */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {activeTab === 'dialect' && `显示 ${filteredEntries.length} / ${entries.length} 条`}
              {activeTab === 'chat' && `共 ${chatRecords.length} 条记录`}
              {activeTab === 'translation' && `共 ${resourceRecords.length} 条资源`}
            </span>
            <Button variant="outline" size="sm" onClick={loadEntries}>
              刷新
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}