// Express Web Application Framework
const express = require("express");
// HTTP
const http = require("http");
// Cross-Origin Resource Sharing
const cors = require("cors");
// Request Body Parsing Middleware
const bodyParser = require("body-parser");
// HelmetJS Security
const helmet = require("helmet");
// SocketIO Messaging
const socketIO = require("socket.io");
// File System
const fs = require("fs");
// Morgan Logger
const logger = require("morgan");

// #######################################################################################################################
// Communication
// Path
const path = require("path");
// Lodash
const _ = require("lodash");
// #######################################################################################################################

// Environment Configuration
require("./config/config.js");
// MongoDB Configuration
require("./db/mongoose.js");
// require("./routes/app-use.js");

// ###################################################################
// Middleware
// ###################################################################
const { authenticate } = require("./middleware/authenticate.js");
const { verify } = require("./middleware/verify.js");
// ###################################################################
// Routes
// ###################################################################
// USER
const { postUserSignUp } = require("./routes/user/crud/postUser.js");
const { getUser } = require("./routes/user/crud/getUser.js");
const { deleteUser } = require("./routes/user/crud/deleteUser.js");
const { patchUser } = require("./routes/user/crud/patchUser.js");
const { userLogin } = require("./routes/user/login.js");
const { userLogout } = require("./routes/user/logout.js");
const { userConfirmSend, userConfirmMe } = require("./routes/user/confirm.js");
const { userForgotSend, userForgotMe, userForgotReset } = require("./routes/user/forgot.js");
// ###################################################################
// USER TYPE
const { postUserData } = require("./routes/userData/crud/postUserData.js");
const { getUserData } = require("./routes/userData/crud/getUserData.js");
const { deleteUserData } = require("./routes/userData/crud/deleteUserData.js");
const { patchUserData } = require("./routes/userData/crud/patchUserData.js");
// ###################################################################
// RECORD
const { postRecord } = require("./routes/record/crud/postRecord.js");
const { getRecord } = require("./routes/record/crud/getRecord.js");
const { deleteRecord, deleteRecordById } = require("./routes/record/crud/deleteRecord.js");
const { patchRecord, patchRecordById } = require("./routes/record/crud/patchRecord.js");
// ###################################################################
// DOCUMENT
const { documentUpload } = require("./routes/document/documents-upload.js");
const { getDocuments } = require("./routes/document/documents-get.js");
const { documentDownload } = require("./routes/document/documents-download.js");
// ###################################################################
// BUYER
const { requestDataBuyer } = require("./routes/buyer/request.js");
// ###################################################################
// SELLER
const { shareDataSeller } = require("./routes/seller/share.js");
const { requestDataSeller } = require("./routes/seller/request.js");
// ###################################################################
// VERIFIER
const { shareDataVerifier } = require("./routes/verifier/share.js");
// ###################################################################

// Create Express app
const app = express();
// Create server with Express app
const server = http.createServer(app);
// Integrate socket.io with server
const io = socketIO(server);
// Define port
const port = process.env.PORT;

// Setting permission for cross origin requests
const corsOptions = {
    exposedHeaders: ["x-auth", "x-secret", "x-name", "x-type"]
};
app.use(cors(corsOptions));
// Using helmetJS middleware
app.use(helmet({
    frameguard: { action: "deny" }
}));
// Using the body-parser middleware for JSON data
app.use(bodyParser.json());
// Using the body-parser middleware for URL encoded data
app.use(bodyParser.urlencoded({ extended: true }));
// Using the logger
app.use(logger("combined", {
    stream: fs.createWriteStream("./server/logs/server.log", { flags: "a" })
}));

// app.get("/", (req, res) => res.send(`SERVER IS UP ON ${port}`));

// ###################################################################
// User Routes
app.post("/users", (req, res) => postUserSignUp(req, res));

app.get("/users", authenticate, (req, res) => getUser(req, res));

app.delete("/users", authenticate, (req, res) => deleteUser(req, res));

app.patch("/users", authenticate, (req, res) => patchUser(req, res));

app.post("/users/login", (req, res) => userLogin(req, res));

app.delete("/users/logout", authenticate, (req, res) => userLogout(req, res));

app.get("/users/confirm", authenticate, (req, res) => userConfirmSend(req, res));

app.get("/users/confirm/:secret", (req, res) => userConfirmMe(req, res));

app.get("/users/forgot", (req, res) => userForgotSend(req, res));

app.get("/users/forgot/:secret", (req, res) => userForgotMe(req, res));

app.post("/users/forgot", (req, res) => userForgotReset(req, res));
// ###################################################################
// UserData Routes
app.post("/users/me", authenticate, (req, res) => postUserData(req, res));

app.get("/users/me", authenticate, (req, res) => getUserData(req, res));

app.delete("/users/me", authenticate, (req, res) => deleteUserData(req, res));

app.patch("/users/me", authenticate, (req, res) => patchUserData(req, res));
// ###################################################################
// Record Routes
app.post("/record", authenticate, (req, res) => postRecord(req, res));

app.get("/record", authenticate, (req, res) => getRecord(req, res));

app.delete("/record", authenticate, (req, res) => deleteRecord(req, res));

app.patch("/record", authenticate, (req, res) => patchRecord(req, res));

app.delete("/record/:id", authenticate, (req, res) => deleteRecordById(req, res));

app.patch("/record/:id", authenticate, (req, res) => patchRecordById(req, res));
// ###################################################################
// Document Routes
app.post("/upload", authenticate, (req, res) => documentUpload(req, res));

app.get("/downloads", authenticate, (req, res) => getDocuments(req, res));

app.get("/download/:id", authenticate, (req, res) => documentDownload(req, res));
// ###################################################################
// Check isVerified
// SENT
// BUYER
// REQUEST(SELLER) -> key     BUY,key ++++++++++

// SELLER
// REQUEST(VERIFIER) -> auth, email     REQUEST ---------
// VERIFY(VERIFIER) -> auth, email, data    VERIFY,data
// SHARE(BUYER) -> auth, data       SHARE,data ++++++++++

// VERIFIER
// ISSUE(SELLER) -> auth, email     ISSUE,data
// VERIFY(SELLER) -> auth, email       VERIFY

// RECEIVE
// BUYER
// SHARE(SELLER) -> Accept ++++++++++

// SELLER
// ISSUE(VERIFIER) -> Accept, Reject
// VERIFY(VERIFIER) -> Send, Reject     VERIFY,data
// REQUEST(BUYER) -> send , reject    BUY,key

// VERIFIER
// REQUEST(SELLER) -> Check Database, Issue, Reject     ISSUE, data
// VERIFY(SELLER) -> Verify, Reject     VERIFY
// Buyer
app.post("/request/b", authenticate, verify, (req, res) => requestDataBuyer(req, res));
// ###################################################################
// Seller
app.post("/share/s", authenticate, verify, (req, res) => shareDataSeller(req, res));
app.post("/request/s", authenticate, verify, (req, res) => requestDataSeller(req, res));
// ###################################################################
// Verifier
app.post("/share/v", authenticate, verify, (req, res) => shareDataVerifier(req, res));
// ###################################################################

// #######################################################################################################################
// // Communication
// // User Model
// const { User } = require("./models/user.js");

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

//     // io.to("ROOM").emit("updateUserList", users.getUserList(params.room));

//     // socket.emit("newMessage", generateMessage("Admin", "Welcome to the ChatApp!"));

//     // socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined the ChatRoom!`));

//     // socket.on("createMessage", (message, callback) => {
//     //     const user = users.getUser(socket.id);

//     //     if (user && isRealString(message.text)) {
//     //         io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
//     //     }

//     //     callback();
//     // });

//     // socket.on("createLocationMessage", (coords) => {
//     //     const user = users.getUser(socket.id);

//     //     if (user) {
//     //         io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name, coords.latitude, coords.longitude));
//     //     }
//     // });
// });

// #######################################################################################################################


// ###################################################################

const listener = server.listen(port, () => {
    console.log(`Server running on port ${listener.address().port}!`);
});

// Export for testing
module.exports = { app };
