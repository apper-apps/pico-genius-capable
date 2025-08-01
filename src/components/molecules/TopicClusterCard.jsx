import React from "react"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const TopicClusterCard = ({ cluster, onClick, className = "" }) => {
  const intentColors = {
    informational: "info",
    commercial: "warning", 
    transactional: "success"
  }

  const intentIcons = {
    informational: "BookOpen",
    commercial: "TrendingUp",
    transactional: "ShoppingCart"
  }

  return (
    <Card 
      className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-200 ${className}`}
      onClick={() => onClick && onClick(cluster)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
            <ApperIcon 
              name={intentIcons[cluster.intent] || "Layers"} 
              className="w-5 h-5 text-white" 
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {cluster.mainTopic}
            </h3>
            <Badge variant={intentColors[cluster.intent] || "secondary"} size="small">
              {cluster.intent}
            </Badge>
          </div>
        </div>
        
        <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Subtopics</h4>
          <div className="flex flex-wrap gap-1">
            {cluster.subtopics?.slice(0, 3).map((subtopic, index) => (
              <Badge key={index} variant="secondary" size="small">
                {subtopic}
              </Badge>
            ))}
            {cluster.subtopics?.length > 3 && (
              <Badge variant="secondary" size="small">
                +{cluster.subtopics.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Keywords</h4>
          <div className="text-sm text-gray-400">
            {cluster.keywords?.length || 0} keywords
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TopicClusterCard