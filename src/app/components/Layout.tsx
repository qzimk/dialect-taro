import { Outlet, useLocation, useNavigate } from 'react-router';
import { MessageCircle, GraduationCap, BookMarked } from 'lucide-react';
import { Button } from './ui/button';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // 确定当前活动标签
  const getCurrentTab = () => {
    if (location.pathname === '/notebook') return 'notebook';
    if (location.pathname === '/learning') return 'learning';
    if (location.pathname === '/settings') return 'settings';
    if (location.pathname === '/messages') return 'messages';
    return 'chat'; // 默认或 / 或 /chat
  };

  const currentTab = getCurrentTab();

  const handleTabChange = (tab: string) => {
    if (tab === 'chat') {
      navigate('/');
    } else {
      navigate(`/${tab}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with integrated tabs */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* App Title Button */}
          <button
            onClick={() => handleTabChange('settings')}
            className={`flex-shrink-0 px-3 py-2 rounded-lg transition-all text-left flex flex-col items-start ${
              currentTab === 'settings'
                ? 'bg-blue-50 shadow-sm ring-2 ring-blue-200'
                : 'hover:bg-gray-50 hover:shadow-sm'
            }`}
          >
            <h1 className={`font-semibold ${
              currentTab === 'settings' ? 'text-blue-600' : 'text-gray-900'
            }`}>
              方言助手
            </h1>
          </button>
          
          {/* Segmented Control - 始终显示 */}
          <div className="flex gap-6 mx-4">
            <button
              onClick={() => handleTabChange('chat')}
              className={`flex items-center gap-2 px-1 py-2 border-b-2 transition-all whitespace-nowrap ${
                currentTab === 'chat'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              方言查询
            </button>
            <button
              onClick={() => handleTabChange('learning')}
              className={`flex items-center gap-2 px-1 py-2 border-b-2 transition-all whitespace-nowrap ${
                currentTab === 'learning'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              学习区
            </button>
          </div>
          
          {/* 记录本按钮 */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant={currentTab === 'notebook' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleTabChange('notebook')}
              className="gap-2"
            >
              <BookMarked className="w-4 h-4" />
              记录本
            </Button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}