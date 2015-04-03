module.exports = function(app) {
  app.use(function(req, res, next){
      res.status(404).render('erro404', { url: req.url ,title : "Página não encontrada"});
  });


  app.use(function(err, req, res, next) {
      res.status(500);
      res.render('erro500', {title : "Erro interno"});
  });
}