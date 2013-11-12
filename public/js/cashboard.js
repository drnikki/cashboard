// ************************************************************************* //
// ========================================================================= //
//
// Ca$h Money
//
// ========================================================================= //
// ************************************************************************* //

jQuery(document).ready(function($) {

    var gaData;
    var gaTemplate;

    var getGaData = $.ajax({
            url: 'data/googleanalytics'
        })
        .done(function(data){
            gaData = data;
            getGaTemplate();
        });

    function getGaTemplate() {
        $.ajax({
                url: 'js/templates/cashboard.html'
            })
            .done(function(data) {
                gaTemplate = data;
                renderGaTemplate();
            });
    }

    function renderGaTemplate() {
        var template = Hogan.compile(gaTemplate);
        var rendered = template.render(gaData.metrics[0]);
        console.log(gaData);
        $('body').append(rendered);
    }




});
