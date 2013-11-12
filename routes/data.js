

exports.data = function(req, res){
    console.log('data');
    res.render('data', {
        title: 'Data'
    });
};