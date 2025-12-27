// const userModel=require('../models/user.model');
// const jwt=require('jsonwebtoken');
// const bcrypt=require('bcryptjs');



// async function registerUser(req,res){
//     const {fullName:{firstName,lastName},email,password}=req.body;
//     const isUserExist=await userModel.findOne({
//         email
//     });
//     const hashPassword=await bcrypt.hash(password,10);//

//     if(isUserExist){
//         return res.status(400).json({
//             message:"user already exists"
//         })
//     }
//     const user= await userModel.create({
//         fullName:{
//             firstName,
//             lastName
//         },
//         email,
//         password:hashPassword


//     })
//     const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
//     res.cookie("token",token);
//     res.status(201).json({
//         message:"user registered successfully",
//         user:{
//             email:user.email,
//             _id:user._id,
//             fullName:user.fullName
//         }
//     })





// }

// async function loginUser(req,res){
//     const {email,password}=req.body;
//     const user= await userModel.findOne({
//         email
//     })
//     if(!user){
//         return res.status(400).json({
//             message:"Invalid email or password"
//         })
//     }
//     const isPasswordValid=await bcrypt.compare(password,user.password);
//     if(!isPasswordValid){
//         return res.status(400).json({
//             message:"Invalid email or password"
//         })
//     }
//     const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
//     res.cookie("token",token);
//     res.status(200).json({
//         message:"user logged in successfully",
//         user:{
//             email:user.email,
//             _id:user._id,
//             fullName:user.fullName
//         }

//     })






// }







// module.exports={registerUser,loginUser};


const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // true in production
};

async function registerUser(req, res) {
  const { fullName: { firstName, lastName }, email, password } = req.body;

  const isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName: { firstName, lastName },
    email,
    password: hashPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, cookieOptions);
  res.status(201).json({
    message: "User registered successfully",
    user: {
      email: user.email,
      _id: user._id,
      fullName: user.fullName,
    },
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    message: "User logged in successfully",
    user: {
      email: user.email,
      _id: user._id,
      fullName: user.fullName,
    },
  });
}

function logoutUser(req, res) {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
