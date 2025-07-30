/* 
Recall that #middleware is just a function with a specific signature,  namely (req, res, next).
We have, for the most part been using anonymous function definitions for this because our middleware has only been relevant to the route invoking it.
There is nothing stopping us from defining functions and using them as middleware through. 
That is to say:
*/
const logging = (req, res, next) => {
    console.log(req);
    next();
};
app.use(logging);
/* 
is a valid and reasonable way to introduce logging throughout all paths.
It is also modifiable so that you can remove the [app.use()] line and replace it with a specific route method, 
or sprinkle it throughout the application without it being universal.

Up until this point we've only been giving each middleware-accepting method a single callback.
With modular pieces like this, 
it is useful to know tha tmethods such as [app.use()] and [app.get()] and [app.post()] etc, 
can take multiple callbacks as additional parameters.
This results in code that lookes like the following:
*/
const authenticate = (req, res, next) => {
    // logic goes here
};
const validateData = (req, res, next) => {
    // logic goes here
};
const getSpell = (req, res, next) => {
    res.status(204).send(getSpellById(req.params.id));
};
const createSpell = (req, res, next) => {
    createSpellFromRequest(req);
    res.status(201).send();
};
const updateSpell = (req, res, next) => {
    updateSpellFromRequest(req);
    res.status(204).send();
}
app.get('/spells/:id', authenticate, getSpell);

app.post('/spells', authenticate, validateData, createSpell);

app.put('/spells/:id', authenticate, validateData, updateSpell);
/* 
In the above code sample, we created reusable middleware for authentication and data validation.
We use the [authenticate()] middleware to verify a user is logged in before proceeding with the request
and we use the [validateData()] middleware before performing the approriate create or update function.
Additional middleware can be placed at any point in this chain.
*/
/*****************************************************************************************************************************************/
/* 
// before:
*/
/*****************************************************************************************************************************************/
/* 
// instructions:

1.
Since we don’t need any request body for GET or DELETE routes, let’s refactor the behavior of our body-parsing middleware to use the in-route middleware stack. Start by saving the body-parsing middleware to a const variable bodyParser and removing the app.use call handling body parsing for ['/beans/', '/beans/:beanName'].

To extract a middleware function and save to a variable, you can use this refactoring pattern:

Initial code:

app.use((req, res, next) => {
  res.send('Cool data!');
});

Copy to Clipboard

Refactored:

const sendCoolResponse = (req, res, next) => {
  res.send('Cool data!');
};

app.get(sendCoolResponse);

Copy to Clipboard

Checkpoint 2 Passed
2.
Now, insert the bodyParser as the first callback for all routes handling POST requests.
*/
/*****************************************************************************************************************************************/
// after:

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
    return res.status(404).send('Bean with that name does not exist');
  }
  req.bean = jellybeanBag[beanName];
  req.beanName = beanName;
  next();
});

// task 1
const bodyParser = (req, res, next) => {
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
};


app.get('/beans/', (req, res, next) => {
  res.send(jellybeanBag);
  console.log('Response Sent');
});

app.post('/beans/', bodyParser, (req, res, next) => {
  
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

app.put('/beans/:beanName/name', (req, res, next) => {
  const beanName = req.beanName;
  const newName = req.body.name;
  jellybeanBag[newName] = req.bean;
  jellybeanBag[beanName] = null;
  res.send(jellybeanBag[newName]);
  console.log('Response Sent');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
