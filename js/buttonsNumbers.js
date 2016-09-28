/**
 * Created by smedina on 9/28/16.
 */

$('#buttonOne, #buttonTwo, #buttonThree, #buttonFor, #buttonFive, #buttonSix, #buttonSeven, #buttonEight, #buttonNine, #buttonZero').on('click', function () {
   $('#display').append( $(this).val() );
});
