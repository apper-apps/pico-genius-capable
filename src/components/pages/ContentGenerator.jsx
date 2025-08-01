import React, { useState, useEffect } from "react"
import ContentGenerationForm from "@/components/organisms/ContentGenerationForm"
import SerpPreview from "@/components/molecules/SerpPreview"
import ContentEditor from "@/components/molecules/ContentEditor"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import keywordService from "@/services/api/keywordService"
import contentService from "@/services/api/contentService"
import serpService from "@/services/api/serpService"
import { toast } from "react-toastify"

const ContentGenerator = () => {
  const [keywords, setKeywords] = useState([])
  const [content, setContent] = useState([])
  const [serpResults, setSerpResults] = useState([])
  const [currentContent, setCurrentContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [serpLoading, setSerpLoading] = useState(false)
  const [error, setError] = useState("")
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError("")
      const [keywordData, contentData, serpData] = await Promise.all([
        keywordService.getAll(),
        contentService.getAll(),
        serpService.getAll()
      ])
      setKeywords(keywordData)
      setContent(contentData)
      setSerpResults(serpData)
    } catch (err) {
      setError("Failed to load data. Please try again.")
      console.error("Error loading initial data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async ({ keyword, contentType }) => {
    try {
      setLoading(true)
      setSerpLoading(true)
      setError("")
      setShowResults(true)

      // Simulate SERP analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      const serpData = await serpService.getAll()
      setSerpResults(serpData)
      setSerpLoading(false)

      // Generate content
      await new Promise(resolve => setTimeout(resolve, 3000))
      const newContent = await contentService.create({
        keyword,
        type: contentType,
        title: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content for "${keyword}"`,
        content: generateSampleContent(keyword, contentType),
        entities: generateEntities(keyword),
        headings: generateHeadings(keyword, contentType),
        faqs: generateFAQs(keyword, contentType),
        score: Math.floor(Math.random() * 20) + 80
      })

      setCurrentContent(newContent)
      setContent(prev => [newContent, ...prev])
      toast.success("Content generated successfully!")
    } catch (err) {
      setError("Failed to generate content. Please try again.")
      console.error("Error generating content:", err)
    } finally {
      setLoading(false)
    }
  }

  const generateSampleContent = (keyword, type) => {
    const templates = {
      service: `# Professional ${keyword} Services

## Transform Your Business with Expert ${keyword} Solutions

At our company, we specialize in delivering exceptional ${keyword} services that drive real results for businesses of all sizes. Our team of experienced professionals combines industry expertise with cutting-edge technology to provide comprehensive solutions tailored to your unique needs.

### Our ${keyword} Approach

We understand that every business is unique, which is why we take a personalized approach to ${keyword}. Our process begins with a thorough analysis of your current situation, followed by the development of a customized strategy designed to achieve your specific goals.

### Key Benefits of Our ${keyword} Services

• **Proven Results**: Our track record speaks for itself with consistent, measurable outcomes
• **Expert Team**: Certified professionals with extensive experience in ${keyword}
• **Custom Solutions**: Tailored strategies that align with your business objectives
• **Ongoing Support**: Continuous monitoring and optimization to ensure sustained success

### Why Choose Us for ${keyword}?

With years of experience in the industry, we've helped hundreds of businesses achieve their ${keyword} goals. Our comprehensive approach ensures that every aspect of your ${keyword} strategy is optimized for maximum impact and ROI.

Ready to get started? Contact us today to learn how our ${keyword} services can transform your business.`,

      blog: `# The Complete Guide to ${keyword}: Everything You Need to Know

## Introduction

${keyword} has become increasingly important in today's digital landscape. Whether you're a beginner looking to understand the basics or an experienced professional seeking advanced strategies, this comprehensive guide covers everything you need to know about ${keyword}.

## What is ${keyword}?

${keyword} refers to the practice of optimizing and improving various aspects of your digital presence to achieve better results. Understanding the fundamentals is crucial for anyone looking to succeed in this area.

## Getting Started with ${keyword}

### Step 1: Understanding the Basics
Before diving into advanced techniques, it's essential to grasp the fundamental concepts of ${keyword}. This includes understanding the core principles and how they apply to your specific situation.

### Step 2: Developing Your Strategy
Creating an effective ${keyword} strategy requires careful planning and consideration of your goals, target audience, and available resources.

### Step 3: Implementation and Optimization
Once you have a solid strategy in place, the next step is implementation. This involves putting your plan into action and continuously optimizing based on results.

## Advanced ${keyword} Techniques

For those ready to take their ${keyword} efforts to the next level, here are some advanced techniques that can significantly improve your results:

• **Data-Driven Approach**: Use analytics to make informed decisions
• **Automation Tools**: Leverage technology to streamline processes
• **Continuous Testing**: Implement A/B testing to optimize performance

## Common Mistakes to Avoid

Many people make these common mistakes when starting with ${keyword}:
1. Not setting clear goals
2. Ignoring data and analytics
3. Failing to stay updated with best practices

## Conclusion

${keyword} is a powerful tool that can drive significant results when implemented correctly. By following the strategies outlined in this guide, you'll be well on your way to achieving your goals.`,

      ecommerce: `# Premium ${keyword} - Transform Your Experience

## Product Overview

Discover the ultimate ${keyword} solution designed for discerning customers who demand excellence. Our premium ${keyword} combines innovative technology with superior craftsmanship to deliver an unparalleled experience.

## Key Features

### Advanced Technology
Our ${keyword} incorporates the latest technological advancements to ensure optimal performance and reliability. Every component has been carefully selected and tested to meet the highest standards.

### Superior Quality
Crafted from premium materials and built to last, this ${keyword} represents the perfect blend of form and function. You can trust in its durability and long-term performance.

### User-Friendly Design
Designed with the user in mind, our ${keyword} offers intuitive operation and seamless integration into your daily routine. The thoughtful design ensures maximum convenience and efficiency.

## Benefits

• **Enhanced Performance**: Experience superior results with our advanced ${keyword}
• **Durability**: Built to withstand regular use and maintain performance over time
• **Versatility**: Suitable for a wide range of applications and use cases
• **Value**: Exceptional quality at a competitive price point

## Technical Specifications

Our ${keyword} meets all industry standards and certifications, ensuring you receive a product that's both safe and effective. Detailed specifications are available upon request.

## Customer Reviews

"This ${keyword} has exceeded my expectations. The quality is outstanding and it performs exactly as advertised." - Verified Customer

"I've tried many different ${keyword} products, and this one is by far the best. Highly recommended!" - Verified Customer

## Guarantee

We stand behind our ${keyword} with a comprehensive warranty and satisfaction guarantee. Your investment is protected, and our customer service team is always available to assist you.

Order your ${keyword} today and experience the difference quality makes.`
    }
    
    return templates[type] || templates.blog
  }

  const generateEntities = (keyword) => {
    const baseEntities = [keyword]
    const additionalEntities = [
      "SEO optimization",
      "content marketing",
      "digital strategy",
      "online presence",
      "search rankings",
      "user experience",
      "conversion rate",
      "analytics"
    ]
    
    return [...baseEntities, ...additionalEntities.slice(0, 5)]
  }

  const generateHeadings = (keyword, type) => {
    const headings = {
      service: [
        `Professional ${keyword} Services`,
        `Our ${keyword} Approach`,
        `Key Benefits of Our ${keyword} Services`,
        `Why Choose Us for ${keyword}?`,
        "Get Started Today"
      ],
      blog: [
        `The Complete Guide to ${keyword}`,
        "Introduction",
        `What is ${keyword}?`,
        `Getting Started with ${keyword}`,
        `Advanced ${keyword} Techniques`,
        "Common Mistakes to Avoid",
        "Conclusion"
      ],
      ecommerce: [
        `Premium ${keyword}`,
        "Product Overview",
        "Key Features",
        "Benefits",
        "Technical Specifications",
        "Customer Reviews",
        "Guarantee"
      ]
    }
    
    return headings[type] || headings.blog
  }

  const generateFAQs = (keyword, type) => {
    const faqs = {
      service: [
        {
          question: `What makes your ${keyword} services different?`,
          answer: `Our ${keyword} services stand out due to our personalized approach, proven track record, and commitment to delivering measurable results for every client.`
        },
        {
          question: `How long does it take to see results from ${keyword}?`,
          answer: `Results timeline varies depending on your specific situation, but most clients begin seeing improvements within the first few weeks of implementation.`
        },
        {
          question: `Do you offer ongoing support for ${keyword}?`,
          answer: `Yes, we provide comprehensive ongoing support and monitoring to ensure your ${keyword} strategy continues to deliver optimal results.`
        }
      ],
      blog: [
        {
          question: `What is the best approach to ${keyword}?`,
          answer: `The best approach to ${keyword} involves understanding your goals, developing a comprehensive strategy, and implementing it consistently while monitoring and optimizing performance.`
        },
        {
          question: `How often should I review my ${keyword} strategy?`,
          answer: `We recommend reviewing your ${keyword} strategy quarterly to ensure it remains aligned with your goals and adapts to any changes in your industry or market conditions.`
        },
        {
          question: `What are the most common ${keyword} mistakes to avoid?`,
          answer: `Common mistakes include not setting clear goals, ignoring data and analytics, and failing to stay updated with best practices and industry changes.`
        }
      ],
      ecommerce: [
        {
          question: `What warranty comes with this ${keyword}?`,
          answer: `Our ${keyword} comes with a comprehensive warranty that covers manufacturing defects and ensures your satisfaction with the product.`
        },
        {
          question: `Is this ${keyword} suitable for beginners?`,
          answer: `Yes, our ${keyword} is designed to be user-friendly for beginners while offering advanced features for experienced users.`
        },
        {
          question: `What's included with my ${keyword} purchase?`,
          answer: `Your purchase includes the ${keyword}, comprehensive documentation, access to customer support, and any necessary accessories for immediate use.`
        }
      ]
    }
    
    return faqs[type] || faqs.blog
  }

  const handleExport = (format) => {
    if (!currentContent) return
    
    const filename = `${currentContent.keyword}-${currentContent.type}.${format}`
    const content = currentContent.content
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success(`Content exported as ${format.toUpperCase()}`)
  }

  const retryLoad = () => {
    loadInitialData()
  }

  if (loading && !showResults) {
    return <Loading />
  }

  if (error && !showResults) {
    return <Error message={error} onRetry={retryLoad} />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-4">
          AI-Powered Content Generator
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Generate SEO-optimized content with AI-driven SERP analysis and entity extraction
        </p>
      </div>

      {!showResults ? (
        <>
          <ContentGenerationForm
            onGenerate={handleGenerate}
            loading={loading}
          />

          {content.length === 0 ? (
            <Empty
              title="Ready to Generate Content?"
              description="Start by entering a keyword above to generate your first piece of SEO-optimized content."
              icon="Wand2"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {content.slice(0, 6).map((item) => (
                <div key={item.Id} className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="FileText" className="w-5 h-5 text-primary-400" />
                      <span className="text-sm text-gray-400 capitalize">{item.type}</span>
                    </div>
                    <div className="text-sm font-semibold text-emerald-400">
                      Score: {item.score}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {item.content.substring(0, 120)}...
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        setCurrentContent(item)
                        setShowResults(true)
                      }}
                      className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <SerpPreview 
              results={serpResults}
              loading={serpLoading}
            />
          </div>
          
          <div className="lg:col-span-2">
            <ContentEditor
              content={currentContent || {}}
              onExport={handleExport}
            />
          </div>
        </div>
      )}

      {showResults && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              setShowResults(false)
              setCurrentContent(null)
            }}
            className="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Generate New Content
          </button>
        </div>
      )}
    </div>
  )
}

export default ContentGenerator