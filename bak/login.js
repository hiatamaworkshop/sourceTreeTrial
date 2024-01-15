// node login.js
//目的　ユーザー名は任意、パスは罠のトリガーパス　ユーザーはＵＲＬにユーザー名を入れてアクセス　自分に割り当てられた罠の設置場所のリンクが表示される　＞　パスがわからないとトリガー出来ないのでＯＫ

const express = require('express');
const app = express();
const http = require("http").createServer(app);
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", logging, (req, res)=>{ //goes through logging func when Root is accessed
 console.log(req.myData);
 res.sendFile(__dirname + "/index.html");
 console.log("fin");
});
app.get("/index",(req, res)=>{
 res.sendFile(__dirname + "/index.html");
 //console.log(req.body.username); //不可
 console.log("index page");
});


app.get("/login/:username", auth, (req, res)=>{ //need to go through auth func
	console.log("login page " + req.params.username); // >> url+login/someusername　の書式でアクセスしたら取得できる　ミドルウェアでも参照可能
	//console.log(req.myData); //data from auth func　参照可能
    res.sendFile(__dirname + "/login.html");
 
});
app.post('/login', async (req, res) => { //receives postdata
    console.log("from login " + req.body.username + " : " + req.body.password);
    //　確認処理　マッチング
    const mypass = req.body.password;
    const hashed = await bcrypt.hash(mypass, 10);
    console.log("hashed pass : " + hashed);
    
    const compared = await bcrypt.compare("mypass", hashed);
    console.log("result : " + compared);
    if(compared === true){
    	res.redirect("/index");
    }else{
    	console.log("Not registered yet, need to login first");
    	res.redirect('/login/' + req.body.username);
    }
});

function logging(req, res, next){
	console.log("this is loggining func");
	if(req.params.auth === true){
		next();
		return
	}else{ //if not qualified, to loginPage
		console.log("need to login, to login page");
		res.redirect('/login');
	}
};
function auth(req, res, next){ //check if user is already registered, req.params.usernameにアクセス可能
	console.log("this is auth func " + req.params.username);
	if(req.params.username === "mytest"){ //if already authorized
		console.log("BINGO you are registered");
		res.redirect("/index");
	}else{
		console.log("Not registered yet, need to login first");
		//req.myData = "bang2"; //pass data to next callback
		next();
	}
};


http.listen(3000, ()=>{
  console.log("Listening on : 3000");
});