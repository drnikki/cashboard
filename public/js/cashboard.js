// ************************************************************************* //
// ========================================================================= //
//
// Ca$h Money
//
// ========================================================================= //
// ************************************************************************* //

jQuery(document).ready(function($) {

    function makeGoogle() {

        var getGaData = $.ajax({
            url: 'data/googleanalytics'
        });

        var getGaTemplate = $.ajax({
            url: 'js/templates/cashboard.html'
        });

        $.when(getGaData, getGaTemplate)
            .done(function (gaData, gaTemplate) {
                var template = Hogan.compile(gaTemplate[0]);
                var rendered = template.render(gaData[0].metrics[0]);
                console.log(gaData);
                $('body').append(rendered);
            });
    }

    function init() {
        makeGoogle();
    }

    init();

});
