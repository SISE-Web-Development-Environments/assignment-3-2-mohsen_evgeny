//TODO: compelete !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var express = require("express");
var router = express.Router();
// const axios = require("axios");
// const api_domain = "https://api.spoonacular.com/recipes";
const search_util = require("./utils/search_recipes");

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
