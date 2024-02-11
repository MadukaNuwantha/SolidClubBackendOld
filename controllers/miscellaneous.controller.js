const models = require('../models');
const { Op } = require("sequelize");

function getDistricts(req, res) {
    models.District.findAll({
        attributes: ['id', 'name'],
        order: [
            ['name', 'ASC'],
        ],
        where: {
            status: 1
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

function getCitesByDistrict(req, res) {
    models.City.findAll({
        attributes: ['id', 'name', 'gpLocation'],
        order: [
            ['name', 'ASC'],
        ],
        where: {
            districtId: req.params.id,
            status: 1
        },
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

function getEducationLevels(req, res) {
    models.EducationLevel.findAll({
        attributes: ['id', 'name'],
        where: {
            status: 1
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

function getJobTypes(req, res) {
    models.JobType.findAll({
        attributes: ['id', 'name', 'description'],
        order: [
            ['name', 'ASC'],
        ],
        where: {
            status: 1
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

function getJobStatuses(req, res) {
    models.JobStatus.findAll({
        attributes: ['id', 'name'],
        where: {
            status: 1
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

function getLevels(req, res) {
    models.Level.findAll({
        attributes: ['id', 'name', 'rank'],
        order: [
            ['rank', 'ASC'],
        ],
        where: {
            status: 1,
            rank: {
                [Op.gt]: 0
            }
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

function getUserStatuses(req, res) {
    models.UserStatus.findAll({
        attributes: ['id', 'name'],
        where: {
            status: 1
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

function getRoles(req, res) {
    models.Role.findAll({
        attributes: ['id', 'name'],
        where: {
            status: 1
        }
    }).then(result => {
        res.status(201).json({
            message: result
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
}

function getTenants(req, res) {
    models.Tenant.findAll({
        attributes: ['id', 'name'],
        order: [
            ['name', 'ASC'],
        ],
        where: {
            status: 1
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

function getProductTypes(req, res) {
    models.ProductType.findAll({
        attributes: ['id', 'name'],
        order: [
            ['name', 'ASC'],
        ],
        where: {
            status: 1
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

function getStaffs(req, res) {
    models.Staff.findAll({
        attributes: ['id', 'name'],
        where: {
            status: 1
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

function getTechncianJobStatuses(req, res) {
    models.TechnicianJobStatus.findAll({
        attributes: ['id', 'name'],
        where: {
            status: 1
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

function getCountryPhoneCodes(req, res) {
    models.Country.findAll({
        where: {
            status: 1,
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

function getLevelsByTenant(req, res) {
    models.LevelCriteria.findAll({
        attributes: ['id', 'tenantId'],
        include:
            [
                {
                    model: models.Level,
                    attributes: ['id', 'name', 'rank'],
                    order: [
                        ['rank', 'ASC'],
                    ],
                    where: {
                        status: 1,
                        rank: {
                            [Op.gt]: 0
                        }
                    }
                }
            ],
        where: {
            status: 1,
            tenantId: req.params.id,
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

module.exports = {
    getDistricts,
    getCitesByDistrict,
    getEducationLevels,
    getJobTypes,
    getJobStatuses,
    getLevels,
    getUserStatuses,
    getRoles,
    getTenants,
    getProductTypes,
    getStaffs,
    getTechncianJobStatuses,
    getCountryPhoneCodes,
    getLevelsByTenant
};