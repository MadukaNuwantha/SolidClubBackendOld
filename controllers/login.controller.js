const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

function login(req, res) {
    models.User.findOne({ attributes: ['id', 'roleId', 'fname', 'picture', 'password', 'countryDialCodeMobile', 'mobile', 'userStatusId'], where: { countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile } }).then(user => {
        if (user === null) {
            res.status(401).json({
                message: "Invalid credentials!",
            });
        } else {
            bcryptjs.compare(req.body.password, user.password, function (err, result) {
                if (result) {
                    const token = jwt.sign({
                        mobile: user.mobile,
                        userId: user.id
                    }, "process.env.JWT_KEY", function (err, token) {
                        const status = {
                            userStatusId: 1
                        }
                        models.User.update(status, {
                            where: { id: user.id }
                        }).then(reslt => {
                            if (user.roleId === 7) {
                                models.Technician.findOne({ attributes: ['id'], where: { userId: user.id } }).then(technician => {
                                    res.status(200).json({
                                        message: [{
                                            token,
                                            'id': user.id,
                                            'roleId': user.roleId,
                                            'fname': user.fname,
                                            'picture': user.picture,
                                            'technicianId': technician.id
                                        }]
                                    });
                                }).catch(error => {
                                    res.status(500).json({
                                        message: error.message,
                                    });
                                });
                            } else {
                                res.status(200).json({
                                    message: [{
                                        token,
                                        'id': user.id,
                                        'roleId': user.roleId,
                                        'fname': user.fname,
                                        'picture': user.picture,
                                        'technicianId': ""
                                    }]
                                });
                            }
                        }).catch(error => {
                            res.status(500).json({
                                message: error.message,
                            });
                        });
                    });
                } else {
                    res.status(401).json({
                        message: "Invalid credentials!",
                    });
                }
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function adminLogin(req, res) {
    models.Staff.findOne({ attributes: ['id', 'roleId', 'name', 'picture', 'password'], where: { email: req.body.email, status: 1 } }).then(staff => {
        if (staff === null) {
            res.status(401).json({
                message: "Invalid credentials!",
            });
        } else {
            bcryptjs.compare(req.body.password, staff.password, function (err, result) {
                if (result) {
                    const token = jwt.sign({
                        mobile: staff.email,
                        userId: staff.id
                    }, "process.env.JWT_KEY", function (err, token) {
                        res.status(200).json({
                            message: [{
                                token,
                                'id': staff.id,
                                'roleId': staff.roleId,
                                'name': staff.name,
                                'picture': staff.picture,
                            }]
                        });
                    });
                } else {
                    res.status(401).json({
                        message: "Invalid credentials!",
                    });
                }
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

module.exports = {
    login,
    adminLogin,
} 