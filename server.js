var express = require('express');
var _ = require('underscore');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var nodes = { };
var usernames = {};
var urlencodedParser = bodyParser.urlencoded({extended:false});



server.listen(process.env.PORT || 3000);

app.configure(function(){
    app.set('view engine', 'ejs');
    app.set('view options', { layout: false });
    app.use(express.methodOverride());
    app.use(express.bodyParser());  
    app.use(express.cookieParser('authentication'));
    app.use(express.session());
    app.use(app.router);
    app.use('/public', express.static('public'));
    app.use('/modal',express.static('modal'));
    app.use('/node_modules/moment',express.static('moment'));    
});

app.use(function(req,res,next){
    var err = req.session.error,
        msg = req.session.success;
    
    delete req.session.error;
    delete req.session.success;
    
    res.locals.message = '';
    if(err)res.locals.message = '<p class="msg error"' + err + '</p>';
    if(err)res.locals.message = '<p class="msg success"' + msg + '</p>';
    next();
});

function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);

    Reg.findOne({
        username: name
    },

    function (err, user) {
        if (user) {
            if (err) return fn(new Error('cannot find user'));
            //hash(pass, user.salt, function (err, hash) {
              //  if (err) return fn(err);
               // if (hash == user.hash) return fn(null, user);
               // fn(new Error('invalid password'));
            //});
        //} else {
          //  return fn(new Error('cannot find user'));
        }
    });

}

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

function userExist(req, res, next) {
    Reg.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "User Exist"
            res.redirect("/signup");
        }
    });
}



app.enable('verbose errors');


app.get('/', function (req, res) {
  res.render('login');
});

app.get('/thankyou',function(req,res){
    res.render('thankyou');
});



app.get('/signup', function(req,res){
    res.render('signup',{showpop:0});
});

app.get('/', function(req,res){
    res.render('login');
});

// -------------- Registratino module ----------------------------------------------------------------


 
var Reg = require('./modal/registration');

app.post('/signup',urlencodedParser,function(req,res,err){
   
   Reg.count({email:req.body.email},function(err,count){
      if(err) throw err;
        if(count == 0)
        {
           
                var user = Reg({
                    userimage:'testing',
                    displayname: req.body.display_name,
                    firstname: req.body.first_name,
                    lastname: req.body.last_name,
                    email: req.body.email,
                    password: req.body.password,
                    confirmpassword: req.body.password_confirmation         
                });

                user.save(function(err){
                    if (err) throw err;
                    console.log('User Saved!');
                });
                
                res.render('thankyou');          
            
        } else {
          
            res.render('signup',{showpop:'1'});
        };
        
   });
   
                                      
});

//------------ End Registration module ---------------------------------------------------------------

//------------------------------- Login Module -------------------------------------------------------

app.post('/',urlencodedParser, function(req,res){       
    
     Reg.count({displayname:req.body.inputUname,password:req.body.inputPassword},function(err,result){         
         if(err) throw err;
         
         if(result != 0)
         {             
             res.render('index',{uname:req.body.inputUname,pwd:req.body.inputPassword});    
         }
         else {
            //console.log('User Name or Password is incorrect.');
            Reg.count({displayname:req.body.inputUname},function(err,data){
                if(err) throw err;
                
                if(data !=0)
                {
                    
                }
                else {
                    
                }
            });  
              
         }
         
         
     });         
                     
});

//------------------------------- End Login Module ---------------------------------------------------


// --------------------------------- IO Socket for Chat Start here -------------------------------------
io.sockets.on('connection', function(socket) {
	socket.on('sendchat', function (data) {
		io.sockets.emit('updatechat', socket.username, data);
	});

	socket.on('adduser', function(username) {
		socket.username = username;

		usernames[username] = username;

		socket.emit('servernotification', { connected: true, to_self: true, username: username });

		socket.broadcast.emit('servernotification', { connected: true, username: username });

		io.sockets.emit('updateusers', usernames);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){

		delete usernames[socket.username];

		io.sockets.emit('updateusers', usernames);

		socket.broadcast.emit('servernotification', { username: socket.username });
	});
});

//-------------------------------- END IO Socket Chat here -----------------------------------------------




//------------------------------- Error Handling Start here ----------------------------------------------

app.use(function(req, res, next){
  res.status(404);
  
  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  //if (req.accepts('json')) {
    //res.send({ error: 'Not found' });
    //return;
  //}

  // default to plain-text. send()
  //res.type('txt').send('Not found');
});

app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);
  res.render('500', { error: err });
});

app.get('/404', function(req, res, next){
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
});

app.get('/403', function(req, res, next){
  // trigger a 403 error
  var err = new Error('not allowed!');
  err.status = 403;
  next(err);
});

app.get('/500', function(req, res, next){
  // trigger a generic (500) error
  next(new Error('keyboard cat!'));
});

//-------------------------------------- END ERROR Handlaing here -----------------------------------------------


