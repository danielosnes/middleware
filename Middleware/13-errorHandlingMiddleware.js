const { appendFile } = require("fs");

/* 
We're almost finished with our Code Quality Checklist, there's just one last problem to fix!
When an error is thrown somewhere in our code, we want to be able to communicate that there was a problem to the user.
A programming error is never something to be ashamed of.
It's simply another situation for which we should be prepared.

Error handling middleware needs to be the last [app.use()] in your file.
If an error happens in any of our routs, we want to make sure it gets passed to our error handler.
The middleware stack progresses through routes as they are presented in a file,
therefore the error handler should sit at the bottom of the file,
how do we write it?
*/
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
/* 
Based on the code above, 
we can see that error handling widdleware is written much like other kinds of middleware.
The biggest difference is that there is an additional parameter in our callback function, [err].
This represents the error obkect, and we can use it to investigate the error and perform different tasks depending on what kind of error was thrown.
For now, we only want to send an HTTP 500 status response to the user.

Express has its own error-handler, 
which catches errors that we haven't handled.
But if we anticipate an operation might fail,
we can invoke our error-handling middleware.
We do this by passing an error object as an argument to [next()].
Usually, [next()] is called without arguments and will proceed through the middleware stack as expected.
When called with an error as the first argument, however,
it will call any applicable error-handling middleware.
*/
app.use((req, res, next) => {
    const newValue = possiblyProblematicOperation();
    if (newValue === undefined) {
        let undefinedError = new Error('newValue was not defined!');
    return next(undefinedError);
    }
    next();
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).send(err.message);
});
/* 
In this segment we assign the return value of the function [possiblyProblematicOperation()] to [newValue].
Then we check to see if this function returned anything at all.
If it didn't, we create a new [Error] and pass it to [next()].
This prompts the error-handling middleware to send a response back to the user.
but many other error-handling techniques could be employed.
Like logging, reattempting the failed operation, and/or eamailing the developer.
*/
/*****************************************************************************************************************************************/
//before:
/* 
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

// Body-parsing Middleware
app.use(bodyParser.json());

// Logging Middleware
if (!process.env.IS_TEST_ENV) {
  app.use(morgan('dev'));
}

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

app.post('/beans/', (req, res, next) => {
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

// Add your error handler here:



app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
*/
/*****************************************************************************************************************************************/
//instructions:
/*
er).

Instructions
Checkpoint 1 Passed
1.
Add a very simple error handler as the last handler in your file, immediately before app.listen. The callback function should have four arguments. It should set the status of the response equal to the status property of the error object if it exists or set it to 500 by default. Finally, your error handler should send back the error object’s message property.

If you want to see your errors in the terminal console as you test, log out the error or it’s message property inside your error handler.

Checkpoint 2 Passed
2.
Now, refactor the routes that send error responses (any that are greater than or equal to 400) to use this error handler. This means instead of a line like this

return res.status(404).send('<error message>');

Copy to Clipboard

You should instead create a new Error with the correct error message, set its .status property, and then call next and pass in the error. Be sure to still return the next call so that the route/middleware callback breaks out and the error handler takes over.

An example of this refactoring might look like this:

Before:

return res.status(404).send('error!');

Copy to Clipboard

After:

const err = new Error('error!');
err.status = 400;
return next(err);

*/

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

// Body-parsing Middleware
app.use(bodyParser.json());

// Logging Middleware
if (!process.env.IS_TEST_ENV) {
  app.use(morgan('dev'));
}

app.use('/beans/:beanName', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    const error = new Error('Bean with that name does not exist')
    error.status = 404;
    return next(error);
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
    const error = new Error('Bean with that name already exists!')
    error.status = 400;
    return next(error);
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
    const error = new Error('Not enough beans in the jar to remove!')
    error.status = 400;
    return next(error);
  }
  req.bean.number -= numberOfBeans;
  res.send(req.bean);
});

app.delete('/beans/:beanName', (req, res, next) => {
  const beanName = req.beanName;
  jellybeanBag[beanName] = null;
  res.status(204).send();
});

// Add your error handler here:
app.use((err, req, res, next) => {
  if (!err.status) {
    err.status = 500;
  }
  res.status(err.status).send(err.message);
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

