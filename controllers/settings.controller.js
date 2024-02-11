const models = require('../models');
const { Op } = require("sequelize");

function jobTypeIndex(req, res) {
    models.JobType.findAll({
        attributes: ['id', 'name', 'description', 'status'],
        include:
            [
                {
                    model: models.JobTypesProductTypes, attributes: ['id'],
                    include:
                        [
                            {
                                model: models.ProductType, attributes: ['id', 'name']
                            }
                        ]
                }
            ]
    }).then(result => {
        res.status(200).json({
            message: result
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function jobTypeView(req, res) {
    models.JobType.findOne({
        attributes: ['id', 'name', 'description', 'status'],
        include:
            [
                {
                    model: models.JobTypesProductTypes, attributes: ['id'],
                    include:
                        [
                            {
                                model: models.ProductType, attributes: ['id', 'name']
                            }
                        ]
                }
            ],
        where: {
            id: req.params.id
        }
    }).then(result => {
        res.status(200).json({
            message: result
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function jobTypeCreate(req, res) {
    models.JobType.findOne({ attributes: ['id'], where: { name: req.body.name } }).then(fresult => {
        if (fresult) {
            res.status(409).json({
                message: req.body.name + " already exists!",
            });
        } else {
            const jobType = {
                name: req.body.name,
                description: req.body.description,
            }
            models.JobType.create(jobType).then(crresult => {
                models.JobTypesProductTypes.destroy({
                    where: {
                        jobTypeId: crresult.id
                    }
                }).then(result => {
                    for (var co = 0; co <= req.body.jobTypesProductTypes.length - 1; co++) {
                        var jobTypesProductTypes = {
                            jobTypeId: crresult.id,
                            productTypeId: req.body.jobTypesProductTypes[co].productTypeId,
                        }
                        models.JobTypesProductTypes.create(jobTypesProductTypes).then(result => {
                        }).catch(error => {
                            res.status(500).json({
                                message: error.message,
                            });
                        });

                        if (co == req.body.jobTypesProductTypes.length - 1) {
                            res.status(200).json({
                                message: crresult
                            });
                        }
                    };

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
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

function jobTypeUpdate(req, res) {
    models.JobType.findOne({ attributes: ['id'], where: { name: req.body.name, [Op.not]: [{ id: req.params.id }] } }).then(fresult => {
        if (fresult) {
            res.status(409).json({
                message: req.body.name + " already exists!",
            });
        } else {
            const jobType = {
                name: req.body.name,
                description: req.body.description,
                status: req.body.status,
            }
            models.JobType.update(jobType, {
                where: {
                    id: req.params.id
                }
            }).then(upresult => {
                models.JobTypesProductTypes.destroy({
                    where: {
                        jobTypeId: req.params.id
                    }
                }).then(result => {
                    for (var co = 0; co <= req.body.jobTypesProductTypes.length - 1; co++) {
                        var jobTypesProductTypes = {
                            jobTypeId: req.params.id,
                            productTypeId: req.body.jobTypesProductTypes[co].productTypeId,
                        }
                        models.JobTypesProductTypes.create(jobTypesProductTypes).then(result => {
                        }).catch(error => {
                            res.status(500).json({
                                message: error.message,
                            });
                        });
                        if (co == req.body.jobTypesProductTypes.length - 1) {
                            res.status(200).json({
                                message: upresult
                            });
                        }
                    };
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
    }).catch(error => {
        res.status(500).json({
            message: error.message,
        });
    });
}

//================================================================

function levelIndex(req, res) {
    models.Level.findAll({
        attributes: ['id', 'name', 'description', 'rank', 'editable', 'status'],
        include:
            [
                {
                    model: models.LevelsJobTypes, attributes: ['id'],
                    include:
                        [
                            {
                                model: models.JobType, attributes: ['id', 'name']
                            }
                        ]
                }
            ],
    }).then(result => {
        res.status(200).json({
            message: result
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function levelView(req, res) {
    models.Level.findOne({
        attributes: ['id', 'name', 'description', 'rank', 'status', 'editable'],
        include:
            [
                {
                    model: models.LevelsJobTypes, attributes: ['id'],
                    include:
                        [
                            {
                                model: models.JobType, attributes: ['id', 'name']
                            }
                        ]
                }
            ],
        where: {
            id: req.params.id
        }
    }).then(result => {
        res.status(200).json({
            message: result
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function levelCreate(req, res) {
    models.Level.findOne({ attributes: ['name'], where: { name: req.body.name } }).then(fresult => {
        if (fresult) {
            res.status(409).json({
                message: req.body.name + " already exists!",
            });
        } else {
            models.Level.findOne({ attributes: ['rank'], where: { rank: req.body.rank } }).then(fresult => {
                if (fresult) {
                    res.status(409).json({
                        message: "rank already exists!",
                    });
                } else {
                    const level = {
                        name: req.body.name,
                        description: req.body.description,
                        rank: req.body.rank,
                        status: 1,
                    }
                    models.Level.create(level).then(crresult => {
                        models.LevelsJobTypes.destroy({
                            where: {
                                LevelId: crresult.id
                            }
                        }).then(result => {
                            for (var co = 0; co <= req.body.levelsJobTypes.length - 1; co++) {
                                var levelsJobTypes = {
                                    LevelId: crresult.id,
                                    jobTypeId: req.body.levelsJobTypes[co].jobTypeId,
                                }
                                models.LevelsJobTypes.create(levelsJobTypes).then(result => {
                                }).catch(error => {
                                    res.status(500).json({
                                        message: error.message,
                                    });
                                });
                                if (co == req.body.levelsJobTypes.length - 1) {
                                    res.status(200).json({
                                        message: crresult
                                    });
                                }
                            };
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

function levelUpdate(req, res) {
    models.Level.findOne({ attributes: ['id', 'name'], where: { name: req.body.name, [Op.not]: [{ id: req.params.id }] } }).then(fresult => {
        if (fresult) {
            res.status(409).json({
                message: req.body.name + " already exists!",
            });
        } else {
            models.Level.findOne({ attributes: ['id', 'rank'], where: { rank: req.body.rank, [Op.not]: [{ id: req.params.id }] } }).then(fresult => {
                if (fresult) {
                    res.status(409).json({
                        message: "rank already exists!",
                    });
                } else {
                    const level = {
                        name: req.body.name,
                        description: req.body.description,
                        rank: req.body.rank,
                        status: req.body.status,
                    }
                    models.Level.update(level, {
                        where: {
                            id: req.params.id
                        }
                    }).then(upresult => {
                        models.LevelsJobTypes.destroy({
                            where: {
                                LevelId: req.params.id
                            }
                        }).then(result => {
                            for (var co = 0; co <= req.body.levelsJobTypes.length - 1; co++) {
                                var levelsJobTypes = {
                                    LevelId: req.params.id,
                                    jobTypeId: req.body.levelsJobTypes[co].jobTypeId,
                                }
                                models.LevelsJobTypes.create(levelsJobTypes).then(result => {
                                }).catch(error => {
                                    res.status(500).json({
                                        message: error.message,
                                    });
                                });
                                if (co == req.body.levelsJobTypes.length - 1) {
                                    res.status(200).json({
                                        message: upresult
                                    });
                                }
                            };
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

//================================================================

function levelCriteriaIndex(req, res) {
    models.LevelCriteria.findAll({
        attributes: ['id', 'name', 'expectedOutComes', 'status'],
        include:
            [
                {
                    model: models.Level, attributes: ['id', 'name', 'rank'],
                },
                {
                    model: models.Tenant, attributes: ['id', 'name']
                }
            ]
    }).then(result => {
        res.status(200).json({
            message: result
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function levelCriteriaView(req, res) {
    models.LevelCriteria.findOne({
        attributes: ['id', 'name', 'expectedOutComes', 'status'],
        include:
            [
                {
                    model: models.Level, attributes: ['id', 'name'],
                },
                {
                    model: models.Tenant, attributes: ['id', 'name']
                }
            ],
        where: {
            id: req.params.id
        }
    }).then(result => {
        res.status(200).json({
            message: result
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function levelCriteriaCreate(req, res) {
    models.LevelCriteria.findOne({ attributes: ['id'], where: { levelId: req.body.levelId, tenantId: req.body.tenantId } }).then(fresult => {
        if (fresult) {
            res.status(409).json({
                message: "Already exists for this Level and Tenant!",
            });
        } else {
            const levelCriteria = {
                levelId: req.body.levelId,
                tenantId: req.body.tenantId,
                name: req.body.name,
                expectedOutComes: req.body.expectedOutComes,
                status: 1
            }
            models.LevelCriteria.create(levelCriteria).then(result => {
                res.status(200).json({
                    message: result
                });
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

function levelCriteriaUpdate(req, res) {
    models.LevelCriteria.findOne({ attributes: ['id'], where: { levelId: req.body.levelId, tenantId: req.body.tenantId, [Op.not]: [{ id: req.params.id }] } }).then(fresult => {
        if (fresult) {
            res.status(409).json({
                message: "Already exists for this Level and Tenant!",
            });
        } else {
            const levelCriteria = {
                levelId: req.body.levelId,
                tenantId: req.body.tenantId,
                name: req.body.name,
                expectedOutComes: req.body.expectedOutComes,
                status: req.body.status,
            }
            models.LevelCriteria.update(levelCriteria, {
                where: {
                    id: req.params.id
                }
            }).then(result => {
                res.status(200).json({
                    message: result
                });
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

//================================================================

module.exports = {
    jobTypeIndex,
    jobTypeView,
    jobTypeCreate,
    jobTypeUpdate,
    //================================================
    levelIndex,
    levelView,
    levelCreate,
    levelUpdate,
    //================================================
    levelCriteriaIndex,
    levelCriteriaView,
    levelCriteriaCreate,
    levelCriteriaUpdate
}