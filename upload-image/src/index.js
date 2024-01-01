const {S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const client = new S3Client();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async (event) => {
    console.log(event);

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Successfully uploaded file to S3" }),
    };

    try {
        const parsedBody = JSON.parse(event.body);
        const base64File = parsedBody.file;
        const decodedFile = Buffer.from(base64File, "base64");
        
        const params = {
            Bucket: BUCKET_NAME,
            Key: `images/${new Date().toISOString()}.jpeg`,
            Body: decodedFile,
            ContentType: "image/jpeg",
        };

        const command = new PutObjectCommand(params)

        const uploadResult = await client.send(command)

        response.body = JSON.stringify({ message: "Successfully uploaded file to S3", uploadResult });
    } catch (e) {
        console.error(e);
        response.body = JSON.stringify({ message: "File failed to upload", errorMessage: e });
        response.statusCode = 500;
    }

    return response;
}