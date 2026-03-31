const express =require("express");
const app  = express();
const http = require("http").createServer(app);
const io   = require("socket.io")(http);
const crypto = require('crypto');
//接続人数
var iCountUser=0;
// トークンを作成する際の秘密鍵
const SECRET_TOKEN = "abcdefghijklmn12345";
// チャット参加者一覧
const MEMBER = {};
  // ↑以下のような内容のデータが入る
  //   "socket.id": {token:"abcd", name:"foo"},
  //   "socket.id": {token:"efgh", name:"bar"}
//ルーム
var Room1=[];
  // ↑以下のような内容のデータが入る
  //  0: {id: 0, name: 'player', chr: 0}
  //  1: {id: 1, name: 'player', chr: 0}
var Room2=[];
var Room3=[];
var nowPlay=[0,0,0]
  //デュエル開始したら1に、終了したら0にする

/**
 * "/"にアクセスがあったらindex.htmlを返却
 */
app.use(express.static("public"));

app.get("/", (req, res)=>{
//res.render("index",{text: "NodejsとExpress"});
  res.status(500).json({msg:"エラー 500"});
});

/**
 * [イベント] ユーザーが接続
 */
io.on("connection", (socket)=>{
 //ログインユーザ
 var token;
  iCountUser+=1;
  console.log('someone connected');
  io.emit('xxx', { message: iCountUser });
  (()=>{
    // トークンを作成
    token = makeToken(socket.id);
    // ユーザーリストに追加
    MEMBER[socket.id] = {token: token, name:null};
    // 本人にトークンを送付
    io.to(socket.id).emit("token", {token:token});
  })();
   
 //入場
 socket.on("join", (data)=>{
     //--------------------------
    // トークンが正しければ
    //--------------------------
    if( authToken(socket.id, data.token) ){
      // 入室OK + 現在の入室者一覧を通知
      const memberlist = getMemberList();
      io.to(socket.id).emit("join-result", {status: true, list: memberlist});

    }
    //--------------------------
    // トークンが誤っていた場合
    //--------------------------
    else{
      // 本人にNG通知
      io.to(socket.id).emit("join-result", {status: false});
    }
 });
 //ルームの状況が変化したとき・ロビーが知りたいとき
 socket.on("lobby_update", function () {
 //外部からも呼び出せるように
 LobbyUpdate();
 });
 //ルーム入場
 socket.on("join_to_room", (data)=>{
  //人数オーバー/playingなら帰っていただく
  console.log('join_to_room')
  switch(data.room){
    case 'room1':
      if(Room1.length==4 || nowPlay[0]==1){
        io.to(socket.id).emit("room-result", {status: false});
        return false;
      }
      break; 
      case 'room2':
        if(Room2.length==4 || nowPlay[1]==1){
          io.to(socket.id).emit("room-result", {status: false});
          return false;
        }
        break; 
        case 'room3':
          if(Room3.length==4 || nowPlay[2]==1){
            io.to(socket.id).emit("room-result", {status: false});
            return false;
          }
          break;    
  }
    if( authToken(socket.id, data.token) ){
    // 入室OK
    // メンバー一覧に追加
  MEMBER[socket.id].name = data.name;
  socket.join(data.room);
  switch(data.room){
  case 'room1':
      Room1.push({id:0,token:data.token,name:data.name,crest:data.crest,chr:data.chr, ready:false});
      //idを振り直す
      for (var i=0; i<Room1.length;i++){
       Room1[i].id=i;
      }
       console.log(Room1);
       io.to(socket.id).emit("room-result", {status: true, list: Room1, room: data.room});
       io.to(data.room).emit("room-update", {status: true, list: Room1, focus:0});
    break;
  case 'room2':
    Room2.push({id:0,token:data.token,name:data.name,crest:data.crest,chr:data.chr, ready:false});
    //idを振り直す
    for (var i=0; i<Room2.length;i++){
     Room2[i].id=i;
    }
     console.log(Room2);
     io.to(socket.id).emit("room-result", {status: true, list: Room2, room: data.room});
     io.to(data.room).emit("room-update", {status: true, list: Room2, focus:0});
    break;
  case 'room3':
    Room3.push({id:0,token:data.token,name:data.name,crest:data.crest,chr:data.chr, ready:false});
    //idを振り直す
    for (var i=0; i<Room3.length;i++){
     Room3[i].id=i;
    }
     console.log(Room3);
     io.to(socket.id).emit("room-result", {status: true, list: Room3, room: data.room});
     io.to(data.room).emit("room-update", {status: true, list: Room3, focus:0});
    break;
  }
  //console.log(Room1);
}else{
  // 本人にNG通知
  io.to(socket.id).emit("room-result", {status: false});
}
});
//Config
socket.on("room_config", (data)=>{
  console.log('room_config');
  io.to(data.room).emit("room-config", data.config);
});
//Ready
socket.on("ready_to_start", (data)=>{
  console.log('ready_to_start')
  var Ary=[];
  var Els;
switch(data.room){
  case 'room1':
    Ary=Room1.concat();
    Els=0;
    break;
  case 'room2':
    Ary=Room2.concat();
    Els=1;
    break;
  case 'room3':
    Ary=Room3.concat();
    Els=2;
    break;
}
switch(data.ready){
  case -1:
    //host
    var A=0;
    for(var i=1;i<Ary.length;i++){
      if(!Ary[i].ready){
        A+=1;
        break;
      }
    }
    if(A>=1){
      io.to(socket.id).emit("start-result", {status: false});
    }else{
    nowPlay[Els]=1;
    io.to(data.room).emit("start-result", {status: true});
    LobbyUpdate();
    };
    break;
  case 0:
  case 1:
    switch(data.room){
      case 'room1':
        var A=Room1.findIndex(value=>value.token==data.token);
        if(A==-1){
          console.log('token error!');
        }else{
          if(data.ready==0){Room1[A].ready=true;}else{Room1[A].ready=false;}
          io.to(socket.id).emit("ready-result", {status: true});
          io.to('room1').emit("room-update", {status: true, list: Room1, focus:1});   
        }
        break;
      case 'room2':
        var A=Room2.findIndex(value=>value.token==data.token);
        if(A==-1){
          console.log('token error!');
        }else{
          if(data.ready==0){Room2[A].ready=true;}else{Room2[A].ready=false;}
          io.to(socket.id).emit("ready-result", {status: true});
          io.to('room2').emit("room-update", {status: true, list: Room2, focus:1});   
        }
        break;
      case 'room3':
        var A=Room3.findIndex(value=>value.token==data.token);
        if(A==-1){
          console.log('token error!');
        }else{
          if(data.ready==0){Room3[A].ready=true;}else{Room3[A].ready=false;}
          io.to(socket.id).emit("ready-result", {status: true});
          io.to('room3').emit("room-update", {status: true, list: Room3, focus:1});   
        }
        break;
    }
    break;
};
});
//Setup
socket.on("setup_member", (data)=>{
  //ホストが0番目、flag1が親
  console.log(data.member.length,data);
  io.to(data.room).emit("member", data.member);
  });
  socket.on("deck_handler", (data)=>{
    //console.log(data);
    io.to(data.room).emit("deck-handler", data);
    });
//in game
  socket.on("throwed_pai", (data)=>{
      //捨て牌を共有する
      io.to(data.room).emit("throwed-pai", data);
      });
  socket.on("deck_length", (data)=>{
    //デッキ
    io.to(data.room).emit("deck-length", data);
    });
  socket.on("nuki", (data)=>{
      //抜き
      io.to(data.room).emit("nuki-pai", data);
      });
  socket.on("tumo", (data)=>{
    //ツモ
    io.to(data.room).emit("tumo-pai", data);
    });
  socket.on("ron", (data)=>{
    //ロン
    io.to(data.room).emit("ron-pai", data);
    });
  socket.on("pon", (data)=>{
    //ポン
    io.to(data.room).emit("pon-pai", data);
    });
  socket.on("skill", (data)=>{
    //スキル
    io.to(data.room).emit("skill-pai", data);
    });
  socket.on("ryukyoku", (data)=>{
    //流局
    io.to(data.room).emit("ryukyoku", data);
    });
  socket.on("game_ready", (data)=>{
    //ホスト待機
    io.to(data.room).emit("game-ready", data);
    });
  socket.on("game_over", (data)=>{
    //ガメオベラ
    console.log(data.room,data.type,'gameover');
    if(data.type==1){
    switch(data.room){
      case 'room1':
        nowPlay[0]=0;
        for(var i=1;i<Room1.length;i++){Room1[i].ready=false;}
        //console.log(data.Token,'room-update')
        io.to(socket.id).emit("room-update", {status: true, list: Room1, focus:2}); 
        break;
      case 'room2':
        nowPlay[1]=0;
        for(var i=1;i<Room2.length;i++){Room2[i].ready=false;}
        io.to(socket.id).emit("room-update", {status: true, list: Room2, focus:2}); 
        break;
      case 'room3':
        nowPlay[2]=0;
        for(var i=1;i<Room3.length;i++){Room3[i].ready=false;}
        io.to(socket.id).emit("room-update", {status: true, list: Room3, focus:2}); 
        break;
    }
    LobbyUpdate();
  }else{
    io.to(data.room).emit("game-over", data);
  }
    });
      
 //ルーム退出
 socket.on("leave_to_room", (data)=>{
    //抜ける
  io.to(socket.id).emit("leave-result", {status: false});
  console.log('leave', data.name,data.room);
  socket.leave(data.room);
  Roomleave(data.room,data.token);
});
 //接続切れイベントを設定
  socket.on("disconnect", function () {
      iCountUser-=1;
      console.log(token);
      console.log('someone disconnected');  
      //メンバーから削除
      Roomleave("room1",token);
      Roomleave("room2",token);
      Roomleave("room3",token);
      delete MEMBER[socket.id]; 
      io.emit('xxx', { message: iCountUser });
  });

    // Clientにメッセージを送信
    //setInterval(() => {
      //socket.emit('xxx', { message: iCountUser });
      //io.to('room1').emit("room-update", {status: true, list: Room1});
    //}, 1000);
});

//socket.emit⇒その人だけにお返事
//io.emit⇒全員にお返事
//io.to('room')⇒roomの人にお返事

/**
 * ←デプロイ後のポートを任せる/→3000番でサーバを起動する
 */
http.listen(process.env.PORT || 3000, ()=>{
  console.log("listening on *:3000");
});

function makeToken(id){
  const str = "aqwsedrftgyhujiko" + id;
  return( crypto.createHash("sha1").update(str).digest('hex') );
};
function authToken(socketid, token){
  return(
    (socketid in MEMBER) && (token === MEMBER[socketid].token)
  );
};
function getMemberList(){
  const list = [];
  for( let key in MEMBER ){
    const cur = MEMBER[key];
    if( cur.name !== null ){
      list.push({token:cur.count, name:cur.name});
    }
  }
  return(list);
};
function LobbyUpdate(){
  //stateはwait/full/playingを予定
  var Room=[];
  var State=["open","open","open"];
  Room.push(Room1.length);
  Room.push(Room2.length);
  Room.push(Room3.length);
  if(nowPlay[0]==1){
    if(Room1.length>0){
    State[0]="playing";
    }else{
      nowPlay[0]=0;
    }
  }else{
    if(Room1.length==4){
    State[0]="full";
      }else if(Room1.length>0){
    State[0]="wait"
  }};
  if(nowPlay[1]==1){
    if(Room2.length>0){
      State[1]="playing";
      }else{
        nowPlay[1]=0;
      }
  }else{
    if(Room2.length==4){
    State[1]="full";
      }else if(Room2.length>0){
    State[1]="wait"
  }};
  if(nowPlay[2]==1){
    if(Room3.length>0){
      State[2]="playing";
      }else{
        nowPlay[2]=0;
      }
  }else{
    if(Room3.length==4){
    State[2]="full";
      }else if(Room3.length>0){
    State[2]="wait"
  }};
  //console.log(Room,State);
io.emit("lobby-update", {room:Room,state:State});
}
function Roomleave(room,tokenV){
  //トークン同じ人をルームのリストから削除
  switch(room){
    case "room1":
      var A=Room1.findIndex(value=>value.token==tokenV);
      if(A==-1){
        console.log('token error!');
        return false;
      }else{
       Room1.splice(A,1);
      }
          //idを振り直す
          for (var i=0; i<Room1.length;i++){
            Room1[i].id=i;
           }
        console.log(Room1);   
        io.to('room1').emit("room-update", {status: true, list: Room1, focus:0});   
      break;
    case "room2":
      var A=Room2.findIndex(value=>value.token==tokenV);
      if(A==-1){
        console.log('token error!');
        return false;
      }else{
        Room2.splice(A,1);
      }
          //idを振り直す
          for (var i=0; i<Room2.length;i++){
            Room2[i].id=i;
            }
        console.log(Room2);   
        io.to('room2').emit("room-update", {status: true, list: Room2, focus:0});   
      break;
    case "room3":
      var A=Room3.findIndex(value=>value.token==tokenV);
      if(A==-1){
        console.log('token error!');
        return false;
      }else{
        Room3.splice(A,1);
      }
          //idを振り直す
          for (var i=0; i<Room3.length;i++){
            Room3[i].id=i;
            }
        console.log(Room3);   
        io.to('room3').emit("room-update", {status: true, list: Room3, focus:0});   
      break;
  }
  LobbyUpdate();
}
