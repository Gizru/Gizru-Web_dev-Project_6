const Sauce = require('../models/sauce');
const fs = require('fs');
var mongoose = require("mongoose");

exports.createSauce = (req, res, next) => {

    var db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
        console.log("Connection Successful!");
    })

    const url = req.protocol + '://' + req.get('host');

    const sauceSchema = mongoose.Schema({
        userId: { type: String, required: true },
        name: { type: String, required: true },
        manufacturer: { type: String, required: true },
        description: { type: String, required: true },
        mainPepper: { type: String, required: true },
        imageUrl: { type: String, required: true },
        heat: { type: Number, required: true },
        likes: { type: Number, required: true },
        dislikes: { type: Number, required: true },
        usersLiked: { type: [String], required: true },
        usersDisliked: { type: [String], required: true },
    });

    if (!Model) {
        var Model = mongoose.model("sauceModel", sauceSchema, "sauces");
    }

    req.body.sauce = JSON.parse(req.body.sauce);

    var doc1 = new Model({
        userId: req.auth.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    doc1.save(function (err, doc) {
        if (err) return console.error(err);
        res.status(201).json({
            message: 'Post saved successfully!'
        });
    })
};

exports.getSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.url.split('/')[1]
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.updateSauce = (req, res, next) => {
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');

        var name = req.body.name
        var manufacturer = req.body.manufacturer
        var description = req.body.description
        var mainPepper = req.body.mainPepper
        var imageUrl = url + '/images/' + req.file.filename
        var heat = req.body.heat

        Sauce.updateOne(
            { _id: req.url.split('/')[1] },
            {
                $set:
                {
                    name: name,
                    manufacturer: manufacturer,
                    description: description,
                    mainPepper: mainPepper,
                    imageUrl: imageUrl,
                    heat: heat
                }
            }
        ).then(
            () => {
                res.status(200).json({
                    message: 'Sauce updated successfully!'
                });
            }
        ).catch(
            (error) => {
                res.status(404).json({
                    error: error
                });
            }
        );
    } else {

        var name = req.body.name
        var manufacturer = req.body.manufacturer
        var description = req.body.description
        var mainPepper = req.body.mainPepper
        var heat = req.body.heat

        Sauce.updateOne(
            { _id: req.url.split('/')[1] },
            {
                $set:
                {
                    name: name,
                    manufacturer: manufacturer,
                    description: description,
                    mainPepper: mainPepper,
                    heat: heat
                }
            }
        ).then(
            () => {
                res.status(200).json({
                    message: 'Sauce updated successfully!'
                });
            }
        ).catch(
            (error) => {
                res.status(404).json({
                    error: error
                });
            }
        );
    }
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({ _id: req.params.id }).then(
                    () => {
                        res.status(200).json({
                            message: 'Deleted!'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            });
        }
    );
};

exports.getSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.likeSauce = (req, res, next) => {
    var likeNumber = 0;
    var dislikeNumber = 0;
    var likeString = [];
    var dislikeString = [];
    Sauce.findOne({
        _id: req.url.split('/')[1]
    }).then(
        (sauce) => {
            likeNumber = sauce.likes,
            dislikeNumber = sauce.dislikes,
            likeString = sauce.usersLiked,
            dislikeString = sauce.usersDisliked
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );

    if (req.body.like == 1) {
        likeNumber += 1;
        likeString.push(req.auth.userId);
    } else if (req.body.like == 0 && likeString.includes(req.auth.userId)) {
        likeString.remove(req.auth.userId);
        likeNumber -= 1;
    } else if (req.body.like == -1) {
        dislikeNumber += 1;
        dislikeString.push(req.auth.userId);
    } else if (req.body.like == 0 && dislikeString.includes(req.auth.userId)) {
        dislikeNumber -= 1;
        dislikeString.remove(req.auth.userId);
    }

    Sauce.updateOne(
        { _id: req.url.split('/')[1] },
        {
            $set:
            {
                likes: likeNumber,
                usersLiked: likeString,
                dislikes: dislikeNumber,
                usersDisiked: dislikeString
            }
        }
    ).then(
        () => {
            res.status(200).json({
                message: 'Sauce updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
}

