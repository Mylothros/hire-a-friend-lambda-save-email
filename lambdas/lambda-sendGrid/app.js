const sgMail = require("@sendgrid/mail")

const sendEmailInternal = async (event) => {
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    msg = {
        to: event.email,
        from: 'hireafriend.team@gmail.com',
        templateId: process.env.SEND_GRID_TEMPLATE,
    } 
    await sgMail.send(msg);
}

exports.handler = async (event) => {
    let condition;
    let status;
    try {        
        await sendEmailInternal(event);
        condition = "Emails succeeded";
        status = 200;
    
    } catch(error) {
        console.error("Error trying send email internal: " + error.toString());  
        condition = "Emails failed";
        status = 404;
    }
    var response = {
        statusCode: status,
        headers: {
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST"
        },
        body : condition
    }
    return response;
}