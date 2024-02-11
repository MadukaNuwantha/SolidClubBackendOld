const models = require('../models');
const { Op } = require("sequelize");

const baseUrl = "http://common.saventures.lk/";

async function fetchTenants(req, res) {
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "savl_common_session=PFngDE8jgTrR2xPyX0LnnK8UUnZbLwwqmPtRHRE6");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    try {
        var response = await fetch(baseUrl + "api/tenant", requestOptions);
        if (response.status === 200) {
            var result = await response.json();
            var objArray = []; var listArray = []; var dbArray = [];
            for (let co = 0; co <= result.length - 1; co++) {
                objArray.push(result[co]);
                //await createTenant(result[co]);
                await models.Tenant.findOne({
                    where: { name: result[co].tenant_name }
                }).then(selectData => {
                    if (selectData) {
                        var status = 1;
                        if (result[co].status == 'Deactivated') {
                            status = 0;
                        }
                        const tenantup = {
                            t_id: result[co].t_id,
                            name: result[co].tenant_name,
                            logo: result[co].logo,
                            status: status
                        };
                        models.Tenant.update(tenantup, {
                            where: {
                                id: selectData.id,
                            }
                        }).then(resultsUp => {
                            dbArray.push(resultsUp);
                        }).catch(error => {
                            res.status(500).json({
                                message: error.message
                            });
                        });
                    } else {
                        var status = 1;
                        if (result[co].status == 'Deactivated') {
                            status = 0;
                        }
                        const tenantC = {
                            t_id: result[co].t_id,
                            name: result[co].tenant_name,
                            logo: result[co].logo,
                            status: status
                        };
                        models.Tenant.create(tenantC).then(resultsCr => {
                            listArray.push(resultsCr);
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

                if (co == result.length - 1) {
                    res.status(200).json({
                        message: {
                            objArray, listArray, dbArray
                        }
                    });
                }
            };
        } else {
            res.status(500).json({
                message: response.status
            });
        }
    } catch (e) {
        console.log('error', e);
    };
}

async function createTenant(val) {
    models.Tenant.findOne({
        where: { name: val.tenant_name }
    }).then(selectData => {
        if (selectData) {
            var status = 1;
            if (val.status == 'Deactivated') {
                status = 0;
            }
            const tenant = {
                t_id: val.t_id,
                name: val.tenant_name,
                logo: val.logo,
                status: status
            };
            models.Tenant.update(tenant, {
                where: {
                    id: selectData.id,
                }
            }).then(results => {
                return new Promise((resolve) => setTimeout(resolve, 500));
            }).catch(error => {
                res.status(500).json({
                    message: error.message
                });
            });
        } else {
            var status = 1;
            if (val.status == 'Deactivated') {
                status = 0;
            }
            const tenantC = {
                t_id: val.t_id,
                name: val.tenant_name,
                logo: val.logo,
                status: status
            };
            models.Tenant.create(tenantC).then(results => {
                //return new Promise((resolve) => setTimeout(resolve, 500));
                res.status(500).json({
                    message: results
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

async function fetchProductTypes(req, res) {
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "savl_common_session=PFngDE8jgTrR2xPyX0LnnK8UUnZbLwwqmPtRHRE6");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    try {
        var response = await fetch(baseUrl + "api/productType", requestOptions);
        if (response.status === 200) {
            var result = await response.json();
            let count = 0;
            for (const val of result) {
                count += 1;
                await createProductType(val);
                if (count == result.length) {
                    res.status(200).json({
                        message: 1
                    });
                }
            };
        } else {
            console.log('error');
        }
    } catch (e) {
        console.log('error', e);
    };
}

async function createProductType(val) {
    models.ProductType.findOne({
        attributes: ['id'],
        where: { id: val.id }
    }).then(selectData => {
        if (selectData) {
            const productType = {
                name: val.title,
            };
            models.ProductType.update(productType, {
                where: {
                    id: val.id,
                }
            }).then(result => {
                return new Promise((resolve) => setTimeout(resolve, 500));
            }).catch(error => {
                console.log(error.message);
            });
        } else {
            const productType = {
                id: val.id,
                name: val.title,
            };
            models.ProductType.create(productType).then(result => {
                return new Promise((resolve) => setTimeout(resolve, 500));
            }).catch(error => {
                console.log(error.message);
            });
        }
    }).catch(error => {
        console.log(error.message);
    });
}

module.exports = {
    fetchTenants,
    fetchProductTypes
}