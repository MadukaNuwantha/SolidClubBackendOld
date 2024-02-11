const multer = require('multer');
const path = require('path');
var mime = require('mime-types');
const generator = require('generate-password');

const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/profilePics');
    },
    filename: function (req, file, cb) {
        var randomFileName = generator.generate({
            length: 15,
            numbers: true,
            symbols: false,
            uppercase: false,
            lowercase: false,
            strict: false
        });
        cb(null, randomFileName + "-" + new Date().getTime() + "." + mime.extension(file.mimetype));
    }
});

const nicFrontStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/nicFrontPics');
    },
    filename: function (req, file, cb) {
        var randomFileName = generator.generate({
            length: 15,
            numbers: true,
            symbols: false,
            uppercase: false,
            lowercase: false,
            strict: false
        });
        cb(null, randomFileName + "-" + new Date().getTime() + "." + mime.extension(file.mimetype));
    }
});

const nicBackStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/nicBackPics');
    },
    filename: function (req, file, cb) {
        var randomFileName = generator.generate({
            length: 15,
            numbers: true,
            symbols: false,
            uppercase: false,
            lowercase: false,
            strict: false
        });
        cb(null, randomFileName + "-" + new Date().getTime() + "." + mime.extension(file.mimetype));
    }
});

const oldJobsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/oldJobsPics');
    },
    filename: function (req, file, cb) {
        var randomFileName = generator.generate({
            length: 15,
            numbers: true,
            symbols: false,
            uppercase: false,
            lowercase: false,
            strict: false
        });
        cb(null, randomFileName + "-" + new Date().getTime() + "." + mime.extension(file.mimetype));
    }
});

const JobsAttachmentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/jobAttachments');
    },
    filename: function (req, file, cb) {
        var randomFileName = generator.generate({
            length: 15,
            numbers: true,
            symbols: false,
            uppercase: false,
            lowercase: false,
            strict: false
        });
        cb(null, randomFileName + "-" + new Date().getTime() + "." + mime.extension(file.mimetype));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported files'), false);
    }
}

const attachmentFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/msword') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported files'), false);
    }
}

const profileUpload = multer({
    storage: profileStorage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

const nicFrontUpload = multer({
    storage: nicFrontStorage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

const nicBackUpload = multer({
    storage: nicBackStorage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});


const oldJobsUpload = multer({
    storage: oldJobsStorage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

const JobAttachmentUpload = multer({
    storage: JobsAttachmentStorage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: attachmentFilter
});


module.exports = {
    profileUpload,
    nicFrontUpload,
    nicBackUpload,
    oldJobsUpload,
    JobAttachmentUpload,
}