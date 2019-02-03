const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            // validator: (value) => {
            //     return validator.isEmail(value);
            // },
            validator: validator.isEmail,
            message: `{VALUE} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
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
});

//Override a method
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, [ "_id", "email" ]);
};

//Creating new instance method
UserSchema.methods.generateAuthToken = function() {
    var user = this;//Instance method
    var access = "auth";
    var token = jwt.sign({
            _id: user._id.toHexString(),
            access
    }, process.env.JWT_SECRET);

    user.tokens.push({ access, token });
    // user.tokens = user.tokens.concat([{ access, token }]);

    return user.save().then(() => {
        return token;//Returns the token defined above
    });
};
UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.updateOne({
        //To remove a field
        $pull: {
            tokens: { token }
        }
    });
};

//Creating a new model method
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;
    
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch(err) {
        // return Promise.reject();
        return new Promise((resolve, reject) => {
            reject();
        });
    }
    
    return User.findOne({
        "_id": decoded._id,
        "tokens.token": token,
        "tokens.access": "auth"
    });
};
UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    return User.findOne({ email }).then((user) => {
        if(!user) {
            return Promise.reject();
        }
        
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

//Creating Mongoose Middleware
UserSchema.pre("save", function(next) {
    var user = this;
    
    if(user.isModified("password")) {
        var hash = bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model("User", UserSchema);

module.exports = { User };