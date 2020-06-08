var express = require("express");
var router = express.Router();

const search_recipe_util = require("./utils/search_recipes");

// --------------------------- EndPoints ------------------------------
router.use((req,res,next) =>{
  console.log("Recipes route!");
  next();
});

router.get("/search/query/:searchQuery/amount/:num", 
(req, res) =>{
    const {searchQuery, num} = req.params;
    search_params = {};
    search_params.query = searchQuery;
    search_params.number = num;
    search_params.instructionRequired = true;

    //checks if params is valid
    // console.log(req.query);

    search_recipe_util.extractQueriesParams(req.query, search_params);

    search_recipe_util
      .searchRecipes(search_params)
      .then((info_array) => res.send(info_array))
      .catch((error) => { 
        // console.log(error);
        res.sendStatus(500);
      });
});


router.get("/random", 
async (req, res, next) =>{
  try{
    let randomRecipes = await search_recipe_util.getRandomRecipes();
    res.send(randomRecipes);
  }catch(error){
    next(error);
  }
    
});

//recipe Page
router.get("/show/:recipeID", 
async (req, res, next) =>{
  try{
    let showRecipes = await search_recipe_util.getRecipe(req.params.recipeID);
    res.send(showRecipes);
  }catch(error){
    next(error);
  }
    
});

module.exports = router;
