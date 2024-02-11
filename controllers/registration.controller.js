const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generator = require('generate-password');
var mime = require('mime-types');

function customerRegistration(req, res) {
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gps => {
        models.User.findOne({ attributes: ['countryDialCodeMobile', 'mobile'], where: {countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile } }).then(result => {
            if (result) {
                res.status(409).json({
                    message: result.countryDialCodeMobile + " " + result.mobile + " already exists!",
                });
            } else {
                bcryptjs.genSalt(10, function (err, salt) {
                    bcryptjs.hash(req.body.password, salt, function (err, hash) {
                        let picture = "https://dummyimage.com/400x400/d7d7d7/00000.png";
                        if (req.file.filename) {
                            picture = "uploads/profilePics/" + req.file.filename;
                        }
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
                            password: hash,
                            dob: req.body.dob,
                            address: req.body.address,
                            gpLocation: gps.gpLocation,
                            countryDialCodeMobile: req.body.countryDialCodeMobile,
                            mobile: req.body.mobile,
                            countryDialCodeTell: req.body.countryDialCodeTell,
                            tell: req.body.tell,
                            picture: picture,
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

function technicianRegistration(req, res) {
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gps => {
        models.User.findOne({ attributes: ['countryDialCodeMobile', 'mobile'], where: {countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile } }).then(result => {
            if (result) {
                res.status(409).json({
                    message: result.countryDialCodeMobile + " " + result.mobile + " already exists!",
                });
            } else {
                models.Technician.findOne({ attributes: ['nicNumber'], where: { nicNumber: req.body.nicNumber } }).then(tresult => {
                    if (tresult) {
                        res.status(409).json({
                            message: tresult.nicNumber + " already exists!",
                        });
                    } else {
                        bcryptjs.genSalt(10, function (err, salt) {
                            bcryptjs.hash(req.body.password, salt, function (err, hash) {
                                let picture = "https://dummyimage.com/400x400/d7d7d7/00000.png";
                                if (req.files['profilePicture']) {
                                    picture = "uploads/profilePics/" + req.files['profilePicture'][0];
                                }
                                const user = {
                                    title: req.body.title,
                                    cityId: req.body.cityId,
                                    fname: req.body.fname,
                                    lname: req.body.lname,
                                    email: req.body.email,
                                    password: req.body.hash,
                                    dob: req.body.dob,
                                    address: req.body.address,
                                    gpLocation: gps.gpLocation,
                                    countryDialCodeMobile: req.body.countryDialCodeMobile,
                                    mobile: req.body.mobile,
                                    countryDialCodeTell: req.body.countryDialCodeTell,
                                    tell: req.body.tell,
                                    picture: picture,
                                    userStatusId: 1,
                                    roleId: 7,
                                    allowSearchInJobCreate: 0
                                }
                                models.User.create(user).then(userresult => {
                                    let nicFrontpicture = "https://dummyimage.com/400x400/d7d7d7/00000.png";
                                    if (req.files['nicFrontpicture']) {
                                        nicFrontpicture = "uploads/nicFrontPics/" + req.files['nicFrontpicture'][0];
                                    }
                                    let nicBackpicture = "https://dummyimage.com/400x400/d7d7d7/00000.png";
                                    if (req.files['nicBackpicture']) {
                                        nicBackpicture = "uploads/nicBackPics/" + req.files['nicBackpicture'][0];
                                    }
                                    const technician = {
                                        userId: userresult.id,
                                        educationLevelId: req.body.educationLevelId,
                                        nicNumber: req.body.nicNumber,
                                        noOfWorkers: req.body.noOfWorkers,
                                        averageMonthlyWork: req.body.averageMonthlyWork,
                                        nicFrontpicture: nicFrontpicture,
                                        nicBackpicture: nicBackpicture,
                                    }
                                    models.Technician.create(technician).then(tecnicianresult => {
                                        models.Experience.destroy({
                                            where: {
                                                technicianId: tecnicianresult.id,
                                            }
                                        }).then(result => {
                                            let count = 0
                                            for (let co = 0; co <= req.body.experience.length - 1; co++) {
                                                var experience = {
                                                    technicianId: tecnicianresult.id,
                                                    jobTypeId: req.body.experience[co].jobTypeId,
                                                    experienceYear: req.body.experience[co].experienceYear,
                                                    experienceMonth: req.body.experience[co].experienceMonth,
                                                }
                                                models.Experience.create(experience).then(result => {
                                                    count = count + 1;
                                                }).catch(error => {
                                                    res.status(500).json({
                                                        message: error.message,
                                                    });
                                                });
                                            };
                                            if (count <= req.body.jobTypeId.length) {
                                                models.TechnicianCity.destroy({
                                                    where: {
                                                        technicianId: tecnicianresult.id,
                                                    }
                                                }).then(result => {
                                                    count = 0;
                                                    for (var co = 0; co <= req.body.cityId.length - 1; co++) {
                                                        var city = {
                                                            technicianId: tecnicianresult.id,
                                                            cityId: req.body.cityId[co],
                                                        }
                                                        models.TechnicianCity.create(city).then(result => {
                                                            count = count + 1;
                                                        }).catch(error => {
                                                            res.status(500).json({
                                                                message: error.message,
                                                            });
                                                        });
                                                    };
                                                    if (count <= req.body.cityId.length) {
                                                        models.TechnicianTenantLevel.destroy({
                                                            where: {
                                                                technicianId: tecnicianresult.id,
                                                            }
                                                        }).then(result => {
                                                            count = 0;
                                                            for (var co = 0; co <= req.body.tenantId.length - 1; co++) {
                                                                var tenantLevel = {
                                                                    technicianId: tecnicianresult.id,
                                                                    tenantId: req.body.tenantId[co],
                                                                    levelId: 1
                                                                }
                                                                models.TechnicianTenantLevel.create(tenantLevel).then(result => {
                                                                    count = count + 1;
                                                                }).catch(error => {
                                                                    res.status(500).json({
                                                                        message: error.message,
                                                                    });
                                                                });
                                                            };
                                                            if (count <= req.body.tenantId.length) {
                                                                models.OldJob.destroy({
                                                                    where: {
                                                                        technicianId: tecnicianresult.id,
                                                                    }
                                                                }).then(result => {
                                                                    count = 0;
                                                                    for (var co = 0; co <= req.files['picture'].length - 1; co++) {
                                                                        const oldJobsPicture = {
                                                                            picture: "uploads/oldJobsPics/" + req.files['picture'][co].filename,
                                                                            technicianId: tecnicianresult.id,
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
                                                                            message: [{
                                                                                id: userresult.id,
                                                                                fname: userresult.fname,
                                                                                password: req.body.password,
                                                                                mobile: userresult.mobile,
                                                                                technicianId: tecnicianresult.id,
                                                                            }],
                                                                        });
                                                                    }
                                                                }).catch(error => {
                                                                    res.status(500).json({
                                                                        message: error.message
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
                                }).catch(error => {
                                    res.status(500).json({
                                        message: error.message,
                                    });
                                });
                            });
                        });
                    }
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

function findTechnicianAndRegistration(req, res) {
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gps => {
        models.User.findOne({ attributes: ['countryDialCodeMobile', 'mobile'], where: {countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile } }).then(result => {
            if (result) {
                res.status(409).json({
                    message: result.countryDialCodeMobile + " " + result.mobile + " already exists!",
                });
            } else {
                bcryptjs.genSalt(10, function (err, salt) {
                    bcryptjs.hash(req.body.password, salt, function (err, hash) {
                        let picture = "https://dummyimage.com/400x400/d7d7d7/00000.png";
                        if (req.files['profilePicture']) {
                            picture = "uploads/profilePics/" + req.files['profilePicture'][0];
                        }
                        const user = {
                            title: req.body.title,
                            cityId: req.body.cityId,
                            fname: req.body.fname,
                            lname: req.body.lname,
                            email: req.body.email,
                            password: hash,
                            dob: req.body.dob,
                            address: req.body.address,
                            gpLocation: gps.gpLocation,
                            countryDialCodeMobile: req.body.countryDialCodeMobile,
                            mobile: req.body.mobile,
                            countryDialCodeTell: req.body.countryDialCodeTell,
                            tell: req.body.tell,
                            picture: picture,
                            userStatusId: 1,
                            roleId: 8,
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
                                    budget: req.body.budget,
                                    startDate: req.body.startDate,
                                    address: req.body.addressJob,
                                    gpLocation: jobGPS,
                                    notes: req.body.notes,
                                    jobStatusId: 1,
                                }
                                models.Job.create(job).then(resultJob => {
                                    models.JobsJobType.destroy({
                                        where: {
                                            jobId: resultJob.id,
                                        }
                                    }).then(result => {
                                        count = 0;
                                        for (var co = 0; co <= req.body.jobTypeId.length - 1; co++) {
                                            var jobsJobType = {
                                                jobId: resultJob.id,
                                                jobTypeId: req.body.jobTypeId[co],
                                            }
                                            models.JobsJobType.create(jobsJobType).then(jobsJobTypeResult => {
                                                count = count + 1;
                                            }).catch(error => {
                                                res.status(500).json({
                                                    message: error.message,
                                                });
                                            });
                                        };
                                        if (count <= req.body.jobTypeId.length) {
                                            models.JobPicture.destroy({
                                                where: {
                                                    jobId: resultJob.id,
                                                }
                                            }).then(result => {
                                                count = 0;
                                                for (var co = 0; co <= req.files.length - 1; co++) {
                                                    const attachments = {
                                                        jobId: resultJob.id,
                                                        picture: "uploads/jobAttachments/" + req.files[co].filename
                                                    }
                                                    models.JobPicture.create(attachments).then(jobPictureResult => {
                                                        count = count + 1;
                                                    }).catch(error => {
                                                        res.status(500).json({
                                                            message: error.message,
                                                        });
                                                    });
                                                };
                                                if (count <= req.files.length) {
                                                    res.status(200).json({
                                                        message: [{
                                                            id: result.id,
                                                            name: req.body.name,
                                                            password: password,
                                                            mobile: req.body.mobile,
                                                            jobId: resultJob.id
                                                        }],
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

module.exports = {
    customerRegistration,
    technicianRegistration,
    findTechnicianAndRegistration,
} 