export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'student' | 'parent' | 'professional' | 'admin';
  status: 'active' | 'inactive';
  createdAt: Date;
  lastLogin?: Date;
  bio?: string;
  tags?: string[];
  energyLevel?: number;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  comments: number;
  isPublished: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: Date;
  likes: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'audio' | 'video' | 'pdf';
  url: string;
  thumbnail?: string;
  authorId: string;
  author: User;
  tags: string[];
  createdAt: Date;
  views: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  icon?: string;
  members: User[];
  createdAt: Date;
  isPrivate: boolean;
  adminIds: string[];
}

export interface Message {
  id: string;
  senderId: string;
  sender: User;
  receiverId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

export interface EmotionRecord {
  id: string;
  userId: string;
  emotion: 'happy' | 'sad' | 'anxious' | 'angry' | 'calm' | 'excited' | 'tired' | 'hopeful';
  intensity: number;
  note?: string;
  createdAt: Date;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Simulation {
  id: string;
  title: string;
  description: string;
  scenario: string;
  type: 'interview' | 'social' | 'stress';
  duration: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'message' | 'system';
  content: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}