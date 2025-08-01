import serpData from "@/services/mockData/serpResults.json"

const serpService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [...serpData]
  },

  async getByPosition(position) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const result = serpData.find(item => item.position === parseInt(position))
    if (!result) {
      throw new Error("SERP result not found")
    }
    return { ...result }
  },

  async create(serpResult) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const maxPosition = Math.max(...serpData.map(item => item.position), 0)
    const newResult = {
      position: maxPosition + 1,
      ...serpResult
    }
    serpData.push(newResult)
    return { ...newResult }
  },

  async update(position, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = serpData.findIndex(item => item.position === parseInt(position))
    if (index === -1) {
      throw new Error("SERP result not found")
    }
    serpData[index] = { ...serpData[index], ...updates }
    return { ...serpData[index] }
  },

  async delete(position) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = serpData.findIndex(item => item.position === parseInt(position))
    if (index === -1) {
      throw new Error("SERP result not found")
    }
    const deleted = serpData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default serpService