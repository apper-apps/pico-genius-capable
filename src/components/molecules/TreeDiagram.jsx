import React, { useState, useRef, useCallback } from 'react'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge' 
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

function TreeDiagram({ keyword, queries, onUpdateQueries }) {
  const [expandedNodes, setExpandedNodes] = useState(new Set(['root', 'awareness', 'consideration', 'decision']))
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverNode, setDragOverNode] = useState(null)
  const dragCounter = useRef(0)

  // Group queries by stage
  const groupedQueries = queries.reduce((acc, query) => {
    if (!acc[query.stage]) acc[query.stage] = []
    acc[query.stage].push(query)
    return acc
  }, {})

  const stages = [
    {
      id: 'awareness',
      label: 'Awareness',
      description: 'Initial research and problem identification',
      icon: 'Eye',
      color: 'info',
      queries: groupedQueries.awareness || []
    },
    {
      id: 'consideration', 
      label: 'Consideration',
      description: 'Evaluating solutions and options',
      icon: 'Search',
      color: 'warning',
      queries: groupedQueries.consideration || []
    },
    {
      id: 'decision',
      label: 'Decision',
      description: 'Ready to purchase or take action',
      icon: 'ShoppingCart',
      color: 'success',
      queries: groupedQueries.decision || []
    }
  ]

  const toggleNode = useCallback((nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }, [])

  const handleDragStart = useCallback((e, query) => {
    setDraggedItem(query)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.outerHTML)
    e.target.style.opacity = '0.5'
  }, [])

  const handleDragEnd = useCallback((e) => {
    e.target.style.opacity = '1'
    setDraggedItem(null)
    setDragOverNode(null)
    dragCounter.current = 0
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDragEnter = useCallback((e, stageId) => {
    e.preventDefault()
    dragCounter.current++
    setDragOverNode(stageId)
  }, [])

  const handleDragLeave = useCallback((e) => {
    dragCounter.current--
    if (dragCounter.current === 0) {
      setDragOverNode(null)
    }
  }, [])

  const handleDrop = useCallback((e, targetStage) => {
    e.preventDefault()
    dragCounter.current = 0
    setDragOverNode(null)

    if (draggedItem && draggedItem.stage !== targetStage) {
      const updatedQueries = queries.map(query => 
        query.id === draggedItem.id 
          ? { ...query, stage: targetStage }
          : query
      )
      onUpdateQueries(updatedQueries)
    }
  }, [draggedItem, queries, onUpdateQueries])

  const getStageStats = (stageQueries) => {
    if (stageQueries.length === 0) return { avgVolume: 0, avgDifficulty: 0 }
    
    const totalVolume = stageQueries.reduce((sum, q) => sum + q.searchVolume, 0)
    const totalDifficulty = stageQueries.reduce((sum, q) => sum + q.difficulty, 0)
    
    return {
      avgVolume: Math.round(totalVolume / stageQueries.length),
      avgDifficulty: Math.round(totalDifficulty / stageQueries.length)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tree Root */}
      <div className="flex justify-center">
        <Card className="p-6 bg-gradient-to-br from-primary-500/20 to-purple-500/20 border-primary-400/30">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
              <ApperIcon name="Target" className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{keyword}</h3>
            <p className="text-gray-300 text-sm">Primary Keyword</p>
            <div className="flex items-center justify-center space-x-4 mt-3 text-sm text-gray-400">
              <span>{queries.length} queries</span>
              <span>•</span>
              <span>{stages.length} stages</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Connection Lines */}
      <div className="flex justify-center">
        <div className="w-px h-8 bg-gradient-to-b from-primary-400 to-transparent"></div>
      </div>

      {/* Stage Branches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {stages.map((stage, index) => {
          const isExpanded = expandedNodes.has(stage.id)
          const isDragOver = dragOverNode === stage.id
          const stats = getStageStats(stage.queries)

          return (
            <div key={stage.id} className="space-y-4">
              {/* Stage Header */}
              <div className="flex justify-center">
                <Card 
                  className={cn(
                    "p-4 cursor-pointer transition-all duration-300 min-w-[280px]",
                    isDragOver && "ring-2 ring-primary-400 bg-primary-500/10",
                    !isExpanded && "opacity-75 hover:opacity-100"
                  )}
                  onClick={() => toggleNode(stage.id)}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, stage.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        stage.color === 'info' && "bg-blue-500/20 text-blue-400",
                        stage.color === 'warning' && "bg-yellow-500/20 text-yellow-400", 
                        stage.color === 'success' && "bg-emerald-500/20 text-emerald-400"
                      )}>
                        <ApperIcon name={stage.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{stage.label}</h4>
                        <Badge variant={stage.color} size="small">
                          {stage.queries.length} queries
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="small"
                      icon={isExpanded ? "ChevronUp" : "ChevronDown"}
                      className="text-gray-400 hover:text-white"
                    />
                  </div>

                  <p className="text-sm text-gray-400 mb-3">{stage.description}</p>

                  {stage.queries.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="TrendingUp" className="w-3 h-3" />
                        <span>Avg: {stats.avgVolume.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Target" className="w-3 h-3" />
                        <span>Difficulty: {stats.avgDifficulty}%</span>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Connection Line */}
              {isExpanded && stage.queries.length > 0 && (
                <div className="flex justify-center">
                  <div className="w-px h-6 bg-gradient-to-b from-gray-600 to-transparent"></div>
                </div>
              )}

              {/* Stage Queries */}
              {isExpanded && (
                <div className="space-y-3 animate-fade-in">
                  {stage.queries.length === 0 ? (
                    <div className="text-center py-8">
                      <ApperIcon name="Plus" className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">
                        Drop queries here or generate new ones
                      </p>
                    </div>
                  ) : (
                    stage.queries.map((query) => (
                      <Card
                        key={query.id}
                        className="p-3 cursor-move hover:shadow-lg transition-all duration-200 bg-gray-800/50"
                        draggable
                        onDragStart={(e) => handleDragStart(e, query)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="GripVertical" className="w-3 h-3 text-gray-500" />
                            <Badge variant={stage.color} size="small">
                              {stage.id}
                            </Badge>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigator.clipboard.writeText(query.query)
                            }}
                            className="text-gray-400 hover:text-white transition-colors duration-200"
                          >
                            <ApperIcon name="Copy" className="w-3 h-3" />
                          </button>
                        </div>

                        <h5 className="text-white text-sm font-medium mb-2 line-clamp-2">
                          {query.query}
                        </h5>

                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="TrendingUp" className="w-3 h-3" />
                            <span>{query.searchVolume.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Target" className="w-3 h-3" />
                            <span>{query.difficulty}%</span>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Tree Legend */}
      <Card className="p-4 bg-gray-800/30">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Drag to reorganize</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="MousePointer" className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Click to expand/collapse</span>
            </div>
          </div>
          
          <div className="text-gray-500">
            Organize queries by buyer journey stage
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TreeDiagram