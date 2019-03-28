// *******************************************************************
// ###################################################################
// USER BODY MODEL
// {
//     email: "EMAIL",
//     password: "PASSWORD",
//     isActive: "TRUE/FALSE",
//     userType: "TYPE",
//     confirmation: [{
//         secret: "SECRET"
//     }],
//     tokens: [{
//         access: "AUTH",
//         token: "TOKEN"
//     }]
// }
// *******************************************************************
// ###################################################################


// Lodash
const _ = require("lodash");
// MongoDB
const mongoose = require("mongoose");
// Validation Middleware
const validator = require("validator");
// JSON Web Token Middleware
const jwt = require("jsonwebtoken");
// BCrypt Password Hashing Middleware
const bcrypt = require("bcryptjs");

// Create User schema
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "{VALUE} is not a valid email!"
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    userType: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => {
                if (validator.matches(value, /b/i) || validator.matches(value, /s/i) || validator.matches(value, /v/i)) {
                    return true;
                }
                return false;
            },
            message: "{VALUE} should be b/s/v or B/S/V!"
        }
    },
    confirmation: [{
        secret: {
            type: String,
            required: true
        }
    }],
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// *******************************************************************
// ###################################################################
// OVERRIDE METHOD, for every call that returns a JSON object
// ###################################################################
UserSchema.methods.toJSON = function () {
    const user = this;
    // Create an object
    const userObject = user.toObject();

    // Return _id, email, userType from userObject
    return _.pick(userObject, ["email", "userType"]);
};
// ###################################################################
// *******************************************************************

// *******************************************************************
// ###################################################################
// INSTANCE METHOD
// ###################################################################
// To generate secret
UserSchema.methods.generateConfirmationSecret = function () {
    const user = this;
    // Set access according to userType
    const access = `${user.userType}-auth`;

    // Sign the confirmation secret
    const secret = jwt.sign(
        {
            _id: user._id.toHexString(),
            access,
            time: new Date().getTime()
        },
        process.env.USER_SECRET,
        {
            expiresIn: 60 * 60 * 72
        }
    );

    // Push secret
    user.confirmation.push({ secret });

    // Return secret
    return user.save().then(() => secret);
};
// ###################################################################
// To generate authentication token
UserSchema.methods.generateAuthenticationToken = function () {
    const user = this;
    // Setting access according to userType
    const access = `${user.userType}-auth`;

    // Signing the verification token
    const token = jwt.sign(
        {
            _id: user._id.toHexString(),
            access,
            time: new Date().getTime()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: 60 * 60 * 60
        }
    );

    // Push token
    user.tokens.push({ access, token });

    // Return token
    return user.save().then(() => token);
};
// ###################################################################
// To remove authentication token
UserSchema.methods.removeAuthToken = function (token) {
    const user = this;

    // Update user
    return user.updateOne({
        // To remove a field
        $pull: {
            tokens: { token }
        }
    });
};
// ###################################################################
// *******************************************************************

// *******************************************************************
// ###################################################################
// MODEL METHOD
// ###################################################################
// To find by confirmation secret
UserSchema.statics.findBySecret = function (secret) {
    const User = this;
    let decoded;

    try {
        // Get object with _id property
        decoded = jwt.verify(secret, process.env.USER_SECRET);
    } catch (err) {
        throw err;
    }

    // Return user
    return User.findOne({
        _id: decoded._id,
        "confirmation.secret": secret,
        "tokens.access": decoded.access
    });
};
// ###################################################################
// To find by authentication token
UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;

    try {
        // Get object with _id property
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw err;
    }

    // Return user
    return User.findOne({
        _id: decoded._id,
        "tokens.token": token,
        "tokens.access": decoded.access
    });
};
// ###################################################################
// To find by email, password
UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;

    // Return user
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return null;
        }

        return new Promise((resolve, reject) => {
            // Compare password with hash stored
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    resolve(null);
                }
            });
        });
    });
};
// ###################################################################
// *******************************************************************

// *******************************************************************
// ###################################################################
// HOOKS
// ###################################################################
// save Hook
UserSchema.pre("save", function (next) {
    const user = this;

    if (user.isModified("password")) {
        // Generate salt synchronously
        const salt = bcrypt.genSaltSync(12);
        // Generate hash synchronously
        const hash = bcrypt.hashSync(user.password, salt);

        // Store hash
        user.password = hash;
        next();
    } else {
        next();
    }
});
// ###################################################################
// updateOne Hook
UserSchema.pre("updateOne", function (next) {
    const User = this;

    const { email } = User.getUpdate().$set;
    const { password } = User.getUpdate().$set;

    // Check, validate email
    if (email && !validator.isEmail(email)) {
        throw new Error();
    }

    // Check, validate password
    if (password && password.length < 6) {
        throw new Error();
    }

    // Update password
    if (password) {
        try {
            // Generate salt synchronously
            const salt = bcrypt.genSaltSync(12);
            // Generate hash synchronously
            const hash = bcrypt.hashSync(password, salt);

            // Store hash
            User.getUpdate().$set.password = hash;
            next();
        } catch (e) {
            throw new Error();
        }
    }

    next();
});
// ###################################################################
// *******************************************************************

const User = mongoose.model("User", UserSchema);

module.exports = { User };
