// 處理 POST /api/team 請求 (建立隊伍)
import express from 'express'
import { createTeam } from '../../services/team/index.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const result = await createTeam(req.body || {})
  res.status(result.code || 201).json(result)
})

export default router
