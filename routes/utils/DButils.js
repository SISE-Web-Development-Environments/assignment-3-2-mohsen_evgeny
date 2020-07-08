require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.tedious_userName,
  password: process.env.tedious_password,
  server: process.env.tedious_server,
  database: process.env.tedious_database,
  connectionTimeout: 1500000,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool
  .connect()
  .then(() => console.log("new connection pool Created"))
  .catch((err) => console.log("Bad SQL request"));


// -------------------- call DB ---------------------
exports.execQuery = async function (query) {
  await poolConnect;
  try {
    var result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL error");
  }
};

//---------------------- DB queries ---------------------------------
exports.getUserIdByName = async function (username){
  return await this.execQuery( `SELECT UserId FROM [Login] WHERE UserName = '${username}'`);
}

exports.getUserInfoOnRecipes = async function(user, ids){
  let info = [];
  
  for(let id of ids) {
    let query = `SELECT * FROM UserRecipe WHERE UserId = CONVERT(uniqueidentifier, '${user[0].UserId}') and RecipeApiId = '${id}'`;
    let queryResult = await this.execQuery(query);

    //{key:"key", value:"value"}
    info.push({[id]: {watched: queryResult[0].isWatched, saved: queryResult[0].isSaved}});
  }

  return info;
}
// -------------------------------- Favorite -----------------------------------
exports.getUserFavoriteRecipes = async function (user){ 
  //select RecipeApiId from [dbo].[UserRecipe] where UserId = 'f6d161fa-9578-46c9-b6a6-ee2d0a531b0c' and isSaved = 1
  let result = await this.execQuery( `select RecipeApiId from [UserRecipe] where UserId = '${user[0].UserId}' and isSaved = 1`);
  let info = [];
  //console.log(result);
  for(let id of result) {
    info.push(id.RecipeApiId);
  }
  //console.log(info);
  return info;
}
// -------------------------------- Personal  -----------------------------------
exports.getUserPersonalRecipes = async function (user){ 
  let result = await this.execQuery( ` SELECT [Recipe].* FROM [Recipe] 
  FULL JOIN [FamilyRecipe] ON [Recipe].id = [FamilyRecipe].RecipeId
  WHERE [Recipe].AuthorUserId = '${user[0].UserId}' and [FamilyRecipe].UserId is NULL`);
  //console.log(result);
  for(let keyValue of result) {
    delete keyValue.AuthorUserId;
  }
  //console.log(info);
  return result;
}

// -------------------------------- Family  -----------------------------------
exports.getFamilyRecipes = async function (user){
  return await this.execQuery(`SELECT * FROM [FamilyRecipe] WHERE UserId = (CONVERT(uniqueidentifier, '${user[0].UserId}'))`);
}

//--------------------------------- get Instructions & Ingrediants ------------------------------------

exports.getIngredientsDb = async function (recipeId){
  return await this.execQuery(`select * from IngredientsRecipe where RecipeId ='${recipeId}'`);
}

exports.getInstructionsDb = async function (recipeId){
  return await this.execQuery(`select * from InstructionsRecipe where RecipeId ='${recipeId}'`);
}


// -------------------------------- set and update user recipe info -----------------------------------
exports.setUserInfoOnRecipes = async function(user, id, isSaved){
  await this.execQuery(`INSERT INTO UserRecipe VALUES(CONVERT(uniqueidentifier, '${user[0].UserId}'), '${id}', '1', '${isSaved}', GETDATE())`);
}

exports.updateUserInfoOnRecipes = async function(user, id, isSaved){
  await this.execQuery(`UPDATE UserRecipe SET isSaved = '${isSaved}', WatchDate = GETDATE() WHERE UserId = CONVERT(uniqueidentifier, '${user[0].UserId}') and RecipeApiId = '${id}'`);
}

// --------------------------------  3 watched -----------------------------------
exports.getThreeLastWatchedIds = async function(user){
  let ids = [];
  let rawIds = await this.execQuery(`SELECT top 3 RecipeApiId from UserRecipe where UserId = CONVERT(uniqueidentifier, '${user[0].UserId}') ORDER BY WatchDate DESC`);

  rawIds.map((rawId) =>{
    ids.push(rawId.RecipeApiId);
  });

  return ids;
}

