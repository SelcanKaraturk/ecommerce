CKEDITOR.dialog.add( 'videoDialog', function( editor ) {
    return {
        title: 'Youtube Video Ekleme',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                        type: 'text',
                        id: 'title',
                        label: 'Youtube Video ID',
                        validate: CKEDITOR.dialog.validate.notEmpty( "Bu Alanı Boş Bırakamazsın!" )
                    }
                ]
            }
        ],
        onOk: function() {
            var dialog = this;

            var abbr = editor.document.createElement( 'iframe' );
            abbr.setAttribute( 'src', 'https://www.youtube.com/embed/'+dialog.getValueOf( 'tab-basic', 'title' ) );
            abbr.setAttribute( 'width', '100%' );
            abbr.setAttribute( 'height', '450' );


            editor.insertElement( abbr );
        }
    };
});
