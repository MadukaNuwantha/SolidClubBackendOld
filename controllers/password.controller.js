const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generator = require('generate-password');

function DateFormat(date) {
    var days = date.getDate();
    var year = date.getFullYear();
    var month = (date.getMonth() + 1);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = year + '-' + month + '-' + days + ' ' + hours + ':' + minutes;
    return strTime;
}

function forgetPassword(req, res) {
    var password = generator.generate({
        length: 6,
        numbers: true,
        symbols: false,
        uppercase: false,
        lowercase: false,
        strict: false
    });
    models.User.findOne({ attributes: ['id', 'fname', 'password'], where: {countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile, userStatusId: 1 } }).then(result => {
        if (result === null) {
            res.status(401).json({
                message: "Mobile not exists!",
            });
        } else {
            bcryptjs.genSalt(10, function (err, salt) {
                bcryptjs.hash(password, salt, function (err, hash) {
                    var currentDateTime = new Date();
                    const userPassword = {
                        password: hash,
                        otpExpires: DateFormat(new Date(currentDateTime.getTime() + 5 * 60000))
                    }
                    models.User.update(userPassword, { where: { mobile: req.body.mobile } }).then(updatedresult => {
                        res.status(200).json({
                            message: [{
                                id: result.id,
                                fname: result.fname,
                                otp: password,
                                mobile: req.body.mobile,
                                otpExpires: DateFormat(new Date(currentDateTime.getTime() + 5 * 60000))
                            }],
                        });
                    }).catch(error => {
                        res.status(200).json({
                            message: error.message
                        });
                    })
                });
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function oTPlogin(req, res) {
    models.User.findOne({ attributes: ['id', 'fname', 'password', 'otpExpires'], where: {countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile, userStatusId: 1 } }).then(user => {
        if (user === null) {
            res.status(401).json({
                message: "Mobile not found!",
            });
        } else {
            var currentDateTime = new Date();
            var otpExpires = user.otpExpires;
            if (currentDateTime <= otpExpires) {
                bcryptjs.compare(req.body.otp, user.password, function (err, result) {
                    if (result) {
                        res.status(200).json({
                            message: [{
                                id: user.id,
                                varified: true,
                                otpExpires: user.otpExpires
                            }],
                        });
                    } else {
                        res.status(401).json({
                            message: [{
                                varified: false,
                                otpExpires: user.otpExpires
                            }],
                        });
                    }
                });
            } else {
                res.status(401).json({
                    message: [{
                        varified: false,
                        otpExpires: user.otpExpires
                    }],
                });
            }
        }
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function updatePassword(req, res) {
    bcryptjs.genSalt(10, function (err, salt) {
        bcryptjs.hash(req.body.password, salt, function (err, hash) {
            const passwordData = {
                password: hash,
            }
            models.User.findOne({
                attributes: ['id'],
                where: {
                    id: req.params.id
                }
            }).then(result => {
                if (result !== null) {
                    models.User.update(passwordData, { where: { id: req.params.id } }).then(upResult => {
                        res.status(200).json({
                            message: upResult
                        });
                    }).catch(error => {
                        res.status(500).json({
                            message: error.message
                        });
                    });
                }
            }).catch(error => {
                res.status(500).json({
                    message: error.message
                });
            });
        });
    });
}

module.exports = {
    forgetPassword,
    oTPlogin,
    updatePassword,
} 