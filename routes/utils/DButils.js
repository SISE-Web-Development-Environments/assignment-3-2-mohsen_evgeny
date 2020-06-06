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

exports.setUserInfoOnRecipes = async function(user, id, isSaved){
  await this.execQuery(`INSERT INTO UserRecipe VALUES(CONVERT(uniqueidentifier, '${user[0].UserId}'), '${id}', '1', '${isSaved}', GETDATE())`);
}

exports.updateUserInfoOnRecipes = async function(user, id, isSaved){
  await this.execQuery(`UPDATE UserRecipe SET isSaved = '${isSaved}', WatchDate = GETDATE() WHERE UserId = CONVERT(uniqueidentifier, '${user[0].UserId}') and RecipeApiId = '${id}'`);
}

exports.getThreeLastWatchedIds = async function(user){
  let ids = [];
  let rawIds = await this.execQuery(`SELECT top 3 RecipeApiId from UserRecipe where UserId = CONVERT(uniqueidentifier, 'F6D161FA-9578-46C9-B6A6-EE2D0A531B0C') ORDER BY WatchDate DESC`);

  rawIds.map((rawId) =>{
    ids.push(rawId.RecipeApiId);
  });

  return ids;
}

