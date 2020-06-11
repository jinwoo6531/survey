var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb+srv://jinwoo:1234@cluster0-hpf0t.mongodb.net/<dbname>?retryWrites=true&w=majority");
var db = mongoose.connection;
db.once('open', function(){
  console.log('DB connected');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// DB schema
var contactSchema = mongoose.Schema({
  gender:{type:String},
  animal:{type:String}
  
},
{
  collection: 'survey',  //몽구스 콜렉션 이름 지정
});

var Contact = mongoose.model('contact', contactSchema);

// Routes
// Home
app.get('/', function(req, res){
  res.redirect('/contacts');
});
// Contacts - Index
app.get('/contacts', async function (req, res) {
  let result = [
    await Contact.countDocuments({ gender: 'Male',animal:'Tiger' }),
    await Contact.countDocuments({ gender: 'Male' ,animal:'Elephant'}),
    await Contact.countDocuments({ gender: 'Female' ,animal:'Tiger'}),
    await Contact.countDocuments({ gender: 'Female' ,animal:'Elephant'}),
  ]
  
  res.render('contacts/index',{survey:result})
  
}),
// Contacts - New
app.get('/contacts/new', function(req, res){
  res.render('contacts/new');
});
// Contacts - create
app.post('/contacts', function(req, res){  
  Contact.create(req.body, function(err, contact){
    if(err) return res.json(err);
    res.redirect('/contacts');
  });
});

// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
