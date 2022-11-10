const UsersModel = require("../models/userModel");
const {
    JWT_TOKEN
} = require("../configs/configs");
var jwt = require('jsonwebtoken');
const http = require('http');
//Callback
// const index = (req,res, next) =>{
//     // return res.status(200).json({
//     //     message: 'Run users successful'
//     // })
//     UsersModel.find({}, (err, users) => {// run get postman  localhost:3000/users nhận dữ liệu gửi lên
//         // console.log(err);
//         // console.log("danh sách"+ users);
//         if(err)  next(err) //  nếu có lỗi thì chuyển đến hàm  Error handler function
//         return res.status(200).json({users})
//     })

// }

//Promises
// const index = (req,res, next) =>{
//     // return res.status(200).json({
//     //     message: 'Run users successful'
//     // })
//     UsersModel.find({}).then(user => {// find({}) tìm tất cả user
//                 return res.status(201).json({user})
//             })
//             .catch(err => next(err))

// }
// Async/await (Promises)

const index = async (req, res, next) => {
    // try{
    const users = await UsersModel.find({});
    return res.status(200).json({ users });
    // }catch(err) {next(err)}
};
//Promises

// const newUser = (req, res, next) => {
//     // console.log(req.body);
//         console.log('req.body content ', req.body)
//     // create object model
//     const newUser = new UsersModel(req.body)
//     console.log('newUser ', newUser)
//     newUser.save()
//     .then(user => {
//         return res.status(201).json({user})
//     })
//     .catch(err => next(err))
// }

//Callback
// const newUser = (req, res, next) => {

//         console.log('req.body content ', req.body)
//     // create object model
//     const newUser = new UsersModel(req.body)
//     console.log('newUser ', newUser)
//     newUser.save((err, user)=>{
//         console.log(err);
//         console.log("danh sách"+ user);
//          res.status(201).json({user}) //201 Created: Yêu cầu đã thành công và kết quả là một tài nguyên mới đã được tạo.
//     } )
// }

// (err, users)=> {// run get postman  localhost:3000/users nhận dữ liệu gửi lên
//     console.log(err);
//     console.log("danh sách"+ users);
// }

// Async/await
const newUser = async (req, res, next) => {
    // try{
    //     const newUser =  await new UsersModel(req.body)
    //     newUser.save()
    //     return res.status(201).json({user: newUser }) //201 Created: Yêu cầu đã thành công và kết quả là một tài nguyên mới đã được tạo.
    // }
    // catch(err){ next(err)}
    const newUser = new UsersModel(req.value.reqBody);
    await newUser.save();
    return res.status(201).json({ user: newUser });
};

const getUser = async (req, res, next) => {
    const { userID } = req.value.params_id;
    // console.log( 'req.params', req.params);
    // console.log( 'req.value.params_id', req.value.params_id);
    const user = await UsersModel.findById(userID);
    return res.status(200).json({ user });
};

const replaceUser = async (req, res, next) => {
    const { userID } = req.value.params_id;
    const newUser = req.value.reqBody;
    const user = await UsersModel.findByIdAndUpdate(userID, newUser);
    return res.status(200).json({ users: user });
};

const updateUser = async (req, res, next) => {
    const { userID } = req.value.params_id;
    const newUser = req.value.reqBody;
    const user = await UsersModel.findByIdAndUpdate(userID, newUser);
    return res.status(200).json({ users: user });
};

const getUserDeck = async (req, res, next) => {
    const { userID } = req.value.params_id;
    const user = await UsersModel.findById(userID).populate("decks");
    return res.status(200).json({ decks: user.decks });
};

const newUserDeck = async (req, res, next) => {
    const { userID } = req.value.params_id;
    const newDeck = new DeckSModel(req.value.reqBody);
    await newDeck.save();
    const user = await UsersModel.findById(userID);
    newDeck.owner = user;
   

    // const  newUser = new UsersModel(req.body)
    user.decks.push(newDeck._id); //user.decks.push(newDeck)
    await user.save();
    return res.status(201).json({ newDecks: newDeck });
};

// gửi mã code chứa thông tin user thông qua mã hoá
const encodedToken = (userID) => {
    return jwt.sign({ 
        iss: 'MaiKhanh',
        sub: userID, // id hoặc username
        iat: new Date().getTime(), // ngày phát hành
        exp: new Date().setDate( new Date().getDate()+3) // thời gian gia hạn 3 ngày sau
    }, JWT_TOKEN); // không biết được secretKey  => để server biết được đúng là secretKey mà server cũ generate ra
};
const SignUp = async (req, res, next) => {
    const { username,job,phone, email, password } = req.value.reqBody;
    const newUsers = new UsersModel({ username,job,phone, email, password });

    const foundUser = await UsersModel.findOne({ email });
    if (foundUser)
        return res
            .status(403)
            .json({ error: { message: " Email is already in use" } });
    await newUsers.save();
    // token nên trả vào phần header để bảo mật token
    
    const  token =  encodedToken(newUsers._id)
    res.setHeader("authentication_token", token)
    return res.status(201).json({ userRegiser: newUsers, success: true });
};
const SignIn = async (req, res, next) => {
    // console.log("SignIn Successfully");
    // console.log("req.user ",req.user);
    const  password_token =  encodedToken(req.user._id)
    res.setHeader("authentication_token", password_token)
    return res.status(201).json({ SignUpAuthentication: req.user, success: true, token:password_token });
};
// passport lấy token từ client và gửi lên server giải mã token có đúng ko ?
const Secret = async (req, res, next) => {
    const users = await UsersModel.find({});
    return res.status(200).json({ userHeader: req.user , success: true  });
};

const AuthGoogle = async (req, res, next) => {
    // console.log("AuthGoogle ",req.user); //req.user nguyen nhan do return done(null, user);
    const  auth_Google =  encodedToken(req.user._id)
    res.setHeader("auth_Google", auth_Google)
    return res.status(200).json({AuthGoogle: req.user ,  success: true });
};

const AuthFacebook = async (req, res, next) => {
    // console.log("AuthFacebook ",req.user);
    const  auth_Google =  encodedToken(req.user._id)
    res.setHeader("auth_Facebook", auth_Google)
    return res.status(200).json({AuthFacebook: req.user ,  success: true });
};

module.exports = {
    index, // có thể dùng index_object = index sử dùng tên thay thế index_object
    newUser,
    getUser,
    replaceUser,
    updateUser,
    getUserDeck,
    newUserDeck,
    SignUp,
    SignIn,
    Secret,
    AuthGoogle,
    AuthFacebook
};