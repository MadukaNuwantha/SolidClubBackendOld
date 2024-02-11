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

const technicianstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == 'profilePicture') {
            cb(null, './uploads/profilePics');
        }
        if (file.fieldname == 'nicFrontpicture') {
            cb(null, './uploads/nicFrontPics');
        }
        if (file.fieldname == 'nicBackpicture') {
            cb(null, './uploads/nicBackPics');
        }
        if (file.fieldname == 'picture') {
            cb(null, './uploads/oldJobsPics');
        }
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

const findTechnicianstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file.fieldname);
        if (file.fieldname == 'profilePicture') {
            cb(null, './uploads/profilePics');
        }
        if (file.fieldname == 'documents') {
            cb(null, './uploads/jobAttachments');
        }
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
        cb(new Error('Unsupported images'), false);
    }
}

const profileUpload = multer({
    storage: profileStorage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

const technicianUpload = multer({
    storage: technicianstorage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

const findTechnicianUpload = multer({
    storage: findTechnicianstorage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
});


module.exports = {
    profileUpload,
    technicianUpload,
    findTechnicianUpload
}