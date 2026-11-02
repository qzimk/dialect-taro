import { useEffect, useState } from 'react';
import { X, Search, Filter, Trash2, Volume2, MessageSquare, Languages, BookText } from 'lucide-react';
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

type NotebookDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type TabType = 'dialect' | 'chat' | 'translation';

export function NotebookDrawer({ open, onClose }: NotebookDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dialect');
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDialect, setFilterDialect] = useState('all');
  const [filterTag, setFilterTag] = useState('all');

  useEffect(() => {
    if (open) {
      loadEntries();
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
      ];
      setEntries(mockEntries);
      localStorage.setItem('dialectNotebook', JSON.stringify(mockEntries));
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-md bg-white h-full flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-lg">方言记录本</h2>
            <p className="text-sm text-gray-500">{entries.length} 条记录</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'dialect' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('dialect')}
            >
              <Languages className="w-4 h-4 mr-1" />
              方言
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
              <BookText className="w-4 h-4 mr-1" />
              翻译
            </Button>
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
                      <h3 className="font-medium text-sm text-gray-700 mb-2 sticky top-0 bg-white py-1">
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
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mb-3 text-gray-300" />
              <p>暂无聊天记录</p>
              <p className="text-sm mt-2">聊天内容将在后续版本中支持</p>
            </div>
          )}

          {activeTab === 'translation' && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <BookText className="w-12 h-12 mb-3 text-gray-300" />
              <p>暂无翻译记录</p>
              <p className="text-sm mt-2">翻译内容将在后续版本中支持</p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              显示 {filteredEntries.length} / {entries.length} 条
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