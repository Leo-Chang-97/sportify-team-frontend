import { apiClient } from '@/api/axios' // 使用前台的 apiClient

export const teamService = {
  /**
   * 取得隊伍列表 (含分頁、排序)
   * 對應後端 GET /api/team/teams
   * @param {object} params - 查詢參數，例如 { page: 1, limit: 12, sortBy: 'newest' }
   * @returns {Promise<object>}
   */
  fetchAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const res = await apiClient.get(`/team/teams?${query}`)
    return res.data
  },

  /**
   * 取得單一隊伍詳細資料
   * 對應後端 GET /api/team/teams/:id
   * @param {number|string} id - 隊伍 ID
   * @returns {Promise<object>}
   */
  fetchById: async (id) => {
    const res = await apiClient.get(`/team/teams/${id}`)
    return res.data
  },

  /**
   * 建立新隊伍
   * 對應後端 POST /api/team/teams
   * @param {object} data - 建立隊伍所需的資料
   * @returns {Promise<object>}
   */
  create: async (data) => {
    // 注意：後端路由已改為 /api/team/teams
    const res = await apiClient.post('/team/teams', data) 
    return res.data
  },
}
