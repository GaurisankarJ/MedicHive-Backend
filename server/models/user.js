// *******************************************************************
// ###################################################################
// USER BODY MODEL
// {
//     email: "EMAIL",
//     password: "PASSWORD",
//     isActive: "TRUE/FALSE",
//     userType: "TYPE",
//     confirmation: {
//         secret: "SECRET"
//     },
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
        default: false
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
            access
        },
        process.env.USER_SECRET
    );

    // Push secret
    user.confirmation.push({ secret });
};
// ###################################################################
// To set isActive
UserSchema.methods.activate = function () {
    const user = this;

    // Set isActive as true
    user.isActive = true;

    // Return user
    return user.save();
};
// ###################################################################
// To reset password
UserSchema.methods.resetPassword = function (password) {
    const user = this;

    // Set password
    user.password = password;

    // Return user
    return user.save();
};
// ###################################################################
// To generate authentication token
UserSchema.methods.generateAuthToken = function () {
    const user = this;
    // Setting access according to userType
    const access = `${user.userType}-auth`;

    // Signing the verification token
    const token = jwt.sign(
        {
            _id: user._id.toHexString(),
            access
        },
        process.env.JWT_SECRET,
        {
            expiresIn: 60 * 60
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
        return null;
    }

    // Return user
    return User.findOne({
        _id: decoded._id
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
        return Promise.reject(err);
    }

    // Return user
    return User.findOne({
        _id: decoded._id,
        "tokens.token": token,
        "tokens.access": decoded.access
    });
};
// ###################################################################
// To find by email
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
        // Generate salt
        bcrypt.genSalt(12, (err, salt) => {
            // Generate hash
            bcrypt.hash(user.password, salt, (error, hash) => {
                // Store hash
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});
// ###################################################################
// findOneAndUpdate Hook
UserSchema.pre("findOneAndUpdate", function (next) {
    const user = this;

    const { email } = user._update.$set;

    // Check email
    if (!email) {
        next();
    }

    // Validate email
    if (validator.isEmail(email)) {
        next();
    } else {
        throw new Error();
    }
});
// ###################################################################
// *******************************************************************
// *******************************************************************

const User = mongoose.model("User", UserSchema);

module.exports = { User };
