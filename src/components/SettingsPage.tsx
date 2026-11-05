import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { User, Settings, Info, ChevronRight, Bell, Globe, Mic, Volume2, Database, Mail, MessageCircle, FileText, ExternalLink, Users } from './ui/icons';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { FollowingList } from './FollowingList';
import { MessageCenter } from './MessageCenter';
import { useDeviceLayout } from '../utils/deviceTier';

type TabType = 'profile' | 'settings' | 'following' | 'messages' | 'about';

export function SettingsPage() {
  const { metrics } = useDeviceLayout();
  const { compact } = metrics;
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [notifications, setNotifications] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* Tabs */}
      <View className="bg-white border-b border-gray-200">
        <View className={`px-4 py-3 flex gap-4 ${compact ? 'flex-wrap justify-center' : ''}`}>
          {(
            [
              { key: 'profile', label: '我的', Icon: User },
              { key: 'settings', label: '设置', Icon: Settings },
              { key: 'following', label: '关注', Icon: Users },
              { key: 'messages', label: '消息', Icon: MessageCircle },
              { key: 'about', label: '帮助与关于', Icon: Info },
            ] as const
          ).map(({ key, label, Icon }) => (
            <View
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1 py-1 border-b-2 whitespace-nowrap text-sm transition-all ${
                activeTab === key
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={15} color={activeTab === key ? '#2563eb' : '#9ca3af'} />
              {label}
            </View>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView scrollY className="flex-1 p-4">
        {activeTab === 'profile' && (
          <View className="max-w-2xl mx-auto space-y-4">
            {/* User Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <View className="flex items-center gap-4 mb-4">
                  <View className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    用
                  </View>
                  <View className="flex-1">
                    <Text className="block font-semibold text-lg">访客用户</Text>
                    <Text className="block text-sm text-gray-500">未登录</Text>
                  </View>
                  <Button variant="outline" size="sm">
                    登录
                  </Button>
                </View>
                <Separator className="my-4" />
                <View className="space-y-3">
                  <View className="flex items-center justify-between">
                    <Text className="text-sm text-gray-600">使用天数</Text>
                    <Text className="font-medium">7 天</Text>
                  </View>
                  <View className="flex items-center justify-between">
                    <Text className="text-sm text-gray-600">翻译次数</Text>
                    <Text className="font-medium">156 次</Text>
                  </View>
                  <View className="flex items-center justify-between">
                    <Text className="text-sm text-gray-600">学习记录</Text>
                    <Text className="font-medium">23 条</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

          </View>
        )}

        {activeTab === 'settings' && (
          <View className="max-w-2xl mx-auto space-y-4">
            {/* General Settings */}
            <Card>
              <CardContent className="pt-4">
                <Text className="font-medium mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  通用设置
                </Text>
                <View className="space-y-4">
                  <View className="flex items-center justify-between">
                    <View className="flex-1">
                      <Label htmlFor="notifications" className="font-medium">
                        消息通知
                      </Label>
                      <Text className="block text-sm text-gray-500">接收应用通知和提醒</Text>
                    </View>
                    <Switch
                      id="notifications"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </View>

                  <Separator />

                  <View className="flex items-center justify-between">
                    <View className="flex-1">
                      <Label htmlFor="auto-translate" className="font-medium">
                        自动翻译
                      </Label>
                      <Text className="block text-sm text-gray-500">实时翻译模式默认开启</Text>
                    </View>
                    <Switch
                      id="auto-translate"
                      checked={autoTranslate}
                      onCheckedChange={setAutoTranslate}
                    />
                  </View>

                  <Separator />

                  <View className="flex items-center justify-between">
                    <View className="flex-1">
                      <Label htmlFor="save-history" className="font-medium">
                        保存历史记录
                      </Label>
                      <Text className="block text-sm text-gray-500">自动保存对话和翻译记录</Text>
                    </View>
                    <Switch
                      id="save-history"
                      checked={saveHistory}
                      onCheckedChange={setSaveHistory}
                    />
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Voice Settings */}
            <Card>
              <CardContent className="pt-4">
                <Text className="font-medium mb-4 flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  语音设置
                </Text>
                <View className="space-y-3">
                  <View className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <View className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-gray-600" />
                      <View className="text-left">
                        <Text className="block font-medium text-sm">语音识别语言</Text>
                        <Text className="block text-xs text-gray-500">当前：自动检测</Text>
                      </View>
                    </View>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </View>

                  <View className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <View className="flex items-center gap-3">
                      <Mic className="w-5 h-5 text-gray-600" />
                      <View className="text-left">
                        <Text className="block font-medium text-sm">语音输入设置</Text>
                        <Text className="block text-xs text-gray-500">麦克风权限和音质</Text>
                      </View>
                    </View>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardContent className="pt-4">
                <Text className="font-medium mb-4 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  数据管理
                </Text>
                <View className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    导出我的数据
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <Database className="w-4 h-4 mr-2" />
                    清除所有数据
                  </Button>
                </View>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardContent className="pt-4">
                <Text className="font-medium mb-4 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  消息通知设置
                </Text>
                <View className="space-y-4">
                  <View className="flex items-center justify-between">
                    <View className="flex-1">
                      <Label htmlFor="notify-resource" className="font-medium">
                        新资源通知
                      </Label>
                      <Text className="block text-sm text-gray-500">关注的用户发布新课程时通知我</Text>
                    </View>
                    <Switch id="notify-resource" defaultChecked />
                  </View>
                  <Separator />
                  <View className="flex items-center justify-between">
                    <View className="flex-1">
                      <Label htmlFor="notify-comment" className="font-medium">
                        评论通知
                      </Label>
                      <Text className="block text-sm text-gray-500">有人回复我的评论时通知我</Text>
                    </View>
                    <Switch id="notify-comment" defaultChecked />
                  </View>
                  <Separator />
                  <View className="flex items-center justify-between">
                    <View className="flex-1">
                      <Label htmlFor="notify-follow" className="font-medium">
                        关注通知
                      </Label>
                      <Text className="block text-sm text-gray-500">有新用户关注我时通知我</Text>
                    </View>
                    <Switch id="notify-follow" defaultChecked />
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>
        )}

        {activeTab === 'following' && (
          <View className="max-w-2xl mx-auto space-y-4">
            <FollowingList />
          </View>
        )}

        {activeTab === 'messages' && (
          <MessageCenter embedded />
        )}

        {activeTab === 'about' && (
          <View className="max-w-2xl mx-auto space-y-4">
            {/* App Info */}
            <Card>
              <CardContent className="pt-6">
                <View className="text-center mb-6">
                  <View className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    方
                  </View>
                  <Text className="block font-bold text-xl mb-1">方言助手</Text>
                  <Text className="block text-sm text-gray-500 mb-2">多语言混杂智能识别</Text>
                  <Badge variant="secondary">版本 1.0.0</Badge>
                </View>

                <Separator className="my-4" />

                <View className="space-y-3 text-center text-sm text-gray-600">
                  <Text className="block">一款专注于方言和多语言翻译的智能助手</Text>
                  <Text className="block">支持实时语音识别、智能翻译和学习辅助</Text>
                </View>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card>
              <CardContent className="pt-4">
                <Text className="block font-medium mb-4">快速入门</Text>
                <View className="space-y-3">
                  <View className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <Text className="block font-medium text-sm text-blue-900 mb-1">如何开始使用？</Text>
                    <Text className="block text-sm text-blue-700">点击"方言查询"开始对话，或使用"学习区"浏览方言学习资源。</Text>
                  </View>

                  <View className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                    <Text className="block font-medium text-sm text-purple-900 mb-1">实时翻译功能</Text>
                    <Text className="block text-sm text-purple-700">在对话页面切换到实时翻译模式，支持多人多语言实时识别和翻译。</Text>
                  </View>

                  <View className="p-3 rounded-lg bg-green-50 border border-green-100">
                    <Text className="block font-medium text-sm text-green-900 mb-1">保存学习记录</Text>
                    <Text className="block text-sm text-green-700">点击消息旁的书签图标可以保存到记录本，方便日后复习。</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="pt-4">
                <Text className="block font-medium mb-4">联系我们</Text>
                <View className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    发送反馈
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    在线客服
                  </Button>
                </View>
              </CardContent>
            </Card>

            {/* Legal */}
            <Card>
              <CardContent className="pt-4">
                <Text className="block font-medium mb-3">法律信息</Text>
                <View className="space-y-2">
                  <View className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Text className="text-sm">用户协议</Text>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </View>
                  <View className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Text className="text-sm">隐私政策</Text>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </View>
                  <View className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Text className="text-sm">开源许可</Text>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Copyright */}
            <View className="text-center text-xs text-gray-500 py-4">
              <Text className="block">© 2026 方言助手. All rights reserved.</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}