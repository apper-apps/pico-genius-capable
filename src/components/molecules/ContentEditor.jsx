import React, { useState } from "react"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"

const ContentEditor = ({ content, onExport, highlightedEntities = [], className = "" }) => {
  const [activeTab, setActiveTab] = useState("content")
  const [copied, setCopied] = useState(false)

  const tabs = [
    { id: "content", label: "Content", icon: "FileText" },
    { id: "entities", label: "Entities", icon: "Tag" },
    { id: "structure", label: "Structure", icon: "List" },
    { id: "faqs", label: "FAQs", icon: "HelpCircle" }
  ]

  const handleCopy = async () => {
    try {
      let textToCopy = ""
      
      switch (activeTab) {
        case "content":
          textToCopy = content.content || ""
          break
        case "entities":
          textToCopy = content.entities?.join(", ") || ""
          break
        case "structure":
          textToCopy = content.headings?.join("\n") || ""
          break
        case "faqs":
          textToCopy = content.faqs?.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n") || ""
          break
        default:
          textToCopy = content.content || ""
      }
      
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      toast.success("Content copied to clipboard!")
      
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy content")
    }
  }
const highlightEntities = (text) => {
    if (!text || !highlightedEntities.length) return text
    
    let highlightedText = text
    highlightedEntities.forEach(entity => {
      const regex = new RegExp(`\\b${entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      highlightedText = highlightedText.replace(regex, match => 
        `<mark class="bg-primary-500/30 text-primary-200 px-1 py-0.5 rounded">${match}</mark>`
      )
    })
    return highlightedText
  }

  const renderTabContent = () => {
switch (activeTab) {
      case "content":
        return (
          <div className="prose prose-invert max-w-none">
            <div 
              className="whitespace-pre-wrap text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightEntities(content.content || "No content generated yet.")
              }}
            />
          </div>
        )

      case "entities":
        return (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Extracted Entities</h4>
            <div className="flex flex-wrap gap-2">
              {content.entities?.map((entity, index) => (
                <Badge key={index} variant="primary">
                  {entity}
                </Badge>
              )) || <p className="text-gray-400">No entities extracted yet.</p>}
            </div>
          </div>
        )

      case "structure":
        return (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Content Structure</h4>
            <ul className="space-y-2">
              {content.headings?.map((heading, index) => (
                <li key={index} className="text-gray-300 flex items-center">
                  <ApperIcon name="ChevronRight" className="w-4 h-4 mr-2 text-primary-400" />
                  {heading}
                </li>
              )) || <p className="text-gray-400">No structure available yet.</p>}
            </ul>
          </div>
        )

      case "faqs":
        return (
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h4>
            <div className="space-y-4">
              {content.faqs?.map((faq, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4">
                  <h5 className="font-medium text-white mb-2">{faq.question}</h5>
                  <p className="text-gray-400 text-sm">{faq.answer}</p>
                </div>
              )) || <p className="text-gray-400">No FAQs generated yet.</p>}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className={`${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Generated Content</h3>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="small"
              icon={copied ? "Check" : "Copy"}
              onClick={handleCopy}
              className={copied ? "text-emerald-400" : ""}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
            
            <Button
              variant="secondary"
              size="small"
              icon="Download"
              onClick={() => onExport && onExport("markdown")}
            >
              Export
            </Button>
          </div>
        </div>

        <div className="border-b border-gray-700 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>
    </Card>
  )
}

export default ContentEditor