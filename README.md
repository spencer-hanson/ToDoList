#ToDoList
<img src="media/ToDo.gif" alt="demo" width="600" />
###How to install on a webserver!
1. Copy the contents of public_html to your website directory
2. You're done!






###Setting up a custom server
1. Get redis-server installed with
```shell
sudo apt-get install redis-server
```
2. In a seperate terminal, make sure the redis-server is running with
```shell
redis-server
```
3. Change the line in todo.js from my heroku server to your server
```javascript
$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
                options.url = 'http://your-url-here.com' + options.url;
    });
```
4. Download node.js and run
```shell
node index.js
```
5. Done!
