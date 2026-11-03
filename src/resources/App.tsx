import { useState } from 'react';
import { ChatMode } from '../components/ChatMode';
import { QueryMode } from '../components/QueryMode';
import { LiveTranslationMode } from '../components/LiveTranslationMode';
import { NotebookDrawer } from '../components/NotebookDrawer';
import { MessageCircle, Search, Mic, BookMarked } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Toaster } from '../components/ui/sonner';

type Mode = 'chat' | 'query' | 'live';

export default function App() {
  const [currentMode, setCurrentMode] = useState<Mode>('chat');
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [queryText, setQueryText] = useState<string | null>(null);

  const handleAnalyzeDialect = (text: string) => {
    setQueryText(text);
    setCurrentMode('query');
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-gray-900">方言助手</h1>
            <p className="text-sm text-gray-500">多语言混杂智能识别</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNotebookOpen(true)}
            className="gap-2"
          >
            <BookMarked className="w-4 h-4" />
            记录本
          </Button>
        </header>

        {/* Mode Selector */}
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setCurrentMode('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                currentMode === 'chat'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              普通聊天
            </button>
            <button
              onClick={() => setCurrentMode('query')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                currentMode === 'query'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Search className="w-4 h-4" />
              方言查询
            </button>
            <button
              onClick={() => setCurrentMode('live')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                currentMode === 'live'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Mic className="w-4 h-4" />
              实时翻译
            </button>
          </div>
        </div>

        {/* Mode Content */}
        <div className="flex-1 overflow-hidden">
          {currentMode === 'chat' && <ChatMode onAnalyzeDialect={handleAnalyzeDialect} />}
          {currentMode === 'query' && <QueryMode text={queryText} onClearText={() => setQueryText(null)} />}
          {currentMode === 'live' && <LiveTranslationMode />}
        </div>

        {/* Notebook Drawer */}
        <NotebookDrawer open={notebookOpen} onClose={() => setNotebookOpen(false)} />
      </div>
      <Toaster />
    </>
  );
}
