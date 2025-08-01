import React, { useState, useEffect } from "react"
import SearchBar from "@/components/molecules/SearchBar"
import TopicClusterCard from "@/components/molecules/TopicClusterCard"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import topicClusterService from "@/services/api/topicClusterService"
import { toast } from "react-toastify"

const TopicClusters = () => {
  const [clusters, setClusters] = useState([])
  const [selectedCluster, setSelectedCluster] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [filterIntent, setFilterIntent] = useState("all")

  useEffect(() => {
    loadClusters()
  }, [])

  const loadClusters = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await topicClusterService.getAll()
      setClusters(data)
    } catch (err) {
      setError("Failed to load topic clusters. Please try again.")
      console.error("Error loading clusters:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCluster = async (keyword) => {
    try {
      setGenerating(true)
      setError("")
      
      // Simulate cluster generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newCluster = await topicClusterService.create({
        mainTopic: keyword,
        intent: ["informational", "commercial", "transactional"][Math.floor(Math.random() * 3)],
        subtopics: generateSubtopics(keyword),
        keywords: generateRelatedKeywords(keyword)
      })
      
      setClusters(prev => [newCluster, ...prev])
      toast.success("Topic cluster generated successfully!")
    } catch (err) {
      setError("Failed to generate topic cluster. Please try again.")
      console.error("Error generating cluster:", err)
    } finally {
      setGenerating(false)
    }
  }

  const generateSubtopics = (keyword) => {
    const subtopicTemplates = [
      `${keyword} best practices`,
      `${keyword} tools and software`,
      `${keyword} strategy and planning`,
      `${keyword} implementation guide`,
      `${keyword} case studies`,
      `${keyword} trends and updates`,
      `${keyword} measurement and analytics`,
      `${keyword} common mistakes`,
      `${keyword} expert tips`,
      `${keyword} resources and guides`
    ]
    
    return subtopicTemplates
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 5) + 4)
  }

  const generateRelatedKeywords = (keyword) => {
    const keywordTemplates = [
      `best ${keyword}`,
      `${keyword} guide`,
      `${keyword} tips`,
      `${keyword} strategies`,
      `${keyword} tools`,
      `${keyword} services`,
      `${keyword} solutions`,
      `${keyword} examples`,
      `${keyword} benefits`,
      `${keyword} cost`,
      `${keyword} comparison`,
      `${keyword} reviews`,
      `${keyword} tutorial`,
      `${keyword} checklist`,
      `${keyword} template`
    ]
    
    return keywordTemplates
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 8) + 6)
  }

  const filteredClusters = filterIntent === "all" 
    ? clusters 
    : clusters.filter(cluster => cluster.intent === filterIntent)

  const intentFilters = [
    { id: "all", label: "All Intents", count: clusters.length },
    { id: "informational", label: "Informational", count: clusters.filter(c => c.intent === "informational").length },
    { id: "commercial", label: "Commercial", count: clusters.filter(c => c.intent === "commercial").length },
    { id: "transactional", label: "Transactional", count: clusters.filter(c => c.intent === "transactional").length }
  ]

  const retryLoad = () => {
    loadClusters()
  }

  if (loading) {
    return <Loading />
  }

  if (error && clusters.length === 0) {
    return <Error message={error} onRetry={retryLoad} />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-4">
          Topic Clustering
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Generate intent-based topic clusters to organize your content strategy
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-6">
        <SearchBar
          onSearch={handleGenerateCluster}
          placeholder="Enter main topic to generate clusters..."
          loading={generating}
        />
      </Card>

      {clusters.length === 0 ? (
        <Empty
          title="No Topic Clusters Yet"
          description="Start by entering a main topic above to generate your first topic cluster with related subtopics and keywords."
          icon="Network"
        />
      ) : (
        <>
          {/* Intent Filters */}
          <div className="flex flex-wrap gap-3">
            {intentFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterIntent(filter.id)}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filterIntent === filter.id
                    ? "bg-primary-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <span>{filter.label}</span>
                <Badge variant="secondary" size="small">
                  {filter.count}
                </Badge>
              </button>
            ))}
          </div>

          {/* Clusters Grid */}
          {selectedCluster ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  icon="ArrowLeft"
                  onClick={() => setSelectedCluster(null)}
                >
                  Back to Clusters
                </Button>
              </div>

              <Card className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedCluster.mainTopic}
                    </h2>
                    <Badge 
                      variant={
                        selectedCluster.intent === "informational" ? "info" :
                        selectedCluster.intent === "commercial" ? "warning" : "success"
                      }
                    >
                      {selectedCluster.intent}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Network" className="w-8 h-8 text-primary-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Subtopics ({selectedCluster.subtopics?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {selectedCluster.subtopics?.map((subtopic, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                          <ApperIcon name="ChevronRight" className="w-4 h-4 text-primary-400" />
                          <span className="text-gray-300">{subtopic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Related Keywords ({selectedCluster.keywords?.length || 0})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCluster.keywords?.map((keyword, index) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClusters.map((cluster) => (
                <TopicClusterCard
                  key={cluster.Id}
                  cluster={cluster}
                  onClick={setSelectedCluster}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TopicClusters