import { useState, useEffect } from 'react';
import { fetchShim as fetch } from '../utils/fetch';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Bell, CheckCheck, MessageSquare, Heart, UserPlus } from './ui/icons';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

import { toast } from './ui/sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useNavigate } from '../utils/router';

type Notification = {
  id: string;
  type: 'system' | 'message' | 'like' | 'follow';
  content: string;
  isRead: boolean;
  timestamp: string;
  fromUserId?: string;
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Get current user ID
  const getUserId = () => {
    let id = Taro.getStorageSync('userId');
    if (!id) {
      id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      Taro.setStorageSync('userId', id);
    }
    return id;
  };

  const userId = getUserId();

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-286b7334/notifications/${userId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const notifs = data.notifications || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n: Notification) => !n.isRead).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Poll for notifications every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-286b7334/notifications/${userId}/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-286b7334/notifications/${userId}/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success('全部已读');
      }
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-red-500" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return date.toLocaleDateString();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <Text className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <View className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50/50">
          <Text className="block font-semibold text-sm">消息通知</Text>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              全部已读
            </Button>
          )}
        </View>
        
        <ScrollArea className="h-[350px]">
          {notifications.length > 0 ? (
            <View className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <View 
                  key={notification.id} 
                  className={`p-3 hover:bg-gray-50 transition-colors relative group ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <View className="flex gap-3">
                    <View className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white border border-gray-100 shadow-sm`}>
                      {getIcon(notification.type)}
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className={`block text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                        {notification.content}
                      </Text>
                      <Text className="block text-xs text-gray-400 mt-1">
                        {formatTime(notification.timestamp)}
                      </Text>
                    </View>
                    {!notification.isRead && (
                      <View className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
              <Bell className="w-10 h-10 mb-2 opacity-20" />
              <Text className="block text-sm">暂无新消息</Text>
            </View>
          )}
        </ScrollArea>

        {/* 查看全部消息入口 */}
        <View className="border-t border-gray-100 p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs"
            onClick={() => {
              setIsOpen(false);
              navigate('/messages');
            }}
          >
            查看全部消息
          </Button>
        </View>
      </PopoverContent>
    </Popover>
  );
}