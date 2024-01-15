// node login.js
//目的　ユーザー名は任意、パスは罠のトリガーパス　ユーザーはＵＲＬにユーザー名を入れてアクセス　自分に割り当てられた罠の設置場所のリンクが表示される　＞　パスがわからないとトリガー出来ないのでＯＫ

const express = require('express')
const app = express()
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const path = require('path')
const bodyParser = require('body-parser')

const User1 = {
  name: "aaa",
  password: "bbb"
};

//app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ 
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy((username, password, done) => {
  if (username !== User1.name || password !== User1.password) {
    return done(null, false, { message: 'ユーザー情報が正しくありません。' });
  }
  return done(null, true, {username: username, password: password})
}))

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})

///////////////////

app.get("/", logging, (req, res)=>{ //goes through logging func when Root is accessed
	console.log(req.session);
 res.sendFile(__dirname + "/public/index.html");
 console.log("index page");
});

function logging(req, res, next){
	console.log("this is loggining func");
	console.log(req.session);
	if(req.session.hasOwnProperty("passport")){
		if(req.session.passport.user === true){
			console.log("Welcome back to the page");
			next();
			return
		}
		console.log("need to login, to login page");
		res.sendFile(__dirname + "/public/login.html");
	}else{ //if not qualified, to loginPage
		console.log("need to login, to login page");
		res.sendFile(__dirname + "/public/login.html");
	}
};


app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: path.join(__dirname, 'public') })
})

app.post('/login',
  passport.authenticate('local', { successRedirect: '/login/ok',
                                   failureRedirect: '/login/ng' }));

app.get('/login/ng', (req, res) => {
  res.sendFile('ng.html', { root: path.join(__dirname, 'public') })
})

app.get('/login/ok', 
require('connect-ensure-login').ensureLoggedIn('/login'), // <---
(req, res) => {
	console.log(req.session);
  res.sendFile('ok.html', { root: path.join(__dirname, 'public') })
});

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})


app.listen(3000, () => {
  console.log('Listening on port 3000')
})