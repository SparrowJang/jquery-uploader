
(function( $ ){


  if( typeof FormData == "undefined" || typeof XMLHttpRequest == "undefined" ) return ;

  /**
  * @class
  */
  var AjaxUploader = function(){

    this.xhr_ = new XMLHttpRequest();
    
    this.xhr_.upload.addEventListener('progress', $.proxy( this.progress_, this ));

    this.xhr_.onreadystatechange = $.proxy( this.onreadystatechange_, this );

    this.settings_ = {};

  };

  AjaxUploader.prototype = {

    /**
    * @private
    */
    progress_:function( progressEvent ){

      this.settings_.progress && this.settings_.progress( progressEvent );
    },

    /**
    * @private
    * @param {Event} ev
    */
    onreadystatechange_:function( ev ){

      if(this.xhr_.readyState == 4){
 
        this.xhr_.status == 200 ? this.settings_.success && this.settings_.success( this.xhr_.responseText ):
                                  this.settings_.fail && this.settings_.fail();
      }

    },

    /**
    * @private
    * @param {String} url
    * @param {Object} data
    */
    sendToServer_:function( url, data ){

      this.xhr_.open('POST', url, true);
      this.xhr_.send(data);
    },

    /**
    * @private
    * @param {Object} data
    * @type FormData
    */
    createFormData_:function( data ){

      var formData = new FormData();

      $.each(data,function( index, field ){
        
        formData.append( field.name, field.value );
      });

      return formData;
    },

    /**
    * @param {Object} settings
    * @param {String} settings.url
    * @param {functiuon} settings.success
    * @param {functiuon} settings.fail
    * @param {functiuon} settings.progress
    * @example
      uploader.send( {url:"/upload",success:function(){}} )
    */
    send:function( settings ){

      $.extend( this.settings_ , settings );

      var formData = this.createFormData_( settings.fields );
      this.sendToServer_( settings.url, formData );
    }

  };



  $.fn.extend({

    /**
    * @param {String} url
    * @param {Object} opts
    */
    upload:function( url, opts ){
      var uploader = new AjaxUploader(),
          fields = [];

      this.each(function(){

        var $this = $( this ),
            name = $this.attr( "name" ),
            value = $this.attr("type") == "file" ? $this.get(0).files[0]: $this.val();
 
            fields.push({name:name,value:value});
      });


      $.extend( opts,{url:url,fields:fields} );
      uploader.send( opts );

      return this;
    },

    /**
    * @param {Object} opts
    * @description This method only uses a form element.if you use forms,the callback can be error.
    */
    uploadForm:function( opts ){

      this.each(function(){

        var $this = $(this),
            url,
            isForm = $this.get(0).tagName.toLowerCase() == "form";

            if( isForm ){

              url = $this.attr( "action" );
              $( "input[type!='submit'],select", $this ).upload( url , opts );
            }

      });

      return this;
    }
  });


})( jQuery );

