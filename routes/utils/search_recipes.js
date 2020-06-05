const axios = require("axios");
var express = require("express");

var router = express.Router();

const recipes_api_url = "https://api.spoonacular.com/recipes";
const api_key = "apiKey=aa98be12b3104711bff1dcc28d9e4af0"; // kind of secret - usualy need to be in external file

function extractQueriesParams(query_params, search_params){
    const param_list = ["diet", "cuisine", "imtolerance"];
    //we change the original object that we got as a parameter...
    param_list.forEach((param) => {
        if(query_params[param]){
            search_params[param] = query_params[param];
        }
    });

    console.log(search_params);
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
    console.log(recipes_id_list);

    let info_array = await getRecipesInfo(recipes_id_list);

    console.log("info_array: ", info_array);

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

exports.searchRecipes = searchRecipes;
exports.extractQueriesParams = extractQueriesParams;