const socket = io.connect('http://localhost:3030/');
let movie_id;
let sender_id;
let sender_name;
//khởi tạo các biến cho socket
function initComment(movie_id, user_id, user_name ) {
    movie_id = movie_id;
    sender_id = user_id;
    sender_name = user_name;
    // phát sự kiện joinroom cho sever tạo room
    socket.emit('setRoom', movie_id);
}

async function submitComment() {
    // lấy ra text comment và icon 
    let comment = document.getElementById().ariaValueMax;
    let icon = document.getElementById().ariaValueText;
    await socket.emit('submitComment', {movieID: movie_id, senderID: sender_id, comment: comment, icon: icon});
}

socket.on('newComment', (data) => {
    //render ra comment o day;
    console.log(data);
});