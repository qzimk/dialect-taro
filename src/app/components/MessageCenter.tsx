import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Bell, MessageSquare, Video, CheckCheck, Loader2, UserPlus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Notification {
  id: string;
  type: 'comment' | 'resource' | 'system' | 'follow' | 'like' | 'message';
  userId?: string;
  userName?: string;
  userAvatar?: string;
  fromUserId?: string;
  content: string;
  time?: string;
  timestamp?: string;
  read?: boolean;
  isRead?: boolean;
  targetId?: string;
}

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'demo-1',
    type: 'resource',
    userId: '1',
    userName: '方言达人小张',
    content: '发布了新课程《吴语入门：日常问候》',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isRead: false,
    targetId: 'course-101'
  },
  {
    id: 'demo-2',
    type: 'comment',
    userId: '2',
    userName: '粤语讲古佬',
    content: '回复了你的评论："这个发音确实很有趣！"',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    targetId: 'comment-202'
  },
  {
    id: 'demo-3',
    type: 'system',
    content: '欢迎使用方言助手！完善个人资料可获得更多推荐。',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  }
];

export function MessageCenter({ embedded = false }: { embedded?: boolean }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserId = () => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('userId', id);
    }
    return id;
  };

  const userId = getUserId();

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-286b7334/notifications/${userId}`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const serverNotifs: Notification[] = (data.notifications || []).map((n: any) => ({
          ...n,
          isRead: n.isRead ?? false,
        }));
        // Merge with demo data if server has no entries
        if (serverNotifs.length === 0) {
          setNotifications(DEMO_NOTIFICATIONS);
        } else {
          setNotifications(serverNotifs);
        }
      } else {
        setNotifications(DEMO_NOTIFICATIONS);
      }
    } catch (error) {
      console.error('Failed to fetch notifications for MessageCenter:', error);
      setNotifications(DEMO_NOTIFICATIONS);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

    // If it's a demo notification, skip server call
    if (id.startsWith('demo-')) return;

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-286b7334/notifications/${userId}/${id}/read`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-286b7334/notifications/${userId}/read-all`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }
      );
      toast.success('全部已读');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('操作失败');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (notification: Notification) => {
    if (notification.time) return notification.time;
    if (!notification.timestamp) return '';
    const date = new Date(notification.timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'resource': return <Video className="w-5 h-5 text-blue-500" />;
      case 'comment': case 'message': return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-purple-500" />;
      case 'like': return <Heart className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className={`flex flex-col ${embedded ? '' : 'h-full'} bg-gray-50`}>
      {!embedded && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-lg">消息中心</h1>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-600 hover:bg-red-100">
                {unreadCount} 未读
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="w-4 h-4 mr-1" />
            全部已读
          </Button>
        </div>
      )}

      {embedded && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-lg">消息中心</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-600 hover:bg-red-100">
                {unreadCount} 未读
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="w-4 h-4 mr-1" />
            全部已读
          </Button>
        </div>
      )}

      <div className={`${embedded ? '' : 'p-4'} flex-1 overflow-y-auto max-w-2xl mx-auto w-full space-y-3`}>
        {isLoading ? (
          <div className="flex justify-center items-center py-12 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            加载中...
          </div>
        ) : (
          <>
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                onClick={() => !notification.isRead && markAsRead(notification.id)}
                className={`
                  relative p-4 rounded-xl border transition-all cursor-pointer
                  ${notification.isRead 
                    ? 'bg-white border-gray-100' 
                    : 'bg-blue-50/50 border-blue-100 shadow-sm'
                  }
                `}
              >
                {!notification.isRead && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500" />
                )}
                
                <div className="flex gap-4">
                  {notification.userName ? (
                    <Avatar className="w-10 h-10 border border-gray-200">
                      <AvatarImage src={notification.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.userName}`} />
                      <AvatarFallback>{notification.userName?.[0]}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>
                  )}

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-900">
                        {notification.userName || '系统通知'}
                      </span>
                      <span className="text-xs text-gray-400">{formatTime(notification)}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {notification.content}
                    </p>

                    {notification.type === 'resource' && (
                      <div className="mt-2 inline-flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        <Video className="w-3 h-3 mr-1" />
                        点击查看课程
                      </div>
                    )}
                    {notification.type === 'comment' && (
                      <div className="mt-2 inline-flex items-center text-xs text-gray-500">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        查看详情
                      </div>
                    )}
                    {notification.type === 'follow' && (
                      <div className="mt-2 inline-flex items-center text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                        <UserPlus className="w-3 h-3 mr-1" />
                        新关注
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {notifications.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>暂无新消息</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}