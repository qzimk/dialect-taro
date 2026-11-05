import { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, type ITouchEvent } from '@tarojs/components';
import {
  BookOpen, Video, FileText, ExternalLink, ChevronRight, Play, Download,
  Clock, CheckCircle, Lock, Volume2, Mic, Star, ArrowLeft,
  Headphones, MessageSquare, ListChecks, Trophy, RotateCcw,
  Heart, Send, Pause, Maximize, VolumeX, ThumbsUp, User
} from './ui/icons';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator
} from './ui/breadcrumb';

// ============= 类型定义 =============
interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
}

interface LessonSection {
  title: string;
  lessons: Lesson[];
}

interface CourseDetail {
  id: string;
  title: string;
  language: string;
  level: string;
  color: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  sections: LessonSection[];
}

interface LessonContent {
  id: string;
  title: string;
  courseTitle: string;
  type: 'pronunciation' | 'vocabulary' | 'conversation' | 'quiz';
  sections: LessonContentSection[];
}

interface LessonContentSection {
  type: 'intro' | 'audio' | 'vocab' | 'practice' | 'quiz' | 'tip';
  title: string;
  content?: string;
  items?: VocabItem[];
  questions?: QuizQuestion[];
}

interface VocabItem {
  original: string;
  pronunciation: string;
  meaning: string;
  example?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'link' | 'course';
  language: string;
  duration?: string;
  progress?: number;
}

interface ResourceDetail {
  id: string;
  title: string;
  type: string;
  language: string;
  description: string;
  content: ResourceContentSection[];
}

interface ResourceContentSection {
  type: 'text' | 'video' | 'list' | 'highlight';
  title?: string;
  content?: string;
  items?: string[];
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

// ============= 导航状态 =============
type ViewState =
  | { view: 'main' }
  | { view: 'course'; courseId: string }
  | { view: 'lesson'; courseId: string; lessonId: string }
  | { view: 'resource'; resourceId: string };

// ============= 数据 =============
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

const courseDetails: Record<string, CourseDetail> = {
  '1': {
    id: '1', title: '粤语拼音基础', language: '粤语', level: '入门',
    color: 'bg-gradient-to-br from-orange-400 to-red-500',
    description: '从零开始学习粤语拼音系统，包含声母、韵母、声调全面讲解。本课程由香港中文大学语言学博士设计，循序渐进，适合零基础学员。',
    totalLessons: 24, completedLessons: 5,
    sections: [
      {
        title: '第一章：声母',
        lessons: [
          { id: '1-1', title: '粤语声母概述 — b/p/m/f', duration: '8分钟', completed: true, locked: false },
          { id: '1-2', title: '声母 d/t/n/l 的发音', duration: '10分钟', completed: true, locked: false },
          { id: '1-3', title: '声母 g/k/ng/h 的区别', duration: '12分钟', completed: true, locked: false },
          { id: '1-4', title: '声母 gw/kw/w 唇化音', duration: '9分钟', completed: false, locked: false },
          { id: '1-5', title: '声母 z/c/s 舌尖音', duration: '11分钟', completed: false, locked: false },
          { id: '1-6', title: '声母综合练习', duration: '15分钟', completed: false, locked: false },
        ],
      },
      {
        title: '第二章：韵母',
        lessons: [
          { id: '2-1', title: '单韵母 aa/a/e/i/o/u', duration: '10分钟', completed: true, locked: false },
          { id: '2-2', title: '复韵母 aai/aau/ai/au', duration: '12分钟', completed: true, locked: false },
          { id: '2-3', title: '鼻韵母 -m/-n/-ng', duration: '11分钟', completed: false, locked: false },
          { id: '2-4', title: '入声韵母 -p/-t/-k', duration: '13分钟', completed: false, locked: false },
          { id: '2-5', title: '韵母综合练习', duration: '15分钟', completed: false, locked: false },
        ],
      },
      {
        title: '第三章：声调',
        lessons: [
          { id: '3-1', title: '粤语六声调入门', duration: '14分钟', completed: false, locked: false },
          { id: '3-2', title: '阴平、阴上、阴去', duration: '12分钟', completed: false, locked: true },
          { id: '3-3', title: '阳平、阳上、阳去', duration: '12分钟', completed: false, locked: true },
          { id: '3-4', title: '声调辨析与模仿练习', duration: '18分钟', completed: false, locked: true },
        ],
      },
    ],
  },
  '2': {
    id: '2', title: '上海话日常用语', language: '上海话', level: '初级',
    color: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    description: '学习上海话常用词汇和日常对话，通过场景化教学快速掌握基本交流能力。课程涵盖问候、购物、用餐等常见情景。',
    totalLessons: 18, completedLessons: 2,
    sections: [
      {
        title: '第一章：基础问候',
        lessons: [
          { id: '2-1-1', title: '打招呼与自我介绍', duration: '10分钟', completed: true, locked: false },
          { id: '2-1-2', title: '常用寒暄语', duration: '8分钟', completed: true, locked: false },
          { id: '2-1-3', title: '告别用语', duration: '7分钟', completed: false, locked: false },
          { id: '2-1-4', title: '情景对话练习', duration: '12分钟', completed: false, locked: false },
        ],
      },
      {
        title: '第二章：日常生活',
        lessons: [
          { id: '2-2-1', title: '数字与时间表达', duration: '11分钟', completed: false, locked: false },
          { id: '2-2-2', title: '买东西（购物用语）', duration: '13分钟', completed: false, locked: false },
          { id: '2-2-3', title: '吃饭点菜', duration: '12分钟', completed: false, locked: false },
          { id: '2-2-4', title: '问路与交通', duration: '10分钟', completed: false, locked: true },
        ],
      },
      {
        title: '第三章：社交场景',
        lessons: [
          { id: '2-3-1', title: '家庭称呼', duration: '9分钟', completed: false, locked: true },
          { id: '2-3-2', title: '表达情感与态度', duration: '11分钟', completed: false, locked: true },
          { id: '2-3-3', title: '上海俚语趣谈', duration: '14分钟', completed: false, locked: true },
        ],
      },
    ],
  },
  '3': {
    id: '3', title: '闽南语发音技巧', language: '闽南语', level: '入门',
    color: 'bg-gradient-to-br from-green-400 to-teal-500',
    description: '掌握闽南语特有的发音方式和语调变化规律。闽南语有七个声调、丰富的鼻化韵，本课程将逐一突破。',
    totalLessons: 20, completedLessons: 0,
    sections: [
      {
        title: '第一章：闽南语概览',
        lessons: [
          { id: '3-1-1', title: '闽南语的分布与特点', duration: '8分钟', completed: false, locked: false },
          { id: '3-1-2', title: '闽南语拼音方案介绍', duration: '10分钟', completed: false, locked: false },
          { id: '3-1-3', title: '声母系统', duration: '12分钟', completed: false, locked: false },
        ],
      },
      {
        title: '第二章：韵母与声调',
        lessons: [
          { id: '3-2-1', title: '基本韵母', duration: '11分钟', completed: false, locked: false },
          { id: '3-2-2', title: '鼻化韵特训', duration: '14分钟', completed: false, locked: false },
          { id: '3-2-3', title: '七声调详解', duration: '16分钟', completed: false, locked: true },
          { id: '3-2-4', title: '变调规律', duration: '15分钟', completed: false, locked: true },
        ],
      },
      {
        title: '第三章：实战发音',
        lessons: [
          { id: '3-3-1', title: '日常词汇跟读', duration: '12分钟', completed: false, locked: true },
          { id: '3-3-2', title: '经典闽南语歌曲学习', duration: '18分钟', completed: false, locked: true },
          { id: '3-3-3', title: '综合发音测试', duration: '20分钟', completed: false, locked: true },
        ],
      },
    ],
  },
  '4': {
    id: '4', title: '四川话进阶', language: '四川话', level: '中级',
    color: 'bg-gradient-to-br from-purple-400 to-pink-500',
    description: '深入学习四川话的语法特点和地道表达方式。适合已有基础的学员，通过俚语、歇后语和文化背景深入理解四川方言。',
    totalLessons: 15, completedLessons: 3,
    sections: [
      {
        title: '第一章：语音进阶',
        lessons: [
          { id: '4-1-1', title: '四川话声调回顾', duration: '8分钟', completed: true, locked: false },
          { id: '4-1-2', title: '儿化音与语气词', duration: '10分钟', completed: true, locked: false },
          { id: '4-1-3', title: '地区口音差异', duration: '12分钟', completed: true, locked: false },
        ],
      },
      {
        title: '第二章：地道表达',
        lessons: [
          { id: '4-2-1', title: '常用四川话俚语', duration: '14分钟', completed: false, locked: false },
          { id: '4-2-2', title: '四川歇后语精选', duration: '11分钟', completed: false, locked: false },
          { id: '4-2-3', title: '夸人与损人的艺术', duration: '13分钟', completed: false, locked: false },
          { id: '4-2-4', title: '美食相关表达', duration: '10分钟', completed: false, locked: false },
        ],
      },
      {
        title: '第三章：文化深度',
        lessons: [
          { id: '4-3-1', title: '四川话与巴蜀文化', duration: '15分钟', completed: false, locked: true },
          { id: '4-3-2', title: '川剧中的方言元素', duration: '18分钟', completed: false, locked: true },
          { id: '4-3-3', title: '四川话幽默故事', duration: '12分钟', completed: false, locked: true },
        ],
      },
    ],
  },
};

const lessonContents: Record<string, LessonContent> = {
  '1-1': {
    id: '1-1', title: '粤语声母概述 — b/p/m/f', courseTitle: '粤语拼音基础',
    type: 'pronunciation',
    sections: [
      { type: 'intro', title: '课程简介', content: '本节课将学习粤语最基础的四个声母：b、p、m、f。这些声母的发音方式与普通话基本相似，是入门粤语的最佳起点。' },
      {
        type: 'vocab', title: '声母对照表',
        items: [
          { original: 'b [巴]', pronunciation: 'baa1', meaning: '不送气双唇塞音，如普通话"八"的声母', example: '巴士 baa1 si2' },
          { original: 'p [怕]', pronunciation: 'paa3', meaning: '送气双唇塞音，如普通话"趴"的声母', example: '怕 paa3' },
          { original: 'm [妈]', pronunciation: 'maa1', meaning: '双唇鼻音，如普通话"妈"的声母', example: '妈妈 maa1 maa1' },
          { original: 'f [花]', pronunciation: 'faa1', meaning: '唇齿擦音，如普通话"发"的声母', example: '花 faa1' },
        ],
      },
      { type: 'audio', title: '跟读练习', content: '请点击下方播放按钮，仔细听每个声母的发音，然后跟读模仿。注意 b 和 p 的送气区别。' },
      { type: 'practice', title: '发音练习', content: '现在请尝试朗读以下词语，注意声母的准确发音：\n\n1. 巴士 (baa1 si2) — 公共汽车\n2. 怕丑 (paa3 cau2) — 害羞\n3. 买嘢 (maai5 je5) — 买东西\n4. 飞机 (fei1 gei1) — 飞机' },
      { type: 'tip', title: '学习小贴士', content: '💡 粤语的 b/p 和普通话的 b/p 基本一致。关键区别在于：粤语有些字的声母与普通话不同，例如普通话"飞"是 fēi，粤语也是 fei1，但"花"普通话是 huā，粤语却是 faa1。建议多听多模仿，培养语感。' },
    ],
  },
  '1-2': {
    id: '1-2', title: '声母 d/t/n/l 的发音', courseTitle: '粤语拼音基础',
    type: 'pronunciation',
    sections: [
      { type: 'intro', title: '课程简介', content: '本节学习舌尖音声母 d、t、n、l。粤语的 n/l 区分非常重要，很多地区的粤语会混淆这两个音，但标准粤语中它们是完全不同的。' },
      {
        type: 'vocab', title: '声母对照表',
        items: [
          { original: 'd [打]', pronunciation: 'daa2', meaning: '不送气舌尖塞音', example: '大 daai6' },
          { original: 't [他]', pronunciation: 'taa1', meaning: '送气舌尖塞音', example: '太阳 taai3 joeng4' },
          { original: 'n [那]', pronunciation: 'naa5', meaning: '舌尖鼻音（鼻腔共鸣）', example: '你 nei5' },
          { original: 'l [啦]', pronunciation: 'laa1', meaning: '舌尖边音（气流从两侧出）', example: '嚟 lei4（来）' },
        ],
      },
      { type: 'practice', title: 'n/l 辨音练习', content: '粤语中 n 和 l 的区分至关重要，请仔细辨别：\n\n• 你 (nei5) vs 李 (lei5)\n• 男 (naam4) vs 蓝 (laam4)\n• 年 (nin4) vs 连 (lin4)\n• 脑 (nou5) vs 老 (lou5)\n\n发 n 时用鼻音，手指捏住鼻子会感到振动；发 l 时气流从舌头两侧流出。' },
      { type: 'tip', title: '学习小贴士', content: '💡 许多广州年轻人会将 n 读成 l（懒音现象），例如"你"读成 lei5。学习时建议按标准发音练习，可以用"捏鼻法"检测：发 n 时捏住鼻子声音会变，发 l 则不会。' },
    ],
  },
  '1-3': {
    id: '1-3', title: '声母 g/k/ng/h 的区别', courseTitle: '粤语拼音基础',
    type: 'pronunciation',
    sections: [
      { type: 'intro', title: '课程简介', content: '本节学习舌根音声母。粤语保留了古汉语的 ng 声母（疑母），这是粤语区别于普通话的一大特点。' },
      {
        type: 'vocab', title: '声母发音要点',
        items: [
          { original: 'g [家]', pronunciation: 'gaa1', meaning: '不送气舌根塞音', example: '家 gaa1、哥 go1' },
          { original: 'k [卡]', pronunciation: 'kaa1', meaning: '送气舌根塞音', example: '开 hoi1、可 ho2' },
          { original: 'ng [我]', pronunciation: 'ngo5', meaning: '舌根鼻音（粤语特色）', example: '我 ngo5、牛 ngau4' },
          { original: 'h [河]', pronunciation: 'ho4', meaning: '喉擦音', example: '好 hou2、喝 hot3' },
        ],
      },
      { type: 'practice', title: 'ng 声母专练', content: 'ng 声母是粤语学习的一个难点，普通话中不存在这个声母。\n\n练习方法：先发"嗯"（ng），保持这个鼻音共鸣，然后自然过渡到后面的韵母。\n\n• 我 ngo5\n• 牛 ngau4\n• 咬 ngaau5\n• 眼 ngaan5\n• 硬 ngaang6' },
      { type: 'tip', title: '学习小贴士', content: '💡 ng 声母在粤语中非常常见。一个好的练习方法是反复说"五 ng5"这个字，因为它只有 ng 声母加一个简单韵母，容易掌握。掌握后再扩展到其他 ng 声母的字。' },
    ],
  },
  '2-1-1': {
    id: '2-1-1', title: '打招呼与自我介绍', courseTitle: '上海话日常用语',
    type: 'conversation',
    sections: [
      { type: 'intro', title: '课程简介', content: '学习用上海话进行基本的打招呼和自我介绍。上海话的问候方式既有传统用法，也有受普通话影响的现代表达。' },
      {
        type: 'vocab', title: '核心词汇',
        items: [
          { original: '侬好', pronunciation: 'nong hao', meaning: '你好', example: '侬好！我是小王。' },
          { original: '阿拉', pronunciation: 'a la', meaning: '我们/我', example: '阿拉是上海人。' },
          { original: '啥人', pronunciation: 'sa nin', meaning: '谁/什么人', example: '侬是啥人？' },
          { original: '叫啥名字', pronunciation: 'jiao sa ming zi', meaning: '叫什么名字', example: '侬叫啥名字？' },
          { original: '欢喜', pronunciation: 'hue xi', meaning: '喜欢', example: '阿拉欢喜上海。' },
        ],
      },
      { type: 'practice', title: '情景对话', content: '请跟读以下对话：\n\n👤 A：侬好！侬叫啥名字？\n👤 B：侬好！阿拉叫小明。侬呢？\n👤 A：阿拉叫小红，阿拉是上海人。\n👤 B：阿拉是苏州人，来上海读书个。\n👤 A：噢！欢迎欢迎！' },
      { type: 'tip', title: '文化小知识', content: '💡 上海话中"阿拉"既可以表示"我们"，也可以在非正式场合表示"我"。这是上海话最有标识性的词汇之一。另外，上海人见面常说"侬好"，相对正式；熟人之间可能直接说"嗨，来了啊"。' },
    ],
  },
  '2-1-2': {
    id: '2-1-2', title: '常用寒暄语', courseTitle: '上海话日常用语',
    type: 'conversation',
    sections: [
      { type: 'intro', title: '课程简介', content: '学习上海话中最常用的寒暄语和客套话，掌握日常社交的基本用语。' },
      {
        type: 'vocab', title: '寒暄用语',
        items: [
          { original: '吃过了伐？', pronunciation: 'qie gu le va?', meaning: '吃了吗？（经典问候）', example: '侬吃过了伐？' },
          { original: '老好个', pronunciation: 'lao hao ge', meaning: '很好的', example: '阿拉老好个！' },
          { original: '谢谢侬', pronunciation: 'xia xia nong', meaning: '谢谢你', example: '谢谢侬帮忙。' },
          { original: '勿要客气', pronunciation: 've yao ka qi', meaning: '不要客气', example: '勿要客气！' },
          { original: '再会', pronunciation: 'ze we', meaning: '再见', example: '好个，再会！' },
        ],
      },
      { type: 'practice', title: '模拟寒暄', content: '试着用上海话回应以下场景：\n\n1. 邻居问你"吃过了伐？" → 你可以回答"吃过了，侬呢？"\n2. 朋友帮了你一个忙 → "谢谢侬！"\n3. 对方说谢谢 → "勿要客气！"\n4. 道别时 → "再会！下趟再来白相！"（再见！下次再来玩！）' },
    ],
  },
  '4-2-1': {
    id: '4-2-1', title: '常用四川话俚语', courseTitle: '四川话进阶',
    type: 'vocabulary',
    sections: [
      { type: 'intro', title: '课程简介', content: '四川话拥有丰富多彩的俚语表达，生动形象、幽默风趣。本节精选最常用的俚语，帮你说出更地道的四川话。' },
      {
        type: 'vocab', title: '高频俚语',
        items: [
          { original: '巴适', pronunciation: 'bā shì', meaning: '舒服、好、棒', example: '这顿火锅巴适得板！' },
          { original: '安逸', pronunciation: 'ān yì', meaning: '舒服、满意', example: '今天不上班，安逸惨了。' },
          { original: '耙耳朵', pronunciation: 'pá ěr duo', meaning: '怕老婆的人', example: '他就是个耙耳朵。' },
          { original: '摆龙门阵', pronunciation: 'bǎi lóng mén zhèn', meaning: '聊天、闲谈', example: '来嘛，坐到摆龙门阵。' },
          { original: '瓜兮兮', pronunciation: 'guā xī xī', meaning: '傻乎乎、呆头呆脑', example: '你做啥子瓜兮兮的？' },
          { original: '要得', pronunciation: 'yào de', meaning: '好的、可以、行', example: 'A：明天去耍？B：要得！' },
        ],
      },
      { type: 'practice', title: '情景运用', content: '用四川话俚语填空：\n\n1. 这家串串味道太___了！（答：巴适）\n2. 周末在家睡到自然醒，___得很。（答：安逸）\n3. 老张啥都听他媳妇的，是个典型的___。（答：耙耳朵）\n4. 大家围到一起___，讲不完的笑话。（答：摆龙门阵）\n5. A：走，吃火锅去？B：___！（答：要得）' },
      { type: 'tip', title: '使用提醒', content: '💡 "巴适"和"安逸"是四川话中使用频率最高的两个词，几乎可以用在所有表达"好"的场景。"巴适得板"是最高级表达，相当于"太棒了"。在成都茶馆里"摆龙门阵"是最典型的休闲方式。' },
    ],
  },
};

const recommendedResources: LearningResource[] = [
  { id: '1', title: '粤语电影经典片段赏析', description: '通过经典粤语电影学习地道表达', type: 'video', language: '粤语', duration: '45分钟', progress: 60 },
  { id: '2', title: '《现代粤语教程》', description: '香港中文大学出版的系统教材', type: 'document', language: '粤语' },
  { id: '3', title: '方言研究论文集', description: '汉语方言学最新研究成果汇总', type: 'document', language: '通用' },
  { id: '4', title: 'BBC学习粤语', description: 'BBC官方粤语学习网站', type: 'link', language: '粤语' },
  { id: '5', title: '上海话教学视频系列', description: '本地老师录制的系统教学视频', type: 'video', language: '上海话', duration: '2小时' },
  { id: '6', title: '闽南语歌曲学习', description: '通过经典闽南语歌曲学习发音', type: 'video', language: '闽南语', duration: '30分钟', progress: 25 },
];

const resourceDetails: Record<string, ResourceDetail> = {
  '1': {
    id: '1', title: '粤语电影经典片段赏析', type: '视频课程', language: '粤语',
    description: '精选 10 部经典粤语电影片段，通过真实场景学习地道粤语表达。每个片段配有粤语字幕、普通话翻译和重点词汇解析。',
    content: [
      { type: 'highlight', title: '课程亮点', content: '🎬 真实电影场景，沉浸式学习\n📝 逐句粤语字幕 + 普通话翻译\n🔤 重点词汇与俚语标注\n🔊 可调速播放，反复练听' },
      { type: 'list', title: '片段目录', items: [
        '1. 《少林足球》— 经典搞笑对白（入门）',
        '2. 《无间道》— 警匪对话（中级）',
        '3. 《功夫》— 市井生活用语（入门）',
        '4. 《食神》— 美食相关表达（初级）',
        '5. 《大话西游》— 经典独白赏析（中级）',
        '6. 《岁月神偷》— 家庭日常对话（初级）',
        '7. 《桃姐》— 温情表达（中级）',
        '8. 《寒战》— 职场正式用语（高级）',
        '9. 《麦路人》— 社会题材对白（高级）',
        '10. 《综合复习》— 精选混剪（通用）',
      ]},
      { type: 'text', title: '学习建议', content: '建议按从易到难的顺序学习。第一遍看完整片段理解剧情，第二遍逐句跟读，第三遍尝试不看字幕理解。每天学习 1-2 个片段为宜。' },
    ],
  },
  '2': {
    id: '2', title: '《现代粤语教程》', type: '电子教材', language: '粤语',
    description: '香港中文大学语言学系编写的权威粤语教材，体系完整，从入门到进阶全面覆盖。',
    content: [
      { type: 'highlight', title: '教材特色', content: '📚 权威机构出品，学术严谨\n🎯 系统化教学，循序渐进\n💿 配套录音材料\n📝 每章含练习题与答案' },
      { type: 'list', title: '教材目录', items: [
        '第一部分：语音篇（第1-6章）',
        '　第1章 粤语拼音系统',
        '　第2章 声母详解',
        '　第3章 韵母详解',
        '　第4章 声调系统',
        '　第5章 连读变调',
        '　第6章 语音综合训练',
        '第二部分：词汇篇（第7-12章）',
        '　第7章 日常基础词汇',
        '　第8章 量词与代词',
        '　第9章 动词与形容词',
        '第三部分：语法篇（第13-18章）',
        '第四部分：会话篇（第19-24章）',
      ]},
      { type: 'text', title: '适用人群', content: '适合零基础到中级水平的粤语学习者。如果你正在系统学习粤语，这本教材可以作为主教材使用，配合本 App 的课程效果更佳。' },
    ],
  },
  '3': {
    id: '3', title: '方言研究论文集', type: '学术资料', language: '通用',
    description: '汇集近年汉语方言学领域的重要研究成果，涵盖语音、词汇、语法等多个维度。',
    content: [
      { type: 'highlight', title: '收录内容', content: '📄 收录论文 50+ 篇\n🏫 来自国内外知名高校\n🔬 涵盖语音学、社会语言学、历史语言学\n📊 含大量数据图表与方言地图' },
      { type: 'list', title: '精选论文', items: [
        '• 《粤语声调系统的声学分析》',
        '• 《上海话中的文白异读现象》',
        '• 《闽南语在东南亚的传播与变异》',
        '• 《四川方言的地理分布与语言接触》',
        '• 《客家话古汉语词汇的保留》',
        '• 《方言濒危与语言保护策略》',
      ]},
      { type: 'text', title: '阅读建议', content: '这些论文适合对方言有深入研究兴趣的学习者。如果你是初学者，建议先学习基础课程，待有一定基础后再阅读学术论文，会有更深的理解和收获。' },
    ],
  },
  '4': {
    id: '4', title: 'BBC学习粤语', type: '外部网站', language: '粤语',
    description: 'BBC 官方制作的粤语学习资源网站，提供免费的音视频教学内容。',
    content: [
      { type: 'highlight', title: '网站特色', content: '🌐 完全免费，随时访问\n🎙️ 专业录音，标准发音\n📱 支持移动端浏览\n🔄 定期更新内容' },
      { type: 'list', title: '主要内容', items: [
        '• Quick Fix — 快速学习常用短语',
        '• Talk About — 主题场景对话',
        '• The Basics — 基础语音教学',
        '• Quiz — 在线测试你的粤语水平',
        '• Cultural Guide — 粤语文化背景',
      ]},
      { type: 'text', title: '使用建议', content: '作为补充学习资源非常合适。BBC 的内容以英语为教学语言，适合有英语基础的学习者。可以与本 App 的课程搭配使用，从不同角度学习粤语。' },
    ],
  },
  '5': {
    id: '5', title: '上海话教学视频系列', type: '视频系列', language: '上海话',
    description: '由上海本地资深老师录制的系统教学视频，涵盖发音、日常对话、文化知识等内容。',
    content: [
      { type: 'highlight', title: '系列亮点', content: '👨‍🏫 上海本地老师，发音标准\n📹 高清视频，口型清晰\n📖 配套文字材料\n🎯 从入门到进阶分级教学' },
      { type: 'list', title: '视频目录', items: [
        '第1集 上海话的前世今生（20分钟）',
        '第2集 基础发音入门（25分钟）',
        '第3集 打招呼与问候（15分钟）',
        '第4集 买东西用语（18分钟）',
        '第5集 吃饭点菜（20分钟）',
        '第6集 问路与交通（16分钟）',
        '第7集 上海俚语精讲（22分钟）',
        '第8集 综合对话练习（25分钟）',
      ]},
      { type: 'text', title: '学习建议', content: '每集视频时长 15-25 分钟，建议每天学习 1-2 集。看视频时注意观察老师的口型，跟着模仿发音。可以配合本 App 的"上海话日常用语"课程同步学习。' },
    ],
  },
  '6': {
    id: '6', title: '闽南语歌曲学习', type: '音乐教学', language: '闽南语',
    description: '精选经典闽南语歌曲，通过音乐学习闽南语发音和表达，寓教于乐。',
    content: [
      { type: 'highlight', title: '课程特色', content: '🎵 经典歌曲，耳熟能详\n📝 逐句歌词注音与翻译\n🎤 跟唱练习模式\n💡 歌词中的文化解读' },
      { type: 'list', title: '歌曲列表', items: [
        '1.《爱拼才会赢》— 经典励志（入门）',
        '2.《世界第一等》— 人生哲理（入门）',
        '3.《浪子回头》— 现代流行（初级）',
        '4.《家后》— 温情动人（初级）',
        '5.《针线情》— 传统经典（中级）',
        '6.《雨夜花》— 古早味道（中级）',
      ]},
      { type: 'text', title: '学习方法', content: '第一步：先听完整首歌，感受旋律和语感。\n第二步：对照歌词注音，逐句理解含义。\n第三步：跟唱练习，注意声调和语调。\n第四步：尝试清唱，不看歌词。\n\n通过歌曲学习是掌握闽南语语调的绝佳方式！' },
    ],
  },
};

// ============= 通用课时内容生成 =============
function getGenericLessonContent(lessonId: string, lessonTitle: string, courseTitle: string): LessonContent {
  return {
    id: lessonId, title: lessonTitle, courseTitle,
    type: 'pronunciation',
    sections: [
      { type: 'intro', title: '课程简介', content: `欢迎来到「${lessonTitle}」。本节课将通过听、说、练三个环节帮助你掌握这一知识点。` },
      {
        type: 'vocab', title: '重点内容',
        items: [
          { original: '示例词汇 1', pronunciation: '拼音标注', meaning: '释义说明', example: '例句：这是示例句子。' },
          { original: '示例词汇 2', pronunciation: '拼音标注', meaning: '释义说明', example: '例句：这是示例句子。' },
          { original: '示例词汇 3', pronunciation: '拼音标注', meaning: '释义说明', example: '例句：这是示例句子。' },
        ],
      },
      { type: 'practice', title: '跟读练习', content: '请跟着音频练习以下内容，注意发音的准确性和自然度。多听多读，反复练习是掌握方言发音的最佳途径。' },
      { type: 'tip', title: '学习小贴士', content: '💡 每天坚持 10-15 分钟的练习，比一次性长时间学习效果更好。建议将学到的词汇记录到记录本中，方便复习。' },
    ],
  };
}

// ============= 子组件 =============

function SectionIcon({ type }: { type: string }) {
  switch (type) {
    case 'intro': return <BookOpen className="w-4 h-4 text-blue-600" />;
    case 'audio': return <Headphones className="w-4 h-4 text-purple-600" />;
    case 'vocab': return <ListChecks className="w-4 h-4 text-green-600" />;
    case 'practice': return <Mic className="w-4 h-4 text-orange-600" />;
    case 'quiz': return <Trophy className="w-4 h-4 text-yellow-600" />;
    case 'tip': return <Star className="w-4 h-4 text-amber-500" />;
    default: return <BookOpen className="w-4 h-4 text-gray-600" />;
  }
}

// ============= 评论数据类型 =============
interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
}

const sampleComments: Record<string, Comment[]> = {
  '1-1': [
    { id: 'c1', author: '粤语小达人', avatar: 'Y', content: '这节课讲得很清楚！b 和 p 的送气区别终于搞懂了。', time: '2小时前', likes: 12, liked: false },
    { id: 'c2', author: '方言爱好者', avatar: 'F', content: '建议老师可以多加一些对比练习，比如"巴"和"怕"的最小对比对。', time: '5小时前', likes: 8, liked: true },
    { id: 'c3', author: '学习中的小明', avatar: 'X', content: '花=faa1 这个发音好特别，跟普通话差别好大！反复听了好多遍。', time: '1天前', likes: 5, liked: false },
  ],
  '1-2': [
    { id: 'c4', author: 'Canton新手', avatar: 'C', content: 'n 和 l 的区分真的好难！"捏鼻法"很有用，谢谢老师！', time: '3小时前', likes: 15, liked: false },
    { id: 'c5', author: '语言学研究生', avatar: 'Y', content: '懒音现象在年轻人中确实很普遍，学标准音很重要。', time: '8小时前', likes: 6, liked: false },
  ],
  '1-3': [
    { id: 'c6', author: '零基础学员', avatar: 'L', content: 'ng 声母好难发！但是按照老师说的先发"嗯"再过渡，确实有效果。', time: '1小时前', likes: 20, liked: true },
  ],
  '2-1-1': [
    { id: 'c7', author: '上海土著', avatar: 'S', content: '作为上海人来听课也觉得讲得好，有些细节平时都没注意到。', time: '4小时前', likes: 18, liked: false },
    { id: 'c8', author: '新上海人', avatar: 'X', content: '"阿拉"这个词终于学会了！同事都夸我说得像。', time: '2天前', likes: 9, liked: false },
  ],
  '4-2-1': [
    { id: 'c9', author: '成都小伙', avatar: 'C', content: '巴适得板！这些俚语太接地气了，我都用来教外地朋友了。', time: '6小时前', likes: 25, liked: true },
    { id: 'c10', author: '重庆妹儿', avatar: 'Z', content: '可以加一些重庆话和成都话的区别对比吗？虽然都是四川话但还是有差别的。', time: '1天前', likes: 11, liked: false },
  ],
  'res-1': [
    { id: 'r1', author: '电影迷', avatar: 'D', content: '通过电影学粤语真的太有趣了！《少林足球》那段笑死我了。', time: '3小时前', likes: 14, liked: false },
    { id: 'r2', author: '粤语初学者', avatar: 'Y', content: '视频清晰度很高，字幕标注也很详细，就是希望能多加一些生活场景的片段。', time: '1天前', likes: 7, liked: true },
  ],
  'res-5': [
    { id: 'r3', author: '老上海', avatar: 'L', content: '老师发音很标准，是正宗的上海本地口音，比网上很多教程好多了。', time: '5小时前', likes: 22, liked: false },
  ],
  'res-6': [
    { id: 'r4', author: '闽南人在北京', avatar: 'M', content: '《爱拼才会赢》这首歌小时候经常听，现在终于知道每句歌词的意思了！', time: '2小时前', likes: 16, liked: true },
    { id: 'r5', author: '音乐爱好者', avatar: 'Y', content: '通过歌曲学语言真的是好方法，希望能加入更多现代流行歌曲。', time: '12小时前', likes: 9, liked: false },
  ],
};

// ============= 视频播放器组件 =============
function VideoPlayer({ title }: { title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const totalTime = '8:24';
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      if (progressRef.current) clearInterval(progressRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      progressRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (progressRef.current) clearInterval(progressRef.current);
            setIsPlaying(false);
            return 0;
          }
          const newProg = prev + 0.2;
          const totalSec = 504;
          const curSec = Math.floor((newProg / 100) * totalSec);
          setCurrentTime(`${Math.floor(curSec / 60)}:${(curSec % 60).toString().padStart(2, '0')}`);
          return newProg;
        });
      }, 100);
    }
  };

  const handleProgressClick = (event: ITouchEvent) => {
    // h5 端 Taro 把原生 MouseEvent 原样透传，进度条按 DOM 几何定位；小程序无此事件形态，seek 只在 h5 生效。
    const e = event as unknown as MouseEvent;
    const bar = e.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const newProg = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setProgress(newProg);
    const curSec = Math.floor((newProg / 100) * 504);
    setCurrentTime(`${Math.floor(curSec / 60)}:${(curSec % 60).toString().padStart(2, '0')}`);
  };

  return (
    <View className="rounded-xl overflow-hidden bg-gray-900 shadow-lg">
      <View
        className="relative aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center cursor-pointer group"
        onClick={togglePlay}
      >
        <View className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <View className="flex items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <Text className="text-white/60 text-xs">HD</Text>
          </View>
          <Badge className="bg-white/10 text-white/70 border-white/20 text-xs">教学视频</Badge>
        </View>
        <View className="text-center z-10">
          <View className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2 mx-auto backdrop-blur-sm group-hover:bg-white/20 transition-colors">
            {isPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
          </View>
          <Text className="block text-white/50 text-xs max-w-[200px] truncate">{title}</Text>
        </View>
        {isPlaying && (
          <View className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
            {Array.from({ length: 24 }).map((_, i) => (
              <View key={i} className="w-1 bg-purple-400/50 rounded-full animate-pulse"
                style={{ height: `${6 + Math.random() * 16}px`, animationDelay: `${i * 0.05}s`, animationDuration: `${0.4 + Math.random() * 0.4}s` }} />
            ))}
          </View>
        )}
      </View>
      <View className="px-4 py-3 bg-gray-900">
        <View className="h-1.5 bg-gray-700 rounded-full cursor-pointer mb-3 group/bar" onClick={handleProgressClick}>
          <View className="relative h-full">
            <View className="h-full bg-purple-500 rounded-full transition-[width] duration-100" style={{ width: `${progress}%` }} />
            <View className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 6px)` }} />
          </View>
        </View>
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-3">
            <View onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white hover:text-purple-300 transition-colors">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </View>
            <View onClick={() => setIsMuted(!isMuted)} className="text-white/70 hover:text-white transition-colors">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </View>
            <Text className="text-white/60 text-xs">{currentTime} / {totalTime}</Text>
          </View>
          <View className="flex items-center gap-1.5">
            <View className="text-white/70 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20">0.5x</View>
            <View className="text-white text-xs px-1.5 py-0.5 rounded bg-purple-600">1.0x</View>
            <View className="text-white/70 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20">1.5x</View>
            <View className="text-white/70 hover:text-white transition-colors ml-1"><Maximize className="w-4 h-4" /></View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ============= 评论区组件 =============
function CommentSection({ contentId }: { contentId: string }) {
  const [comments, setComments] = useState<Comment[]>(sampleComments[contentId] || []);
  const [newComment, setNewComment] = useState('');
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? comments : comments.slice(0, 3);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    setComments([{
      id: `new-${Date.now()}`, author: '我', avatar: 'W',
      content: newComment.trim(), time: '刚刚', likes: 0, liked: false,
    }, ...comments]);
    setNewComment('');
  };

  const toggleLike = (id: string) => {
    setComments(comments.map(c => c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c));
  };

  return (
    <Card className="p-4 border border-gray-200">
      <View className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-blue-600" />
        <Text className="block font-medium text-gray-900">评论讨论</Text>
        <Badge variant="secondary" className="text-xs">{comments.length}</Badge>
      </View>
      <View className="flex gap-3 mb-4">
        <View className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-blue-600" />
        </View>
        <View className="flex-1 flex gap-2">
          <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="写下你的想法或问题..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-gray-50" />
          <Button size="sm" onClick={handleSubmit} disabled={!newComment.trim()} className="gap-1 px-3">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </View>
      </View>
      {comments.length === 0 ? (
        <View className="text-center py-6 text-gray-400 text-sm">还没有评论，来发表第一条吧！</View>
      ) : (
        <View className="space-y-3">
          {displayed.map((comment) => (
            <View key={comment.id} className="flex gap-3">
              <View className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                <Text className="text-xs font-medium text-purple-700">{comment.avatar}</Text>
              </View>
              <View className="flex-1 min-w-0">
                <View className="flex items-baseline gap-2 mb-0.5">
                  <Text className="text-sm font-medium text-gray-900">{comment.author}</Text>
                  <Text className="text-xs text-gray-400">{comment.time}</Text>
                </View>
                <Text className="block text-sm text-gray-700 mb-1.5">{comment.content}</Text>
                <View onClick={() => toggleLike(comment.id)}
                  className={`flex items-center gap-1 text-xs transition-colors ${comment.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
                  <ThumbsUp className="w-3 h-3" />
                  <Text>{comment.likes > 0 ? comment.likes : ''}</Text>
                </View>
              </View>
            </View>
          ))}
          {comments.length > 3 && (
            <View onClick={() => setShowAll(!showAll)} className="text-sm text-blue-600 hover:text-blue-800 w-full text-center py-1">
              {showAll ? '收起评论' : `查看全部 ${comments.length} 条评论`}
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

// ============= 主组件 =============

export function LearningMode() {
  const [viewState, setViewState] = useState<ViewState>({ view: 'main' });
  const [activeSection, setActiveSection] = useState<'preset' | 'recommended'>('preset');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // 面包屑导航
  const getBreadcrumbs = () => {
    const crumbs: { label: string; onClick?: () => void }[] = [
      { label: '学习区', onClick: () => setViewState({ view: 'main' }) },
    ];

    if (viewState.view === 'main') {
      crumbs.push({ label: activeSection === 'preset' ? '板块学习' : '推荐资源' });
    } else if (viewState.view === 'course') {
      crumbs.push({ label: '板块学习', onClick: () => setViewState({ view: 'main' }) });
      const course = courseDetails[viewState.courseId];
      if (course) crumbs.push({ label: course.title });
    } else if (viewState.view === 'lesson') {
      crumbs.push({ label: '板块学习', onClick: () => setViewState({ view: 'main' }) });
      const course = courseDetails[viewState.courseId];
      if (course) {
        crumbs.push({ label: course.title, onClick: () => setViewState({ view: 'course', courseId: viewState.courseId }) });
        const allLessons = course.sections.flatMap(s => s.lessons);
        const found = allLessons.find(l => l.id === viewState.lessonId);
        if (found) crumbs.push({ label: found.title });
      }
    } else if (viewState.view === 'resource') {
      crumbs.push({ label: '推荐资源', onClick: () => { setActiveSection('recommended'); setViewState({ view: 'main' }); } });
      const resource = resourceDetails[viewState.resourceId];
      if (resource) crumbs.push({ label: resource.title });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      case 'link': return <ExternalLink className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return '视频';
      case 'document': return '文档';
      case 'link': return '外部链接';
      default: return '课程';
    }
  };

  // ====== 课时详情页 ======
  const renderLessonView = () => {
    if (viewState.view !== 'lesson') return null;
    const course = courseDetails[viewState.courseId];
    if (!course) return null;
    const allLessons = course.sections.flatMap(s => s.lessons);
    const lessonMeta = allLessons.find(l => l.id === viewState.lessonId);
    const content = lessonContents[viewState.lessonId] || getGenericLessonContent(
      viewState.lessonId,
      lessonMeta?.title || '课时',
      course.title
    );
    const currentIndex = allLessons.findIndex(l => l.id === viewState.lessonId);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    const lessonFavKey = `lesson-${viewState.lessonId}`;
    const isFav = favorites.has(lessonFavKey);

    return (
      <View className="p-4 space-y-4 pb-8">
        {/* 课时标题 + 收藏按钮 */}
        <View className="flex items-center gap-3">
          <View className={`w-10 h-10 rounded-lg ${course.color} flex items-center justify-center flex-shrink-0`}>
            <BookOpen className="w-5 h-5 text-white" />
          </View>
          <View className="flex-1 min-w-0">
            <Text className="block font-semibold text-gray-900">{content.title}</Text>
            <Text className="block text-sm text-gray-500">{lessonMeta?.duration || ''}</Text>
          </View>
          <View
            onClick={() => toggleFavorite(lessonFavKey)}
            className={`flex-shrink-0 p-2 rounded-full transition-all ${
              isFav ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
          </View>
        </View>

        {/* 视频播放器 */}
        <VideoPlayer title={content.title} />

        {/* 课时内容区块 */}
        {content.sections.map((section, idx) => (
          <View key={idx} className="rounded-xl border p-4"
            style={{}} >
            <Card className={`p-4 border ${
              section.type === 'intro' ? 'bg-blue-50/70 border-blue-100' :
              section.type === 'audio' ? 'bg-purple-50/70 border-purple-100' :
              section.type === 'vocab' ? 'bg-green-50/70 border-green-100' :
              section.type === 'practice' ? 'bg-orange-50/70 border-orange-100' :
              section.type === 'quiz' ? 'bg-yellow-50/70 border-yellow-100' :
              section.type === 'tip' ? 'bg-amber-50/70 border-amber-100' :
              'bg-gray-50/70 border-gray-100'
            }`}>
              <View className="flex items-center gap-2 mb-3">
                <SectionIcon type={section.type} />
                <Text className="block font-medium text-gray-900">{section.title}</Text>
              </View>

              {/* 文本内容 */}
              {section.content && (
                <Text className="block text-sm text-gray-700 whitespace-pre-line">{section.content}</Text>
              )}

              {/* 词汇表 */}
              {section.items && (
                <View className="space-y-3 mt-1">
                  {section.items.map((item, i) => (
                    <View key={i} className="bg-white/80 rounded-lg p-3 border border-gray-100">
                      <View className="flex items-baseline justify-between gap-2 mb-1">
                        <Text className="font-medium text-gray-900">{item.original}</Text>
                        <Text className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{item.pronunciation}</Text>
                      </View>
                      <Text className="block text-sm text-gray-600">{item.meaning}</Text>
                      {item.example && (
                        <Text className="block text-xs text-gray-500 mt-1.5 pl-3 border-l-2 border-gray-200 italic">{item.example}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* 音频播放占位 */}
              {section.type === 'audio' && (
                <View className="mt-3 flex gap-2">
                  <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
                    <Play className="w-3.5 h-3.5" /> 播放示范
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <RotateCcw className="w-3.5 h-3.5" /> 慢速播放
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Mic className="w-3.5 h-3.5" /> 录音对比
                  </Button>
                </View>
              )}
            </Card>
          </View>
        ))}

        {/* 评论区 */}
        <CommentSection contentId={viewState.lessonId} />

        {/* 上一课/下一课 */}
        <View className="flex gap-3 pt-2">
          {prevLesson ? (
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => setViewState({ view: 'lesson', courseId: viewState.courseId, lessonId: prevLesson.id })}
            >
              <ArrowLeft className="w-4 h-4" /> 上一课
            </Button>
          ) : <View className="flex-1" />}
          {nextLesson && !nextLesson.locked ? (
            <Button
              className="flex-1 gap-2"
              onClick={() => setViewState({ view: 'lesson', courseId: viewState.courseId, lessonId: nextLesson.id })}
            >
              下一课 <ChevronRight className="w-4 h-4" />
            </Button>
          ) : nextLesson ? (
            <Button className="flex-1 gap-2" disabled>
              <Lock className="w-4 h-4" /> 下一课（未解锁）
            </Button>
          ) : (
            <Button
              className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
              onClick={() => setViewState({ view: 'course', courseId: viewState.courseId })}
            >
              <Trophy className="w-4 h-4" /> 课程已完成
            </Button>
          )}
        </View>
      </View>
    );
  };

  // ====== 课程详情页 ======
  const renderCourseDetail = () => {
    if (viewState.view !== 'course') return null;
    const course = courseDetails[viewState.courseId];
    if (!course) return null;
    const progress = Math.round((course.completedLessons / course.totalLessons) * 100);

    return (
      <View className="p-4 space-y-4 pb-8">
        {/* 课程头部 */}
        <View className={`rounded-2xl p-5 ${course.color} text-white`}>
          <View className="flex items-start gap-4">
            <BookOpen className="w-12 h-12 opacity-80" />
            <View className="flex-1">
              <Text className="block text-xl text-white mb-1">{course.title}</Text>
              <View className="flex gap-2 mb-3">
                <Text className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{course.language}</Text>
                <Text className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{course.level}</Text>
                <Text className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{course.totalLessons}课时</Text>
              </View>
              <Text className="block text-sm text-white/90">{course.description}</Text>
            </View>
          </View>
          {/* 进度 */}
          <View className="mt-4">
            <View className="flex justify-between text-xs text-white/80 mb-1.5">
              <Text>学习进度</Text>
              <Text>{course.completedLessons}/{course.totalLessons} 课时 · {progress}%</Text>
            </View>
            <View className="h-2 bg-white/20 rounded-full overflow-hidden">
              <View className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
            </View>
          </View>
        </View>

        {/* 课时列表 */}
        {course.sections.map((section, sIdx) => (
          <View key={sIdx}>
            <Text className="block font-medium text-gray-700 mb-2 px-1">{section.title}</Text>
            <View className="space-y-2">
              {section.lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className={`p-3.5 border transition-all ${
                    lesson.locked
                      ? 'bg-gray-50 border-gray-100 opacity-60'
                      : 'border-gray-200 hover:shadow-md hover:border-gray-300 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!lesson.locked) {
                      setViewState({ view: 'lesson', courseId: viewState.courseId, lessonId: lesson.id });
                    }
                  }}
                >
                  <View className="flex items-center gap-3">
                    <View className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      lesson.completed ? 'bg-green-100' : lesson.locked ? 'bg-gray-100' : 'bg-blue-50'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : lesson.locked ? (
                        <Lock className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Play className="w-4 h-4 text-blue-600" />
                      )}
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className={`block text-sm ${lesson.completed ? 'text-gray-500' : lesson.locked ? 'text-gray-400' : 'text-gray-900'}`}>
                        {lesson.title}
                      </Text>
                    </View>
                    <View className="flex items-center gap-2 flex-shrink-0">
                      <Text className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lesson.duration}
                      </Text>
                      {!lesson.locked && <ChevronRight className="w-4 h-4 text-gray-300" />}
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  // ====== 资源详情页 ======
  const renderResourceDetail = () => {
    if (viewState.view !== 'resource') return null;
    const resource = resourceDetails[viewState.resourceId];
    if (!resource) return null;
    const resFavKey = `resource-${viewState.resourceId}`;
    const isResFav = favorites.has(resFavKey);

    return (
      <View className="p-4 space-y-4 pb-8">
        {/* 资源头部 */}
        <Card className="p-5 border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <View className="flex items-start gap-4">
            <View className="bg-gray-100 rounded-xl p-3 flex-shrink-0">
              {getResourceIcon(resource.type === '视频课程' || resource.type === '视频系列' || resource.type === '音乐教学' ? 'video' : resource.type === '外部网站' ? 'link' : 'document')}
            </View>
            <View className="flex-1">
              <Text className="block font-semibold text-gray-900 mb-1">{resource.title}</Text>
              <View className="flex gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">{resource.type}</Badge>
                <Badge variant="outline" className="text-xs">{resource.language}</Badge>
              </View>
              <Text className="block text-sm text-gray-600">{resource.description}</Text>
            </View>
            <View
              onClick={() => toggleFavorite(resFavKey)}
              className={`flex-shrink-0 p-2 rounded-full transition-all ${
                isResFav ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isResFav ? 'fill-current' : ''}`} />
            </View>
          </View>
        </Card>

        {/* 视频播放器（视频类资源） */}
        {(resource.type === '视频课程' || resource.type === '视频系列' || resource.type === '音乐教学') && (
          <VideoPlayer title={resource.title} />
        )}

        {/* 内容区块 */}
        {resource.content.map((section, idx) => (
          <Card key={idx} className={`p-4 border ${
            section.type === 'highlight' ? 'bg-blue-50/60 border-blue-100' : 'border-gray-200'
          }`}>
            {section.title && (
              <Text className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                {section.type === 'highlight' && <Star className="w-4 h-4 text-amber-500" />}
                {section.type === 'list' && <ListChecks className="w-4 h-4 text-blue-600" />}
                {section.type === 'text' && <MessageSquare className="w-4 h-4 text-gray-500" />}
                {section.title}
              </Text>
            )}
            {section.content && (
              <Text className="block text-sm text-gray-700 whitespace-pre-line">{section.content}</Text>
            )}
            {section.items && (
              <View className="space-y-1.5">
                {section.items.map((item, i) => (
                  <View key={i} className="text-sm text-gray-700 py-1 px-2 rounded-md hover:bg-white/60 transition-colors">
                    {item}
                  </View>
                ))}
              </View>
            )}
          </Card>
        ))}

        {/* 评论区 */}
        <CommentSection contentId={`res-${viewState.resourceId}`} />

        {/* 操作按钮 */}
        <View className="flex gap-3">
          <Button className="flex-1 gap-2">
            <Play className="w-4 h-4" /> 开始学习
          </Button>
          <Button
            variant="outline"
            className={`gap-2 ${isResFav ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
            onClick={() => toggleFavorite(resFavKey)}
          >
            <Heart className={`w-4 h-4 ${isResFav ? 'fill-current' : ''}`} />
            {isResFav ? '已收藏' : '收藏'}
          </Button>
        </View>
      </View>
    );
  };

  // ====== 主页面（板块列表/推荐资源） ======
  const renderMainView = () => (
    <>
      {/* 切换选项卡 */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex gap-2">
          <View
            onClick={() => setActiveSection('preset')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeSection === 'preset'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            板块学习
          </View>
          <View
            onClick={() => setActiveSection('recommended')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeSection === 'recommended'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            推荐资源
          </View>
        </View>
      </View>

      {/* 内容区域 */}
      <ScrollView scrollY className="flex-1">
        {activeSection === 'preset' ? (
          <View className="p-4 space-y-4">
            <View className="mb-2">
              <Text className="block font-semibold text-gray-900">基础方言课程</Text>
              <Text className="block text-sm text-gray-500 mt-1">
                系统化学习各地方言的发音、词汇和语法
              </Text>
            </View>

            {presetCourses.map((course) => (
              <Card
                key={course.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                onClick={() => setViewState({ view: 'course', courseId: course.id })}
              >
                <View className="flex gap-4">
                  <View className={`w-20 h-20 rounded-xl ${course.color} flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="w-10 h-10 text-white" />
                  </View>
                  <View className="flex-1 min-w-0">
                    <View className="flex items-start justify-between gap-2 mb-2">
                      <Text className="block font-semibold text-gray-900">{course.title}</Text>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </View>
                    <View className="flex gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{course.language}</Badge>
                      <Badge variant="outline" className="text-xs">{course.level}</Badge>
                      <Badge variant="outline" className="text-xs">{course.lessonsCount}课时</Badge>
                    </View>
                    <Text className="block text-sm text-gray-600 line-clamp-2">{course.description}</Text>
                  </View>
                </View>
              </Card>
            ))}

            <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <View className="flex items-start gap-3">
                <View className="bg-blue-100 rounded-full p-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </View>
                <View className="flex-1">
                  <Text className="block font-medium text-blue-900 mb-1">更多课程即将推出</Text>
                  <Text className="block text-sm text-blue-700">
                    我们正在开发更多方言课程，包括客家话、东北话、陕西话等
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className="p-4 space-y-4">
            <View className="mb-2">
              <Text className="block font-semibold text-gray-900">推荐学习资源</Text>
              <Text className="block text-sm text-gray-500 mt-1">
                社区分享的优质学习材料和外部资源
              </Text>
            </View>

            {recommendedResources.map((resource) => (
              <Card
                key={resource.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                onClick={() => setViewState({ view: 'resource', resourceId: resource.id })}
              >
                <View className="flex items-start gap-3">
                  <View className="bg-gray-100 rounded-lg p-3 flex-shrink-0">
                    {getResourceIcon(resource.type)}
                  </View>
                  <View className="flex-1 min-w-0">
                    <View className="flex items-start justify-between gap-2 mb-1">
                      <Text className="block font-medium text-gray-900">{resource.title}</Text>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </View>
                    <Text className="block text-sm text-gray-600 mb-2">{resource.description}</Text>
                    <View className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{getResourceTypeLabel(resource.type)}</Badge>
                      <Badge variant="outline" className="text-xs">{resource.language}</Badge>
                      {resource.duration && <Text className="text-xs text-gray-500">{resource.duration}</Text>}
                    </View>
                    {resource.progress !== undefined && resource.progress > 0 && (
                      <View className="mt-3">
                        <View className="flex items-center justify-between mb-1">
                          <Text className="text-xs text-gray-500">学习进度</Text>
                          <Text className="text-xs font-medium text-blue-600">{resource.progress}%</Text>
                        </View>
                        <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <View className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${resource.progress}%` }} />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            ))}

            <View className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mt-6">
              <View className="flex items-start gap-3">
                <View className="bg-white rounded-full p-2">
                  <Download className="w-5 h-5 text-purple-600" />
                </View>
                <View className="flex-1">
                  <Text className="block font-medium text-purple-900 mb-1">分享你的资源</Text>
                  <Text className="block text-sm text-purple-700 mb-3">
                    上传你的学习资料，帮助更多人学习方言
                  </Text>
                  <Button size="sm" variant="outline" className="bg-white">
                    上传资源
                  </Button>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* 面包屑导航 */}
      <View className="bg-white border-b border-gray-100 px-4 py-2.5">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, idx) => (
              <BreadcrumbItem key={idx}>
                {idx > 0 && <BreadcrumbSeparator />}
                {idx < breadcrumbs.length - 1 && crumb.onClick ? (
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => { e.preventDefault(); crumb.onClick?.(); }}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </View>

      {/* 根据视图状态渲染内容 */}
      {viewState.view === 'main' && renderMainView()}
      {viewState.view === 'course' && (
        <ScrollView scrollY className="flex-1">{renderCourseDetail()}</ScrollView>
      )}
      {viewState.view === 'lesson' && (
        <ScrollView scrollY className="flex-1">{renderLessonView()}</ScrollView>
      )}
      {viewState.view === 'resource' && (
        <ScrollView scrollY className="flex-1">{renderResourceDetail()}</ScrollView>
      )}
    </View>
  );
}