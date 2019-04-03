// FILEUPLOAD
// const fileUpload = require("express-fileupload");
// app.use(fileUpload());
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, __dirname + "/uploads");
//     },
//     filename: (req, file, callback) => {
//         callback(null, file.originalname + ",_" + req.user._id);
//     },
//     metadata: function (req, file, callback) {
//         callback(null, { originalname: file.originalname });
//     }
// });
// const storage = GridFSStorage({
//     gfs: gfs,
//     url: process.env.MONGODB_URI,
//     file: (req, file) => {
//         return {
//             filename: file.originalname,
//             metadata: req.user._id
//         };
//     }
// });
// const upload = multer({ storage: storage });


// SENDGRID
// SendGridMail
// const sgMail = require("@sendgrid/mail");
// const SENDGRID_API_KEY = "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";
// Set API key
// sgMail.setApiKey(SENDGRID_API_KEY);
// const sendConfirmationMail = (email, secret) => {
//     // Set Email
//     const message = {
//         to: email,
//         from: "no-reply@myentity.co",
//         subject: "USER CONFIRMATION",
//         html: `<strong><a href="http://www.localhost:3000/confirm?secret=${secret}">CLICK TO CONFIRM</a></strong>`
//     };
//     // Send Email
//     sgMail.send(message);
// };

// BCrypt
// bcrypt.genSalt(12, (err, salt) => {
//     // Generate hash
//     bcrypt.hash(user.password, salt, (error, hash) => {
//         // Store hash
//         user.password = hash;
//         next();
//     });
// });


// SocketIO
// // HTTP
// const http = require("http");
// // SocketIO Messaging
// const socketIO = require("socket.io");
// // Path
// const path = require("path");
// // Create server with Express app
// const server = http.createServer(app);
// // Integrate socket.io with server
// const io = socketIO(server);
// // User Model
// const { User } = require("./../models/user.js");
// app.use(express.static(path.join(__dirname, "/../public")));
// // Users Class
// class Users {
//     constructor() {
//         // Create users
//         this.users = [];
//     }
//     // Add user
//     addUser(id, _id, userType, email) {
//         // Create user
//         const user = { id, _id, userType, email };

//         // Push user
//         this.users.push(user);

//         // Return user
//         return user;
//     }
//     // Get user by socket id
//     getUser(id) {
//         // Get user
//         const user = this.users.filter(obj => obj.id === id)[0];

//         // Return
//         return user;
//     }
//     // Remove user by socket id
//     removeUser(id) {
//         // Get user
//         const user = this.getUser(id);

//         // Remove user
//         if (user) {
//             this.users = this.users.filter(obj => obj.id !== id);
//         }

//         // Return user
//         return user;
//     }
//     // Get users by room
//     getUsers(room) {
//         // Get users
//         const users = this.users.filter(user => user.room === room);

//         // Get userIds
//         const userIds = users.map(user => user._id);

//         // Return userId
//         return userIds;
//     }
// }
// // Create instance of Users class
// const users = new Users();
// // Handle messages
// const handleMessage = (from, to, message) => {
//     console.log(from, to, message);
//     if (from.userType === "s") {
//         console.log("SELLER");
//     } else if (from.userType === "b") {
//         console.log("BUYER");
//     } else if (from.userType === "v") {
//         console.log("VERIFIER");
//     }
//     return true;
// };
// // SocketIO
// io.on("connection", (socket) => {
//     console.log(`SocketID: ${socket.id}, Client Connected!`);
//     // Create room
//     socket.on("create", async (auth, callback) => {
//         try {
//             // Get user
//             const user = await User.findByToken(auth);
//             // // Check isActive
//             // if (!user.isActive) {
//             //     throw new Error();
//             // }
//             // Create/Join room
//             socket.join(user.userType);
//             // Remove existing user with same socket id
//             users.removeUser(socket.id);
//             // Add new user to users
//             users.addUser(socket.id, user._id, user.userType, user.email);
//             // Set socket.user
//             socket.user = user;
//             // Return
//             callback(null, 200);
//         } catch (err) {
//             console.log(err);
//             // Handle Error
//             callback(400);
//         }
//     });
//     socket.on("message", async (obj, callback) => {
//         try {
//             // Check auth, to, message
//             if (!obj.auth || !obj.to || !obj.message) {
//                 // Throw bad request
//                 throw new Error("BAD REQUEST");
//             }
//             // Check socket.user
//             if (!socket.user) {
//                 // Throw unauthorized error
//                 throw new Error("NOT AUTHORIZED");
//             }
//             // Check auth
//             const user = await User.findByToken(obj.auth);
//             if (user._id.equals(socket.user._id)) {
//                 const check = user.tokens.filter((token, i) => {
//                     return token.token !== socket.user.tokens[i].token;
//                 });
//                 if (check.length !== 0) {
//                     throw new Error("NOT AUTHORIZED");
//                 }
//             }
//             // Get to
//             const to = await User.findOne({ email: obj.to });
//             // Check to
//             if (!to) {
//                 // Throw not found
//                 throw new Error("BAD REQUEST");
//             }
//             // Handle message
//             const status = handleMessage(user, to, obj.message);
//             // Check message
//             if (!status) {
//                 // Throw bad request
//                 throw new Error("BAD REQUEST");
//             }
//             // Return
//             callback(null, 200);
//         } catch (err) {
//             console.log(err);
//             if (err.message === "NOT AUTHORIZED") {
//                 callback(401);
//             }
//             // if (e.message === "BAD REQUEST") {
//             //     callback(400);
//             // }
//             callback(400);
//         }
//     });
//     // Handle disconnect
//     socket.on("disconnect", () => {
//         console.log(`SocketID: ${socket.id}, Client Disconnected!`);

//         // Leave room
//         socket.leave(socket.user.email);

//         // Delete user
//         users.removeUser(socket.id);
//     });
// });
