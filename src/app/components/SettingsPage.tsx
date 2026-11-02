import { useState } from 'react';
import { User, Settings, Info, ChevronRight, Bell, Globe, Mic, Volume2, Database, Shield, Mail, MessageCircle, FileText, ExternalLink, Users, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useNavigate } from 'react-router';
import { FollowingList } from './FollowingList';
import { MessageCenter } from './MessageCenter';

type TabType = 'profile' | 'settings' | 'following' | 'messages' | 'about';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [notifications, setNotifications] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [showFollowing, setShowFollowing] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex gap-2">
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('profile')}
            className="gap-2"
          >
            <User className="w-4 h-4" />
            我的
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('settings')}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            设置
          </Button>
          <Button
            variant={activeTab === 'following' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('following')}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            关注
          </Button>
          <Button
            variant={activeTab === 'messages' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('messages')}
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            消息
          </Button>
          <Button
            variant={activeTab === 'about' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('about')}
            className="gap-2"
          >
            <Info className="w-4 h-4" />
            帮助与关于
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-4">
            {/* User Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    用
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">访客用户</h3>
                    <p className="text-sm text-gray-500">未登录</p>
                  </div>
                  <Button variant="outline" size="sm">
                    登录
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">使用天数</span>
                    <span className="font-medium">7 天</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">翻译次数</span>
                    <span className="font-medium">156 次</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">学习记录</span>
                    <span className="font-medium">23 条</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-3">快捷功能</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Database className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">我的数据</p>
                        <p className="text-xs text-gray-500">查看和管理个人数据</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">隐私安全</p>
                        <p className="text-xs text-gray-500">隐私设置和数据安全</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button 
                    onClick={() => navigate('/messages')}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">消息中心</p>
                        <p className="text-xs text-gray-500">查看所有通知和提醒</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Following List */}
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-3">关注列表</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowFollowing(!showFollowing)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {showFollowing ? '隐藏关注列表' : '查看关注列表'}
                  </Button>
                </div>
                {showFollowing && <FollowingList />}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-4">
            {/* General Settings */}
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  通用设置
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="notifications" className="font-medium">
                        消息通知
                      </Label>
                      <p className="text-sm text-gray-500">接收应用通知和提醒</p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="auto-translate" className="font-medium">
                        自动翻译
                      </Label>
                      <p className="text-sm text-gray-500">实时翻译模式默认开启</p>
                    </div>
                    <Switch
                      id="auto-translate"
                      checked={autoTranslate}
                      onCheckedChange={setAutoTranslate}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="save-history" className="font-medium">
                        保存历史记录
                      </Label>
                      <p className="text-sm text-gray-500">自动保存对话和翻译记录</p>
                    </div>
                    <Switch
                      id="save-history"
                      checked={saveHistory}
                      onCheckedChange={setSaveHistory}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice Settings */}
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  语音设置
                </h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-gray-600" />
                      <div className="text-left">
                        <p className="font-medium text-sm">语音识别语言</p>
                        <p className="text-xs text-gray-500">当前：自动检测</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Mic className="w-5 h-5 text-gray-600" />
                      <div className="text-left">
                        <p className="font-medium text-sm">语音输入设置</p>
                        <p className="text-xs text-gray-500">麦克风权限和音质</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  数据管理
                </h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    导出我的数据
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <Database className="w-4 h-4 mr-2" />
                    清除所有数据
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  消息通知设置
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="notify-resource" className="font-medium">
                        新资源通知
                      </Label>
                      <p className="text-sm text-gray-500">关注的用户发布新课程时通知我</p>
                    </div>
                    <Switch id="notify-resource" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="notify-comment" className="font-medium">
                        评论通知
                      </Label>
                      <p className="text-sm text-gray-500">有人回复我的评论时通知我</p>
                    </div>
                    <Switch id="notify-comment" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor="notify-follow" className="font-medium">
                        关注通知
                      </Label>
                      <p className="text-sm text-gray-500">有新用户关注我时通知我</p>
                    </div>
                    <Switch id="notify-follow" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'following' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <FollowingList />
          </div>
        )}

        {activeTab === 'messages' && (
          <MessageCenter embedded />
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl mx-auto space-y-4">
            {/* App Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    方
                  </div>
                  <h3 className="font-bold text-xl mb-1">方言助手</h3>
                  <p className="text-sm text-gray-500 mb-2">多语言混杂智能识别</p>
                  <Badge variant="secondary">版本 1.0.0</Badge>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-center text-sm text-gray-600">
                  <p>一款专注于方言和多语言翻译的智能助手</p>
                  <p>支持实时语音识别、智能翻译和学习辅助</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-4">快速入门</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <h5 className="font-medium text-sm text-blue-900 mb-1">如何开始使用？</h5>
                    <p className="text-sm text-blue-700">点击"方言查询"开始对话，或使用"学习区"浏览方言学习资源。</p>
                  </div>

                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                    <h5 className="font-medium text-sm text-purple-900 mb-1">实时翻译功能</h5>
                    <p className="text-sm text-purple-700">在对话页面切换到实时翻译模式，支持多人多语言实时识别和翻译。</p>
                  </div>

                  <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                    <h5 className="font-medium text-sm text-green-900 mb-1">保存学习记录</h5>
                    <p className="text-sm text-green-700">点击消息旁的书签图标可以保存到记录本，方便日后复习。</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-4">联系我们</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    发送反馈
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    在线客服
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Legal */}
            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-3">法律信息</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-sm">用户协议</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-sm">隐私政策</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-sm">开源许可</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Copyright */}
            <div className="text-center text-xs text-gray-500 py-4">
              <p>© 2026 方言助手. All rights reserved.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}