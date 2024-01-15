// node login.js
//目的　ユーザー名は任意、パスは罠のトリガーパス　ユーザーはＵＲＬにユーザー名を入れてアクセス　自分に割り当てられた罠の設置場所のリンクが表示される　＞　パスがわからないとトリガー出来ないのでＯＫ
//基本のルーティング実装、ミドルウェア機能を実現　→　static使用でcssやjsファイルを実装できるらしい

const express = require('express')
const app = express()
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const path = require('path')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');

/* loading middleware from outer file*/
const myMiddleware = require('./myMiddleware.js');
app.use('/login', myMiddleware);

//app.use(express.static('public')); これでフォルダーの中のファイルがindex.html内から相対パスでアクセスできたりする　下層　上層など

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

passport.use(new LocalStrategy(async (username, password, done) => {
	console.log("From passport");
	//get from database, password by username
  const receivedPassword = User1.password; //from database, hashed
  const hashed = await bcrypt.hash(password, 10);
    console.log(hashed);    
  const compared = await bcrypt.compare(receivedPassword, hashed);
    console.log("Validation Result : " + compared);
    
  if (compared === false) {
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

app.get("/", (req, res)=>{ //goes through logging func when Root is accessed
 //after middleware is proccessed
 console.log('Access on root page...');
 res.sendFile(__dirname + "/public/index.html");
});

// function logging(req, res, next){
// 	console.log("this is loggining func");
// 	//console.log(req.session);
// 	if(req.session.hasOwnProperty("passport")){ //when already logged in
// 		if(req.session.passport.user === true){
// 			console.log("Welcome back to the page");
//       console.log(req.session.passport);
// 			next();
// 			return
// 		}
// 		console.log("need to login, to login page");
// 		res.sendFile(__dirname + "/public/login.html");
// 	}else{ //if not qualified, to loginPage
// 		console.log("need to login, to login page");
// 		res.sendFile(__dirname + "/public/login.html");
// 	}
// };

app.get('/login', (req, res) => {
  if(req.session.hasOwnProperty("passport")){ //when already logged in
		if(req.session.passport.user === true){
			console.log("Already logged in");
      res.redirect('/');
      return
		}
		console.log("need to login, to login page");
		res.sendFile(__dirname + "/public/login.html");
	}
  res.sendFile('login.html', { root: path.join(__dirname, 'public') })
})

//receiving id & password from the login page
app.post('/login',
  passport.authenticate('local', { successRedirect: '/login/ok',
                                   failureRedirect: '/login/ng' })
);

app.get('/login/ng', (req, res) => {
  res.redirect('/login');
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

// node login.js

 /*extra info about middleware

	in myMiddleware.js
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => do some middleware work, can be async, include 'next()';

module.exports = router;


exportしたrouterをindex.jsのrequireで読み込み下記のように設定を行います。

const userRouter = require('./routes/myMiddleware.js');
app.use('/user', userRouter);
 //これで /user にアクセスがあると、自作ミドルウェアを通ることになる
*/