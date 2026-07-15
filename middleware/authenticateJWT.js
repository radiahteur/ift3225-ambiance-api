// Middleware d'authentification JWT.
// Vérifie le token envoyé par un utilisateur connecté.

const jwt = require('jsonwebtoken');


function authenticateJWT(req, res, next) {

    const authHeader = req.header('Authorization');


    if (!authHeader) {
        return res.status(401).json({
            success:false,
            error:{
                code:"MISSING_TOKEN",
                message:"Authorization token missing"
            }
        });
    }


    // Format attendu :
    // Authorization: Bearer token
    const parts = authHeader.split(' ');


    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            success:false,
            error:{
                code:"INVALID_TOKEN_FORMAT",
                message:"Expected Bearer token"
            }
        });
    }


    const token = parts[1];


    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        req.user = decoded;


        next();


    } catch(error) {

        return res.status(403).json({
            success:false,
            error:{
                code:"INVALID_TOKEN",
                message:"Token invalid or expired"
            }
        });

    }

}


module.exports = authenticateJWT;