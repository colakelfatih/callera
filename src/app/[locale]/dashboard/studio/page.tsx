'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Plus, Calendar, Image, Video, FileText, Send, Clock, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

const mockPosts = [
  {
    id: '1',
    title: 'AI-Powered Customer Service',
    content: 'Discover how AI is revolutionizing customer service with automated responses and intelligent routing.',
    type: 'text',
    status: 'scheduled',
    scheduledDate: new Date('2024-01-20T10:00:00'),
    platforms: ['instagram', 'linkedin'],
    engagement: { likes: 45, comments: 12, shares: 8 }
  },
  {
    id: '2',
    title: 'Product Demo Video',
    content: 'Watch our latest product demo showcasing the new features.',
    type: 'video',
    status: 'draft',
    scheduledDate: new Date('2024-01-22T14:30:00'),
    platforms: ['youtube', 'linkedin'],
    engagement: null
  },
  {
    id: '3',
    title: 'Customer Success Story',
    content: 'How TechCorp increased their response time by 300% using Callera.',
    type: 'text',
    status: 'published',
    scheduledDate: new Date('2024-01-18T09:00:00'),
    platforms: ['twitter', 'linkedin'],
    engagement: { likes: 128, comments: 23, shares: 15 }
  }
]

const postTypes = {
  text: { icon: FileText, color: 'text-blue-600' },
  image: { icon: Image, color: 'text-green-600' },
  video: { icon: Video, color: 'text-purple-600' }
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  scheduled: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700'
}

const statusIcons = {
  draft: FileText,
  scheduled: Clock,
  published: CheckCircle
}

export default function StudioPage() {
  const [selectedPost, setSelectedPost] = useState(mockPosts[0])
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [filter, setFilter] = useState('all')
  const t = useTranslations('studio')

  const filteredPosts = filter === 'all' 
    ? mockPosts 
    : mockPosts.filter(post => post.status === filter)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy dark:text-white">{t('title')}</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={view === 'calendar' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setView('calendar')}
            >
              <Calendar size={16} className="mr-2" />
              {t('calendar')}
            </Button>
            <Button
              variant={view === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
            >
              {t('list')}
            </Button>
          </div>
          <Button>
            <Plus size={16} className="mr-2" />
            {t('createPost')}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {['all', 'draft', 'scheduled', 'published'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {t(status as 'all' | 'draft' | 'scheduled' | 'published')}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts List/Calendar */}
        <div className="lg:col-span-2">
          {view === 'list' ? (
            <Card>
              <CardHeader>
                <CardTitle>{t('posts')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPosts.map((post) => {
                    const PostType = postTypes[post.type as keyof typeof postTypes]
                    const StatusIcon = statusIcons[post.status as keyof typeof statusIcons]
                    
                    return (
                      <div
                        key={post.id}
                        className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 ${
                          selectedPost?.id === post.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedPost(post)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg bg-gray-100 dark:bg-navy-700 ${PostType.color}`}>
                            <PostType.icon size={20} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-navy dark:text-white truncate">
                                {post.title}
                              </h3>
                              <Badge 
                                variant="default" 
                                className={`text-xs ${statusColors[post.status as keyof typeof statusColors]}`}
                              >
                                {post.status}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {post.content}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>{formatDate(post.scheduledDate)}</span>
                              <span>{post.platforms.join(', ')}</span>
                              {post.engagement && (
                                <span>
                                  {post.engagement.likes} likes • {post.engagement.comments} comments
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('contentCalendar')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-navy-700 p-6 rounded-lg">
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 p-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }, (_, i) => {
                      const date = i + 1
                      const hasPost = mockPosts.some(post => 
                        post.scheduledDate.getDate() === date
                      )
                      
                      return (
                        <div
                          key={i}
                          className={`h-16 border border-gray-200 dark:border-gray-600 rounded-lg p-2 ${
                            hasPost ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-navy-800'
                          }`}
                        >
                          <div className="text-sm font-medium text-navy dark:text-white">
                            {date}
                          </div>
                          {hasPost && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Post Detail */}
        <div>
          {selectedPost ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-navy-700 ${
                    postTypes[selectedPost.type as keyof typeof postTypes].color
                  }`}>
                    {React.createElement(postTypes[selectedPost.type as keyof typeof postTypes].icon, { size: 20 })}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedPost.title}</CardTitle>
                    <Badge 
                      variant="default" 
                      className={`text-xs ${statusColors[selectedPost.status as keyof typeof statusColors]}`}
                    >
                      {selectedPost.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-navy dark:text-white mb-2">{t('content')}</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedPost.content}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-navy dark:text-white mb-2">{t('platforms')}</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedPost.platforms.map((platform) => (
                      <Badge key={platform} variant="info" className="text-xs capitalize">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-navy dark:text-white mb-2">{t('schedule')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(selectedPost.scheduledDate)}
                  </p>
                </div>
                
                {selectedPost.engagement && (
                  <div>
                    <h4 className="font-semibold text-navy dark:text-white mb-2">{t('engagement')}</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-navy dark:text-white">
                          {selectedPost.engagement.likes}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{t('likes')}</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-navy dark:text-white">
                          {selectedPost.engagement.comments}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{t('comments')}</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-navy dark:text-white">
                          {selectedPost.engagement.shares}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{t('shares')}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Send size={16} className="mr-2" />
                    {t('publish')}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t('edit')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-navy dark:text-white mb-2">
                  {t('selectPost')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('selectPostDesc')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
