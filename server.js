const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));
app.use(bodyParser.json());
    
// All your handlers here...
app.set('view engine', 'ejs');

// app.listen(3000, function() {
//     console.log('listening on 3000');
// });

// app.get('/', function(req, res) {
//   	res.send('Hello World');
// });


var db;
    
MongoClient.connect('mongodb://root:123@ds241875.mlab.com:41875/lk_node_test', (err, database) => {
  // ... start the server
  	if (err) return console.log(err)
      	db = database
      	app.listen(3000, () => {
        console.log('listening on 3000')
    });
});


app.get('/', (req, res) => {
    
    // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
    // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.

    //var cursor = db.collection('quotes').find();
    //console.log(cursor);

    db.collection('quotes').find().toArray(function(err, results) {
      	//console.log(results)
      	// send HTML file populated with quotes here
      	//res.sendFile(__dirname + '/index.html');
      	res.render('index.ejs', {quotes: results})
    })
});


app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err)
    
        console.log('saved to database')
        res.redirect('/')
    })
});


app.put('/quotes', (req, res) => {
  	// Handle put request
  	db.collection('quotes').findOneAndUpdate(
  	{
  		name: 'Yoda'
  	}, 
  	{
    	$set: {
      		name: req.body.name,
      		quote: req.body.quote
    	}
  	}, 
  	{
    	sort: {_id: -1},
    	upsert: true
  	}, 
  	(err, result) => {
    	if (err) return res.send(err)
    	res.send(result)
  	})
});



app.delete('/quotes', (req, res) => {
  	// Handle delete event here
  	db.collection('quotes').findOneAndDelete(
  	{name: req.body.name},
  	(err, result) => {
    	if (err) return res.send(500, err)
    	res.send(result)
    	//res.send('A darth vadar quote got deleted')
  	})
})