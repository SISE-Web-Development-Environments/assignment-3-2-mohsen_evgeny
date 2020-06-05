var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const bcrypt = require("bcrypt");

// ------------------- Authentication - middleware - using cookie ------------------
router.use(async (req, res, next) =>{
  if(req.session && req.session.user_id){
    const id = req.session.user_id;
    const user = await DButils.getUserIdByName(id);
    if(user){
      req.user = user;
      next(); // if true go to the next relative endpoint
    }
  }else res.sendStatus(401);
});

//--------------------- EndPoints ----------------------

router.get("/recipeInfo/:ids", async (req, res) => {
  //using JSON parse to get array of integers instead of array of strings
  const ids = JSON.parse(req.params.ids);
  const user_id = req.user;
  console.log(ids, user_id);
  const userRecipesData = await DButils.getUserInfoOnRecipes(user_id, ids); // TODO: build function - go to DB and get foreach id if the user (watched, saved) 
  res.send(userRecipesData);
});

module.exports = router;
