// ... 您原有的 fetchMemberOptions, fetchStatusOptions 等函式
import { apiClient } from '@/api/axios'
/**
 * 取得運動選項
 * 對應後端 GET /api/team/sports
 */
export const fetchTeamSportOptions = async () => {
  const res = await apiClient.get('/team/sports')
  return res.data
}

/**
 * 取得等級選項
 * 對應後端 GET /api/team/levels
 */
export const fetchTeamLevelOptions = async () => {
  const res = await apiClient.get('/team/levels')
  return res.data
}

/**
 * 根據運動 ID 取得場館選項
 * 對應後端 GET /api/team/centers
 * @param {object} params - 查詢參數，例如 { sportId: 1 }
 */
export const fetchTeamCenterOptions = async (params = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    )
  ).toString()
  // 根據您的 centers.js，路徑是 /team/centers
  const url = query ? `/team/centers?${query}` : '/team/centers'
  const res = await apiClient.get(url)
  return res.data
}
