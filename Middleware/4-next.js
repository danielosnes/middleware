/**
 * It seems like our Middleware was successful
 * - it logged out the type of each request received.
 * But then the response stopped there!
 * What happened!
 * We mentioned that most of Express's functionality is chaining middleware.
 * This chain of middleware is referred to as the #middlewareStack
 * 
 * The Middleware Stack is process in the order they appear in the application file, 
 * such that middleware defined later happens after middleware defined before.
 * It's important to note tha tthis is regardles of Method an [app.use()] that occurs after an [app.get()] will get called after the [app.get()]
 * Observe the following code:
 */
app.use((req, res, next) => {
  console.log("A sorcerer approaches!");
  next();
});

app.get('/magic/:spellname', (req, res, next) => {
  console.log("The sorcerer is casting a spell!");
  next();
});

app.get('/magic/:spellname', (req, res, next) => {
  console.log(`The sorcerer has cast ${req.params.spellname}`);
  res.status(200).send();
});

app.get('/magic/:spellname', (req, res, next) => {
  console.log("The sorcerer is leaving!");
});

// Accessing http://localhost:4001/magic/fireball 
// Console Output:
// "A sorcerer approaches!"
// "The sorcerer is casting a spell!"
// "The sorcerer has cast fireball"


/**
 * In the above code, the routes are called ion the order that they appear in the file,
 * provided the previous route called [next()] and thus passed control to the next middleware.
 * We can see that the final matching call was not printed.
 * This is because the previous middleware did not invoke the [next()] function to run the following middleware.
 * 
 * An Express middleware is a function with Three parameters (req, res, next)
 * The sequence is express by a set of callback functions invoked progressively after each middleware performs its purpose.
 * The third argument to a middleware function, [next], should get explicitly called as the last part of the middleware's body.
 * This will hand off the processing of the request and the construction of the response to that middleware in the stack
 */

/* 
//before:
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

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} Request Received`);
  
});

app.get('/beans/', (req, res, next) => {
  res.send(jellybeanBag);
  console.log('Response Sent');
});

app.post('/beans/', (req, res, next) => {
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });

  req.on('end', () => {
    const body = JSON.parse(bodyData);
    const beanName = body.name;
    if (jellybeanBag[beanName] || jellybeanBag[beanName] === 0) {
      return res.status(404).send('Bean with that name already exists!');
    }
    const numberOfBeans = Number(body.number) || 0;
    jellybeanBag[beanName] = {
      number: numberOfBeans
    };
    res.send(jellybeanBag[beanName]);
    console.log('Response Sent');
  });
});

app.get('/beans/:beanName', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    console.log('Response Sent');
    return res.status(404).send('Bean with that name does not exist');
  }
  res.send(jellybeanBag[beanName]);
  console.log('Response Sent');
});

app.post('/beans/:beanName/add', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });

  req.on('end', () => {
    const numberOfBeans = Number(JSON.parse(bodyData).number) || 0;
    jellybeanBag[beanName].number += numberOfBeans;
    res.send(jellybeanBag[beanName]);
    console.log('Response Sent');
  });
});

app.post('/beans/:beanName/remove', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });

  req.on('end', () => {
    const numberOfBeans = Number(JSON.parse(bodyData).number) || 0;
    if (jellybeanBag[beanName].number < numberOfBeans) {
      return res.status(400).send('Not enough beans in the jar to remove!');
    }
    jellybeanBag[beanName].number -= numberOfBeans;
    res.send(jellybeanBag[beanName]);
    console.log('Response Sent');
  });
});

app.delete('/beans/:beanName', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  jellybeanBag[beanName] = null;
  res.status(204).send();
  console.log('Response Sent');
});

app.put('/beans/:beanName/name', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });

  req.on('end', () => {
    const newName = JSON.parse(bodyData).name;
    jellybeanBag[newName] = jellybeanBag[beanName];
    jellybeanBag[beanName] = null;
    res.send(jellybeanBag[newName]);
    console.log('Response Sent');
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
*/

/*
Instructions
Checkpoint 1 Passed
1.
Add a call to next after your logging statement so that the middleware will be executed before moving on to your routes. 
*/

/*
//after:

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

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} Request Received`);
  next();
});

app.get('/beans/', (req, res, next) => {
  res.send(jellybeanBag);
  console.log('Response Sent');
});

app.post('/beans/', (req, res, next) => {
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });

  req.on('end', () => {
    const body = JSON.parse(bodyData);
    const beanName = body.name;
    if (jellybeanBag[beanName] || jellybeanBag[beanName] === 0) {
      return res.status(404).send('Bean with that name already exists!');
    }
    const numberOfBeans = Number(body.number) || 0;
    jellybeanBag[beanName] = {
      number: numberOfBeans
    };
    res.send(jellybeanBag[beanName]);
    console.log('Response Sent');
  });
});

app.get('/beans/:beanName', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    console.log('Response Sent');
    return res.status(404).send('Bean with that name does not exist');
  }
  res.send(jellybeanBag[beanName]);
  console.log('Response Sent');
});

app.post('/beans/:beanName/add', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });

  req.on('end', () => {
    const numberOfBeans = Number(JSON.parse(bodyData).number) || 0;
    jellybeanBag[beanName].number += numberOfBeans;
    res.send(jellybeanBag[beanName]);
    console.log('Response Sent');
  });
});

app.post('/beans/:beanName/remove', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });

  req.on('end', () => {
    const numberOfBeans = Number(JSON.parse(bodyData).number) || 0;
    if (jellybeanBag[beanName].number < numberOfBeans) {
      return res.status(400).send('Not enough beans in the jar to remove!');
    }
    jellybeanBag[beanName].number -= numberOfBeans;
    res.send(jellybeanBag[beanName]);
    console.log('Response Sent');
  });
});

app.delete('/beans/:beanName', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  jellybeanBag[beanName] = null;
  res.status(204).send();
  console.log('Response Sent');
});

app.put('/beans/:beanName/name', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });

  req.on('end', () => {
    const newName = JSON.parse(bodyData).name;
    jellybeanBag[newName] = jellybeanBag[beanName];
    jellybeanBag[beanName] = null;
    res.send(jellybeanBag[newName]);
    console.log('Response Sent');
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
*/