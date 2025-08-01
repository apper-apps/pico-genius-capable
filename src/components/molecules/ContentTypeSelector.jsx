import React from "react"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const ContentTypeSelector = ({ selectedType, onSelect, className = "" }) => {
  const contentTypes = [
    {
      id: "service",
      title: "Service Page",
      description: "Generate AEO, GEO & EEAT compliant service content",
      icon: "Briefcase",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "blog",
      title: "Blog Post",
      description: "Create AIO-ready blog content with proper structure",
      icon: "FileText",
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: "ecommerce",
      title: "Product Content",
      description: "Generate compelling product descriptions and features",
      icon: "ShoppingBag",
      color: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {contentTypes.map((type) => (
        <Card
          key={type.id}
          className={`cursor-pointer p-6 transition-all duration-200 ${
            selectedType === type.id
              ? "ring-2 ring-primary-500 shadow-glow border-primary-500"
              : "hover:shadow-lg"
          }`}
          onClick={() => onSelect(type.id)}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
              <ApperIcon name={type.icon} className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">
              {type.title}
            </h3>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              {type.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default ContentTypeSelector