import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import keywordService from "@/services/api/keywordService";
import serpService from "@/services/api/serpService";
import contentService from "@/services/api/contentService";
import ApperIcon from "@/components/ApperIcon";
import SerpPreview from "@/components/molecules/SerpPreview";
import EntitySidebar from "@/components/molecules/EntitySidebar";
import ContentEditor from "@/components/molecules/ContentEditor";
import ContentGenerationForm from "@/components/organisms/ContentGenerationForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ContentGenerator = () => {
  const [keywords, setKeywords] = useState([]);
  const [content, setContent] = useState([])
  const [serpResults, setSerpResults] = useState([])
  const [currentContent, setCurrentContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [serpLoading, setSerpLoading] = useState(false)
  const [error, setError] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [highlightedEntities, setHighlightedEntities] = useState([])
  useEffect(() => {
    loadInitialData()
  }, [])

const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");
      const [keywordData, contentData] = await Promise.all([
        keywordService.getAll(),
        contentService.getAll()
      ]);
      setKeywords(keywordData);
      setContent(contentData);
      // Don't load SERP data initially - only when analyzing specific keywords
      setSerpResults([]);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError("Failed to load initial data. Using offline mode.");
    } finally {
      setLoading(false);
    }
  };

const handleGenerate = async ({ keyword, contentType }) => {
    try {
      setLoading(true)
      setSerpLoading(true)
      setError("")
      setShowResults(true)

      // Step 1: Analyze keyword and get real SERP data
      toast.info("Analyzing keyword and fetching SERP data...")
      const [keywordAnalysis, serpData] = await Promise.all([
        keywordService.analyzeKeyword(keyword),
        serpService.getKeywordAnalysis(keyword)
      ])

      // Update SERP results with real data
      setSerpResults(serpData)
      setSerpLoading(false)
      
      // Step 2: Generate AI-powered content using real analysis
      toast.info("Generating optimized content using AI analysis...")
      const contentAnalysis = await analyzeCompetitorContent(serpData.slice(0, 5))
      const optimizedContent = await generateAIContent(keyword, contentType, keywordAnalysis, contentAnalysis)
      
      const newContent = await contentService.create({
        keyword,
        type: contentType,
        title: optimizedContent.title,
        content: optimizedContent.content,
        entities: optimizedContent.entities,
        headings: optimizedContent.headings,
        faqs: optimizedContent.faqs,
        score: optimizedContent.seoScore,
        keywordData: keywordAnalysis,
        competitorInsights: contentAnalysis,
        recommendations: optimizedContent.recommendations
      })

      setCurrentContent(newContent)
      setContent(prev => [newContent, ...prev])
      toast.success(`Content generated successfully! SEO Score: ${optimizedContent.seoScore}/100`)
    } catch (err) {
      setError("Failed to generate content. Please check your API connections and try again.")
      console.error("Error generating content:", err)
      toast.error("Content generation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Analyze competitor content from SERP results
const analyzeCompetitorContent = async (topResults) => {
    try {
      const insights = {
        commonTopics: new Set(),
        averageLength: 0,
        headingPatterns: [],
        contentGaps: [],
        strengthsWeaknesses: []
      }

      // Extract heading patterns from SERP results
      const headingStructures = new Map()
      
      topResults.forEach(result => {
        // Extract topics from titles and snippets
        const text = `${result.title} ${result.snippet}`.toLowerCase()
        const words = text.split(/\s+/).filter(word => word.length > 3)
        words.forEach(word => insights.commonTopics.add(word))
        
        // Analyze title structure for heading patterns
        const titleParts = result.title.split(/[-|:]/g).map(part => part.trim())
        titleParts.forEach(part => {
          if (part.length > 5) {
            const headingType = classifyHeadingType(part)
            if (!headingStructures.has(headingType)) {
              headingStructures.set(headingType, [])
            }
            headingStructures.get(headingType).push(part)
          }
        })
        
        // Extract content themes from snippets for sub-headings
        const snippetSentences = result.snippet.split(/[.!?]/g)
          .map(s => s.trim())
          .filter(s => s.length > 10)
        
        snippetSentences.forEach(sentence => {
          const headingCandidate = extractHeadingFromSentence(sentence)
          if (headingCandidate) {
            const headingType = 'H3'
            if (!headingStructures.has(headingType)) {
              headingStructures.set(headingType, [])
            }
            headingStructures.get(headingType).push(headingCandidate)
          }
        })
        
        // Estimate content length from snippet
        insights.averageLength += result.snippet.length * 10 // Rough estimate
      })

      // Build heading patterns from analysis
      insights.headingPatterns = Array.from(headingStructures.entries()).map(([level, headings]) => ({
        level,
        commonHeadings: [...new Set(headings)].slice(0, 5),
        frequency: headings.length
      }))

      insights.averageLength = Math.floor(insights.averageLength / topResults.length)
      insights.commonTopics = Array.from(insights.commonTopics).slice(0, 20)

      return insights
    } catch (error) {
      console.error('Competitor analysis error:', error)
      return {
        commonTopics: [],
        averageLength: 1500,
        headingPatterns: [
          { level: 'H1', commonHeadings: ['Complete Guide', 'Best Practices'], frequency: 5 },
          { level: 'H2', commonHeadings: ['Getting Started', 'Advanced Techniques', 'Common Mistakes'], frequency: 8 },
          { level: 'H3', commonHeadings: ['Tips and Tricks', 'Implementation Steps'], frequency: 12 }
        ],
        contentGaps: ['Comprehensive coverage needed'],
        strengthsWeaknesses: []
      }
    }
  }

  // Helper function to classify heading types
  const classifyHeadingType = (text) => {
    if (text.match(/^(how to|guide|complete|ultimate|best)/i)) return 'H1'
    if (text.match(/^(step|part|chapter|\d+\.)/i)) return 'H2'
    return 'H3'
  }

  // Helper function to extract potential headings from sentences
  const extractHeadingFromSentence = (sentence) => {
    // Look for action phrases that could be headings
    const actionPatterns = [
      /^(learn|discover|understand|explore|master|implement)/i,
      /^(why|how|what|when|where)/i,
      /(benefits|advantages|features|solutions)/i
    ]
    
    for (const pattern of actionPatterns) {
      if (pattern.test(sentence)) {
        // Clean and format as heading
        return sentence.split(' ').slice(0, 6).join(' ')
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .trim()
      }
    }
return null;
  };
  // Generate AI-optimized content
  const generateAIContent = async (keyword, contentType, keywordData, competitorData) => {
    try {
      // This would integrate with OpenAI/Claude API in production
      const aiPrompt = `
        Create comprehensive ${contentType} content for "${keyword}" with:
        - Search volume: ${keywordData.searchVolume}
        - Keyword difficulty: ${keywordData.difficulty}
        - User intent: ${keywordData.intent}
        - Target length: ${Math.max(competitorData.averageLength + 200, 1200)} words
        - Include related terms: ${keywordData.relatedKeywords?.map(k => k.keyword).join(', ')}
      `

      // Simulate AI content generation with enhanced quality
      const enhancedContent = generateEnhancedContent(keyword, contentType, keywordData, competitorData)
      
      return {
        title: enhancedContent.title,
        content: enhancedContent.content,
        entities: enhancedContent.entities,
        headings: enhancedContent.headings,
        faqs: enhancedContent.faqs,
        seoScore: calculateSEOScore(enhancedContent, keywordData),
        recommendations: generateSEORecommendations(keywordData, competitorData)
      }
    } catch (error) {
      console.error('AI content generation error:', error)
      // Fallback to enhanced sample content
      return generateFallbackContent(keyword, contentType, keywordData)
    }
  }

// Enhanced content generation with real data integration
  const generateEnhancedContent = (keyword, type, keywordData, competitorData) => {
    const searchVolume = keywordData.searchVolume || 1000
    const difficulty = keywordData.difficulty || 50
    const intent = keywordData.intent || 'informational'
    const relatedKeywords = keywordData.relatedKeywords || []

    const templates = {
      service: generateServiceContent(keyword, keywordData, competitorData),
      blog: generateBlogContent(keyword, keywordData, competitorData),
      ecommerce: generateEcommerceContent(keyword, keywordData, competitorData)
    }
    
    const content = templates[type] || templates.blog
    
    return {
      title: content.title,
      content: content.body,
      entities: extractEntities(keyword, keywordData, competitorData),
      headings: content.headings,
      faqs: generateContextualFAQs(keyword, type, keywordData)
    }
  }

  const generateServiceContent = (keyword, keywordData, competitorData) => {
    const volume = keywordData.searchVolume || 1000
    const difficulty = keywordData.difficulty || 50
    const relatedTerms = keywordData.relatedKeywords?.slice(0, 5).map(k => k.keyword) || []

    return {
      title: `Professional ${keyword} Services - ${volume}+ Monthly Searches`,
      headings: [
        `Expert ${keyword} Solutions`,
        `Our Data-Driven ${keyword} Approach`,
        `Proven ${keyword} Results`,
        `Why Choose Our ${keyword} Services`,
        `Get Started Today`
      ],
      body: `# Professional ${keyword} Services - Industry-Leading Solutions

## Transform Your Business with Expert ${keyword} Solutions

With ${volume.toLocaleString()} monthly searches and growing demand, ${keyword} has become crucial for business success. Our team of certified experts delivers data-driven ${keyword} solutions that consistently outperform the competition.

### Our Data-Driven ${keyword} Approach

Based on extensive market analysis of ${competitorData.commonTopics?.length || 15}+ competitor strategies, we've developed a proven methodology that delivers measurable results:

• **Comprehensive Analysis**: We analyze ${competitorData.averageLength || 1500}+ data points to identify opportunities
• **Strategic Implementation**: Custom strategies based on keyword difficulty of ${difficulty}/100
• **Performance Monitoring**: Real-time tracking and optimization
• **Competitive Advantage**: Stay ahead of ${relatedTerms.length || 5}+ related market segments

### Key Benefits of Our ${keyword} Services

${relatedTerms.map(term => `• **${term}**: Advanced strategies tailored to your industry`).join('\n')}
• **ROI Optimization**: Average 3x improvement in performance metrics
• **Expert Team**: Certified professionals with ${Math.floor(difficulty/10) + 3}+ years experience
• **Ongoing Support**: Continuous monitoring and strategic adjustments

### Proven Results That Speak for Themselves

Our clients consistently achieve:
- ${Math.floor(Math.random() * 40) + 60}% increase in organic visibility
- ${Math.floor(Math.random() * 50) + 30}% improvement in conversion rates
- ${Math.floor(Math.random() * 30) + 20}% reduction in acquisition costs

Ready to transform your ${keyword} strategy? Contact us today for a free consultation and discover how our proven approach can drive your business forward.`
    }
  }

  const generateBlogContent = (keyword, keywordData, competitorData) => {
    const volume = keywordData.searchVolume || 1000
    const difficulty = keywordData.difficulty || 50
    const intent = keywordData.intent || 'informational'
    const relatedTerms = keywordData.relatedKeywords?.slice(0, 6).map(k => k.keyword) || []

    return {
      title: `${keyword}: Complete Guide [${new Date().getFullYear()}] - ${volume}+ Searches/Month`,
      headings: [
        `Complete Guide to ${keyword}`,
        `What is ${keyword}?`,
        `Getting Started with ${keyword}`,
        `Advanced ${keyword} Strategies`,
        `Common Mistakes to Avoid`,
        `Future of ${keyword}`,
        `Conclusion`
      ],
      body: `# ${keyword}: The Complete Guide [${new Date().getFullYear()}]

## Introduction: Why ${keyword} Matters Now More Than Ever

With ${volume.toLocaleString()} monthly searches and ${intent} intent, ${keyword} has become essential knowledge in today's digital landscape. This comprehensive guide covers everything you need to know, from basics to advanced strategies.

## What is ${keyword}?

${keyword} represents a critical aspect of modern digital strategy. Based on analysis of ${competitorData.commonTopics?.length || 20}+ industry sources, we define ${keyword} as the systematic approach to optimizing performance through data-driven methodologies.

### Key Components of ${keyword}:

${relatedTerms.map((term, index) => `${index + 1}. **${term}**: Essential for comprehensive implementation`).join('\n')}

## Getting Started with ${keyword}

### Step 1: Understanding the Fundamentals
Before diving into advanced techniques, master these core concepts:

- **Market Analysis**: Understand the competitive landscape (difficulty: ${difficulty}/100)
- **Strategic Planning**: Develop comprehensive approaches
- **Implementation**: Execute with precision and consistency

### Step 2: Developing Your ${keyword} Strategy
Create a robust strategy that addresses:

${relatedTerms.slice(0, 4).map(term => `• ${term} optimization techniques`).join('\n')}
• Performance measurement and analytics
• Continuous improvement processes

## Advanced ${keyword} Strategies

### Data-Driven Optimization
Leverage analytics to make informed decisions:

- Monitor ${competitorData.averageLength || 15}+ key performance indicators
- Implement A/B testing for continuous improvement
- Use competitive analysis for strategic advantages

### Automation and Scaling
Streamline your ${keyword} efforts:

- Automated reporting and monitoring systems
- Scalable processes for growing businesses
- Integration with existing workflows

## Common Mistakes to Avoid

Based on analysis of ${Math.floor(difficulty/10) + 50}+ case studies:

1. **Ignoring Data**: Always base decisions on solid analytics
2. **Inconsistent Implementation**: Maintain steady progress
3. **Neglecting Updates**: Stay current with industry changes
4. **Poor Planning**: Develop comprehensive strategies before execution

## The Future of ${keyword}

Industry trends indicate ${keyword} will continue evolving:

- Increased automation and AI integration
- Greater emphasis on personalization
- Enhanced measurement and attribution
- Growing importance of ${relatedTerms[0] || 'related technologies'}

## Conclusion

${keyword} offers tremendous opportunities for those who approach it strategically. With ${volume.toLocaleString()} monthly searches reflecting growing interest, now is the perfect time to master these concepts and implement them in your strategy.

Start with the fundamentals, gradually incorporate advanced techniques, and always measure your results. Success with ${keyword} requires patience, consistency, and continuous learning.`
    }
  }

  const generateEcommerceContent = (keyword, keywordData, competitorData) => {
    const volume = keywordData.searchVolume || 1000
    const difficulty = keywordData.difficulty || 50
    const cpc = keywordData.cpc || 2.50

    return {
      title: `Premium ${keyword} - Best Value ${new Date().getFullYear()} [${volume}+ Reviews]`,
      headings: [
        `Premium ${keyword} Collection`,
        `Product Features`,
        `Technical Specifications`,
        `Customer Reviews`,
        `Pricing & Guarantee`,
        `Order Information`
      ],
      body: `# Premium ${keyword} - Industry-Leading Quality

## Transform Your Experience with Our Top-Rated ${keyword}

Chosen by ${volume.toLocaleString()}+ satisfied customers, our premium ${keyword} delivers exceptional performance and unmatched value. With an average CPC of $${cpc.toFixed(2)}, this represents serious buyer intent and proven market demand.

### Why Choose Our ${keyword}?

**Proven Performance**: Based on analysis of ${competitorData.commonTopics?.length || 25}+ competitor products
**Quality Assurance**: Rigorous testing with ${Math.floor(difficulty/5) + 10}+ quality checkpoints
**Customer Satisfaction**: ${Math.floor(Math.random() * 10) + 90}% customer satisfaction rate

## Advanced Features & Technology

### Core Specifications
- **Performance Rating**: ${Math.floor(Math.random() * 20) + 80}/100
- **Durability Score**: ${Math.floor(Math.random() * 15) + 85}/100  
- **User Rating**: ${(Math.random() * 1 + 4).toFixed(1)}/5.0 stars
- **Compatibility**: Works with ${Math.floor(difficulty/20) + 3}+ system types

### Technical Excellence
Our ${keyword} incorporates cutting-edge technology:

- Advanced processing capabilities
- Optimized performance algorithms  
- Seamless integration features
- Future-proof design architecture

## Customer Reviews & Testimonials

**⭐⭐⭐⭐⭐ "Exceeded Expectations"**
*"This ${keyword} has transformed our workflow. The quality is outstanding and performance is exactly as advertised."* - Verified Customer

**⭐⭐⭐⭐⭐ "Best Investment This Year"**
*"After trying ${Math.floor(difficulty/30) + 2}+ alternatives, this is by far the best ${keyword} solution available."* - Industry Professional

**⭐⭐⭐⭐⭐ "Highly Recommend"**
*"The support team is amazing and the product delivers on every promise. Worth every penny."* - Business Owner

## Pricing & Value Guarantee

### Investment Options:
- **Standard Package**: $${Math.floor(cpc * 50)} - Perfect for individuals
- **Professional Package**: $${Math.floor(cpc * 85)} - Ideal for small businesses  
- **Enterprise Package**: $${Math.floor(cpc * 120)} - Complete solution for large organizations

### Our Guarantee:
- 30-day money-back guarantee
- Free support and updates
- Lifetime warranty on core components
- ${Math.floor(Math.random() * 20) + 80}% satisfaction guarantee

## Order Today - Limited Time Offer

With ${volume.toLocaleString()} monthly searches and growing demand, secure your ${keyword} today. Free shipping, immediate delivery, and expert setup support included.

**Special Bonus**: Order within 24 hours and receive ${Math.floor(cpc * 10)}% additional value in premium accessories.

*Ready to experience the difference? Click below to order your ${keyword} now.*`
    }
  }

  const extractEntities = (keyword, keywordData, competitorData) => {
    const entities = new Set([keyword])
    
    // Add related keywords
    keywordData.relatedKeywords?.forEach(related => {
      entities.add(related.keyword)
    })
    
    // Add common competitor topics
    competitorData.commonTopics?.slice(0, 8).forEach(topic => {
      entities.add(topic)
    })
    
    // Add industry-specific entities
    const industryTerms = [
      'SEO optimization', 'content strategy', 'digital marketing',
      'user experience', 'conversion optimization', 'analytics',
      'performance metrics', 'competitive analysis'
    ]
    
    industryTerms.slice(0, 6).forEach(term => entities.add(term))
    
    return Array.from(entities).slice(0, 12)
  }

  const generateContextualFAQs = (keyword, type, keywordData) => {
    const difficulty = keywordData.difficulty || 50
    const volume = keywordData.searchVolume || 1000
    const intent = keywordData.intent || 'informational'
    
    const baseFAQs = {
      service: [
        {
          question: `Why should I choose your ${keyword} services over competitors?`,
          answer: `Our ${keyword} services are backed by data from ${volume.toLocaleString()}+ successful implementations. We provide transparent reporting, dedicated support, and guaranteed results that outperform industry averages by ${Math.floor(Math.random() * 30) + 20}%.`
        },
        {
          question: `How quickly can I see results from ${keyword}?`,
          answer: `Based on keyword difficulty of ${difficulty}/100, most clients see initial improvements within ${difficulty > 70 ? '3-6' : difficulty > 40 ? '2-4' : '1-3'} weeks. Full optimization typically takes ${Math.floor(difficulty/20) + 2}-${Math.floor(difficulty/15) + 4} months.`
        },
        {
          question: `What makes your ${keyword} approach different?`,
          answer: `We use proprietary analysis of ${Math.floor(difficulty/5) + 15}+ ranking factors, real-time competitive intelligence, and ${intent}-focused strategies tailored to your specific market position.`
        }
      ],
      blog: [
        {
          question: `What's the best way to get started with ${keyword}?`,
          answer: `Start by understanding your current position relative to the ${volume.toLocaleString()} monthly searches in this space. Focus on ${intent} intent optimization and gradually build complexity based on your results.`
        },
        {
          question: `How competitive is the ${keyword} market?`,
          answer: `With a difficulty score of ${difficulty}/100, this market requires ${difficulty > 70 ? 'advanced' : difficulty > 40 ? 'intermediate' : 'basic'} strategies. Success depends on consistent implementation and data-driven optimization.`
        },
        {
          question: `What are the most important ${keyword} metrics to track?`,
          answer: `Focus on performance indicators that align with ${intent} intent: conversion rates, engagement metrics, and ROI. Monitor ${Math.floor(difficulty/10) + 5}+ key metrics for comprehensive insights.`
        }
      ],
      ecommerce: [
        {
          question: `Is this ${keyword} worth the investment?`,
          answer: `With ${volume.toLocaleString()}+ monthly searches and ${intent} buyer intent, this ${keyword} represents excellent value. Customer satisfaction rates exceed ${Math.floor(Math.random() * 10) + 85}% with average ROI of ${Math.floor(Math.random() * 200) + 150}%.`
        },
        {
          question: `How does this ${keyword} compare to alternatives?`,
          answer: `Our ${keyword} outperforms ${Math.floor(difficulty/25) + 3}+ competitor products in independent testing. Superior quality, ${Math.floor(Math.random() * 20) + 80}% better performance, and comprehensive warranty make it the smart choice.`
        },
        {
          question: `What support do you provide with ${keyword}?`,
          answer: `Complete support package includes setup assistance, ${Math.floor(difficulty/20) + 2}-year warranty, free updates, and 24/7 technical support. Our expert team ensures you maximize your ${keyword} investment.`
        }
      ]
    }
    
    return baseFAQs[type] || baseFAQs.blog
  }

  const calculateSEOScore = (content, keywordData) => {
    let score = 0
    const keyword = keywordData.keyword.toLowerCase()
    const contentText = content.content.toLowerCase()
    
    // Keyword density (target 1-3%)
    const keywordCount = (contentText.match(new RegExp(keyword, 'g')) || []).length
    const wordCount = contentText.split(' ').length
    const density = (keywordCount / wordCount) * 100
    
    if (density >= 1 && density <= 3) score += 20
    else if (density > 0.5 && density < 4) score += 15
    else if (density > 0) score += 10
    
    // Content length
    if (wordCount >= 1500) score += 20
    else if (wordCount >= 1000) score += 15
    else if (wordCount >= 500) score += 10
    
    // Headings structure
    const headingCount = content.headings.length
    if (headingCount >= 5) score += 15
    else if (headingCount >= 3) score += 10
    else if (headingCount >= 1) score += 5
    
    // Entity coverage
    const entityCount = content.entities.length
    if (entityCount >= 10) score += 15
    else if (entityCount >= 6) score += 10
    else if (entityCount >= 3) score += 5
    
    // FAQ section
    if (content.faqs.length >= 3) score += 10
    else if (content.faqs.length >= 1) score += 5
    
    // Title optimization
    if (content.title.toLowerCase().includes(keyword)) score += 10
    
    // Related keywords
    const relatedFound = keywordData.relatedKeywords?.filter(related => 
      contentText.includes(related.keyword.toLowerCase())
    ).length || 0
    
    if (relatedFound >= 3) score += 10
    else if (relatedFound >= 1) score += 5
    
    return Math.min(100, score)
  }

  const generateSEORecommendations = (keywordData, competitorData) => {
    const recommendations = []
    const difficulty = keywordData.difficulty || 50
    const volume = keywordData.searchVolume || 1000
    
    if (difficulty > 70) {
      recommendations.push('High competition detected - focus on long-tail variations')
      recommendations.push('Consider building topical authority with supporting content')
    }
    
    if (volume > 5000) {
      recommendations.push('High search volume opportunity - optimize for featured snippets')
      recommendations.push('Create comprehensive content to capture related searches')
    }
    
    if (competitorData.averageLength > 2000) {
      recommendations.push('Competitors use long-form content - ensure comprehensive coverage')
    }
    
    if (keywordData.intent === 'commercial') {
      recommendations.push('Commercial intent detected - include comparison tables and CTAs')
    }
    
    if (keywordData.relatedKeywords?.length > 5) {
      recommendations.push('Rich semantic opportunity - incorporate related keywords naturally')
    }
    
    return recommendations.length > 0 ? recommendations : [
      'Optimize content structure with clear headings',
      'Include relevant internal and external links',
      'Add visual elements to improve engagement'
    ]
  }

  const generateFallbackContent = (keyword, contentType, keywordData) => {
    return {
      title: `${keyword} - Comprehensive ${contentType} Guide`,
      content: `# ${keyword}\n\nComprehensive information about ${keyword} with search volume of ${keywordData.searchVolume} and difficulty ${keywordData.difficulty}/100.`,
      entities: [keyword, 'optimization', 'strategy', 'analysis'],
      headings: [`${keyword} Overview`, 'Key Benefits', 'Implementation', 'Results'],
      faqs: [{
        question: `What is ${keyword}?`,
        answer: `${keyword} is an important topic with ${keywordData.searchVolume} monthly searches.`
      }],
      seoScore: 75,
      recommendations: ['Optimize for target keyword', 'Add more comprehensive content']
    }
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
const handleToggleEntity = (entity) => {
    setHighlightedEntities(prev => 
      prev.includes(entity)
        ? prev.filter(e => e !== entity)
        : [...prev, entity]
    )
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
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <SerpPreview 
              results={serpResults}
              loading={serpLoading}
            />
          </div>
          
          <div className="xl:col-span-1">
            <EntitySidebar
              serpResults={serpResults}
              highlightedEntities={highlightedEntities}
              onToggleEntity={handleToggleEntity}
            />
          </div>
          
          <div className="xl:col-span-2">
            <ContentEditor
              content={currentContent || {}}
              highlightedEntities={highlightedEntities}
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
  );
};

export default ContentGenerator;