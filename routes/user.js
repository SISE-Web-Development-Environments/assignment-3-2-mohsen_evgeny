var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const bcrypt = require("bcrypt");

// ------------------- Authentication - using cookie ------------------
router.use((req, res, next) =>{
  if(req.session && req.session.user_id){
    const id = req.session.user_id;
    const user =  DButils.checkUserNameOnDb(id); 
    if(user){
      req.user = user;
      return next(); // if true go to the next relative endpoint
    }
  }
  res.sendStatus(401);
});

//--------------------- EndPoints ----------------------

router.get("/alive", (req, res) => {
  res.send("I'm alive")
});

router.get("/user/recipeInfo/{ids}", (req, res) => {
  const ids = req.params.ids;
  const user_name = req.user;
  getUserInfoOnRecipes(user_name, ids); // TODO: build function 
});

module.exports = router;
