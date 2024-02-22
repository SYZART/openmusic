const AWS = require('aws-sdk');

class StorageService {
    constructor() {
        this._S3 = new AWS.S3();
    }

    writeFile(file, meta) {
        const parameter = {
            Bucket: process.env.AWS_BUCKET_NAME, // Nama S3 Bucket
            Key: `${+new Date()}-${meta.filename}`, // Nama berkas 
            Body: file._data, // Berkas (dalam bentuk Buffer) 
            ContentType: meta.headers['content-type'], // MIME Type berkas 
        };

        return new Promise((resolve, reject) => {
            this._S3.upload(parameter, (error, data) => {
                if (error) return reject(error);

                return resolve(data.Location);
            });
        });
    }
}

module.exports = StorageService;
