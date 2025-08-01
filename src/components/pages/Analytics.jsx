import React, { useState, useEffect } from "react"
import Chart from "react-apexcharts"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import contentService from "@/services/api/contentService"
import keywordService from "@/services/api/keywordService"

const Analytics = () => {
  const [content, setContent] = useState([])
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError("")
      const [contentData, keywordData] = await Promise.all([
        contentService.getAll(),
        keywordService.getAll()
      ])
      setContent(contentData)
      setKeywords(keywordData)
    } catch (err) {
      setError("Failed to load analytics data. Please try again.")
      console.error("Error loading analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  const retryLoad = () => {
    loadAnalytics()
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={retryLoad} />
  }

  if (content.length === 0 && keywords.length === 0) {
    return (
      <Empty
        title="No Analytics Data Available"
        description="Start generating content and keywords to see your performance analytics and insights."
        icon="BarChart3"
      />
    )
  }

  // Calculate metrics
  const totalContent = content.length
  const avgScore = content.length > 0 
    ? Math.round(content.reduce((sum, item) => sum + item.score, 0) / content.length)
    : 0
  const totalKeywords = keywords.length
  const avgDifficulty = keywords.length > 0
    ? Math.round(keywords.reduce((sum, item) => sum + item.difficulty, 0) / keywords.length)
    : 0

  // Content type distribution
  const contentTypes = content.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1
    return acc
  }, {})

  // Intent distribution
  const intentTypes = keywords.reduce((acc, item) => {
    acc[item.intent] = (acc[item.intent] || 0) + 1
    return acc
  }, {})

  // Performance over time (mock data)
  const performanceData = {
    series: [{
      name: "Content Score",
      data: [78, 82, 85, 88, 91, 87, 93, 89, 95, 92, 96, 94]
    }],
    options: {
      chart: {
        type: "line",
        height: 350,
        background: "transparent",
        toolbar: { show: false }
      },
      theme: { mode: "dark" },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#6366f1"]
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 100]
        }
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 5
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: { style: { colors: "#9ca3af" } }
      },
      yaxis: {
        labels: { style: { colors: "#9ca3af" } }
      },
      tooltip: {
        theme: "dark",
        style: {
          backgroundColor: "#1f2937",
          color: "#f9fafb"
        }
      }
    }
  }

  // Content type chart
  const contentTypeChart = {
    series: Object.values(contentTypes),
    options: {
      chart: {
        type: "donut",
        height: 300,
        background: "transparent"
      },
      theme: { mode: "dark" },
      labels: Object.keys(contentTypes).map(type => type.charAt(0).toUpperCase() + type.slice(1)),
      colors: ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b"],
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: {
              show: true,
              total: {
                show: true,
                color: "#f9fafb"
              }
            }
          }
        }
      },
      legend: {
        position: "bottom",
        labels: { colors: "#9ca3af" }
      },
      tooltip: {
        theme: "dark",
        style: {
          backgroundColor: "#1f2937",
          color: "#f9fafb"
        }
      }
    }
  }

  // Top performing content
  const topContent = content
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  // Metrics cards data
  const metricsCards = [
    {
      title: "Total Content",
      value: totalContent,
      change: "+12%",
      changeType: "positive",
      icon: "FileText"
    },
    {
      title: "Avg. SEO Score",
      value: `${avgScore}%`,
      change: "+5%",
      changeType: "positive",
      icon: "TrendingUp"
    },
    {
      title: "Keywords Tracked",
      value: totalKeywords,
      change: "+18%",
      changeType: "positive",
      icon: "Tag"
    },
    {
      title: "Avg. Difficulty",
      value: `${avgDifficulty}%`,
      change: "-3%",
      changeType: "negative",
      icon: "Target"
    }
  ]

  const periods = [
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "90 Days" },
    { id: "1y", label: "1 Year" }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-400">
            Track your content performance and SEO metrics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                selectedPeriod === period.id
                  ? "bg-primary-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsCards.map((metric, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    metric.changeType === "positive" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">vs last period</span>
                </div>
              </div>
              
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                <ApperIcon name={metric.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Performance Trend</h3>
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary-400" />
          </div>
          
          <Chart
            options={performanceData.options}
            series={performanceData.series}
            type="line"
            height={300}
          />
        </Card>

        {/* Content Type Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Content Types</h3>
            <ApperIcon name="PieChart" className="w-5 h-5 text-primary-400" />
          </div>
          
          {Object.keys(contentTypes).length > 0 ? (
            <Chart
              options={contentTypeChart.options}
              series={contentTypeChart.series}
              type="donut"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              <div className="text-center">
                <ApperIcon name="PieChart" className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No content data available</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Top Performing Content</h3>
          <ApperIcon name="Award" className="w-5 h-5 text-primary-400" />
        </div>

        {topContent.length > 0 ? (
          <div className="space-y-4">
            {topContent.map((item, index) => (
              <div key={item.Id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-semibold">{index + 1}</span>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium line-clamp-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <Badge variant="secondary" size="small">
                        {item.type}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold text-emerald-400">
                    {item.score}%
                  </div>
                  <div className="text-xs text-gray-400">SEO Score</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <ApperIcon name="FileText" className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No content available to analyze</p>
          </div>
        )}
      </Card>

      {/* Intent Distribution */}
      {Object.keys(intentTypes).length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Search Intent Distribution</h3>
            <ApperIcon name="Target" className="w-5 h-5 text-primary-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(intentTypes).map(([intent, count]) => {
              const percentage = Math.round((count / totalKeywords) * 100)
              const colors = {
                informational: "info",
                commercial: "warning",
                transactional: "success"
              }

              return (
                <div key={intent} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{count}</span>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-1 capitalize">
                    {intent}
                  </h4>
                  
                  <Badge variant={colors[intent] || "secondary"}>
                    {percentage}%
                  </Badge>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

export default Analytics