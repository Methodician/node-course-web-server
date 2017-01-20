const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
//lets you set some express related configurations with a key:value pair
app.set('view engine', 'hbs');

//  Creating our own middleware
app.use((req, res, next) => {
    //  next tells node that your middleware function is done.
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
      if(err) console.log('Unable to append to server.log.');
    });
    next();
});

//  All you need to do to take the site out from maintenance is comment out this middleware
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

//  Adding middleware with "app.use()"
//  "__dirname" is a (node?) variable that stores the path to the project directory
//  This had to be moved from above to down here because otherwise it would be rendered even if the site was under rmaintenance since middleware is executed in the order in which it's added.
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//  Handler ofr an HttpGET request.
app.get('/', (req, res) => {
  //  req (request) stores loads of info about the request coming in like headers, body, methods, etc...
  //  res (response) has a bunch of methods available to you for use when responding to the request.
  // res.send({
  //   name: 'Jacob',
  //   likes: [
  //     'Applesauce',
  //     'Hummingbirds'
  //   ]
  // });
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to this shabby learning site!!!'
  })
});

app.get('/about', (req, res) => {
  // res.send('<h1>About Page</h1>');
  //  Views is the default directory that express uses for temlplates
  //  The second argument is optional. It's an object containing key:value pairs...
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page'
  });
})

app.get('/hummingbird', (req, res) => {
  res.send({
    locomotion: 'Flight',
    likes: [
      'sugar',
      'water',
      'small bugs',
      'territorial battles'
    ],
    coldTolerance: 8
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessge: 'There was an error'
  });
});

// second argument is opitonal, lets you do something once the server is up
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
