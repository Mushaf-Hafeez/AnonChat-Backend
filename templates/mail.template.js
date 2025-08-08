exports.generateAnonChatOTPEmail = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>AnonChat OTP Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          color: #333;
          padding: 0;
          margin: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          color: #09090b;
        }
        .content {
          font-size: 16px;
          line-height: 1.6;
        }
        .otp-box {
          background-color: #09090b;
          color: white;
          font-size: 24px;
          letter-spacing: 4px;
          font-weight: bold;
          text-align: center;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 14px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AnonChat</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) for verifying your email on <strong>AnonChat</strong> is:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP is valid for the next 5 minutes. Please do not share it with anyone.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} AnonChat. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

exports.generateAnonChatWelcomeEmail = (username) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Welcome to AnonChat</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          color: #333;
          padding: 0;
          margin: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          color: #09090b;
        }
        .content {
          font-size: 16px;
          line-height: 1.6;
        }
        .username {
          font-weight: bold;
          color: #09090b;
        }
        .footer {
          margin-top: 30px;
          font-size: 14px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to AnonChat 🎉</h1>
        </div>
        <div class="content">
          <p>Hello <span class="username">${username}</span>,</p>
          <p>Your account has been successfully created on <strong>AnonChat</strong>.</p>
          <p>We're excited to have you join our secure and anonymous student communication platform.</p>
          <p>If you ever need help, feel free to reach out to our support team.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} AnonChat. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};
