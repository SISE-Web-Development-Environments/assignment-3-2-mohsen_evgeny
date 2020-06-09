const axios = require("axios");
var express = require("express");

var router = express.Router();

const recipes_api_url = "https://api.spoonacular.com/recipes";
const api_key = "apiKey=2d8635a767a2424abafe91dfb9e635f3"; // kind of secret - usualy need to be in external file
//aa98be12b3104711bff1dcc28d9e4af0
function extractQueriesParams(query_params, search_params){
    const param_list = ["diet", "cuisine", "imtolerance"];
    //we change the original object that we got as a parameter...
    param_list.forEach((param) => {
        if(query_params[param]){
            search_params[param] = query_params[param];
        }
    });

    // console.log(search_params);
}

//first step of searching
async function searchRecipes(search_params){
    let search_response = await axios.get(
        `${recipes_api_url}/search?${api_key}`,
        {
            params: search_params,
        }
    );
    //search response
    const recipes_id_list = extractSearchResultsIds(search_response);
    // console.log(recipes_id_list);

    let info_array = await getRecipesInfo(recipes_id_list);

    // console.log("info_array: ", info_array);

    return info_array;
}

async function getRecipesInfo(recipes_id_list){
    let promises = [];
    //insert to the promise array the info of the recipes by id
    recipes_id_list.map((id) => 
        promises.push(axios.get(`${recipes_api_url}/${id}/information?${api_key}`))
    );

    let info_responce_1 = await Promise.all(promises);

    relevantRecipeData = extractRelevantRecipeData(info_responce_1);

    return relevantRecipeData;
}

function extractRelevantRecipeData(recipes_Info){
    return recipes_Info.map((recipes_Info) =>{
        const {
            id,
            title,
            readyInMinutes,
            aggregateLikes,
            vegetarian,
            vegan,
            glutenFree,
            image,
        } = recipes_Info.data;
        return{
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            aggregateLikes: aggregateLikes,
            vegetarian: vegetarian,
            vegan: vegan,
            glutenFree: glutenFree,
            image: image,
        }
    });
}
async function promiseAll(func, param_list){
    let promises = [];
    param_list.map((param) => promises.push(func(param)));
    let info_responce = await Promise.all(promises);

    return info_responce;
}

//get the id of the recipes
function extractSearchResultsIds(search_response){
    recipes_id_list = [];
    let recipes = search_response.data.results;

    recipes.map((recipe) => {
        console.log(recipe.title);
        recipes_id_list.push(recipe.id);
    });

    return recipes_id_list;
}

//--------------------------------- show Recipe ----------------------------

function extractFullRelevantRecipeData(recipes_Info){
    let  {
        id,
        title,
        readyInMinutes,
        aggregateLikes,
        vegetarian,
        vegan,
        glutenFree,
        image,
        servings,
        analyzedInstructions,
        extendedIngredients,
    } = recipes_Info.data;

    //return instructions with only step and number
    let instructionsFixed = analyzedInstructions[0].steps;

    for(let keyValue of instructionsFixed) {
        delete keyValue.ingredients;
        delete keyValue.equipment;
      }
    
    let ingredientsFixed =[];
    for(let keyValue of extendedIngredients) {
        ingredientsFixed.push(keyValue.originalString);
      }
    
    return{
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        aggregateLikes: aggregateLikes,
        vegetarian: vegetarian,
        vegan: vegan,
        glutenFree: glutenFree,
        image: image,
        servings: servings,
        instructions: instructionsFixed,
        ingredients: ingredientsFixed,
    }
    
}

async function getRecipe(recipeId){
    let fullResponse = await axios.get(`${recipes_api_url}/${recipeId}/information?${api_key}`);
    const response = extractFullRelevantRecipeData(fullResponse); //show relavent data 
        return response;
}


// -------------------- Random --------------------------
//return 3 of the 5 random results that all have instructions
function extractThreeRandomResults(search_response){
    recipes_id_list = [];
    let recipes = search_response.data.recipes;
    recipes.map((recipe) => {
        if(recipe.analyzedInstructions.length == 0){
            console.log(recipe.title);
        }else{
            recipes_id_list.push(recipe.id);
        }
    });

    return recipes_id_list.slice(0, 3);
}


//no parameters 
async function getRandomRecipes(){
    let search_response = await axios.get(
        `${recipes_api_url}/random?${api_key}`,
        {
            params:{
                number: 5, // to avoid an empty instruction recipes
            }
        }
    );
    const recipes_id_list = extractThreeRandomResults(search_response); // down to three

    let info_array = await getRecipesInfo(recipes_id_list);
    return info_array;
}


// ----------------------- Exports --------------------------------
exports.getRandomRecipes = getRandomRecipes;
exports.searchRecipes = searchRecipes;
exports.extractQueriesParams = extractQueriesParams;
exports.getRecipesInfo = getRecipesInfo;
exports.getRecipe = getRecipe;
