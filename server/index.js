const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}))

function loadTariffs() {
    const file = path.join(__dirname, 'data/tariffs.json')
    const raw = fs.readFileSync(file, 'utf-8')
    return JSON.parse(raw)
}

app.get('/api/tariffs', (req, res) => {
    const tariffs = loadTariffs()
    res.json(tariffs)
})

app.get('/api/tariffs/:id', (req, res) => {
    const tariffs = loadTariffs()
    const t = tariffs.find(x => x.id === req.params.id)
    if (!t) return res.status(404).json({ error: 'Tariff not found' })
    res.json(t)
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
