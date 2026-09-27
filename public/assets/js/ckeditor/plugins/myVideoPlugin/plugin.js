CKEDITOR.plugins.add( 'myVideoPlugin', {
    icons: 'youtube',
    init: function( editor ) {
        editor.addCommand( 'insertVideo', new CKEDITOR.dialogCommand( 'videoDialog' ) );

        editor.ui.addButton( 'youtube', {
            label: 'Youtube Video Ekle',
            command: 'insertVideo',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add( 'videoDialog', this.path + 'dialogs/videodialog.js' );
    }
});
