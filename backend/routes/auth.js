const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


const SCERET = "BolShree$GirirajDharan$Ki$Jai$"

//Route 1 : Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email id').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 }),
], async (req, res) => {
    let success=false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success=false;
        return res.status(400).json({ success,errors: errors.array() });
    }
    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            success=false;
            return res.status(400).json({ success,error: "Sorry a user with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });

        const data = {
            id: user.id
        }

        const authTok = jwt.sign(data, SCERET);
        success=true;
        res.json({success, authtoken: authTok })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }
})

//Route 2 : Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid email id').isEmail(),
    body('password', 'Password cannot be Blank').exists()

], async (req, res) => {
    let success=false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success=false;
            return res.status(400).json({success,error: "Please try to login using correct credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success=false;
            return res.status(400).json({ success,error: "Please try to login using correct credentials" });
            
        }

        const data = {
            id: user.id
        }

        const authTok = jwt.sign(data, SCERET);
        success=true;
        res.json({ success,authtoken: authTok })


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }
});

//Route 3 : Get login  User details using: POST "/api/auth/getuser".login required
router.post('/getuser',fetchuser, async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }
})
module.exports = router