import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";

const SerpPreview = ({ results = [], loading = false, error, className = "" }) => {
  const [showHeadingAnalysis, setShowHeadingAnalysis] = useState(false)

const analyzeHeadingPatterns = (results) => {
    if (!results || !Array.isArray(results) || results.length === 0) {
      return []
    }
    
    const patterns = new Map()
    results.forEach(result => {
        const titleParts = result.title.split(/[-|:]/g).map(part => part.trim())
        titleParts.forEach(part => {
          if (part && part.length > 5) {
            const pattern = part.toLowerCase().replace(/[^a-z\s]/g, '').trim()
            if (pattern) {
              patterns.set(pattern, (patterns.get(pattern) || 0) + 1)
            }
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

// Handle error state with enhanced messaging
if (error) {
    const errorLower = error?.toLowerCase() || '';
    const isNetworkError = errorLower.includes('network connection failed') || 
                          errorLower.includes('failed to fetch') ||
                          errorLower.includes('cors policy')
    const isTimeoutError = errorLower.includes('timed out') || 
                          errorLower.includes('timeout') ||
                          errorLower.includes('10 seconds')
    const isOfflineMode = errorLower.includes('offline mode') || 
                         errorLower.includes('using offline mode') ||
                         errorLower.includes('demonstration')
    const isCORSError = errorLower.includes('cors') || errorLower.includes('cross-origin')
    const isRateLimitError = errorLower.includes('rate limit') || errorLower.includes('429')
    const isAuthError = errorLower.includes('authentication') || errorLower.includes('401') || errorLower.includes('403')
    
    // Determine primary error type for better UX
    let errorType = 'unknown';
    let iconName = 'AlertCircle';
    let title = 'Connection Issue';
    let description = 'Failed to load search results';
    let actionText = 'Retry Connection';
    
    if (isNetworkError || isCORSError) {
      errorType = 'network';
      iconName = 'WifiOff';
      title = 'Network Connection Error';
      description = isCORSError ? 'Browser security policy is blocking the request' : 'Unable to connect to search servers';
    } else if (isTimeoutError) {
      errorType = 'timeout';
      iconName = 'Clock';
      title = 'Request Timeout';
      description = 'The search request is taking too long to complete';
    } else if (isOfflineMode) {
      errorType = 'offline';
      iconName = 'Database';
      title = 'Offline Mode';
      description = 'Using demonstration data';
      actionText = 'View Demo Data';
    } else if (isRateLimitError) {
      errorType = 'rateLimit';
      iconName = 'Clock';
      title = 'Rate Limited';
      description = 'Too many requests - please wait before trying again';
    } else if (isAuthError) {
      errorType = 'auth';
      iconName = 'Key';
      title = 'Authentication Error';
      description = 'API configuration issue detected';
    }
    
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <ApperIcon 
            name={iconName} 
            className="w-5 h-5 text-red-400 mr-3" 
          />
          <h3 className="text-lg font-semibold text-white">
            SERP Preview - {title}
          </h3>
        </div>
        <div className="text-center py-8">
          <ApperIcon 
            name={iconName} 
            className="w-12 h-12 text-gray-600 mx-auto mb-4" 
          />
          <p className="text-gray-400 mb-2">{description}</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          
          {/* Network/Timeout specific guidance */}
          {(errorType === 'network' || errorType === 'timeout') && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600">
                {errorType === 'network' 
                  ? 'Check your internet connection and firewall settings' 
                  : 'Server may be experiencing high load. Please try again.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary-400 hover:text-primary-300 text-sm font-medium underline"
              >
                {actionText}
              </button>
            </div>
          )}
          
          {/* Rate limit specific guidance */}
          {errorType === 'rateLimit' && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600">
                Please wait 60 seconds before making another request
              </p>
              <div className="text-xs text-gray-500">
                Consider upgrading your API plan for higher limits
              </div>
            </div>
          )}
          
          {/* Auth error guidance */}
          {errorType === 'auth' && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600">
                Please check your API key configuration
              </p>
              <div className="text-xs text-gray-500">
                Contact support if the issue persists
              </div>
            </div>
          )}
          
          {/* Offline mode info */}
          {errorType === 'offline' && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600">
                Using cached data for demonstration purposes
              </p>
              <div className="text-xs text-gray-500">
                Real API integration available in production
              </div>
            </div>
          )}
        </div>
      </Card>
    )
  }

  // Handle empty results
  if (!loading && (!results || results.length === 0)) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <ApperIcon name="Globe" className="w-5 h-5 text-primary-400 mr-3" />
          <h3 className="text-lg font-semibold text-white">SERP Preview</h3>
        </div>
        <div className="text-center py-8">
          <ApperIcon name="Search" className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No search results available</p>
          <p className="text-sm text-gray-500">Try searching for a keyword to see SERP analysis</p>
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
          <div key={result?.position || index} className="border-l-2 border-gray-700 pl-4 pb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
<Badge variant="secondary" size="small">
                  #{result?.position || index + 1}
                </Badge>
                <span className="text-xs text-gray-500">{result?.url || 'No URL'}</span>
              </div>
            </div>
            
            <h4 className="text-blue-400 hover:text-blue-300 cursor-pointer mb-1 line-clamp-2">
              {result?.title || 'No title available'}
            </h4>
            
            <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
              {result?.snippet || 'No snippet available'}
            </p>
{result?.entities && Array.isArray(result.entities) && result.entities.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {result.entities.slice(0, 3).map((entity, i) => (
                  <Badge key={i} variant="primary" size="small">
                    {entity || 'Entity'}
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