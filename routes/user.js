const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const UserModel = require("../model/UserModel");
const { check, validationResult } = require("express-validator");
const { json } = require("express/lib/response");
const auth = require("../middleware/auth");

const upload = require('../middleware/upload')

/** User Registration Route */
router.post(
  "/",
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const { name, email, password, phone } = req.body;

    try {
      /**Check if user already exists */
      let user = await UserModel.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ success: false, msg: "Email already taken" });
      }
      /** Add new user */
      user = new UserModel({
        name,
        email,
        phone,
        password,
      });
      /**Password hash using bcrypt */
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      /**Setting up jsonweb token */
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("SecretKey"),
        {
          expiresIn: config.get("Timeout"),
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token: token,
            success: true,
            msg: "Registration Successful",
          });
        }
      );
    } catch (errors) {
      res.status(500).json({ msg: "Internal server error", success: false });
      console.log(errors.message);
    }
  }
);

//Update Profile
router.put("/", auth, async (req, res) => {

  const { name, email, phone } = req.body;
  const empData = {};
  if (name) empData.name = name;
  if (email) empData.email = email;
  if (phone) empData.phone = phone;

  console.log(req.body);

  try {
    let user = await UserModel.findById(req.user.id);
    // console.log(user);
    if (!user) {
      return res.status(404).json({ msg: "User not found", success: false });
    }
    user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { $set: empData },
      { new: true }
    );
    // console.log(user);
    res.status(200).json({ msg: "Profile Updated", data: user });
  } catch (errors) {
    res.status(500).json({ msg: "Internal server error", success: false });
    console.log(errors.message);
  }
});

//Delete user profile
router.delete("/", async (req, res) => {
  try {
    let user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found", success: false });
    }
    await UserModel.findByIdAndDelete(req.user.id);
    res.status(200).json({ msg: "Profile deleted" });
  } catch (errors) {
    res.status(500).json({ msg: "Internal server error", success: false });
    console.log(errors.message);
  }
});

//Update Password
router.post('/update_password', auth, async (req, res) => {

  const { oldPassword, newPassword } = req.body;
  try {
    const user = await UserModel.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password doesnot match", success: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword,salt);
    await UserModel.findByIdAndUpdate(req.user.id, {
      password: hashedPassword
    },{new:true});

    res.status(200).json({ msg: 'Password Udated', success: true });
    console.log("Password Updated");
  } catch (errors) {
    console.log(errors.message);
    res.status(500).json({ msg: 'Internal Server Error', success: false });
  }

});


router.post('/uploads/:id',upload.single('photo'),(req,res)=>{
    
  console.log(req.file)
  if(req.file===undefined){
      res.status(400).json({success:false});
  }else{
      const  photo = req.file.filename;
  UserModel.findByIdAndUpdate({_id:req.params.id},{photo:photo}).then((photo)=>{
      console.log(photo);
      res.status(200).json({success:true});
  }).catch((ex)=>{
      res.status(501).json({success:false});

  })
  }
});

router.put("/profile/update/:id", (req, res) => {
  User.findByIdAndUpdate({_id:req.params.id},req.body).then((user)=>{
    Object.keys(req.body).forEach(key => {
       
        
        if (key == "password")
            user[key] = bcryptjs.hashSync(req.body[key], 10);
        else
            user[key] = req.body[key];
    });
    user.save()
        .then(user => {
            res.send({ success: true, data:user });
        })
        .catch(e => {
            res.status(500).send({ success: false });
        });
})
});

module.exports = router;
