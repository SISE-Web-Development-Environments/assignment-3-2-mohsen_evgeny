//TODO: compelete !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
    console.log(req.query);

    search_recipe_util.extractQueriesParams(req.query, search_params);

    search_recipe_util
      .searchRecipes(search_params)
      .then((info_array) => res.send(info_array))
      .catch((error) => { 
        console.log(error);
        res.sendStatus(500);
      });
});


router.get("/random", 
async (req, res) =>{
    let randomRecipes = await search_recipe_util.getRandomRecipes();
    res.send(randomRecipes);
});

// router.get("/Information", async (req, res, next) => {
//   try {
//     const recipe = await getRecipeInfo(req.query.recipe_id);
//     res.send({ data: recipe.data });
//   } catch (error) {
//     next(error);
//   }
// });

// //#region example1 - make serach endpoint
// router.get("/search", async (req, res, next) => {
//   try {
//     const { query, cuisine, diet, intolerances, number } = req.query;
//     const search_response = await axios.get(`${api_domain}/search`, {
//       params: {
//         query: query,
//         cuisine: cuisine,
//         diet: diet,
//         intolerances: intolerances,
//         number: number,
//         instructionsRequired: true,
//         apiKey: process.env.spooncular_apiKey
//       }
//     });
//     let recipes = await Promise.all(
//       search_response.data.results.map((recipe_raw) =>
//         getRecipeInfo(recipe_raw.id)
//       )
//     );
//     recipes = recipes.map((recipe) => recipe.data);
//     res.send({ data: recipes });
//   } catch (error) {
//     next(error);
//   }
// });
// //#endregion

// function getRecipeInfo(id) {
//   return axios.get(`${api_domain}/${id}/information`, {
//     params: {
//       includeNutrition: false,
//       apiKey: process.env.spooncular_apiKey
//     }
//   });
// }

module.exports = router;
