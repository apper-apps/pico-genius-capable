const serpService = {
  apiConfig: {
    serpapi: {
      apiKey: import.meta.env.VITE_SERPAPI_KEY || null,
      baseUrl: 'https://serpapi.com/search.json'
    },
    dataforseo: {
      login: import.meta.env.VITE_DATAFORSEO_LOGIN || null,
      password: import.meta.env.VITE_DATAFORSEO_PASSWORD || null,
      baseUrl: 'https://api.dataforseo.com/v3'
    }
  },

  // Main method to get keyword analysis with SERP results
  async getKeywordAnalysis(keyword) {
    try {
      if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
        throw new Error('Invalid keyword provided')
      }

      const cleanKeyword = keyword.trim()
      
      // Try multiple API providers in order of preference
      const results = await this.fetchSerpResults(cleanKeyword)
      
      if (!results || results.length === 0) {
        console.warn('No SERP results found, using fallback data')
        return this.generateFallbackResults(cleanKeyword)
      }

      return results
    } catch (error) {
      console.error('SERP Analysis Error:', error)
      
      // Format the error message properly before throwing
      const errorMessage = this.formatErrorMessage(error)
      
      // Create a new error with the formatted message
      const formattedError = new Error(errorMessage)
      formattedError.originalError = error
      formattedError.isApiError = true
      
      throw formattedError
    }
  },

  async fetchSerpResults(keyword) {
    const errors = []
    
    // Try SerpAPI first
    if (this.apiConfig.serpapi.apiKey) {
      try {
        const results = await this.fetchFromSerpAPI(keyword)
        if (results && results.length > 0) return results
      } catch (error) {
        errors.push(`SerpAPI: ${this.formatErrorMessage(error)}`)
      }
    } else {
      errors.push('SerpAPI: No API key configured')
    }

    // Try DataForSEO as fallback
    if (this.apiConfig.dataforseo.login && this.apiConfig.dataforseo.password) {
      try {
        const results = await this.fetchFromDataForSEO(keyword)
        if (results && results.length > 0) return results
      } catch (error) {
        errors.push(`DataForSEO: ${this.formatErrorMessage(error)}`)
      }
    } else {
      errors.push('DataForSEO: No credentials configured')
    }

    // If all APIs failed, throw with detailed error message
    const combinedErrorMsg = `SERP API services unavailable: ${errors.join('; ')}`
    const combinedError = new Error(combinedErrorMsg)
    combinedError.details = errors
    combinedError.isApiError = true
    throw combinedError
  },

  async fetchFromSerpAPI(keyword) {
    try {
      const params = new URLSearchParams({
        q: keyword,
        engine: 'google',
        api_key: this.apiConfig.serpapi.apiKey,
        num: 10,
        gl: 'us',
        hl: 'en'
      })

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${this.apiConfig.serpapi.baseUrl}?${params}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SEO-Genius/1.0'
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await this.safeParseJSON(response)
        throw new Error(`SerpAPI HTTP ${response.status}: ${errorData?.error || response.statusText}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(`SerpAPI Error: ${data.error}`)
      }

      return this.formatSerpResults(data.organic_results || [], 'serpapi')
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('SerpAPI request timed out after 10 seconds')
      }
      throw error
    }
  },

  async fetchFromDataForSEO(keyword) {
    try {
      const auth = btoa(`${this.apiConfig.dataforseo.login}:${this.apiConfig.dataforseo.password}`)
      
      const payload = [{
        language_code: 'en',
        location_code: 2840, // United States
        keyword: keyword,
        device: 'desktop',
        os: 'windows'
      }]

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`${this.apiConfig.dataforseo.baseUrl}/serp/google/organic/live/advanced`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await this.safeParseJSON(response)
        throw new Error(`DataForSEO HTTP ${response.status}: ${errorData?.status_message || response.statusText}`)
      }

      const data = await response.json()
      
      if (data.status_code !== 20000) {
        throw new Error(`DataForSEO API Error: ${data.status_message || 'Unknown error'}`)
      }

      const results = data.tasks?.[0]?.result?.[0]?.items || []
      return this.formatSerpResults(results, 'dataforseo')
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('DataForSEO request timed out after 10 seconds')
      }
      throw error
    }
  },

  async safeParseJSON(response) {
    try {
      return await response.json()
    } catch (error) {
      console.warn('Failed to parse error response as JSON:', error)
      return { error: 'Invalid JSON response from API' }
    }
  },

  formatSerpResults(results, provider) {
    if (!Array.isArray(results)) {
      console.warn('Invalid results format from', provider)
      return []
    }

    return results.slice(0, 10).map((result, index) => {
      let title, url, snippet, displayUrl

      if (provider === 'serpapi') {
        title = result.title || 'No title'
        url = result.link || '#'
        snippet = result.snippet || 'No description available'
        displayUrl = result.displayed_link || url
      } else if (provider === 'dataforseo') {
        title = result.title || 'No title'
        url = result.url || '#'
        snippet = result.description || 'No description available'
        displayUrl = result.breadcrumb || url
      }

      return {
        position: index + 1,
        title: this.cleanText(title),
        url: url,
        displayUrl: this.cleanText(displayUrl),
        snippet: this.cleanText(snippet),
        provider: provider
      }
    })
  },

  cleanText(text) {
    if (!text || typeof text !== 'string') return ''
    return text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()
  },

  generateFallbackResults(keyword) {
    const fallbackData = [
      {
        position: 1,
        title: `Complete Guide to ${keyword} - Expert Tips & Strategies`,
        url: 'https://example.com/guide',
        displayUrl: 'example.com',
        snippet: `Comprehensive guide covering everything about ${keyword}. Learn best practices, expert strategies, and proven techniques for success.`,
        provider: 'offline'
      },
      {
        position: 2,
        title: `${keyword}: Best Practices for 2024`,
        url: 'https://industry-leader.com/best-practices',
        displayUrl: 'industry-leader.com',
        snippet: `Discover the latest best practices for ${keyword} in 2024. Updated strategies and proven methodologies for optimal results.`,
        provider: 'offline'
      },
      {
        position: 3,
        title: `Top 10 ${keyword} Tools and Resources`,
        url: 'https://tools-review.com/top-tools',
        displayUrl: 'tools-review.com',
        snippet: `Comprehensive review of the best ${keyword} tools available. Compare features, pricing, and performance to find the perfect solution.`,
        provider: 'offline'
      },
      {
        position: 4,
        title: `${keyword} for Beginners: Step-by-Step Tutorial`,
        url: 'https://learn-hub.com/tutorial',
        displayUrl: 'learn-hub.com',
        snippet: `Easy-to-follow tutorial for ${keyword} beginners. Step-by-step instructions with practical examples and real-world applications.`,
        provider: 'offline'
      },
      {
        position: 5,
        title: `Advanced ${keyword} Techniques for Professionals`,
        url: 'https://pro-academy.com/advanced',
        displayUrl: 'pro-academy.com',
        snippet: `Master advanced ${keyword} techniques used by industry professionals. In-depth strategies for experienced practitioners.`,
        provider: 'offline'
      }
    ]

    return fallbackData
  },

  formatErrorMessage(error) {
    // Handle null/undefined
    if (!error) return 'Unknown error occurred'
    
    // Handle string errors
    if (typeof error === 'string') {
      return error
    }
    
    // Handle Error instances
    if (error instanceof Error) {
      // Special handling for common error types
      if (error.name === 'AbortError') {
        return 'Request timed out after 10 seconds'
      }
      
      if (error.name === 'TypeError' && error.message?.includes('fetch')) {
        return 'Network connection failed - please check your internet connection'
      }
      
      return error.message || 'Network request failed'
    }
    
    // Handle object errors (this is where the [object Object] issue occurs)
    if (typeof error === 'object') {
      // Try standard error properties first
      if (error.message && typeof error.message === 'string') {
        return error.message
      }
      
      if (error.error && typeof error.error === 'string') {
        return error.error
      }
      
      if (error.status_message && typeof error.status_message === 'string') {
        return error.status_message
      }
      
      // Build error message from available properties
      const errorParts = []
      if (error.status) errorParts.push(`Status: ${error.status}`)
      if (error.code) errorParts.push(`Code: ${error.code}`)
      if (error.type) errorParts.push(`Type: ${error.type}`)
      if (error.name) errorParts.push(`Name: ${error.name}`)
      
      if (errorParts.length > 0) {
        return `API Error - ${errorParts.join(', ')}`
      }
      
      // Try to safely stringify the object
      try {
        const jsonStr = JSON.stringify(error)
        if (jsonStr && jsonStr !== '{}' && jsonStr !== 'null' && jsonStr !== 'undefined') {
          // Truncate very long error messages
          const maxLength = 200
          if (jsonStr.length > maxLength) {
            return `API Error: ${jsonStr.substring(0, maxLength)}...`
          }
          return `API Error: ${jsonStr}`
        }
      } catch (jsonError) {
        console.warn('Failed to stringify error object:', jsonError)
      }
      
      // Fallback for objects that can't be meaningfully stringified
      return 'SERP API returned an unspecified error'
    }
    
    // Final fallback
    return 'SERP API service temporarily unavailable'
  }
}

export default serpService