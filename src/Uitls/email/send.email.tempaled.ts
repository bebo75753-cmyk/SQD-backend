

export const template = ( 
     code:number,username:string,subject:string ):string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Confirm Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
  <div style="max-width:500px; margin:auto; background:#ffffff; border:1px solid #ddd; border-radius:8px; padding:20px; text-align:center;">
    
    <h2 style="color:#333;">Activate Your Account</h2>
      <div style="margin:20px 0; font-size:26px; font-weight:bold; letter-spacing:5px; color:#000;">
      ${code}
    </div>
     
    <p style="font-size:14px; color:#555;">
      Hello <strong>${username}</strong>,
    </p>
    
    <p style="font-size:14px; color:#555;">
      Thank you for signing up! Use the following code to verify your account:
    </p>
    
  
    <div style="margin:20px 0; font-size:26px; font-weight:bold; letter-spacing:5px; color:#000;">
      ${subject}
    </div>
    
    <p style="font-size:12px; color:#999;">
      This code is valid for 10 minutes only.
    </p>
    
    <p style="font-size:12px; color:#999; margin-top:20px;">
      If you did not request this, please ignore this email.
    </p>
    
    <hr style="margin:20px 0; border:none; border-top:1px solid #eee;" />
    
    <p style="font-size:12px; color:#aaa;">
      &copy; 2025 Route Academy. All rights reserved.
    </p>
  </div>
</body>
</html>
`;
