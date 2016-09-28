/**
 * Created by smedina on 9/28/16.
 */

$( document ).ready( function() {
    $('#display').text(function ( index, currentText ) {
        return currentText.substr(0, 8);
    });
});