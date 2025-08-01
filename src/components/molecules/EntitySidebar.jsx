import React from 'react'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const EntitySidebar = ({ serpResults, highlightedEntities, onToggleEntity, className = "" }) => {
  // Extract unique entities from all SERP results
  const allEntities = React.useMemo(() => {
    const entitySet = new Set()
    serpResults.forEach(result => {
      if (result.entities) {
        result.entities.forEach(entity => entitySet.add(entity))
      }
    })
    return Array.from(entitySet).sort()
  }, [serpResults])

  const handleToggleEntity = (entity) => {
    onToggleEntity(entity)
    const isHighlighted = highlightedEntities.includes(entity)
    toast.success(
      isHighlighted 
        ? `Removed highlighting for "${entity}"` 
        : `Added highlighting for "${entity}"`
    )
  }

  const handleToggleAll = () => {
    const allHighlighted = allEntities.every(entity => highlightedEntities.includes(entity))
    if (allHighlighted) {
      // Clear all
      allEntities.forEach(entity => {
        if (highlightedEntities.includes(entity)) {
          onToggleEntity(entity)
        }
      })
      toast.success("Cleared all entity highlighting")
    } else {
      // Highlight all
      allEntities.forEach(entity => {
        if (!highlightedEntities.includes(entity)) {
          onToggleEntity(entity)
        }
      })
      toast.success("Highlighted all entities")
    }
  }

  if (!serpResults.length) {
    return (
      <Card className={`${className}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <ApperIcon name="Tag" className="w-5 h-5 mr-2 text-primary-400" />
              SERP Entities
            </h3>
          </div>
          <div className="text-center py-8">
            <ApperIcon name="Search" className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">
              Generate SERP results to see extracted entities
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <ApperIcon name="Tag" className="w-5 h-5 mr-2 text-primary-400" />
            SERP Entities
          </h3>
          <Badge variant="secondary" className="text-xs">
            {allEntities.length}
          </Badge>
        </div>

        {allEntities.length > 0 && (
          <div className="mb-4">
            <button
              onClick={handleToggleAll}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <ApperIcon 
                name={allEntities.every(entity => highlightedEntities.includes(entity)) ? "EyeOff" : "Eye"} 
                className="w-4 h-4 mr-2" 
              />
              {allEntities.every(entity => highlightedEntities.includes(entity)) ? "Clear All" : "Highlight All"}
            </button>
          </div>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {allEntities.map((entity, index) => {
            const isHighlighted = highlightedEntities.includes(entity)
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors duration-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {entity}
                  </p>
                  <p className="text-xs text-gray-400">
                    Entity from SERP results
                  </p>
                </div>
                
                <button
                  onClick={() => handleToggleEntity(entity)}
                  className={`ml-3 p-1 rounded-full transition-colors duration-200 ${
                    isHighlighted
                      ? "bg-primary-500 text-white"
                      : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                  }`}
                >
                  <ApperIcon 
                    name={isHighlighted ? "Eye" : "EyeOff"} 
                    className="w-4 h-4" 
                  />
                </button>
              </div>
            )
          })}
        </div>

        {allEntities.length === 0 && (
          <div className="text-center py-6">
            <ApperIcon name="Tag" className="w-8 h-8 mx-auto text-gray-600 mb-2" />
            <p className="text-gray-400 text-sm">
              No entities found in SERP results
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default EntitySidebar