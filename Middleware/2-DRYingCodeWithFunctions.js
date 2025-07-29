/**
 * Beyond labelling, good code will leverage the strength of its programming language to avoid performing the same tasks.
 * Like this example:
 */
const addFive = number => {
  const fiveAdded = number + 5;
  console.log(`Your number plus 5 is ${fiveAdded}`);
}

const addTen = number => {
  const tenAdded = number + 10;
  console.log(`Your number plus 10 is ${tenAdded}`);
}

const addTwenty = number => {
  const twentyAdded = number + 20;
  console.log(`Your number plus 20 is ${twentyAdded}`);
}
/**
 * While these three function definitions are not exact duplicates of each other,
 * a well-designed application will be flexible enough to join similar functionality in a single element.
 */
const addNumber = (number, addend) => {
    const numAdded = number + addend;
    console.log(`Your number plus ${addend} is ${numAdded}`);
}
/**
 * As you can see by adding an argument to the earlier functions we can simplify our application code which will ultimately save time 
 * should we realize that we also want an [addFifty()] function and an [addHundred()] function.
 * 
 * Code that performs the saem task in multiple places is repetitive, 
 * and the quality coder's credo is:
 * [D]on't [R]epeat [Y]ourself
 * If a program performs similar tasks without refactoring it into a function, it is said to "violate DRY".
 * Violating DRY is a programmer's way of complaining: "This scrips is saying the same thing over and over! We can do the same thing with less code!"
 * Let's try to not repeat ourselves in this code base by repurposing some of the more glaringly repeated code into functions we can call instead.
 */

/*
Instructions
Checkpoint 1 Passed
1.
We have provided a front-end for testing out your routes throughout this lesson. To get it to display in each exercise, start your server (node app.js) and then refresh the browser to the right. A tool should appear that allows you to set request verbs, paths, and body information, and then make requests using that information. Use this tool to ensure your server is working as expected throughout this lesson, checking your server logs and examining the returned responses as you make changes.

Checkpoint 2 Passed
2.
Currently, each route logs a message with the HTTP method and a message that the request was received (i.e. 'GET Request Received'). Write a function logRequest that takes a single string parameter verb and logs a message formatted in the same fashion.

Checkpoint 3 Passed
3.
Replace the console.log calls that open each route and replace each with a call to logRequest. Pass in the method name for each route.
*/
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

// Add your logging function here:
const logRequest = verb => {
  console.log(`${verb} Request Received`);
}


app.get('/beans/', (req, res, next) => {
  logRequest('GET');
  res.send(jellybeanBag);
  console.log('Response Sent');
});

app.post('/beans/', (req, res, next) => {
  logRequest('POST');
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

app.get('/beans/:beanName', (req, res, next) => {
  logRequest('GET');
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    console.log('Response Sent');
    return res.status(404).send('Bean with that name does not exist');
  }
  res.send(jellybeanBag[beanName]);
  console.log('Response Sent');
});


app.post('/beans/:beanName/add', (req, res, next) => {
  logRequest('POST');
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
  logRequest('POST');
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
  logRequest('DELETE');
  const beanName = req.params.beanName;
  if (!jellybeanBag[beanName]) {
    return res.status(404).send('Bean with that name does not exist');
  }
  jellybeanBag[beanName] = null;
  res.status(204).send();
  console.log('Response Sent');
});

app.put('/beans/:beanName/name', (req, res, next) => {
  logRequest('PUT');
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