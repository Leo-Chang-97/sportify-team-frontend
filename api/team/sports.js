// 處理 GET /api/team/sports 請求
import express from 'express'
import { getSports } from '../../services/team/index.js'

const router = express.Router()

router.get('/', async (_req, res) => {
  try {
    const rows = await getSports()
    res.json({ rows })
  } catch (err) {
    console.error('GET /api/team/sports 發生錯誤:', err)
    res.status(500).json({ error: '載入運動類別失敗' })
  }
})

export default router
