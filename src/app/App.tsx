import { useState } from 'react';
import { ChatMode } from './components/ChatMode';
import { LearningMode } from './components/LearningMode';
import { NotebookDrawer } from './components/NotebookDrawer';
import { MessageCircle, GraduationCap, BookMarked } from 'lucide-react';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';

type Mode = 'chat' | 'learning';

export default function App() {
  const [currentMode, setCurrentMode] = useState<Mode>('chat');
  const [notebookOpen, setNotebookOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header with integrated tabs */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            {/* 默认标题 */}
            <div className="flex-shrink-0">
              <h1 className="font-semibold text-gray-900">方言助手</h1>
              <p className="text-sm text-gray-500">多语言混杂智能识别</p>
            </div>
            
            {/* Segmented Control */}
            <div className="flex gap-6 mx-4">
              <button
                onClick={() => setCurrentMode('chat')}
                className={`flex items-center gap-2 px-1 py-2 border-b-2 transition-all whitespace-nowrap ${
                  currentMode === 'chat'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                方言查询
              </button>
              <button
                onClick={() => setCurrentMode('learning')}
                className={`flex items-center gap-2 px-1 py-2 border-b-2 transition-all whitespace-nowrap ${
                  currentMode === 'learning'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                学习区
              </button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotebookOpen(true)}
              className="gap-2 flex-shrink-0"
            >
              <BookMarked className="w-4 h-4" />
              记录本
            </Button>
          </div>
        </header>

        {/* Mode Content */}
        <div className="flex-1 overflow-hidden">
          {currentMode === 'chat' && <ChatMode />}
          {currentMode === 'learning' && <LearningMode />}
        </div>

        {/* Notebook Drawer */}
        <NotebookDrawer open={notebookOpen} onClose={() => setNotebookOpen(false)} />
      </div>
      <Toaster />
    </>
  );
}