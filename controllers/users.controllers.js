

const User = require('../models/users');
const Observation = require('../models/observations');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Création d'un compte utilisateur
async function register(req,res,next){

    try{

        const {
            username,
            email,
            password
        } = req.body;


        const existingUser = await User.findOne({
            email
        });


        if(existingUser){

            return res.status(400).json({
                success:false,
                error:{
                    code:"EMAIL_EXISTS",
                    message:"Email already used"
                }
            });

        }


        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        const user = await User.create({

            username,

            email,

            password:hashedPassword

        });


        res.status(201).json({

            success:true,

            data:{
                id:user._id,
                username:user.username,
                email:user.email
            }

        });


    }catch(error){

        next(error);

    }

}



// Connexion utilisateur
async function login(req,res,next){

    try{

        const {
            email,
            password
        } = req.body;


        const user = await User.findOne({
            email
        });


        if(!user){

            return res.status(401).json({
                success:false,
                error:{
                    code:"INVALID_LOGIN",
                    message:"Invalid email or password"
                }
            });

        }


        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );


        if(!validPassword){

            return res.status(401).json({
                success:false,
                error:{
                    code:"INVALID_LOGIN",
                    message:"Invalid email or password"
                }
            });

        }


        const token = jwt.sign(

            {
                id:user._id,
                email:user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"24h"
            }

        );


        res.json({

            success:true,

            data:{
                token
            }

        });


    }catch(error){

        next(error);

    }

}



// Informations de l'utilisateur connecté
async function getMe(req,res,next){

    try{


        const user = await User.findById(
            req.user.id
        )
        .populate("favorites");


        if(!user){

            return res.status(404).json({
                success:false,
                error:{
                    code:"USER_NOT_FOUND",
                    message:"User not found"
                }
            });

        }


        res.json({

            success:true,

            data:{
                id:user._id,
                username:user.username,
                email:user.email,
                favorites:user.favorites
            }

        });


    }catch(error){

        next(error);

    }

}



// Observations envoyées par l'utilisateur
async function getMyObservations(req,res,next){

    try{


        const observations =
            await Observation.find({
                author:req.user.id
            })
            .sort({
                timestamp:-1
            });


        res.json({

            success:true,

            count:observations.length,

            data:observations

        });


    }catch(error){

        next(error);

    }

}



module.exports = {

    register,
    login,
    getMe,
    getMyObservations

};