const userModel = require('../model/userModel');

const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtkey, { expiresIn: '10d' });
}

const registerUser = async(req, res) => {
    try {
        // Get our schema objects from the body
        const { name, email, password } = req.body;

        // Find a user with a unique email address
        let user = await userModel.findOne({ email })

        // To check if the user with the email address exist
        if (user) {
        res.status(400).json({error: 'Ooops... A user with this email address already exist'});
            return;
        }

        // To require all the objects in this field
        if (!name || !email || !password) {
        res.status(400).json({error: 'All fields are required'});
            return;
        }

        //  validating the user email adddress
        if (!validator.isEmail(email)) {
            res.status(400).json({error: 'This email address is an invalid email adrdess'});
            return;
        }

        // validating the user password
        if (!validator.isStrongPassword(password)) {
            res.status(400).json({error: 'Password must be a strong password'});
            return;
        }

         // Creating a new user
         user = new userModel({ name, email, password });


        // Hashing our password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        // Saving our user database(s)
       const saveUser = await user.save();

        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, name: user.name, email, token })
    } catch(e) {
        res.status(500).json(e);
        console.error(new Error(e));
    }
}

module.exports = { registerUser }