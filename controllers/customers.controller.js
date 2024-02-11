const Validator = require('fastest-validator');
const models = require('../models');
const bcryptjs = require('bcryptjs');
const generator = require('generate-password');
const { Op, Sequelize } = require("sequelize");

function index(req, res) {
    models.User.findAll({
        attributes: ['id', 'title', 'fname', 'lname', 'email', 'dob', 'countryDialCodeMobile', 'mobile', 'countryDialCodeTell', 'tell', 'address', 'picture', 'roleId', 'source'],
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
                },
                {
                    model: models.Job, attributes: ['id'],
                }
            ],
        // where: { roleId: 8 }
    }).then(userResult => {
        res.status(200).json({
            message: userResult
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function create(req, res) {
    var password = generator.generate({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        strict: true
    });
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gps => {
        models.User.findOne({
            attributes: ['countryDialCodeMobile', 'mobile'],
            where: { countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile }
        }).then(result => {
            if (result) {
                res.status(409).json({
                    message: result.countryDialCodeMobile + " " + result.mobile + " already exists!",
                });
            } else {
                bcryptjs.genSalt(10, function (err, salt) {
                    bcryptjs.hash(password, salt, function (err, hash) {
                        let picture = "https://dummyimage.com/400x400/d7d7d7/00000.png";
                        if (req.file.filename) {
                            picture = "uploads/profilePics/" + req.file.filename;
                        }
                        let source = 'Mobile';
                        if (req.body.source) {
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
                                message: {
                                    id: createdResult.id,
                                    fname: createdResult.fname,
                                    password: password,
                                    countryDialCodeMobile: createdResult.countryDialCodeMobile,
                                    mobile: createdResult.mobile,
                                }
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

function update(req, res) {
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gps => {
        models.User.findOne({ attributes: ['id', 'countryDialCodeMobile', 'mobile'], where: { countryDialCodeMobile: req.body.countryDialCodeMobile, mobile: req.body.mobile, [Op.not]: [{ id: req.params.id }] } }).then(result => {
            if (result) {
                res.status(409).json({
                    message: result.mobile + " already exists!",
                });
            } else {
                const userData = {
                    title: req.body.title,
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
                }
                models.User.update(userData, {
                    where: {
                        id: req.params.id,
                    }
                }).then(updateResult => {
                    res.status(200).json({
                        message: updateResult
                    });
                }).catch(error => {
                    res.status(500).json({
                        message: error.message,
                    });
                });
            }
        }).catch(error => {
            res.status(500).json({
                message: 2,
            });
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function updateStatus(req, res) {
    const userData = {
        userStatusId: req.body.userStatusId,
    }
    models.User.update(userData, {
        where: {
            id: req.params.id,
        }
    }).then(updateResult => {
        if (req.body.userStatusId != 1) {
            models.Job.findAll({
                attributes: ['id', 'jobStatusId'],
                where: { userId: req.params.id, [Op.not]: [{ jobStatusId: 5 }] }
            }).then(jobs => {
                const job = {
                    jobStatusId: 6,
                }
                models.Job.update(job, {
                    where: { userId: req.params.id, [Op.not]: [{ jobStatusId: 5 }] }
                }).then(resultJob => {
                    let count = 0;
                    for (const j of jobs) {
                        count += 1;
                        models.JobsJobType.findAll({
                            attributes: ['id', 'jobId'],
                            where: { jobId: j.id },
                        }).then(jobsJobstype => {
                            const jobjobtype = {
                                status: 0,
                            }
                            models.JobsJobType.update(jobjobtype, {
                                where: { jobId: j.id }
                            }).then(resultJobJobtype => { }).catch(error => {
                                let count2 = 0;
                                for (const jjt of jobsJobstype) {
                                    count2 += 1;
                                    const technicianJobs = {
                                        status: 0,
                                    }
                                    models.TechnicianJobs.update(technicianJobs, {
                                        where: { jobsJobTypeId: jjt.id }
                                    }).then(resulttechnicianJobs => { }).catch(error => {
                                        res.status(500).json({
                                            message: error.message,
                                        });
                                    });
                                    if (count2 == jobsJobstype.length) {
                                        break;
                                    }
                                }
                            });
                        }).catch(error => {
                            res.status(500).json({
                                message: error.message,
                            });
                        });
                        if (count == jobs.length) {
                            break;
                        }
                    }
                    res.status(200).json({
                        message: updateResult
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
                message: updateResult
            });
        }
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
    models.User.findOne({
        attributes: ['id', 'title', 'fname', 'lname', 'email', 'dob', 'countryDialCodeMobile', 'mobile', 'countryDialCodeTell', 'tell', 'address', 'picture'],
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
                                model: models.JobPicture, attributes: ['id', 'picture']
                            },
                            {
                                model: models.JobsJobType, attributes: ['id'],
                                include:
                                    [
                                        {
                                            model: models.JobType, attributes: ['id', 'name']
                                        },
                                        {
                                            model: models.TechnicianJobs, attributes: ['id', 'technicianComment', 'userComment', 'technicianRating', 'userRating'],
                                            include:
                                                [
                                                    {
                                                        model: models.TechnicianJobStatus, attributes: ['id', 'name']
                                                    },
                                                    {
                                                        model: models.Technician, attributes: ['nicNumber', 'nicFrontpicture', 'nicBackpicture', 'noOfWorkers', 'averageMonthlyWork', 'qrImage'],
                                                        include:
                                                            [
                                                                {
                                                                    model: models.EducationLevel, attributes: ['id', 'name']
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
                                                                }
                                                            ],
                                                    },
                                                ]
                                        },
                                    ]
                            }
                        ]
                }
            ],
        where: { id: req.params.id }
    }).then(userResult => {
        if (userResult.Jobs.length > 0) {
            let count = 0;
            for (const jobObj of userResult.Jobs) {
                count += 1;
                if (jobObj.JobStatus.id === 6) {
                    for (const jobsJobTypesObj of jobObj.JobsJobTypes) {
                        for (const technicianJobsObj of jobsJobTypesObj.TechnicianJobs) {
                            if (technicianJobsObj.TechnicianJobStatus.id === 5) {
                                totalCompletedJobs += 1;
                                totalRating = totalRating + technicianJobsObj.technicianRating
                                if (technicianJobsObj.technicianRating == 5) {
                                    excellent += 1;
                                }
                                if (technicianJobsObj.technicianRating == 4) {
                                    good += 1;
                                }
                                if (technicianJobsObj.technicianRating == 3) {
                                    average += 1;
                                }
                                if (technicianJobsObj.technicianRating == 2) {
                                    poor += 1;
                                }
                                if (technicianJobsObj.technicianRating == 1) {
                                    bad += 1;
                                }

                                if (technicianJobsObj.technicianComment == "" || technicianJobsObj.technicianComment == 'undefined' || technicianJobsObj.technicianComment == null) {
                                } else {
                                    reviewCount += 1;
                                    reviewHtml.push(technicianJobsObj.technicianComment)
                                }
                            }
                        };
                    };
                }

                if (count == userResult.Jobs.length) {
                    res.status(200).json({
                        message: { userResult, totalRating, totalCompletedJobs, excellent, good, average, poor, bad, reviewCount, reviewHtml }
                        //message: userResult
                    });
                }
            }
        } else {
            res.status(200).json({
                message: { userResult, totalRating, totalCompletedJobs, excellent, good, average, poor, bad, reviewCount, reviewHtml }
                //message: userResult
            });
        }
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

function updateProfilePicture(req, res, next) {
    if (req.file) {
        const user = {
            picture: "uploads/profilePics/" + req.file.filename,
        }
        models.User.update(user, {
            where: {
                id: req.params.id,
            }
        }).then(userresult => {
            res.status(200).json({
                message: userresult,
            });
        }).catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
    }
}

function removeProfilePicture(req, res, next) {
    const user = {
        picture: "",
    }
    models.User.update(user, {
        where: {
            id: req.params.id,
        }
    }).then(userresult => {
        res.status(200).json({
            message: userresult,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function updateJobStatus(req, res) {
    if (req.body.JobStatusId == 5 || req.body.JobStatusId == 6) {
        const jobstatus = {
            jobStatusId: req.body.JobStatusId
        }
        models.Job.update(jobstatus, {
            where: { id: req.body.jobId, userId: req.params.id }
        }).then(jobsresult => {
            res.status(200).json({
                message: jobsresult,
            });
        }).catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
    }
}

function updateJobsJobTypeStatus(req, res) {
    models.JobsJobType.find({
        attributes: ['id'],
        where: { jobTypeId: req.body.jobTypeId, jobId: req.body.jobId }
    }).then(jobsJobTypeResult => {
        const technicianJobstatus = {
            userComment: req.body.userComment,
            userRating: req.body.userRating
        }
        models.TechnicianJobs.update(technicianJobstatus, {
            where: { jobsJobTypeId: jobsJobTypeResult.id, technicianId: req.params.id }
        }).then(technicianJobsresult => {
            res.status(200).json({
                message: technicianJobsresult,
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

module.exports = {
    index,
    create,
    update,
    view,
    updatePassword,
    updateProfilePicture,
    updateJobStatus,
    removeProfilePicture,
    updateJobsJobTypeStatus,
    updateStatus
}