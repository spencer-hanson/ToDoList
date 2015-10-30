var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var nohm = require('nohm').Nohm;

if(process.env.REDISTOGO_URL) {
	var rtg = require("url").parse(process.env.REDISTOGO_URL);
	var redis = require("redis").createClient(rtg.port, rtg.hostname);
	redis.auth(rtg.auth.split(":")[1]);
} else {
	var redis = require("redis").createClient();
}


redis.on("connect", function() {
nohm.setClient(redis);
});

var port = process.env.PORT || 3000;

var ToDo = nohm.model('ToDo', {
  properties: {
    title: {
      type: 'string',
    },
    desc: {
      type: 'string',
    }
  }
});

var listToDos = function (req, res) {
    ToDo.find(function (err, ids) {
    var todos = [];
    var len = ids.length;
    var count = 0;
    if(ids.length === 0) {
      res.send([]);

    } else {
      ids.forEach(function (id) {
        var todo = new ToDo();
        todo.load(id, function (err, props) {
          todos.push({id: this.id, title: props.title, desc: props.desc});
          if (++count === len) {
            res.send(todos);
          }
        });
      });
    }
  });
}

var todoDetails = function (req, res) {
  ToDo.load(req.params.id, function (err, properties) {
    if(err) {
      res.send(404);
    } else {
      res.send(properties);
    }
  });
};

var deleteToDo = function (req, res) {
  var todo = new ToDo();
  todo.id = req.params.id;
  todo.remove(function (err) {
    res.send(204);
  });
}

var createToDo = function (req, res) {
  var todo = new ToDo();
  todo.p(req.body);
  todo.save(function (err) {
    res.send(todo.allProperties(true));
  });
}

var updateToDo = function (req, res) {
  var todo = new ToDo();
  todo.id = req.params.id;
  todo.p(req.body);
  todo.save(function (err) {
    res.send(todo.allProperties(true));
  });
}


app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	next();
});

app.get('/todos', listToDos);
app.get('/todos/:id', todoDetails);
app.delete('/todos/:id', deleteToDo);
app.post('/todos', createToDo);
app.put('/todos/:id', updateToDo);

app.listen(port);
