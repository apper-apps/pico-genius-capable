import React, { useState } from "react"
import SearchBar from "@/components/molecules/SearchBar"
import ContentTypeSelector from "@/components/molecules/ContentTypeSelector"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const ContentGenerationForm = ({ onGenerate, loading }) => {
  const [keyword, setKeyword] = useState("")
  const [contentType, setContentType] = useState("")
  const [step, setStep] = useState(1)

  const handleKeywordSearch = (searchQuery) => {
    setKeyword(searchQuery)
    setStep(2)
  }

  const handleGenerate = () => {
    if (keyword && contentType) {
      onGenerate({ keyword, contentType })
    }
  }

  const handleBack = () => {
    setStep(1)
    setContentType("")
  }

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center space-x-2 ${step >= 1 ? "text-primary-400" : "text-gray-500"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            step >= 1 
              ? "border-primary-400 bg-primary-400 text-white" 
              : "border-gray-500 text-gray-500"
          }`}>
            {step > 1 ? <ApperIcon name="Check" className="w-4 h-4" /> : "1"}
          </div>
          <span className="font-medium">Keyword</span>
        </div>
        
        <div className={`w-12 h-0.5 ${step >= 2 ? "bg-primary-400" : "bg-gray-600"}`}></div>
        
        <div className={`flex items-center space-x-2 ${step >= 2 ? "text-primary-400" : "text-gray-500"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            step >= 2 
              ? "border-primary-400 bg-primary-400 text-white" 
              : "border-gray-500 text-gray-500"
          }`}>
            2
          </div>
          <span className="font-medium">Content Type</span>
        </div>
        
        <div className={`w-12 h-0.5 ${step >= 3 ? "bg-primary-400" : "bg-gray-600"}`}></div>
        
        <div className={`flex items-center space-x-2 ${step >= 3 ? "text-primary-400" : "text-gray-500"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
            step >= 3 
              ? "border-primary-400 bg-primary-400 text-white" 
              : "border-gray-500 text-gray-500"
          }`}>
            3
          </div>
          <span className="font-medium">Generate</span>
        </div>
      </div>

      {step === 1 && (
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">
              Enter Your Target Keyword
            </h2>
            <p className="text-gray-400">
              Start by entering the keyword you want to create content for
            </p>
          </div>

          <SearchBar
            onSearch={handleKeywordSearch}
            placeholder="e.g., digital marketing services, best coffee makers..."
            loading={loading}
          />
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Select Content Type
                </h2>
                <p className="text-gray-400">
                  Choose the type of content you want to generate for: <span className="text-primary-400 font-medium">{keyword}</span>
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="small"
                icon="ArrowLeft"
                onClick={handleBack}
              >
                Back
              </Button>
            </div>

            <ContentTypeSelector
              selectedType={contentType}
              onSelect={setContentType}
            />
          </Card>

          {contentType && (
            <div className="flex justify-center">
              <Button
                size="large"
                icon="Wand2"
                onClick={handleGenerate}
                loading={loading}
                className="px-12"
              >
                Generate Content
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ContentGenerationForm