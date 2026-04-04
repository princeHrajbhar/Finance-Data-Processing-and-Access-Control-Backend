export const otpTemplate = (otp: string) => {
  return `
  <div style="font-family: Arial; background:#f4f4f4; padding:20px;">
    <div style="max-width:500px; margin:auto; background:white; padding:20px; border-radius:10px;">
      
      <h2 style="text-align:center;">🔐 Verify Your Account</h2>
      
      <p style="text-align:center;">
        Use the OTP below to verify your account
      </p>

      <div style="text-align:center; margin:30px 0;">
        <span style="font-size:32px; letter-spacing:5px; font-weight:bold; color:#4CAF50;">
          ${otp}
        </span>
      </div>

      <p style="text-align:center; color:#888;">
        Valid for 5 minutes
      </p>

    </div>
  </div>
  `;
};