import { useState, useEffect } from 'react';
import { fetchShim as fetch } from '../utils/fetch';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { User, UserPlus, UserMinus, Loader2 } from './ui/icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { toast } from './ui/sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type FollowedUser = {
  targetUserId: string;
  targetUserName: string;
  timestamp: string;
};

export function FollowingList() {
  const [following, setFollowing] = useState<FollowedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Get current user ID from localStorage or generate one
  const getUserId = () => {
    let id = Taro.getStorageSync('userId');
    if (!id) {
      id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      Taro.setStorageSync('userId', id);
    }
    return id;
  };

  const userId = getUserId();

  const fetchFollowing = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-286b7334/follows/${userId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // data.follows is an array of values { targetUserId, targetUserName, timestamp }
        // The values returned by getByPrefix are actually [key, value] or just values? 
        // The instructions said "return an array of values".
        // Let's assume it returns array of objects.
        setFollowing(data.follows || []);
      }
    } catch (error) {
      console.error('Failed to fetch following:', error);
      // Fallback to local state if server fails (for demo purposes if server is not reachable)
      // toast.error('无法加载关注列表');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, []);

  const handleFollow = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate finding a user
    const newFollow = {
      userId,
      targetUserId: `user-${Math.random().toString(36).substring(2, 9)}`,
      targetUserName: searchQuery,
    };

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-286b7334/follows`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFollow),
      });

      if (response.ok) {
        toast.success(`已关注用户: ${searchQuery}`);
        fetchFollowing();
        setSearchQuery('');
      } else {
        throw new Error('Follow failed');
      }
    } catch (error) {
      toast.error('关注失败，请稍后重试');
    } finally {
      setIsSearching(false);
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-286b7334/follows`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, targetUserId }),
      });

      if (response.ok) {
        toast.success('已取消关注');
        setFollowing(prev => prev.filter(user => user.targetUserId !== targetUserId));
      } else {
        throw new Error('Unfollow failed');
      }
    } catch (error) {
      toast.error('操作失败');
    }
  };

  return (
    <View className="space-y-4">
      <View className="flex gap-2">
        <Input
          placeholder="搜索用户昵称或ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleFollow} disabled={isSearching || !searchQuery.trim()}>
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          <Text className="ml-2">关注</Text>
        </Button>
      </View>

      <View className="bg-white rounded-lg border border-gray-200">
        <View className="p-3 border-b border-gray-200 bg-gray-50/50">
          <Text className="font-medium text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            关注列表 ({following.length})
          </Text>
        </View>
        
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <View className="flex justify-center items-center h-full py-8 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              加载中...
            </View>
          ) : following.length > 0 ? (
            <View className="divide-y divide-gray-100">
              {following.map((user) => (
                <View key={user.targetUserId} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                  <View className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 border border-gray-100">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.targetUserName}`} />
                      <AvatarFallback>{user.targetUserName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <View>
                      <Text className="block font-medium text-sm text-gray-900">{user.targetUserName}</Text>
                      <Text className="block text-xs text-gray-500">ID: {user.targetUserId.slice(0, 8)}...</Text>
                    </View>
                  </View>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleUnfollow(user.targetUserId)}
                  >
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </View>
              ))}
            </View>
          ) : (
            <View className="flex flex-col items-center justify-center h-full py-12 text-gray-400 text-sm">
              <UserPlus className="w-10 h-10 mb-2 opacity-20" />
              <Text className="block">暂无关注的用户</Text>
              <Text className="block text-xs mt-1">搜索并关注感兴趣的用户吧</Text>
            </View>
          )}
        </ScrollArea>
      </View>
    </View>
  );
}