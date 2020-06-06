var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const search_recipe_util = require("./utils/search_recipes");
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
  const user = req.user;
  console.log(ids, user_id);
  const userRecipesData = await DButils.getUserInfoOnRecipes(user, ids);  
  res.send(userRecipesData);
});


// req.body: {"isSaved": "0/1"}
router.post("/recipeInfo/:ids", async (req, res, next) => {
  try {
    const id = req.params.ids;
    const user = req.user;
    const isSaved = req.body.isSaved;

    console.log(id, user_id, isSaved);
    await DButils.setUserInfoOnRecipes(user, id, isSaved);
    res.status(201).send({ message: "recipe info for user is inserted", success: true });
  } 
  catch (error) {
    next(error);
  }
});

// req.body: {"isSaved": "0/1"}
router.put("/recipeInfo/:ids", async (req, res) => {
  try {
    const id = req.params.ids;
    const user = req.user;
    const isSaved = req.body.isSaved;

    console.log(id, user_id, isSaved);
    await DButils.updateUserInfoOnRecipes(user, id, isSaved);
    res.status(201).send({ message: "recipe info for user is updated", success: true });
  } 
  catch (error) {
    next(error);
  }
});

router.get("/watched", async (req, res) => {
  const user = req.user;
  const recipeIds = await DButils.getThreeLastWatchedIds(user);

  let watchedWithDetails = await search_recipe_util.getRecipesInfo(recipeIds);
  res.send(watchedWithDetails);
});

module.exports = router;
