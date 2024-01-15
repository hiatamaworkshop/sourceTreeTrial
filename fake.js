// node basic.js
//testing RestClient api, get/post Trial, body-parser was important to receive Data from restClientApi.
//client側から　xhrリクエストで投げるとsetHeaderが可能なので、
//クッキーからtoken呼び出ししてヘッダーにて送信することが出来る
//その他、アクセス元やアクセス回数なども記録するのが作法
//

const express = require('express')
const app = express()
const session = require('express-session')
const path = require('path')
const bodyParser = require('body-parser')

app.use(bodyParser.json()); //needed when reading POST method of json data
app.use(bodyParser.urlencoded({ extended: true })) //needed when using POST method

///////////////////

app.get("/", (req, res)=>{ //goes through logging func when Root is accessed
 console.log('Access on root page...');
 
 //console.log(req.headers);
 //res.sendFile(__dirname + "/public/index.html");
 res.sendFile('index.html', { root: path.join(__dirname, 'public') });
 
//  res.set( //set original header to client
//   {
//     'content-type': 'text/plain',
//     'x-original-header': 'some-original_value',
//     'version': req.headers.version
//   });
//res.sendFile('index.html', { root: path.join(__dirname, 'public') })
});

app.get('/index', (req, res) => {
  console.log(req.headers);
  res.sendFile('index.html', { root: path.join(__dirname, 'public') })
})

app.get('/login', (req, res) => {
  console.log(req.headers);
  res.sendFile('login.html', { root: path.join(__dirname, 'public') })
})

app.post('/', (req, res) => {
  console.log(req.headers);
  const {firstName, lastName, nationality} = req.body;
  console.log(firstName);
  console.log(lastName);
  console.log(nationality);
  //console.log(req.headers.authorization);
  //console.log(req.headers.host);

  //res.status(404).send("Auth failed");
  //res.status(200).send("fdkalfjakl");
  res.redirect("/"); //use this way when using fetch from client javascript 
  //res.sendFile('index.html', { root: path.join(__dirname, 'public') });
  //res.send('POST is received. username: ${username}  pass: ${password');
})

app.post('/login', (req, res) => {
  console.log(req.headers);
  const {firstName, lastName, nationality} = req.body;
  console.log(firstName);
  console.log(lastName);
  console.log(nationality);
  console.log(req.headers.authorization);
  console.log(req.headers.host);

  //res.status(404).send("Auth failed");
  //res.status(200).send("fdkalfjakl");
  res.redirect("/"); //use this way when using fetch from client javascript 
  //res.sendFile('index.html', { root: path.join(__dirname, 'public') });
  //res.send('POST is received. username: ${username}  pass: ${password');
})

app.listen(3000, () => {
  console.log('Listening on port 3000');
  //console.log(path.join(__dirname, 'public'));
})

// node basic.js