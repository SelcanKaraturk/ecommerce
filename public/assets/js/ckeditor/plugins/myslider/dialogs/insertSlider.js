CKEDITOR.dialog.add( 'SliderDialog', function( editor ) {
    return {
        title: 'Abbreviation Properties',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'resimekle',
                label: 'Resim Ayarları',
                elements: [
                  {
                      type: 'text',
                      id: 'url',
                      label: 'Resim Url',
                      validate: CKEDITOR.dialog.validate.notEmpty( "URL Boş Bırakılamaz" )
                  },
                  {
                        type: 'text',
                        id: 'baslik',
                        label: 'Resim Başlık'
                  }

                ]
            }
        ],
        onOk: function() {
            var dialog = this;
            var abbr = editor.document.createElement( 'img' );
            var div = editor.document.createElement( 'div' );
            div.setAttribute( 'class', 'swiper-container' );
            abbr.setAttribute( 'src', dialog.getValueOf( 'resimekle', 'url' ) );
            abbr.setAttribute( 'alt', dialog.getValueOf( 'resimekle', 'baslik' ) );
            editor.document.getElementsByClassName("swiper-container").appendChild(abbr);
            editor.insertElement( div );

        }
    };
});
