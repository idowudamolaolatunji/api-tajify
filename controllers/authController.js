const crypto = require("crypto")
const otpEmail = require('../emails/templates/otpEmail');
const User = require('../models/userModel');
const { asyncWrapper } = require('../utils/handlers');
const { generateOtp, signToken } = require('../utils/helpers');
const sendEmail = require('../utils/sendEmail');



exports.signupUser = asyncWrapper(async function(req, res) {
    const { firstname, lastname, email, password, passwordConfirm } = req.body;

    // CHECK IF THE EMAIL ALREADY EXISTS
    const emailExist = await User.findOne({ email });
    if(emailExist) return res.json({ message: 'Email already exist!!' });

    // GENERATE OTP AND EMAIL MESSAGE
    const otp = generateOtp();
    const emailOtpMessage = otpEmail(otp, firstname);

    // CREATE USER
    const newUser = await User.create({
        firstname,
        lastname, 
        email: email.trim(),
        password, 
        passwordConfirm,
        otpCode: otp,
    });

    // SEND BACK A RESPONSE 
    res.status(201).json({
        status: 'success',
        message: 'Account created successfully!',
        data: { user: { 
            name: newUser.firstname, email: newUser.email, expiresIn: newUser.otpExpiresIn
        }}
    });

    // SEND OTP EMAIL
    await sendEmail({
        email: newUser.email,
        subject: 'OTP Verification Code',
        message: emailOtpMessage
    })
});


exports.loginUser = asyncWrapper(async function (req, res) {
    const { email, password } = req.body;

    // FIND THE USER AND DO SOME CHECKINGS 
    const user = await User.findOne({ email: email.trim() }).select('+password');
    if(!user) return res.json({ message: 'Account does not or no longer exist!' });
    if(!user.isActive) return res.json({ message: 'Account is inactive or disabled.' });
    if (!user.isOtpVerified) return res.json({ message: 'Account not verified.' });
        
    // COMPARE THE USER PASSWORD AND CHECK IF THE EAMIL IS CORRECT
    const comparedPassword = await user.comparePassword(password, user.password)
    if(!user.email || !comparedPassword) return res.json({ message: 'Email or password incorrect!'});

    // SIGNING ACCESS TOKEN
    const token = signToken(user._id);

    // SEND BACK RESPONSE 
    res.status(200).json({
        status: 'success',
        message: 'Login successful!',
        data: { user },
        token
    });
});


exports.verifyOtp = asyncWrapper(async function(req, res) {
    const { email, otp } = req.body;

    // FIND USER AND DO SOME CHECKINGS 
    const user = await User.findOne({ email }).select('+otpCode');
    if(!user) return res.json({ message: 'No user with this email' });

    const { isOTPExpired } = user?.isOTPExpired();
    if(user.isOtpVerified) return res.json({ message: 'Account alreadty verified!' });
    if(isOTPExpired) return res.json({ message: 'OTP Expired, Request new OTP!'});
    if(+otp !== user.otpCode) return res.json({ message: 'Invalid OTP code!' });

    // UPDATE USER OTP
    user.isOtpVerified = true;
    user.otpCode = undefined;
    await user.save({ validateBeforeSave: false });

    // SEND BACK RESPONSE
    res.status(200).json({
        status: 'success',
        message: 'OTP verified!',
        data: { user }
    });
});


exports.requestOtp = asyncWrapper(async function(req, res) {
    const { email } = req.body;

    // FIND USER AND DO SOME CHECKINGS
    const user = await User.findOne({ email });
    if(!user) return res.json({ message: 'No user with this email' });

    // DO SOME OTP CHECKINGS..
    const { isOTPExpired, remainingSec } = user?.isOTPExpired();
    if(user.isOtpVerified) return res.json({ message: 'Account alreadty verified!' });
    if(!isOTPExpired) return res.json({
        message: `OTP not yet expired, Remains ${remainingSec}+ seconds..`
    });

    // GENERATE NEW OTP CODE
    const otp = generateOtp();
    const emailOtpResendMessage = otpEmail(otp, user.firstname);
    user.otpIssuedAt = Date.now();
    user.otpCode = otp;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'OTP verification code resent!',
        data: { user: { 
            name: user.firstname, email: user.email, expiresIn: user.otpExpiresIn
        }}
    });

    await sendEmail({
        email, subject: 'OTP Verification Code Resent!',
        message: emailOtpResendMessage,
    });

});


exports.updatePassword = asyncWrapper(async function (req, res) {

    const { password, newPassword, newPasswordConfirm } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    // CHECL IF PASSWORD IS CORRECT
    const comparedPassword = await user.comparePassword(password, user.password)
    if (!comparedPassword) {
        return res.json({ message: "Your current password is wrong." });
    }
    
    // CHECK IF PASSWORD IS NOT THE SAME AS NEW PASSWORD
    const comparedPasswordWithCurrent = await user.comparePassword(newPassword, user.password)
    if (comparedPasswordWithCurrent) {
        return res.json({ message: "Previous password and new password cannot be the same." });
    }

    // UPDATE PASSWORD AND PASSWORD CONFIRM 
    // User.findByIdAndUpdate, will not work here...
    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save({ validateModifiedOnly: true });
    

    // RESIGN ACCESS TOKEN
    const token = signToken(user._id)

    // SEND BACK RESPONSE
    return res.status(201).json({
        status: "success",
        message: 'Password changed successfully!',
        data: { user },
        token,
    });

})


exports.logoutUser = asyncWrapper(async function (_, res) {
    res.status(200).json({ status: 'success' });
});


exports.forgotPassword = asyncWrapper(async function (req, res) {
    const { email } = req.body;

    // GET USER BY EMAIL SENT
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "The email address is not associated with any user account" });
    }

    // GENERATE RANDOM TOKEN
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // NOT SURE IF THIS IS NECESSARY


    // SEND EMAIL TO USER
    const resetEmail = passwordResetEmail(resetToken);

    await sendEmail({
        email: user.email,
        subject: 'Password Reset (valid for 10 min)',
        message: resetEmail
    });

    res.status(200).json({
        status: "success",
        message: "Reset password request sent!",
        data: { user }
    });
});


exports.verifyResetToken = asyncWrapper(async function(req, res) {
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ passwordResetToken: hashedToken });

    if (!user) return res.status(404).json({ message: "Token is invalid" });
    res.status(200).json({
        status: "success",
        message: "Success"
    });
});


exports.resetPassord = asyncWrapper(async function (req, res) {
    const { password, passwordConfirm } = req.body;
    const { token } = req.params;

    // GET THE USER BASED ON THE TOKEN
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    }).select('password passwordResetToken passwordResetExpires');

    // IF TOKEN HAS NOT EXPIRED, THERE IS A USER
    if (!user) return res.status(404).json({ message: "Token has expired, click forgot password again!" });

    // COMPARE PASSWORD
    const comparedPassword = await user.comparePassword(password, user.password);
    if(comparedPassword) return res.json({
        message: 'Previous password and new password cannot be the same',
    });
    
    // SET NEW PASSWORDS
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: true });

    res.status(200).json({
        status: "success",
        message: "Password reset successful",
        data: { user }
    });
});