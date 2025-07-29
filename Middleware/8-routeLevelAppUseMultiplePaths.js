/* 
We learned that [app.use()] takes a path parameter,
but we never fully investigated what [path] parameter it could be.
Let's take another look at the Express Documentation for [app.use()].
Argument: Path
description: The path for which the middleware function is invoked; can be any of:
- a string representing a path
- a path pattern
- a regular expression pattern to match paths
- an array of combinations of any of the above

So [app.use()] can take an array of paths!
That seems like a handy way to rewrite the code from our last exercise so that we don't have to put the same code in two different routes with different paths.

*/

/* 

Instructions
Checkpoint 1 Passed
1.
Now we’ll add some more advanced middleware. You might have noticed that in each PUT and POST route, there is code that looks like this:

let bodyData = '';
req.on('data', (data) => {
  bodyData += data;
});
req.on('end', () => {
  // ...
});

Copy to Clipboard

You don’t need to worry too much about how this code works right now since we’ll eventually be replacing it with a better solution, but it is used for combining the HTTP request body into a single string. The req.on('end' .. callback will be called once the whole request has been received. We are going to move this logic to middleware so that it attaches the body to the request object once it’s fully received and then calls next.

Open a new call to app.use below the previous middleware. Make sure that it matches all routes for '/beans/' and '/beans/:beanName' using the array of routes syntax. You can leave your callback function body empty for now.

Checkpoint 2 Passed
2.
Now, copy the lines from the bodyData variable declaration to the end of the first req.on call into your middleware callback.

Copy these lines into your middleware:

let bodyData = '';
req.on('data', (data) => {
  bodyData += data;
});

Copy to Clipboard

Checkpoint 3 Passed
3.
The next step will be a bit different from the routes that are already present. Add req.on('end', () => {}). Complete the callback by adding the following lines inside the body of the callback function:

if (bodyData) {
  req.body = JSON.parse(bodyData);
}

Copy to Clipboard

This will parse the request body into a JavaScript object and attach it to the request object. Finish the middleware by calling next at the end of the req.on('end') callback function outside of the if statement.

Checkpoint 4 Passed
4.
Now to refactor! You can remove the lines

let bodyData = '';
req.on('data', (data) => {
  bodyData += data;
});

Copy to Clipboard

from all your routes. Then you can remove the req.on('end' ...) method calls, but you’ll need to preserve the callback functions’ internal logic. You can simply remove the lines with req.on(... and the }); line at the end of the method call. Do this for all routes that have this duplicate code.

Checkpoint 5 Passed
5.
To finish refactoring, you can replace all instances of JSON.parse(bodyData) in the same routes and replace them with req.body since the body has already been parsed!

Checkpoint 6 Passed
6.
Great job, you removed duplicate code from four routes!
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

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} Request Received`);
  next();
});

app.use('/beans/:beanName', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    console.log('Response Sent');
    return res.status(404).send('Bag with that name does not exist');
  }
  req.bean = jellybeanBag[beanName];
  req.beanName = beanName;
  next();
});

// Add your code below:
app.use(['/beans/', '/beans/:beanName'], (req, res, next) => {  
    let bodyData = '';
    req.on('data', (data) => {
    bodyData += data;
    });
    req.on('end', () => {
      if (bodyData) {
    req.body = JSON.parse(bodyData);
    }
    next();
    });
  }); 

app.get('/beans/', (req, res, next) => {
  res.send(jellybeanBag);
  console.log('Response Sent');
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
    console.log('Response Sent');
});

app.get('/beans/:beanName', (req, res, next) => {
  res.send(req.bean);
  console.log('Response Sent');
});

app.post('/beans/:beanName/add', (req, res, next) => {
    const numberOfBeans = Number(req.body.number) || 0;
    req.bean.number += numberOfBeans;
    res.send(req.bean);
    console.log('Response Sent');
});

app.post('/beans/:beanName/remove', (req, res, next) => {
    const numberOfBeans = Number(req.body.number) || 0;
    if (req.bean.number < numberOfBeans) {
      return res.status(400).send('Not enough beans in the jar to remove!');
    }
    req.bean.number -= numberOfBeans;
    res.send(req.bean);
    console.log('Response Sent');
});

app.delete('/beans/:beanName', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!req.bean) {
    return res.status(404).send('Bag with that name does not exist');
  }
  req.bean = null;
  res.status(204).send();
  console.log('Response Sent');
});

app.put('/beans/:beanName/name', (req, res, next) => {
  const beanName = req.params.beanName;
  if (!req.bean) {
    return res.status(404).send('Bag with that name does not exist');
  }
    const newName = req.body.name;
    jellybeanBag[newName] = req.bean;
    req.bean = null;
    res.send(jellybeanBag[newName]);
    console.log('Response Sent');
});  

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


/* 
*/

/* 
*/