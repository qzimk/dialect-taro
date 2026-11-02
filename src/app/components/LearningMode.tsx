import { useState } from 'react';
import { BookOpen, Video, FileText, ExternalLink, ChevronRight, Play, Download } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'link' | 'course';
  language: string;
  duration?: string;
  progress?: number;
}

interface PresetCourse {
  id: string;
  title: string;
  language: string;
  level: string;
  lessonsCount: number;
  description: string;
  color: string;
}

export function LearningMode() {
  const [activeSection, setActiveSection] = useState<'preset' | 'recommended'>('preset');

  // 预设课程数据
  const presetCourses: PresetCourse[] = [
    {
      id: '1',
      title: '粤语拼音基础',
      language: '粤语',
      level: '入门',
      lessonsCount: 24,
      description: '从零开始学习粤语拼音系统，包含声母、韵母、声调全面讲解',
      color: 'bg-gradient-to-br from-orange-400 to-red-500',
    },
    {
      id: '2',
      title: '上海话日常用语',
      language: '上海话',
      level: '初级',
      lessonsCount: 18,
      description: '学习上海话常用词汇和日常对话，快速掌握基本交流能力',
      color: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    },
    {
      id: '3',
      title: '闽南语发音技巧',
      language: '闽南语',
      level: '入门',
      lessonsCount: 20,
      description: '掌握闽南语特有的发音方式和语调变化规律',
      color: 'bg-gradient-to-br from-green-400 to-teal-500',
    },
    {
      id: '4',
      title: '四川话进阶',
      language: '四川话',
      level: '中级',
      lessonsCount: 15,
      description: '深入学习四川话的语法特点和地道表达方式',
      color: 'bg-gradient-to-br from-purple-400 to-pink-500',
    },
  ];

  // 推荐学习资源数据
  const recommendedResources: LearningResource[] = [
    {
      id: '1',
      title: '粤语电影经典片段赏析',
      description: '通过经典粤语电影学习地道表达',
      type: 'video',
      language: '粤语',
      duration: '45分钟',
      progress: 60,
    },
    {
      id: '2',
      title: '《现代粤语教程》',
      description: '香港中文大学出版的系统教材',
      type: 'document',
      language: '粤语',
    },
    {
      id: '3',
      title: '方言研究论文集',
      description: '汉语方言学最新研究成果汇总',
      type: 'document',
      language: '通用',
    },
    {
      id: '4',
      title: 'BBC学习粤语',
      description: 'BBC官方粤语学习网站',
      type: 'link',
      language: '粤语',
    },
    {
      id: '5',
      title: '上海话教学视频系列',
      description: '本地老师录制的系统教学视频',
      type: 'video',
      language: '上海话',
      duration: '2小时',
    },
    {
      id: '6',
      title: '闽南语歌曲学习',
      description: '通过经典闽南语歌曲学习发音',
      type: 'video',
      language: '闽南语',
      duration: '30分钟',
      progress: 25,
    },
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'link':
        return <ExternalLink className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return '视频';
      case 'document':
        return '文档';
      case 'link':
        return '外部链接';
      default:
        return '课程';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 切换选项卡 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection('preset')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeSection === 'preset'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            板块学习
          </button>
          <button
            onClick={() => setActiveSection('recommended')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeSection === 'recommended'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            推荐资源
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === 'preset' ? (
          /* 预设课程板块 */
          <div className="p-4 space-y-4">
            <div className="mb-2">
              <h2 className="font-semibold text-gray-900">基础方言课程</h2>
              <p className="text-sm text-gray-500 mt-1">
                系统化学习各地方言的发音、词汇和语法
              </p>
            </div>

            {presetCourses.map((course) => (
              <Card
                key={course.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
              >
                <div className="flex gap-4">
                  <div className={`w-20 h-20 rounded-xl ${course.color} flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {course.language}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.lessonsCount}课时
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 mb-1">更多课程即将推出</h3>
                  <p className="text-sm text-blue-700">
                    我们正在开发更多方言课程，包括客家话、东北话、陕西话等
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 推荐资源板块 */
          <div className="p-4 space-y-4">
            <div className="mb-2">
              <h2 className="font-semibold text-gray-900">推荐学习资源</h2>
              <p className="text-sm text-gray-500 mt-1">
                社区分享的优质学习材料和外部资源
              </p>
            </div>

            {recommendedResources.map((resource) => (
              <Card
                key={resource.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 rounded-lg p-3 flex-shrink-0">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{resource.title}</h3>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {getResourceTypeLabel(resource.type)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {resource.language}
                      </Badge>
                      {resource.duration && (
                        <span className="text-xs text-gray-500">{resource.duration}</span>
                      )}
                    </div>
                    {resource.progress !== undefined && resource.progress > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">学习进度</span>
                          <span className="text-xs font-medium text-blue-600">
                            {resource.progress}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all"
                            style={{ width: `${resource.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <div className="bg-white rounded-full p-2">
                  <Download className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-purple-900 mb-1">分享你的资源</h3>
                  <p className="text-sm text-purple-700 mb-3">
                    上传你的学习资料，帮助更多人学习方言
                  </p>
                  <Button size="sm" variant="outline" className="bg-white">
                    上传资源
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
