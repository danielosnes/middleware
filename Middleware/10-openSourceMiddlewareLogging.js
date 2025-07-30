/* 
Knwoing how to write middleware, we should now feel inspire to solve all the problems that come at us by writing code.
It's encouraging to know how to fix an issue.
If we find a solution we don't need to write, however,
it will allow us to work faster and more intelligently to focus on the problems that differentiate our application from others.

To illustrate:
if we needed to write a web server from scratch every time we wanted to build a web applications,
we'd waste a lot of time solving problems that have been solved countless times before and ignoring perfectly good pre-existing solutions.
Luckily for us web developers, Express already exists as an open source package that we can install and use to build upon.
There is a huge ecosystem of JavaScript packages tha twill solve so many of the problems that developers frequently run into.

In the workspace you'll see what code looks like using unnecessary custom solutions and lots of lines calling [console.log()].
It's not BAD code but it introduces complexity that could be avoided.
Time spent thinking about writing code that accomplishes common tasks is time that could be better spent on thinking about and writing code
that is unique to your application.

We will replace the logging code in the workspace with #morgan.
an open source library for logging information about the HTTP request-response cycle in a server application.
#morgan() will be a function, that function will have a function signature (req, res, next) that can be insterted into an app.use()
and that function will be called before all following middleware functions.
Morgan takes an argument to describe the formatting of the logging output.
For example [morgan('tiny')] will return a middleware function that does a "tiny" amount of logging.
With morgan in place we'll be able to remove the existing logging code.
Once we see how fast it is to add logging with morgan,
we won't have to spend time in the future trying to figure out how to replcate that functionality.
*/
/*****************************************************************************************************************************************/
// before
/* 
const express = require('express');
const app = express();

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
app.use((req, res, next) => {
  console.log(`${req.method} Request Received`);
  next();
});

app.use('/beans/:beanName', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    console.log('Response Sent');
    return res.status(404).send('Bean with that name does not exist');
  }
  req.bean = jellybeanBag[beanName];
  req.beanName = beanName;
  next();
});

app.get('/beans/', (req, res, next) => {
  res.send(jellybeanBag);
  console.log('Response Sent');
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
  console.log('Response Sent');
});

app.get('/beans/:beanName', (req, res, next) => {
  res.send(req.bean);
  console.log('Response Sent');
});

app.post('/beans/:beanName/add', bodyParser, (req, res, next) => {
  const numberOfBeans = Number(req.body.number) || 0;
  req.bean.number += numberOfBeans;
  res.send(req.bean);
  console.log('Response Sent');
});

app.post('/beans/:beanName/remove', bodyParser, (req, res, next) => {
  const numberOfBeans = Number(req.body.number) || 0;
  if (req.bean.number < numberOfBeans) {
    return res.status(400).send('Not enough beans in the jar to remove!');
  }
  req.bean.number -= numberOfBeans;
  res.send(req.bean);
  console.log('Response Sent');
});

app.delete('/beans/:beanName', (req, res, next) => {
  const beanName = req.beanName;
  jellybeanBag[beanName] = null;
  res.status(204).send();
  console.log('Response Sent');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
*/
/*****************************************************************************************************************************************/
/* 
Instructions
Checkpoint 1 Passed
1.
Require morgan at the top of the app where you import Express, and save it to a const morgan.

Checkpoint 2 Passed
2.
Replace your logging middleware with morgan('tiny').

Use morgan('tiny') inside an app.use call.

Checkpoint 3 Passed
3.
Morgan will log response codes after the response is sent, so you can get rid of all the remaining console.log statements that log 'Response Sent'. 
At the end of this refactor, you should only have one console.log left in your code (inside app.listen).
*/
/*****************************************************************************************************************************************/
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
app.use((req, res, next) => {
  morgan('tiny');
  
  next();
});

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

