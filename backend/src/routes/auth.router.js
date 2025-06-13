import {Router} from 'express'
import { logOutUser, siginUpUser ,loginUser, updateProfile} from '../controllers/auth.controllers.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'

const router = Router()


router.route('/signup').post(siginUpUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logOutUser)


// profile route
router.route('/profile').put(protectedRoute , updateProfile)

// check user is authenticated or not
router.route('/check').get(protectedRoute , (req,res) =>{
    try {
        return res.status(200).json({
            message : "User is auhtneticated",
            user : req.user,
        })
    } catch (error) {
        console.log("Error in checking user authentication",error);
        return res.status(500).json({
            message :"Internal server error"
        })
        
    }
}) 

export default router