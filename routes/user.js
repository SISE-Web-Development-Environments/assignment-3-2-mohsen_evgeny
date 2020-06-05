var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const bcrypt = require("bcrypt");

// ------------------- Authentication - middleware - using cookie ------------------
router.use((req, res, next) =>{
  if(req.session && req.session.user_id){
    const id = req.session.user_id;
    const user =  DButils.checkUserNameOnDb(id); 
    if(user){
      req.user = user;
      next(); // if true go to the next relative endpoint
    }
  }else res.sendStatus(401);
});

//--------------------- EndPoints ----------------------

router.get("/alive", (req, res) => {
  res.send("I'm alive")
});

router.get("/recipeInfo/:ids", (req, res) => {
  //using JSON parse to get array of integers instead of array of strings
  const ids = JSON.parse(req.params.ids);
  const user_name = req.user;
  console.log(ids, user_name);
  const userRecipesData = getUserInfoOnRecipes(user_name, ids); //TODO: build function - go to DB and get foreach id if the user (watched, saved) 
  res.send(userRecipesData);
});

module.exports = router;
