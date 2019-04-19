const express = require("express");

const router = express.Router();

// Import the model (Article.js) to use its database functions.
const Article = require("../models/Article.js");

// Create all our routes and set up logic within those routes where required.
router.get("/", (req, res) => {
  Article.all(data => {
    const hbsObject = {
      Articles: data
    };
    console.log(hbsObject);
    res.render("index", hbsObject);
  });
});

router.post("/models/articles", (req, res) => {
  Article.create(["name", "unsaved"], [req.body.name, req.body.unSaved], result => {
    // Send back the ID of the new quote
    res.json({ id: result.insertId });
  });
});

router.put("/api/Articles/:id", (req, res) => {
  const condition = "id = " + req.params.id;

  console.log("condition", condition);

  Article.update(
    {
      unSaved: req.body.unSaved
    },
    condition,
    result => {
      if (result.changedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();

    }
  );
});

// add a delete route to the Articles api
router.delete("/api/Articles/:id", (req, res) => {
  // call the Articles model 
  // to delete a Article by id 
  // respond back with data
  Article.delete("id", req.params.id, (data) => {
    res.json(data);
  });
});

// Export routes for server.js to use.
module.exports = router;
