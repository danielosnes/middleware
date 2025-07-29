/**
 * By now you may have noticed that our efforts to not repeat ourselves have resulted in 
 * us putting the same function call over and over throughout the code.
 * Isn't that somewhat contradictory?
 * You would be absolutely right to think so.
 * 
 * So how do we get code to run every time one of our Express routes is called without repeating ourselves?
 * We write something called #middleware.
 * Middleware is code that executes between a server receiving a request and sending a response.
 * It operates on the boundary, so to speak, between those two HTTP actions.
 * 
 * In Express, middleware is a function.
 * Middleware can perform logic on the request and response objects.
 * Such as:
 * - inspecting a request
 * - performing some logic based on the request 
 * - attaching information to the reponse
 * - attaching a status to the response
 * - sending the response back to the user
 * or simply 
 * - passing the request and response to another middleware.
 * 
 * Middleware can do any combination of those things or anythings else a JavaScript function can do
 */

app.use((req, res, next) => {
    console.log('Request Received');
});

/**
 * The previous code snipped is an example of middleware in action.
 * [app.use()] taks a callback function that it will call for ever received request.
 * In this example, every tim ethe server receives a request, it will find the first registered middleware function and call it.
 * In this case, the server will find the callback function specified above, call it and print out: 'Request Received'
 * 
 * You might be wondering what else our application is responsible for that isn't related to middleware.
 * The answer is not much.
 * To quote the Express Documentation:
 * "An Express application is essentially a series of middleware function calls."
 * 
 * It is precisely this service that we leverage Express for.
 * In addition to performing the #routing that allows us to communicate approriate data for each separate endpoint, 
 * we can perform application logic we need by implementing the necessary middleware.
 */

/**
//before:



/*

Instructions
Checkpoint 1 Passed
1.
After your logRequest function, there is an unfinished call to app.use(). 
Its callback will be called before every route. 
We’ll be moving the logging out of logRequest, so we no longer have access to the verb string. 
Since we can access the req object, however, we can use the req.method property which will always be equal to the verb of the request! 
Finish the app.use() callback by replicating the logging behavior of logRequest.

Don’t be afraid if your server no longer returns responses. We will fix this in the next exercise.

Checkpoint 2 Passed
2.
All the calls to logRequest should now be redundant. Remove them from every route, and remove the logRequest function itself.

Checkpoint 3 Passed
3.
Now we’ve removed a significant amount of code, but our routes aren’t returning responses, because something is still missing from our first app.use() call. 
Move on to the next exercise when you’re ready.
*/

/*
//after:

const express = require('express');
const app = express();

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

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



app.use((req, res, next) => {
  console.log(`Request Received`);


});

app.get('/beans/', (req, res, next) => {
  
  res.send(jellybeanBag);
  console.log('Response Sent');
});

app.post('/beans/', (req, res, next) => {
  
  let queryData = '';
  req.on('data', (data) => {
    queryData += data;
  });

  req.on('end', () => {
    const body = JSON.parse(queryData);
    const beanName = body.name;
    if (jellybeanBag[beanName] || jellybeanBag[beanName] === 0) {
      return res.status(404).send('Bean with that name does not exist');
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

app.post('/beans/:beanName/remove', (req, res, next) => {
  
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
*/

/*


 */