import { OutletProvider, useLocation } from '../utils/router';
import { Layout } from '../components/Layout';
import { ChatMode } from '../components/ChatMode';
import { LearningMode } from '../components/LearningMode';
import { NotebookPage } from '../components/NotebookPage';
import { SettingsPage } from '../components/SettingsPage';
import { MessageCenter } from '../components/MessageCenter';
import { Toaster } from '../components/ui/sonner';

// Other 的 Web 版用 react-router 的 createBrowserRouter 挂这些路径；Taro 端没有 router，
// 路径状态由 utils/router 顶替，这里按同一张表分发。
function Routed() {
  const { pathname } = useLocation();
  switch (pathname) {
    case '/learning':
      return <LearningMode />;
    case '/notebook':
      return <NotebookPage />;
    case '/settings':
      return <SettingsPage />;
    case '/messages':
      return <MessageCenter />;
    default:
      return <ChatMode />;
  }
}

export default function App() {
  return (
    <>
      <OutletProvider value={<Routed />}>
        <Layout />
      </OutletProvider>
      <Toaster />
    </>
  );
}
