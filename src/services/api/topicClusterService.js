import topicClusterData from "@/services/mockData/topicClusters.json"

const topicClusterService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 350))
    return [...topicClusterData]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const cluster = topicClusterData.find(item => item.Id === parseInt(id))
    if (!cluster) {
      throw new Error("Topic cluster not found")
    }
    return { ...cluster }
  },

  async create(clusterItem) {
    await new Promise(resolve => setTimeout(resolve, 450))
    const maxId = Math.max(...topicClusterData.map(item => item.Id), 0)
    const newCluster = {
      Id: maxId + 1,
      ...clusterItem
    }
    topicClusterData.push(newCluster)
    return { ...newCluster }
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = topicClusterData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Topic cluster not found")
    }
    topicClusterData[index] = { ...topicClusterData[index], ...updates }
    return { ...topicClusterData[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = topicClusterData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Topic cluster not found")
    }
    const deleted = topicClusterData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default topicClusterService