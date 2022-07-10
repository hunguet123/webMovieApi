const UserModel = require('../models/user.model.js');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const { unlink } = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const AccountStatus = Object.freeze({
    NEW_ACCOUNT: "NEW_ACCOUNT",
    EXISTENT_ACCOUNT: "EXISTENT_ACCOUNT",
});


// Google Auth
const { OAuth2Client } = require('google-auth-library');
const { env } = require('process');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// [Nodemailer]
// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PWD
    },
});

// [Bcrypt]
//const saltRounds = process.env.SALT_ROUNDS;
// do không dùng được env.SALT_ROUNDS nên dùng luôn là 10
const saltRounds = 10;

// [JWT sign]
// Default algorithm: HMAC SHA256
const JWTPrivateKey = process.env.JWT_PRIVATE_KEY;

var CODE

function creatCode() {
    CODE = Math.random().toString(36).substring(2,7);
}

const TIMEOUT = 60000;

var info = {};

//===========================
class userController {

    //[GET] /user/register
    register(req, res, next) {
        res.render('register');
    }

    //[POST] /user/email/excited
    emailExcited(req, res, next) {
        const { email } = req.body;
        //Check existing username & email & phone in DB:
        UserModel.findOne({email: email}, function (err, user) {
            if (err){
                console.log(err)
            }
            else{
                if (user) {
                    res.status(200).json({
                        message: true,
                    })
                } else {
                    res.status(200).json({
                        message: false,
                    })
                }
            }
        });
    }

    // [POST] /user/register
    async submitRegister(req, res, next) {
        const { name, email, password } = req.body;
        //Check existing username & email & phone in DB:
         const user = await UserModel.findOne({ $and: [{email: email},  {email_verified: true}]});
        if (user) {
            return res.status(403).json({
                message: `name /email /phone number is already used.`,
            });
        }

        let token = jwt.sign({name: name, email: email, password: password }, JWTPrivateKey, { expiresIn: '3h' });
        res.redirect(`/user/verify/${token}`);
    }    

    //[POST] /user/email/send-code
    sendCode(req, res, next) {
        const {user} = req.body;
        const email = user.email;
        creatCode();
        
        let text = 'Nhập Code để xác minh tài khoản („• ֊ •„) \n Lưu ý: Không nhập code sẽ không đăng nhập được \n Code: ' + CODE;
        info = {
            from: {
                name: "Ánh dễ thương (◕‿◕)",
                address: process.env.GOOGLE_EMAIL,
            },
            to: `${email}`,
            subject: "BÉ ƠI NHỚ NHẬP CODE ĐI",
            text: text,
        };

        console.log(CODE);
        transporter.sendMail(info, (err,data) => {
            if (err) {
                return res.status(200).json({
                    message: 'no email on google', 
                })
            } else {
                // render ra trang nhap code nhap
                res.status(202).json({
                    message: 'da gui mai' 
                })
            }
        });
        //setInterval(creatCode(), TIMEOUT);
    }

    //[GET] /user/verify/:token
    verify(req, res, next) {
        let email, name, password;
        const { token } = req.params;
        jwt.verify(token, JWTPrivateKey, (err, payload) => {
            if (err) {
                return res.status(500).json({
                    message: `Invalid or expired token`,
                    error: err.message
                });
            }
            email = payload.email;
            name = payload.name;
            password = payload.password;
        })
        bcrypt.hash(password, saltRounds, function(err, hashedPwd) {
            res.render('verify', {token: token, 
                user: {name: name, email: email, password: hashedPwd},
            });
        });
   
    }


    // [POST] /user/activate-account/:token
    activateAccount(req, res, next) {
        // email gui ve mot ma token so sanh token voi code nhap tu ban phim
        const { code } = req.body;
        const { token } = req.params;
        if (code == CODE) {
            jwt.verify(token, JWTPrivateKey, (err, payload) => {
                if (err) {
                    return res.status(500).json({
                        message: `Invalid or expired token`,
                        error: err.message
                    });
                }
                const email = payload.email;
                const name = payload.name;
                const password = payload.password;
                bcrypt.hash(password, saltRounds, function(err, hashedPwd) {
                    // Store hash in your password DB.
                    if (err) {
                        return res.status(500).json({
                            message: `Error when hash password with bcrypt`,
                            error: err.message
                        });
                    }
                    let userRecord = new UserModel({
                        name: name,
                        email: email,
                        email_verified: true,
                        password: hashedPwd,
                    });
                    userRecord.save()
                        .then(user => {
                            console.log('saved');
                            res.status(200).json({
                                message: 'Verification successful',
                            })
                        })
                        .catch(err => {
                           console.log('lỗi khi lưu db',err);
                        });
                });

            });
        } else {
            res.status(202).json({
                message: `the code is not correct`
            });
        }
        
    }

    // [GET] /user/login
    
    login(req, res, next) {
        console.log(req.body)
        res.render('login');
    }
    

    // [POST] /user/submit-login
    verifyLogin(req, res, next) {
        let account = req.body.account;
        let password = req.body.password;
        UserModel.findOne({ email: account } )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        message: 'User not found',
                        user_data: null
                    });
                }
                //Check password in DB:
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if (!result) {
                            res.status(403).json({
                                message: 'Wrong password'
                            });
                        } else {
                            //Default algorithm: HMAC SHA256
                            let token = jwt.sign({ email: user.email }, JWTPrivateKey, { expiresIn: '3h' });
                            res.cookie('session-token', token);
                            //res.redirect('/user/profile');
                            res.status(200).json({
                                message: 'Sign in successfully',
                                user_data: user
                            })
                        }
                    });
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error when authenticating`,
                    error: err.message
                })
            })
    }

    // [POST] /user/forgot-password/send-code
    sendCodeForgotPassword(req, res, next) {
        UserModel.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: `User not found` });
                }
                const payload = { email: user.email, id: user.id };
                let token = jwt.sign(payload, JWTPrivateKey, { expiresIn: '15m' });
                
                creatCode();

                let text = 'Nhập Code để đặt lại mật khẩu („• ֊ •„) \n \n Code: ' + CODE;
                info = {
                    from: {
                        name: "Ánh dễ thương (◕‿◕)",
                        address: process.env.GOOGLE_EMAIL,
                    },
                    to: `${email}`,
                    subject: "Mã xác nhận quên mật khẩu",
                    text: text,
                };                

                transporter.sendMail(info, (err, data) => {
                    if (err) {
                        res.status(500).json({ message: `Error when sending an email`, error: err.message });
                    } else {
                        res.status(200).json({ message: `Password reset Code has been sent to user email`, token: token });
                    }
                });
            })
            .catch(err => {
                res.status(500).json({ message: `Error when findOne in DB`, error: err.message });
            });
    }

    //[POST] /user/forgot-password/verify-code
    verifyForgotPasswordCode(req, res, next) {
        const { code } = req.body;
        if (code == CODE) {
            res.status(202).json({
                message: true,
            })
        } else {
            res.status(202).json({
                message: false,
            })
        }

    }

    // [POST] /user/reset-password/
    resetPassword(req, res, next) {
        const { token, password } = req.body;
        jwt.verify(token, JWTPrivateKey, (err, payload) => {
            if (err) {
                console.log('310',err);
            }

            const id = payload.id;

            UserModel.findOne({ _id: id })
            .then(user => {
                if (!user) return res.status(404).json({ message: 'Invalid user id' });

                jwt.verify(req.params.token, JWTPrivateKey, (err) => {
                    if (err) return res.status(401).json({ message: 'Invalid or expired token' });
                    bcrypt.hash(password, saltRounds, (err, hashedPwd) => {
                        if (err) return res.json({ message: `Error when hash password with bcrypt: ${err}` });
                        UserModel.findOneAndUpdate({ _id: id }, { password: hashedPwd })
                            .then(user => {
                                res.status(200).json({
                                    message: `Update new password successfully`,
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: `Error when saving user information to DB`,
                                    error: err.message
                                });
                            });
                    })
                })
            })
            .catch((err) => {
                res.status(500).json({
                    message: `Error when findOne in DB`,
                    error: err.message
                });
            })
        })
        
    }
    

    // [GET] /user/profile
    /*renderProfile(req, res, next) {
        let user = req.user;
        res.render('profile', { user });
    }*/

    // [GET] /user/settings
    /*renderUserSettings(req, res, next) {
        let user = req.user;
        res.render('user-settings', { user });
    }*/

    // [POST] /user/update
    saveUserSettings(req, res, next) {
        const user = req.user;
        const { _id, picture } = user;
        const { username, password, given_name, gender, phone, role } = req.body;
        console.log(username, password,
            given_name, gender, phone, role);

        let filename = undefined;

        const oldFilePath = path.join(__dirname, '..', 'public', picture.name);
        if (req.file) {
            if (fs.existsSync(oldFilePath)) {
                unlink(oldFilePath, err => {
                    if (err) {
                        res.status(500).json({ message: `Error when deleting an existed image`, error: err.message });
                    }
                });
            }
            filename = req.file.filename;
        }

        console.log(username || user.username);

        UserModel.findByIdAndUpdate(_id, {
            username: username || user.username,
            password: password || user.password,
            picture: {
                name: filename || user.picture.name,
                image_url: !filename,
            },
            given_name: given_name || user.given_name,
            gender: gender || user.gender,
            phone: phone || user.phone,
            role: role || user.role
        })
            .then(user => {
                //res.redirect(`/user/profile`);
                res.status(200).json({ message: `Change user settings successfully` });
            })
            .catch(err => {
                res.status(500).json({ message: `Error when saving user settings to DB`, error: err.message });
            })
    }
    // [GET] /user/logout
    logout(req, res, next) {
        res.clearCookie('session-token');
        res.status(200).json({
            message: 'Logout successfully',
        })
    }

    // [POST] /user/get-me
    getLoggedInUserData(req, res, next) {
        const user = req.user;
        if (user) {
            res.status(200).json({
                message: 'Get user data successfully',
                user_data: user
            });
        } else {
            res.status(404).json({
                message: 'Something wrong',
                user_data: null
            })
        }
    }

    // [GET] /user/get/:id
    getUserDataById(req, res, next) {
        const user_id = req.params.id;
        UserModel.findById(user_id) 
            .then(user => {
                if (! user) {
                    return res.status(404).json({
                        message: "No user found",
                        user: null,
                        error: null,
                    })
                }
                else {
                    return res.status(200).json({
                        message: "Get user by id successfully",
                        user: user, 
                        error: null,
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "Error from server",
                    user: null,
                    error: err.message,
                })
            })
    }
    // [POST] /user/update
    updateSettings(req, res, next) {
        const user = req.user;
        const { _id, picture } = user;
        const { username, given_name, family_name, gender, phone, role } = req.body;

        let filename = undefined;

        const oldFilePath = path.join(__dirname, '..', 'public', picture.name);
        if (req.file) {
            if (fs.existsSync(oldFilePath)) {
                unlink(oldFilePath, err => {
                    if (err) {
                        res.status(500).json({ 
                            message: `Error when deleting an existed image`, 
                            error: err.message 
                        });
                    }
                });
            }
            filename = req.file.filename;
        }

        UserModel.findByIdAndUpdate(_id, {
            username: username || user.username,
            picture: {
                name: filename || user.picture.name,
                image_url: !filename,
            },
            given_name: given_name || user.given_name,
            family_name: family_name || user.family_name,
            gender: gender || user.gender,
            phone: phone || user.phone,
            role: role || user.role
        })
            .then(user => {
                res.status(200).json({ 
                    message: `Change user settings successfully`,
                    error: null,
                });
            })
            .catch(err => {
                res.status(500).json({ 
                    message: `Error when saving user settings to DB`, 
                    error: err.message 
                });
            })
    }
}

module.exports = new userController();
