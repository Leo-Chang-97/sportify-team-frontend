// 處理 GET /api/team/courts 請求
import express from 'express'
import { getCourts } from '../../services/team/index.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const sportId = req.query.sportId ? parseInt(req.query.sportId, 10) : null
    const rows = await getCourts(sportId)
    res.json({ rows })
  } catch (err) {
    console.error('GET /api/team/courts 發生錯誤:', err)
    res.status(500).json({ error: '載入場地列表失敗' })
  }
})

export default router
