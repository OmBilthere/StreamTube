import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req , res) =>{
    
    const {fullName , email , username , password} = req.body;
    
    if([fullName , email , username , password].some((field)=>field?.trim()==="")) {

        throw new ApiError(400 , "All fields is required")
    }
   const existedUser = await User.findOne({

        $or:[{username}, {email}]

  })  

    if(existedUser) {
        throw new ApiError(409 , "user with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400 , "Avatar not found");
    }

   let coverImageLocalPath;

   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      
    coverImageLocalPath = req.files.coverImage[0].path

   }

   const avatar = await uploadCloudinary(avatarLocalPath);

   const coverImage = await uploadCloudinary(coverImageLocalPath);


   
   if(!avatar) {

    throw new ApiError(400 , "Avatar not found");

   }

  const user =  await  User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()

   })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if(!createdUser) {

    throw new ApiError(500 , "Server Error")

   }

   return res.status(201).json(
    new ApiResponse(200 , createdUser , "User registered Successfully !!!" )
   )
    
//    console.log("...");
})


export {registerUser,}


// step 1 take name email , password and all input required like profile avtar
// step 2 validation - not empty and others(check for image avtar)
// step 3 upload on cloudnary for avtar also for multer 
// step 4 send a database req to store it after making user object
// step 5 remove password and refresh token field from response
// step 6 check for user creation 
// step 7 return response   