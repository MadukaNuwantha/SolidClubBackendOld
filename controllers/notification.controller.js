const models = require('../models');

function createNewUserNotification(req, res) {
    const notification = {
        userId: req.body.userId,
        type: req.body.type,
        objectId: req.body.objectId,
        subject: req.body.subject,
        message: req.body.message,
        notifier: req.body.notifier,
    }
    
}

function createNewAdminNotification(req, res) {

}

function markReadUserNotification(req, res) {
    const read = {
        status: 0
    }
    models.UserNotification.update(read, {
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
    })
}

function markAllReadUserNotification(req, res) {
    const allread = {
        status: 0
    }
    models.UserNotification.update(allread, {
        where: {
            userId: req.params.id
        }
    }).then(result => {
        res.status(200).json({
            message: result
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    })
}

function markReadAdminNotification(req, res) {
    const read = {
        status: 0
    }
    models.AdminNotification.update(read, {
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
    })
}

function markAllReadAdminNotification(req, res) {
    const allread = {
        status: 0
    }
    models.AdminNotification.update(allread).then(result => {
        res.status(200).json({
            message: result
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    })
}

module.exports = {
    createNewUserNotification,
    markReadUserNotification,
    markAllReadUserNotification,
    createNewAdminNotification,
    markReadAdminNotification,
    markAllReadAdminNotification
}