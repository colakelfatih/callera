'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockAutomationFlows } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { Plus, Play, Pause, Settings, Zap, ArrowRight, Circle } from 'lucide-react'

export default function FlowsPage() {
  const [selectedFlow, setSelectedFlow] = useState(mockAutomationFlows[0])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy dark:text-white">Automation Flows</h1>
        <Button>
          <Plus size={16} className="mr-2" />
          Create Flow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flows List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Flows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAutomationFlows.map((flow) => (
                  <div
                    key={flow.id}
                    className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700 ${
                      selectedFlow?.id === flow.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedFlow(flow)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Zap size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-navy dark:text-white">
                            {flow.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {flow.trigger}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={flow.isActive ? 'success' : 'default'}
                          className="text-xs"
                        >
                          {flow.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Last run: {flow.lastRun ? formatDate(flow.lastRun) : 'Never'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant={flow.isActive ? 'secondary' : 'primary'}
                        size="sm"
                      >
                        {flow.isActive ? (
                          <>
                            <Pause size={16} className="mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play size={16} className="mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Flow Detail */}
        <div>
          {selectedFlow ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap size={20} className="text-primary" />
                  {selectedFlow.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-navy dark:text-white mb-3">Trigger</h4>
                  <div className="bg-gray-50 dark:bg-navy-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedFlow.trigger}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-navy dark:text-white mb-3">Conditions</h4>
                  <div className="space-y-2">
                    {selectedFlow.conditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Circle size={8} className="text-primary" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {condition}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-navy dark:text-white mb-3">Actions</h4>
                  <div className="space-y-2">
                    {selectedFlow.actions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <ArrowRight size={16} className="text-primary" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-navy dark:text-white">Status</span>
                    <Badge 
                      variant={selectedFlow.isActive ? 'success' : 'default'}
                      className="text-xs"
                    >
                      {selectedFlow.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  {selectedFlow.lastRun && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last run</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(selectedFlow.lastRun)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant={selectedFlow.isActive ? 'secondary' : 'primary'}
                    size="sm"
                    className="flex-1"
                  >
                    {selectedFlow.isActive ? (
                      <>
                        <Pause size={16} className="mr-2" />
                        Pause Flow
                      </>
                    ) : (
                      <>
                        <Play size={16} className="mr-2" />
                        Activate Flow
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Zap size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-navy dark:text-white mb-2">
                  Select a flow
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a flow to view details and manage
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Flow Builder Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Flow Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-navy-700 p-6 rounded-lg">
            <div className="flex items-center justify-center space-x-8">
              {/* Trigger Node */}
              <div className="bg-white dark:bg-navy-800 p-4 rounded-lg border-2 border-primary shadow-lg">
                <div className="text-center">
                  <Circle size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-navy dark:text-white">Trigger</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">New contact added</p>
                </div>
              </div>
              
              <ArrowRight size={24} className="text-gray-400" />
              
              {/* Condition Node */}
              <div className="bg-white dark:bg-navy-800 p-4 rounded-lg border-2 border-yellow-400 shadow-lg">
                <div className="text-center">
                  <Settings size={24} className="text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-navy dark:text-white">Condition</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Source = website</p>
                </div>
              </div>
              
              <ArrowRight size={24} className="text-gray-400" />
              
              {/* Action Node */}
              <div className="bg-white dark:bg-navy-800 p-4 rounded-lg border-2 border-green-400 shadow-lg">
                <div className="text-center">
                  <Zap size={24} className="text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-navy dark:text-white">Action</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Send welcome email</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
