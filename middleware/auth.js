const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {

  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.header("authorization").split(" ")[1];
  }
   
  if (!token) {
    return res.status(401).json({ msg: "Token not found" });
  }
  try {
    const verifiedDecodedToken = jwt.verify(token, config.get("SecretKey"));
    req.user = verifiedDecodedToken.user;
    next();
  } catch (errors) {
    res.status(500).json({ msg: "Internal server error" });
    console.log(errors.message);
  }
};

