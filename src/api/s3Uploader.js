import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } from '@env';
import AWS from 'aws-sdk';

// Configure AWS using values from the environment variables
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadImageToS3 = async (imageUri, fileName) => {
  console.log("imageUri", imageUri);
  console.log("fileName", fileName);

  try {
    console.log('Fetching image...');
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: fileName,
      Body: blob,
      ContentType: 'image/jpeg', // Or the actual type of your image
    };

    console.log('Uploading to S3...');
    const uploadResponse = await s3.upload(params).promise();
    console.log('Upload successful:', uploadResponse.Location);
    return uploadResponse.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};