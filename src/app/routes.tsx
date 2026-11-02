import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { ChatMode } from './components/ChatMode';
import { LearningMode } from './components/LearningMode';
import { NotebookPage } from './components/NotebookPage';
import { SettingsPage } from './components/SettingsPage';
import { MessageCenter } from './components/MessageCenter';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: ChatMode,
      },
      {
        path: 'chat',
        Component: ChatMode,
      },
      {
        path: 'learning',
        Component: LearningMode,
      },
      {
        path: 'notebook',
        Component: NotebookPage,
      },
      {
        path: 'settings',
        Component: SettingsPage,
      },
      {
        path: 'messages',
        Component: MessageCenter,
      },
    ],
  },
]);