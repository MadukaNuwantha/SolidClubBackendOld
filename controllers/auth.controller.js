const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generator = require('generate-password');
var mime = require('mime-types');

function customerRegistration(req, res) {
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gps => {
        models.User.findOne({ attributes: ['countryDialCodeMobile', 'mobile'], where: { countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile } }).then(result => {
            if (result) {
                res.status(409).json({
                    message: result.countryDialCodeMobile + " " + result.mobile + " already exists!",
                });
            } else {
                let source = 'Mobile';
                if(req.body.source){
                    source = req.body.source;
                }
                const userData = {
                    title: req.body.title,
                    cityId: req.body.cityId,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    email: req.body.email,
                    password: req.body.mobile,
                    dob: req.body.dob,
                    address: req.body.address,
                    gpLocation: gps.gpLocation,
                    countryDialCodeMobile: req.body.countryDialCodeMobile,
                    mobile: req.body.mobile,
                    countryDialCodeTell: req.body.countryDialCodeTell,
                    tell: req.body.tell,
                    picture: req.body.picture,
                    userStatusId: 1,
                    roleId: 8,
                    source: source
                }
                models.User.create(userData).then(createdResult => {




                    
                    res.status(200).json({
                        message: [{
                            id: createdResult.id,
                            fname: createdResult.fname,
                            password: req.body.password,
                            mobile: createdResult.mobile,
                        }]
                    });
                }).catch(error => {
                    res.status(500).json({
                        message: error.message,
                    });
                });
            }
        }).catch(error => {
            res.status(500).json({
                message: error.message,
            });
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function customerRegistrationUpdate(req, res) {
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gps => {
        const userData = {
            title: req.body.title,
            cityId: req.body.cityId,
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: req.body.mobile,
            dob: req.body.dob,
            address: req.body.address,
            gpLocation: gps.gpLocation,
            countryDialCodeMobile: req.body.countryDialCodeMobile,
            mobile: req.body.mobile,
            countryDialCodeTell: req.body.countryDialCodeTell,
            tell: req.body.tell,
            picture: req.body.picture,
            userStatusId: 1,
            roleId: 8,
        }
        models.User.update(userData, {
            where: {
                id: req.params.id,
            }
        }).then(createdResult => {
            res.status(200).json({
                message: [{
                    id: req.params.id,
                    fname: req.body.fname,
                    password: req.body.password,
                    mobile: req.body.mobile,
                }]
            });
        }).catch(error => {
            res.status(500).json({
                message: error.message,
            });
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function technicianRegistrationUpdate(req, res) {
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gps => {
        const user = {
            title: req.body.title,
            cityId: req.body.cityId,
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: req.body.mobile,
            dob: req.body.dob,
            address: req.body.address,
            gpLocation: gps.gpLocation,
            countryDialCodeMobile: req.body.countryDialCodeMobile,
            mobile: req.body.mobile,
            countryDialCodeTell: req.body.countryDialCodeTell,
            tell: req.body.tell,
            picture: req.body.picture,
            userStatusId: 1,
            roleId: 7,
        }
        models.User.update(user, {
            where: {
                id: req.params.id,
            }
        }).then(userresult => {
            const technician = {
                userId: req.params.id,
                educationLevelId: req.body.educationLevelId,
                nicNumber: req.body.nicNumber,
                noOfWorkers: req.body.noOfWorkers,
                averageMonthlyWork: req.body.averageMonthlyWork,
                nicFrontpicture: req.body.nicFrontpicture,
                nicBackpicture: req.body.nicBackpicture,
            }
            models.Technician.update(technician, {
                where: {
                    id: req.params.technicianId,
                }
            }).then(tecnicianresult => {
                res.status(200).json({
                    message: [{
                        id: req.params.id,
                        fname: req.params.fname,
                        password: req.body.password,
                        mobile: req.params.mobile,
                        technicianId: req.params.technicianId,
                    }],
                });
            }).catch(error => {
                res.status(500).json({
                    message: error.message,
                });
            });

        }).catch(error => {
            res.status(500).json({
                message: error.message,
            });
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function removeTechnician(req, res) {
    models.Technician.destroy({
        where: {
            userId: req.params.id,
        }
    }).then(results => {
        models.User.destroy({
            where: {
                id: req.params.id,
            }
        }).then(result => {
            res.status(200).json({
                message: result,
            });
        }).catch(error => {
            res.status(500).json({
                message: error.message,
            });
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function removeCustomer(req, res) {
    models.User.destroy({
        where: {
            id: req.params.id,
        }
    }).then(result => {
        res.status(200).json({
            message: result,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function technicianRegistration(req, res) {
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gps => {
        models.User.findOne({ attributes: ['countryDialCodeMobile', 'mobile'], where: { countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile } }).then(result => {
            if (result) {
                res.status(409).json({
                    message: result.mobile + " " + result.countryDialCodeMobile + " already exists!",
                });
            } else {
                models.Technician.findOne({ attributes: ['nicNumber'], where: { nicNumber: req.body.nicNumber } }).then(tresult => {
                    if (tresult) {
                        res.status(409).json({
                            message: tresult.nicNumber + " already exists!",
                        });
                    } else {
                        const user = {
                            title: req.body.title,
                            cityId: req.body.cityId,
                            fname: req.body.fname,
                            lname: req.body.lname,
                            email: req.body.email,
                            password: req.body.mobile,
                            dob: req.body.dob,
                            address: req.body.address,
                            gpLocation: gps.gpLocation,
                            countryDialCodeMobile: req.body.countryDialCodeMobile,
                            mobile: req.body.mobile,
                            countryDialCodeTell: req.body.countryDialCodeTell,
                            tell: req.body.tell,
                            picture: req.body.picture,
                            userStatusId: 1,
                            roleId: 7,
                            allowSearchInJobCreate: 0
                        }
                        models.User.create(user).then(userresult => {

                            const technician = {
                                userId: userresult.id,
                                educationLevelId: req.body.educationLevelId,
                                nicNumber: req.body.nicNumber,
                                noOfWorkers: req.body.noOfWorkers,
                                averageMonthlyWork: req.body.averageMonthlyWork,
                                nicFrontpicture: req.body.nicFrontpicture,
                                nicBackpicture: req.body.nicBackpicture,
                            }
                            models.Technician.create(technician).then(tecnicianresult => {
                                res.status(200).json({
                                    message: [{
                                        id: userresult.id,
                                        fname: userresult.fname,
                                        password: req.body.password,
                                        mobile: userresult.mobile,
                                        technicianId: tecnicianresult.id,
                                    }],
                                });
                            }).catch(error => {
                                res.status(500).json({
                                    message: error.message,
                                });
                            });

                        }).catch(error => {
                            res.status(500).json({
                                message: error.message,
                            });
                        });
                    }
                }).catch(error => {
                    res.status(500).json({
                        message: error.message,
                    });
                });
            }
        }).catch(error => {
            res.status(500).json({
                message: error.message,
            });
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function createExperiances(req, res) {
    var experience = {
        technicianId: req.body.technicianId,
        jobTypeId: req.body.jobTypeId,
        experienceYear: req.body.experienceYear,
        experienceMonth: req.body.experienceMonth,
    }

    models.Experience.findOne({
        where: {
            technicianId: req.body.technicianId,
            jobTypeId: req.body.jobTypeId,
        },
    }).then(Oldresult => {
        if (Oldresult) {
            var experienceUpdate = {
                experienceYear: req.body.experienceYear,
                experienceMonth: req.body.experienceMonth,
            }
            models.Experience.update(experienceUpdate, {
                where: {
                    id: Oldresult.id,
                }
            }).then(updatedresult => {
                res.status(200).json({
                    message: updatedresult
                });
            }).catch(error => {
                res.status(500).json({
                    message: error.message
                });
            });
        } else {
            models.Experience.create(experience).then(result => {
                res.status(200).json({
                    message: result,
                });
            }).catch(error => {
                res.status(500).json({
                    message: error.message,
                });
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function showExperieancesByTechnician(req, res) {
    models.Experience.findAll({
        attributes: ['id', 'experienceYear', 'experienceMonth'],
        include: [{ model: models.JobType, attributes: ['name'] }],
        where: {
            technicianId: req.params.id,
        },
    }).then(result => {
        res.status(200).json({
            message: result,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function removeExperiences(req, res) {
    models.Experience.destroy({
        where: {
            id: req.params.id,
        }
    }).then(result => {
        res.status(200).json({
            message: result,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function removeAllExperiences(req, res) {
    models.Experience.destroy({
        where: {
            technicianId: req.params.id,
        }
    }).then(result => {
        res.status(200).json({
            message: result,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function createTechnicianCities(req, res) {
    var city = {
        technicianId: req.body.technicianId,
        cityId: req.body.cityId,
    }
    models.TechnicianCity.findOne({
        attributes: ['id', 'technicianId', 'cityId'],
        where: {
            technicianId: req.body.technicianId,
            cityId: req.body.cityId,
        },
    }).then(Oldresult => {
        if (Oldresult) {
            res.status(409).json({
                message: Oldresult,
            });
        } else {
            models.TechnicianCity.create(city).then(result => {
                res.status(200).json({
                    message: result,
                });
            }).catch(error => {
                res.status(500).json({
                    message: error.message,
                });
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function showCitiesByTechnician(req, res) {
    models.TechnicianCity.findAll({
        attributes: ['id'],
        include: [{ model: models.City, attributes: ['name'], include: [{ model: models.District, attributes: ['name'] }] }],
        where: {
            technicianId: req.params.id,
        },
    }).then(result => {
        res.status(200).json({
            message: result,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function removeTechnicianCities(req, res) {
    models.TechnicianCity.destroy({
        where: {
            id: req.params.id,
        }
    }).then(result => {
        res.status(200).json({
            message: result,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function removeAllTechnicianCities(req, res) {
    models.TechnicianCity.destroy({
        where: {
            technicianId: req.params.id,
        }
    }).then(result => {
        res.status(200).json({
            message: result,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function createTechnicianTenantLevel(req, res) {
    var tenantLevel = {
        technicianId: req.body.technicianId,
        tenantId: req.body.tenantId,
        levelId: 1
    }
    models.TechnicianTenantLevel.findOne({
        attributes: ['id', 'technicianId', 'tenantId', 'levelId'],
        where: {
            technicianId: req.body.technicianId,
            tenantId: req.body.tenantId,
        },
    }).then(Oldresult => {
        if (Oldresult) {
            res.status(409).json({
                message: Oldresult,
            });
        } else {
            models.TechnicianTenantLevel.create(tenantLevel).then(result => {
                res.status(200).json({
                    message: result,
                });
            }).catch(error => {
                res.status(500).json({
                    message: error.message,
                });
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function removeTechnicianTenantLevel(req, res) {
    models.TechnicianTenantLevel.destroy({
        where: {
            id: req.params.id,
        }
    }).then(result => {
        res.status(200).json({
            message: result,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function removeAllTechnicianTenantLevel(req, res) {
    models.TechnicianTenantLevel.destroy({
        where: {
            technicianId: req.params.id,
        }
    }).then(result => {
        res.status(200).json({
            message: result,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function showTenantLevelsByTechnician(req, res) {
    models.TechnicianTenantLevel.findAll({
        attributes: ['id'],
        include: [{ model: models.Tenant, attributes: ['name'], }, { model: models.Level, attributes: ['name'], }],
        where: {
            technicianId: req.params.id,
        },
    }).then(result => {
        res.status(200).json({
            message: result,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function findTechnicianAndRegistration(req, res) {
    var password = generator.generate({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        strict: true
    });
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gps => {
        models.User.findOne({ attributes: ['mobile'], where: { mobile: req.body.mobile } }).then(result => {
            if (result) {
                res.status(409).json({
                    message: result.mobile + " already exists!",
                });
            } else {
                bcryptjs.genSalt(10, function (err, salt) {
                    bcryptjs.hash(password, salt, function (err, hash) {
                        const user = {
                            title: req.body.title,
                            cityId: req.body.cityId,
                            name: req.body.name,
                            designation: req.body.designation,
                            password: hash,
                            dob: req.body.dob,
                            address: req.body.address,
                            gpLocation: gps.gpLocation,
                            countryDialCodeMobile: req.body.countryDialCodeMobile,
                            mobile: req.body.mobile,
                            countryDialCodeTell: req.body.countryDialCodeTell,
                            tell: req.body.tell,
                            userStatusId: 1,
                            roleId: 8, //8-customer
                        }
                        models.User.create(user).then(result => {
                            models.City.findByPk(req.body.cityIdJob, { attributes: ['gpLocation'] }).then(gpsJob => {
                                var jobGPS = gpsJob.gpLocation;
                                if (req.body.gpLocation) {
                                    jobGPS = req.body.gpLocation
                                }
                                const job = {
                                    cityId: req.body.cityIdJob,
                                    userId: result.id,
                                    //jobTypeId: req.body.jobTypeId,
                                    budget: req.body.budget,
                                    startDate: req.body.startDate,
                                    address: req.body.addressJob,
                                    gpLocation: jobGPS,
                                    notes: req.body.notes,
                                    enablePurchase: req.body.enablePurchase,
                                    jobStatusId: 1,
                                }
                                models.Job.create(job).then(resultJob => {
                                    res.status(200).json({
                                        message: [{
                                            id: result.id,
                                            name: req.body.name,
                                            password: password,
                                            mobile: req.body.mobile,
                                            jobId: resultJob.id
                                        }],
                                    });
                                }).catch(error => {
                                    res.status(500).json({
                                        message: error.message,
                                    });
                                });
                            }).catch(error => {
                                res.status(500).json({
                                    message: error.message,
                                });
                            });
                        }).catch(error => {
                            res.status(500).json({
                                message: error.message,
                            });
                        });
                    });
                });
            }
        }).catch(error => {
            res.status(500).json({
                message: error.message,
            });
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function createJobsJobTypes(req, res) {
    var jobsJobType = {
        jobTypeId: req.body.jobTypeId,
        jobId: req.body.jobId
    }
    models.JobsJobType.create(jobsJobType).then(result => {
        res.status(200).json({
            message: result,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

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
                    res.status(402).json({
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
    models.User.findOne({ attributes: ['id', 'fname', 'password'], where: { countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile, userStatusId: 1 } }).then(result => {
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
    models.User.findOne({ attributes: ['id', 'fname', 'password', 'otpExpires'], where: { countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile, userStatusId: 1 } }).then(user => {
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

function uploadProfilePicture(req, res) {
    if (req.file.filename) {
        res.status(200).json({
            message: "uploads/profilePics/" + req.file.filename,
        });
    } else {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}

function uploadNicFrontPicture(req, res) {
    if (req.file.filename) {
        res.status(200).json({
            message: "uploads/nicFrontPics/" + req.file.filename,
        });
    } else {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}

function uploadNicBackPicture(req, res) {
    if (req.file.filename) {
        res.status(200).json({
            message: "uploads/nicBackPics/" + req.file.filename,
        });
    } else {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}

function createArrayTechnicianTenantLevel(req, res) {
    var count = 1;
    for (var co = 0; co <= req.body.tenantId.length - 1; co++) {
        var tenantLevel = {
            technicianId: req.body.technicianId,
            tenantId: req.body.tenantId[co],
            levelId: 1
        }
        models.TechnicianTenantLevel.findOne({
            attributes: ['id', 'technicianId', 'tenantId', 'levelId'],
            where: {
                technicianId: req.body.technicianId,
                tenantId: req.body.tenantId[co],
            },
        }).then(Oldresult => {
            if (Oldresult) {
                res.status(409).json({
                    message: Oldresult,
                });
            } else {
                models.TechnicianTenantLevel.create(tenantLevel).then(result => {
                    count = count + 1;
                }).catch(error => {
                    res.status(500).json({
                        message: error.message,
                    });
                });
            }
        }).catch(error => {
            res.status(500).json({
                message: error.message,
            });
        });
    };

    if (count <= req.body.tenantId.length) {
        res.status(200).json({
            message: count,
        });
    }
}

function createArrayTechnicianCities(req, res) {
    var count = 1;
    for (var co = 0; co <= req.body.cityId.length - 1; co++) {
        var city = {
            technicianId: req.body.technicianId,
            cityId: req.body.cityId[co],
        }
        models.TechnicianCity.findOne({
            attributes: ['id', 'technicianId', 'cityId'],
            where: {
                technicianId: req.body.technicianId,
                cityId: req.body.cityId[co],
            },
        }).then(Oldresult => {
            if (Oldresult) {
                res.status(409).json({
                    message: Oldresult,
                });
            } else {
                models.TechnicianCity.create(city).then(result => {
                    count = count + 1;
                }).catch(error => {
                    res.status(500).json({
                        message: error.message,
                    });
                });
            }
        }).catch(error => {
            res.status(500).json({
                message: error.message,
            });
        });
    };

    if (count <= req.body.cityId.length) {
        res.status(200).json({
            message: count,
        });
    }
}

function createArrayExperiances(req, res) {
    var count = 1;
    for (var co = 0; co <= req.body.jobTypeId.length - 1; co++) {
        var experience = {
            technicianId: req.body.technicianId,
            jobTypeId: req.body.jobTypeId[co],
            experienceYear: req.body.experienceYear[co],
            experienceMonth: req.body.experienceMonth[co],
        }

        models.Experience.findOne({
            where: {
                technicianId: req.body.technicianId,
                jobTypeId: req.body.jobTypeId[co],
            },
        }).then(Oldresult => {
            if (Oldresult) {
                res.status(409).json({
                    message: Oldresult,
                });
            } else {
                models.Experience.create(experience).then(result => {
                    count = count + 1;
                }).catch(error => {
                    res.status(500).json({
                        message: error.message,
                    });
                });
            }
        }).catch(error => {
            res.status(500).json({
                message: error.message,
            });
        });
    };

    if (count <= req.body.jobTypeId.length) {
        res.status(200).json({
            message: count,
        });
    }
}

function uploadOldJobsPicture(req, res) {
    var count = 1;
    for (var co = 0; co <= req.files.length - 1; co++) {
        const oldJobsPicture = {
            picture: "uploads/oldJobsPics/" + req.files[co].filename,
            technicianId: req.body.technicianId
        }
        models.OldJob.create(oldJobsPicture).then(updatedresult => {
            count = count + 1;
        }).catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
    };

    if (count <= req.files.length) {
        res.status(200).json({
            message: count,
        });
    }
}

function uploadProfilePictureV2(req, res) {
    if (req.file.filename) {
        const profilePicture = {
            picture: "uploads/profilePics/" + req.file.filename,
        }
        models.User.update(profilePicture, {
            where: {
                id: req.params.id,
            }
        }).then(result => {
            res.status(200).json({
                message: result
            });
        }).catch(error => {
            res.status(500).json({
                message: error.message,
            });
        });
    } else {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}

function uploadNicFrontPictureV2(req, res) {
    if (req.file.filename) {
        const nicFrontpicture = {
            nicFrontpicture: "uploads/nicFrontPics/" + req.file.filename,
        };
        models.Technician.update(nicFrontpicture, {
            where: {
                id: req.params.id,
            }
        }).then(result => {
            res.status(200).json({
                message: result
            });
        }).catch(error => {
            res.status(500).json({
                message: error.message,
            });
        });
    } else {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}

function uploadNicBackPictureV2(req, res) {
    if (req.file.filename) {
        const nicBackpicture = {
            nicBackpicture: "uploads/nicBackPics/" + req.file.filename,
        };
        models.Technician.update(nicBackpicture, {
            where: {
                id: req.params.id,
            }
        }).then(result => {
            res.status(200).json({
                message: result
            });
        }).catch(error => {
            res.status(500).json({
                message: error.message,
            });
        });
    } else {
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}

function uploadJobAttachmentsV2(req, res) {
    var count = 1;
    for (var co = 0; co <= req.files.length - 1; co++) {
        const picture = {
            picture: "uploads/jobAttachments/" + req.files[co].filename,
            jobId: req.body.jobId
        }
        models.JobPicture.create(picture).then(updatedresult => {
            count = count + 1;
        }).catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
    };
    if (count <= req.files.length) {
        res.status(200).json({
            message: count,
        });
    }
}

function showOldJobsByTechnician(req, res) {
    models.OldJob.findAll({
        attributes: ['id', 'picture'],
        where: {
            technicianId: req.params.id,
        },
    }).then(result => {
        res.status(200).json({
            message: result,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function removeOldJobsPicture(req, res) {
    models.OldJob.destroy({ where: { id: req.params.id } }).then(updatedresult => {
        res.status(200).json({
            message: updatedresult
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function removeAllOldJobsPicture(req, res) {
    models.OldJob.destroy({ where: { technicianId: req.params.id } }).then(updatedresult => {
        res.status(200).json({
            message: updatedresult
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function uploadJobAttachments(req, res) {
    var count = 1;
    var attachments = []
    for (var co = 0; co <= req.files.length - 1; co++) {
        attachments[co] = "uploads/jobAttachments/" + req.files[co].filename
    };

    if (attachments.length <= req.files.length) {
        res.status(200).json({
            message: attachments,
        });
    }
}

function generatePasswordForClient(req, res) {
    bcryptjs.genSalt(10, function (err, salt) {
        bcryptjs.hash(req.body.password, salt, function (err, hash) {
            res.status(200).json({
                message: hash
            });
        });
    });
}

module.exports = {
    customerRegistration,
    technicianRegistration,
    login,
    findTechnicianAndRegistration,
    createJobsJobTypes,
    forgetPassword,
    oTPlogin,
    updatePassword,
    createExperiances,
    showExperieancesByTechnician,
    removeExperiences,
    createTechnicianCities,
    showCitiesByTechnician,
    removeTechnicianCities,
    createTechnicianTenantLevel,
    removeTechnicianTenantLevel,
    showTenantLevelsByTechnician,
    uploadProfilePicture,
    uploadNicFrontPicture,
    uploadNicBackPicture,
    removeOldJobsPicture,
    uploadOldJobsPicture,
    removeAllExperiences,
    removeAllTechnicianCities,
    removeAllTechnicianTenantLevel,
    showOldJobsByTechnician,
    removeAllOldJobsPicture,
    technicianRegistrationUpdate,
    customerRegistrationUpdate,
    removeTechnician,
    removeCustomer,
    createArrayExperiances,
    createArrayTechnicianCities,
    createArrayTechnicianTenantLevel,
    uploadJobAttachments,
    generatePasswordForClient,
    uploadJobAttachmentsV2,
    uploadNicBackPictureV2,
    uploadNicFrontPictureV2,
    uploadProfilePictureV2
} 