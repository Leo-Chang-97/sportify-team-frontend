import { apiClient } from '@/api/axios'

export const teamService = {
  /**
   * 取得隊伍列表 (含分頁、排序)
   * 對應後端 GET /api/team/teams
   */
  fetchAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const res = await apiClient.get(`/team/teams?${query}`)
    return res.data
  },

  /**
   * 取得單一隊伍詳細資料
   * 對應後端 GET /api/team/teams/:id
   */
  fetchById: async (id) => {
    const res = await apiClient.get(`/team/teams/${id}`)
    return res.data
  },

  /**
   * 建立新隊伍
   * 對應後端 POST /api/team/teams
   */
  create: async (data) => {
    const res = await apiClient.post('/team/teams', data)
    return res.data
  },

  // --- 請確認這一段 fetchMyTeams 函式存在 ---
  /**
   * 取得我加入的隊伍
   * 對應後端 GET /api/team/teams/ourteam
   */
  fetchMyTeams: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    // 將路徑從 /team/ourteam 改為 /team/teams/ourteam
    const res = await apiClient.get(`/team/teams/ourteam?${query}`)
    return res.data
  },
  // ------------------------------------------
}
