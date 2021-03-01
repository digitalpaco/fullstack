const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddlewar')
app.use(cors())
app.use(express.json())
app.use(logger)
let notes = [
  {
    id: 1,
    content: 'Me tengo que subcribir a ...',
    date: '2021-03-01T17:30:31:0982',
    important: true
  },
  {
    id: 2,
    content: 'Me tengo que estudiar ...',
    date: '2021-03-01T17:30:31:09823',
    important: false
  },
  {
    id: 3,
    content: 'Me tengo que escribir a ...',
    date: '2021-03-01T17:30:31:0985',
    important: true
  }
]
app.get('/', (request, response) => {
  response.send('<a href="/api/notes">note</a>')
})
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) response.json(note)
  response.status(404).end()
})
app.post('/api/notes', (request, response) => {
  const note = request.body
  if (!note || !note.content) {
    return response.status(400).json({
      error: 'content is missing'
    })
  }
  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)
  const newNote = {
    id: maxId + 1,
    content: note.content,
    date: new Date().toISOString(),
    important: typeof note.important !== 'undefined' ? note.important : false
  }
  notes = [...notes, newNote]
  response.status(201).json(newNote)
})
app.delete('/api/notes/:id', (resquest, response) => {
  const id = Number(resquest.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})
app.use((request, response) => {
  response.status(404).json({
    error: 'not fount'
  })
})
const PORT = 3001

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
