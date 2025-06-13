import mongoose ,{Schema} from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const useSchema = new Schema(
    {
        email : {
            type : String ,
            required : true,
            unique : true
        },
        fullname : {
            type:String,
            required : true
        },
        password : {
            type : String,
            required : true,
            minlength : 6
        },
        profile :{
            type :String,
            default : ''
        },

    },{timestamps : true}
)

useSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // if password is not modified,skip hashing
    // if password is modified , hash it
    // using bcrypt to hash the password
    // 10 is the sailt rounds
    // the highre the number , the more secure it is but also the slower it is
    this.password = await bcrypt.hash(this.password , 10);
    next(); 
})


// is password correct 

useSchema.methods.isPaaswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}


// genrate jwt token

useSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id }, 
        process.env.ACCESS_TOKEN_SECRET,
         {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY  // token will expire in 1 day
    });
}

export const User = mongoose.model("User",useSchema)