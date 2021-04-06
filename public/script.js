const socket = io("/");
const myPeer = new Peer(undefined, { host: "/", port: 3001 });
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");

//mute own video stream
myVideo.muted = true;

//stream video on connection
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
    socket.on("user-connected", (userId) => {
      addNewUser(userId, stream);
    });
  });

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

//add new user to call
function addNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (receiveStream) => {
    addVideoStream(video, receiveStream);
  });
  call.on("close", () => {
    video.remove();
  });
}

// add user's video stream to call, add to video grid
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
