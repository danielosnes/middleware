const { appendFile } = require("fs");
const path = require("path");

/* 
Now that we've managed to refactor our duplicate code into middleware functions,
we should be noticing that our code contains much less repetition than before.
Unfortunately, we still have duplicate code in some of our routes.
Since this code isn't shared by all of our routes,
the previous synttax of [app.use()] won't work.
Let's see what the Express Documentation for [app.use()] has to say about this use case.
This is the [app.use()] function signature:
*/
// app.use([path,] callback [, callback...])
/* 
in documentation for many programming languages, optional arguments for functions are places in square brackets [] 
This means that [app.use()] takes an optional path parameter as its first argument.
We can write middleware that will run for every request at a specific path.
*/
app.use('/sorcerer', (req, res, next) => {
    console.log('User has hit endpoint /sorcerer');
    next();
});
/* 
In the example above, the conole will print 'User has hit endpoint /sorcerer',
if someone visist our web page's '/sorcerer' endpoint.
Since the method [app.use()] was used, it won't matter if the use is performing a [GET], a [POST] or any other kind of HTTP request.
Since the path was given an argument to [app.use()] 
this middleware function will not execute if the user hits a different path
(for instance '/spells' or '/sorcerer/:sorcerer_id').
*/

/* 
// before:

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

// Add your code below:



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
      return res.status(400).send('Bean with that name already exists!');
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
    return res.status(404).send();
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
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });

  req.on('end', () => {
    const newName = JSON.parse(bodyData).name;
    jellybeanBag[newName] = jellybeanBag[req.beanName];
    jellybeanBag[req.beanName] = null;
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
We’re going to refactor all the logic that checks the existence of a jelly bean into a new middleware function. 
Currently, this logic is used in every route that begins with beans/:beanName and looks like this:

const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    console.log('Response Sent');
    return res.status(404).send('Bean with that name does not exist');
  }

Copy to Clipboard

We check to see if the bean with the supplied name exists in jellybeanBag, and we send a 404 response if it does not. 
The return statement ensures that we break out of the middleware and don’t try any operations on a nonexistent jelly bean.

Create a new app.use call after your logging middleware. It should be called for all /beans/:beanName routes. You can leave the callback empty at this point.

Checkpoint 2 Passed
2.
Copy all the checking logic (from const beanName through the if statement) from a route into your middleware callback. Remove those lines from every route that uses them.

Checkpoint 3 Passed
3.
After the checking logic, we’re going to attach the correct bean object to the request by setting a bean property on the request (req.bean). 
Set it equal to the correct bean from the bean object. For good measure, also attach the bean name to the request as req.beanName.

After these properties are set, be sure to call next.

The syntax for setting a property of the request object is

req.propertyName = value;

Copy to Clipboard

Checkpoint 4 Passed
4.
You can now remove the duplicate checking logic from all /beans/:beanName routes. 
To make sure that all your routes still work if we remove const beanName = req.params.beanName; from them, 
make sure that you use req.beanName any place where you need to access the bean by name. For instance, inside app.delete, you’ll have to change

jellybeanBag[beanName] = null;

Copy to Clipboard

to

jellybeanBag[req.beanName] = null;

Copy to Clipboard

Check your routes to make sure that they use req.beanName.
*/

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

// Add your code below:
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

app.post('/beans/', (req, res, next) => {
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });

  req.on('end', () => {
    const body = JSON.parse(bodyData);
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
});

app.get('/beans/:beanName', (req, res, next) => {
  res.send(req.bean);
  console.log('Response Sent');
});

app.post('/beans/:beanName/add', (req, res, next) => {
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });

  req.on('end', () => {
    const numberOfBeans = Number(JSON.parse(bodyData).number) || 0;
    req.bean.number += numberOfBeans;
    res.send(req.bean);
    console.log('Response Sent');
  });
});

app.post('/beans/:beanName/remove', (req, res, next) => {
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });

  req.on('end', () => {
    const numberOfBeans = Number(JSON.parse(bodyData).number) || 0;
    if (req.bean.number < numberOfBeans) {
      return res.status(400).send('Not enough beans in the jar to remove!');
    }
    req.bean.number -= numberOfBeans;
    res.send(req.bean);
    console.log('Response Sent');
  });
});

app.delete('/beans/:beanName', (req, res, next) => {
  req.bean = null;
  res.status(204).send();
  console.log('Response Sent');
});

app.put('/beans/:beanName/name', (req, res, next) => {
  let bodyData = '';
  req.on('data', (data) => {
    bodyData += data;
  });

  req.on('end', () => {
    const newName = JSON.parse(bodyData).name;
    jellybeanBag[newName] = jellybeanBag[req.beanName];
    jellybeanBag[req.beanName] = null;
    res.send(jellybeanBag[newName]);
    console.log('Response Sent');
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});