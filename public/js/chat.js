// Get socket
const socket = io();

// Connect socket
socket.on("connect", function () {
    console.log("Connected to Server!");

    // Create room
    // socket.emit("create", auth, function (err) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log("Joined MedicHive!");
    //     }
    // });
});

// Disconnect socket
socket.on("disconnect", function () {
    console.log("Disconnected from Server!");
});

// Create room (auth)
$("#auth").on("submit", (e) => {
    e.preventDefault();

    // Get auth
    const auth = $("#auth").serializeArray()[0].value;

    // Emit auth
    socket.emit("create", auth, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
});

// Send message
$("#form").on("submit", (e) => {
    e.preventDefault();

    const body = {};
    $("#form").serializeArray().forEach((inp) => {
        body[inp.name] = inp.value;
    });

    // Send message
    socket.emit("message", body, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
});

// Get status
socket.on("status", function (status) {
    // Show status
    console.log(status.status);
});


// function scrollToBottom() {
//     // Selectors
//     const messages = $("#messages");
//     const newMessage = messages.children("li:last-child");
//     // Heights
//     const clientHeight = messages.prop("clientHeight");
//     const scrollTop = messages.prop("scrollTop");
//     const scrollHeight = messages.prop("scrollHeight");
//     const newMessageHeight = newMessage.innerHeight();
//     const lastMessageHeight = newMessage.prev().innerHeight();

//     if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
//         messages.scrollTop(scrollHeight);
//     }
// }

// Connecting to a socket
// socket.on("connect", function () {
//     console.log("Connected to Server!");

//     // const params = $.deparam(window.location.search);
//     // console.log(params);

//     // socket.emit("join", function (err) {
//     //     if (err) {
//     //         alert(err);
//     //     } else {
//     //         console.log("Joined!");
//     //     }
//     // });
// });

// Disconnecting from a socket
// socket.on("disconnect", function () {
//     console.log("Disconnected from Server!");
// });

// // On receiving a new message
// socket.on("newMessage", function (message) {
//     const formattedTime = moment(message.createdAt).format("h:mm a");
//     const template = $("#message-template").html();
//     const html = Mustache.render(template, {
//         from: message.from,
//         text: message.text,
//         createdAt: formattedTime
//     });

//     $("#messages").append(html);

//     scrollToBottom();

//     // const li = $("<li></li>");
//     // li.text(`${message.from} ${formattedTime}: ${message.text}`);

//     // $("#messages").append(li);
// });

// // On receiving a new location message
// socket.on("newLocationMessage", function (message) {
//     const formattedTime = moment(message.createdAt).format("h:mm a");
//     const template = $("#location-message-template").html();
//     const html = Mustache.render(template, {
//         from: message.from,
//         url: message.url,
//         createdAt: formattedTime
//     });

//     $("#messages").append(html);

//     scrollToBottom();

//     // const li = $("<li></li>");
//     // const a = $("<a target='_blank'>My Current Location</a>");

//     // li.text(`${message.from} ${formattedTime}: `);
//     // a.attr("href", message.url);

//     // li.append(a);
//     // $("#messages").append(li);
// });

// // On receiving a new user list
// socket.on("updateUserList", function (users) {
//     const ol = $("<ol></ol>");

//     users.forEach(function (user) {
//         ol.append($("<li></li>").text(user));
//     });

//     $("#users").html(ol);
// });

// // On submitting message form
// $("#message-form").on("submit", (e) => {
//     e.preventDefault();

//     const messageTextBox = $("[name=message]");

//     socket.emit("createMessage", {
//         text: messageTextBox.val()
//     }, function () {
//         messageTextBox.val("");
//     });
// });

// const locationButton = $("#send-location");

// // On clicking location button
// locationButton.on("click", function () {
//     if (!navigator.geolocation) {
//         return alert("Geolocation not supported by your browser!");
//     }

//     locationButton.attr("disabled", "disabled").text("Sending Location....");

//     navigator.geolocation.getCurrentPosition(function (position) {
//         locationButton.removeAttr("disabled").text("Send Location");
//         socket.emit("createLocationMessage", {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//         });
//     }, function () {
//         locationButton.removeAttr("disabled").text("Send Location");
//         alert("Unable to fetch location!");
//     });
// });
