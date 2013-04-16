##Introduction

This is html5 uploader,it support ie9+、chrome、firefox...

##Usage
###Send a form by ajax:
The method only submit one form now.


   $("form").uploadForm({
     success:function( text ){
       console.log( "response from server:" + text );
     },
     fail:function(){

     },
     progress:function( ev ){
       var ratio = (ev.loaded/ev.total*100).toFixed(2) + "%";
       console.log( ratio );
     }
   });

###Send many fields:
html:

    <form action="/upload" method="post" enctype="multipart/form-data">
        <label for="id">id:</label><input type="text" name="id" id="id" />
        <label for="file">file:</label><input type="file" name="file" id="file" /><br>
        <div id="progress"></div>
        <input type="submit" />
    </form>

code:

   $( "input[name='file'],input[name='id']" ).upload( "/upload",{

     success:function( text ){
       console.log( "response from server:" + text );
     },
     progress:function( ev ){
       var ratio = (ev.loaded/ev.total*100).toFixed(2) + "%";
       console.log( ratio );
     }
   });


##Dependency

* [jQuery](https://github.com/jquery/jquery)


##Run example server

	npm install express
	node server.js

and open

	http://localhost:3000/index.html

