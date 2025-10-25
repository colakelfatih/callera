'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, TrendingDown, Phone, MessageSquare, Users, Clock } from 'lucide-react'

const callData = [
  { name: 'Mon', calls: 12, completed: 8 },
  { name: 'Tue', calls: 19, completed: 15 },
  { name: 'Wed', calls: 15, completed: 12 },
  { name: 'Thu', calls: 22, completed: 18 },
  { name: 'Fri', calls: 18, completed: 14 },
  { name: 'Sat', calls: 8, completed: 6 },
  { name: 'Sun', calls: 5, completed: 4 }
]

const channelData = [
  { name: 'Email', value: 45, color: '#2F80ED' },
  { name: 'WhatsApp', value: 30, color: '#25D366' },
  { name: 'Phone', value: 15, color: '#8B5CF6' },
  { name: 'Instagram', value: 10, color: '#E4405F' }
]

const sentimentData = [
  { name: 'Positive', value: 65, color: '#10B981' },
  { name: 'Neutral', value: 25, color: '#6B7280' },
  { name: 'Negative', value: 10, color: '#EF4444' }
]

const responseTimeData = [
  { name: 'Week 1', time: 4.2 },
  { name: 'Week 2', time: 3.8 },
  { name: 'Week 3', time: 3.5 },
  { name: 'Week 4', time: 3.1 }
]

const metrics = [
  {
    title: 'Total Calls',
    value: '1,247',
    change: '+12%',
    trend: 'up',
    icon: Phone,
    color: 'text-blue-600'
  },
  {
    title: 'Response Time',
    value: '3.1 min',
    change: '-18%',
    trend: 'down',
    icon: Clock,
    color: 'text-green-600'
  },
  {
    title: 'Active Contacts',
    value: '892',
    change: '+8%',
    trend: 'up',
    icon: Users,
    color: 'text-purple-600'
  },
  {
    title: 'Messages',
    value: '3,456',
    change: '+24%',
    trend: 'up',
    icon: MessageSquare,
    color: 'text-orange-600'
  }
]

export default function InsightsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy dark:text-white">Insights</h1>
        <div className="flex gap-2">
          <Badge variant="info">Last 30 days</Badge>
          <Badge variant="default">Export Report</Badge>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-navy dark:text-white">
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 dark:bg-navy-700 ${metric.color}`}>
                  <metric.icon size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {metric.trend === 'up' ? (
                  <TrendingUp size={16} className="text-green-600 mr-1" />
                ) : (
                  <TrendingDown size={16} className="text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  vs last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Call Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#2F80ED" name="Scheduled" />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4">
              {channelData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Time Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  stroke="#2F80ED" 
                  strokeWidth={2}
                  name="Response Time (min)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4">
              {sentimentData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'AI call completed', contact: 'John Smith', time: '2 min ago', type: 'call' },
              { action: 'New lead added', contact: 'Alice Johnson', time: '15 min ago', type: 'lead' },
              { action: 'Email sent', contact: 'Mike Chen', time: '1 hour ago', type: 'email' },
              { action: 'WhatsApp message received', contact: 'Sarah Wilson', time: '2 hours ago', type: 'message' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-navy-700 rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  {activity.type === 'call' && <Phone size={16} className="text-primary" />}
                  {activity.type === 'lead' && <Users size={16} className="text-primary" />}
                  {activity.type === 'email' && <MessageSquare size={16} className="text-primary" />}
                  {activity.type === 'message' && <MessageSquare size={16} className="text-primary" />}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-navy dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.contact} • {activity.time}
                  </p>
                </div>
                
                <Badge variant="info" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
