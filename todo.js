 //Helper functions   
    $.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;
    };


    function htmlEncode(value){
      return $('<div/>').text(value).html();
    }
//End Helper functions

    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
		options.url = 'http://localhost:3000' + options.url;      
    });

    var ToDos = Backbone.Collection.extend({
      url: '/todos'
    });

    var ToDo = Backbone.Model.extend({
      urlRoot: '/todos'
    });

    var ToDoListView = Backbone.View.extend({
      el: '.page',
      events: {
        'click .removeCheckbox' : 'deleteToDo'
      },
      render: function () {
        var self = this;
        var todos = new ToDos();
        todos.fetch({
          success: function (todos) {
            var template = _.template($('#todo-list-template').html(), {todos: todos.models});
            self.$el.html(template);
          }
        });
      },
      deleteToDo: function (ev) {
	var todoDetails = $(ev.currentTarget).serializeObject();
        var todoItem = new ToDo({id: todoDetails.id});
        todoItem.destroy({
          success: function () {
	    location.reload();
            router.navigate('', {trigger:true});
          }
        });
        return false;
      }
    });

    var EditTodoView = Backbone.View.extend({
      el: '.page',
      events: {
        'submit .edit-todo-form': 'saveToDo',
        'click .delete': 'deleteToDo',
	'click .back': 'goBack'
      },
      goBack: function(ev) {
      	window.history.back();
      },
      saveToDo: function (ev) {
        var todoDetails = $(ev.currentTarget).serializeObject();
        var todoItem = new ToDo();

	if(todoDetails.desc && todoDetails.title) {
		todoItem.save(todoDetails, {
	          success: function () {
        	    router.navigate('', {trigger:true});
	          }
        	});
	} else if(!todoDetails.title){
		alert("You can't leave the title empty!");	

	} else {
		alert("You can't leave the description empty!");	
	}
        return false;
      },
      deleteToDo: function (ev) {
        this.todoItem.destroy({
          success: function () {
            router.navigate('', {trigger:true});
          }
        });
        return false;
      },
      render: function (options) {
        var self = this;
        if(options.id) {
          self.todoItem = new ToDo({id: options.id});
          self.todoItem.fetch({
            success: function (todoItem) {    
              var template = _.template($('#edit-todo-template').html(), {todoItem: todoItem});
              self.$el.html(template);
            }
          });
        } else {
          var template = _.template($('#edit-todo-template').html(), {todoItem: null});
          self.$el.html(template);
        }
      }
    });


    var Router = Backbone.Router.extend({
        routes: {
          "": "home", 
          "edit/:id": "edit",
          "new": "edit",
        }
    });


    var todoEditView = new EditTodoView();

    var todoListView = new ToDoListView();

    var router = new Router;
    router.on('route:home', function() {
      todoListView.render();
    })
    router.on('route:edit', function(id) {
      todoEditView.render({id: id});
    })

    Backbone.history.start();
