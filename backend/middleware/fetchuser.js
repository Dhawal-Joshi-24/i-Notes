var jwt = require('jsonwebtoken');
const SCERET = "BolShree$GirirajDharan$Ki$Jai$"

const fetchuser =(req,res,next)=>{
   //Get the user from the jwt token and add id to required object 
   const token = req.header('auth-token');
   if(!token){
    res.status(401).send({error:"Please authenticate using of valid token"})
   }
   try {
       const data= jwt.verify(token,SCERET);
       req.id=data.id;
        next();
    
   } catch (error) {
    res.status(401).send({error:"Please authenticate using of valid token"})
   }
}

module.exports=fetchuser;