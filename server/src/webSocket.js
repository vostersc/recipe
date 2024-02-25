// const WS = require('ws');

// function useWebSocket(app){
//     const wS = new WS.Server({server: app});

//     app.use((req, r, next) => {
//         req.webSocket = wS;
//         req.broadcast = broadcast;
//         return next();
//     });
// }

// function broadcast(clients, data){
//     clients.forEach(c => {
//         if(c.readyState === WebSocket.OPEN) clients.send(data);
//     });
// }

module.exports = {useWebSocket};
