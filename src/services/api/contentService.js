import contentData from "@/services/mockData/content.json"

const contentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 350))
    return [...contentData]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const content = contentData.find(item => item.Id === parseInt(id))
    if (!content) {
      throw new Error("Content not found")
    }
    return { ...content }
  },

  async create(contentItem) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const maxId = Math.max(...contentData.map(item => item.Id), 0)
    const newContent = {
      Id: maxId + 1,
      ...contentItem,
      createdAt: new Date().toISOString()
    }
    contentData.push(newContent)
    return { ...newContent }
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = contentData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Content not found")
    }
    contentData[index] = { ...contentData[index], ...updates }
    return { ...contentData[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = contentData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Content not found")
    }
    const deleted = contentData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default contentService