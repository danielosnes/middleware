/*
Being able to use open source middleware can certainly make our jobs as programmers a lot easier. 
Not only does it prevent us from having to write the same code every time we want to accomplish a common task,
it allows us to perform some tasks that would take a lot of research for us to implement.
*/

/* 
When we implement middleware we take in the [req] object, so that we can see information about the request.
This object include a good deal of important information about the request that we can use to inform our response,
however for some requests it misses a fundamental piece.
An HTTP request can include a /body/, a set of information to be transmitted to ther server for processing.
This is useful when the end user needs to send information to the server.
If you've ever updated a post onto a social media website or filled out a registration form, changes are you've sent an HTTP request with a body,
The lucky thing about using open-source middleware is that even though parsing the body of an HTTP request is a tricky operation 
requiring knowledge about network data transfer concepts,
we easily manage it by importing. library to do it for us.
*/

/* 
If we look at our [bodyParser], we see a simplified version of how one might perform request body parsing.
Let's see if there's a better way that doesnt involve us trying to create our own body-parser.
Maybe we can find a library that does it for us?

Take a look at https://github.com/expressjs/body-parser#body-parser 
"Node.js body parsing middleware" that's just what we needed!
Let's see if we can use this dependency instead of trying to manage our own body-parsing library.
*/
/*****************************************************************************************************************************************/
//before:
/* 
const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

const jellybeanBag = {
  mystery: {
    number: 4
  },
  lemon: {
    number: 5
  },
  rootBeer: {
    number: 25
  },
  cherry: {
    number: 3
  },
  licorice: {
    number: 1
  }
};

const bodyParser = (req, res, next) => {
  let queryData = '';
  req.on('data', (data) => {
    data = data.toString();
    queryData += data;
  });
  req.on('end', () => {
    if (queryData) {
      req.body = JSON.parse(queryData);
    }
    next();
  });
};

// Logging Middleware
app.use(morgan('dev'));

app.use('/beans/:beanName', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  req.bean = jellybeanBag[beanName];
  req.beanName = beanName;
  next();
});

app.get('/beans/', (req, res, next) => {
  res.send(jellybeanBag);
});

app.post('/beans/', bodyParser, (req, res, next) => {
  const body = req.body;
  const beanName = body.name;
  if (jellybeanBag[beanName] || jellybeanBag[beanName] === 0) {
    return res.status(400).send('Bean with that name already exists!');
  }
  const numberOfBeans = Number(body.number) || 0;
  jellybeanBag[beanName] = {
    number: numberOfBeans
  };
  res.send(jellybeanBag[beanName]);
});

app.get('/beans/:beanName', (req, res, next) => {
  res.send(req.bean);
});

app.post('/beans/:beanName/add', bodyParser, (req, res, next) => {
  const numberOfBeans = Number(req.body.number) || 0;
  req.bean.number += numberOfBeans;
  res.send(req.bean);
});

app.post('/beans/:beanName/remove', bodyParser, (req, res, next) => {
  const numberOfBeans = Number(req.body.number) || 0;
  if (req.bean.number < numberOfBeans) {
    return res.status(400).send('Not enough beans in the jar to remove!');
  }
  req.bean.number -= numberOfBeans;
  res.send(req.bean);
});

app.delete('/beans/:beanName', (req, res, next) => {
  const beanName = req.beanName;
  jellybeanBag[beanName] = null;
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
*/

/* 
Instructions
Checkpoint 1 Passed
1.
Our bodyParser function is okay for now, but there are bound to be edge cases and all sorts of request bodies it can’t handle well. 
Let’s replace it with a well-maintained open-source package, body-parser. 
Require 'body-parser' at the top of the app in the same way, and save it to a const bodyParser.

The syntax for importing 'body-parser' should mirror your syntax for importing 'morgan'.

Checkpoint 2 Passed
2.
Remove the bodyParser middleware that you previously wrote. 
You can also now remove it from the middleware stacks for all PUT and POST routes. 
bodyParser will automatically attach the parsed body object to req.body.

Open a new app.use call directly after your morgan logging middleware. 
bodyParser has multiple methods for returning middleware functions. 
For now, let’s use bodyParser.json() to parse all request bodies in JSON format.
*/
/*****************************************************************************************************************************************/
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

const jellybeanBag = {
  mystery: {
    number: 4
  },
  lemon: {
    number: 5
  },
  rootBeer: {
    number: 25
  },
  cherry: {
    number: 3
  },
  licorice: {
    number: 1
  }
};

// Logging Middleware
app.use(morgan('dev'));

app.use(bodyParser.json(req.body));

app.use('/:beanName', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  req.bean = jellybeanBag[beanName];
  req.beanName = beanName;
  next();
});

app.get('/beans/', (req, res, next) => {
  res.send(jellybeanBag);
});

app.post('/beans/', (req, res, next) => {
  const body = req.body;
  const beanName = body.name;
  if (jellybeanBag[beanName] || jellybeanBag[beanName] === 0) {
    return res.status(400).send('Bag with that name already exists!');
  }
  const numberOfBeans = Number(body.number) || 0;
  jellybeanBag[beanName] = {
    number: numberOfBeans
  };
  res.send(jellybeanBag[beanName]);
});

app.get('/beans/:beanName', (req, res, next) => {
  res.send(req.bean);
});

app.post('/beans/:beanName/add', (req, res, next) => {
  const numberOfBeans = Number(req.body.number) || 0;
  req.bean.number += numberOfBeans;
  res.send(req.bean);
});

app.post('/beans/:beanName/remove', (req, res, next) => {
  const numberOfBeans = Number(req.body.number) || 0;
  if (req.bean.number < numberOfBeans) {
    return res.status(400).send('Not enough beans in the jar to remove!');
  }
  req.bean.number -= numberOfBeans;
  res.send(req.bean);
});

app.delete('/beans/:beanName', (req, res, next) => {
  const beanName = req.beanName;
  jellybeanBag[beanName] = null;
  res.status(204).send();
});

app.put('/beans/:beanName/name', (req, res, next) => {
  const beanName = req.beanName;
  const newName = req.body.name;
  jellybeanBag[newName] = req.bean;
  jellybeanBag[beanName] = null;
  res.send(jellybeanBag[newName]);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});