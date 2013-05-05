
(function( $ ){


  if( typeof FormData != "undefined" && XMLHttpRequest != "undefined" ) {

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
                $( "input[type!='submit'],select,textarea", $this ).upload( url , opts );
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

        var iframe = this.$iframe_.get(0),result;
        doc = iframe.contentWindow.document;
        result = $( doc.body ).find("pre").html();
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

