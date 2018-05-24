const clone = require('clone')
const config = require('./config')

const db = {}

const defaultData = {
  tasks: [
    {
      id: 1,
      name: 'Test1',
      className: 'task',
      done: false
    },
    {
      id: 2,
      name: 'Test2',
      className: 'task',
      done: false
    },
    {
      id: 3,
      name: 'Test3',
      className: 'task',
      done: false
    }
  ]
}

const get = (token) => {
  let data = db[token]

  if (data == null) {
    data = db[token] = clone(defaultData)
  }

  return data
}

const add = (token, task) => {
  get(token).tasks.push(task)
  return task
}

const remove = (token, id) => {
  const data = get(token);
  const task = data.tasks.find(c => c.id === parseInt(id));

  if (task) {
    data.tasks = data.tasks.filter(t => t.id !== parseInt(id));  
  }
  console.log(data.tasks)
  return { task }
}

const checkOne = (token, task) => {
  const data = get(token);

  data.tasks = data.tasks.filter(t => t.id !== parseInt(task.id));
  data.tasks = data.tasks.concat(task);
  
  return task;
}

const clearDone = (token) => {
  const data = get(token);
  data.tasks = data.tasks.filter(t => !t.done);

  return data.tasks;
}

const checkAll = (token) => {
  const data = get(token);

  if(data.tasks.length !== data.tasks.filter(t => t.done).length) {
    data.tasks = data.tasks.map(t => (
      {
        ...t,
        done: true,
        className: 'task-completed'
      }
    ));
  } else {
    data.tasks = data.tasks.map(t => (
      {
        ...t,
        done: false,
        className: 'task'
      }
    ));
  }

  return data.tasks;
}

module.exports = {
  get,
  add,
  remove,
  checkOne,
  clearDone,
  checkAll
}
