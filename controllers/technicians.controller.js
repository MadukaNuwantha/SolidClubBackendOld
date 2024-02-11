const Validator = require('fastest-validator');
const models = require('../models');
const bcryptjs = require('bcryptjs');
const generator = require('generate-password');
const { Op, Sequelize } = require("sequelize");

function index(req, res) {
    models.Technician.findAll({
        attributes: ['id', 'nicNumber', 'source'],
        include: [
            { model: models.User, attributes: ['id', 'title', 'fname', 'lname', 'email', 'dob', 'countryDialCodeMobile', 'mobile', 'countryDialCodeTell', 'tell', 'address', 'picture'], where: { roleId: 7 }, include: [{ model: models.City, attributes: ['id', 'name'], include: [{ model: models.District, attributes: ['id', 'name'] }] }, { model: models.UserStatus, attributes: ['id', 'name'] }] },
            {
                model: models.Experience, attributes: ['id', 'experienceYear', 'experienceMonth'],
                include:
                    [
                        {
                            model: models.JobType, attributes: ['id', 'name']
                        }
                    ]
            },
            {
                model: models.TechnicianCity, attributes: ['id'],
                include:
                    [
                        {
                            model: models.City, attributes: ['id', 'name'],
                            include:
                                [
                                    {
                                        model: models.District, attributes: ['id', 'name']
                                    }
                                ]
                        }
                    ]
            },
            {
                model: models.TechnicianTenantLevel, attributes: ['id'],
                include:
                    [
                        {
                            model: models.Level, attributes: ['id', 'name']
                        },
                        {
                            model: models.Tenant, attributes: ['id', 'name']
                        }
                    ]
            },
        ],
    }).then(technicianResult => {
        res.status(200).json({
            message: technicianResult
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function create(req, res) {
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gps => {
        models.User.findOne({ attributes: ['countryDialCodeMobile', 'mobile'], where: { countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile } }).then(result => {
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
                        function generatePasswordForClient(req, res) {
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
                                            nicFrontpicture = "uploads/profilePics/" + req.files['nicFrontpicture'][0];
                                        }
                                        let nicBackpicture = "https://dummyimage.com/400x400/d7d7d7/00000.png";
                                        if (req.files['nicBackpicture']) {
                                            nicBackpicture = "uploads/profilePics/" + req.files['nicBackpicture'][0];
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
                                                for (let co = 0; co <= req.body.experience.length - 1; co++) {
                                                    var experience = {
                                                        technicianId: tecnicianresult.id,
                                                        jobTypeId: req.body.experience[co].jobTypeId,
                                                        experienceYear: req.body.experience[co].experienceYear,
                                                        experienceMonth: req.body.experience[co].experienceMonth,
                                                    }
                                                    models.Experience.create(experience).then(result => {
                                                    }).catch(error => {
                                                        res.status(500).json({
                                                            message: error.message,
                                                        });
                                                    });

                                                    if (co == req.body.jobTypeId.length - 1) {
                                                        models.TechnicianCity.destroy({
                                                            where: {
                                                                technicianId: tecnicianresult.id,
                                                            }
                                                        }).then(result => {

                                                            for (var co2 = 0; co2 <= req.body.cityId.length - 1; co2++) {
                                                                var city = {
                                                                    technicianId: tecnicianresult.id,
                                                                    cityId: req.body.cityId[co2],
                                                                }
                                                                models.TechnicianCity.create(city).then(result => {
                                                                }).catch(error => {
                                                                    res.status(500).json({
                                                                        message: error.message,
                                                                    });
                                                                });

                                                                if (co2 == req.body.cityId.length - 1) {
                                                                    models.TechnicianTenantLevel.destroy({
                                                                        where: {
                                                                            technicianId: tecnicianresult.id,
                                                                        }
                                                                    }).then(result => {
                                                                        for (var co3 = 0; co3 <= req.body.tenantId.length - 1; co3++) {
                                                                            var tenantLevel = {
                                                                                technicianId: tecnicianresult.id,
                                                                                tenantId: req.body.tenantId[co3],
                                                                                levelId: 1
                                                                            }
                                                                            models.TechnicianTenantLevel.create(tenantLevel).then(result => {
                                                                            }).catch(error => {
                                                                                res.status(500).json({
                                                                                    message: error.message,
                                                                                });
                                                                            });

                                                                            if (co3 == req.body.tenantId.length - 1) {
                                                                                if (req.files['documents']) {
                                                                                    models.OldJob.destroy({
                                                                                        where: {
                                                                                            technicianId: tecnicianresult.id,
                                                                                        }
                                                                                    }).then(result => {

                                                                                        for (var co4 = 0; co4 <= req.files['picture'].length - 1; co4++) {
                                                                                            const oldJobsPicture = {
                                                                                                picture: "uploads/oldJobsPics/" + req.files['picture'][co4].filename,
                                                                                                technicianId: tecnicianresult.id,
                                                                                            }
                                                                                            models.OldJob.create(oldJobsPicture).then(updatedresult => {
                                                                                            }).catch(error => {
                                                                                                res.status(500).json({
                                                                                                    message: error.message
                                                                                                });
                                                                                            });
                                                                                            if (co4 == req.files['picture'].length - 1) {
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
                                                                                        };
                                                                                    }).catch(error => {
                                                                                        res.status(500).json({
                                                                                            message: error.message
                                                                                        });
                                                                                    });
                                                                                } else {
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
                                                                            }
                                                                        };
                                                                    }).catch(error => {
                                                                        res.status(500).json({
                                                                            message: error.message,
                                                                        });
                                                                    });
                                                                }
                                                            };
                                                        }).catch(error => {
                                                            res.status(500).json({
                                                                message: error.message,
                                                            });
                                                        });
                                                    }
                                                };
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

function update(req, res) {
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gps => {
        models.User.findOne({
            attributes: ['id', 'countryDialCodeMobile', 'mobile'], where: { countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile, [Op.not]: [{ id: req.params.id }] },
        }).then(uresult => {
            if (uresult) {
                res.status(409).json({
                    message: uresult.mobile + " already exists!",
                });
            } else {
                models.Technician.findOne({
                    attributes: ['id', 'nicNumber'], where: { nicNumber: req.body.nicNumber, [Op.not]: [{ id: req.params.technicianId }] }
                }).then(tresult => {
                    if (tresult) {
                        res.status(409).json({
                            message: tresult.nicNumber + " already exists!",
                        });
                    } else {
                        const userData = {
                            cityId: req.body.cityId,
                            fname: req.body.fname,
                            lname: req.body.lname,
                            email: req.body.email,
                            dob: req.body.dob,
                            address: req.body.address,
                            gpLocation: gps.gpLocation,
                            countryDialCodeMobile: req.body.countryDialCodeMobile,
                            mobile: req.body.mobile,
                            countryDialCodeTell: req.body.countryDialCodeTell,
                            tell: req.body.tell,
                            allowSearchInJobCreate: req.body.allowSearchInJobCreate
                        }
                        models.User.update(userData, {
                            where: {
                                id: req.params.id,
                            }
                        }).then(userresult => {
                            const technician = {
                                educationLevelId: req.body.educationLevelId,
                                nicNumber: req.body.nicNumber,
                                noOfWorkers: req.body.noOfWorkers,
                                averageMonthlyWork: req.body.averageMonthlyWork,
                            }
                            models.Technician.update(technician, {
                                where: {
                                    id: req.params.technicianId,
                                }
                            }).then(tecnicianresult => {
                                models.Experience.destroy({
                                    where: {
                                        technicianId: req.params.technicianId,
                                    }
                                }).then(edresult => {
                                    for (let co = 0; co <= req.body.experience.length - 1; co++) {
                                        var experience = {
                                            technicianId: req.params.technicianId,
                                            jobTypeId: req.body.experience[co].jobTypeId,
                                            experienceYear: req.body.experience[co].experienceYear,
                                            experienceMonth: req.body.experience[co].experienceMonth,
                                        }
                                        models.Experience.create(experience).then(result => {
                                        }).catch(error => {
                                            res.status(500).json({
                                                message: error.message,
                                            });
                                        });
                                        if (co == req.body.experience.length - 1) {
                                            models.TechnicianCity.destroy({
                                                where: {
                                                    technicianId: req.params.technicianId,
                                                }
                                            }).then(result => {
                                                for (var co2 = 0; co2 <= req.body.technicianCity.length - 1; co2++) {
                                                    var city = {
                                                        technicianId: req.params.technicianId,
                                                        cityId: req.body.technicianCity[co2].cityId,
                                                    }
                                                    models.TechnicianCity.create(city).then(result => {
                                                    }).catch(error => {
                                                        res.status(500).json({
                                                            message: error.message,
                                                        });
                                                    });
                                                    if (co2 == req.body.technicianCity.length - 1) {
                                                        models.TechnicianTenantLevel.destroy({
                                                            where: {
                                                                technicianId: req.params.technicianId,
                                                            }
                                                        }).then(result => {
                                                            for (var co3 = 0; co3 <= req.body.technicianTenantLevel.length - 1; co3++) {
                                                                var tenantLevel = {
                                                                    technicianId: req.params.technicianId,
                                                                    tenantId: req.body.technicianTenantLevel[co3].tenantId,
                                                                    levelId: req.body.technicianTenantLevel[co3].levelId
                                                                }
                                                                models.TechnicianTenantLevel.create(tenantLevel).then(result => {
                                                                }).catch(error => {
                                                                    res.status(500).json({
                                                                        message: error.message,
                                                                    });
                                                                });
                                                                if (co3 == req.body.technicianTenantLevel.length - 1) {
                                                                    res.status(200).json({
                                                                        message: userresult,
                                                                    });
                                                                }
                                                            };
                                                        }).catch(error => {
                                                            res.status(500).json({
                                                                message: error.message,
                                                            });
                                                        });
                                                    }
                                                };
                                            }).catch(error => {
                                                res.status(500).json({
                                                    message: error.message,
                                                });
                                            });
                                        }
                                    };
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

function updateStatus(req, res) {
    models.Technician.findOne({
        attributes: ['id', 'userId'],
        where: { id: req.params.id }
    }).then(tresult => {
        const userData = {
            userStatusId: req.body.userStatusId,
        }
        models.User.update(userData, {
            where: {
                id: tresult.userId,
            }
        }).then(updateResult => {
            const technicianJobs = {
                status: 0,
            }
            models.TechnicianJobs.update(technicianJobs, {
                where: { technicianId: req.params.id }
            }).then(resulttechnicianJobs => {
                res.status(200).json({
                    message: updateResult,
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

function view(req, res) {
    let reviewCount = 0;
    let totalCompletedJobs = 0;
    let totalRating = 0;
    let excellent = 0;
    let good = 0;
    let average = 0;
    let poor = 0;
    let bad = 0;
    var reviewHtml = [];
    models.Technician.findOne({
        attributes: ['id', 'nicNumber', 'nicFrontpicture', 'nicBackpicture', 'noOfWorkers', 'averageMonthlyWork', 'qrImage', 'source'],
        include:
            [
                {
                    model: models.EducationLevel, attributes: ['id', 'name']
                },
                {
                    model: models.User, attributes: ['id', 'title', 'fname', 'lname', 'email', 'dob', 'countryDialCodeMobile', 'mobile', 'countryDialCodeTell', 'tell', 'address', 'picture', 'allowSearchInJobCreate'],
                    include:
                        [
                            {
                                model: models.City, attributes: ['id', 'name'],
                                include:
                                    [
                                        {
                                            model: models.District, attributes: ['id', 'name']
                                        }
                                    ]
                            },
                            {
                                model: models.UserStatus, attributes: ['id', 'name']
                            }
                        ]
                },
                {
                    model: models.Experience, attributes: ['id', 'experienceYear', 'experienceMonth'],
                    include:
                        [
                            {
                                model: models.JobType, attributes: ['id', 'name']
                            }
                        ]
                },
                {
                    model: models.TechnicianCity, attributes: ['id'],
                    include:
                        [
                            {
                                model: models.City, attributes: ['id', 'name'],
                                include:
                                    [
                                        {
                                            model: models.District, attributes: ['id', 'name']
                                        }
                                    ]
                            }
                        ]
                },
                {
                    model: models.TechnicianTenantLevel, attributes: ['id', 'status'],
                    include:
                        [
                            {
                                model: models.Level, attributes: ['id', 'name']
                            },
                            {
                                model: models.Tenant, attributes: ['id', 'name', 'logo']
                            }
                        ]
                },
                {
                    model: models.OldJob, attributes: ['id', 'picture']
                },
                {
                    model: models.TechnicianJobs, attributes: ['id', 'technicianComment', 'userComment', 'technicianRating', 'userRating', 'status'],
                    //group: 'technicianId',
                    include:
                        [
                            {
                                model: models.JobsJobType, attributes: ['id'],
                                include:
                                    [
                                        {
                                            model: models.JobType, attributes: ['id', 'name']
                                        },
                                        {
                                            model: models.Job, attributes: ['id', 'startDate', 'budget', 'notes', 'address', 'gpLocation', 'jobStatusId'],
                                            include:
                                                [
                                                    {
                                                        model: models.City, attributes: ['id', 'name'],
                                                        include:
                                                            [
                                                                {
                                                                    model: models.District, attributes: ['id', 'name']
                                                                }
                                                            ]
                                                    },
                                                    {
                                                        model: models.JobStatus, attributes: ['id', 'name']
                                                    },
                                                    {
                                                        model: models.User, attributes: ['id', 'title', 'fname', 'lname', 'email', 'dob', 'countryDialCodeMobile', 'mobile', 'countryDialCodeTell', 'tell', 'address', 'picture'],
                                                        include:
                                                            [
                                                                {
                                                                    model: models.City, attributes: ['id', 'name'],
                                                                    include:
                                                                        [
                                                                            {
                                                                                model: models.District, attributes: ['id', 'name']
                                                                            }
                                                                        ]
                                                                },
                                                                {
                                                                    model: models.UserStatus, attributes: ['id', 'name']
                                                                }
                                                            ]
                                                    },
                                                    {
                                                        model: models.JobPicture, attributes: ['id', 'picture']
                                                    },
                                                    {
                                                        model: models.JobsJobType, attributes: ['id',],
                                                        include:
                                                            [
                                                                {
                                                                    model: models.JobType, attributes: ['id', 'name']
                                                                }
                                                            ]
                                                    }
                                                ]
                                        }
                                    ]
                            },
                            {
                                model: models.TechnicianJobStatus, attributes: ['id', 'name']
                            }
                        ],
                }
            ],
        where: { id: req.params.id }
    }).then(technicianResult => {
        if (technicianResult.TechnicianJobs.length > 0) {
            let count = 0;
            for (const technicianJobsObj of technicianResult.TechnicianJobs) {
                count += 1;
                if (technicianJobsObj.TechnicianJobStatus.id === 5) {
                    if (technicianJobsObj.JobsJobType.Job.JobStatus.id === 6) {
                        totalCompletedJobs += 1;
                        totalRating = totalRating + technicianJobsObj.userRating
                        if (technicianJobsObj.userRating == 5) {
                            excellent += 1;
                        }
                        if (technicianJobsObj.userRating == 4) {
                            good += 1;
                        }
                        if (technicianJobsObj.userRating == 3) {
                            average += 1;
                        }
                        if (technicianJobsObj.userRating == 2) {
                            poor += 1;
                        }
                        if (technicianJobsObj.userRating == 1) {
                            bad += 1;
                        }
                        if (technicianJobsObj.userComment == "" || technicianJobsObj.userComment == 'undefined' || technicianJobsObj.userComment == null) {
                        } else {
                            reviewCount += 1;
                            reviewHtml.push(technicianJobsObj.userComment)
                        }
                    }
                }
                if (count == technicianResult.TechnicianJobs.length) {
                    res.status(200).json({
                        message: { technicianResult, totalRating, totalCompletedJobs, excellent, good, average, poor, bad, reviewCount, reviewHtml }
                        //message: technicianResult
                    });
                }
            }
        } else {
            res.status(200).json({
                message: { technicianResult, totalRating, totalCompletedJobs, excellent, good, average, poor, bad, reviewCount, reviewHtml }
                //message: technicianResult
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function updateProfilePicture(req, res, next) {
    models.Technician.findOne({
        attributes: ['userId'],
        where: { id: req.params.id }
    }).then(technicianResult => {
        if (req.files['profilePicture']) {
            const user = {
                picture: "uploads/profilePics/" + req.files['profilePicture'][0],
            }
            models.User.update(user, {
                where: {
                    id: technicianResult.userId,
                }
            }).then(userresult => {
                res.status(200).json({
                    message: [{
                        id: technicianResult.userId,
                        technicianId: req.params.id,
                    }],
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
}

function getProfilePicture(req, res, next) {
    models.Technician.findOne({
        attributes: ['id'],
        include:
            [
                {
                    model: models.User, attributes: ['picture'],
                }
            ],
        where: { id: req.params.id }
    }).then(technicianResult => {
        res.status(200).sendFile("/public_html/sc.rsys.a2hosted.com/" + technicianResult.User.picture);
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function removeProfilePicture(req, res, next) {
    models.Technician.findOne({
        attributes: ['userId'],
        where: { id: req.params.id }
    }).then(technicianResult => {
        const user = {
            picture: "",
        }
        models.User.update(user, {
            where: {
                id: technicianResult.userId,
            }
        }).then(userresult => {
            res.status(200).json({
                message: [{
                    id: technicianResult.userId,
                    technicianId: req.params.id,
                }],
            });
        }).catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function updateNicPictures(req, res, next) {
    models.Technician.findOne({
        attributes: ['userId'],
        where: { id: req.params.id }
    }).then(technicianResult => {
        let nicBackpicture = technicianResult.nicBackpicture;
        let nicFrontpicture = technicianResult.nicFrontpicture;
        if (req.files['nicFrontpicture'] || req.files['nicBackpicture']) {
            if (req.files['nicFrontpicture']) {
                nicFrontpicture = "uploads/nicFrontPics/" + req.files['nicFrontpicture'][0];
            }
            if (req.files['nicBackpicture']) {
                nicBackpicture = "uploads/nicBackPics/" + req.files['nicBackpicture'][0];
            }
            const techncian = {
                nicFrontpicture: nicFrontpicture,
                nicFrontpicture: nicFrontpicture
            }
            models.Technician.update(techncian, {
                where: {
                    where: { id: req.params.id }
                }
            }).then(userresult => {
                res.status(200).json({
                    message: [{
                        id: technicianResult.userId,
                        technicianId: req.params.id,
                    }],
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
}

function removeNicPictures(req, res, next) {
    models.Technician.findOne({
        attributes: ['userId'],
        where: { id: req.params.id }
    }).then(technicianResult => {
        const techncian = {
            nicFrontpicture: "",
            nicFrontpicture: ""
        }
        models.Technician.update(techncian, {
            where: {
                where: { id: req.params.id }
            }
        }).then(userresult => {
            res.status(200).json({
                message: [{
                    id: technicianResult.userId,
                    technicianId: req.params.id,
                }],
            });
        }).catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function updatePassword(req, res) {
    bcryptjs.genSalt(10, function (err, salt) {
        bcryptjs.hash(req.body.password, salt, function (err, hash) {
            const passwordData = {
                password: hash,
            }
            models.User.update(passwordData, { where: { id: req.params.id } }).then(upResult => {
                res.status(200).json({
                    message: upResult
                });
            }).catch(error => {
                res.status(500).json({
                    message: error.message
                });
            });
        });
    });
}

function updateJobStatus(req, res) {
    models.JobsJobType.findAll({
        attributes: ['id'],
        where: { jobId: req.body.jobId }
    }).then(jobsJobTypeResult => {
        for (let cou = 0; cou <= jobsJobTypeResult.length - 1; cou++) {
            const technicianJobstatus = {
                technicianJobStatusId: req.body.technicianJobStatusId,
                technicianComment: req.body.technicianComment,
                technicianRating: req.body.technicianRating
            }
            models.TechnicianJobs.update(technicianJobstatus, {
                where: { jobsJobTypeId: jobsJobTypeResult[cou].id, technicianId: req.body.technicianId }
            }).then(technicianJobsresult => {
            }).catch(error => {
                res.status(500).json({
                    message: error.message
                });
            });
            if (cou == jobsJobTypeResult.length - 1) {
                models.JobsJobType.findAll({
                    attributes: [
                        'id',
                        [
                            Sequelize.literal('(SELECT COUNT(*) FROM TechnicianJobs WHERE TechnicianJobs.jobsJobTypeId = JobsJobType.id AND TechnicianJobs.technicianJobStatusId = ' + req.body.technicianJobStatusId + ')'), 'jobCount'
                        ]
                    ],
                    where: { jobId: req.body.jobId },
                    raw: true,
                }).then(jobsJobTypeResults => {
                    let total = 0;
                    for (let i = 0; i <= jobsJobTypeResults.length - 1; i++) {
                        total = total + jobsJobTypeResults[i].jobCount;
                        if (i == jobsJobTypeResults.length - 1) {
                            if (total == jobsJobTypeResults.length) {
                                const jobstatus = {
                                    jobStatusId: (parseInt(req.body.technicianJobStatusId) + 1)
                                }
                                models.Job.update(jobstatus, {
                                    where: { id: req.body.jobId }
                                }).then(jobsresult => {
                                    res.status(200).json({
                                        message: 1,
                                    });
                                }).catch(error => {
                                    res.status(500).json({
                                        message: error.message
                                    });
                                });
                            } else {
                                continue;
                            }
                        } else {
                            continue;
                        }
                    }
                }).catch(error => {
                    res.status(500).json({
                        message: error.message,
                    });
                });
            }
        }
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function uploadOldJobsPicture(req, res) {
    for (var co = 0; co <= req.files['picture'].length - 1; co++) {
        const oldJobsPicture = {
            picture: "uploads/oldJobsPics/" + req.files['picture'][co].filename,
            technicianId: req.params.technicianId
        }
        models.OldJob.create(oldJobsPicture).then(updatedresult => {
        }).catch(error => {
            res.status(500).json({
                message: error.message
            });
        });

        if (co == req.files['picture'].length - 1) {
            res.status(200).json({
                message: 1,
            });
        }
    };
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

function getTechniciansTenants(req, res) {
    models.TechnicianTenantLevel.findAll({
        attributes: ['id', 'technicianId'],
        include: [
            {
                model: models.Tenant, attributes: ['id', 'name']
            }
        ],
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

function getBlacklistWhiteList(req, res) {
    models.TechnicianTenantLevel.findOne({
        attributes: ['id', 'status'],
        where: {
            id: req.params.id,
        }
    }).then(result => {
        res.status(200).json({
            message: result.status,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function setBlacklistWhitelist(req, res) {
    const blacklistwhotelistData = {
        reason: req.body.reason,
        status: req.body.status,
    }
    models.TechnicianTenantLevel.update(blacklistwhotelistData, {
        where: {
            id: req.params.id,
        }
    }).then(updateResult => {
        if (req.body.status == 0) {
            models.TechnicianTenantLevel.findOne({
                attributes: [
                    'id', 'technicianId', 'status'
                ],
                where: {
                    id: req.params.id,
                }
            }).then(tUResult => {
                models.TechnicianTenantLevel.findAll({
                    attributes: [
                        'id', 'technicianId', 'status'
                    ],
                    where: { technicianId: tUResult.technicianId },
                }).then(ttlResult => {

                    let total = 0;
                    for (let i = 0; i <= ttlResult.length - 1; i++) {
                        total = total + 1;
                        if (i == ttlResult.length - 1) {
                            if (total == ttlResult.length) {
                                models.Technician.findOne({
                                    attributes: ['id', 'userId'],
                                    where: { id: tUResult.technicianId }
                                }).then(tresult => {
                                    const userData = {
                                        userStatusId: 3,
                                    }
                                    models.User.update(userData, {
                                        where: {
                                            id: tresult.userId,
                                        }
                                    }).then(updateResult => {
                                        const technicianJobs = {
                                            status: 0,
                                        }
                                        models.TechnicianJobs.update(technicianJobs, {
                                            where: { technicianId: req.params.id }
                                        }).then(resulttechnicianJobs => {
                                            res.status(200).json({
                                                message: updateResult,
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
                            } else {
                                res.status(200).json({
                                    message: updateResult,
                                });
                            }
                        } else {
                            continue;
                        }
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
        } else {
            res.status(200).json({
                message: updateResult,
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function updateTechnicianTenantLevel(req, res) {
    const levels = {
        levelId: req.body.levelId,
    }
    models.TechnicianTenantLevel.update(levels, {
        where: {
            id: req.params.id,
        }
    }).then(updateResult => {
        res.status(200).json({
            message: updateResult,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

module.exports = {
    index,
    update,
    view,
    create,
    updateProfilePicture,
    updateNicPictures,
    updatePassword,
    updateJobStatus,
    uploadOldJobsPicture,
    removeOldJobsPicture,
    removeProfilePicture,
    removeNicPictures,
    updateStatus,
    getTechniciansTenants,
    getBlacklistWhiteList,
    setBlacklistWhitelist,
    updateTechnicianTenantLevel,
    getProfilePicture
}