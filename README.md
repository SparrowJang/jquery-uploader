##Introduction

This is ajax uploader,it support ie7+、chrome、firefox...

##Usage

###The method support:
If you use IE7、IE8 and IE9, they will use iframe uploader to replace.

	IE7+
	firefox
	chrome

###Send a form by ajax:
The method only submit one form now.


	$("form").uploadForm({

	  //5M ( default 2M )
 	  fileSize:1024*1024*5,

	  success:function( text ){
	    console.log( "response from server:" + text );
	  },
	  fail:function( status, ERROR ){
	
		if( status.error_code == ERROR.CODES.FILE_SIZE ) alert( "file size > max file size" );

	  },
	  progress:function( ev ){
	    var ratio = (ev.loaded/ev.total*100).toFixed(2) + "%";
	    console.log( ratio );
	  }
	});

If you use IE7~9,they only support success parameter:


	$("form").uploadForm({
	  success:function( text ){
	    console.log( "response from server:" + text );
	  }
	});

###Send many fields:

###The method support:

	IE10+
	firefox
	chrome

####html:

    <form action="/upload" method="post" enctype="multipart/form-data">
        <label for="id">id:</label><input type="text" name="id" id="id" />
        <label for="file">file:</label><input type="file" name="file" id="file" /><br>
        <div id="progress"></div>
        <input type="submit" />
    </form>

####code:

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

