import { View } from '@tarojs/components';
import { Outlet, useLocation, useNavigate } from '../utils/router';
import { MessageCircle, GraduationCap, BookMarked, User, ChevronDown } from './ui/icons';
import { useDeviceLayout } from '../utils/deviceTier';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { metrics } = useDeviceLayout();
  const { compact, ultra, headerHeight } = metrics;

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

  // 竖屏窄档只留两个主标签在中间，记录本挪到右侧、用户挪到左侧，横向余量优先给主导航
  const tabs = [
    { key: 'chat', label: '方言查询', Icon: MessageCircle },
    { key: 'learning', label: '学习区', Icon: GraduationCap },
  ];

  return (
    <View className="flex flex-col h-screen bg-gray-50">
      <View className="bg-white border-b border-gray-200 flex-shrink-0">
        <View className={`relative px-3 ${headerHeight} flex items-center justify-between`}>
          {/* 用户信息入口：头像指向设置 */}
          <View
            onClick={() => handleTabChange('settings')}
            className="flex items-center gap-1 pl-1 pr-1.5 py-1 rounded-full flex-shrink-0 hover:bg-gray-100"
          >
            <View className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <User size={13} color={currentTab === 'settings' ? '#2563eb' : '#6b7280'} />
            </View>
            <ChevronDown size={12} color="#9ca3af" />
          </View>

          {/* 主功能标签：绝对定位居中，位置只跟标题栏有关，不被左右两侧的宽度拉扯 */}
          <View
            className={`absolute left-1/2 -translate-x-1/2 flex items-center ${
              ultra ? 'gap-2.5' : compact ? 'gap-4' : 'gap-5'
            }`}
          >
            {tabs.map(({ key, label, Icon }) => (
              <View
                key={key}
                onClick={() => handleTabChange(key)}
                className={`flex items-center py-2 border-b-2 whitespace-nowrap transition-all ${
                  ultra ? 'gap-1 text-xs' : 'gap-1.5 text-sm'
                } ${
                  currentTab === key
                    ? 'border-blue-600 text-blue-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={ultra ? 13 : 15} color={currentTab === key ? '#2563eb' : '#9ca3af'} />
                {label}
              </View>
            ))}
          </View>

          {/* 记录本入口 */}
          <View
            onClick={() => handleTabChange('notebook')}
            className={`flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-all flex-shrink-0 ${
              ultra ? 'px-1.5 py-2 text-xs' : 'px-2 py-2 text-sm'
            } ${
              currentTab === 'notebook'
                ? 'border-blue-600 text-blue-600 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookMarked size={ultra ? 13 : 15} color={currentTab === 'notebook' ? '#2563eb' : '#9ca3af'} />
            记录本
          </View>
        </View>
      </View>

      {/* Page Content */}
      <View className="flex-1 overflow-hidden">
        <Outlet />
      </View>
    </View>
  );
}
