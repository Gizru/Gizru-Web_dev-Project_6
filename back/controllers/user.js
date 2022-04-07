var mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');


exports.signup = (req, res, next) => {
    var db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
        console.log("Connection Successful!");
    })

    const userSchema = mongoose.Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    });

    userSchema.plugin(uniqueValidator);

    var Model = mongoose.model("userModel", userSchema, "users");


    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            var doc1 = new Model({ email: req.body.email, password: hash });

            doc1.save(function (err, doc) {
                if (err) return console.error(err);
                res.status(201).json({
                    message: 'User added successfully!'
                });
            });
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: "error hash"
            });
        }
    );
};




var userSchema = mongoose.Schema({
    email: { type: String },
    password: { type: String }
});

var User = mongoose.model("model", userSchema, "users");


exports.login = (req, res, next) => {

    var db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
        console.log("Connection Successful!");
    })

    User.findOne({ email: req.body.email }).then(
        (user) => {
            if (!user) {
                return res.status(401).json({
                    error: 'User not found!'
                });
            }
            bcrypt.compare(req.body.password, user.password).then(
                (valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: req.body.password + 'Incorrect password!' + user.password
                        });
                    }
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
            const token = jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
            );

            res.status(200).json({
                userId: user._id,
                token: token
            });
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: "Error getUser"
            });
        }
    );
}