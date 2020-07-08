var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const search_recipes = require("./utils/search_recipes");

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

router.get("/recipeInfo/:ids",
 async (req, res, next) => {
  try{
      //using JSON parse to get array of integers instead of array of strings
    const ids = JSON.parse(req.params.ids);
    const user_id = req.user;
    // console.log(ids, user_id);
    const userRecipesData = await DButils.getUserInfoOnRecipes(user_id, ids); 
    res.send(userRecipesData);
  }catch(error){
    next(error);
  }
});


router.get('/favorites', 
 async (req, res, next) => {
  try{
    const user = req.user;
    const userFavoriteRecipesIds = await DButils.getUserFavoriteRecipes(user); // return a list of recipe id
    const userFavoriteRecipes = await search_recipes.getRecipesInfo(userFavoriteRecipesIds); // return the full info of each recipe 
    res.send(userFavoriteRecipes);
  }catch(error){
    next(error);
  }
});

router.get('/myrecipes',
 async (req, res, next) => {
  try{
    const user = req.user;
    const userPersonalRecipesIds = await DButils.getUserPersonalRecipes(user);
    res.send(userPersonalRecipesIds);  
  }catch(error){
    next(error);
  }
  
});


// req.body: {"isSaved": "0/1"}
router.post("/recipeInfo/add/:id",
 async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const isSaved = req.body.isSaved;

    // console.log(id, user, isSaved);
    await DButils.setUserInfoOnRecipes(user, id, isSaved);
    res.status(201).send({ message: "recipe info for user is inserted", success: true });
  } 
  catch (error) {
    next(error);
  }
});

// req.body: {"isSaved": "0/1"}
router.put("/recipeInfo/update/:id",
 async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const isSaved = req.body.isSaved;

    // console.log(id, user, isSaved);
    await DButils.updateUserInfoOnRecipes(user, id, isSaved);
    res.status(201).send({ message: "recipe info for user is updated", success: true });
  } 
  catch (error) {
    next(error);
  }
});

router.get("/watched",
 async (req, res, next) => {
  try{
    const user = req.user;
    const recipeIds = await DButils.getThreeLastWatchedIds(user);
  
    let watchedWithGeneralDetails = await search_recipes.getRecipesInfo(recipeIds);
    res.send(watchedWithGeneralDetails);
  }catch(error){
    next(error);
  }
  
});

router.get("/family",
 async (req, res, next) => {
  try{
    const user = req.user;
    const familyRecipes = await DButils.getFamilyRecipes(user);
    res.send(familyRecipes);
  }catch(error){
    next(error);
  }
  
});

//personal recipe details (as show/apiId)
router.get("/getPersonalRecipeInfo/:recipeID", 
async (req, res, next) =>{
  try{
    // get all info about the recipe from DB
    let info = await DButils.getRecipePreInfoDb(req.params.recipeID);
    let ingredients = await DButils.getIngredientsDb(req.params.recipeID);
    let instructions = await DButils.getInstructionsDb(req.params.recipeID);

    // change format of ingredients like in show/apiId
    let ingredientsStrings = [];

    for(let i = 0; i < ingredients.length; i++){
      let amountIngredientStr = ingredients[i].amount + " " + ingredients[i].ingredient;
      ingredientsStrings[i] = amountIngredientStr;
    }

    // get array/json of all info
    info[0]['instructions'] = [];
    info[0]['ingredients'] = [];
    info[0]['instructions'].push(instructions);
    info[0]['ingredients'].push(ingredientsStrings);

    res.send(info);
  }catch(error){
    next(error);
  }
    
});

module.exports = router;
