const models = require('../models');
const { Op, Sequelize } = require("sequelize");

function index(req, res) {
    models.Job.findAll({
        attributes: ['id', 'startDate', 'budget', 'notes', 'address', 'gpLocation', 'jobStatusId'],
        include:
            [
                {
                    model: models.User, attributes: ['id', 'title', 'fname', 'lname', 'email', 'countryDialCodeMobile', 'mobile', 'countryDialCodeTell', 'tell', 'picture'],
                },
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
                    model: models.JobsJobType, attributes: ['id'],
                    include:
                        [
                            {
                                model: models.JobType, attributes: ['name']
                            },
                        ]
                }
            ]
    }).then(resultJob => {
        res.status(200).json({
            message: resultJob,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function view(req, res) {
    models.Job.findOne({
        attributes: ['id', 'startDate', 'budget', 'notes', 'address', 'gpLocation', 'jobStatusId'],
        include:
            [
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
                                            model: models.Technician, attributes: ['id', 'nicNumber', 'nicFrontpicture', 'nicBackpicture', 'noOfWorkers', 'averageMonthlyWork', 'qrImage'],
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
                                                ],
                                        },
                                    ]
                            },
                        ]
                }
            ],
        where: { id: req.params.id }
    }).then(resultJob => {
        res.status(200).json({
            message: resultJob,
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });

}

function create(req, res) {
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gpsJob => {
        var jobGPS = gpsJob.gpLocation;
        if (req.body.gpLocation) {
            jobGPS = req.body.gpLocation
        }
        const job = {
            cityId: req.body.cityId,
            userId: req.params.id,
            budget: req.body.budget,
            startDate: req.body.startDate,
            address: req.body.address,
            gpLocation: jobGPS,
            notes: req.body.notes,
            jobStatusId: 1,
        }
        models.Job.create(job).then(resultJob => {
            for (var co = 0; co <= req.body.jobTypeId.length - 1; co++) {
                var jobsJobType = {
                    jobId: resultJob.id,
                    jobTypeId: req.body.jobTypeId[co],
                }
                models.JobsJobType.create(jobsJobType).then(jobsJobTypeResult => {
                }).catch(error => {
                    res.status(500).json({
                        message: error.message,
                    });
                });
                if (co == req.body.jobTypeId.length - 1) {
                    if (req.files['documents']) {
                        for (var co2 = 0; co2 <= req.files['documents'].length - 1; co2++) {
                            const attachments = {
                                jobId: resultJob.id,
                                picture: "uploads/jobAttachments/" + req.files['documents'][co2].filename
                            }
                            models.JobPicture.create(attachments).then(jobPictureResult => {
                            }).catch(error => {
                                res.status(500).json({
                                    message: error.message,
                                });
                            });
                            if (co2 == req.files['documents'].length - 1) {
                                res.status(200).json({
                                    message: resultJob
                                });
                            }
                        };
                    } else {
                        res.status(200).json({
                            message: resultJob
                        });
                    }
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
}

function update(req, res) {
    models.City.findByPk(req.body.cityId, { attributes: ['gpLocation'] }).then(gpsJob => {
        var jobGPS = gpsJob.gpLocation;
        if (req.body.gpLocation) {
            jobGPS = req.body.gpLocation
        }
        const job = {
            cityId: req.body.cityId,
            userId: req.params.id,
            budget: req.body.budget,
            startDate: req.body.startDate,
            address: req.body.address,
            gpLocation: jobGPS,
            notes: req.body.notes,
        }
        models.Job.update(job, {
            where: { id: req.body.jobId }
        }).then(resultJob => {
            models.JobsJobType.destroy({
                where: {
                    jobId: req.body.jobId,
                }
            }).then(result => {
                for (var co = 0; co <= req.body.jobTypeId.length - 1; co++) {
                    var jobsJobType = {
                        jobId: req.body.jobId,
                        jobTypeId: req.body.jobTypeId[co],
                    }
                    models.JobsJobType.create(jobsJobType).then(jobsJobTypeResult => {
                    }).catch(error => {
                        res.status(500).json({
                            message: error.message,
                        });
                    });
                    if (co == req.body.jobTypeId.length - 1) {
                        models.JobPicture.destroy({
                            where: {
                                jobId: req.body.jobId,
                            }
                        }).then(result => {
                            if (req.files['documents']) {
                                for (var co2 = 0; co2 <= req.files['documents'].length - 1; co2++) {
                                    const attachments = {
                                        jobId: req.body.jobId,
                                        picture: "uploads/jobAttachments/" + req.files['documents'][co2].filename
                                    }
                                    models.JobPicture.create(attachments).then(jobPictureResult => {
                                    }).catch(error => {
                                        res.status(500).json({
                                            message: error.message,
                                        });
                                    });
                                    if (co2 <= req.files['documents'].length - 1) {
                                        res.status(200).json({
                                            message: resultJob,
                                        });
                                    }
                                };
                            } else {
                                res.status(200).json({
                                    message: resultJob,
                                });
                            }
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

function technicianJobDelete(req, res) {
    models.TechnicianJobs.destroy({
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

function findTechnician(req, res) {
    models.JobsJobType.findOne({
        attributes: ['id', 'jobTypeId', 'jobId'],
        include: [{
            model: models.Job, attributes: ['id', 'cityId'],
        }],
        where: { id: req.params.id }
    }).then(resultJobsJobType => {
        models.Technician.findAll({
            attributes: ['id',],
            include: [
                { 
                    model: models.User, attributes: ['id', 'title', 'fname', 'lname', 'mobile', 'userStatusId'], 
                    where: { userStatusId: 1 } 
                },
                { 
                    model: models.Experience, attributes: ['id', 'jobTypeId'], 
                    include: [
                        {
                            model: models.JobType, attributes: ['id', 'name'], 
                        }
                    ],
                    where: { jobTypeId: resultJobsJobType.jobTypeId }
                },
                { 
                    model: models.TechnicianCity, attributes: ['id', 'cityId'], 
                    where: { cityId: resultJobsJobType.Job.cityId } 
                },
                { 
                    model: models.TechnicianTenantLevel, attributes: ['id', 'status', 'levelId'], 
                    where: { status: 1 , levelId: {[Op.gt]: 1}}
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
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function assignTechnician(req, res) {
    models.TechnicianJobs.findOne({ where: { jobsJobTypeId: req.body.jobsJobTypeId, technicianId: req.body.technicianId } }).then(findOneResult => {
        if (findOneResult) {
            res.status(409).json({
                message: "Already exists for this Job Type and Technician!",
            });
        } else {
            const technicianJob = {
                jobsJobTypeId: req.body.jobsJobTypeId,
                technicianId: req.body.technicianId,
                technicianJobStatusId: 1
            }
            models.TechnicianJobs.create(technicianJob).then(resultTechnicianJob => {
                models.JobsJobType.findOne({
                    attributes: ['jobId'],
                    where: { id: req.body.jobsJobTypeId }
                }).then(resultJobsJobType => {
                    models.JobsJobType.findAll({
                        attributes: [
                            'id',
                            [
                                Sequelize.literal('(SELECT COUNT(*) FROM TechnicianJobs WHERE TechnicianJobs.jobsJobTypeId = JobsJobType.id AND TechnicianJobs.technicianJobStatusId = 1)'), 'jobCount'
                            ]
                        ],
                        where: { jobId: resultJobsJobType.jobId },
                        raw: true,
                    }).then(jobsJobTypeResults => {
                        let count = 0; let total = 0;
                        for (const j of jobsJobTypeResults) {
                            total = total + j.jobCount;
                            count += 1;
                            if (count == jobsJobTypeResults.length) {
                                if (total == jobsJobTypeResults.length) {
                                    const jobstatus = {
                                        jobStatusId: 2
                                    }
                                    models.Job.update(jobstatus, {
                                        where: { id: resultJobsJobType.jobId }
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
        }
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });

}

function removeJob(req, res) {
    models.JobsJobType.findAll({
        attributes: ['id', 'jobTypeId', 'jobId'],
        where: { jobId: req.params.id }
    }).then(resultsJobsJobType => {
        if (resultsJobsJobType.length > 0) {
            let count = 0;
            for (var jobsJobType of resultsJobsJobType) {
                count = count + 1;
                models.TechnicianJobs.destroy({
                    where: {
                        jobsJobTypeId: jobsJobType.id,
                    }
                }).then(result => { }).catch(error => {
                    res.status(500).json({
                        message: error.message,
                    });
                });

                if (count === resultsJobsJobType.length) {
                    models.JobPicture.destroy({
                        where: {
                            jobId: req.params.id,
                        }
                    }).then(result => {
                        models.JobsJobType.destroy({
                            where: {
                                jobId: req.params.id,
                            }
                        }).then(result => {
                            models.Job.destroy({
                                where: {
                                    id: req.params.id,
                                }
                            }).then(result => {
                                res.status(200).json({
                                    message: 1
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
            }
        } else {
            models.JobPicture.destroy({
                where: {
                    jobId: req.params.id,
                }
            }).then(result => {
                models.Job.destroy({
                    where: {
                        id: req.params.id,
                    }
                }).then(result => {
                    res.status(200).json({
                        message: 1
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

module.exports = {
    index,
    update,
    view,
    create,
    technicianJobDelete,
    findTechnician,
    assignTechnician,
    removeJob
}