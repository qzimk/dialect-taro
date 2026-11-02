import { useState, useEffect } from 'react';
import { Search, Mic, Volume2, BookmarkPlus, BookOpen, X, History, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

type QueryResult = {
  dialectType: string;
  original: string;
  mandarinTranslation: string;
  explanation: string;
  examples: string[];
  pronunciation: string;
  tags: string[];
};

type DialectKnowledgePoint = {
  term: string;
  explanation: string;
  category: string;
};

type AnalysisResult = {
  originalText: string;
  knowledgePoints: DialectKnowledgePoint[];
};

// Mock analysis for dialect knowledge points
const mockAnalyze = (text: string): AnalysisResult => {
  const knowledgePoints: DialectKnowledgePoint[] = [];

  // Check for various dialect patterns
  if (text.includes('的哇')) {
    knowledgePoints.push({
      term: '的哇',
      explanation: '吴语中的常见结尾语气词，用于表达确定或强调的语气',
      category: '语气词',
    });
  }
  
  if (text.includes('嘛')) {
    knowledgePoints.push({
      term: '嘛',
      explanation: '粤语/四川话中的语气词，用于表达理所当然或催促的语气',
      category: '语气词',
    });
  }
  
  if (text.includes('巴适')) {
    knowledgePoints.push({
      term: '巴适',
      explanation: '四川话形容词，表示"很好"、"非常舒服"的意思',
      category: '形容词',
    });
  }
  
  if (text.includes('得板')) {
    knowledgePoints.push({
      term: '得板',
      explanation: '四川话中的程度副词后缀，表示"非常"、"极其"的强调',
      category: '副词后缀',
    });
  }
  
  if (text.includes('啥子')) {
    knowledgePoints.push({
      term: '啥子',
      explanation: '四川话中的疑问代词，相当于普通话的"什么"',
      category: '疑问词',
    });
  }
  
  if (text.includes('嘎哈')) {
    knowledgePoints.push({
      term: '嘎哈',
      explanation: '东北话疑问词，表示"干什么"或"做什么"',
      category: '疑问词',
    });
  }
  
  if (text.includes('侬')) {
    knowledgePoints.push({
      term: '侬',
      explanation: '吴语/上海话中的人称代词，表示"你"',
      category: '代词',
    });
  }
  
  if (text.includes('阿拉')) {
    knowledgePoints.push({
      term: '阿拉',
      explanation: '上海话中的人称代词，表示"我们"',
      category: '代词',
    });
  }
  
  if (text.includes('靓仔')) {
    knowledgePoints.push({
      term: '靓仔',
      explanation: '粤语中对年轻男性的称呼，表示"帅哥"',
      category: '称呼',
    });
  }

  // Check for mixed language patterns
  if (/[a-zA-Z]+/.test(text)) {
    const englishWords = text.match(/[a-zA-Z]+/g);
    if (englishWords) {
      englishWords.forEach(word => {
        knowledgePoints.push({
          term: word,
          explanation: '中英混杂用法：在中文语境中直接使用英文词汇',
          category: '外语混用',
        });
      });
    }
  }

  // If no specific patterns found, add a general analysis
  if (knowledgePoints.length === 0) {
    knowledgePoints.push({
      term: '语句分析',
      explanation: '未检测到明显的方言特征词汇，可能是标准普通话或其他方言',
      category: '综合分析',
    });
  }

  return {
    originalText: text,
    knowledgePoints,
  };
};

// Mock dialect query
const mockQuery = (text: string): QueryResult => {
  if (text.includes('巴适')) {
    return {
      dialectType: '四川话',
      original: text,
      mandarinTranslation: '很好，非常舒服',
      explanation: '"巴适"是四川方言中常用的形容词，表示舒服、满意、高兴的意思。',
      examples: ['今天天气巴适得板', '这个火锅吃起来巴适'],
      pronunciation: 'bā shì',
      tags: ['四川话', '形容词', '日常用语'],
    };
  } else if (text.includes('靓仔')) {
    return {
      dialectType: '粤语',
      original: text,
      mandarinTranslation: '帅哥',
      explanation: '"靓仔"是粤语中对年轻男性的称呼，表示帅气、好看的意思。',
      examples: ['呢个靓仔好有型', '靓仔，点解咁耐先嚟'],
      pronunciation: 'leng3 zai2',
      tags: ['粤语', '称呼', '年轻人用语'],
    };
  } else if (text.includes('嘎哈')) {
    return {
      dialectType: '东北话',
      original: text,
      mandarinTranslation: '干什么',
      explanation: '"嘎哈"是东北方言，意思是"做什么"或"干什么"，是东北话中非常常用的疑问词。',
      examples: ['你嘎哈呢？', '嘎哈去啊？', '整嘎哈呢？'],
      pronunciation: 'gá hā',
      tags: ['东北话', '疑问词', '口语'],
    };
  }

  return {
    dialectType: '普通话',
    original: text,
    mandarinTranslation: text,
    explanation: '这是标准普通话表达',
    examples: [],
    pronunciation: '',
    tags: ['普通话', '标准用语'],
  };
};

type QueryModeProps = {
  text?: string | null;
  onClearText?: () => void;
};

type QueryHistoryEntry = {
  id: string;
  type: 'query' | 'analysis';
  input: string;
  result: QueryResult | AnalysisResult;
  timestamp: string;
};

export function QueryMode({ text, onClearText }: QueryModeProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'query' | 'analysis'>('query');
  const [showHistory, setShowHistory] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryEntry[]>([]);

  // Auto-analyze when text is passed from ChatMode
  useEffect(() => {
    if (text) {
      setInput(text);
      setMode('analysis');
      handleAnalysis(text);
    }
  }, [text]);

  const handleQuery = () => {
    if (!input.trim()) return;

    setMode('query');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const queryResult = mockQuery(input);
      setResult(queryResult);
      setAnalysisResult(null);
      setIsLoading(false);
      // Add to history
      setQueryHistory(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'query',
          input,
          result: queryResult,
          timestamp: new Date().toISOString(),
        }
      ]);
    }, 800);
  };

  const handleAnalysis = (textToAnalyze?: string) => {
    const analyzeText = textToAnalyze || input;
    if (!analyzeText.trim()) return;

    setMode('analysis');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const analysis = mockAnalyze(analyzeText);
      setAnalysisResult(analysis);
      setResult(null);
      setIsLoading(false);
      // Add to history
      setQueryHistory(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'analysis',
          input,
          result: analysis,
          timestamp: new Date().toISOString(),
        }
      ]);
    }, 800);
  };

  const handleVoiceInput = () => {
    toast.success('开始语音输入...');
    setTimeout(() => {
      setInput('这个巴适得板');
      toast.success('语音识别完成');
    }, 1500);
  };

  const playPronunciation = () => {
    toast.success('播放发音');
  };

  const saveToNotebook = () => {
    if (!result) return;
    
    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('dialectNotebook') || '[]');
    const newEntry = {
      id: Date.now().toString(),
      ...result,
      savedAt: new Date().toISOString(),
    };
    saved.push(newEntry);
    localStorage.setItem('dialectNotebook', JSON.stringify(saved));
    
    toast.success('已保存到记录本');
  };

  const clearAnalysis = () => {
    setInput('');
    setResult(null);
    setAnalysisResult(null);
    setMode('query');
    onClearText?.();
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-6 space-y-4">
        {/* Back to Current Button */}
        {showHistory && (
          <Button
            variant="outline"
            onClick={() => setShowHistory(false)}
            className="w-full gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            返回当前查询
          </Button>
        )}

        {/* History View */}
        {showHistory && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">历史查询</h3>
            {queryHistory.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>暂无历史查询</p>
              </div>
            ) : (
              <div className="space-y-3">
                {queryHistory.slice().reverse().map((entry) => (
                  <Card key={entry.id} className="border-gray-200">
                    <CardContent className="pt-4">
                      {/* Query Type Result */}
                      {entry.type === 'query' && 'mandarinTranslation' in entry.result && (
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="default" className="bg-blue-600">
                                  {entry.result.dialectType}
                                </Badge>
                                {entry.result.pronunciation && (
                                  <span className="text-gray-500">{entry.result.pronunciation}</span>
                                )}
                                <span className="text-xs text-gray-400">
                                  {new Date(entry.timestamp).toLocaleString('zh-CN')}
                                </span>
                              </div>
                              <h3 className="text-xl font-semibold">{entry.result.original}</h3>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // Save to notebook
                                const saved = JSON.parse(localStorage.getItem('dialectNotebook') || '[]');
                                const newEntry = {
                                  id: Date.now().toString(),
                                  ...entry.result,
                                  savedAt: new Date().toISOString(),
                                };
                                saved.push(newEntry);
                                localStorage.setItem('dialectNotebook', JSON.stringify(saved));
                                toast.success('已保存到记录本');
                              }}
                              className="text-blue-600"
                            >
                              <BookmarkPlus className="w-5 h-5" />
                            </Button>
                          </div>

                          {/* Translation */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">普通话释义</p>
                            <p className="text-lg">{entry.result.mandarinTranslation}</p>
                          </div>

                          {/* Explanation */}
                          <div>
                            <p className="text-sm text-gray-600 mb-2">详细解释</p>
                            <p className="text-gray-800">{entry.result.explanation}</p>
                          </div>

                          {/* Examples */}
                          {entry.result.examples.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">使用示例</p>
                              <div className="space-y-2">
                                {entry.result.examples.map((example, index) => (
                                  <div key={index} className="bg-blue-50 rounded-lg p-3">
                                    <p className="text-sm">{example}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tags */}
                          <div>
                            <p className="text-sm text-gray-600 mb-2">标签</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.result.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          {entry.result.pronunciation && (
                            <div className="flex gap-2 pt-2 border-t">
                              <Button
                                variant="outline"
                                className="flex-1 gap-2"
                                onClick={() => toast.success('播放发音')}
                              >
                                <Volume2 className="w-4 h-4" />
                                播放发音
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Analysis Type Result */}
                      {entry.type === 'analysis' && 'knowledgePoints' in entry.result && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-5 h-5 text-blue-600" />
                              <span className="font-semibold">方言知识点解析</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(entry.timestamp).toLocaleString('zh-CN')}
                            </span>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">查询内容</p>
                            <p className="font-medium">{entry.result.originalText}</p>
                          </div>

                          <div className="space-y-3">
                            {entry.result.knowledgePoints.map((point, index) => (
                              <div key={index} className="bg-blue-50 rounded-lg p-3 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-blue-900">{point.term}</span>
                                      <Badge variant="secondary" className="text-xs">
                                        {point.category}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-700">{point.explanation}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2 pt-2 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  entry.result.knowledgePoints
                                    .map(p => `${p.term}: ${p.explanation}`)
                                    .join('\n')
                                );
                                toast.success('已复制知识点');
                              }}
                            >
                              复制知识点
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Current Query View */}
        {!showHistory && (
          <>
            {/* Input Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-gray-400" />
                      <span>
                        {mode === 'analysis' ? '分析方言知识点' : '输入方言词汇或句子'}
                      </span>
                    </div>
                    {text && (
                      <Button variant="ghost" size="sm" onClick={clearAnalysis}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="例如：巴适、靓仔、嘎哈、侬好..."
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleVoiceInput} variant="outline" className="gap-2">
                      <Mic className="w-4 h-4" />
                      语音输入
                    </Button>
                    <Button onClick={handleQuery} disabled={isLoading} className="flex-1 gap-2">
                      <Search className="w-4 h-4" />
                      {isLoading ? '查询中...' : '词汇查询'}
                    </Button>
                    <Button onClick={() => handleAnalysis()} disabled={isLoading} variant="secondary" className="flex-1 gap-2">
                      <BookOpen className="w-4 h-4" />
                      {isLoading ? '分析中...' : '拆解知识点'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History Button - After Query Card */}
            <Button
              variant="outline"
              onClick={() => setShowHistory(true)}
              className="w-full gap-2"
            >
              <History className="w-4 h-4" />
              历史查询 {queryHistory.length > 0 && `(${queryHistory.length})`}
            </Button>

            {/* Analysis Result - Chat Bubble Style */}
            {analysisResult && mode === 'analysis' && (
              <div className="space-y-3">
                {/* User Query Bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl px-4 py-3">
                    <p className="text-sm mb-1 text-blue-100">查询语句内的方言用法</p>
                    <p>{analysisResult.originalText}</p>
                  </div>
                </div>

                {/* Assistant Response Bubble */}
                <div className="flex justify-start">
                  <Card className="max-w-[85%] border-2 border-blue-200">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">方言知识点解析</span>
                      </div>

                      <div className="space-y-3">
                        {analysisResult.knowledgePoints.map((point, index) => (
                          <div key={index} className="bg-blue-50 rounded-lg p-3 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-blue-900">{point.term}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {point.category}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-700">{point.explanation}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              analysisResult.knowledgePoints
                                .map(p => `${p.term}: ${p.explanation}`)
                                .join('\n')
                            );
                            toast.success('已复制知识点');
                          }}
                        >
                          复制知识点
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Quick Examples */}
            {!analysisResult && !result && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">快速查询：</p>
                <div className="flex flex-wrap gap-2">
                  {['巴适', '靓仔', '嘎哈', '侬好', '雾煞煞', '嘞'].map((example) => (
                    <Button
                      key={example}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInput(example);
                        setTimeout(handleQuery, 100);
                      }}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Query Result */}
            {result && mode === 'query' && (
              <Card className="border-2 border-blue-200">
                <CardContent className="pt-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-blue-600">
                          {result.dialectType}
                        </Badge>
                        {result.pronunciation && (
                          <span className="text-gray-500">{result.pronunciation}</span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold">{result.original}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={saveToNotebook}
                      className="text-blue-600"
                    >
                      <BookmarkPlus className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Translation */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">普通话释义</p>
                    <p className="text-lg">{result.mandarinTranslation}</p>
                  </div>

                  {/* Explanation */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">详细解释</p>
                    <p className="text-gray-800">{result.explanation}</p>
                  </div>

                  {/* Examples */}
                  {result.examples.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">使用示例</p>
                      <div className="space-y-2">
                        {result.examples.map((example, index) => (
                          <div key={index} className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm">{example}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">标签</p>
                    <div className="flex flex-wrap gap-2">
                      {result.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {result.pronunciation && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={playPronunciation}
                      >
                        <Volume2 className="w-4 h-4" />
                        播放发音
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}