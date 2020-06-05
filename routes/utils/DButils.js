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
  .catch((err) => console.log(err));


// -------------------- call DB ---------------------
exports.execQuery = async function (query) {
  await poolConnect;
  try {
    var result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
    throw err;
  }
};

//---------------------- DB queries ---------------------------------
exports.getUserIdByName = async function (username){
  return await this.execQuery( `SELECT UserId FROM [Login] WHERE UserName = '${username}'`);
}

// exports.getUserIdByName = async function (username){
//   return await this.execQuery( `SELECT UserId FROM [Login] WHERE UserName = '${username}'`);
// }

// exports.getUserId = async function getUserId(username){
//   return await this.execQuery( `SELECT UserId FROM [Login] WHERE UserName = '${username}'`);
// }

// SELECT * FROM UserRecipe WHERE UserName = '${username}'  and RecipeId =
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

exports.getUserFavoriteRecipes = async function (userId){ // TODO : change
  //select RecipeApiId from [dbo].[UserRecipe] where UserId = 'f6d161fa-9578-46c9-b6a6-ee2d0a531b0c' and isSaved = 1
  let result = await this.execQuery( `select RecipeApiId from [UserRecipe] where UserId = '${userId}' and isSaved = 1`);
  let info = [];
  //console.log(result);
  for(let id of result) {
    //{key:"key", value:"value"}
    info.push(id.RecipeApiId);
  }
  //console.log(info);
  return info;
}

exports.getUserPersonalRecipes = async function (userId){ // TODO : change
  //select RecipeApiId from [dbo].[UserRecipe] where UserId = 'f6d161fa-9578-46c9-b6a6-ee2d0a531b0c' and isSaved = 1
  let result = await this.execQuery( `select RecipeApiId from [GeneralRecipe] where UserId = '${userId}'`);
  let info = [];
  //console.log(result);
  for(let id of result) {
    //{key:"key", value:"value"}
    info.push(id.RecipeApiId);
  }
  //console.log(info);
  return info;
}

//exports.getUserInfoOnRecipes = getUserInfoOnRecipes;

// process.on("SIGINT", function () {
//   if (pool) {
//     pool.close(() => console.log("connection pool closed"));
//   }
// });

// poolConnect.then(() => {
//   console.log("pool closed");

//   return sql.close();
// });

// exports.execQuery = function (query) {
//   return new Promise((resolve, reject) => {
//     sql
//       .connect(config)
//       .then((pool) => {
//         return pool.request().query(query);
//       })
//       .then((result) => {
//         // console.log(result);
//         sql.close();
//         resolve(result.recordsets[0]);
//       })
//       .catch((err) => {
//         // ... error checks
//       });
//   });
// };
