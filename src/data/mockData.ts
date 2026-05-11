import { User, Post, Resource, Community, Message, Skill, Simulation, EmotionRecord } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: '晨曦',
    email: 'chenxi@example.com',
    role: 'student',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    bio: '正在努力康复中，希望能和大家一起成长',
    tags: ['休学', '焦虑', '绘画'],
    energyLevel: 75,
  },
  {
    id: '2',
    username: '暖阳',
    email: 'nanyang@example.com',
    role: 'parent',
    status: 'active',
    createdAt: new Date('2024-02-20'),
    bio: '陪伴孩子一起面对挑战',
    tags: ['家长', '支持'],
    energyLevel: 60,
  },
  {
    id: '3',
    username: '星空',
    email: 'xingkong@example.com',
    role: 'professional',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    bio: '心理咨询师，愿为你照亮前行的路',
    tags: ['咨询师', '倾听'],
    energyLevel: 85,
  },
  {
    id: '4',
    username: '小雨',
    email: 'xiaoyu@example.com',
    role: 'student',
    status: 'active',
    createdAt: new Date('2024-03-01'),
    bio: '大学生，正在寻找自我',
    tags: ['大学生', '社交'],
    energyLevel: 55,
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    authorId: '1',
    author: mockUsers[0],
    title: '我的休学日记：第一天',
    content: '今天是我休学的第一天。说不焦虑是假的，但是我知道这是正确的选择。给自己一些时间和空间，慢慢疗愈。希望在这里能遇到更多志同道合的朋友。',
    tags: ['休学', '日记', '疗愈'],
    createdAt: new Date('2024-03-15'),
    likes: 42,
    comments: 15,
    isPublished: true,
  },
  {
    id: '2',
    authorId: '2',
    author: mockUsers[1],
    title: '作为家长，我如何陪伴孩子度过这段时光',
    content: '当得知孩子需要休学时，我的内心充满了焦虑和无助。但是通过学习和交流，我逐渐理解了孩子的感受。现在我想分享一些心得，希望能帮助更多家长。',
    tags: ['家长', '陪伴', '支持'],
    createdAt: new Date('2024-03-14'),
    likes: 89,
    comments: 32,
    isPublished: true,
  },
  {
    id: '3',
    authorId: '3',
    author: mockUsers[2],
    title: '如何应对社交焦虑？一些实用技巧',
    content: '社交焦虑是很多人都会遇到的问题。在这里分享一些我常用的方法：深呼吸、积极自我对话、从小事开始练习。记住，每一步都值得肯定。',
    tags: ['社交焦虑', '技巧', '心理'],
    createdAt: new Date('2024-03-13'),
    likes: 128,
    comments: 45,
    isPublished: true,
  },
];

export const mockResources: Resource[] = [
  {
    id: '1',
    title: '正念冥想入门指南',
    description: '通过简单的冥想练习，帮助你放松身心，减轻焦虑',
    type: 'audio',
    url: '#',
    authorId: '3',
    author: mockUsers[2],
    tags: ['冥想', '放松', '正念'],
    createdAt: new Date('2024-03-10'),
    views: 520,
  },
  {
    id: '2',
    title: '大学生社交指南：如何建立真实的友谊',
    description: '针对大学生群体的社交技巧分享',
    type: 'article',
    url: '#',
    authorId: '3',
    author: mockUsers[2],
    tags: ['大学生', '社交', '友谊'],
    createdAt: new Date('2024-03-08'),
    views: 890,
  },
  {
    id: '3',
    title: '情绪管理的五个步骤',
    description: '学习识别和管理自己的情绪',
    type: 'video',
    url: '#',
    authorId: '3',
    author: mockUsers[2],
    tags: ['情绪管理', '心理', '技巧'],
    createdAt: new Date('2024-03-05'),
    views: 1200,
  },
];

export const mockCommunities: Community[] = [
  {
    id: '1',
    name: '休学互助小组',
    description: '为正在休学或曾经休学的同学提供支持和交流的空间',
    members: [mockUsers[0], mockUsers[1]],
    createdAt: new Date('2024-02-01'),
    isPrivate: false,
    adminIds: ['3'],
  },
  {
    id: '2',
    name: '家长支持群',
    description: '家长们互相交流，共同学习如何更好地支持孩子',
    members: [mockUsers[1], mockUsers[2]],
    createdAt: new Date('2024-02-15'),
    isPrivate: false,
    adminIds: ['3'],
  },
  {
    id: '3',
    name: '大学生成长营',
    description: '大学生交流学习、分享成长经历的社群',
    members: [mockUsers[0], mockUsers[3]],
    createdAt: new Date('2024-03-01'),
    isPrivate: false,
    adminIds: ['3'],
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    sender: mockUsers[0],
    receiverId: '3',
    content: '老师，我最近感觉很焦虑，不知道该怎么办',
    createdAt: new Date('2024-03-15T10:30:00'),
    isRead: true,
  },
  {
    id: '2',
    senderId: '3',
    sender: mockUsers[2],
    receiverId: '1',
    content: '谢谢你愿意分享。焦虑是很正常的情绪，我们可以一起看看是什么让你感到焦虑，然后找到应对的方法。',
    createdAt: new Date('2024-03-15T10:35:00'),
    isRead: false,
  },
];

export const mockSkills: Skill[] = [
  {
    id: '1',
    name: '深呼吸放松法',
    description: '通过调节呼吸来缓解紧张和焦虑',
    category: '情绪调节',
    difficulty: 'beginner',
  },
  {
    id: '2',
    name: '积极自我对话',
    description: '用积极的语言代替消极的自我否定',
    category: '认知调整',
    difficulty: 'beginner',
  },
  {
    id: '3',
    name: '时间管理技巧',
    description: '合理安排时间，减轻压力',
    category: '生活技能',
    difficulty: 'intermediate',
  },
];

export const mockSimulations: Simulation[] = [
  {
    id: '1',
    title: '面试场景模拟',
    description: '模拟常见的面试问题，帮助你准备面试',
    scenario: '你正在参加一个心仪公司的面试，面试官问你：请介绍一下你自己。',
    type: 'interview',
    duration: 15,
  },
  {
    id: '2',
    title: '社交聚会模拟',
    description: '模拟社交场合，练习与人交流',
    scenario: '你参加一个朋友聚会，遇到了一些陌生人，你需要主动与他们交流。',
    type: 'social',
    duration: 10,
  },
  {
    id: '3',
    title: '压力场景模拟',
    description: '模拟高压场景，练习应对压力',
    scenario: '你正在准备一场重要的考试，时间紧迫，感到非常紧张。',
    type: 'stress',
    duration: 8,
  },
];

export const mockEmotionRecords: EmotionRecord[] = [
  {
    id: '1',
    userId: '1',
    emotion: 'anxious',
    intensity: 6,
    note: '今天有点焦虑，因为想到复学的事情',
    createdAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    userId: '1',
    emotion: 'calm',
    intensity: 4,
    note: '下午做了冥想，感觉好多了',
    createdAt: new Date('2024-03-14'),
  },
];

export const emotionLabels: Record<string, { label: string; color: string }> = {
  happy: { label: '开心', color: '#22c55e' },
  sad: { label: '难过', color: '#3b82f6' },
  anxious: { label: '焦虑', color: '#f59e0b' },
  angry: { label: '生气', color: '#ef4444' },
  calm: { label: '平静', color: '#0ea5e9' },
  excited: { label: '兴奋', color: '#ec4899' },
};