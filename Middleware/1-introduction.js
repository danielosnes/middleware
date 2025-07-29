/**
 * Writing code is a creative process.
 * Programmers will be quick to differ in opinon on whether the solution to a problem should be implemented in one way or another
 * - citing tradeoffs in algorithms, structures, or even languages.
 * Due to these trade-offs, the problems programmers face most frequently have several different solutions,
 * all current but all written differently with various factors considered.
 * Becuase "correct" code can take so many different forms, decelopers have cultural notions of /code quality/ that is somewhat independent of these decisions.
 * 
 * One concept that is central to the notion of quality code is that all code is read many, many more times than it is written.
 * Maintaining and updating code takes up much more of a software developer's tim ethan production.
 * There are many ways to make this less of burden, 
 * and these techniques frequently correspond to code quality principles.
 * Naming variables consistently so that they're identifiable is one way to improve the readability of a codebase.
 * Another pillar of code quality is avoiding duplication of code within a codebase.
 * 
 * Code duplication is an invitation for bugs.
 * If incorrect code is copy and pasted in multiple places, 
 * a developer might remedy the flaws in only a few of those places and fail to fix the buggy code everywhere.
 * In this course, we will investigate severeal ways to avoid replication and reduce complexity.
 * In programming in general,
 * this often means putting the reusedcode into resuable containers like functions and objjects.
 * In Express specifically, this will also mean composing out desired functionality into a series of middleware functions.
 */

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

app.get('/', (req, res, next) => {
  console.log('GET Request Received');
  res.send(jellybeanBag);
  console.log('Response Sent');
});

app.post('/', (req, res, next) => {
  console.log('POST Request Received');
  const beanName = req.params.beanName;
  let queryData = '';
  req.on('data', (data) => {
    queryData += data;
  });

  req.on('end', () => {
    const body = JSON.parse(queryData);
    const beanName = body.name;
    if (jellybeanBag[beanName] || jellybeanBag[beanName] === 0) {
      return res.status(400).send('Bag with that name already exists!');
    }
    const numberOfBeans = Number(body.number) || 0;
    jellybeanBag[beanName] = {
      number: numberOfBeans
    };
    res.send(jellybeanBag[beanName]);
    console.log('Response Sent');
  });
});

app.get('/:beanName', (req, res, next) => {
  console.log('GET Request Received');
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    console.log('Response Sent');
    return res.status(404).send('Bean with that name does not exist');
  }
  res.send(jellybeanBag[beanName]);
  console.log('Response Sent');
});


app.post('/:beanName/add', (req, res, next) => {
  console.log('POST Request Received');
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  let queryData = '';
  req.on('data', (data) => {
    queryData += data;
  });

  req.on('end', () => {
    const numberOfBeans = Number(JSON.parse(queryData).number) || 0;
    jellybeanBag[beanName].number += numberOfBeans;
    res.send(jellybeanBag[beanName]);
    console.log('Response Sent');
  });
});

app.post('/:beanName/remove', (req, res, next) => {
  console.log('POST Request Received');
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  let queryData = '';
  req.on('data', (data) => {
    queryData += data;
  });

  req.on('end', () => {
    const numberOfBeans = Number(JSON.parse(queryData).number) || 0;
    if (jellybeanBag[beanName].number < numberOfBeans) {
      return res.status(400).send('Not enough beans in the jar to remove!');
    }
    jellybeanBag[beanName].number -= numberOfBeans;
    res.send(jellybeanBag[beanName]);
    console.log('Response Sent');
  });
});

app.delete('/:beanName', (req, res, next) => {
  console.log('DELETE Request Received');
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  jellybeanBag[beanName] = null;
  res.status(204).send();
  console.log('Response Sent');
});

app.put('/:beanName/name', (req, res, next) => {
  console.log('PUT Request Received');
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  let queryData = '';
  req.on('data', (data) => {
    queryData += data;
  });

  req.on('end', () => {
    const newName = JSON.parse(queryData).name;
    jellybeanBag[newName] = jellybeanBag[beanName];
    jellybeanBag[beanName] = null;
    res.send(jellybeanBag[newName]);
    console.log('Response Sent');
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});