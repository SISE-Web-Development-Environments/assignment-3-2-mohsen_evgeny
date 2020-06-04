var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const bcrypt = require("bcrypt");

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    //TODO: change table name 
    const users = await DButils.execQuery("SELECT UserName FROM [User]");

    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    //TODO: insert to Login table without password
    //,  '${req.body.profilephoto}'
    await DButils.execQuery(
      `INSERT INTO [User] VALUES ('${req.body.username}', '${req.body.firstname}' ,'${req.body.lastname}',  '${req.body.country}', 
      '${req.body.email}', '${req.body.image}')`
    );

    //TODO: insert to users table including password
    await DButils.execQuery(
      `INSERT INTO [Login] VALUES ('${req.body.username}', '${hash_password}')`
    );
    console.log(users);
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    // check that username exists
    const users = await DButils.execQuery("SELECT UserName FROM [User]");
    if (!users.find(x => x.UserName === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM [Login] WHERE UserName = '${req.body.username}'`
      )
    )[0]; ///????????????

    if (!bcrypt.compareSync(req.body.password, user.Password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;
    // req.session.save();
    // res.cookie(session_options.cookieName, user.user_id, cookies_options);

    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});


//Default router --- not found
router.use((req, res) => {
  res.sendStatus(404);
});
module.exports = router;
