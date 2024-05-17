const AWS = require("aws-sdk");

const lambda = new AWS.Lambda({ region: "us-east-1" });

const upload = async (data) => {
  try {
    const s3 = new AWS.S3({ region: "us-east-1" });
    const bucketName = 'hire-a-friend-emails';
    const objectKey = 'emails-' + process.env.STAGE + '.json';

    try {
      await s3.headObject({ Bucket: bucketName, Key: objectKey }).promise();
    } catch (e) {
      try {
        await s3.putObject({
          Bucket: bucketName,
          Key: objectKey,
          Body: data,
          ContentType: "application/json",
        }).promise();
        return;
      } 
      catch(e) {
        throw e;
      }
    }
    const existingData = await s3.getObject({ Bucket: bucketName, Key: objectKey }).promise();
    const existingDataBody = existingData.Body.toString('utf-8');
    const updatedData = existingDataBody + '\n' + data;
    await s3.putObject({
      Bucket: bucketName,
      Key: objectKey,
      Body: updatedData,
      ContentType: "application/json",
    }).promise();
  } catch (e) {
    throw e;
  }
};

const invokeSendGridLambda = async (data) => {
  const params = {
    FunctionName: "hire-a-friend-send-grid",
    InvocationType: "Event",
    Payload: data
  };

  try {
    await lambda.invoke(params).promise();
  } catch (e) {
    console.error("Error invoking Lambda function: ", e);
    throw e;
  }
}

exports.lambdaHandler = async (event) => {
  try {
    const allowedOrigins = ['https://www.hireafriend.co', 'https://hireafriend.co'];
    const origin = event.headers.origin;
    console.log(allowedOrigins, origin)
    // if (event.httpMethod !== "POST" || !event.body || !allowedOrigins.includes(origin)) {
    //   throw new Error("Invalid request: Expected a POST request with a non-empty body.");
    // }
    
    if (allowedOrigins.includes(origin)) {
        
      const data = event.body;
      await upload(data);
      await invokeSendGridLambda(data);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers" : "*",
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
        body: JSON.stringify({ message: "Data uploaded successfully" }),
      };
    }
    else {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Headers" : "*",
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
        body: JSON.stringify({ error: error.message || "Internal Server Error" }),
      };
    }
  } catch (error) {
    console.error("Error: ", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers" : "*",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST,OPTIONS"
    },
      body: JSON.stringify({ error: error.message || "Internal Server Error" }),
    };
  }
};
