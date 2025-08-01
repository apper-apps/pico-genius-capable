import keywordData from "@/services/mockData/keywords.json"

const keywordService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...keywordData]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const keyword = keywordData.find(item => item.Id === parseInt(id))
    if (!keyword) {
      throw new Error("Keyword not found")
    }
    return { ...keyword }
  },

  async create(keywordItem) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const maxId = Math.max(...keywordData.map(item => item.Id), 0)
    const newKeyword = {
      Id: maxId + 1,
      ...keywordItem,
      timestamp: new Date().toISOString()
    }
    keywordData.push(newKeyword)
    return { ...newKeyword }
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = keywordData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Keyword not found")
    }
    keywordData[index] = { ...keywordData[index], ...updates }
    return { ...keywordData[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = keywordData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Keyword not found")
    }
    const deleted = keywordData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default keywordService