// 處理 GET /api/team/levels 請求
import express from 'express'
import { getLevels } from '../../services/team/index.js'

const router = express.Router()

router.get('/', async (_req, res) => {
  try {
    const rows = await getLevels()
    res.json({ rows })
  } catch (err) {
    console.error('GET /api/team/levels 發生錯誤:', err)
    res.status(500).json({ error: '載入階級程度失敗' })
  }
})

export default router
