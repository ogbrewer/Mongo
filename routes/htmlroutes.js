const db = require("../models");
module.exports = app => {
  // Load saved articles page
  app.get("/savedArticles", (req, res) => res.render("savedArticles"));

  // Load main page
  app.get("/main", (req, res) => res.render("main"));

  // Load profile page
  

  app.get("/games", (req, res) => res.render("games"));

  app.get("/interest", (req, res) => res.render("interest"));

  app.get("/players", (req, res) => res.render("players"));

  app.get("/rosters/:team", (req, res) => {
    db.sequelize.query("SELECT * FROM OWLplayers WHERE team = ?",
    { replacements: [req.params.team],
      type: db.sequelize.QueryTypes.SELECT
    }).then(data => {
      const hbsObject = {
        teams: data
      };
      console.log(req.params.team)
      res.render("teamsview", hbsObject);
    });

  });

  app.get("/playerOne/:name", (req, res) => res.render("Players/playerOne", { name: req.params.name }));

  app.get("/overwatch", (req, res) => res.render("overwatch"));
  app.get("/CS:GO", (req, res) => res.render("CS:GO"));


  // Load example page and pass in an example by id

  // Render 404 page for any unmatched routes
  app.get("*", (req, res) => res.render("404"));
};
