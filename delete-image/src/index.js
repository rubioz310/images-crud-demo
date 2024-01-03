const {S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const client = new S3Client();

const BUCKET_NAME = process.env.FILE_BUCKET_NAME;

module.exports.handler = async (event) => {
    console.log(event);

    const response = {
        statusCode: 200
    };

    try {
        const parsedBody = JSON.parse(event.body);
        const fileName = parsedBody.fileName;
        
        const params = {
            Bucket: BUCKET_NAME,
            Key: `images/${fileName}`,
        };

        const command = new DeleteObjectCommand(params)

        const deleteResult = await client.send(command)

        response.body = JSON.stringify({ message: "Successfully deleted file from S3", deleteResult });
    } catch (e) {
        console.error(e);
        response.body = JSON.stringify({ message: "Failed to delete file", errorMessage: e });
        response.statusCode = 500;
    }

    return response;
}