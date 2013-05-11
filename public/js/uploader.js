
(function( $ ){


  if( typeof FormData != "undefined" && XMLHttpRequest != "undefined" ) {

    /**
    * @class
    */
    var AjaxUploader = function(){
  
      this.xhr_ = new XMLHttpRequest();
      
      this.xhr_.upload.addEventListener('progress', $.proxy( this.progress_, this ));
  
      this.xhr_.onreadystatechange = $.proxy( this.onreadystatechange_, this );
  
    };
  
    AjaxUploader.prototype = {

      settings_:{
        fileSize:1024*1024*2 //2m
      },
  
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

          var status = {
            error_code:this.ERROR.CODES.HTTP_ERROR,
            error_message:this.ERROR.MESSAGES.HTTP_ERROR
          };
   
          this.xhr_.status == 200 ? this.settings_.success && this.settings_.success( this.xhr_.responseText ):
                                    this.settings_.fail && this.settings_.fail( status, this.ERROR );
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
      * @param {File} file
      */
      validateFileSize_:function( file ){

        var maxFileSize = this.settings_.fileSize;

        if( file instanceof File && file.size >= maxFileSize ) return false;

        return true;
      },

      ERROR:{
        CODES:{
          FILE_SIZE:1,
          HTTP_ERROR:2
        },
        MESSAGES:{
          FILE_SIZE:"file must be less than max file size.",
          HTTP_ERROR:"request status is error."
        }
      },

      /**
      * @param {Object} data
      * @type boolean
      */
      validate:function( data ){

        for( var index in data ){

          var val = data[index].value,status;

          if( this.validateFileSize_( val ) == false ){

            status = {
              error_code:this.ERROR.CODES.FILE_SIZE,
              error_message:this.ERROR.MESSAGES.FILE_SIZE
            };

            this.settings_.fail && this.settings_.fail( status, this.ERROR );

            return false;
          }

        }

        return true;
      },
  
      /**
      * @private
      * @param {Object} data
      * @type FormData
      */
      createFormData_:function( data ){
  
        var formData = new FormData(),
            _this = this;
  
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
      * @param {function} settings.fileSize
      * @example
        uploader.send( {url:"/upload",success:function(){}} )
      */
      send:function( settings ){
  
        $.extend( this.settings_ , settings );
  
        //validate fail
        if( !this.validate( settings.fields ) ) return;

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
              isForm = $this.get(0).tagName.toLowerCase() == "form",
              selector;
  
              if( isForm ){
  
                url = $this.attr( "action" );
                selector = "input[type!='submit'][type!='checkbox'][type!='radio'],input[type='radio']:checked,input[type='checkbox']:checked";
                selector = selector + ",select,textarea";
                $( selector, $this ).upload( url , opts );
              }
  
        });
  
        return this;
      }
    });

  }else{

   /**
   * @class
   */
    var IframeUploader = function(){

      var div = document.createElement("div"),
          $iframe,
          id = "iframe_uploader" + Math.random() + ( +new Date() );

      div.innerHTML = "<iframe id='"+id+"' name='"+id+"'></iframe>";

      $iframe = $( "iframe" ,div );

      div = null;

      $iframe.hide();

      this.settings_ = {};
      this.$iframe_ = $iframe;

    };

    $.extend( IframeUploader.prototype,{

      /**
      * @param {jQuery} $form
      */
      setup:function( $form ){

        $form.attr( "target", this.$iframe_.attr("id") );
        this.$form_ = $form;
      },

      /**
      * @private
      */
      onload_:function(){

        var iframe = this.$iframe_.get(0),result,$body;
        doc = iframe.contentWindow.document;
        $body = $( doc.body );
        if( $body.find("pre").length )
          result = $body.find("pre").html();
        else
          result = $body.html();
        this.settings_.success && this.settings_.success( result );
        this.$iframe_.detach()
                     .off( "load" );
      },

      /**
      * @param {Object} settings
      * @param {String} settings.url
      * @param {functiuon} settings.success
      * @example
        uploader.send( {url:"/upload",success:function(){}} )
      */
      send:function( settings ){

        $.extend( this.settings_, settings );

        if( this.$form_ ){
          this.$iframe_
               .appendTo( $(document.body) )
               .on( "load", $.proxy( this.onload_, this ) )

          this.$form_.get(0).submit(); 
        }
      }

    });


    $.fn.extend({

      /**
      * @param {Object} opts
      */
      uploadForm:function( opts ){

        return this.each(function(){
          var $this = $(this),
              isForm = $this.get(0).tagName.toLowerCase() == "form";
              uploader = new IframeUploader();

          if( !isForm ) return ;

          uploader.setup( $this );
          uploader.send( opts );
        });
      }
    });
  }

})( jQuery );

