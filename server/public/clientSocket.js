/**
 * fetch đến ('/comment/:id') để có chuỗi json về các comment trong movie_id
 * sau đó chuyền sử dụng các hàm bên dưới
 */
const socket = io.connect('http://localhost:3030/');
let movie_id;
let sender_id;
let sender_name;
//khởi tạo các biến cho socket
function initComment(movie_id, user_id, user_name ) {
    movie_id = movie_id;
    sender_id = user_id;
    sender_name = user_name;
    socket.emit('joinRoom', movie_id);
}

async function submitComment() {
    // lấy ra text comment
    let comment = document.getElementById().ariaValueMax;
    await socket.emit('submitComment', {movie_id: movie_id, senderName: sender_name, sender_id: sender_id, comment: comment});
}

//thêm icon vào comment
async function submitIcon() {  
    await socket.emit('submitIcon', {movie_id: movie_id, comment_id: comment_id, icon: icon, from: sender_id});
}

/**
 * là comment chưa icon cần thay đổi
 */
async function changeIcon() {
    await socket.emit('changeIcon', {movie_id: movie_id, comment_id: comment_id, newIcon: newicon, from: sender_id});
}

async function submitRepComment() {
    await socket.emit('submitRepComment', {movie_id: movie_id, comment_id: comment_id, sender_id: sender_id, comment: comment});
}

async function submitIconRepComment() {
    await socket.emit('submitIconRepComment', {movie_id: movie_id, comment_id: comment_id, repComment_id: repComment_id, icon: icon, from: sender_id});
}

async function changeIconRepComment() {
    await socket.emit('changeIconRepComment', {movie_id: movie_id, comment_id: comment_id, repComment_id: repComment_id, from_repIcon: sender_id, newIcon: newIcon});
}

socket.on('renderComment', (data) => {  
    //render ra comment o day;
    console.log(data);
});

