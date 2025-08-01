import React, { useState } from "react"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const SerpPreview = ({ results, loading, className = "" }) => {
  const [showHeadingAnalysis, setShowHeadingAnalysis] = useState(false)

  const analyzeHeadingPatterns = (results) => {
    const patterns = new Map()
    results.forEach(result => {
      const titleParts = result.title.split(/[-|:]/g).map(part => part.trim())
      titleParts.forEach(part => {
        if (part.length > 5) {
          const pattern = part.toLowerCase().replace(/[^a-z\s]/g, '').trim()
          patterns.set(pattern, (patterns.get(pattern) || 0) + 1)
        }
      })
    })
    
    return Array.from(patterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([pattern, count]) => ({ pattern, count }))
  }

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <div className="skeleton w-6 h-6 rounded mr-3"></div>
          <div className="skeleton h-6 w-32 rounded"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton h-5 w-3/4 rounded"></div>
              <div className="skeleton h-4 w-1/2 rounded"></div>
              <div className="skeleton h-3 w-full rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  const headingPatterns = analyzeHeadingPatterns(results)

return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ApperIcon name="Globe" className="w-5 h-5 text-primary-400 mr-3" />
          <h3 className="text-lg font-semibold text-white">SERP Preview</h3>
        </div>
        <button
          onClick={() => setShowHeadingAnalysis(!showHeadingAnalysis)}
          className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ApperIcon name="BarChart3" className="w-4 h-4" />
          <span>Heading Analysis</span>
        </button>
      </div>

      {showHeadingAnalysis && headingPatterns.length > 0 && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center">
            <ApperIcon name="TrendingUp" className="w-4 h-4 mr-2 text-primary-400" />
            Common Heading Patterns
          </h4>
          <div className="space-y-2">
            {headingPatterns.map((pattern, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-300 capitalize">{pattern.pattern}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${(pattern.count / results.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{pattern.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={result.position} className="border-l-2 border-gray-700 pl-4 pb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" size="small">
                  #{result.position}
                </Badge>
                <span className="text-xs text-gray-500">{result.url}</span>
              </div>
            </div>
            
            <h4 className="text-blue-400 hover:text-blue-300 cursor-pointer mb-1 line-clamp-2">
              {result.title}
            </h4>
            
            <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
              {result.snippet}
            </p>
            
            {result.entities && result.entities.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {result.entities.slice(0, 3).map((entity, i) => (
                  <Badge key={i} variant="primary" size="small">
                    {entity}
                  </Badge>
                ))}
                {result.entities.length > 3 && (
                  <Badge variant="secondary" size="small">
                    +{result.entities.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default SerpPreview