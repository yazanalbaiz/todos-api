const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config')
const tasks = require('./tasks')

const app = express()

app.use(express.static('public'))
app.use(cors())

app.get('/', (req, res) => {
  const help = `
  <pre>
    Welcome to the ToDos API!

    Use an Authorization header to work with your own data:

    fetch(url, { headers: { 'Authorization': 'whatever-you-want' }})

    The following endpoints are available:

    GET /tasks
    DELETE /tasks/:id
    POST /tasks { name, email, avatarURL }
  </pre>
  `

  res.send(help)
})

app.use((req, res, next) => {
  const token = req.get('Authorization')

  if (token) {
    req.token = token
    next()
  } else {
    res.status(403).send({
      error: 'Please provide an auth header to identify yourself (can be anything)'
    })
  }
})

app.get('/tasks', (req, res) => {
  res.send(tasks.get(req.token))
})

app.delete('/tasks/:id', (req, res) => {
  var responder = tasks.remove(req.token, req.params.id);
  res.send(responder);
})

app.post('/tasks', bodyParser.json(), (req, res) => {
  const { id, name, done, className } = req.body;

  if (id && name && className) {
    res.send(tasks.add(req.token, req.body))
  } else {
    res.status(403).send({
      error: 'Please provide id + name + status + class name'
    })
  }
})

app.put('/tasks/:id', bodyParser.json(), (req, res) => {
  const { id, name, done, className } = req.body;

  if (id && name && className) {
    res.send(tasks.checkOne(req.token, req.body))
  } else {
    res.status(403).send({
      error: 'Please provide id + name + status + class name'
    })
  }
})

app.delete('/tasks', (req, res) => {
  res.send(tasks.clearDone(req.token));
});

app.put('/tasks', (req, res) => {
  res.send(tasks.checkAll(req.token));
});
app.listen(config.port, () => {
  console.log('Server Started on port %s', config.port)
})
