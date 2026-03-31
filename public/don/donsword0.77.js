// var1.21　season2 UI
// npm run dev
// 国士無双で進行不能になる？
// 魔界血戦後に操作不能になる
window.onload = function(){
  draw();
  };
  
  function draw(){
  var titletext="v1.2/Click to START";
  var debugmode=false;  //コンソールログの表示の切り替え/テストプレイ用　リリース時にfalseに
  if(debugmode){titletext+="　でばっぐも～ど"};
  var today = new Date();
  var fool=false;
  if((today.getMonth()+1==4)&&(today.getDate()>=1)&&(today.getDate()<=30)){
    fool=true;
    titletext+="　えいぷりるふ～る";
  }
  //epril fool
  (function () {
    var wait = 1500,
      standby = true,
      command = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"],
      //command = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
      length = command.length,
      index = 0,
      timer = null;  
    document.addEventListener('keydown', function (ev) {
      if(gamestate==10 && pagestate==-1){
      // タイマーのリセット
      clearTimeout(timer);
      // コマンドの確認
      if (standby && ev.key === command[index]) {
        index++;
        if (index >= length) {
          standby = false;  // 処理中にコマンドを受け付けないようにする
          index = 0;  // コマンドリセット
          if(!fool){fool=true;}else{fool=false}
          if(fool){titletext="v1.01/Click to START　えいぷりるふ～る"}else{titletext="v1.01/Click to START"};
          se17.play();
          handleComplete();
          standby = true;
        } else {
          // 一定時間入力がなかったらリセット
          timer = setTimeout(function () {
            index = 0;
          }, wait);
        }
      } else {
        // コマンドが間違っていたらリセット
        index = 0;
      }
    }
    });
  })();
  //
    (function () {
    var wait = 1500,
      standby = true,
      command = ["d","e","b","u","g","ArrowUp","ArrowUp"],
      length = command.length,
      index = 0,
      timer = null;  
    document.addEventListener('keydown', function (ev) {
      if(gamestate==10 && pagestate==-1){
      // タイマーのリセット
      clearTimeout(timer);
      // コマンドの確認
      if (standby && ev.key === command[index]) {
        index++;
        if (index >= length) {
          standby = false;  // 処理中にコマンドを受け付けないようにする
          index = 0;  // コマンドリセット
          if(!debugmode){debugmode=true;}else{debugmode=false}
          if(debugmode){titletext="v1.01/Click to START　でばっぐも～ど"}else{titletext="v1.01/Click to START"};
          se17.play();
          handleComplete();
          standby = true;
        } else {
          // 一定時間入力がなかったらリセット
          timer = setTimeout(function () {
            index = 0;
          }, wait);
        }
      } else {
        // コマンドが間違っていたらリセット
        index = 0;
      }
    }
    });
  })();
  //自分自身の情報を入れる箱
  var IAM = {
    token: null,    // 戸別管理用のトークン
    name: null,     // 名前
    room: 0,     // ルーム 123
    mwah: 0,        // ホストでない場合に何個ずらすか
    is_join: true,  // 入室中？
    is_ready: 0 // 0 1レディ
  };
  // メンバー一覧を入れる箱
  var MEMBER = [];
  //  例：{name:"マスター",chr:0,score:50000,turnflag:0,pc:1},
  var memberlist=[];
  const RoomName=[0,"room1","room2","room3"]
  var Roomlist1=[];
  var Roomlist2=[];
  var Roomlist3=[];
  function IsHost(room=1){
  //リストIDが0の人をホストとする
  switch(room){
    case 1:
    var A=Roomlist1.findIndex(value =>value.token==IAM.token);
    if(A==-1){
      console.log('roomlist1 error!');
    }else{
      if(Roomlist1[A].id==0){
        return true;
      }else{
        return false;
      }
    }
  break;
  case 2:
    var A=Roomlist2.findIndex(value =>value.token==IAM.token);
    if(A==-1){
      console.log('roomlist2 error!');
    }else{
      if(Roomlist2[A].id==0){
        return true;
      }else{
        return false;
      }
    }
  break;
  case 3:
    var A=Roomlist3.findIndex(value =>value.token==IAM.token);
    if(A==-1){
      console.log('roomlist3 error!');
    }else{
      if(Roomlist3[A].id==0){
        return true;
      }else{
        return false;
      }
    }
  break;
   default:
    console.log('IsHost error!',room)
    return false;
    break;
  }};
  //接続
  const socket = io();
  socket.on('connect', () => {
    console.log('connect');
  });
  /**
   * [イベント] トークンが発行されたら
   */
  socket.on("token", (data)=>{
    // トークンを保存
    IAM.token = data.token;
  });
  //
  var RoomAry=[];//ルーム人数表示テキスト
  var RoomConfigAry=[];//ルーム内の設定ボタン等テキスト
  //接続人数を受け取る 変化していれば反映する
  socket.on('lobby-update',(data)=>{
    //room:Room,state:State
    RoomNum=data.room.concat();
    RoomState=data.state.concat();
    if(pagestate==6 && msgstate==0){
      var k=0;
      for(var i=0;i<3;i++){
        RoomAry[k].text="人数："+RoomNum[i]+"/4";
        RoomAry[k+1].text="状態："+RoomState[i];
        k+=2;
       }
    }
  });
  socket.on('xxx', (data)=>{
    if(Usercount !== data.message){
    Usercount=data.message;
    if(pagestate==6 && msgstate==0){
      Textlist[1].text="現在の接続人数："+Usercount;
    }}
    });
  var mouseX;
  var mouseY;
  var Usercount=0;
  var RoomNum=[0,0,0];
  var RoomState=["open","open","open"];
  var Savetitle =new Array("This is savedata of <https://azurelsword.web.fc2.com/ronan.html>",0,0);
  var mute="ON"
  var Username = "player";
  var UsernameText = new createjs.Text(Username, "24px Arial", "white");
  var Usercrest = "称号なし";
  const canvas = document.getElementById("canvas0");//ベースレイヤ。背景、置物
  var canvas1 = document.getElementById("canvas1");//立ち絵,捨てパイ
  var canvas2 = document.getElementById("canvas2");//パイ、ボタン
  var canvas3 = document.getElementById("canvas3");//カーソル、
  var canvas4 = document.getElementById("canvas4");//残パイ、アニメーション用
  var canvas5 = document.getElementById("canvas5");//カーソルのアニメーション
    if ( ! canvas || ! canvas.getContext ) { return false; }
    var cx = canvas.getContext("2d");
    var cx1 = canvas1.getContext("2d");
    var cx2 = canvas2.getContext("2d");
    var cx3 = canvas3.getContext("2d");
    var cx4 = canvas4.getContext("2d");
    var cx5 = canvas5.getContext("2d");
    // canvasのサイズの実験
    function ResizeWindow(){
    var window_scaleX = (window.innerWidth-20) / 800;
    var window_scaleY = (window.innerHeight-20) / 600;
    var window_scale=Math.min(window_scaleX,window_scaleY)
    canvas.width=800*window_scale;
    canvas.height=600*window_scale;
    canvas1.width=800*window_scale;
    canvas1.height=600*window_scale;
    canvas2.width=800*window_scale;
    canvas2.height=600*window_scale;
    canvas3.width=800*window_scale;
    canvas3.height=600*window_scale;
    canvas4.width=800*window_scale;
    canvas4.height=600*window_scale;
    canvas5.width=800*window_scale;
    canvas5.height=600*window_scale;
    stage.scaleX=window_scale;
    stage.scaleY=window_scale;
    }
    var stage = new createjs.Stage(canvas5);//Stage
    ResizeWindow();
    var w = window.innerWidth
    window.addEventListener('resize', () => {
      if (w == window.innerWidth) return
      w = window.innerWidth
      ResizeWindow();
    })
    if (createjs.Touch.isSupported() == true) {
      createjs.Touch.enable(stage);
      //タップに対応するがcanvas.addeventlistenerが効かなくなる？→mouseXの修正で一部解決
      }
    stage.enableMouseOver();//onmouseイベントに対応
    var backyard = new createjs.Container();//背景の緑芝
    stage.addChild(backyard);
    var field = new createjs.Container();//タイトル、メイン画面
    stage.addChild(field);
    var textmap = new createjs.Container();//メッセージ
    textmap.alpha=0;
    stage.addChild(textmap);
    var guidemap = new createjs.Container();//ラテ欄
    stage.addChild(guidemap);
    var yakumap = new createjs.Container();//シナジー表示
    stage.addChild(yakumap);
      var yakumapMask = new createjs.Container();//スクロール用のインコンテナ
    var paiviewer = new createjs.Container()//パイの一覧表用
    stage.addChild(paiviewer);
      var paiviewerMask = new createjs.Container();
    var handmap = new createjs.Container();//手札/ツモ画面の描画に使用
    stage.addChild(handmap);
    var ponkanmap = new createjs.Container();//プレイ中のボタン系
    stage.addChild(ponkanmap);
    var fieldmap = new createjs.Container();//魔界血戦時のツモ画面の描画に使用
    var fieldpai = new createjs.Container();//同じ色のパイとか
    stage.addChild(fieldpai);
    var soundmap = new createjs.Container();
    stage.addChild(soundmap); //sound ミュートボタン
    //Configmap
    var Configmap = new createjs.Container();
    stage.addChild(Configmap); //設定ボタン
    var corsormap = new createjs.Container();//カーソル
    stage.addChild(corsormap);
    //テキスト欄
    var Textlist=[];
    var underText = new createjs.Bitmap("don/Don_textwindow.png");
    underText.y=520;  
    textmap.addChild(underText);
    var underText = new createjs.Text("　", "24px Arial", "black");
    underText.x=80;
    underText.y=530;
    textmap.addChild(underText);
    Textlist.push(underText);
    var underText = new createjs.Text("　", "24px Arial", "black");
    underText.x=80;
    underText.y=560;
    textmap.addChild(underText);
    Textlist.push(underText);
    var OKtext1 = new createjs.Text("OK (1)", "bold 16px 'メイリオ'", "white");
    OKtext1.x=760;
    OKtext1.y=500;
    OKtext1.textAlign="right"
    OKtext1.outline=5;
    var OKtext2 = new createjs.Text("OK (1)", "bold 16px 'メイリオ'", "black");
    OKtext2.x=760;
    OKtext2.y=500;
    OKtext2.textAlign="right"
    //残パイ枚数テキスト
    var deckText = new createjs.Text("残:", "24px 'Century Gothic'", "white");
    var tumonameA = new createjs.Text("　", "14px Arial", "white");
    var tumonameB = new createjs.Text("　", "14px Arial", "white");
    tumonameA.x=700;
    tumonameA.y=365;
    tumonameB.x=645;
    tumonameB.y=380;
    //soundボタン
    var s = createButton("　", 78, 38);
    s.x=710;
    s.y=10
    soundmap.addChild(s);
    s.addEventListener("click", {handleEvent:SoundConfig});
    var t = new createjs.Text("SOUND", "12px Arial", "#ffffff");
    t.x=720;
    t.y=12;
    soundmap.addChild(t);
    var muteshape = new createjs.Text(mute, "Bold 24px Arial", "#ffffff");
    muteshape.x=730;
    muteshape.y=22;
    soundmap.addChild(muteshape);
    soundmap.alpha=0;
    var Resultary=[]
    //クリア時アニメーションに使用
    yakumap.alpha=0;
    var yakumapY=0;
    var graphics;
  graphics=new createjs.Graphics();
  graphics
    .beginRadialGradientFill(["white","orange"],[0.0,1.0],0,0,20,0,0,100)
    .drawPolyStar(0, 0, 40, 5, 0.4, -90);
  var Cstar = new createjs.Shape(graphics);
  Cstar.x=100;
  Cstar.y=390;
  stage.addChild(Cstar); // 表示リストに追加
  var tweeNstar;
  tweeNstar=createjs.Tween.get(Cstar, {loop: true})
  .to({rotation:360},1200);
  var Csquare= new createjs.Shape();
  Csquare.graphics.beginFill("rgba(255, 255, 255, 0.7)").drawRect(0,0,145,100);
  Csquare.x=0;
  Csquare.y=0;
  var tweeNsquare;
  tweeNsquare=createjs.Tween.get(Csquare, {loop: true})
  .to({alpha:0.5},600)
  .to({alpha:0},600)
  .to({alpha:0.5},600);
  tweeNsquare.paused=true;
  Csquare.alpha=0;
  var CorsorKey;//カーソル1
  CorsorKey = new createjs.Shape();
  CorsorKey.graphics.beginStroke("#0088f0");
  CorsorKey.graphics.setStrokeStyle(5);
  CorsorKey.graphics.drawRoundRect(0,0,100,100,10,10)
  corsormap.addChild(CorsorKey);
  var tweeNcor;
  tweeNcor=createjs.Tween.get(CorsorKey, {loop: true})
  .to({alpha:1},200)
  .to({alpha:0.2},400)
  .to({alpha:1},200);
  tweeNcor.paused=true;
  CorsorKey.alpha=0;
  var Clvup = new createjs.Bitmap("don/Don_Fight.png");
  Clvup.alpha=0;
  Clvup.scale=3;
  stage.addChild(Clvup);
  var Dlvup = new createjs.Bitmap("don/Don_aurus.png");
  Dlvup.alpha=0;
  stage.addChild(Dlvup);
    //アップデートする
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick",function(){
        stage.update();
      });
    class Music extends Howl {
      constructor (data, debugStart=0) {
        const params = {
          src: [data.src],
          volume:[data.volume]*vBar,
          preload: false,
          // オーデイオスプライト設定
          sprite: {
            start: [debugStart, data.loopEnd-debugStart],
            loop: [data.loopStart, data.loopEnd - data.loopStart, true],
          },
        };
        super(params);
        this.load();
      }
      playMusic () {
        this.play("start");
        this.once('end', ()=> {
          if(debugmode){console.log('bgm loop!')};
          this.play("loop");
        });
      }
    }
  var LP =new Array(0,75000,75000,75000,75000);
  //LP[0]:0->半荘150000/スキルあり 1->半荘300000/スキルあり 2->ミリオネア 3->無限 4->血戦
  var LPtextlist=[];//HPテキスト
  var LPtemp=new Array(0,0,0,0,0)
  var chara =new Array(0,0,0,0,0)
  //mpmove
  var Fever =-1;//fever->未使用
  var Reverse = false;//回転巡
  var HiddenChara =3;//chrlist管理
  //ルーム設定
  var LP_PVP={Length:[1,"東風","半荘",],LP:[1,75000,150000,300000],Block:[1,"満貫あり","満貫なし"],Rule:[1,"サバイバル","デスマッチ","魔界血戦"],Skill:[1,"スキル禁止","スキルあり"]};
  var mpmoving=false;
  var mpC=0;
  var ManaBreak=0;
  var pvpmode=0;
  var raidscore=new Array(0,0,0,0,0);//魔界ルールで使用 0->終了時1に 1->和了回数 2->1けっかはっぴょう 2
  var drawcard;
  var Cskillprepare=[0,0,0,0,0];
  //chara0 0->cpuランダム 1->cpu決める
  //MPゲージ0-30 DPlist->create用 0->マナブレゲージ
  var DP=new Array(0,0,0,0,0)
  var DPlist=new Array(0,0,0,0,0)
  //バフ 1スキン 2マナシールド 3ネイチャ 4ナソコア 5やけど 6凍結 7適応力
  //11~修羅の戦で和了済みの人
  var Buff =new Array(0,[],[],[],[])
  var Bufflist =new Array(0,[],[],[],[])
  var mode=0
  var musicnum=0
  var musictemp=0;//ランダム再生時
  var musicset=new Array(0,0,0);
  //通常時、自分の立直時、オーラス時
  var musicrandom=[[1,2,5,6,7],[3,8,9,11],[4,10,12]];
  //ランダム向けプレイリスト
  var vBar=1;
  var sBar=1;
  //音量調節機能を追加
  var shiagytemp=0;
  //0->一覧 1->所持パイのみ
  var auras=0;
  //オーラスの時1　現在音楽のみに影響
  var Ronturn=[];
  //データベース
  var LPlist=new Array("一般","ヘル","デスマッチ","∞","魔界血戦")
  var musiclist=new Array("ランダム","盲目のアストライア","Nine Jack","The Evil Sacrifice Archenemies","ロベリア","夜の迷宮の入口","決闘のテーマ","エルの樹の麓","リーチっぽい音楽","竜の道","ウォーリーの城メドレー","歎きの塔Phase3","狂乱のコンサート","リーチっぽい音楽R")
  var chrlist=new Array("名無しさん","エルス","アイシャ","レナ","レイヴン","イヴ","ラシェ","アラ","エリシス","エド")//"ラビィ"
  var chrimg_src= new Array("don/Don_chara0.png","don/Don_chara1.png","don/Don_chara2.png","don/Don_chara3.png","don/Don_chara4.png","don/Don_chara5.png","don/Don_chara6.png","don/Don_chara7.png","don/Don_chara8.png","don/Don_chara9.png");
  var chrimgR_src= new Array("don/Don_chara0.png","don/Don_chara1R.png","don/Don_chara2R.png","don/Don_chara3R.png","don/Don_chara4R.png","don/Don_chara5R.png","don/Don_chara6R.png","don/Don_chara7R.png","don/Don_chara8R.png","don/Don_chara9R.png");
  //説明用
  var epic_src =new Array("don/elstudio_bg1.png","don/Don_epic1.png","don/Don_epic2.png","don/Don_epic3.png","don/Don_epic6.png","don/Don_ss11.png","don/Don_epic4.png","don/Don_epic5.png");
  //パイの裏
  var eltearB_src =new Array("don/Don_img0.png","don/Don_winbg.png");
  //donpaiのidは0から始める
  var eltear_src = new Array("don/Don_img1.png","don/Don_img2.png","don/Don_img3.png","don/Don_img4_1.png","don/Don_img4.png","don/Don_img5.png","don/Don_img6.png","don/Don_img4_2.png","don/Don_img7.png","don/Don_img8.png","don/Don_img9.png","don/Don_img4_3.png","don/Don_img10.png",);
  eltear_src.push("don/Don_img11.png","don/Don_img12.png","don/Don_img4_4.png","don/Don_img13.png","don/Don_img14.png","don/Don_img15.png","don/Don_img4_5.png","don/Don_img16.png","don/Don_img17.png","don/Don_img18.png","don/Don_img4_6.png","don/Don_img19.png","don/Don_img20.png",);
  eltear_src.push("don/Don_img21.png","don/Don_img4_7.png","don/Don_img22.png","don/Don_img23.png","don/Don_img24.png","don/Don_img4_8.png","don/Don_img25.png","don/Don_img26.png","don/Don_img27.png","don/Don_img4_9.png","don/Don_img28.png","don/Don_img29.png","don/Don_img30.png",);
  eltear_src.push("don/Don_img4_10.png","don/Don_img40.png","don/Don_img41.png","don/Don_img42.png","don/Don_img43.png","don/Don_img31.png","don/Don_img32.png","don/Don_img33.png","don/Don_img4_11.png","don/Don_img34.png","don/Don_img35.png","don/Don_img36.png","don/Don_img4_12.png","don/Don_img37.png","don/Don_img38.png","don/Don_img39.png","don/Don_img4_13.png",);
  eltear_src.push("don/Don_img46.png","don/Don_img47.png","don/Don_img48.png","don/Don_img49.png");
  eltear_src.push("don/Don_imgM1.png","don/Don_imgM2.png","don/Don_imgM3.png","don/Don_imgM4.png","don/Don_imgM5.png","don/Don_imgM6.png","don/Don_imgM7.png","don/Don_imgM8.png","don/Don_img44.png","don/Don_img45.png");
  //create用
  var s;
  var ary=[];
  console.log(eltear_src.length);
  //expected 62
  //バフアイコン
  var donicon_src= new Array("don/Don_buff.png","don/Don_mbicon.png","don/Don_fever.png")
  var win_src= new Array("don/Don_menu1.png","don/Don_menu2.png","don/Don_menu3.png","don/Don_menu4.png","don/wintumo.png","don/winron.png","don/winreach.png","don/Don_Cutin.png");
  var musiclistDT=[
  {title:"ランダム",elia:"ランダムにbgmが流れます",nod:"　"},
  {title:"盲目のアストライア",elia:"ISAo",nod:"@ DOVA-SYNDROME"},
  {title:"Nine Jack",elia:"まんぼう二等兵",nod:"@ DOVA-SYNDROME"},
  {title:"The Evil Sacrifice Archenemies",elia:"ISAo",nod:"@ DOVA-SYNDROME"},
  {title:"ロベリア",elia:"まんぼう二等兵",nod:"@ DOVA-SYNDROME"},
  {title:"夜の迷宮の入口",elia:"提供",nod:"ラビィのテーマのイメージ"},
  {title:"決闘のテーマ",elia:"提供",nod:"from Elsword music <耳コピアレンジ>"},
  {title:"エルの樹の麓",elia:"提供",nod:"from Elsword music <耳コピアレンジ>"},
  {title:"リーチっぽい音楽",elia:"提供",nod:"アトラスシティーのイメージ"},
  {title:"竜の道",elia:"提供",nod:"from Elsword music <耳コピアレンジ>"},
  {title:"ウォーリーの城メドレー",elia:"提供",nod:"from Elsword music <アレンジメドレー>"},
  {title:"歎きの塔Phase3",elia:"提供",nod:"from Elsword music <耳コピアレンジ>"},
  {title:"狂乱のコンサート",elia:"提供",nod:"from Elsword music <耳コピアレンジ>"},
  {title:"リーチっぽい音楽R",elia:"提供",nod:"（おまけトラック）"},
  ]
  var skilltext=[{fir:"0",sec:"0",thr:"0"},
  {fir:"フレイムガイザー",sec:"FLAME GEYSER",thr:"0"},
  {fir:"メモライズ",sec:"MEMORIZE",thr:"0"},
  {fir:"フリージングアロー",sec:"FREEZING ARROW",thr:"0"},
  {fir:"グラウンドクラッシュ",sec:"GROUND CRUSH",thr:"0"},
  {fir:"クイーンズスローン",sec:"QUEEN'S THRONE",thr:"0"},
  {fir:"ルナティックフューリー",sec:"LINATIC FURY",thr:"0"},
  {fir:"龍牙爆砕",sec:"DRAGON ARTS 'BLAST'",thr:"0"},
  {fir:"克己-強",sec:"Iron Body - Strong",thr:"0"},
  {fir:"リバースサークル",sec:"Reverse Circle",thr:"0"},
  ]
  //name->キャラsub->職、役判定で使用　line->ライン役判定に使用 0->all　color->1234567陽水風月土火E 0->all
  var donpai=[
  {name:"エルス",sub:"ナイトエンペラー",line:1,color:1},
  {name:"エルス",sub:"ルーンマスター",line:2,color:1},
  {name:"エルス",sub:"イモータル",line:3,color:1},
  {name:"エルス",sub:"ジェネシス",line:4,color:1},
  {name:"アイシャ",sub:"エーテルセイジ",line:1,color:2},
  {name:"アイシャ",sub:"オズソーサラー",line:2,color:2},
  {name:"アイシャ",sub:"メタモルフィ",line:3,color:2},
  {name:"アイシャ",sub:"ロードアゾット",line:4,color:2},
  {name:"レナ",sub:"アネモス",line:1,color:3},
  {name:"レナ",sub:"デイブレイカー",line:2,color:3},
  {name:"レナ",sub:"トワイライト",line:3,color:3},
  {name:"レナ",sub:"プロフェテス",line:4,color:3},
  {name:"レイヴン",sub:"フューリアスブレード",line:1,color:1},
  {name:"レイヴン",sub:"レイジハーツ",line:2,color:1},
  {name:"レイヴン",sub:"ノヴァインペラトル",line:3,color:1},
  {name:"レイヴン",sub:"レヴァナント",line:4,color:1},
  {name:"イヴ",sub:"コードアルティメイト",line:1,color:4},
  {name:"イヴ",sub:"コードエセンシア",line:2,color:4},
  {name:"イヴ",sub:"コードサリエル",line:3,color:4},
  {name:"イヴ",sub:"コードアンチテーゼ",line:4,color:4},
  {name:"ラシェ",sub:"コメットクルセイダー",line:1,color:2},
  {name:"ラシェ",sub:"フェイタルファントム",line:2,color:2},
  {name:"ラシェ",sub:"センチュリオン",line:3,color:2},
  {name:"ラシェ",sub:"ディウスアエール",line:4,color:2},
  {name:"アラ",sub:"飛天",line:1,color:5},
  {name:"アラ",sub:"黒闇天",line:2,color:5},
  {name:"アラ",sub:"羅天",line:3,color:5},
  {name:"アラ",sub:"日天子",line:4,color:5},
  {name:"エリシス",sub:"エンパイアソード",line:1,color:6},
  {name:"エリシス",sub:"フレイムロード",line:2,color:6},
  {name:"エリシス",sub:"ブラッディクイーン",line:3,color:6},
  {name:"エリシス",sub:"アドレスティア",line:4,color:6},
  {name:"エド",sub:"ドゥームブリンガー",line:1,color:4},
  {name:"エド",sub:"ドミネーター",line:2,color:4},
  {name:"エド",sub:"マッドパラドックス",line:3,color:4},
  {name:"エド",sub:"オーバーマインド",line:4,color:4},
  {name:"ルシエル",sub:"カタストロフィ",line:1,color:6},
  {name:"ルシエル",sub:"イノセント",line:2,color:6},
  {name:"ルシエル",sub:"ディアンゲリオン",line:3,color:6},
  {name:"ルシエル",sub:"デメルシオ",line:4,color:6},
  {name:"ロゼ",sub:"テンペストバスター",line:1,color:3},
  {name:"ロゼ",sub:"ブラックマッサーカー",line:2,color:3},
  {name:"ロゼ",sub:"ミネルヴァ",line:3,color:3},
  {name:"ロゼ",sub:"プライムオペレーター",line:4,color:3},
  {name:"アイン",sub:"リヒター",line:1,color:7},
  {name:"アイン",sub:"ブルーヘン",line:2,color:7},
  {name:"アイン",sub:"ヘルシャー",line:3,color:7},
  {name:"アイン",sub:"ビゴット",line:4,color:7},
  {name:"ラビィ",sub:"エタニティーウィナー",line:1,color:5},
  {name:"ラビィ",sub:"ラディアントソウル",line:2,color:5},
  {name:"ラビィ",sub:"ニーシャラビリンス",line:3,color:5},
  {name:"ラビィ",sub:"ツインズピカロ",line:4,color:5},
  {name:"ノア",sub:"リベレーター",line:1,color:7},
  {name:"ノア",sub:"セレスティア",line:2,color:7},
  {name:"ノア",sub:"ニュクスピエタ",line:3,color:7},
  {name:"ノア",sub:"モルペウス",line:4,color:7},
  {name:"リティア",sub:"ジェムブリス",line:1,color:5},
  {name:"リティア",sub:"アヴァリス",line:2,color:5},
  {name:"リティア",sub:"アクリュース",line:3,color:5},
  {name:"リティア",sub:"ミスチーフ",line:4,color:5},
  {name:"ガイア",sub:"マスターロード",line:1,color:5},
  {name:"デニフ",sub:"マスターロード",line:2,color:2},
  {name:"ロッソ",sub:"マスターロード",line:3,color:6},
  {name:"イベルン",sub:"マスターロード",line:4,color:7},
  {name:"ソーレス",sub:"マスターロード",line:1,color:1},
  {name:"アドリアン",sub:"マスターロード",line:2,color:4},
  {name:"ベントス",sub:"マスターロード",line:3,color:3},
  {name:"ハルニエ",sub:"マスターロード",line:4,color:7},
  {name:"アリエル",sub:"コボ",line:0,color:0},
  {name:"ルリエル",sub:"コボ",line:0,color:0},
  ]
  for(var i=0; i<donpai.length;i++){
    donpai[i].id=i;
  }
  console.log(donpai.length);//70
  //han ->必要な枚数 han2 翻数
  var Sinagy=[
    {id:"貫徹する足取り",chr:[24],han:[1],han2:[1]},
    {id:"豊かな足取り",chr:[25],han:[1],han2:[1]},
    {id:"上手な足取り",chr:[26],han:[1],han2:[1]},
    {id:"交感の足取り",chr:[27],han:[1],han2:[1]},
    {id:"ラビィの友達",chr:[50],han:[1],han2:[1]},
    {id:"悪戯の王",chr:[51],han:[1],han2:[1]},
    {id:"機械工学",chr:[43],han:[1],han2:[1]},
    {id:"エルの巫女",chr:[67],han:[1],han2:[1]},
    {id:"原初的な動き",chr:[0,12,28],han:[2],han2:[1]},
    {id:"戦場の天使",chr:[18,23,42],han:[2],han2:[1]},
    {id:"マナ守護",chr:[5,26,49,61],han:[2,3],han2:[1,2]},
    {id:"殴り合い",chr:[13,32,48,60],han:[2,3],han2:[1,2]},
    {id:"時空間",chr:[6,34,46],han:[2,3],han2:[1,2]},
    {id:"属性鍛錬者",chr:[1,4,20,29],han:[2,3],han2:[1,2]},
    {id:"精霊の加護",chr:[8,9,10,11,66],han:[2,3],han2:[1,2]},
    {id:"魔族",chr:[36,37,38,39,62],han:[3,4],han2:[2,3]},
    {id:"歪曲された視線",chr:[19,47,55,59,63],han:[2,4],han2:[1,3]},
    {id:"ナソード研究",chr:[16,17,18,33,56,65],han:[2,4],han2:[1,3]},
    {id:"正義を貫徹する者",chr:[0,3,20,24,28,44,64],han:[2,3,5],han2:[1,2,3]},
    {id:"敏捷さ",chr:[2,8,12,21,31,42,52],han:[2,3],han2:[1,2]},
    {id:"巨人審判者",chr:[2,14,22,40,44,53,55,66],han:[2,3],han2:[1,2]},
    {id:"探求する者",chr:[4,7,17,22,33,35,43,53],han:[2,3],han2:[1,2]},
    {id:"魔法特化",chr:[1,11,13,21,32,45,51,58],han:[2,3],han2:[1,2]},
    {id:"物理特化",chr:[6,10,15,35,36,41,50,52,57],han:[2,3],han2:[1,2]},
    {id:"痛いから問題ない",chr:[14,23,27,30,39,45,49,54,57],han:[2,3],han2:[1,2]},
    {id:"鋭さ",chr:[3,9,16,19,29,31,37,40,48,54,58],han:[2,3],han2:[1,2]},
    {id:"渇望",chr:[5,7,15,25,30,34,38,41,46,47],han:[2,3],han2:[1,2]},
  ]
  //実績
  var achieveA=[
  {name:"始めまして～",sub:"エルドンを1回プレイする"},
  {name:"エルドンの通",sub:"エルドンを通算10回プレイする"},
  {name:"エルドンの民",sub:"エルドンを通算50回プレイする"},
  {name:"エルドンの妖精",sub:"エルドンを通算100回プレイする"},
  {name:"ロナン・エルドン",sub:"エルドンを通算179回プレイする"},
  {name:"エルドンの覇者",sub:"エルドンを通算300回プレイする"},
  {name:"地獄の生還者",sub:"半荘戦で1度もツモ・ロンせずに最後まで生存する"},
  {name:"もしかして空気？",sub:"半荘戦で1度もツモ・ロン・ポン・放銃せずに終了する"},
  {name:"スーパーソニック",sub:"半荘戦を4局以内に終了する"},
  {name:"甘美な勝利",sub:"3回以上1位になる"},
  {name:"ドカーン！",sub:"5回以上4位になる"},
  {name:"見える、見えるぞ！",sub:"半荘戦で一度も放銃せずに勝利する"},
  {name:"スケアチェイス",sub:"半荘戦で3回以上放銃する"},
  {name:"デュアルバスター",sub:"2回以上ダブル放銃する"},
  {name:"私ぶっ飛んでるの！",sub:"7回以上飛ぶ"},
  {name:"まだだ",sub:"2連荘する"},
  {name:"もう一度かかってこい",sub:"3連荘する"},
  {name:"あなたと一緒なら",sub:"3ペアを30回以上和了する"},
  {name:"突き抜ける快感",sub:"ライン通貫を10回以上和了する"},
  {name:"はじめてのツモ",sub:"1回ツモアガリする"},
  {name:"はじめてのロン",sub:"1回ロンアガリする"},
  {name:"歴戦の勇士",sub:"門前ツモを10回達成する"},
  {name:"マスターへの道",sub:"戦闘力300000を達成する"},
  {name:"マスターへの道（ヘル）",sub:"戦闘力600000を達成する"},
  {name:"ミリオネア",sub:"戦闘力1000000を達成する"},
  {name:"ダブルスラッシュ",sub:"二倍満を和了する"},
  {name:"トリプルガイザー",sub:"三倍満を和了する"},
  {name:"これで終わりだ！",sub:"数え役満を和了する"},
  {name:"渾身の一撃",sub:"150000点以上の手を和了する"},
  {name:"魂の一撃",sub:"300000点以上の手を和了する"},
  {name:"必殺の一撃",sub:"600000点以上の手を和了する"},
  {name:"回れ！回れ！回れ！",sub:"通算30回ポンする"},
  {name:"YOUならやれるポン",sub:"通算100回ポンする"},
  {name:"フォルギネイの果実",sub:"嶺上開花で和了する"},
  {name:"変化無双",sub:"国士無双を和了する"},
  {name:"幸運の証票",sub:"天和を和了する"},
  {name:"海千山千",sub:"海底を和了する"},
  {name:"クレストコンプリート",sub:"全ての属性ペア役を1回以上成立させる"},
  {name:"シナジーコンプリート",sub:"全てのシナジー役を1回以上成立させる"},
  {name:"柔軟な実績コレクター",sub:"実績を10個以上開放する"},
  {name:"強靭な実績コレクター",sub:"実績を30個以上開放する"},
  ]
  for(var i=0; i<achieveA.length;i++){
    achieveA[i].id=i;
    achieveA[i].cleared=0;
  }
  //役 maxの部分は保留
  var achieveB=[
    {name:"3ペア",sub:"アガリ形"},
    {name:"1ライン通貫",sub:"アガリ形"},
    {name:"2ライン通貫",sub:"アガリ形"},
    {name:"3ライン通貫",sub:"アガリ形"},
    {name:"4ライン通貫",sub:"アガリ形"},
    {name:"国士無双",sub:"アガリ形"},
    {name:"クレストオブガイア",sub:"アガリ形"},
    {name:"クレストオブソーレス",sub:"アガリ形"},
    {name:"クレストオブベントス",sub:"アガリ形"},
    {name:"クレストオブロッソ",sub:"アガリ形"},
    {name:"クレストオブデニフ",sub:"アガリ形"},
    {name:"クレストオブハルニエ",sub:"アガリ形"},
    {name:"クレストオブアドリアン",sub:"アガリ形"},
    {name:"鋭さ",sub:"シナジー役",max:7},
    {name:"ナソード研究",sub:"シナジー役",max:5},
    {name:"精霊の加護",sub:"シナジー役",max:3},
    {name:"物理特化",sub:"シナジー役",max:6},
    {name:"魔法特化",sub:"シナジー役",max:5},
    {name:"貫徹する足取り",sub:"シナジー役",max:1},
    {name:"豊かな足取り",sub:"シナジー役",max:1},
    {name:"上手な足取り",sub:"シナジー役",max:1},
    {name:"交感の足取り",sub:"シナジー役",max:1},
    {name:"敏捷さ",sub:"シナジー役",max:6},
    {name:"正義を貫徹する者",sub:"シナジー役",max:5},
    {name:"殴り合い",sub:"シナジー役",max:3},
    {name:"時空間",sub:"シナジー役",max:3},
    {name:"魔族",sub:"シナジー役",max:3},
    {name:"巨人審判者",sub:"シナジー役",max:6},
    {name:"マナ守護",sub:"シナジー役",max:3},
    {name:"探求する者",sub:"シナジー役",max:6},
    {name:"原初的な動き",sub:"シナジー役",max:3},
    {name:"渇望",sub:"シナジー役",max:7},
    {name:"属性鍛錬者",sub:"シナジー役",max:4},
    {name:"歪曲された視線",sub:"シナジー役",max:3},
    {name:"痛いから問題ない",sub:"シナジー役",max:5},
    {name:"機械工学",sub:"シナジー役",max:1},
    {name:"ラビィの友達",sub:"シナジー役",max:1},
    {name:"悪戯の王",sub:"シナジー役",max:1},
    {name:"エルの巫女",sub:"シナジー役",max:1},
    {name:"戦場の天使",sub:"シナジー役",max:3},
    {name:"大地のエル",sub:"キャラ役"},
    {name:"太陽のエル",sub:"キャラ役"},
    {name:"風のエル",sub:"キャラ役"},
    {name:"火のエル",sub:"キャラ役"},
    {name:"水のエル",sub:"キャラ役"},
    {name:"月のエル",sub:"キャラ役"},
    {name:"闇のエル",sub:"キャラ役"},
    {name:"門前ツモ",sub:"アガリ形"},
    {name:"一発",sub:"アガリ形"},
    {name:"天和",sub:"アガリ形"},
    {name:"海底",sub:"アガリ形"},
    {name:"ツモ",sub:"その他"},
    {name:"ロン",sub:"その他"},
    {name:"放銃",sub:"その他"},
    {name:"ダブル放銃",sub:"その他"},
    {name:"飛び",sub:"その他"},
    {name:"ポン",sub:"その他"},
    {name:"カン",sub:"その他"},
    {name:"満貫",sub:"その他"},
    {name:"跳満",sub:"その他"},
    {name:"二倍満",sub:"その他"},
    {name:"三倍満",sub:"その他"},
    {name:"数え役満",sub:"その他"},
  ]
    for(var i=0; i<achieveB.length;i++){
      achieveB[i].id=i;
      achieveB[i].cleared=0;
      achieveB[i].count=0;
    }
  //通算順位割合
  var winrank=[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];//一般、ヘル、デスマッチ、予備、魔界血戦
  //winrank[0][4]をP切り替えに利用
  var highscore=[0,0,0,0,0,0];//0->通算プレイ回数 1->最大終了得点 2->1回の最大得点 3->連荘回数 4->対戦回数 5->予備
  var scoretemp=[0,0,0,0,0,0];//0->0:escで途中抜けした1-4:順位 3->最大火力 1->連荘 245未使用
  var achievetemp=[];//name,達成回数,シナジーの場合はcountを記録
  //countミスってますがclearedに加算してください
  var achievetempB=[
    {name:"門前ツモ",count:0},
    {name:"一発",count:0},
    {name:"嶺上開花",count:0},
    {name:"天和",count:0},
    {name:"海底",count:0},
    {name:"ツモ",count:0},
    {name:"ロン",count:0},
    {name:"ポン",count:0},
    {name:"カン",count:0},
    {name:"放銃",count:0},
    {name:"ダブル放銃",count:0},
    {name:"飛び",count:0},
    {name:"満貫",count:0},
    {name:"跳満",count:0},
    {name:"二倍満",count:0},
    {name:"三倍満",count:0},
    {name:"数え役満",count:0},
  ];
  //ローカルストレージ
  var UserData_Don = {
    "Title": Savetitle[0],
    "Name": Username,
    "Crest": Usercrest,
    "Chara":chara,
    "Volume":vBar,
    "SEVolume":sBar,
    "Config":musicset,
    "Rank":winrank,
    "AchieveA":achieveA,
    "AchieveB":achieveB,
    "Highscore":highscore,
    "MPV":mpVelocity,
    "DHS":dahaiSE,
    "tumoCon":tumoConfig,
    "PON":Ponrate,
    "FEV":Fever,
    "HiddenChr":HiddenChara,
  };
  var key27=0;//esc
  var handlist=[];
  //タイトルロゴ
  var etitle= new createjs.Bitmap("don/Don_title.png");
  //背景
  var BGimg= new createjs.Bitmap("don/Don_bg1.png");
  BGimg.scale=2;
  var e1= new Image();
  //メニュー用
  var e4= new Image();
  var e5= new Image();
  //handgraphで使用
  var e7= new Image();
  //アガリ牌描画
  var e9= new Image();
  //リーチの待ちパイ、cpuのpon
  //メニューウインドウ
  var e10= new Image();
  var e11= new Image();
  var e12= new Image();
  var e13= new Image();
  var e14= new Image();
  //立ち絵
  var e15= new Image();
  var e16= new Image();
  //マナブレアイコン
  var MBicon= new createjs.Bitmap("don/Don_mbicon.png");;
  var zoom=  new createjs.Bitmap("don/zoom650.png");
  zoom.scale=0.4;
  //ツモロンボタン
  var skilltext1
  var skilltext2
  var skilltext3
  //ナビ切り替え
  var navisw=0;
  //山札と画像と手札
  var deck=[]
  //王牌
  var king=[]
  var dora=[]
  //手札.hand1[0]==-1 ron -2 tumo -3上がり判定、
  var hand1=[]
  //create用に？
  var hand2=[]
  var hand3=[]
  var hand4=[]
  var handtemp=[]
  var vichand=[];
  hand1=Array(10).fill(0);
  hand1[0]=-1;
  //ポンポポン
  var ponsw=[0,0,0,0,0]
  var poncpu=[0,0,0,0,0]
  var pon1=[];
  var pon2=[];
  var pon3=[];
  var pon4=[];
  //カンカカン
  var kansw=[0,0,0,0,0]
  var kan1=[];
  var kan2=[];
  var kan3=[];
  var kan4=[];
  //描画用
  var reachhand=[];
  //ツモロン判定用
  //cpuの思考用
  var Cpuhandtemp=[]
  //ポン頻度調整用 0->全部ポン　1->ポンしない
  var tumoConfig=0;
  var Ponrate=0.4;
  //MPチャージ速度
  var mpVelocity=1;
  //打牌音
  var dahaiSE=1;
  //初手の積み込み用
  var hand1b =new Array
  //捨て牌
  var trash=[[],[],[],[]];
  var Extrash=[];//マナブレ等残パイで嘘つくため
  //除外
  //playerで使われている=>ctl[1]
  //cpuのインターバルをクリアするスイッチ
  var ctl=new Array(0,0,0,0,0)
  var ctlerror=new Array(0,0,0,0,0)
  var cLock=1
  var opLock=0;//
  //残パイ確認・役確認等用
  var handsort=0;
  //0->ID順、1->職ライン順
  //0->操作不可 1 2 3
  var nodyaku=[]
  var ElnameM=0;//説明枠を省略する
  var rootscore=0
  var score =0
  var fu =0
  var han =new Array(0,0,0,0,0)
  var reach =new Array(0,0,0,0,0)
  //reach 1->リーチできます 2->リーチします　3->リーチ中 1,2ならパイを切った後に0に
  var ippatu =new Array(0,0,0,0,0)
  var rorder =new Array(0,0,0,0,0)
  var nuki =new Array(0,0,0,0,0);
  var nukiswitch =new Array(0,0,0,0,0);
  //0->抜き直後に1にして嶺上　抜き枚数チェック
  //捨て牌の座標
  var riverx=new Array(0,120,120,120,120)
  var rivery=new Array(0,400,100,200,300)
  var counter=new Array(0,0,0,0,0);//捨てたパイの数
  var counterR=new Array(-1,-1,-1,-1,-1);//何巡目にリーチしたか
  //スペシャルスキル関連
  //[0] -2->パッシブ・アクティブ全て適応しない -1->CPUスキル禁止＆プレイヤーは使用可能 0->無法地帯
  var skillswitch=new Array(-1,1,1,1,1)
  //1->初期　0->使用可 2->不可
  var skillusage=new Array(0,0,0,0,0)
  //ここまで局ごとに初期化=>deckh
  var skillusage2=new Array(0,-1,-1,-1,-1,0)
  //skillusage2[0][5]=>何局目か数える
  var death=[
    {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
    {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
    {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
    {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
  ];
  //デスマッチ用
  //kill とどめを刺した数
  //assist　最も多くのダメージを与えた人
  //Admg:0-4プレイヤーに与えたダメージ　該当プレイヤーが死んだらリセット
  //Bdmg:0-4プレイヤーから受けたダメージ　死んだらリセット
  var startTime=0
  var clearTime=0
  var thinkTime=0
  var timevalue=0
  var timerw=150
  var size=70
  var sizey=93
  var pagestate=-1
  var msgstate=0
  var gamestate =-10;
  //-2,-1=>tumoronで使用,クリックさせたくない時 0=>クリックで1に,ゲームをしてない時 1=>game中 2=>クリックで0に,ツモのアニメーション 3=>ゲームオーバー、タイトルに戻るなどする 10=>麻雀をしていない
  var turn =0
  var turntemp
  var parent=0
  var dorax=0
  var parentY
  var tumo
  var tumo2
  //捨て牌
  var tumotemp
  //cputumoで使用
  var r4=0
  
  var se1 = new Howl({
  src:"don/decision9.mp3",
  volume: 0.25,
  });
  var se2 = new Howl({
    src:"don/Liquid_Suction.wav",
        volume: 0.3,
      });
  var se3 = new Howl({
    src:"don/Sensu-Put.mp3",
        volume: 0.3,
      });
  var se4 = new Howl({
    src:"don/card-flip.mp3",
        volume: 0.3,
      });
  var se5 = new Howl({
    src:"don/button25.mp3",
    volume: 0.2,
      });
  var se6 = new Howl({
    src:"don/news_title3.mp3",
    volume: 0.25,
    });
  var se7 = new Howl({
    src:"don/skillSE.mp3",
    volume: 0.15,
    });
  var se8 = new Howl({
    src:"don/jidaigeki3.mp3",
    volume: 0.2,
    });
  var se9 = new Howl({
    src:"don/scene2.mp3",
    volume: 0.3,
    });
  var se10 = new Howl({
    src:"don/rinbell.mp3",
    volume: 0.3,
    });
  var se11 = new Howl({
    src:"don/shufflecard2.mp3",
    volume: 0.3,
    });
  var se12 = new Howl({
    src:"don/decision18.mp3",
    volume: 0.2,
    });
  var se13 = new Howl({
    src:"don/explode.mp3",
    volume: 0.3,
    });
  var se14 = new Howl({
      src:"don/raise-a-pinball-flipper-2.mp3",
      volume: 0.3,
      });
  var se15 = new Howl({
    src:"don/kaiju_foot.mp3",
    volume: 0.3,
    });
  var se16 = new Howl({
    src:"don/Don_paiset.mp3",
    volume: 0.3,
    });
  var se17 = new Howl({
    src:"don/suzu.mp3",
    volume: 0.3,
    });
  var se18 = new Howl({
    src:"don/WoodBlock.wav",
    volume: 0.18,
    });
  var se19 = new Howl({
    src:"don/Single_Accent04-3.mp3",
    volume: 0.6,
    });
  var se20 = new Howl({
    src:"don/slash1.mp3",
    volume: 0.15,
    });
  const jingle =new Howl({
      src: "don/Don_jingle.mp3",
      volume: 0.3,
    });
    const jingle2 =new Howl({
      src: "don/Result_li.mp3",
      volume: 0.3,
    });
    const jingle3 =new Howl({
      src: "don/soL_jingle.mp3",
      volume: 0.3,
    });
  const bgm1data ={
    src: "don/Astraea.mp3",
    loopStart: 0,
    loopEnd: 98000,
    volume: 0.12,
  };
  const bgm2data ={
    src: "don/Nine_Jackshort.mp3",
    loopStart: 0,
    loopEnd: 181000,
    volume: 0.07,
  };
  const bgm3data ={
    src: "don/The_Evil_Sacrifice_Archenemies.mp3",
    loopStart: 0,
    loopEnd: 100000,
    volume: 0.08,
  };
  const bgm4data ={
    src: "don/Lobelia.mp3",
    loopStart: 0,
    loopEnd: 169000,
    volume: 0.05,
  };
  const bgm5data ={
      src: "don/nisha_intro.mp3",
      loopStart: 5040,
      loopEnd: 81870,
      volume: 0.6,
    };
  const bgm6data ={
    src: "don/Unrest_Duel2.mp3",
    loopStart: 9330,
    loopEnd: 110500,
    volume: 0.3,
  };
  const bgm7data ={
    src: "don/Rena_li.mp3",
    loopStart: 9250,
    loopEnd: 170500,
    volume: 0.3,
  };
  const bgm8data ={
    src: "don/Reach.mp3",
    loopStart: 6290,
    loopEnd: 74750,
    volume: 0.5,
  };
  const bgm9data ={
    src: "don/Stage_Bethma.mp3",
    loopStart: 1150,
    loopEnd: 98610,
    volume: 0.15,
  };
  const bgm10data ={
    src: "don/Unrest_KBF_li.mp3",
    loopStart: 14250,
    loopEnd: 173120,
    volume: 0.4,
  };
  const bgm11data ={
    src: "don/rosso_A.mp3",
    loopStart: 9950,
    loopEnd: 158540,
    volume: 0.3,
  };
  const bgm12data ={
    src: "don/Victoria.mp3",
    loopStart: 8540,
    loopEnd: 129250,
    volume: 0.3,
  };
  const bgm13data ={
    src: "don/Reach_R.mp3",
    loopStart: 7200,
    loopEnd: 74580,
    volume: 0.5,
  };
  const bgm17data ={
    src: "don/STARDUST_LEMON.mp3",
    loopStart: 33450,
    loopEnd: 163580,
    volume: 0.12,
  };
  var Bgm=new Music(bgm3data);
  var musicnum=0;
    se1.load();
    se2.load();
    se3.load();
    se4.load();
    se5.load();
    se6.load();
    se7.load();
    se8.load();
    se9.load();
    se10.load();
    se11.load();
    se12.load();
    se13.load();
    se14.load();
    se15.load();
// LoadQueueのインスタンスを作成
var queue = new createjs.LoadQueue(),
//ロード画像適宜追加
      manifest = [];
    for(var i=0;i<eltear_src.length;i++){
      manifest.push(eltear_src[i])
    };
    for(var i=0;i<eltearB_src.length;i++){
      manifest.push(eltearB_src[i])
    };
    for(var i=0;i<chrimg_src.length;i++){
      manifest.push(chrimg_src[i])
    };
    for(var i=0;i<chrimgR_src.length;i++){
      manifest.push(chrimgR_src[i])
    };
    for(var i=0;i<win_src.length;i++){
      manifest.push(win_src[i])
    };
    for(var i=0;i<epic_src.length;i++){
      manifest.push(epic_src[i])
    };
    manifest.push('don/circle88.png')
    manifest.push('don/Don_aurus.png')
    manifest.push('don/soL_option_bt2.png')
    manifest.push('don/soL_option_bt3.png')
    manifest.push('don/soL_option_bt4.png')
    console.log(manifest.length);
// 同時接続数を設定
queue.setMaxConnections(6);
// 読み込みの進行状況が変化した
queue.addEventListener("progress", handleProgress);
// 1つのファイルを読み込み終わったら
queue.addEventListener(
  "fileload",
  handleFileLoadComplete
);
// 全てのファイルを読み込み終わったら
queue.addEventListener("complete", handleComplete);
// 読み込み開始
queue.loadManifest(manifest);
function handleProgress(event) {
  // 読み込み率を0.0~1.0で取得
  var progress = event.progress;
  field.removeAllChildren();
  var Rate=Math.floor(progress*100);
  var load = new createjs.Text("Now loading..."+Rate+"%", "24px serif", "white");
  var loadGrp = new createjs.Shape();
    loadGrp.graphics.beginFill("#007fd9")
    loadGrp.graphics.drawRect(100, 380,6*Rate, 25);
    createjs.Tween.get(Cstar).to({x:6*Rate+100},300);
  load.x=100;
  load.y=360;
  field.addChild(load);
  field.addChild(loadGrp);
  backyard.addChild(BGimg);
}
function handleFileLoadComplete(event) {
  // 読み込んだファイル
  var result = event.result;
}
function handleComplete() {
  console.log("LOAD COMPLETE");
  field.removeAllChildren();
  loadtitle()
}
//mousedown, mouseup
if(typeof window.ontouchstart === "undefined"){
  canvas5.onmousedown = mouseDownListener;
  canvas5.onmouseup = mouseUpListener;
}else{
  canvas5.ontouchstart = mouseDownListener;
  canvas5.ontouchend = mouseUpListener;
}
//canvas5.onmousedown = mouseDownListener;
function mouseDownListener(e=-1) {
  createjs.Ticker.addEventListener("tick", MouseCircle);
  if(gamestate ==1 && cLock==1 && opLock>=0 && opLock !==2){
    mpC=-2;
    mpmoving=true;
  }
};
//canvas5.onmouseup = mouseUpListener;
function mouseUpListener(e=-1) {
  if(mpmoving){
    mpmoving=false;
    DPlist[0].scaleX=0;
    DPlist[0].x=50;
  }
  createjs.Ticker.removeEventListener("tick", MouseCircle);
};
createjs.Ticker.addEventListener("tick", UpdateParticles);
function UpdateParticles(event){
  updateParticles();
}
function MouseCircle(event){
  //クリックした場所を教える
  //プレイ中はマナブレも
  if(mpmoving){
  mpC+=0.4;
  if(mpC>DP[1]){mpC=DP[1]};
    if(mpC>0){
    DPlist[0].scaleX=mpC/30;
    DPlist[0].x=50;
    }else{
    DPlist[0].scaleX=0;
    DPlist[0].x=50;      
    }
  }else{
    mpC=-2;
    DPlist[0].scaleX=0;
    DPlist[0].x=50;
  }
  //create化する
  emitParticles();
  // パーティクルを更新
  updateParticles();
}
var count = 0; // tick イベントの回数
var MAX_LIFE = 20; // 寿命の最大値
var particles = [];
// パーティクルを発生させます
function emitParticles() {
  // パーティクルの生成
  for (var i = 0; i < 5; i++) {
    // カウントの更新
    count += 1;
    // オブジェクトの作成
    var particle = new createjs.Shape();
    var R=30*Math.random()
    particle.graphics
            .beginFill(createjs.Graphics.getHSL(218, 90, 50))
            .drawRect(-R/2, -R/2, R, R);
    field.addChild(particle);
    particle.compositeOperation = "lighter";
    particle.alpha=0.25;
    // パーティクルの発生場所
    particle.x = stage.mouseX*(1/stage.scaleX);
    particle.y = stage.mouseY*(1/stage.scaleY);
    // 動的にプロパティーを追加します。
    // 速度
    particle.vx = 3 * (Math.random() - 0.5);
    particle.vy = 3 * (Math.random() - 0.5);
    // 寿命
    particle.life = MAX_LIFE;
    particles.push(particle);
  }
}
// パーティクルを更新します
function updateParticles() {
  // パーティクルの計算を行う
  for (var i = 0; i < particles.length; i++) {
    // オブジェクトの作成
    var particle = particles[i];
    // 重力
    particle.vy += 0.2;
    // 摩擦
    particle.vx *= 0.96;
    particle.vy *= 0.96;
    // 速度を位置に適用
    particle.x += particle.vx;
    particle.y += particle.vy;
    // 地面
    if (particle.y > stage.canvas.height) {
      particle.y = stage.canvas.height; // 行き過ぎ補正
      particle.vy *= -1; // Y軸の速度を反転
    }
    // パーティクルのサイズをライフ依存にする
    var scale = particle.life / MAX_LIFE;
    particle.scaleX = particle.scaleY = scale;
    // 寿命を減らす
    particle.life -= 1;
    // 寿命の判定
    if (particle.life <= 0) {
      // ステージから削除
      field.removeChild(particle);
      // 配列からも削除
      particles.splice(i, 1);
    }
  }
}
  function load2(){
  var shape = new createjs.Shape();
  shape.graphics.beginFill("rgb(255,255,255)");
  shape.graphics.drawRect(10, 170, 780, 200);
  shape.alpha=0.5;
  field.addChild(shape);
  etitle.x=30;
  etitle.y=150;
  field.addChild(etitle)
  var shape = new createjs.Shape();
  shape.graphics.beginFill("#007fd9");
  shape.graphics.drawRect(100, 380, 600, 25);
  field.addChild(shape);
  var t = new createjs.Text(titletext, "24px 'Century Gothic'", "#e4e4e4");
  t.textAlign="center"
  t.x=400;
  t.y=380;
  field.addChild(t);
  var shape = new createjs.Shape();
  shape.graphics.beginFill("rgba(255,255,255,0.1)");
  shape.graphics.drawRect(0, 0, 800, 600);
  field.addChild(shape);
  shape.addEventListener("click", {handleEvent:LoadtoMenu});
  gamestate=10;
  }
  function loadtitle(){
  Yakucheck();
  paiView();
  for(var i=0;i<6;i++){
    var A=Math.floor(Math.random()*70);
    s = new createjs.Bitmap(queue.getResult(eltear_src[A]));
    s.x=-120;
    s.y=5;
    ary.push(s);
  };
  for(var j=0;j<6;j++){
    var A=Math.floor(Math.random()*70);
    s = new createjs.Bitmap(queue.getResult(eltear_src[A]));
    s.x=920;
    s.y=425;
    ary.push(s);
  }
  field.addChild(ary[0]);
  field.addChild(ary[1]);
  field.addChild(ary[2]);
  field.addChild(ary[3]);
  field.addChild(ary[4]);
  field.addChild(ary[5]);
  field.addChild(ary[6]);
  field.addChild(ary[7]);
  field.addChild(ary[8]);
  field.addChild(ary[9]);
  field.addChild(ary[10]);
  field.addChild(ary[11]);
  createjs.Tween.get(ary[0])
  .to({x:35},60)
  createjs.Tween.get(ary[1])
  .to({x:156},70)
  createjs.Tween.get(ary[2])
  .to({x:277},80)
  createjs.Tween.get(ary[3])
  .to({x:398},90)
  createjs.Tween.get(ary[4])
  .to({x:519},100)
  createjs.Tween.get(ary[5])
  .to({x:640},110)
  createjs.Tween.get(ary[6])
  .to({x:640},60)
  createjs.Tween.get(ary[7])
  .to({x:519},70)
  createjs.Tween.get(ary[8])
  .to({x:398},80)
  createjs.Tween.get(ary[9])
  .to({x:277},90)
  createjs.Tween.get(ary[10])
  .to({x:156},100)
  createjs.Tween.get(ary[11])
  .to({x:35},110)
  .call(load2); 
  };
  
    canvas5.onmousemove = mouseMoveListener;
    function mouseMoveListener(e=-1) {
      //カーソル
    mouseX=stage.mouseX*(1/stage.scaleX);
    mouseY=stage.mouseY*(1/stage.scaleY);
     corsor();
    }
    canvas5.addEventListener(`contextmenu`, contextHandler, false);
    //canvas5.addEventListener("click", clickHandler, false);
  function contextHandler(e=-1){
    //右クリック無効、右クリックでツモ切り
      e.preventDefault();
      if(tumoConfig==0){
        if(gamestate ==1){
      if(opLock==0 && cLock==1 && turn ==0){
        if(reach[1]!==2){
            ctl[1]=0;
            PlayertoCpu(hand1.length-1);
        }
          }}
      }
    };
    function LoadtoMenu(){
      for(var i=0; i<12 ; i++){
        field.removeChild(ary[i]);
      }
      ary=[];
      tweeNstar.paused=true;
      stage.removeChild(Cstar);
      pagestate=0;
      se6.play();
      saveUP();
      saveUP_Local();
      Menu();
      soundmap.alpha=1;
    }
    function clickInGame() {
      //canvas5のaddeventでは上手く実装できなかったためその都度イベントを追加
      //Menuから飛ぶ 
  socket.on("game-ready", (data)=>{
    if(IsHost(IAM.room)){
    var N=MEMBER.findIndex(value=>value.id==data.who);
    MEMBER[N].turnflag=2;
    var M=MEMBER.filter(value=>value.turnflag==2)
    var MM=4-M.length
    //どこかでOKtextをaddする
    OKtext1.text="OK ("+MM+")";
    OKtext2.text="OK ("+MM+")";
    }
  });
  if(gamestate ==0){//ほんぺ
    //ニューゲーム
    handmap.removeAllChildren();
    //と言いたいけどダブロンがあればその処理
    if(Ronturn.length>0){
      gamestate=1;
      TumoRon(Ronturn[0],turn+1,2);
      Ronturn.shift();
      return false;
    }
    if(pvpmode==1 && IsHost(IAM.room)){
      //他のプレイヤーが準備できたら次に進む
      //ゲームオーバー画面へは非同期で進む
      if(LP[0]!==4 || (LP[0]==4 && raidscore[0]==1)){
      MEMBER[0].turnflag=2;
      var M=MEMBER.filter(value=>value.turnflag==2)
      var MM=4-M.length
      OKtext1.text="OK ("+MM+")";
      OKtext2.text="OK ("+MM+")";
      if(LP_PVP.Length[0]==1){
          if(skillusage2[0]>=4){
            gameover();
            return false;
          }
      }else if(LP_PVP.Length[0]==2){
          if(skillusage2[0]>=8){
            gameover();
            return false;
          }
        }
      if(LP[0]!==2 && (LP[1] <0 || LP[2]<0 || LP[3] <0 || LP[4]<0)){
        gameover();
        return false;
      }
      for(var i=0;i<MEMBER.length;i++){
        if(MEMBER[i].turnflag!==2){
          console.log(MEMBER);
          return false;
          }
        }
      }
    }
    if(pvpmode==1 && !IsHost(IAM.room)){
      //ホスト以外は待機
      if(LP[0]!==4 || (LP[0]==4 && raidscore[0]==1)){
        gamestate =1;
        socket.emit("game_ready", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id});
        OKtext1.text="waiting…"
        OKtext2.text="waiting…"
        if(LP_PVP.Length[0]==1){
            if(skillusage2[0]>=4){
              gameover();
              return false;
            }
          }else if(LP_PVP.Length[0]==2){
              if(skillusage2[0]>=8){
                gameover();
                return false;
              }
            }
          if(LP[0]!==2 && (LP[1] <0 || LP[2]<0 || LP[3] <0 || LP[4]<0)){
            gameover();
            return false;
        }
        return false;
      }
    };
    //pvpでは東風も考慮
    switch(LP[0]){
      case 0:
        //一般ルール
        if(pvpmode==1){
          if(LP_PVP.Length[0]==1){
              if(skillusage2[0]>=4){
                gameover();
                return false;
              }
          }else if(LP_PVP.Length[0]==2){
              if(skillusage2[0]>=8){
                gameover();
                return false;
              }
            } 
        }else{
          if(skillusage2[0]>=8){
          gameover();
          return false;
          }
        }
        if(LP[1] >=0 && LP[2]>=0 && LP[3] >=0 && LP[4]>=0){
          gamestate =1
          deckHandler();
          return false;
        }else{
          gameover();
          return false;
        }
        break;
        case 1:
        //ヘル
            if(skillusage2[0]>=8){
            gameover();
            return false;
            }
            if(LP[1] >0){
              gamestate =1
              deckHandler();
              return false;
            }else{
              gameover();
              return false;
          }
          break;
          case 2:
      //デスマッチ
      if(pvpmode==1){
        if(LP_PVP.Length[0]==1){
            if(skillusage2[0]>=4){
              gameover();
              return false;
            }
        }else if(LP_PVP.Length[0]==2){
            if(skillusage2[0]>=8){
              gameover();
              return false;
            }
          } 
      }else{
        if(skillusage2[0]>=8){
        gameover();
        return false;
        }
      }
      gamestate =1
      deckHandler();
      return false;
            break;
            case 4:
    //魔界ルール
    if(raidscore[0]==1){
      if(pvpmode==1){
        if(LP_PVP.Length[0]==1){
            if(skillusage2[0]>=4){
              gameover();
              return false;
            }
        }else if(LP_PVP.Length[0]==2){
            if(skillusage2[0]>=8){
              gameover();
              return false;
            }
          } 
      }else{
        if(skillusage2[0]>=8){
        gameover();
        return false;
        }
      }
    if(LP[1] >=0 && LP[2]>=0 && LP[3] >=0 && LP[4]>=0){
      gamestate =1;
      raidscore[0]=0;
      deckHandler();
        }else{
      gameover();
    }
  }else{
    //結果発表へ
    if(cLock==1 || raidscore[2]==1){
    ResultPhase();
    }
  }
          break;
        default:
  //∞モード
  if(LP[1] >=0 && LP[2]>=0 && LP[3] >=0 && LP[4]>=0){
    gamestate =1
    deckHandler();
    }else{gameover();}
          break;
    }
  }else if(gamestate ==-2){
    //ツモのアニメーション中
    //gamestate=-1;
    }else if(gamestate ==2){//次のゲームへ
    field.addChild(OKtext1);
    field.addChild(OKtext2);
    if(pvpmode==1 && IsHost(IAM.room)){
      MEMBER[0].turnflag=1;
  for(var i=1;i<MEMBER.length;i++){
    if(MEMBER[i].pc==1 && MEMBER[i].turnflag !==2){
      MEMBER[i].turnflag=0;
    }else{
      MEMBER[i].turnflag=2;
    }
    }}
    gamestate=0;
    }else if(gamestate ==3){//タイトルへ
      if(pvpmode==1 && gamestate !==10){
        console.log('ロビーに戻る',IAM.room);
        //cx4.clearRect(0,0,800,600);
        if(!Bgm.mute()){
          Bgm =new Music(bgm17data);
          Bgm.playMusic();
        };
            musicnum=17;
            gamestate=10;
            opLock=0;
            pagestate=6;
            msgstate=2;
            cx2.clearRect(0,0,800,600);
            field.removeAllChildren();
            //menuMap(4);
            field.addChild(menu_duel);
            textmap.alpha=1;
            se2.play();
            if(!IsHost(IAM.room)){
              if(IAM.is_ready==1){IAM.is_ready=0};
            }
            socket.emit("game_over", {Token:IAM.token,room:RoomName[IAM.room],type:1});
            return false;
      }
      if(pvpmode==0){
    opLock==0;
    pagestate =0;
    gamestate=10;
      }
    //console.log(pagestate)
    }else if(gamestate ==1){
      if(opLock==3){
        if(mouseX >300 && mouseY > 55 && mouseX <400 && mouseY <100){
          se3.play();
          if(shiagytemp==0){
            shiagytemp=1;
          }else{
            shiagytemp=0;
          }
          Yakucheck(0);
          return false;
        }
        if(mouseX >40 && mouseY > 100 && mouseX <620 && mouseY <200){
          Yakucheck(180);
        return false;
        }
        if(mouseX >40 && mouseY > 200 && mouseX <620 && mouseY <300){
          Yakucheck(90);
          return false;
          }
        if(mouseX >40 && mouseY > 300 && mouseX <620 && mouseY <400){
          Yakucheck(-90);
        return false;
        }
        if(mouseX >40 && mouseY > 400 && mouseX <620 && mouseY <480){
          Yakucheck(-180);
          return false;
          }
        yakumap.removeAllChildren();
        yakumap.alpha=0;
        opLock=0;
        se3.play();
        return false;
      }
      if(opLock==2){
        if(mouseX >460 && mouseY > 240 && mouseX <580 && mouseY <300){
          cx4.clearRect(0,0,800,600)
          Configmap.removeAllChildren();
          opLock=0;
          se3.play();
        }
        //escによる終了
        if(mouseX >220 && mouseY > 240 && mouseX <340 && mouseY <300){
        se3.play();
        scoretemp[0]=-2;
        opLock=0;
        if(pvpmode==1){
        cx4.globalAlpha=1;
        cx4.font = "bold 26px 'メイリオ'";
        cx4.fillStyle = "white";
        var RsString=['ルーム長がトイレに行きました','ルーム長権限が発動しました','ルーム長がゲームを終了させました'];
        var A=Math.floor(Math.random()*RsString.length);
        gameover(RsString[A]);
        }else{
        gameover();
        }
        }
      return false;
      }
      if(opLock==1){
        paiviewer.alpha=0;
        opLock=0;
        //drawbuttom(400,10,"残パイリスト",0,130,44);
        se4.play();
        return false;
      }
      if(mouseX >290 && mouseY > 10 && mouseX <400 && mouseY <55){
        //役一覧を出す
        if(cLock==1 || (pvpmode==1 && opLock>=0)){
          opLock=3;
          se4.play();
          yakumap.alpha=1;       
          Yakucheck(0);
          cx4.clearRect(10,100,610,400)
          return false;
          }
      }
      if(mouseX >400 && mouseY > 10 && mouseX <530 && mouseY <55){
        //残パイチェック欄を押す　ゲームを進めない
        if(cLock==1 || (pvpmode==1 && opLock>=0)){
        opLock=1;
        se4.play();
        paiviewer.alpha=1;
        //drawbuttom(400,10,"残パイリスト",1,130,44);
        Remaincheck();
        return false;
        }
      }
      if(mouseX >0 && mouseX< 100){
      if(skillswitch[0] !==-2){
        if(cLock==1|| (pvpmode==1 && opLock>=0)){
          se4.play();
          if(navisw==1){navisw=0}else{navisw=1};
        //クリックで切り替えできるように
        if(mouseY >100 && mouseY<200){Skillname(2,navisw);}
        if(mouseY >200 && mouseY<300){Skillname(3,navisw);}
        if(mouseY >300 && mouseY<400){Skillname(4,navisw);}
        if(mouseY >400 && mouseY<480){Skillname(1,navisw);}
        }
    }}
  if(cLock==2){//スキル対象選択画面 キャラ
    if(mouseX >0 && mouseX <150 && mouseY >100){
    if(mouseY >100 && mouseY <200){SkillAnimation(1,2);
    }else if(mouseY >200 && mouseY <300){SkillAnimation(1,3);
    }else if(mouseY >300 && mouseY <400){SkillAnimation(1,4);
    }
    }
  }else if(cLock==4){//スキル対象選択画面 場
    if(mouseX >150 && mouseX <630 && mouseY >100 && mouseY <490){SkillAnimation(1,1);
  }
  }else if(cLock==1){
    //クリックしてから捨て牌を描写してturnroleに繋げるところまで
    //各種ボタン移行済み
    ctl[1]=0
    }
    }//gamestate
  }
  //画面を描画したものを用意しておく
  var Cbt=canvas2.toDataURL();
  var Cbutton = new createjs.Bitmap(Cbt);
  var menu_main = new createjs.Container();//メイン画面（実績等）
  var menu_solo = new createjs.Container();//ソロ受付
  var menu_setting = new createjs.Container();//設定
  var menu_guide = new createjs.Container();//プレイガイド
  var menu_duel = new createjs.Container();//対戦
  var menu_solo_list=[];//createjsの可変リスト
  var menu_main_list=[];//createjsの可変リスト
function menuMap(p=0){
  if(debugmode){console.log('menuMap',p,pagestate)}
  switch(p){
    case 0:
      //solo
      menu_solo.removeAllChildren();
      menu_solo_list=[]
      var rect = new createjs.Shape();
      rect.graphics
        .beginFill("rgba(20,20,20,0.7)")
        .drawRect(0, 0, 800, 510);
      menu_solo.addChild(rect);
      rect.addEventListener("click", {handleEvent:Menu}); 
      var solo = new createjs.Bitmap(queue.getResult(win_src[0]));
      solo.sourceRect={x:0,y:0,width:300,height:150};
      solo.x=1;
      solo.y=4;
      solo.scale=0.5;
      menu_solo.addChild(solo);
      e4 = new createjs.Bitmap(queue.getResult(eltearB_src[0]));
      e4.x=360;
      e4.y=10;
      e4.scale=1.4;
      menu_solo.addChild(e4);
      var bt = new createjs.Bitmap("don/Don_startbt.png");
      bt.x=470;
      bt.y=410;
      menu_solo.addChild(bt);
      bt.addEventListener("click", {handleEvent:ToSetup});
      function ToSetup(){
        if(gamestate!==1){
          gamestate=1;
          field.removeAllChildren();
          textmap.alpha=0;
          musicnum=-1;
          Setup();
        }
      }
      var t = new createjs.Text("ルール", "26px 'Century Gothic'", "black");
      t.x=390;
      t.y=80;
      menu_solo.addChild(t);
      var t = new createjs.Text("プレイヤー", "26px 'Century Gothic'", "black");
      t.x=390;
      t.y=130;
      menu_solo.addChild(t);
      var t = new createjs.Text("ＣＰＵ", "26px 'Century Gothic'", "black");
      t.x=390;
      t.y=180;
      menu_solo.addChild(t);
      if(chara[0]==0){
        var t = new createjs.Text("✓おまかせ", "26px 'Century Gothic'", "black");
        }else{
        var t = new createjs.Text("　おまかせ", "26px 'Century Gothic'", "black");
      }
      t.x=520;
      t.y=180;
      menu_solo.addChild(t);
      menu_solo_list.push(t);
      var t = new createjs.Text("◀ "+LPlist[LP[0]], "24px 'Century Gothic'", "black");
      t.x=520;
      t.y=80;
      menu_solo.addChild(t);
      menu_solo_list.push(t);
      var t = new createjs.Text("◀ "+chrlist[chara[1]], "24px 'Century Gothic'", "black");
      t.x=520;
      t.y=130;
      menu_solo.addChild(t);
      menu_solo_list.push(t);
      var t = new createjs.Text(" ▶", "24px 'Century Gothic'", "black");
      t.x=670;
      t.y=80;
      menu_solo.addChild(t);
      var t = new createjs.Text(" ▶", "24px 'Century Gothic'", "black");
      t.x=670;
      t.y=130;
      menu_solo.addChild(t);
      var t = new createjs.Text(" ▶", "24px 'Century Gothic'", "black");
      t.x=670;
      t.y=350;
      menu_solo.addChild(t);
      var Ary=[["ＣＰＵ１","ＣＰＵ２","ＣＰＵ３"],["◀ "+chrlist[chara[2]],"◀ "+chrlist[chara[3]],"◀ "+chrlist[chara[4]]],[" ▶"," ▶"," ▶"]]
     for(var i=0;i<Ary.length;i++){
      var t = new createjs.Text(Ary[0][i], "24px 'Century Gothic'", "black");
      t.x=390;
      t.y=230+40*i;
      menu_solo.addChild(t);
      var t = new createjs.Text(Ary[1][i], "24px 'Century Gothic'", "black");
      t.x=520;
      t.y=230+40*i;
      if(chara[0]==0){t.alpha=0.4}else{t.alpha=1}
      menu_solo.addChild(t);
      menu_solo_list.push(t);
      var t = new createjs.Text(Ary[2][i], "24px 'Century Gothic'", "black");
      t.x=670;
      t.y=230+40*i;
      if(chara[0]==0){t.alpha=0.4}else{t.alpha=1}
      menu_solo.addChild(t);
      menu_solo_list.push(t);
     }
      var t = new createjs.Text("スキル", "24px 'Century Gothic'", "black");
      t.x=390;
      t.y=350;
      menu_solo.addChild(t);
      var Ary=["　◀禁止しない","　◀プレイヤーのみ","　◀全て禁止"]
      //-1のときは禁止
      var t = new createjs.Text(Ary[-skillswitch[0]], "24px 'Century Gothic'", "black");
      t.x=460;
      t.y=350;
      menu_solo.addChild(t);
      menu_solo_list.push(t);
      if(fool){
        e10 = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[1]]));          
      }else{
        e10 = new createjs.Bitmap(queue.getResult(chrimg_src[chara[1]]));
      }
      e10.sourceRect={x:400,y:0,width:350,height:510}
      e10.x=10;
      e10.y=0;
      e10.scale=1;
      menu_solo.addChild(e10);
      menu_solo_list.push(e10);
      var btn1 = createButton("もどる", 148, 40);
      btn1.x = 2;
      btn1.y = 80;
      menu_solo.addChild(btn1);
      btn1.addEventListener("click", {handleEvent:Totop}); 
      function Totop(){
        se2.play();
        pagestate=0;
        Menu();
      };
      break;
    case 1:
      //setting
      menu_setting.removeAllChildren();
      cx2.clearRect(0,0,800,600);
      var e = new createjs.Bitmap(queue.getResult(epic_src[0]));
      e.x=50;
      e.y=30;
      e.scale=1.1;
      menu_setting.addChild(e);
      e.addEventListener("click", {handleEvent:Menu}); 
      var e = new createjs.Bitmap(queue.getResult(epic_src[0]));
      e.x=400;
      e.y=30;
      e.scale=1.1;
      menu_setting.addChild(e);   
      e.addEventListener("click", {handleEvent:Menu}); 
      if(musicnum==musicset[0] || musicset[0]==0){
        drawbuttom(690,200,"Play",1,60,40)
        }else{
        drawbuttom(690,200,"Play",0,60,40)
      }
      if(musicnum==musicset[1] || musicset[1]==0){
        drawbuttom(690,270,"Play",1,60,40)
        }else{
        drawbuttom(690,270,"Play",0,60,40)
      }
      if(musicnum==musicset[2] || musicset[2]==0){
        drawbuttom(690,340,"Play",1,60,40)
      }else{
        drawbuttom(690,340,"Play",0,60,40)
      }
      if(mpVelocity==1){
        drawbuttom(80,310,"おそめ",1,80,40)
      }else{
        drawbuttom(80,310,"おそめ",0,80,40)
      }
      if(mpVelocity==1.5){
      drawbuttom(170,310,"ふつう",1,80,40)
      }else{
      drawbuttom(170,310,"ふつう",0,80,40)
      }
      if(mpVelocity==2){
      drawbuttom(260,310,"はやめ",1,80,40)
      }else{
      drawbuttom(260,310,"はやめ",0,80,40)
      }
      if(dahaiSE==1){
        drawbuttom(250,370,"A",1,40,40)
        drawbuttom(290,370,"B",0,40,40)
        }else if(dahaiSE==2){
        drawbuttom(250,370,"A",0,40,40)
        drawbuttom(290,370,"B",1,40,40)
        }
      drawbuttom2(600,450,"OK",0,100,40,1)
      drawbuttom2(400,450,"デフォルトに戻す",0,180,40,1)
      cx2.fillStyle = "black";
      cx2.fillRect(360,70,2,400);
      cx2.font = "26px 'Century Gothic'";
      cx2.fillText("ユーザー補助",60,100)
      cx2.fillText("対局設定",60,200)
      cx2.fillText("音量設定",390,100)
      cx2.fillText("対局BGM設定",390,198)
      cx2.font = "18px 'Century Gothic'";
      cx2.fillText("（注意：対局設定について）",60,440)
      cx2.fillText("対戦モードではルーム長の設定が",65,460)
      cx2.fillText("全体に反映されます。",65,480)
      cx2.font = "24px 'Century Gothic'";
      if(tumoConfig==0){
        cx2.fillText("右クリック　ツモ切り",90,130);
      }else if(tumoConfig==-1){
      cx2.fillText("右クリック　何もしない",90,130);
      }
      cx2.fillText("CPUのポン頻度",100,230);
      cx2.fillText("◀",120,260)
      cx2.fillText("▶",260,260)
      var A=(1-Ponrate)*5;
      for (var i=0;i<A;i++){
        cx2.fillText("■",140+i*24,260);
      };
      cx2.fillText("MPチャージ速度",100,300);
      cx2.fillText("打牌音",100,400)
      //soundbar
                //音量の設定
                Barlist=[];
                var shape = new createjs.Shape();
                shape.graphics.beginFill("#0080ff");
                shape.graphics.beginStroke("#68ceed");
                shape.graphics.setStrokeStyle(3);
                shape.graphics.drawRect(500, 110, 90*vBar, 25);
                menu_setting.addChild(shape);
                Barlist.push(shape);      
                var shape = new createjs.Shape();
                shape.graphics.beginFill("#0080ff");
                shape.graphics.beginStroke("#68ceed");
                shape.graphics.setStrokeStyle(3);
                shape.graphics.drawRect(500, 140, 90*sBar, 25);
                menu_setting.addChild(shape);
                Barlist.push(shape);       
                var t=new createjs.Text("BGM","24px 'Century Gothic","black");
                t.x=410;
                t.y=110;
                menu_setting.addChild(t);
                var t=new createjs.Text("SE","24px 'Century Gothic","black");
                t.x=410;
                t.y=140;
                menu_setting.addChild(t);
                var option_arrow = new createjs.Shape();
                option_arrow.graphics.beginFill("#0080ff")
                        .beginStroke("#68ceed")
                        .setStrokeStyle(2)
                        .moveTo(0, 0)
                        .lineTo(18, -12)
                        .lineTo(18, 12)
                        .lineTo(0, 0)
                option_arrow.x=475;
                option_arrow.y=122.5;
                menu_setting.addChild(option_arrow);
                option_arrow.addEventListener("click", {card:1,handleEvent:SoundBar});
                var option_arrow = new createjs.Shape();
                option_arrow.graphics.beginFill("#0080ff")
                        .beginStroke("#68ceed")
                        .setStrokeStyle(2)
                        .moveTo(0, -12)
                        .lineTo(18, 0)
                        .lineTo(0, 12)
                        .lineTo(0, -12)
                option_arrow.x=635;
                option_arrow.y=122.5;
                menu_setting.addChild(option_arrow);
                option_arrow.addEventListener("click", {card:2,handleEvent:SoundBar});
                var option_arrow = new createjs.Shape();
                option_arrow.graphics.beginFill("#0080ff")
                        .beginStroke("#68ceed")
                        .setStrokeStyle(2)
                        .moveTo(0, 0)
                        .lineTo(18, -12)
                        .lineTo(18, 12)
                        .lineTo(0, 0)
                option_arrow.x=475;
                option_arrow.y=152.5;
                menu_setting.addChild(option_arrow);
                option_arrow.addEventListener("click", {card:3,handleEvent:SoundBar});
                var option_arrow = new createjs.Shape();
                option_arrow.graphics.beginFill("#0080ff")
                        .beginStroke("#68ceed")
                        .setStrokeStyle(2)
                        .moveTo(0, -12)
                        .lineTo(18, 0)
                        .lineTo(0, 12)
                        .lineTo(0, -12)
                option_arrow.x=635;
                option_arrow.y=152.5;
                menu_setting.addChild(option_arrow);
                option_arrow.addEventListener("click", {card:4,handleEvent:SoundBar});
        function SoundBar(){
          switch(this.card){
            case 1:
              if(vBar<=0.2){vBar=0}else{vBar-=0.2}
              se3.play();
              musicVolume();
              var B=Barlist[0];
                var shape = new createjs.Shape();
                shape.graphics.beginFill("#0080ff");
                shape.graphics.beginStroke("#68ceed");
                shape.graphics.setStrokeStyle(3);
                shape.graphics.drawRect(500, 110, 90*vBar, 25);
                menu_setting.addChild(shape);
                menu_setting.removeChild(B);
                Barlist[0]=shape;
              break;
            case 2:
              if(vBar>=1.4){vBar=1.4}else{vBar+=0.2}
              se3.play();
              musicVolume();
              var B=Barlist[0];
              var shape = new createjs.Shape();
              shape.graphics.beginFill("#0080ff");
              shape.graphics.beginStroke("#68ceed");
              shape.graphics.setStrokeStyle(3);
              shape.graphics.drawRect(500, 110, 90*vBar, 25);
              menu_setting.addChild(shape);
              menu_setting.removeChild(B);
              Barlist[0]=shape;
              break;
            case 3:
              if(sBar<=0.2){sBar=0}else{sBar-=0.2}
                SEbuffer();
                se3.play();
                var B=Barlist[1];
                var shape = new createjs.Shape();
                shape.graphics.beginFill("#0080ff");
                shape.graphics.beginStroke("#68ceed");
                shape.graphics.setStrokeStyle(3);
                shape.graphics.drawRect(500, 140, 90*sBar, 25);
                menu_setting.addChild(shape);
                menu_setting.removeChild(B);
                Barlist[1]=shape;
              break;
            case 4:
              if(sBar>=1.4){sBar=1.4}else{sBar+=0.2}
              SEbuffer();
              se3.play();
              var B=Barlist[1];
              var shape = new createjs.Shape();
              shape.graphics.beginFill("0080ff");
              shape.graphics.beginStroke("#68ceed");
              shape.graphics.setStrokeStyle(3);
              shape.graphics.drawRect(500, 140, 90*sBar, 25);
              menu_setting.addChild(shape);
              menu_setting.removeChild(B);
              Barlist[1]=shape;
              break;
          }
        }
      cx2.fillText("通常",430,230)
      cx2.fillText("リーチ",430,300)
      cx2.fillText("オーラス",430,370)
      cx2.font = "20px 'Century Gothic'";
      cx2.textAlign = "center";
      cx2.fillText(musiclist[musicset[0]],560,260)
      cx2.fillText(musiclist[musicset[1]],560,330)
      cx2.fillText(musiclist[musicset[2]],560,400)
      cx2.textAlign = "start";
      cx2.fillText("◀ ",380,260)
      cx2.fillText("◀ ",380,330)
      cx2.fillText("◀ ",380,400)
      cx2.fillText(" ▶",720,260)
      cx2.fillText(" ▶",720,330)
      cx2.fillText(" ▶",720,400)         
      Cbt=canvas2.toDataURL();
      Cbutton = new createjs.Bitmap(Cbt);
      menu_setting.addChild(Cbutton);
      break;
    case 2:
      menu_main.removeAllChildren();
          cx2.clearRect(0,0,800,600);
          var e = new createjs.Bitmap(queue.getResult(epic_src[0]));
          e.x=50;
          e.y=50;
          e.scale=1.1;
          menu_main.addChild(e);
          e.addEventListener("click", {handleEvent:Menu}); 
          var e = new createjs.Bitmap(queue.getResult(epic_src[0]));
          e.x=400;
          e.y=50;
          e.scale=1.1;
          menu_main.addChild(e);
          e.addEventListener("click", {handleEvent:Menu}); 
          cx2.font = "32px 'Century Gothic'";
          cx2.fillStyle = "black";
          cx2.fillText("　×",680,80)
      switch(msgstate){
        case 0:
          //プロフィール
          Textlist[0].text="今までの主な戦績です。";
          Textlist[1].text="ニックネームやキャラクターを変更できます。";
          //名前入力欄
          var rect = new createjs.Shape()
          rect.graphics
              .beginFill("rgba(0,0,0,0.8)")
              .drawRect(530, 90, 200, 40);
          rect.addEventListener("click", {handleEvent:NameChange});
          menu_main.addChild(rect);
          UsernameText.text=Username;
          UsernameText.x=532;
          UsernameText.y=98;
          menu_main.addChild(UsernameText);
          var AryX=[500,500,500,530,480,520,490,400,510,500]
          var AryY=[50,100,80,50,90,60,100,100,130,70]
          for(var i=0;i<chrimg_src.length;i++){
            var j=i%4;
            var k=Math.floor(i/4);
            if(i>HiddenChara){
              var rect = new createjs.Shape();
              rect.graphics.beginFill("rgba(0,0,0,0.8)").drawRect(530+50*j, 350+50*k, 50, 50);
              menu_main.addChild(rect);
              var t = new createjs.Text("？", "26px 'Century Gothic'", "rgba(240,240,240,0.6)");
              t.x=540+50*j;
              t.y=360+50*k;
              menu_main.addChild(t);
            }else{
              if(fool){
                e11 = new createjs.Bitmap(queue.getResult(chrimgR_src[i]));          
              }else{
                e11 = new createjs.Bitmap(queue.getResult(chrimg_src[i]));
              }
            e11.sourceRect={x:AryX[i],y:AryY[i],width:200,height:200}
            e11.x=530+50*j;
            e11.y=350+50*k;
            e11.scale=1/4;
            menu_main.addChild(e11);
            }
          }
          var rect = new createjs.Shape();//キャラ設定欄
          rect.graphics
              .beginFill("rgba(0, 35, 133, 0.7)")
              .drawRect(0, 0, 50, 50);
          rect.x=530+50*(chara[1]%4)
          rect.y=350+50*Math.floor(chara[1]/4)
          menu_main.addChild(rect);
          menu_main_list.push(rect);
          if(fool){
            e10 = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[1]]));          
          }else{
            e10 = new createjs.Bitmap(queue.getResult(chrimg_src[chara[1]]));
          }
          e10.sourceRect={x:400,y:0,width:350,height:400}
          e10.x=530;
          e10.y=120;
          e10.scale=20/35;
          menu_main.addChild(e10);
          menu_main_list.push(e10);
          drawbuttom(60,80,"戦績",1,130,44);
          drawbuttom(60,125,"実績リスト",0,130,44);
          drawbuttom(60,170,"達成役1",0,130,44);
          drawbuttom(60,215,"達成役2",0,130,44);
          var wT=winrank[winrank[0][4]][0]+winrank[winrank[0][4]][1]+winrank[winrank[0][4]][2]+winrank[winrank[0][4]][3]
          var winrate=0;
          if(wT>0){
            winrate=Math.floor(winrank[winrank[0][4]][0]/wT*1000)/10  
          }
          var X=200;
          cx2.font = "22px 'Century Gothic'";
          cx2.fillStyle = "black";
          cx2.fillText( "打数　ソロ："+highscore[0]+"回 /対戦："+highscore[4]+"回",X,105);
          cx2.fillText( "勝率："+winrate+"%",X,135);
          cx2.textAlign="center";
          cx2.fillText( LPlist[winrank[0][4]],450,135);
          cx2.textAlign="start";
          cx2.fillText( "最大戦闘力："+highscore[1],X,185);
          cx2.fillText( "瞬間最大火力："+highscore[2],X,215);
          cx2.font = "18px 'Century Gothic'";
          cx2.fillText( "順位別　1位："+winrank[winrank[0][4]][0]+" /2位："+winrank[winrank[0][4]][1]+" /3位："+winrank[winrank[0][4]][2]+" /4位："+winrank[winrank[0][4]][3],X,155);
          var option_arrow = new createjs.Shape();
                option_arrow.graphics.beginFill("#0080ff").beginStroke("#68ceed").setStrokeStyle(2)
                        .moveTo(0, 0).lineTo(18, -12).lineTo(18, 12).lineTo(0, 0)
                option_arrow.x=370;
                option_arrow.y=125;
                menu_main.addChild(option_arrow);
                option_arrow.addEventListener("click", {card:1,handleEvent:SoundBar});
                var option_arrow = new createjs.Shape();
                option_arrow.graphics.beginFill("#0080ff").beginStroke("#68ceed").setStrokeStyle(2)
                        .moveTo(0, -12).lineTo(18, 0).lineTo(0, 12).lineTo(0, -12)
                option_arrow.x=510;
                option_arrow.y=125;
                menu_main.addChild(option_arrow);
                option_arrow.addEventListener("click", {card:2,handleEvent:SoundBar});
                function SoundBar(){
                  if(this.card==1){
                    se3.play()
                    winrank[0][4]-=1;
                    if(winrank[0][4]==-1){winrank[0][4]=4};
                    if(winrank[0][4]==3){winrank[0][4]=2};
                  }
                  if(this.card==2){
                    se3.play()
                    winrank[0][4]+=1;
                    if(winrank[0][4]==3){winrank[0][4]=4};
                    if(winrank[0][4]==5){winrank[0][4]=0};
                  }
                  menuMap(2);
                };
          var achieveC=achieveB.filter(value=>value.sub=="その他");
          X+=10;
          var Y=245
          cx2.fillStyle = "black"; 
          cx2.font = "20px 'Century Gothic'";
          cx2.fillText("最大連荘",X,Y);
          cx2.fillText(highscore[3]+"回",X+130,Y);
          Y+=22;
          for(var i=0;i<achieveC.length; i++){
              cx2.fillText(achieveC[i].name,X,Y);
              cx2.fillText(achieveC[i].cleared+"回",X+130,Y);
            Y+=22;
            if(Y>510){
              X+=280;
              Y=110;
            }
          }
          break;
        case 1:
          //実績リスト
          Textlist[0].text="解放された実績リストです。";
          Textlist[1].text="クリックで装着することができます。（効果はない）"
          var A=achieveA.findIndex(value=>value.name==Usercrest);
          if(A>=0){
            if(A<=20){
              cx2.fillStyle = "rgba(0,0,0,0.3)";
              cx2.fillRect(190,92+20*A,240,20);
            }else{
              cx2.fillStyle = "rgba(0,0,0,0.3)";
              cx2.fillRect(470,92+20*(A-21),240,20);
            }
          }
            drawbuttom(60,80,"戦績",0,130,44);
            drawbuttom(60,125,"実績リスト",1,130,44);
            drawbuttom(60,170,"達成役1",0,130,44);
            drawbuttom(60,215,"達成役2",0,130,44);
            var A=achieveA.filter(value=>value.cleared>0);
            cx2.font = "bold 20px 'Century Gothic'";
            cx2.fillStyle = "black";
            cx2.fillText("実績 "+A.length+"/"+achieveA.length,200,85) 
            var X=200;
            var Y=110
            cx2.fillStyle = "black"; 
            for(var i=0;i<achieveA.length; i++){
              if(achieveA[i].cleared==0){
                cx2.font = "18px 'Century Gothic'";
                cx2.fillText("？？？",X,Y);
              }else{
                cx2.font = "bold 18px 'Century Gothic'";
                cx2.fillText(achieveA[i].name,X,Y);
                cx2.font = "18px 'Century Gothic'";
              }
              Y+=20;
              if(Y>=520){
                X+=280;
                Y=110;
              }
            }
          break;
        case 2:
          //達成役一覧
          Textlist[0].text="達成役一覧です。";
          Textlist[1].text="かっこ内は達成した回数です。"
            drawbuttom(60,80,"戦績",0,130,44);
            drawbuttom(60,125,"実績リスト",0,130,44);
            drawbuttom(60,170,"達成役1",1,130,44);
            drawbuttom(60,215,"達成役2",0,130,44);
            var achieveC=achieveB.filter(value=>value.sub=="アガリ形");
            var A=achieveC.filter(value=>value.cleared>0);
            cx2.font = "bold 20px 'Century Gothic'";
            cx2.fillStyle = "black";
            cx2.fillText("一般 "+A.length+"/"+achieveC.length,200,85) 
            var X=200;
            var Y=110
            for(var i=0;i<achieveC.length; i++){
              if(achieveC[i].cleared==0){
                cx2.fillStyle = "#8c8c8c";
                cx2.font = "18px 'Century Gothic'";
                cx2.fillText(achieveC[i].name,X,Y);
                cx2.fillText(" ("+achieveC[i].cleared+")",X+200,Y);
              }else{
                cx2.fillStyle = "black"; 
                cx2.font = "bold 18px 'Century Gothic'";
                cx2.fillText(achieveC[i].name,X,Y);
                cx2.font = "18px 'Century Gothic'";
                cx2.fillText(" ("+achieveC[i].cleared+")",X+200,Y);
              }
              Y+=20;
              if(Y>=500){
                break;
              }
            }
          break;
          case 3:
            //達成役一覧
            Textlist[0].text="達成役一覧です。";
            Textlist[1].text="かっこ内は達成した回数です。"
              drawbuttom(60,80,"戦績",0,130,44);
              drawbuttom(60,125,"実績リスト",0,130,44);
              drawbuttom(60,170,"達成役1",0,130,44);
              drawbuttom(60,215,"達成役2",1,130,44);
              var achieveC=achieveB.filter(value=>value.sub=="シナジー役");
              var A=achieveC.filter(value=>value.cleared>0);
              cx2.font = "bold 20px 'Century Gothic'";
              cx2.fillStyle = "black";
              cx2.fillText("シナジー "+A.length+"/"+achieveC.length,200,85) 
              var X=200;
              var Y=110
              for(var i=0;i<achieveC.length; i++){
                if(achieveC[i].cleared==0){
                  cx2.fillStyle = "#8c8c8c";
                  cx2.font = "18px 'Century Gothic'";
                  cx2.fillText(achieveC[i].name,X,Y);
                  //cx2.fillText(achieveC[i].count+"/"+achieveC[i].max,X+150,Y);
                }else{
                  cx2.fillStyle = "black"; 
                  cx2.font = "bold 18px 'Century Gothic'";
                  cx2.fillText(achieveC[i].name,X,Y);
                  cx2.font = "18px 'Century Gothic'";
                  //cx2.fillText(achieveC[i].count+"/"+achieveC[i].max+" ("+achieveC[i].cleared+")",X+150,Y);
                  cx2.fillText(" ("+achieveC[i].cleared+")",X+150,Y);
                }
                Y+=20;
                if(Y>=500){
                  X+=280;
                  Y=110;
                }
              }
              var achieveD=achieveB.filter(value=>value.sub=="キャラ役");
              var B=achieveD.filter(value=>value.cleared>0);
              cx2.font = "bold 20px 'Century Gothic'";
              cx2.fillStyle = "black";
              cx2.fillText("属性ペア "+B.length+"/"+achieveD.length,380,85) 
              Y+=10;
              for(var i=0;i<achieveD.length; i++){
                if(achieveD[i].cleared==0){
                  cx2.fillStyle = "#8c8c8c";
                  cx2.font = "18px 'Century Gothic'";
                  cx2.fillText(achieveD[i].name,X,Y);
                  cx2.fillText(" ("+achieveD[i].cleared+")",X+200,Y);
                }else{
                  cx2.fillStyle = "black"; 
                  cx2.font = "bold 18px 'Century Gothic'";
                  cx2.fillText(achieveD[i].name,X,Y);
                  cx2.font = "18px 'Century Gothic'";
                  cx2.fillText(" ("+achieveD[i].cleared+")",X+200,Y);
                }
                Y+=20;
                if(Y>=500){
                  X+=280;
                  Y=110;
                }
              }
            break;
      }
      var Cb=canvas2.toDataURL();
      Cbb = new createjs.Bitmap(Cb);
      menu_main.addChild(Cbb);
    break;
    case 3:
    //プレイガイド
    menu_guide.removeAllChildren();
    var e = new createjs.Bitmap(queue.getResult(epic_src[0]));
    e.x=50;
    e.y=50;
    e.scale=1.1;
    menu_guide.addChild(e);
    var e = new createjs.Bitmap(queue.getResult(epic_src[0]));
    e.x=400;
    e.y=50;
    e.scale=1.1;
    menu_guide.addChild(e);
    var option_bt5 = new createjs.Bitmap('don/soL_batu.png');
    option_bt5.x=680;
    option_bt5.y=60;
    option_bt5.scale=0.4;
    menu_guide.addChild(option_bt5)
    option_bt5.addEventListener("click", {card:-1,handleEvent:HowtoBt});
    switch(msgstate){
      case 0:
        var e = new createjs.Bitmap(queue.getResult(epic_src[5]));
        e.x=270;
        e.y=100;
        menu_guide.addChild(e)
        Textlist[0].text="読んでもよく分からないマニュアル。";
        Textlist[1].text="エルコレドンジャラのルール説明です。";   
        var t = new createjs.Text("プレイガイド", "24px 'Century Gothic'", "black");
        t.x=62;
        t.y=70;
        menu_guide.addChild(t);
        var btn1 = createButton("画面の見方", 130, 40);
        btn1.x = 60;
        btn1.y = 100;
        menu_guide.addChild(btn1);
        btn1.addEventListener("click", {card:1,handleEvent:HowtoBt});
        var btn1 = createButton("役/3ペア", 130, 40);
        btn1.x = 60;
        btn1.y = 140;
        menu_guide.addChild(btn1);
        btn1.addEventListener("click", {card:2,handleEvent:HowtoBt});
        var btn1 = createButton("役/ライン通貫", 130, 40);
        btn1.x = 60;
        btn1.y = 180;
        menu_guide.addChild(btn1);
        btn1.addEventListener("click", {card:3,handleEvent:HowtoBt});
        var btn1 = createButton("役/特殊な役", 130, 40);
        btn1.x = 60;
        btn1.y = 220;
        menu_guide.addChild(btn1);
        btn1.addEventListener("click", {card:4,handleEvent:HowtoBt});
        var btn1 = createButton("シナジー", 130, 40);
        btn1.x = 60;
        btn1.y = 260;
        menu_guide.addChild(btn1);
        btn1.addEventListener("click", {card:5,handleEvent:HowtoBt});
        var btn1 = createButton("ポン", 130, 40);
        btn1.x = 60;
        btn1.y = 300;
        menu_guide.addChild(btn1);
        btn1.addEventListener("click", {card:6,handleEvent:HowtoBt});
        var btn1 = createButton("カン", 130, 40);
        btn1.x = 60;
        btn1.y = 340;
        menu_guide.addChild(btn1);
        btn1.addEventListener("click", {card:7,handleEvent:HowtoBt});
        var btn1 = createButton("マナブレイク", 130, 40);
        btn1.x = 60;
        btn1.y = 380;
        menu_guide.addChild(btn1);
        btn1.addEventListener("click", {card:8,handleEvent:HowtoBt});
        var btn1 = createButton("パイ一覧", 130, 40);
        btn1.x = 60;
        btn1.y = 420;
        menu_guide.addChild(btn1);
        btn1.addEventListener("click", {card:9,handleEvent:HowtoBt});
        break;
      case 1:
        //プレイ画面
        var btn1 = createButton("目次", 80, 40);
        btn1.x = 5;
        btn1.y = 80;
        menu_guide.addChild(btn1);
        btn1.addEventListener("click", {card:0,handleEvent:HowtoBt});
        Textlist[0].text="画面の見方です。";
        Textlist[1].text="（カーソルを当ててみてください）"
        var e = new createjs.Bitmap(queue.getResult(epic_src[1]));
        e.x=90;
        e.y=55;
        menu_guide.addChild(e)
        break;
        case 2:
          //3ペアの説明
          var btn1 = createButton("目次", 80, 40);
          btn1.x = 5;
          btn1.y = 80;
          menu_guide.addChild(btn1);
          btn1.addEventListener("click", {card:0,handleEvent:HowtoBt});
          Textlist[0].text="3ペアは最も基本的な役です。";
          Textlist[1].text="同じキャラ3枚を1組として、3組を揃える役です。"
          var e = new createjs.Bitmap(queue.getResult(epic_src[2]));
          e.sourceRect={x:0,y:0,width:600,height:128};
          e.x=90;
          e.y=125;
          menu_guide.addChild(e)
          var t = new createjs.Text("3ペアとはなんですか？", "26px 'Century Gothic'", "black");
          t.x=90;
          t.y=90;
          menu_guide.addChild(t);
          var Y=280;
          var t = new createjs.Text("エルコレドンジャラでは9枚のパイで役を作る必要があります。", "22px 'Century Gothic'", "black");
          t.x=90;
          t.y=Y;
          Y+=30;
          menu_guide.addChild(t);
          var t = new createjs.Text("3ペアは、「アイシャ」「ラシェ」「エリシス」のように、", "22px 'Century Gothic'", "black");
          t.x=90;
          t.y=Y;
          Y+=30;
          menu_guide.addChild(t);
          var t = new createjs.Text("同じキャラクターを3枚1組として、3組揃えます。", "22px 'Century Gothic'", "black");
          t.x=90;
          t.y=Y;
          Y+=30;
          menu_guide.addChild(t);
          var t = new createjs.Text("同じキャラクターであればラインが異なっていても良いですし、", "22px 'Century Gothic'", "black");
          t.x=90;
          t.y=Y;
          Y+=30;
          menu_guide.addChild(t);
          var t = new createjs.Text("同じパイが複数あっても構いません。", "22px 'Century Gothic'", "black");
          t.x=90;
          t.y=Y;
          Y+=30;
          menu_guide.addChild(t);
          var t = new createjs.Text("「ポン」によって効率的にペアを揃えることができます。", "22px 'Century Gothic'", "black");
          t.x=90;
          t.y=Y;
          Y+=30;
          menu_guide.addChild(t);
          break;
          case 3:
            //ラインの説明
            var btn1 = createButton("目次", 80, 40);
            btn1.x = 5;
            btn1.y = 80;
            menu_guide.addChild(btn1);
            btn1.addEventListener("click", {card:0,handleEvent:HowtoBt});
            Textlist[0].text="ライン通貫は、同じラインのキャラを9枚揃える役です。";
            Textlist[1].text="シナジーでの高得点が狙いやすいかもしれません。"
            var e = new createjs.Bitmap(queue.getResult(epic_src[2]));
            e.sourceRect={x:0,y:0,width:600,height:128};
            e.x=90;
            e.y=125;
            menu_guide.addChild(e)
            var t = new createjs.Text("ライン通貫とはなんですか？", "26px 'Century Gothic'", "black");
            t.x=90;
            t.y=90;
            menu_guide.addChild(t);
            var Y=280;
            var t = new createjs.Text("エルコレドンジャラでは9枚のパイで役を作る必要があります。", "22px 'Century Gothic'", "black");
            t.x=90;
            t.y=Y;
            Y+=30;
            menu_guide.addChild(t);
            var t = new createjs.Text("「1」「2」「3」「4」のように、パイに書かれた数字が", "22px 'Century Gothic'", "black");
            t.x=90;
            t.y=Y;
            Y+=30;
            menu_guide.addChild(t);
            var t = new createjs.Text("同じパイを9組揃えることで、ライン通貫が成立します。", "22px 'Century Gothic'", "black");
            t.x=90;
            t.y=Y;
            Y+=30;
            menu_guide.addChild(t);
            var t = new createjs.Text("同じパイが複数あっても構いません。", "22px 'Century Gothic'", "black");
            t.x=90;
            t.y=Y;
            Y+=30;
            menu_guide.addChild(t);
            var t = new createjs.Text("「ポン」や「カン」した場合には満たせなくなります。", "22px 'Century Gothic'", "black");
            t.x=90;
            t.y=Y;
            Y+=30;
            menu_guide.addChild(t);
            break;
            case 4:
              //特殊な役
              var btn1 = createButton("目次", 80, 40);
              btn1.x = 5;
              btn1.y = 80;
              menu_guide.addChild(btn1);
              btn1.addEventListener("click", {card:0,handleEvent:HowtoBt});
              Textlist[0].text="3ペア・ライン通貫の他に特殊な役として";
              Textlist[1].text="国士無双とクレストシリーズがあります。";
              var e = new createjs.Bitmap(queue.getResult(epic_src[4]));
              e.scale=600/650;
              e.x=90;
              e.y=120;
              menu_guide.addChild(e)
              var t = new createjs.Text("特殊な役-国士無双とクレストシリーズ", "26px 'Century Gothic'", "black");
              t.x=90;
              t.y=90;
              menu_guide.addChild(t);
              var Y=400;
              var t = new createjs.Text("「国士無双」は、「マスターロード」のパイを", "22px 'Century Gothic'", "black");
              t.x=90;
              t.y=Y;
              Y+=30;
              menu_guide.addChild(t);
              var t = new createjs.Text("8種類かつ9枚揃えることで成立します。", "22px 'Century Gothic'", "black");
              t.x=90;
              t.y=Y;
              Y+=30;
              menu_guide.addChild(t);
              var t = new createjs.Text("「クレスト」シリーズは、マスターロードのパイを含み", "22px 'Century Gothic'", "black");
              t.x=90;
              t.y=Y;
              Y+=30;
              menu_guide.addChild(t);
              var t = new createjs.Text("属性マークが同じパイを9枚揃えることで成立します。", "22px 'Century Gothic'", "black");
              t.x=90;
              t.y=Y;
              Y+=30;
              menu_guide.addChild(t);
              break;
              case 5:
                //シナジーの説明
                var btn1 = createButton("目次", 80, 40);
                btn1.x = 5;
                btn1.y = 80;
                menu_guide.addChild(btn1);
                btn1.addEventListener("click", {card:0,handleEvent:HowtoBt});
                Textlist[0].text="シナジーは、和了した時に追加で加点される役です。";
                Textlist[1].text="まずは3ペアやライン通貫を優先しましょう。"
                var t = new createjs.Text("（枠内クリックで上下にスクロールできます）", "20px 'Century Gothic'", "black");
                t.x=170;
                t.y=495;
                menu_guide.addChild(t);
                yakumap.x=40;
                yakumap.alpha=1;
                break;
                case 6:
                  //ポンの説明
                  var btn1 = createButton("目次", 80, 40);
                  btn1.x = 5;
                  btn1.y = 80;
                  menu_guide.addChild(btn1);
                  btn1.addEventListener("click", {card:0,handleEvent:HowtoBt});
                  Textlist[0].text="1つ前のプレイヤーが捨てたパイと同じキャラのパイが";
                  Textlist[1].text="手元に2枚以上ある時、捨てパイを貰うことができます。"
                  var e = new createjs.Bitmap(queue.getResult(epic_src[3]));
                  e.sourceRect={x:50,y:0,width:500,height:526};
                  e.x=365;
                  e.y=55;
                  e.scale=38/50;
                  menu_guide.addChild(e)
                  var t = new createjs.Text("ポン", "26px 'Century Gothic'", "black");
                  t.x=90;
                  t.y=90;
                  menu_guide.addChild(t);
                  var Y=130;
                  var t = new createjs.Text("ポンについて知りたいポン？", "22px 'Century Gothic'", "black");
                  t.x=60;
                  t.y=Y;
                  Y+=40;
                  menu_guide.addChild(t);
                  var t = new createjs.Text("前の人が捨てたパイと同じ", "22px 'Century Gothic'", "black");
                  t.x=60;
                  t.y=Y;
                  Y+=30;
                  menu_guide.addChild(t);
                  var t = new createjs.Text("キャラのパイを2枚持って", "22px 'Century Gothic'", "black");
                  t.x=60;
                  t.y=Y;
                  Y+=30;
                  menu_guide.addChild(t);
                  var t = new createjs.Text("いるなら「ポン！」と叫んで", "22px 'Century Gothic'", "black");
                  t.x=60;
                  t.y=Y;
                  Y+=30;
                  menu_guide.addChild(t);
                  var t = new createjs.Text("そのパイを貰えるポン！", "22px 'Century Gothic'", "black");
                  t.x=60;
                  t.y=Y;
                  Y+=40;
                  menu_guide.addChild(t);
                  var t = new createjs.Text("ポンした後は山からパイを", "22px 'Century Gothic'", "black");
                  t.x=60;
                  t.y=Y;
                  Y+=30;
                  menu_guide.addChild(t);
                  var t = new createjs.Text("引かず、手札を1枚切るポン。", "22px 'Century Gothic'", "black");
                  t.x=60;
                  t.y=Y;
                  Y+=40;
                  menu_guide.addChild(t);
                  var t = new createjs.Text("ポンすると3ペアを揃えやすく", "22px 'Century Gothic'", "black");
                  t.x=60;
                  t.y=Y;
                  Y+=30;
                  menu_guide.addChild(t);
                  var t = new createjs.Text("なるけど、その代わりに", "22px 'Century Gothic'", "black");
                  t.x=60;
                  t.y=Y;
                  Y+=30;
                  menu_guide.addChild(t);
                  var t = new createjs.Text("得点が少し減っちゃうポン…。", "22px 'Century Gothic'", "black");
                  t.x=60;
                  t.y=Y;
                  Y+=30;
                  menu_guide.addChild(t);
                  break;
                  case 7:
                    //カン
                    var btn1 = createButton("目次", 80, 40);
                    btn1.x = 5;
                    btn1.y = 80;
                    menu_guide.addChild(btn1);
                    btn1.addEventListener("click", {card:0,handleEvent:HowtoBt});
                    Textlist[0].text="同じキャラのパイが4枚あるとき、";
                    Textlist[1].text="カンによって4枚を1ペアとして扱うことができます。"
                    var t = new createjs.Text("カン", "26px 'Century Gothic'", "black");
                    t.x=90;
                    t.y=90;
                    menu_guide.addChild(t);
                    var Y=130;
                    var t = new createjs.Text("基本的に3ペアでは同キャラ3枚を一組として扱いますが、", "22px 'Century Gothic'", "black");
                    t.x=90;
                    t.y=Y;
                    Y+=30;
                    menu_guide.addChild(t);
                    var t = new createjs.Text("カンにより同キャラ4枚を一組として扱うことができます。", "22px 'Century Gothic'", "black");
                    t.x=90;
                    t.y=Y;
                    Y+=30;
                    menu_guide.addChild(t);
                    var t = new createjs.Text("自分が同じキャラのパイを4枚持っている時、", "22px 'Century Gothic'", "black");
                    t.x=90;
                    t.y=Y;
                    Y+=30;
                    menu_guide.addChild(t);
                    var t = new createjs.Text("または自分が同じキャラのパイを3枚持っていて", "22px 'Century Gothic'", "black");
                    t.x=90;
                    t.y=Y;
                    Y+=30;
                    menu_guide.addChild(t);
                    var t = new createjs.Text("前の人がそれと同じキャラのパイを捨てた時、", "22px 'Century Gothic'", "black");
                    t.x=90;
                    t.y=Y;
                    Y+=30;
                    menu_guide.addChild(t);
                    var t = new createjs.Text("「カン」することができます。", "22px 'Century Gothic'", "black");
                    t.x=90;
                    t.y=Y;
                    Y+=30;
                    menu_guide.addChild(t);
                    var t = new createjs.Text("カンをした後は、山とは別の場所からパイを1枚引き、", "22px 'Century Gothic'", "black");
                    t.x=90;
                    t.y=Y;
                    Y+=30;
                    menu_guide.addChild(t);
                    var t = new createjs.Text("その後、手札のパイを選んで切ります。", "22px 'Century Gothic'", "black");
                    t.x=90;
                    t.y=Y;
                    Y+=30;
                    menu_guide.addChild(t);
                    var t = new createjs.Text("カンをすると、ドラが1枚増えます。", "22px 'Century Gothic'", "black");
                    t.x=90;
                    t.y=Y;
                    Y+=30;
                    menu_guide.addChild(t);
                    var t = new createjs.Text("運がよければ、得点アップを期待できるかもしれません。", "22px 'Century Gothic'", "black");
                    t.x=90;
                    t.y=Y;
                    Y+=30;
                    menu_guide.addChild(t);
                    break;
                    case 8:
                      //マナブレイクの説明
                      var btn1 = createButton("目次", 80, 40);
                      btn1.x = 5;
                      btn1.y = 80;
                      menu_guide.addChild(btn1);
                      btn1.addEventListener("click", {card:0,handleEvent:HowtoBt});
                      Textlist[0].text="MPを消費してマナブレイクすることができます。";
                      Textlist[1].text="ここぞという時に使いましょう。"
                      var e = new createjs.Bitmap(queue.getResult(epic_src[6]));
                      e.x=350;
                      e.y=120;
                      e.scale=0.66;
                      menu_guide.addChild(e)
                      var t = new createjs.Text("マナブレイク", "26px 'Century Gothic'", "black");
                      t.x=90;
                      t.y=90;
                      menu_guide.addChild(t);
                      var Y=130;
                      var t = new createjs.Text("マウスを長押ししていると", "22px 'Century Gothic'", "black");
                      t.x=60;
                      t.y=Y;
                      Y+=30;
                      menu_guide.addChild(t);
                      var t = new createjs.Text("自分のMPゲージが徐々に", "22px 'Century Gothic'", "black");
                      t.x=60;
                      t.y=Y;
                      Y+=30;
                      menu_guide.addChild(t);
                      var t = new createjs.Text("緑色に変わっていきます。", "22px 'Century Gothic'", "black");
                      t.x=60;
                      t.y=Y;
                      Y+=40;
                      menu_guide.addChild(t);
                      var t = new createjs.Text("MPが1ゲージ以上緑色に", "22px 'Century Gothic'", "black");
                      t.x=60;
                      t.y=Y;
                      Y+=30;
                      menu_guide.addChild(t);
                      var t = new createjs.Text("変化した状態でパイを切ると", "22px 'Century Gothic'", "black");
                      t.x=60;
                      t.y=Y;
                      Y+=30;
                      menu_guide.addChild(t);
                      var t = new createjs.Text("マナブレイクが発動します！", "22px 'Century Gothic'", "black");
                      t.x=60;
                      t.y=Y;
                      Y+=40;
                      menu_guide.addChild(t);
                      var t = new createjs.Text("マナブレイクしたパイは", "22px 'Century Gothic'", "black");
                      t.x=60;
                      t.y=Y;
                      Y+=30;
                      menu_guide.addChild(t);
                      var t = new createjs.Text("相手プレイヤーから見えず、", "22px 'Century Gothic'", "black");
                      t.x=60;
                      t.y=Y;
                      Y+=30;
                      menu_guide.addChild(t);
                      var t = new createjs.Text("ポンやロンされません。", "22px 'Century Gothic'", "black");
                      t.x=60;
                      t.y=Y;
                      Y+=40;
                      menu_guide.addChild(t);
                      var t = new createjs.Text("リーチする時や、リーチ中でも使用できますが、", "22px 'Century Gothic'", "black");
                      t.x=60;
                      t.y=Y;
                      Y+=30;
                      menu_guide.addChild(t);
                      var t = new createjs.Text("緑色になっていた分だけMPを消費します。", "22px 'Century Gothic'", "black");
                      t.x=60;
                      t.y=Y;
                      Y+=30;
                      menu_guide.addChild(t);
                      break;
                      case 9:
                        //一覧
                        var btn1 = createButton("目次", 80, 40);
                        btn1.x = 5;
                        btn1.y = 80;
                        menu_guide.addChild(btn1);
                        btn1.addEventListener("click", {card:0,handleEvent:HowtoBt});
                        Textlist[0].text="エルス～リティアはそれぞれ5枚（エピックライン2枚）";
                        Textlist[1].text="マスターロードはそれぞれ2枚、合計93枚のパイを使用します。"
                        var t = new createjs.Text("パイの一覧表です。", "20px 'Century Gothic'", "black");
                        t.x=170;
                        t.y=495;
                        menu_guide.addChild(t);
                        paiviewer.x=60;
                        paiviewer.alpha=1;
                        Remaincheck(-2);
                        break;
    }
    break;
    case 4:
//たいせん
menu_duel.removeAllChildren();
switch(msgstate){
  case 0:
//ルーム入口
var e = new createjs.Bitmap(queue.getResult(epic_src[0]));
e.x=50;
e.y=50;
e.scale=1.1;
menu_duel.addChild(e);
var e = new createjs.Bitmap(queue.getResult(epic_src[0]));
e.x=400;
e.y=50;
e.scale=1.1;
menu_duel.addChild(e);
var option_bt5 = new createjs.Bitmap('don/soL_batu.png');
option_bt5.x=700;
option_bt5.y=60;
option_bt5.scale=0.4;
menu_duel.addChild(option_bt5)
option_bt5.addEventListener("click", {card:-1,handleEvent:HowtoBt});
var rect = new createjs.Shape();
      rect.graphics
        .beginFill("rgba(16, 7, 79, 0.7)")
        .drawRect(60, 80, 200, 200)
        .drawRect(280, 80, 200, 200)
        .drawRect(500, 80, 200, 200);
      menu_duel.addChild(rect);
  RoomAry=[];
  RoomConfigAry=[];
  Textlist[0].text="ルーム選択";
  Textlist[1].text="現在の接続人数："+Usercount; 
  for(var i=0;i<3;i++){
  var btn1 = createButton("ルーム"+(i+1), 130, 45);
        btn1.x = 90+220*i;
        btn1.y = 80;
        menu_duel.addChild(btn1);
  var t = new createjs.Text("人数："+RoomNum[i]+"/4", "bold 22px Arial", "white");
        t.x=80+220*i;
        t.y=150;
        menu_duel.addChild(t);
        RoomAry.push(t);
  var t = new createjs.Text("状態："+RoomState[i], "bold 22px Arial", "white");
        t.x=80+220*i;
        t.y=190;
        menu_duel.addChild(t);
        RoomAry.push(t);
        btn1.addEventListener("click", {card:i+1,handleEvent:Nyusitu});
  }    
    break;
  case 2:
    RoomConfigAry=[];
    var rect = new createjs.Shape();
      rect.graphics
        .beginFill("#001c0d")
        .drawRect(0, 0, 800, 600);
      menu_duel.addChild(rect);
      rect.graphics
      .beginFill("#126e60")
      .drawRect(11, 100, 148, 300)
      .drawRect(161, 100, 148, 300)
      .drawRect(311, 100, 148, 300)
      .drawRect(461, 100, 148, 300);
    menu_duel.addChild(rect);
    var s = new createjs.Shape();
    s.graphics.beginFill("rgba(107, 218, 203, 0.7)");
    s.graphics.drawRoundRect(620,100,170,380,10,10,);
    menu_duel.addChild(s);
    s.addEventListener("click", {handleEvent:Menu}); 
    for(var i=0;i<4;i++){
    var t = new createjs.Text('CPU', "bold 30px Arial", "white");
    t.x=50+150*i;
    t.y=250;
    t.rotation=-7;
    menu_duel.addChild(t);
    }
    var t = new createjs.Text(LP_PVP.Rule[LP_PVP.Rule[0]]+"　"+LP_PVP.Length[LP_PVP.Length[0]]+"戦", "bold 30px Arial", "white");
    t.x=200;
    t.y=30;
    menu_duel.addChild(t);
    RoomConfigAry.push(t);
    var t = new createjs.Text("持ち点 "+LP_PVP.LP[LP_PVP.LP[0]]+"　"+LP_PVP.Block[LP_PVP.Block[0]]+"　"+LP_PVP.Skill[LP_PVP.Skill[0]], "bold 30px Arial", "white");
    t.x=170;
    t.y=65;
    menu_duel.addChild(t);
    RoomConfigAry.push(t);
    var rect = new createjs.Shape();
      rect.graphics
        .beginFill("rgba(16, 7, 79, 0.7)")
        .drawRect(1, 1, 80, 40)
      menu_duel.addChild(rect);
      var t = new createjs.Text("ルーム"+IAM.room, "14px Arial", "white");
      t.x=10;
      t.y=10;
      menu_duel.addChild(t);
      if(IsHost(IAM.room)){
        var Ary=["ルール","◀"+LP_PVP.Rule[LP_PVP.Rule[0]]+"▶",'持ち点',"◀"+LP_PVP.LP[LP_PVP.LP[0]]+"▶",'東風/半荘',"◀"+LP_PVP.Length[LP_PVP.Length[0]]+"▶",'満貫打ち止め',"◀"+LP_PVP.Block[LP_PVP.Block[0]]+"▶",'スキル',"◀"+LP_PVP.Skill[LP_PVP.Skill[0]]+"▶"]
      }else{
        var Ary=["ルール",LP_PVP.Rule[LP_PVP.Rule[0]],'持ち点',LP_PVP.LP[LP_PVP.LP[0]],'東風/半荘',LP_PVP.Length[LP_PVP.Length[0]],'満貫打ち止め',LP_PVP.Block[LP_PVP.Block[0]],'スキル',LP_PVP.Skill[LP_PVP.Skill[0]]]
      }
        var X=700;
        var Y=110;
        for(var i=0;i<Ary.length;i++){
        var t = new createjs.Text(Ary[i], "bold 22px Arial", "white");
        t.x=X;
        t.y=Y;
        t.textAlign="center";
        menu_duel.addChild(t);
        Y+=30;
        if(i%2==1){
          Y+=10;
          RoomConfigAry.push(t);
        };
        }
    break;
  }
  break;//end of menumap switch
  }
};
function HowtoBt(){
  if(msgstate==5){
    yakumap.x=0;
    yakumap.alpha=0;}
  if(msgstate==9){
    paiviewer.x=0;
    paiviewer.alpha=0;
  }
  switch(this.card){
    case -1:
      pagestate=0;
      msgstate=0;
      se2.play();
      Menu();
      //トップに戻る
    break;
    default:
      msgstate=this.card;
      se3.play();
      if(msgstate>=0){menuMap(3)};
    break;
  }
}
function Nyusitu(){
  var rn=this.card;
  console.log('nyusitu',rn);
  if(msgstate==0){msgstate=1};
  var clientId=Username;
  var clientCrest=Usercrest;
  var clientChr=chara[1];
  var roomId=RoomName[rn];
  socket.emit('join_to_room',{token: IAM.token,name:clientId,crest:clientCrest,chr:clientChr,room:roomId});
  cx4.globalAlpha=1;
  se3.play();
  cx4.fillStyle = "rgba(20,20,20,0.7)";
  cx4.fillRect(0,0,800,600)
  cx4.font = "bold 26px 'メイリオ'";
  cx4.fillStyle = "black";
  cx4.strokeStyle ="rgba(250,250,250,0.9)";
  cx4.lineWidth=5;
  cx4.strokeText("入室しています",240,200);
  cx4.fillText("入室しています",240,200);   
  var C=canvas4.toDataURL();
  var Cb = new createjs.Bitmap(C);
  yakumap.addChild(Cb);
  }
function NameChange(){
  se3.play();
  user = window.prompt("プレイヤー名を入力", Username);
  if(!user ||!user.match(/\S/g)){
    se2.play();
    window.alert("未入力です")
    return false;
  }
    let len = 0;
    for (let i = 0; i < user.length; i++) {
    (user[i].match(/[ -~]/)) ? len += 1 : len += 2;
    }
    if(len>12){
      se2.play();
      window.alert("長すぎる名前は嫌われます")
      return false;
    }
    //表示名を更新する処理
    se3.play();
    Username=user;
    UsernameText.text=Username;
    menuMap(2);
  };
  function OptionConfig(){
    if(opLock==0 && pagestate==1){
    opLock=3;
    se11.play();
    Configmap.removeAllChildren();
    var shape = new createjs.Shape();
    shape.graphics.beginFill("black");
    shape.graphics.drawRect(300, 200, 220, 250);
    shape.alpha=0.7;
    Configmap.addChild(shape);
    var option_bt2 = new createjs.Bitmap(queue.getResult('don/soL_option_bt2.png'));
    option_bt2.x=310;
    option_bt2.y=280;
    option_bt2.scale=1.2;
    Configmap.addChild(option_bt2)
    var option_bt3 = new createjs.Bitmap(queue.getResult('don/soL_option_bt3.png'));
    option_bt3.x=310;
    option_bt3.y=330;
    option_bt3.scale=1.2;
    Configmap.addChild(option_bt3)
    var option_bt4 = new createjs.Bitmap(queue.getResult('don/soL_option_bt4.png'));
    option_bt4.x=310;
    option_bt4.y=380;
    option_bt4.scale=1.2;
    Configmap.addChild(option_bt4)
    var option_bt5 = new createjs.Bitmap('don/soL_batu.png');
    option_bt5.x=475;
    option_bt5.y=200;
    option_bt5.scale=0.4;
    Configmap.addChild(option_bt5)
    option_bt2.addEventListener("click", {card:2,handleEvent:OptionConfig});
    option_bt3.addEventListener("click", {card:3,handleEvent:OptionConfig});
    option_bt4.addEventListener("click", {card:4,handleEvent:OptionConfig});
    option_bt5.addEventListener("click", {card:5,handleEvent:OptionConfig});
    //
    return false;
    }
    if(opLock==3){
      switch(this.card){
        case 2:
          pagestate=-2;
          se5.play();
          menuMap(1);
          Configmap.removeAllChildren();
          Configmap.addChild(menu_setting);
          break;
        case 3:
            //セーブ
            se5.play();
            //Configmap.removeAllChildren();
            saveDLcomfirm();
            function saveDLcomfirm(){
            var result = window.confirm('セーブファイルをダウンロードします！');
            if( result) {
            console.log('save');
            saveDL();
                }else{
            console.log('save cancelled');
                }
            }
          break;
        case 4:
            //データ初期化
            //Configmap.removeAllChildren();
            if(JSON.parse(localStorage.getItem('UserData_Don')) === null){
              se2.play();
            }else{
              se5.play();
                var result = window.confirm('セーブデータを削除します!!（この操作は取り消しできません）');
                if(result) {
                console.log('save delete');
                saveDel();
                }else{
                console.log('save delete cancelled');
                }
            }
          break;
        case 5:
          //閉じる
          se2.play();
          Configmap.removeAllChildren();
          opLock=0;
          break;
      }
    }
  }
  function Menubutton(){
    if(debugmode){console.log('Menubutton',this.card,cLock,opLock,pagestate)};
  if(opLock==0 && pagestate==1){
    //メイン画面を開いている間のみ受付
    switch(this.card){
      case 1:
        //プレイガイド
          pagestate=4;
          msgstate=0;
          se5.play();
          menuMap(3);
          field.addChild(menu_guide);
        break;
      case 2:
        //フリーバトル
          pagestate=3;
          se5.play();
          field.addChild(menu_solo);
        break;
      case 3:
        //設定->optionconfigへ
        break;
      case 4:
        //たいせん
        pagestate=6;
        msgstate=0;
        se5.play();
        socket.emit('lobby_update');
        socket.emit("join", {name:Username});
        menuMap(4);
        field.addChild(menu_duel);
        break;
      case 5:
        //実績等
        pagestate=5;
        msgstate=0;
        se5.play();
        menuMap(2);
        field.addChild(menu_main);
        break;
    }
  }
  };
  function Menu(){
    mouseX=stage.mouseX*(1/stage.scaleX);
    mouseY=stage.mouseY*(1/stage.scaleY);
    if(debugmode){console.log('click!',cLock,"pagestate",pagestate,"msgstate",msgstate,"gamestate",gamestate)}; 
    if(gamestate!==10){clickInGame();return false;};
    switch(pagestate){
      case 0:
        musicnum=0;
        Bgm.stop();
        pagestate=1;
        if(debugmode){HiddenChara=9};
    //実績解放
    var A=achieveB.findIndex(value=>value.name=="国士無双")
    if(achieveB[A].cleared>0){
      AK("変化無双");
    };
    var A=achieveB.findIndex(value=>value.name=="天和")
    if(achieveB[A].cleared>0){
      AK("幸運の証票");
    };
    var A=achieveB.findIndex(value=>value.name=="二倍満")
    if(achieveB[A].cleared>0){
      AK("ダブルスラッシュ");
    };
    var A=achieveB.findIndex(value=>value.name=="三倍満")
    if(achieveB[A].cleared>0){
      AK("トリプルガイザー");
    };
    var A=achieveB.findIndex(value=>value.name=="数え役満")
    if(achieveB[A].cleared>0){
      AK("これで終わりだ！");
    };
    var A=achieveB.findIndex(value=>value.name=="海底")
    if(achieveB[A].cleared>0){
      AK("海千山千");
    };
    var A=achieveB.findIndex(value=>value.name=="ダブル放銃")
    if(achieveB[A].cleared>=2){
      AK("デュアルバスター");
    };
    var A=achieveB.findIndex(value=>value.name=="門前ツモ")
    if(achieveB[A].cleared>=10){
      AK("歴戦の勇士");
    };
    var A=achieveB.findIndex(value=>value.name=="ツモ")
    if(achieveB[A].cleared>0){
      AK("はじめてのツモ");
    };
    var A=achieveB.findIndex(value=>value.name=="ロン")
    if(achieveB[A].cleared>0){
      AK("はじめてのロン");
    };
    var A=achieveB.findIndex(value=>value.name=="飛び")
    if(achieveB[A].cleared>=7){
      AK("私ぶっ飛んでるの！");
    };
    var A=achieveB.findIndex(value=>value.name=="ポン")
    if(achieveB[A].cleared>=30){
      AK("回れ！回れ！回れ！");
    };
    if(achieveB[A].cleared>=100){
      AK("YOUならやれるポン");
    };
    var A=achieveB.findIndex(value=>value.name=="3ペア")
    if(achieveB[A].cleared>=30){
      AK("あなたと一緒なら");
    };
    var A=achieveB.findIndex(value=>value.name=="1ライン通貫")
    var B=achieveB.findIndex(value=>value.name=="2ライン通貫")
    var C=achieveB.findIndex(value=>value.name=="3ライン通貫")
    var D=achieveB.findIndex(value=>value.name=="4ライン通貫")
    if(achieveB[A].cleared+achieveB[B].cleared+achieveB[C].cleared+achieveB[D].cleared>=10){
      AK("突き抜ける快感");
    };
    if(highscore[0]>0){
      AK("始めまして～");
    }
    if(highscore[0]>=10){
      AK("エルドンの通");
    }
    if(highscore[0]>=50){
      AK("エルドンの民");
    }
    if(highscore[0]>=100){
      AK("エルドンの妖精");
    }
    if(highscore[0]>=179){
      AK("ロナン・エルドン");
    }
    if(highscore[0]>=300){
      AK("エルドンの覇者");
    }
    if(highscore[1]>=300000){
      AK("マスターへの道");
    }
    if(highscore[1]>=600000){
      AK("マスターへの道（ヘル）");
    }
    if(highscore[1]>=1000000){
      AK("ミリオネア")    
    };
    if(highscore[2]>=150000){
      AK("渾身の一撃");
    }
    if(highscore[2]>=300000){
      AK("魂の一撃");
    }
    if(highscore[2]>=600000){
      AK("必殺の一撃");
    }
    if(highscore[3]>=2){
      AK("まだだ");
    }
    if(highscore[3]>=3){
      AK("もう一度かかってこい");
    }
    var A=achieveA.filter(value=>value.cleared>0);
    if(A.length>=10){
      AK("柔軟な実績コレクター");
    }
    if(A.length>=30){
      AK("強靭な実績コレクター");
    }
    if(winrank[0][0]>=3 || winrank[1][0]>=3 || winrank[2][0]>=3 || winrank[4][0]>=3){
      AK("甘美な勝利")
    }
    if(winrank[0][3]>=5 || winrank[1][3]>=5 || winrank[2][3]>=5 || winrank[4][3]>=5){
      AK("ドカーン！")
    }
    //キャラクター解放
    switch(HiddenChara){
      case 3:
        var A=achieveA.findIndex(value=>value.name=="まだだ");
        var B=achieveB.findIndex(value=>value.name=="殴り合い");
        if(achieveA[A].cleared>0 && achieveB[B].cleared>0 && scoretemp[0]>0){
          CharaUnlock(HiddenChara);
        }
        break;
      case 4:
      var A=achievetempB.findIndex(value=>value.name=="放銃");
      var B=achieveB.findIndex(value=>value.name=="ナソード研究");
      if(achievetempB[A].count==0 && achieveB[B].cleared>0 && scoretemp[0]==1){
        CharaUnlock(HiddenChara);
      }
        break;
      case 5:
      var A=achieveA.findIndex(value=>value.name=="スケアチェイス");
      var B=achieveB.findIndex(value=>value.name=="一発");
      if(achieveA[A].cleared>0 && achieveB[B].cleared>=5 && scoretemp[0]>0){
        CharaUnlock(HiddenChara);
      }
        break;
      case 6:
        var A=achieveB.findIndex(value=>value.name=="貫徹する足取り");
        var B=achieveB.findIndex(value=>value.name=="豊かな足取り");
        var C=achieveB.findIndex(value=>value.name=="上手な足取り");
        var D=achieveB.findIndex(value=>value.name=="交感の足取り");
        var E=achieveB.findIndex(value=>value.name=="カン");
        if(achieveB[A].cleared>0 && achieveB[B].cleared>0 && achieveB[C].cleared>0 && achieveB[D].cleared>0 && achieveB[E].cleared>=10 && scoretemp[0]>0){
          CharaUnlock(HiddenChara);
        }
        break;
      case 7:
      var A=achieveA.findIndex(value=>value.name=="突き抜ける快感");
        if(winrank[4][0]>=3 && achieveA[A].cleared>0 && scoretemp[0]>0){
          CharaUnlock(HiddenChara);
        }
        break;
      case 8:
      var A=achieveA.findIndex(value=>value.name=="YOUならやれるポン");
      var B=achieveB.findIndex(value=>value.name=="クレストオブガイア");
      var C=0;
      for(var i=0;i<7;i++){
        C+=achieveB[B+i].cleared;
      }
        if(C>0 && achieveA[A].cleared>0 && scoretemp[0]>0){
          CharaUnlock(HiddenChara);
        }
        break;
        default:
          break;
    }
    function CharaUnlock(){
      //適当なコンテナをお借りする
      scoretemp[0]=0;
      jingle3.seek(1);
      jingle3.play();
      var Ary=[
        ["パッシブスキル：ナソードコア","a","　太陽パイを切る度にナソードコアを生成","a","　ナソードコア1つにつき+10符","a","　コアがある時、一度だけ食いしばり発動","b","アクティブスキル：グラウンドクラッシュ","a","　MPを3ゲージ消費","a","　台パンによりその局を流局にする"],
        ["パッシブスキル：チートコード","a","　リーチが発生した時に一度だけ危険パイを察知する"],
        ["パッシブスキル：変身/ルナティックフューリー","a","　MPが満タンの時にリーチ時、","a","　MPを全消費してバーサクモードに変身","a","　変身時、高確率で一発ツモが発生する"],
        ["パッシブスキル：連技-龍牙爆砕","a","　1,2,3,4ライン順にパイを切った時、","a","　ドラを1つ増やす","b","パッシブスキル：花蓮","a","　カンした時にMPを1ゲージ消費して発動","a","　リーチしていれば当たりパイを、","a","　非リーチ時であればドラをドローする"],
        ["パッシブスキル：ウォープレリュード","a","　連続で和了すればするほど、","a","　次の局で同じラインのパイが初手で入りやすくなる","b","パッシブスキル：克己-強","a","　リーチした時にMPを2ゲージ消費して発動","a","　その局の勝敗に関わらず、次の局まで","a","　ウォープレリュードの効果が維持される"],
        ["パッシブスキル：量子化","a","　ポンする時の食い下がり（鳴き）が","a","　2翻から1翻に減少する","b","アクティブスキル：リバースサークル","a","　MPを1ゲージ消費して発動","a","　時間の流れを逆行する空間により","a","　その局の間、パイを切る順番が逆になってしまう"],
      ]
      HiddenChara+=1;
      handmap.removeAllChildren();
      var shape = new createjs.Shape();
      shape.graphics.beginFill("rgb(45,45,45)");
      shape.graphics.drawRect(0, 0, 800, 600);
      handmap.addChild(shape);
      var e = new createjs.Bitmap(queue.getResult(chrimg_src[HiddenChara]));
      e.sourceRect={x:400,y:0,width:400,height:510}
      e.x=40;
      e.y=0;
      e.scale=1.5;
      e.alpha=0.2;
      handmap.addChild(e);
      var C = new createjs.Bitmap(queue.getResult(win_src[7]));
      C.scale=1;
      handmap.addChild(C);
      createjs.Tween.get(C)
      .wait(4980).call(end);
      var shape = new createjs.Shape();
      shape.graphics.beginFill("rgba(166, 255, 155, 0.7)");
      shape.graphics.drawRect(10, 100, 550, 12);
      shape.graphics.beginFill("rgba(0, 161, 100, 0.7)");
      shape.graphics.drawRect(10, 60, 550, 40);
      shape.graphics.drawRect(10, 110, 550, 4);
      shape.graphics.drawRect(40, 140, 550, 200);
      handmap.addChild(shape);
      var t = new createjs.Text("N E W   C H A R A C T E R !", "18px 'Century Gothic'", "white");
      t.x=20;
      t.y=95;
      handmap.addChild(t);
      var t = new createjs.Text("新たにキャラクターが使用可能になりました！", "26px 'Century Gothic'", "white");
      t.x=15;
      t.y=65;
      handmap.addChild(t);
      var X=145;
      for(var i=0;i<Ary[HiddenChara-4].length;i++){
      if(Ary[HiddenChara-4][i]=="a"){
        i+=1;
        var t = new createjs.Text(Ary[HiddenChara-4][i], "18px 'Century Gothic'", "white");
      }else if(Ary[HiddenChara-4][i]=="b"){
        i+=1;
        X+=15;
        var t = new createjs.Text(Ary[HiddenChara-4][i], "22px 'Century Gothic'", "white");
      }else{
      var t = new createjs.Text(Ary[HiddenChara-4][i], "22px 'Century Gothic'", "white");
      }
      t.x=5;
      t.y=X;
      t.alpha=0;
      X+=21;
      handmap.addChild(t);
      createjs.Tween.get(t)
      .wait(i*350)
      .to({x:55,alpha:1},175);
      };
            //ウィンドウを非アクティブ等にするとジングルとタイミングずれるけど仕方がない
            function end(){
              se19.play();
              var t = new createjs.Text(chrlist[HiddenChara], "65px 'Century Gothic'", "rgba(247, 63, 17, 0.75)");
              t.x=100;
              t.y=430;
              t.outline=8;
              t.rotation=-6;
              t.scale=1.2;
              t.alpha=0;
              handmap.addChild(t);
              createjs.Tween.get(t)
              .to({alpha:1,scale:1},200, createjs.Ease.cubicInOut);
              var t = new createjs.Text(chrlist[HiddenChara], "65px 'Century Gothic'", "white");
              t.x=100;
              t.y=430;
              t.rotation=-6;
              t.scale=1.2;
              t.alpha=0;
              handmap.addChild(t);
              createjs.Tween.get(t)
            .to({alpha:1,scale:1},200, createjs.Ease.cubicInOut);
            var e = new createjs.Bitmap(queue.getResult(chrimg_src[HiddenChara]));
            e.sourceRect={x:400,y:0,width:400,height:600}
            e.x=320;
            e.y=-11;
            e.alpha=0;
            handmap.addChild(e);
            createjs.Tween.get(e)
            .to({x:390,alpha:1,scale:1},200);
            var option_bt5 = new createjs.Bitmap('don/soL_batu.png');
            option_bt5.x=700;
            option_bt5.y=60;
            option_bt5.scale=0.4;
            handmap.addChild(option_bt5)
            option_bt5.addEventListener("click", {card:-1,handleEvent:ExitCt});
            }
            function ExitCt(){
              if(this.card==-1){
                se3.play();
                handmap.removeAllChildren();
                save_Local();
                return true;
              }
            }
    }
    //画像ID
    e4 = new createjs.Bitmap(queue.getResult(eltearB_src[0]));
    if(fool){
      e10 = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[1]]));          
    }else{
      e10 = new createjs.Bitmap(queue.getResult(chrimg_src[chara[1]]));
    }
    //bitmap
    textmap.alpha=1;
    field.removeAllChildren();
    etitle.x=400;
    etitle.y=40;
    etitle.scale=0.5;
    field.addChild(etitle)
    var rect = new createjs.Shape();
    rect.graphics
      .beginFill("rgba(0,0,0,0.8)")
      .drawRect(40, 50, 360, 60);
    field.addChild(rect);
    rect.graphics
    .beginFill("rgba(20,20,20,0.7)")
    .drawRect(410, 210, 350, 240);
    field.addChild(rect);
    var Container = new createjs.Container();
    field.addChild(Container);
    var shapeMask = new createjs.Shape();
      shapeMask.graphics
      .beginFill("#001c0d")
      .moveTo(0, 0)
      .lineTo(0, 130)
      .lineTo(30, 160)
      .lineTo(220, 0)
      .lineTo(0, 0);
      Container.addChild(shapeMask);
      Container.mask = shapeMask;
          var s = new createjs.Shape();
      s.graphics
      .beginFill("#6e92f5")
      .moveTo(30, 160)
      .lineTo(220, 0)
      .lineTo(200, 0)
      .lineTo(30, 160);
    var Ary=[500,500,500,500,500,500,500,400,430,460];
    var Ary2=[0,50,0,0,60,0,60,0,80,50];
        e10.sourceRect={x:Ary[chara[1]],y:Ary2[chara[1]]+45,width:300,height:300}
    e10.x=0;
    e10.y=0;
    e10.scale=0.6;
    Container.addChild(e10);
    Container.addChild(s);
    var t = new createjs.Text(Username, "24px 'Century Gothic'", "white");
    t.x=232;
    t.y=75;
    field.addChild(t);
    var t = new createjs.Text(Usercrest, "14px 'Century Gothic'", "white");
    t.x=222;
    t.y=55;
    field.addChild(t);
    var t = new createjs.Text("戦 ★ 績", "28px 'Century Gothic'", "#ffffff");
    t.x=582;
    t.y=215;
    t.textAlign = "center";
    field.addChild(t);
    var solo = new createjs.Bitmap(queue.getResult(win_src[0]));
    solo.x=100;
    solo.y=130;
    solo.sourceRect={x:0,y:150,width:300,height:150};
    solo.scale=1;
    field.addChild(solo);
    var multi = new createjs.Bitmap(queue.getResult(win_src[1]));
    multi.x=100;
    multi.y=280;
    multi.sourceRect={x:0,y:150,width:300,height:150};
    multi.scale=1;
    field.addChild(multi);
    var howto = new createjs.Bitmap(queue.getResult(win_src[2]));
    howto.x=100;
    howto.y=430;
    howto.sourceRect={x:0,y:150,width:300,height:150};
    howto.scale=0.5;
    field.addChild(howto);
    var setting = new createjs.Bitmap(queue.getResult(win_src[3]));
    setting.x=250;
    setting.y=430;
    setting.sourceRect={x:0,y:150,width:300,height:150};
    setting.scale=0.5;
    field.addChild(setting);
    solo.addEventListener("click", {card:2,handleEvent:Menubutton});
    multi.addEventListener("click", {card:4,handleEvent:Menubutton});
    howto.addEventListener("click", {card:1,handleEvent:Menubutton});
    setting.addEventListener("click", {handleEvent:OptionConfig});
        solo.addEventListener("mouseover", {card:0,handleEvent:menuBtLighter});
    solo.addEventListener("mouseout", {card:1,handleEvent:menuBtLighter});
        multi.addEventListener("mouseover", {card:2,handleEvent:menuBtLighter});
    multi.addEventListener("mouseout", {card:3,handleEvent:menuBtLighter});
        howto.addEventListener("mouseover", {card:4,handleEvent:menuBtLighter});
    howto.addEventListener("mouseout", {card:5,handleEvent:menuBtLighter});
        setting.addEventListener("mouseover", {card:6,handleEvent:menuBtLighter});
    setting.addEventListener("mouseout", {card:7,handleEvent:menuBtLighter});
    //ボタン
    function menuBtLighter(){
    switch(this.card){
      case 0:
            solo.sourceRect={x:0,y:0,width:300,height:150};
              Textlist[0].text="CPUと自由対局を行うフリーバトルモードです。";
              Textlist[1].text="基本的に半荘戦（全員が親を2回行うと終了）です。"; 
        break;
      case 1:
            solo.sourceRect={x:0,y:150,width:300,height:150};
        break;
      case 2:
            multi.sourceRect={x:0,y:0,width:300,height:150};
              Textlist[0].text="対戦ルームで友達とドンジャラができます。";
              Textlist[1].text="不足人数分はCPUが入ります。";  
        break;
      case 3:
            multi.sourceRect={x:0,y:150,width:300,height:150};
        break;
      case 4:
            howto.sourceRect={x:0,y:0,width:300,height:150};
              Textlist[0].text="読んでもよく分からないマニュアル。";
              Textlist[1].text="エルコレドンジャラのルール説明です。"; 
        break;
      case 5:
            howto.sourceRect={x:0,y:150,width:300,height:150};
        break;
      case 6:
            setting.sourceRect={x:0,y:0,width:300,height:150};
              Textlist[0].text="対局の設定や音楽の設定などができます。";
              Textlist[1].text="セーブデータの外部出力や初期化もこちら。";  
        break;
      case 7:
            setting.sourceRect={x:0,y:150,width:300,height:150};
        break;
    }
    };
    var wT=winrank[winrank[0][4]][0]+winrank[winrank[0][4]][1]+winrank[winrank[0][4]][2]+winrank[winrank[0][4]][3]
    var winrate=0;
    if(wT>0){
      winrate=Math.floor(winrank[winrank[0][4]][0]/wT*1000)/10  
    }
    var Ach=achieveA.filter(value=>value.cleared>0);
    var Ary=["打数　ソロ："+highscore[0]+"回 /対戦："+highscore[4]+"回","勝率："+winrate+"%（"+LPlist[[winrank[0][4]]]+"）","最大戦闘力："+highscore[1],"瞬間最大火力："+highscore[2],"実績："+Ach.length+"/"+achieveA.length]
    for( i=0 ; i<Ary.length ; i++ ) {
      var t=new createjs.Text(Ary[i],"22px 'Century Gothic'","#ffffff");
      t.x=420;
      t.y=250+i*40;
      field.addChild(t);
    };
    var t=new createjs.Text( "(1位："+winrank[winrank[0][4]][0]+" /2位："+winrank[winrank[0][4]][1]+" /3位："+winrank[winrank[0][4]][2]+" /4位："+winrank[winrank[0][4]][3]+")","16px 'Century Gothic'","#ffffff");
    t.x=420;
    t.y=310;
    field.addChild(t);
    var btn1 = createButton("　", 60, 60);
          btn1.x = 700;
          btn1.y = 390;
          field.addChild(btn1);
    zoom.x=710;
    zoom.y=400;
    field.addChild(zoom);
    //実績・名前変更する画面へ
    btn1.addEventListener("click", {card:5,handleEvent:Menubutton});
    menuMap();
    break;
        case 3:
          //フリバ
          if(mouseX >510 && mouseX <560 && mouseY >80 && mouseY <110){
          se3.play();
          if(LP[0]==0){LP[0]=LPlist.length-1}else{LP[0]-=1}
          menu_solo_list[1].text="◀ "+LPlist[LP[0]]
          }
          if(mouseX >670 && mouseX <705 && mouseY >80 && mouseY <110){
            se3.play();
            if(LP[0]==LPlist.length-1){LP[0]=0}else{LP[0]+=1}
            menu_solo_list[1].text="◀ "+LPlist[LP[0]]
            }
          if(mouseX >510 && mouseX <560 && mouseY >130 && mouseY <160){
            se3.play();
            if(chara[1]==0){chara[1]=HiddenChara}else{chara[1]-=1}
            menu_solo_list[2].text="◀ "+chrlist[chara[1]]
            menu_solo.removeChild(menu_solo_list[menu_solo_list.length-1]);
            menu_solo_list.pop();
            if(fool){
              e10 = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[1]]));          
            }else{
              e10 = new createjs.Bitmap(queue.getResult(chrimg_src[chara[1]]));
            }
            e10.sourceRect={x:400,y:0,width:350,height:510}
            e10.x=10;
            e10.y=0;
            e10.scale=1;
            menu_solo.addChild(e10);
            menu_solo_list.push(e10);
            }
          if(mouseX >670 && mouseX <705 && mouseY >130 && mouseY <160){
            se3.play();
            if(chara[1]==HiddenChara){chara[1]=0}else{chara[1]+=1}
            menu_solo_list[2].text="◀ "+chrlist[chara[1]]
            menu_solo.removeChild(menu_solo_list[menu_solo_list.length-1]);
            menu_solo_list.pop();
            if(fool){
              e10 = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[1]]));          
            }else{
              e10 = new createjs.Bitmap(queue.getResult(chrimg_src[chara[1]]));
            }
            e10.sourceRect={x:400,y:0,width:350,height:510}
            e10.x=10;
            e10.y=0;
            e10.scale=1;
            menu_solo.addChild(e10);
            menu_solo_list.push(e10);
            } 
          if(mouseX >520 && mouseX <650 && mouseY >175 && mouseY <205){
            se3.play();
            if(chara[0]==0){chara[0]=1}else{chara[0]=0};
            if(chara[0]==0){
              menu_solo_list[0].text="✓おまかせ"
              for(var i=0;i<6;i++){menu_solo_list[i+3].alpha=0.4};
              }else{
              menu_solo_list[0].text="　おまかせ"
              for(var i=0;i<6;i++){menu_solo_list[i+3].alpha=1};
              }
          }
          if(mouseX >400 && mouseX <705 && mouseY >345 && mouseY <375){
            se3.play();
            if(skillswitch[0]==0){skillswitch[0]=-2}else{skillswitch[0]+=1};
            var Ary=["　◀禁止しない","　◀プレイヤーのみ","　◀全て禁止"]
            menu_solo_list[9].text=Ary[-skillswitch[0]]
            }
          if(mouseX >670 && mouseX <705 && mouseY >230 && mouseY <260){
            if(chara[0]==1){
            se3.play();
            if(chara[2]==HiddenChara){chara[2]=0}else{chara[2]+=1}
            menu_solo_list[3].text="◀ "+chrlist[chara[2]]
            }
            }
          if(mouseX >670 && mouseX <705 && mouseY >270 && mouseY <300){
            if(chara[0]==1){
            se3.play();
            if(chara[3]==HiddenChara){chara[3]=0}else{chara[3]+=1}
            menu_solo_list[5].text="◀ "+chrlist[chara[3]]
            }
            }
          if(mouseX >670 && mouseX <705 && mouseY >310 && mouseY <340){
            if(chara[0]==1){
            se3.play();
            if(chara[4]==HiddenChara){chara[4]=0}else{chara[4]+=1}
            menu_solo_list[7].text="◀ "+chrlist[chara[4]]
            }
            }
            if(mouseX >510 && mouseX <560 && mouseY >230 && mouseY <260){
              if(chara[0]==1){
              se3.play();
              if(chara[2]==0){chara[2]=HiddenChara}else{chara[2]-=1}
              menu_solo_list[3].text="◀ "+chrlist[chara[2]]
              }
              }
            if(mouseX >510 && mouseX <560 && mouseY >270 && mouseY <300){
              if(chara[0]==1){
              se3.play();
              if(chara[3]==0){chara[3]=HiddenChara}else{chara[3]-=1}
              menu_solo_list[5].text="◀ "+chrlist[chara[3]]
              }
              }
            if(mouseX >510 && mouseX <560 && mouseY >310 && mouseY <340){
              if(chara[0]==1){
              se3.play();
              if(chara[4]==0){chara[4]=HiddenChara}else{chara[4]-=1}
              menu_solo_list[7].text="◀ "+chrlist[chara[4]]
              }
              }
        corsor();
        break;
        case 2:
          //オプション画面
          if(mouseX >600 && mouseX <700 && mouseY >450 && mouseY <490){
            if(musicnum!==0){
            musicnum=0;
            Bgm.fade(0.05*vBar, 0, 500);
            Bgm.on("fade", ()=>{
            Bgm.stop();
            });
            }
            pagestate=0;
            Configmap.removeAllChildren();
            opLock=0;
            se2.play();
            save_Local();
            Menu();
          }
          if(mouseX >400 && mouseX <580 && mouseY >450 && mouseY <490){
            //デフォルトに戻す
            tumoConfig=0;
            Ponrate=0.4;
            mpVelocity=1;
            dahaiSE=1;
              se3.play();
              musicset=[0,0,0];
          }
          if(mouseX >250 && mouseX <290 && mouseY >370 && mouseY <410){
            if(dahaiSE!==1){
            dahaiSE=1;
            se4.play();
            }
          }
          if(mouseX >290 && mouseX <330 && mouseY >370 && mouseY <410){
            if(dahaiSE!==2){
            dahaiSE=2;
            se16.play();
            }
          }
          if(mouseX >80 && mouseX <160 && mouseY >310 && mouseY <350){
            if(mpVelocity!==1){
            mpVelocity=1;
            se3.play();
            }
          }
          if(mouseX >170 && mouseX <260 && mouseY >310 && mouseY <350){
            if(mpVelocity!==1.5){
            mpVelocity=1.5;
            se3.play();
            }
          }
          if(mouseX >260 && mouseX <340 && mouseY >310 && mouseY <350){
            if(mpVelocity!==2){
            mpVelocity=2;
            se3.play();
            }
          }
          if(mouseX >80 && mouseX <360 && mouseY >100 && mouseY <170){
            se3.play();
            if(tumoConfig==0){
              tumoConfig=-1;
              }else{
                tumoConfig=0
              }
          }
          if(mouseX >110 && mouseX <150 && mouseY >230 && mouseY <270){
            //ponrate
            se3.play();
            Ponrate+=0.2;
            if(Ponrate>1){Ponrate=1};
          }
          if(mouseX >250 && mouseX <300 && mouseY >230 && mouseY <270){
            se3.play();
            Ponrate-=0.2;
            if(Ponrate<0){Ponrate=0};
          }
            if(mouseX >370 && mouseX <430 && mouseY >240 && mouseY <270){
              //bgm
              se3.play();
              if(musicset[0]==0){musicset[0]=musiclist.length-1}else{musicset[0]-=1}
            }
            if(mouseX >370 && mouseX <430 && mouseY >310 && mouseY <340){
              se3.play();
              if(musicset[1]==0){musicset[1]=musiclist.length-1}else{musicset[1]-=1}
            }
            if(mouseX >370 && mouseX <430 && mouseY >380 && mouseY <410){
              se3.play();
              if(musicset[2]==0){musicset[2]=musiclist.length-1}else{musicset[2]-=1}
            }
            if(mouseX >690 && mouseX <750 && mouseY >240 && mouseY <270){
              se3.play();
              if(musicset[0]==musiclist.length-1){musicset[0]=0}else{musicset[0]+=1}
            }
            if(mouseX >690 && mouseX <750 && mouseY >310 && mouseY <340){
              se3.play();
              if(musicset[1]==musiclist.length-1){musicset[1]=0}else{musicset[1]+=1}
            }
            if(mouseX >690 && mouseX <750 && mouseY >380 && mouseY <410){
              se3.play();
              if(musicset[2]==musiclist.length-1){musicset[2]=0}else{musicset[2]+=1}
            }
          if(mouseX >690 && mouseX <750 && mouseY >200 && mouseY <240){
            //通常play
            if(musicnum==musicset[0]){
              musicnum=0;
              Bgm.stop()       
            }else{
              Bgm.stop()
              musicnum=musicset[0];
              musicStart(musicnum);
            }      
          }
          if(mouseX >690 && mouseX <750 && mouseY >270 && mouseY <310){
            //リーチplay
            if(musicnum==musicset[1]){
              musicnum=0;
              Bgm.stop()        
            }else{
              Bgm.stop()
              musicnum=musicset[1];
              musicStart(musicnum);
            }      
          }
          if(mouseX >690 && mouseX <750 && mouseY >340 && mouseY <380){
            //オーラスplay
            if(musicnum==musicset[2]){
              musicnum=0;
              Bgm.stop()          
            }else{
              Bgm.stop()
              musicnum=musicset[2];
              musicStart(musicnum);
            }
          }
          menuMap(1);
          corsor();
          break;
          case 4:
            //ガイド　シナジーのスクロールのみこちらで対応
            switch(msgstate){
                case 5:
                  if(mouseX >80 && mouseY > 100 && mouseX <640 && mouseY <200){
                    Yakucheck(180);
                    return false;
                    }
                  if(mouseX >80 && mouseY > 200 && mouseX <640 && mouseY <300){
                    Yakucheck(90);
                    return false;
                    }
                    if(mouseX >80 && mouseY > 300 && mouseX <640 && mouseY <400){
                    Yakucheck(-90);
                    return false;
                    }
                    if(mouseX >80 && mouseY > 400 && mouseX <640 && mouseY <480){
                    Yakucheck(-180);
                    return false;
                    }
                break;
              default:
                //シナジーが同時にスクロールされてしまうため-5で対応
                if(msgstate<0){
                  msgstate=-msgstate;
                  menuMap(3);
                  return false;
                }
                break;
            }
            break;
          case 5:
              //実績
            if(mouseX >700 && mouseX <750 && mouseY >50 && mouseY <100){
              if(msgstate !==-1){
              pagestate=0;
              msgstate=0;
              se2.play();
              menu_main.removeAllChildren();
              Menu();
              }
              return false;
            }
            if(mouseX >60 && mouseX <190 && mouseY >80 && mouseY <125){
              if(msgstate>0){
              msgstate=0;
              se4.play();
              }
            }
            if(mouseX >60 && mouseX <190 && mouseY >125 && mouseY <170){
              if(msgstate!==1 && msgstate !==-1){
              msgstate=1;
              se4.play();
              }
            }
            if(mouseX >60 && mouseX <190 && mouseY >170 && mouseY <215){
              if(msgstate!==2 && msgstate !==-1){
              msgstate=2;
              se4.play();
              }
            }
            if(mouseX >60 && mouseX <190 && mouseY >215 && mouseY <260){
              if(msgstate!==3 && msgstate !==-1){
              msgstate=3;
              se4.play();
              }
            }
            switch(msgstate){
              case 0:
                if(mouseX >530 && mouseX <730 && mouseY >350 && mouseY <400){
                  se3.play();
                  chara[1]=Math.floor((mouseX-530)/50);
                }
                if(mouseX >530 && mouseX <730 && mouseY >400 && mouseY <500){
                  //下段はHiddenCharaに応じてアレしてください
                  if(mouseY >400 && mouseY <450){
                  var M=4+Math.floor((mouseX-530)/50);
                  }
                  if(mouseY >450 && mouseY <500){
                  var M=8+Math.floor((mouseX-530)/50);
                  }
                  console.log(M,HiddenChara);
                  if(M<=HiddenChara){
                  chara[1]=M;
                  se3.play();
                  }else{
                  se2.play();
                  var Ary=["①「殴り合い」達成　②2連荘する","①「ナソード研究」達成　②一度も放銃せずに勝利","①半荘戦で3回以上放銃する　②一発ツモ5回達成","①「足取り」シナジー4つ達成　②10回以上カンをする","①「魔界血戦」1位3回達成　②ライン通貫10回達成","①100回ポンをする　②いずれかのクレスト役を和了する"];
                  Textlist[0].text="？？？（開放条件を満たすと開放）";
                  Textlist[1].text="NEXT："+Ary[HiddenChara-3];
                  return false;
                  }
                }
              break;
            case 1:
              if(mouseX >195 && mouseX <380 && mouseY >95 && mouseY <515){
                var I=Math.floor((mouseY-95)/20);
                cx3.strokeRect(190,92+I*20,240,20);
                if(achieveA[I].cleared>0 && Usercrest!==achieveA[I].name){
                  se3.play();
                  Usercrest=achieveA[I].name;
                }else{
                  Usercrest="称号なし";
                };
              }
              if(mouseX >475 && mouseX <660 && mouseY >95 && mouseY <515){
                var I=Math.floor((mouseY-95)/20)+21;
                if(I>=achieveA.length){
                  return false;
                }
                if(achieveA[I].cleared>0 && Usercrest!==achieveA[I].name){
                  se3.play();
                    Usercrest=achieveA[I].name;
                  }else{
                    Usercrest="称号なし";
                  };
                }
              break;
            }
            menuMap(2);
            break;
          case 6:
            //たいせん画面
            if(mouseX >700 && mouseX <750 && mouseY >50 && mouseY <100){
              pagestate=0;
              msgstate=0;
              se2.play();
              Menu();
              return false;
            }
            switch(msgstate){
              case 2:
                //case1は入場待機
                //room_config
                //LP_PVP={Length:[1,"東風","半荘",],LP:[1,75000,150000,300000],Block:[1,"満貫あり","満貫なし"],Rule:[1,"サドンデス","デスマッチ"]};
                if(IsHost(IAM.room)){
                if(mouseX >610 && mouseX <680 && mouseY >110 && mouseY <160){
                  LP_PVP.Rule[0]-=1;
                  if(LP_PVP.Rule[0]<=0){LP_PVP.Rule[0]=LP_PVP.Rule.length-1;}
                  se3.play();
                  corsor();
                  msgstate=1;
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >720 && mouseX <790 && mouseY >110 && mouseY <160){
                  LP_PVP.Rule[0]+=1;
                  if(LP_PVP.Rule[0]>=LP_PVP.Rule.length){LP_PVP.Rule[0]=1;}
                  se3.play();
                  corsor();
                  msgstate=1;
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >610 && mouseX <680 && mouseY >180 && mouseY <230){
                  msgstate=1;
                  LP_PVP.LP[0]-=1;
                  if(LP_PVP.LP[0]<=0){LP_PVP.LP[0]=LP_PVP.LP.length-1;}
                  se3.play();
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >720 && mouseX <790 && mouseY >180 && mouseY <230){
                  msgstate=1;
                  LP_PVP.LP[0]+=1;
                  if(LP_PVP.LP[0]>=LP_PVP.LP.length){LP_PVP.LP[0]=1;}
                  se3.play();
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >610 && mouseX <680 && mouseY >250 && mouseY <300){
                  msgstate=1;
                  LP_PVP.Length[0]-=1;
                  if(LP_PVP.Length[0]<=0){LP_PVP.Length[0]=LP_PVP.Length.length-1;}
                  se3.play();
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >720 && mouseX <790 && mouseY >250 && mouseY <300){
                  msgstate=1;
                  LP_PVP.Length[0]+=1;
                  if(LP_PVP.Length[0]>=LP_PVP.Length.length){LP_PVP.Length[0]=1;}
                  se3.play();
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >610 && mouseX <680 && mouseY >320 && mouseY <370){
                  msgstate=1;
                  LP_PVP.Block[0]-=1;
                  if(LP_PVP.Block[0]<=0){LP_PVP.Block[0]=LP_PVP.Block.length-1;}
                  se3.play();
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >720 && mouseX <790 && mouseY >320 && mouseY <370){
                  msgstate=1;
                  LP_PVP.Block[0]+=1;
                  if(LP_PVP.Block[0]>=LP_PVP.Block.length){LP_PVP.Block[0]=1;}
                  se3.play();
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >610 && mouseX <680 && mouseY >390 && mouseY <440){
                  LP_PVP.Skill[0]-=1;
                  if(LP_PVP.Skill[0]<=0){LP_PVP.Skill[0]=LP_PVP.Skill.length-1;}
                  se3.play();
                  corsor();
                  msgstate=1;
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
                if(mouseX >720 && mouseX <790 && mouseY >390 && mouseY <440){
                  LP_PVP.Skill[0]+=1;
                  if(LP_PVP.Skill[0]>=LP_PVP.Skill.length){LP_PVP.Skill[0]=1;}
                  se3.play();
                  corsor();
                  msgstate=1;
                  socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
                }
              };
                break;
              };
            break;
            default:
              //pagesateが負の場合には正負を入れ替えて終了
              if(debugmode){console.log(pagestate)};
              if(pagestate<0){pagestate=-pagestate};
            break;
      }
  };
    //ルーム関連のソケット
  //ゲームスタート
  socket.on("start-result", (data)=>{
    if(data.status){
      if(IsHost(IAM.room)){
        console.log('setupへ');
        //メンバーをコピー
        switch(IAM.room){
          case 1:
          memberlist=Roomlist1.concat();
          break;
          case 2:
            memberlist=Roomlist2.concat();
            break;
          case 3:
            memberlist=Roomlist3.concat();
            break;
        }
        timevalue=Date.now();
        Setup(1)
        msgstate=2;
        //setupへ
      }else{
        console.log('ゲームロード待機')
        msgstate=2;
        //ゲームロード待機
      }
    }else if(msgstate!==2){
      alert("未準備のプレイヤーがいます。");
      console.log('未準備のプレイヤーがいます')
      msgstate=2;
    }
  });
  //レディ
  socket.on("ready-result", (data)=>{
      console.log(data.status);
        msgstate=2;
    });
  //退室
  socket.on("leave-result", (data)=>{
    if(data.status){
      if(msgstate!==2){
      alert("退室する際はReady状態を解除してください。");
      console.log('退室する際はReady状態を解除してください')
      msgstate=2;
      }
    }else{
      msgstate=-1;
      Menu();
    }
  });
  //入室
  socket.on('room-result', (data)=>{
    if(data.status){ 
      switch(data.room){
        case 'room1':
          IAM.room=1;
          break;
          case 'room2':
            IAM.room=2;
            break;
            case 'room3':
              IAM.room=3;
              break;
              default:
                console.log('room error!',data.room);
                IAM.room=1;
                break;
      }  
      console.log('入室成功',IAM.room);
      if(msgstate!==2){
        msgstate=2;
        socket.emit('lobby_update');
        menuMap(4);
      };
    }else{
      console.log('入室失敗');
      alert("ルーム入室に失敗しました。");
      msgstate=0;
      menuMap(4);
      return false;
    }
    });
  //config
  socket.on("room-config", (data)=>{
    if(!IsHost(IAM.room)){
      console.log(data);
      LP_PVP.Length[0]=data.Length[0];
      LP_PVP.LP[0]=data.LP[0];
      LP_PVP.Block[0]=data.Block[0];
      LP_PVP.Rule[0]=data.Rule[0];
      LP_PVP.Skill[0]=data.Skill[0];
      }else{
    //Host
      if(msgstate!==2){
        msgstate=2;
        }
      }
      if(IsHost(IAM.room)){
        var Ary=[LP_PVP.Rule[LP_PVP.Rule[0]]+"　"+LP_PVP.Length[LP_PVP.Length[0]]+"戦","持ち点 "+LP_PVP.LP[LP_PVP.LP[0]]+"　"+LP_PVP.Block[LP_PVP.Block[0]]+"　"+LP_PVP.Skill[LP_PVP.Skill[0]],"◀"+LP_PVP.Rule[LP_PVP.Rule[0]]+"▶","◀"+LP_PVP.LP[LP_PVP.LP[0]]+"▶","◀"+LP_PVP.Length[LP_PVP.Length[0]]+"▶","◀"+LP_PVP.Block[LP_PVP.Block[0]]+"▶","◀"+LP_PVP.Skill[LP_PVP.Skill[0]]+"▶"]
      }else{
        var Ary=[LP_PVP.Rule[LP_PVP.Rule[0]]+"　"+LP_PVP.Length[LP_PVP.Length[0]]+"戦","持ち点 "+LP_PVP.LP[LP_PVP.LP[0]]+"　"+LP_PVP.Block[LP_PVP.Block[0]]+"　"+LP_PVP.Skill[LP_PVP.Skill[0]],LP_PVP.Rule[LP_PVP.Rule[0]],LP_PVP.LP[LP_PVP.LP[0]],LP_PVP.Length[LP_PVP.Length[0]],LP_PVP.Block[LP_PVP.Block[0]],LP_PVP.Skill[LP_PVP.Skill[0]]]
      }
      for(var i=0;i<RoomConfigAry.length;i++){
        RoomConfigAry[i].text=Ary[i];
      }
});
  //入室状態更新
  socket.on("room-update", (data)=>{
    if(gamestate>=0 && gamestate<=2){
      se3.play();
      scoretemp[0]=-1;
      opLock=0;
      gameover('ルーム人数が変化したため、ゲームが終了しました');
    }else if(gamestate ==10){
    //data.focus 0->誰かが入室してきた 1->ready 2->ゲームオーバーのあと
    if(IsHost(IAM.room) && data.focus==0){
      //ルーム設定を同期
    socket.emit('room_config',{token: IAM.token,room:RoomName[IAM.room],config:LP_PVP});
    };
      switch(IAM.room){
        case 1:
      Roomlist1=data.list.concat();
      break;
        case 2:
      Roomlist2=data.list.concat();
      break;
        case 3:
      Roomlist3=data.list.concat();
      break;
      }
      updateRoomGraph()
      console.log('room updated')
      function updateRoomGraph(){
        menuMap(4);
        if(data.focus==2){
          var t = new createjs.Text('♪「STARDUST LEMON」', "14px Arial", "white");
          t.x=530
          t.y=10;
          menu_duel.addChild(t);
          var t = new createjs.Text('/yuhei komatsu', "14px Arial", "white");
          t.x=560
          t.y=30;
          menu_duel.addChild(t);
        }
        if(IsHost(IAM.room)){
          var btn1 = createButton("対局開始", 170, 60,"#ffbb4d","#ff7b00","#372d23","#5e5e5e");
          btn1.x = 260;
          btn1.y = 420;
          menu_duel.addChild(btn1);   
          var btn2 = createButton("退出する", 170, 60,"#ffbb4d","#ff7b00","#372d23","#5e5e5e");
          btn2.x = 440;
          btn2.y = 420;
          menu_duel.addChild(btn2);   
          btn1.addEventListener("click", {card:1,handleEvent:getReady}); 
          btn2.addEventListener("click", {card:0,handleEvent:getReady}); 
          }else{
            var A=data.list.findIndex(value=>value.token==IAM.token);
            if(A==-1){
              console.log('token error',A);
              A=0;
            }
            if(A>0 && data.list[A].ready){
          var btn1 = createButton("Quit", 170, 60,"#ffbb4d","#ff7b00","#372d23","#5e5e5e");
          btn1.x = 260;
          btn1.y = 420;
          menu_duel.addChild(btn1);   
          var btn2 = createButton("退出する", 170, 60,"#ffbb4d","#ff7b00","#372d23","#5e5e5e");
          btn2.x = 440;
          btn2.y = 420;
          menu_duel.addChild(btn2);  
          btn1.addEventListener("click", {card:1,handleEvent:getReady}); 
          btn2.addEventListener("click", {card:-1,handleEvent:getReady}); 
            }else if(A>0){
          var btn1 = createButton("Ready", 170, 60,"#ffbb4d","#ff7b00","#372d23","#5e5e5e");
          btn1.x = 260;
          btn1.y = 420;
          menu_duel.addChild(btn1);   
          var btn2 = createButton("退出する", 170, 60,"#ffbb4d","#ff7b00","#372d23","#5e5e5e");
          btn2.x = 440;
          btn2.y = 420;
          menu_duel.addChild(btn2);  
          btn1.addEventListener("click", {card:1,handleEvent:getReady}); 
          btn2.addEventListener("click", {card:0,handleEvent:getReady}); 
            }
          };
          function getReady(){
          switch(this.card){
            case -1:
              se3.play();
              alert("Ready状態を解除してください。");
            break;
            case 0:
                msgstate=0;
                se3.play();
                var clientId=Username;
                var clientChr=chara[1];
                var roomId=RoomName[IAM.room];
                //個人のルーム設定を初期化
                LP_PVP={Length:[1,"東風","半荘",],LP:[1,75000,150000,300000],Block:[1,"満貫あり","満貫なし"],Rule:[1,"サバイバル","デスマッチ","魔界血戦"],Skill:[1,"スキル禁止","スキルあり",]};//
                socket.emit('leave_to_room',{token: IAM.token,name:clientId,chr:clientChr,room:roomId});
                menuMap(4);
            break;
            case 1:
              msgstate=1;
              var roomId=RoomName[IAM.room];
              if(IsHost(IAM.room)){
                //他のプレイヤーが全員レディならスタート
                socket.emit('ready_to_start',{token: IAM.token,ready:-1,room:roomId});
              }else{
                socket.emit('ready_to_start',{token: IAM.token,ready: IAM.is_ready,room:roomId});
                if(IAM.is_ready==1){IAM.is_ready=0}else{IAM.is_ready=1};
              }
            break;
          }
          };
          for(var i=0;i<data.list.length;i++){
            if(fool){
             var e = new createjs.Bitmap(queue.getResult(chrimgR_src[data.list[i].chr]));          
            }else{
             var e = new createjs.Bitmap(queue.getResult(chrimg_src[data.list[i].chr]));
            }
            if(data.list[i].chr==5){
            e.sourceRect={x:460,y:0,width:298,height:600};              
            }else{
            e.sourceRect={x:400,y:0,width:298,height:600};
            }
            e.scale=1/2;
            e.x=10+150*i
            e.y=100;
            menu_duel.addChild(e);
            var rect = new createjs.Shape();
            rect.graphics.beginFill("rgba(20,20,20,0.7)").drawRect(11+150*i, 340, 148, 60);
            rect.graphics.beginFill("rgba(111, 255, 231, 0.7)").drawRect(11+150*i, 105, 148, 32);
            menu_duel.addChild(rect);
            var t = new createjs.Text(data.list[i].crest, "14px Arial", "white");
            t.x=12+150*i
            t.y=350;
            menu_duel.addChild(t);
            var t = new createjs.Text(data.list[i].name, "bold 24px Arial", "white");
            t.x=13+150*i
            t.y=375;
            menu_duel.addChild(t);
            if(i==0){
            var t = new createjs.Text("ルーム長", "bold 26px Arial", "rgb(255, 111, 55)");
            t.x=50+150*i
            t.y=110;
            menu_duel.addChild(t);
            }else{
            if(data.list[i].ready){
              var t = new createjs.Text("READY", "bold 26px Arial", "rgb(255, 111, 55)");
              t.x=45+150*i
              t.y=110;
              menu_duel.addChild(t);
            }}
            }
            var Cstar = new createjs.Shape(graphics);
            Cstar.x=30;
            Cstar.y=120;
            Cstar.rotation=-15;
            Cstar.scale=0.6;
            menu_duel.addChild(Cstar)
      }
  }
  });
  window.addEventListener("keyup", keyupHandler, false);
    function keyupHandler(e) {
    if(e.keyCode==27){
    key27=0;//esc
    }}
    window.addEventListener("keydown", keyDownHandler, false);
    function keyDownHandler(e) {
      switch(e.keyCode) {
        case 37: // ←
        case 38: // ↑
        case 39: // →
        case 40: // ↓
          e.preventDefault();
          break;
        }
      if(e.keyCode==27 && key27==0){
        key27=1;
        if(pvpmode==1){
          if(IsHost(IAM.room)){
//対局を止める
if(opLock==0 && gamestate ==1){
  opLock=2;
  cx4.globalAlpha=1;
  se2.play();
  cx4.fillStyle = "rgba(20,20,20,0.7)";
  cx4.fillRect(0,0,800,600)
  cx4.font = "bold 26px 'メイリオ'";
  cx4.fillStyle = "black";
  cx4.strokeStyle ="rgba(250,250,250,0.9)";
  cx4.lineWidth=5;
  cx4.strokeText("タイトル画面に戻りますか？",240,200);
  cx4.fillText("タイトル画面に戻りますか？",240,200);
  cx4.fillStyle="#ff3838";
  cx4.strokeRect(220,240,120,60)
  cx4.fillRect(220,240,120,60)
  cx4.fillStyle = "#f0f0f0";
  cx4.font = "bold 24px 'メイリオ'";
  cx4.fillText("YES",250,280);
  cx4.fillStyle="#3898ff";
  cx4.strokeRect(460,240,120,60)
  cx4.fillRect(460,240,120,60)
  cx4.fillStyle = "#f0f0f0";
  cx4.fillText("NO",500,280);
  }
  Configmap.removeAllChildren();
  Cbt=canvas4.toDataURL();
  Cbutton = new createjs.Bitmap(Cbt);
  Configmap.addChild(Cbutton);
  Cbutton.addEventListener("click", {handleEvent:Menu}); 
 }
      }else{
        //対局を止める
        if(opLock==0 && gamestate ==1){
        opLock=2;
        cx4.globalAlpha=1;
        se2.play();
        cx4.fillStyle = "rgba(20,20,20,0.7)";
        cx4.fillRect(0,0,800,600)
        cx4.font = "bold 26px 'メイリオ'";
        cx4.fillStyle = "black";
        cx4.strokeStyle ="rgba(250,250,250,0.9)";
        cx4.lineWidth=5;
        cx4.strokeText("タイトル画面に戻りますか？",240,200);
        cx4.fillText("タイトル画面に戻りますか？",240,200);
        cx4.fillStyle="#ff3838";
        cx4.strokeRect(220,240,120,60)
        cx4.fillRect(220,240,120,60)
        cx4.fillStyle = "#f0f0f0";
        cx4.font = "bold 24px 'メイリオ'";
        cx4.fillText("YES",250,280);
        cx4.fillStyle="#3898ff";
        cx4.strokeRect(460,240,120,60)
        cx4.fillRect(460,240,120,60)
        cx4.fillStyle = "#f0f0f0";
        cx4.fillText("NO",500,280);
        Configmap.removeAllChildren();
        Cbt=canvas4.toDataURL();
        Cbutton = new createjs.Bitmap(Cbt);
        Configmap.addChild(Cbutton);
        Cbutton.addEventListener("click", {handleEvent:Menu}); 
        }}
      }
      }
  var yakumapYmax;
  var yakubar;
  //シナジー改変後
  function Yakucheck(move=0){
    if(debugmode)(console.log('Yakucheck',move,shiagytemp));
        if(move!==0){
        //上下移動
        yakumapY+=move;
        if(yakumapY<=-yakumapYmax){yakumapY=0;}
        if(yakumapY>0){yakumapY=-yakumapYmax+60;}
        createjs.Tween.get(yakumapMask, {override: true})
        .to({y: yakumapY}, 200, createjs.Ease.cubicInOut);
        createjs.Tween.get(yakubar, {override: true})
        .to({y: (-yakumapY/yakumapYmax)*(390-390*390/yakumapYmax)}, 200, createjs.Ease.cubicInOut);
        return false;
      }
        //一覧表示
        yakumap.removeAllChildren();
        yakumapMask.removeAllChildren()
        yakumap.addChild(yakumapMask);
        yakumapY=0;
        yakumapMask.y=0;
        cx2.clearRect(0,0,800,600);
        if(shiagytemp==0){
          var btn1 = createButton("一覧", 100, 45);
          btn1.x = 300;
          btn1.y = 55;
          yakumap.addChild(btn1);
          btn1.addEventListener("click", {handleEvent:Menu});     
        }else{ 
          var btn1 = createButton("所持パイ", 100, 45,"#ffbb4d","#ff7b00","#372d23","#5e5e5e");
          btn1.x = 300;
          btn1.y = 55;
          yakumap.addChild(btn1);
          btn1.addEventListener("click", {handleEvent:Menu});     
        }
        var rect = new createjs.Shape();
        rect.graphics
                .beginFill("rgba(20,20,20,0.7)")
                .drawRect(40, 100, 660, 3300);
        yakumapMask.addChild(rect);
          rect.addEventListener("click", {handleEvent:Menu}); 
        var shapeMask = new createjs.Shape();
      shapeMask.graphics
              .beginFill("gold")
              .drawRect(40, 100, 660, 390);
      var t;
      var tt;
      var s;
      var X
      var Y=120;
      var ct=0;
      var HandAry=hand1.concat(pon1);
      for(var i=0; i<Sinagy.length; i++){
        if(shiagytemp==1){
          if(!getIsDuplicate(HandAry,Sinagy[i].chr)){
             //一つでも所持していればGO
            continue;
          };
        }
      X=110;
      if(i<8){
      ct+=1;
      if(ct==2){
        ct=0;
        X=420;
        Y-=115;
      }
      }
      t= new createjs.Text(Sinagy[i].id, "bold 16px Arial", "white");
      t.x=X-40;
      t.y=Y;
      yakumapMask.addChild(t);
      var Tx=""
      var Ary=["Ⅰ","Ⅱ","Ⅲ"]
      for(var j=0;j<Sinagy[i].han.length;j++){
        if(Sinagy[i].han[j]==1){
          Tx+=Ary[j]+"（"+Sinagy[i].han[j]+"枚）："+Sinagy[i].han2[j]+"翻";
        }else{
          Tx+=Ary[j]+"（"+Sinagy[i].han[j]+"枚以上）："+Sinagy[i].han2[j]+"翻";
        }
        if(Sinagy[i].han.length>1 && j+1<Sinagy[i].han.length){Tx+=" / "}
      }
      tt= new createjs.Text(Tx, "14px Arial", "white");
      tt.x=X+110;
      tt.y=Y;
      yakumapMask.addChild(tt);
      Y+=15;
      for(var j=0; j<Sinagy[i].chr.length ; j++){
        s= new createjs.Bitmap(queue.getResult(eltear_src[Sinagy[i].chr[j]]));
        s.scaleX=1/2;
        s.scaleY=1/2;
        if(j==9){
          X=110;
          Y+=80;
        }
        s.x=X-40;
        s.y=Y;
        var A=HandAry.findIndex(value=>value==Sinagy[i].chr[j]);
        if(shiagytemp==1 && A==-1){
          s.filters = [new createjs.ColorFilter(0.3, 1, 1, 0.4)];
          s.cache(0,0,120,156);
        }
        yakumapMask.addChild(s);
        X+=65;
      };
      Y+=100;
      };
      if(shiagytemp==1){yakumapYmax=Y-330}else{yakumapYmax=2560};
      yakumapMask.addChild(t);
      //つーるばー
      yakubar = new createjs.Shape();
        yakubar.graphics.beginFill("#0080ff");
        yakubar.graphics.beginStroke("#68ceed");
        yakubar.graphics.setStrokeStyle(3);
        yakubar.graphics.drawRect(675, 105, 20,390*390/yakumapYmax);// 390/(n/390)
        yakumap.addChild(yakubar);
      // マスクを適用する
      yakumapMask.mask = shapeMask;
      }
      function paiView(){
      paiviewer.removeAllChildren();
      var s = new createjs.Shape();
      s.graphics.beginFill("rgba(20,20,20,0.7)");
      s.graphics.drawRect(20,100,620,390);
      paiviewer.addChild(s);
      var donX=30;
      var donY=100;
      for(var i=0;i<eltear_src.length;i++){
        var C = new createjs.Bitmap(eltear_src[i]);
        C.x=donX;
        C.y=donY;
        C.scale=5/12;
        paiviewer.addChild(C);
        donX+=50;
        if(i>0 && i%12==11){
        donX=30;
        donY+=65;
        }
      };
      paiviewer.addChild(paiviewerMask);
      paiviewer.alpha=0;
      };
  function Remaincheck(num=-1){
    //残パイ
    //num -2->チュートリアル -1->リスト n~->指定パイのチェック
  if(num==-2){
    deck=[];
    for(var i =0; i<70; i++){
      deck.push(i);
      }
      deck.push(60,61,62,63,64,65,66,67);
      deck.push(0,4,9,13,17,20,24,28,32,37,42,45,49,52,56);
      var RemainPack=deck.concat();
  }else{
      var RemainPack=deck.concat();
      RemainPack=RemainPack.concat(hand2);
      RemainPack=RemainPack.concat(hand3);
      RemainPack=RemainPack.concat(hand4);
      RemainPack=RemainPack.concat(Extrash);
  }
    switch(num){
      case -2:
      case -1:
        paiviewerMask.removeAllChildren();
        for(var i=0;i<70;i++){
          var X=Math.floor(i%12);
          var Y=Math.floor(i/12);
          var A=RemainPack.filter(value=>value==i)
          if(A.length){
            var t = new createjs.Text(A.length, "26px Bold Arial", "black");
            t.x=45+50*X;
            t.y=120+65*Y;
            t.outline=5;
            paiviewerMask.addChild(t);
            var t = new createjs.Text(A.length, "26px Bold Arial", "white");
            t.x=45+50*X;
            t.y=120+65*Y;
            paiviewerMask.addChild(t);
          }else{
            var s = new createjs.Shape();
            s.graphics.beginFill("rgba(20,20,20,0.7)");
            s.graphics.drawRoundRect(30+50*X,100+65*Y,50,65,6,6,);
            paiviewerMask.addChild(s);
          }
        }
        break;
      default:
          var A=RemainPack.filter(value=>value==num)
          if(A.length){
            return A.length;
          }else{
            return false;
          }
        break;
    }
  }
  function shuffle(){
    for(var i =deck.length-1; i>0 ; i--){
    var r =Math.floor(Math.random()*(i+1));
    var temp = deck[i];
    deck[i] = deck[r]
    deck[r] = temp
  }};
  function decklength(op=0){
    //残り枚数と表ドラを描写
    //op 0 ->テキストの更新
    if(op==0){
      deckText.text="残:"+ deck.length;
      return true;
    }
    var DD=dora[dora.length-1]
    e7 = new createjs.Bitmap(eltear_src[DD]);
    e7.x=dorax;
    e7.y=10;
    e7.scale=33/120;
    field.addChild(e7);
    deckText.text = "残:"+ deck.length;
    deckText.x=540;
    deckText.y=20;
    field.addChild(deckText);
    var btn1 = createButton("シナジー", 100, 45,"#ffbb4d","#ff7b00","#372d23","#5e5e5e");
        btn1.x = 300;
        btn1.y = 10;
        field.addChild(btn1);
        btn1.addEventListener("click", {handleEvent:Menu}); 
    var btn1 = createButton("残パイリスト", 130, 45);
        btn1.x = 400;
        btn1.y = 10;
        field.addChild(btn1);
        btn1.addEventListener("click", {handleEvent:Menu}); 
  }
  function compareFunc(a,b){return a-b;}
  function compareFuncID(a,b){return(a.id - b.id);}  
  function compareFunc2(a,b){return(a.elia - b.elia);}  
  function compareFunc3(a,b){
    if(a>=68){return 3}else{return a%4-b%4;}}
  function compareFunc4(a,b){
    if (a.elia === b.elia) {
      if (a.nod === b.nod) {
        return b.city - a.city;
      }else{
      return a.nod - b.nod;
      };
    }
    return a.elia - b.elia;}  
  function getIsDuplicate(arr1, arr2) {
    return [...arr1, ...arr2].filter(item => arr1.includes(item) && arr2.includes(item)).length > 0
  };
  function AK(name){
    //実績系
      var A=achieveA.findIndex(value=>value.name==name);
      if(A!==-1){
        if(achieveA[A].cleared==0){
          achieveA[A].cleared=1;
          PopAnm("実績を開放しました",800,220,35,30,55);
        }
      }
    }
    function opening(){
      //vs表示する
        cx2.clearRect(0,0,800,600);
        field.removeAllChildren();
      var rect = new createjs.Shape();
        rect.graphics
      .beginFill("rgb(15, 37, 24)").drawRect(0, 0, 800, 600);
    field.addChild(rect);
    var ContainerA = new createjs.Container();
    field.addChild(ContainerA);
    var ContainerB = new createjs.Container();
    field.addChild(ContainerB);
      var rect = new createjs.Shape();
        rect.graphics
      .beginFill("rgb(241, 241, 241)").drawRect(198, 0, 4, 600).drawRect(398, 0, 4, 600).drawRect(598, 0, 4, 600);
    field.addChild(rect);
      var rect = new createjs.Shape();
        rect.graphics
      .beginRadialGradientFill(["rgba(235, 33, 33, 0.7)", "rgba(92, 14, 14, 0.73)"], [0,  1], 50, 100, 0, 50, 100, 200)
      .drawRect(0, 0, 200, 600);
    ContainerA.addChild(rect);
      var rect = new createjs.Shape();
        rect.graphics
      .beginRadialGradientFill(["rgba(50, 77, 226,0.7)", "rgba(27, 43, 134, 0.8)"], [0,  1], 250, 160, 0, 250, 160, 200)
      .drawRect(200, 0, 200, 600);
    ContainerB.addChild(rect);
      var rect = new createjs.Shape();
        rect.graphics
      .beginRadialGradientFill(["rgba(36, 202, 105,0.7)", "rgba(17, 128, 63, 0.75)"], [0,  1], 450, 380, 0, 450, 380, 200)
      .drawRect(400, 0, 200, 600);
    ContainerA.addChild(rect);
        var rect = new createjs.Shape();
        rect.graphics
      .beginRadialGradientFill(["rgba(224, 194, 60,0.7)", "rgba(177, 102, 33, 0.7)"], [0,  1], 650, 440, 0, 650, 440, 200)
      .drawRect(600, 0, 200, 600);
    ContainerB.addChild(rect);
    if(pvpmode==1){
        var Ary=[0,Username,MEMBER[1].name,MEMBER[2].name,MEMBER[3].name]          
        }else{
        var Ary=[0,Username,"CPU1","CPU2","CPU3"]
        }
    for(var i=1;i<5;i++){
      var e1;
      var AryX=[500,500,500,500,500,520,500,400,500,500];
    if(fool){
        e1 = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[i]]));          
        }else{
        e1 = new createjs.Bitmap(queue.getResult(chrimg_src[chara[i]]));
        }
        e1.sourceRect={x:AryX[chara[i]],y:0,width:200,height:600}
        e1.x=200*(i-1);
        var t1 = new createjs.Text(Ary[i], "32px 'Century Gothic'", "black");
          t1.x=40+200*(i-1);
          t1.y=500;
          t1.outline=6;
          t1.rotation=6;
        var t = new createjs.Text(Ary[i], "32px 'Century Gothic'", "white");
          t.x=40+200*(i-1);
          t.y=500;
          t.outline=2;
          t.rotation=6;
      if(i%2==1){
        ContainerA.addChild(e1);
        ContainerA.addChild(t1);
        ContainerA.addChild(t);
      }else{
        ContainerB.addChild(e1);
        ContainerB.addChild(t1);
        ContainerB.addChild(t);
      }
    }
        var ty=new createjs.Text("対局開始",  "46px 'bold Century Gothic'", "#c5faeb");
          ty.x=300;
          ty.y=280;
          ty.outline=7;
          ty.scale=1.2
        var tx=new createjs.Text("対局開始",  "46px 'bold Century Gothic'", "#2763e3");
          tx.x=300;
          tx.y=280;
          tx.scale=1.2
          field.addChild(ty);
          field.addChild(tx);
          createjs.Tween.get(ty)
          .to({scale:1,x:300,alpha:0.7},250,createjs.Ease.backOut)
          .wait(1200)
          .to({scale:1.1,x:360,alpha:0},500,createjs.Ease.backOut)
          createjs.Tween.get(tx)
          .to({scale:1,x:300,alpha:1},250,createjs.Ease.backOut)
          .wait(1200)
          .to({scale:1.1,x:280,alpha:0},500,createjs.Ease.backOut)
    ContainerA.y=-600;
    ContainerB.y=600;
    createjs.Tween.get(ContainerA)
        .to({y:0, alpha: 1},250, createjs.Ease.cubicInOut) 
        .wait(1800)
    createjs.Tween.get(ContainerB)
        .to({y:0, alpha: 1},250, createjs.Ease.cubicInOut) 
        .wait(1800)
        .call(TodeckHandler);
    se20.play();
    createjs.Tween.get(rect)
    .wait(300)
    .call(SE);
    function SE(){se17.play();}
    function TodeckHandler(){
      if(pvpmode==0){
        deckHandler();
      }else if(pvpmode==1){
        if(IsHost(IAM.room)){
          deckHandler();
        }
      }
    }
    }
      function deckHandler(){
        //ゲームスタート時の配牌と画面
        console.log('deckhandler')
        cx2.clearRect(0,0,800,600);
        field.removeAllChildren();
        guidemap.removeAllChildren();
        guidemap.alpha=1;
        fieldpai.removeAllChildren();
        //背景
        if(LP[0]==4){
          backyard.y=-600;
          fieldmap.removeAllChildren();
          fieldmap.x=0;
        }else{
          backyard.y=0;
        }
        var rect = new createjs.Shape();
          rect.graphics.beginFill("rgba(10,10,10,0.6)")
                        .drawRect(630, 400, 160, 80)
                        .drawRect(630, 10, 160, 350)
                        .drawRect(630, 365, 160, 30)
                        .drawRect(10, 10, 220, 44)
                        .drawRect(10, 60, 135, 34)
                        .drawRect(530, 10, 90, 44)
                        .beginFill("rgba(15, 46, 104, 0.6)")
                        .drawRect(5, 100, 140, 100)
                        .beginFill("rgba(17, 110, 56, 0.6)")
                        .drawRect(5, 200, 140, 100)
                        .beginFill("rgba(114, 116, 16, 0.6)")
                        .drawRect(5, 300, 140, 100)
                        .beginFill("rgba(112, 15, 15, 0.6)")
                        .drawRect(5, 400, 140, 100);
        field.addChild(rect);
        rect.addEventListener("click", {handleEvent:Menu}); 
        field.addChild(Csquare);
        var t = new createjs.Text("ドラ", "24px 'Century Gothic'", "white");
        t.x=10;
        t.y=20;
        field.addChild(t);
        skillusage2[0]+=1;
        auras=0;
        if(pvpmode==1){
          if(debugmode){console.log(skillusage2[0],MEMBER)};
          for(var i=0;i<MEMBER.length;i++){
            MEMBER[i].turnflag=0;
          }
          MEMBER[parent].turnflag=1;
          for(var i=0;i<MEMBER.length;i++){
            console.log(MEMBER[i].turnflag)
          };
          if(LP_PVP.Length[0]==1 && skillusage2[0]==4){
            cx1.fillText("オーラス"+(skillusage2[5]),10,88);
            auras=1;
            Dlvup.alpha=0;
            Dlvup.x=-60;
            Dlvup.y=-40;
            Dlvup.scale=1.2;
            se12.play();
            createjs.Tween.get(Dlvup)
            .to({scale:1,x:0,y:0,alpha:1},150,createjs.Ease.backOut)
            .wait(1000)
            .to({scale:1.5,x:-200,y:-150,alpha:0},250,createjs.Ease.backOut);
          }else if(LP_PVP.Length[0]==2 && skillusage2[0]==8){
            cx1.fillText("オーラス"+(skillusage2[5]),10,88);
            auras=1;
            Dlvup.alpha=0;
            Dlvup.x=-60;
            Dlvup.y=-40;
            Dlvup.scale=1.2;
            se12.play();
            createjs.Tween.get(Dlvup)
            .to({scale:1,x:0,y:0,alpha:1},150,createjs.Ease.backOut)
            .wait(1000)
            .to({scale:1.5,x:-200,y:-150,alpha:0},250,createjs.Ease.backOut);
          }else{cx1.fillText("第"+(skillusage2[0])+"局 "+(skillusage2[5])+"本場",10,88);
               }
        }
        var t = new createjs.Text("第"+(skillusage2[0])+"局 "+(skillusage2[5])+"本場", "24px 'Century Gothic'", "white");
        t.x=10;
        t.y=68;
        if(LP[0]>=0 && LP[0]!==3 && skillusage2[0]==8){
          t.text="オーラス"+(skillusage2[5]);
          auras=1;
          Dlvup.alpha=0;
          Dlvup.x=-60;
          Dlvup.y=-40;
          Dlvup.scale=1.2;
          se12.play();
          createjs.Tween.get(Dlvup)
          .to({scale:1,x:0,y:0,alpha:1},150,createjs.Ease.backOut)
          .wait(1000)
          .to({scale:1.5,x:-200,y:-150,alpha:0},250,createjs.Ease.backOut);
        }else if(skillusage2[5]==0){
          var ty=new createjs.Text("第"+(skillusage2[0])+"局",  "32px 'bold Century Gothic'", "#fff0f6");
          ty.x=360;
          ty.y=340;
          ty.outline=5;
          var tx=new createjs.Text("第"+(skillusage2[0])+"局",  "32px 'bold Century Gothic'", "#e32753");
          tx.x=360;
          tx.y=340;
          stage.addChild(ty);
          stage.addChild(tx);
          createjs.Tween.get(ty)
          .to({x:360,alpha:0.8},50,createjs.Ease.backOut)
          .wait(700)
          .to({x:380,alpha:0},500,createjs.Ease.backOut)
          createjs.Tween.get(tx)
          .to({x:360,alpha:1},50,createjs.Ease.backOut)
          .wait(700)
          .to({x:380,alpha:0},500,createjs.Ease.backOut)
          .call(next);
          Clvup.alpha=0;
          Clvup.x=160;
          Clvup.y=100;
          createjs.Tween.get(Clvup)
          .to({x:180,alpha:1},160,createjs.Ease.backOut)
          .wait(700)
          .to({x:210,alpha:0},300,createjs.Ease.backOut);
          function next(){
            stage.removeChild(tx);
            stage.removeChild(ty);
          }
        }
        field.addChild(t);
        //music
        console.log(auras,musicset)
        if(auras==0 && musicset[0]!==musicnum){
          if(musicset[0]==0){
            musicnum=musicrandom[0][Math.floor(Math.random()*musicrandom[0].length)]
          }else{
            musicnum=musicset[0]
          }
          if(musicnum!==musictemp){
            musicStart(musicnum);
          }
        }else if(auras==1 && musicset[2]!==musicnum){
          if(musicset[2]==0){
            //曲の抽選は最初だけ
            if(skillusage2[5]==0){
            musicnum=musicrandom[2][Math.floor(Math.random()*musicrandom[2].length)];
            }
          }else{
            musicnum=musicset[2]
          }
        musicStart(musicnum);
      };
      //リーチの選曲も予め入力
      if(musicset[1]<=0){
        musicset[1]=-musicrandom[1][Math.floor(Math.random()*musicrandom[1].length)];
      }
      var t = new createjs.Text("ポン", "16px 'Century Gothic'", "white");
      t.x=640;
      t.y=410;
      field.addChild(t);
      var t = new createjs.Text("リーチ", "16px 'Century Gothic'", "white");
      t.x=640;
      t.y=450;
      field.addChild(t);
      var t = new createjs.Text("カン", "16px 'Century Gothic'", "white");
      t.x=720;
      t.y=410;
      field.addChild(t);
      if(skillswitch[0] !==-2){
      var t = new createjs.Text("スキル", "16px 'Century Gothic'", "white");
      t.x=720;
      t.y=450;
      field.addChild(t);
      };
        parentY =400
        var Ary=[500,500,500,500,500,500,500,400,430,460];
        var Ary2=[0,50,0,0,60,0,60,0,80,50];
        if(fool){
          e11 = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[1]]));          
        }else{
          e11 = new createjs.Bitmap(queue.getResult(chrimg_src[chara[1]]));
        }
        e11.sourceRect={x:Ary[chara[1]],y:Ary2[chara[1]],width:300,height:600}
        e11.x=0;
        e11.y=400;
        e11.scale=1/3;
        if(fool){
          e12 = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[2]]));          
        }else{
          e12 = new createjs.Bitmap(queue.getResult(chrimg_src[chara[2]]));
        }
        e12.sourceRect={x:Ary[chara[2]],y:Ary2[chara[2]],width:300,height:300}
        e12.x=0;
        e12.y=100;
        e12.scale=1/3;
        if(fool){
          e13 = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[3]]));          
        }else{
        e13 = new createjs.Bitmap(queue.getResult(chrimg_src[chara[3]]));
          }
        e13.sourceRect={x:Ary[chara[3]],y:Ary2[chara[3]],width:300,height:300}
        e13.x=0;
        e13.y=200;
        e13.scale=1/3;
        if(fool){
          e14 = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[4]]));          
        }else{
        e14 = new createjs.Bitmap(queue.getResult(chrimg_src[chara[4]]));
        }
        e14.sourceRect={x:Ary[chara[4]],y:Ary2[chara[4]],width:300,height:300}
        e14.x=0;
        e14.y=300;
        e14.scale=1/3;
        field.addChild(e11);
        field.addChild(e12);
        field.addChild(e13);
        field.addChild(e14);
        for(var i=1; i<skillswitch.length;i++){
          skillswitch[i]=1;
          }
          skillusage=new Array(0,0,0,0,0)
          if(LP[0]==2){
            for(var i=1; i<5 ; i++){//復活
              if(LP[i]<0){
              skillusage2[i]-=1;
              if(skillusage2[i] <=-1){
                console.log('revived!');
                LP[i]=75000;
                for (var I=0;I<4;I++){
                  if(I!==i){
                  death[i-1].Bdmg[i-1]+=death[i-1].Bdmg[I];
                  death[i-1].Bdmg[I]=0;
                  }
                }
              }}
          }};
        LPtextlist=[];//HPテキスト
        parentY =450;
        var t = new createjs.Text(LP[1], "16px 'Century Gothic'", "#eb5600");
        t.x=80;
        t.y=450;
        t.outline=3;
        field.addChild(t);
        LPtextlist.push(t);
        var t = new createjs.Text(LP[1], "16px 'Century Gothic'", "white");
        t.x=80;
        t.y=450;
        field.addChild(t);
        LPtextlist.push(t);
        parentY =150;
        var t = new createjs.Text(LP[2], "16px 'Century Gothic'", "#eb5600");
        t.x=80;
        t.y=parentY;
        t.outline=3;
        field.addChild(t);
        LPtextlist.push(t);
        var t = new createjs.Text(LP[2], "16px 'Century Gothic'", "white");
        t.x=80;
        t.y=parentY;
        field.addChild(t);
        LPtextlist.push(t);
        parentY +=100
        var t = new createjs.Text(LP[3], "16px 'Century Gothic'", "#eb5600");
        t.x=80;
        t.y=parentY;
        t.outline=3;
        field.addChild(t);
        LPtextlist.push(t);
        var t = new createjs.Text(LP[3], "16px 'Century Gothic'", "white");
        t.x=80;
        t.y=parentY;
        field.addChild(t);
        LPtextlist.push(t);
        parentY +=100
        var t = new createjs.Text(LP[4], "16px 'Century Gothic'", "#eb5600");
        t.x=80;
        t.y=parentY;
        t.outline=3;
        field.addChild(t);
        LPtextlist.push(t);
        var t = new createjs.Text(LP[4], "16px 'Century Gothic'", "white");
        t.x=80;
        t.y=parentY;
        field.addChild(t);
        LPtextlist.push(t);
        parentY =185;
        if(pvpmode==1){
        var Ary=[MEMBER[1].name,MEMBER[2].name,MEMBER[3].name,Username]          
        }else{
        var Ary=["CPU1","CPU2","CPU3",Username]
        }
        for(var i=0;i<4;i++){
          var t = new createjs.Text(Ary[i], "16px 'Century Gothic'", "black");
          t.x=10;
          t.y=parentY;
          t.outline=3;
          field.addChild(t);
          var t = new createjs.Text(Ary[i], "16px 'Century Gothic'", "white");
          t.x=10;
          t.y=parentY;
          t.outline=1;
          field.addChild(t);
          parentY +=100;
        }
        parentY =125+100*parent
        var Ary=["柔軟","強靭","強烈","超越"];
        for(var i=0;i<4;i++){
        var t = new createjs.Text(Ary[i], "16px 'Century Gothic'", "white");
        t.x=110;
        t.y=parentY;
        t.outline=3;
        field.addChild(t);
        var t = new createjs.Text(Ary[i], "16px 'Century Gothic'", "black");
        t.x=110;
        t.y=parentY;
        field.addChild(t);
        if(parentY ==425){parentY =125}else{parentY +=100}
          }
        if(parentY ==125){parentY =425}else{parentY -=100};
        var t = new createjs.Text("親", "16px 'Century Gothic'", "white");
        t.x=80;
        t.y=parentY;
        t.outline=3;
        field.addChild(t);
        var t = new createjs.Text("親", "16px 'Century Gothic'", "black");
        t.x=80;
        t.y=parentY;
        field.addChild(t);
        var shape = new createjs.Shape();
        shape.graphics.beginStroke("Red");
        shape.graphics.setStrokeStyle(2);
        shape.graphics.drawCircle(90, parentY+8, 16); 
        field.addChild(shape); // 表示リストに追加
        //Cstar
        var Cstar = new createjs.Shape(graphics);
        Cstar.x=80;
        Cstar.y=parentY-5;
        Cstar.rotation=-15;
        Cstar.scale=0.3;
        field.addChild(Cstar)
        var rect = new createjs.Shape();
        rect.graphics.beginFill("rgba(20,20,20,0.5)")
                      .drawRect(630, 400, 160, 80)
        field.addChild(rect);
        handsort=0;
        var btn1 = createButton("SORT", 80, 40);
        btn1.x = 10;
        btn1.y = 550;
        field.addChild(btn1);
        btn1.addEventListener("click", {handleEvent:SortButton});
        var t = new createjs.Text("捨パイ：", "14px Arial", "white");
        tumonameA.text="　"
        tumonameB.text="　"
        t.x=640;
        t.y=365;
        field.addChild(t);
        field.addChild(tumonameA);
        field.addChild(tumonameB);
        //初期化
        dora=[]
        handtemp=[]
        tumotemp=0;
        //Tumotemp=[]
        cpuwant =0
        Ronturn=[];
        trash=[[],[],[],[]];
        Extrash=[];
        c1=0
        opLock=0;
        raidscore=[0,0,0,0,0];
        Reverse = false;
        if(debugmode){Reverse = true;}
        //ポンポポン
        ponsw=[0,0,0,0,0]
        poncpu=[0,Ponrate,Ponrate,Ponrate,Ponrate]
        pon1=[];
        pon2=[];
        pon3=[];
        pon4=[];
        kansw=[0,0,0,0,0]
        kan1=[];
        kan2=[];
        kan3=[];
        kan4=[];
        ctl=new Array(0,0,2,2,2)
        ctlerror=new Array(0,0,0,0,0)
        cLock = 0;
        //clock0->反応させない　1以上->操作を許可 2->リーチからのパイ切り？ 3->スキルキーからのパイ切り
        han =new Array(0,0,0,0,0)
        reach =new Array(0,0,0,0,0)
        nuki =new Array(0,0,0,0,0);
        nukiswitch =new Array(0,0,0,0,0);
        ippatu =new Array(0,0,0,0,0)
        rorder =new Array(0,0,0,0,0)
        for(var i=1; i<5;i++){
        if(LP[i]<=0){rorder[i]=2}else{rorder[i]=0}
        }
        counter=new Array(0,0,0,0,0)
        counterR=new Array(-1,-1,-1,-1,-1)
        riverx=new Array(0,120,120,120,120)
        rivery=new Array(0,400,100,200,300)
        DPlist=new Array(0,0,0,0,0);
        drawDP();
        Buff =new Array(0,[],[],[],[])
        Bufflist =new Array(0,[],[],[],[])
        if(LP[0]==4){
          var K=5-skillusage2[0];
          if(K>0){;
        for (var i=1;i<Buff.length;i++){
          for(var j=0;j<K;j++){
        Buff[i].push(7);
        }}}
      }
        Buffdraw();
        if(pvpmode==1){
          if(IsHost(IAM.room)){
            //ホストで初期化するもの
            deck=[]
            hand1=[]
            hand2=[]
            hand3=[]
            hand4=[]
            for(var i =0; i<70; i++){
              deck.push(i);
              }
              deck.push(60,61,62,63,64,65,66,67);
              deck.push(0,4,9,13,17,20,24,28,32,37,42,45,49,52,56);
              if(debugmode){console.log(deck.length);}
            shuffle();
            if(debugmode){console.log(parent);}
            king =[];
            for (var i = 0; i < 10; i++) {
              king.push(Math.floor(Math.random() * 67));
            }
            hand1b=deck.splice(0,8-hand1.length)
            hand1=hand1.concat(hand1b)
            hand1b=deck.splice(0,8-hand2.length)
            hand2=hand2.concat(hand1b)
            hand1b=deck.splice(0,8-hand3.length)
            hand3=hand3.concat(hand1b)
            hand1b=deck.splice(0,8-hand4.length)
            hand4=hand4.concat(hand1b)
            //手札をソート
            hand1.sort(compareFunc);
            hand2.sort(compareFunc);
            hand3.sort(compareFunc);
            hand4.sort(compareFunc);
            //1番目の配列は上がり判定に使用
            hand1.unshift(-1)
            hand2.unshift(-1)
            hand3.unshift(-1)
            hand4.unshift(-1)
            //最後9番目の配列はドローカードに使うので適当に100を代入
            hand1.push(100)
            hand2.push(100)
            hand3.push(100)
            hand4.push(100)
            if(debugmode){
            console.log(king);//嶺上牌
            console.log(hand1);//自分の手札
            console.log(hand2);
            console.log(hand3);
            console.log(hand4);
            }
            socket.emit("deck_handler",{room:RoomName[IAM.room],Deck:deck,Hand:{hand1,hand2,hand3,hand4},King:king,MPV:mpVelocity,PON:Ponrate,FEV:Fever} );
            //非ホスト側は特に何もせず
          };
        }else{
        //PvE
        deck=[]
        hand1=[]
        hand2=[]
        hand3=[]
        hand4=[]
        for(var i =0; i<70; i++){
        deck.push(i);
        }
        deck.push(0,4,9,13,17,20,24,28,32,37,42,45,49,52,56);
        deck.push(60,61,62,63,64,65,66,67);
        if(debugmode){console.log(deck.length);}
        //expected>93
        //山シャッフル
        shuffle();
        //初手積み込み
        if(debugmode){console.log(parent);}
        if(chara[1]==3 && parent==2){
          console.log("NF 1")
          for(var i=0;i<5;i++){
          var A=deck.findIndex(value=>(value>=8 && value<=11)||(value>=40 && value<=43))
          var B=[1,0.9,0.6,0.3,0.2];
          var R=Math.random();
          if(R<B[i]){
            hand1.push(deck[A]);
            deck.splice(A,1);
          }
          }
        }
        if(chara[2]==3 && parent==3){
          console.log("NF 2")
          for(var i=0;i<5;i++){
            var A=deck.findIndex(value=>(value>=8 && value<=11)||(value>=40 && value<=43))
            var B=[1,0.9,0.6,0.3,0.2];
          var R=Math.random();
          if(R<B[i]){
            hand2.push(deck[A]);
            deck.splice(A,1);
          }
          }
        }
        if(chara[3]==3 && parent==0){
          console.log("NF 3")
          for(var i=0;i<5;i++){
            var A=deck.findIndex(value=>(value>=8 && value<=11)||(value>=40 && value<=43))
            var B=[1,0.9,0.6,0.3,0.2];
          var R=Math.random();
          if(R<B[i]){
            hand3.push(deck[A]);
            deck.splice(A,1);
          }
          }
        }
        if(chara[4]==3 && parent==1){
          console.log("NF 4")
          for(var i=0;i<5;i++){
            var A=deck.findIndex(value=>(value>=8 && value<=11)||(value>=40 && value<=43))
            var B=[1,0.9,0.6,0.3,0.2];
          var R=Math.random();
          if(R<B[i]){
            hand4.push(deck[A]);
            deck.splice(A,1);
          }
          }
        }
        if(chara[1]==8 && skillusage2[1]>0){
          console.log("ELE 1")
          for(var i=0;i<skillusage2[1]+1;i++){
            if(i>=7){break};
          var R=Math.floor(Math.random()*4);
          var A=deck.findIndex(value=>(value%4==R))
          if(R!==-1){
            hand1.push(deck[A]);
            deck.splice(A,1);
          }
          }
        }
        if(chara[2]==8 && skillusage2[2]>0){
          console.log("ELE 2")
          for(var i=0;i<skillusage2[2]+1;i++){
            if(i>=7){break};
          var R=Math.floor(Math.random()*4);
          var A=deck.findIndex(value=>(value%4==R))
          if(R!==-1){
            hand2.push(deck[A]);
            deck.splice(A,1);
          }
          }
        }
        if(chara[3]==8 && skillusage2[3]>0){
          console.log("ELE 3")
          for(var i=0;i<skillusage2[3]+1;i++){
            if(i>=7){break};
          var R=Math.floor(Math.random()*4);
          var A=deck.findIndex(value=>(value%4==R))
          if(R!==-1){
            hand1.push(deck[A]);
            deck.splice(A,1);
          }
          }
        }
        if(chara[4]==8 && skillusage2[4]>0){
          console.log("ELE 4")
          for(var i=0;i<skillusage2[4]+1;i++){
            if(i>=7){break};
          var R=Math.floor(Math.random()*4);
          var A=deck.findIndex(value=>(value%4==R))
          if(R!==-1){
            hand1.push(deck[A]);
            deck.splice(A,1);
          }
          }
        }
        king =[];
        for (var i = 0; i < 10; i++) {
          king.push(Math.floor(Math.random() * 67));
        }
        //deck.splice(0,7)
        hand1b=deck.splice(0,8-hand1.length)
        hand1=hand1.concat(hand1b)
        hand1b=deck.splice(0,8-hand2.length)
        hand2=hand2.concat(hand1b)
        hand1b=deck.splice(0,8-hand3.length)
        hand3=hand3.concat(hand1b)
        hand1b=deck.splice(0,8-hand4.length)
        hand4=hand4.concat(hand1b)
        //手札をソート
        hand1.sort(compareFunc);
        hand2.sort(compareFunc);
        hand3.sort(compareFunc);
        hand4.sort(compareFunc);
        //積み込み
        //if(debugmode){hand1=[60,61,62,63,64,66,67,68]};
        //1番目の配列は上がり判定に使用
        hand1.unshift(-1)
        hand2.unshift(-1)
        hand3.unshift(-1)
        hand4.unshift(-1)
        //最後9番目の配列はドローカードに使うので適当に100を代入
        hand1.push(100)
        hand2.push(100)
        hand3.push(100)
        hand4.push(100)
        if(debugmode){
          console.log(king);//嶺上牌
        console.log(hand1);//自分の手札
        console.log(hand2);
        console.log(hand3);
        console.log(hand4);
        }
      };
      dora=king.splice(0,1);
      if(debugmode){console.log(dora)}
      dorax=60
      handgraph(-1,1);
      decklength(1);
      turn =parent
      if(LP[turn+1]<=0){turn+=1;if(turn==4){turn=0}}
      if(LP[turn+1]<=0){turn+=1;if(turn==4){turn=0}}
      if(LP[turn+1]<=0){turn+=1;if(turn==4){turn=0}}
      parent +=1;
      if(parent ==4){parent =0}
      ctl[turn+1]=0;
  };
  function musicStart(num){
    if(debugmode){console.log('musicStart',num,mute)}
    musictemp=musicnum;
    if( mute=="ON" ){
      Bgm.stop();
    switch (num){
      case 1:
        Bgm =new Music(bgm1data);
        Bgm.playMusic();
        break;
      case 2:
        Bgm =new Music(bgm2data);
        Bgm.playMusic();
      break;
      case 3:
        Bgm =new Music(bgm3data);
        Bgm.playMusic();
      break;
      case 4:
        Bgm =new Music(bgm4data);
        Bgm.playMusic();
      break;
      case 5:
        Bgm =new Music(bgm5data);
        Bgm.playMusic();
      break;
      case 6:
        Bgm =new Music(bgm6data);
        Bgm.playMusic();
      break;
      case 7:
        Bgm =new Music(bgm7data);
        Bgm.playMusic();
      break;
      case 8:
        Bgm =new Music(bgm8data);
        Bgm.playMusic();
      break;
      case 9:
        Bgm =new Music(bgm9data);
        Bgm.playMusic();
        break;
      case 10:
        Bgm =new Music(bgm10data);
        Bgm.playMusic();
        break;
      case 11:
        Bgm =new Music(bgm11data);
        Bgm.playMusic();
        break;
      case 12:
        Bgm =new Music(bgm12data);
        Bgm.playMusic();
        break;
      case 13:
        Bgm =new Music(bgm13data);
        Bgm.playMusic();
        break;
      case 17:
        Bgm =new Music(bgm17data);
        Bgm.playMusic();
        break;
      default:
        console.log(musicnum,'bgm error!')
        Bgm.stop();
    }}
  };
  function musicVolume(){
    var N;
    switch(musicnum){
      case 1:
        N=0.12;
        break;
      case 2:
        N=0.07;
        break;
      case 3:
        N=0.08;
        break;
      case 4:
        N=0.05;
        break;
      case 5:
        N=0.6;
        break;
      case 6:
        N=0.45;
        break;
      case 7:
        N=0.3
        break;
      case 8:
        N=0.5;
        break;
      case 9:
        N=0.15
        break;
      case 10:
        N=0.4
        break;
      case 11:
        N=0.3;
        break;
      case 12:
        N=0.3;
        break;
      case 13:
        N=0.5;
        break;
      default:
        return false;
    }
    Bgm.volume(N*vBar);
  }
      function Buffdraw(){
     //バフアイコンを描画する
     var x=[0,120,120,120,120];
     var y=[0,400,100,200,300];
     for(var i=1;i<5;i++){
    //リスト初期化
    if(Bufflist[i].length>0){
      for(var j=0;j<Bufflist[i].length;j++){
        field.removeChild(Bufflist[i][j]);
      }
    }
    if(LP[i]<0){
        var s = new createjs.Bitmap(donicon_src[0]);
        s.sourceRect={x:150,y:0,width:30,height:30}
        s.x=x[i];
        s.y=y[i];
        s.scale=2/3;
        field.addChild(s);
        Bufflist[i].push(s);
        x[i]-=20;
    }
     if(Buff[i].length>0){
    var A=Buff[i].filter(value=>value==1);
    var B=Buff[i].filter(value=>value==2);
    var C=Buff[i].filter(value=>value==3);
    var D=Buff[i].filter(value=>value==4);
    var E=Buff[i].filter(value=>value==5);
    var F=Buff[i].filter(value=>value==6);
    var G=Buff[i].filter(value=>value==11);
    var H=Buff[i].filter(value=>value==7);
    if(G.length>0){
      var s = new createjs.Bitmap(donicon_src[0]);
      s.sourceRect={x:150,y:0,width:30,height:30}
      s.x=x[i];
      s.y=y[i];
      s.scale=2/3;
      field.addChild(s);
      Bufflist[i].push(s);
      x[i]-=20;
    };
    if(H.length>0){
      var s = new createjs.Bitmap(donicon_src[0]);
      s.sourceRect={x:210,y:0,width:30,height:30}
      s.x=x[i];
      s.y=y[i];
      s.scale=2/3;
      field.addChild(s);
      Bufflist[i].push(s);
      var t = new createjs.Text(H.length, "8px Arial", "white");
      t.x=x[i]+12;
      t.y=y[i]+12;
      field.addChild(t);
      Bufflist[i].push(t);
      x[i]-=20;
    };
        if(A.length>0){
          var s = new createjs.Bitmap(donicon_src[0]);
          s.sourceRect={x:0,y:0,width:30,height:30}
          s.x=x[i];
          s.y=y[i];
          s.scale=2/3;
          field.addChild(s);
          Bufflist[i].push(s);
          var t = new createjs.Text(A.length, "8px Arial", "white");
          t.x=x[i]+12;
          t.y=y[i]+12;
          field.addChild(t);
          Bufflist[i].push(t);
          x[i]-=20;
      };
          if(B.length>0){
            var s = new createjs.Bitmap(donicon_src[0]);
            s.sourceRect={x:90,y:0,width:30,height:30}
            s.x=x[i];
            s.y=y[i];
            s.scale=2/3;
            field.addChild(s);
            Bufflist[i].push(s);
            var t = new createjs.Text(B.length, "8px Arial", "white");
            t.x=x[i]+12;
            t.y=y[i]+12;
            field.addChild(t);
            Bufflist[i].push(t);
            x[i]-=20;
        };
            if(C.length>0){
              var s = new createjs.Bitmap(donicon_src[0]);
              s.sourceRect={x:60,y:0,width:30,height:30}
              s.x=x[i];
              s.y=y[i];
              s.scale=2/3;
              field.addChild(s);
              Bufflist[i].push(s);
              var t = new createjs.Text(C.length, "8px Arial", "white");
              t.x=x[i]+12;
              t.y=y[i]+12;
              field.addChild(t);
              Bufflist[i].push(t);
              x[i]-=20;
          };
          if(D.length>0){
            var s = new createjs.Bitmap(donicon_src[0]);
            s.sourceRect={x:180,y:0,width:30,height:30}
            s.x=x[i];
            s.y=y[i];
            s.scale=2/3;
            field.addChild(s);
            Bufflist[i].push(s);
            var t = new createjs.Text(D.length, "8px Arial", "white");
            t.x=x[i]+12;
            t.y=y[i]+12;
            field.addChild(t);
            Bufflist[i].push(t);
            x[i]-=20;
          };
            if(E.length>0){
              var s = new createjs.Bitmap(donicon_src[0]);
              s.sourceRect={x:120,y:0,width:30,height:30}
              s.x=x[i];
              s.y=y[i];
              s.scale=2/3;
              field.addChild(s);
              Bufflist[i].push(s);
              var t = new createjs.Text(E.length, "8px Arial", "white");
              t.x=x[i]+12;
              t.y=y[i]+12;
              field.addChild(t);
              Bufflist[i].push(t);
              x[i]-=20;
          };
            if(F.length>0){
              var s = new createjs.Bitmap(donicon_src[0]);
              s.sourceRect={x:30,y:0,width:30,height:30}
              s.x=x[i];
              s.y=y[i];
              s.scale=2/3;
              field.addChild(s);
              Bufflist[i].push(s);
              var t = new createjs.Text(F.length, "8px Arial", "white");
              t.x=x[i]+12;
              t.y=y[i]+12;
              field.addChild(t);
              Bufflist[i].push(t);
              x[i]-=20;
          };
    }};
    };
    socket.on("deck-length", (data)=>{
      if(IAM.token!== data.Token){
        deck=data.Deck.concat();
        decklength();
      };
      });
    socket.on("tumo-pai", (data)=>{
      if(IAM.token!== data.Token){
        var N=1+MEMBER.findIndex(value=>value.id==data.who);
        tumo2=data.Tumo;
        TumoRon(N,0);
        return true;
      };
      });
    socket.on("ron-pai", (data)=>{
      if(IAM.token!== data.Token){
        var N=1+MEMBER.findIndex(value=>value.id==data.who);
        if(debugmode){console.log('ron-pai',N);}
      if(data.status){
        Ronturn.push(N);
      };
      rorder[N]=1;
      switch(N){
        case 2:
          hand2[0]=-1;
          break;
        case 3:
          hand3[0]=-1;
          break;
        case 4:
          hand4[0]=-1;
          break;
        default:
          hand1[0]=-1;
          break;
      }
      turn=turntemp;
      turnchecker();
      }
    });
    socket.on("pon-pai", (data)=>{
      if(IAM.token!== data.Token){
        var N=1+MEMBER.findIndex(value=>value.id==data.who);
        if(debugmode){console.log('pon-pai',N,data.status);}
      if(data.status){
        Pon(N,tumotemp);
      }else{
        switch(N){
          case 2:
            ponsw[N]=pon2.length;
            break;
          case 3:
            ponsw[N]=pon3.length;
            break;
          case 4:
            ponsw[N]=pon4.length;
            break;
          default:
            console.log('pon-pai N error?',N);
            ponsw[N]=pon2.length;
            break;
        }
        ponsw[0]=1;
        turnchecker();
      }
      }
    });
    socket.on("nuki-pai", (data)=>{
      //非送信者ならカンのアニメーションを表示する
      if(IAM.token!== data.Token){
        var N=1+MEMBER.findIndex(value=>value.id==data.who);
        if(debugmode){console.log('kan-pai',N,data.status);}
      if(data.status){
        //nuki[0]=N;
        if(data.pai==100){
          console.log(data.handtest);
        switch(N){
          case 2:
            hand2=data.handtest.concat();
            break;
          case 3:
            hand3=data.handtest.concat();
            break;
          case 4:
            hand4=data.handtest.concat();
            break;
          default:
            console.log('pon-pai N error?',N);
            kansw[N]=kan1.length;
            break;
        }};
        Kan(N,data.pai);
      }
      };
    });
    socket.on("skill-pai", (data)=>{
      //socket.emit("skill", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,to:target,SEtype:SEtype,status:true});
      if(debugmode){console.log('skill-pai',data.status);}
      if(IAM.token!== data.Token){
        var N=1+MEMBER.findIndex(value=>value.id==data.who);
        var M=1+MEMBER.findIndex(value=>value.id==data.to);
        var Tg;
        switch(chara[N]){
          case 1:
          case 3:
            Tg=M;
            break;
          default:
            Tg=data.Target;
            break;
        }
        //キャラごとにtargetの扱いが異なる
        //エルス、レナ→targetの相手に対して
        //アイシャ、レイヴン、ラシェ、アラ→targetの値そのまま
        skillswitch[N]=0;
        SkillAnimation(N,Tg,data.SEtype,1);
      };
    })
      function turnchecker(n=-1){
        console.log('turnchecker'+turn,ponsw[0],nuki[0],ManaBreak)
        if(n>=0){tumotemp=n};
      //pvpmode1の場合、ホストだけでチェックを行い、
      //プレイヤーのロン・ポン判定はそのプレイヤーになすりつける
      //n-> 加カンで回ってきた時に使用
        if(nuki[0]>0){
          var Fr1=Buff[1].findIndex(value=>value==6 || value==11);
          var Fr2=Buff[2].findIndex(value=>value==6 || value==11);
          var Fr3=Buff[3].findIndex(value=>value==6 || value==11);
          var Fr4=Buff[4].findIndex(value=>value==6 || value==11);
          if(rorder[1] !==2){
          if(rorder[1]==0 && turn !==0 && Fr1==-1 && ManaBreak==0){ron(1)};
          if(rorder[2]==0 && turn !==1 && Fr2==-1 && ManaBreak==0){ron(2)}
          if(rorder[3]==0 && turn !==2 && Fr3==-1 && ManaBreak==0){ron(3)}
          if(rorder[4]==0 && turn !==3 && Fr4==-1 && ManaBreak==0){ron(4)}
          }
          if(hand1[0]==-2){
            se6.play();
            //cx2.clearRect(630,400,80,40)
            turntemp =turn
            turn=4;
            var btn1=createCircleButton("ロン",50);
            btn1.x=320;
            btn1.y=400;
            ponkanmap.addChild(btn1)
            var btn2 = createButton("キャンセル", 90, 40);
            btn2.x = 440;
            btn2.y = 420;
            ponkanmap.addChild(btn2);
            btn1.addEventListener("click", {card:2,handleEvent:TumoronBt});
            btn2.addEventListener("click", {card:-1,handleEvent:TumoronBt});
            cLock=1;
            corsor();
            console.log('操作可',cLock)
          }else if(hand2[0]==-2){
          //ron(2)
          turntemp=turn
          turn=5
          if(pvpmode==1 && MEMBER[1].pc==1){
            console.log('player2 waiting');
          }else{
          cpu(2);
          }
          }else if(hand3[0]==-2){
          //ron(3)
          turntemp=turn
          turn=6
          if(pvpmode==1 && MEMBER[2].pc==1){
            console.log('player3 waiting');
          }else{
          cpu(3);
          }
          }else if(hand4[0]==-2){
          //ron(4)
          turntemp=turn
          turn=7
          if(pvpmode==1 && MEMBER[3].pc==1){
            console.log('player3 waiting');
          }else{
          cpu(4);
          }
          }else{
              //ロン処理
            if(Ronturn.length>0){
              setTimeout(function(){
                TumoRon(Ronturn[0],turn+1);
                Ronturn.shift();
                }, 550);
              return false;
            }
            //ターンを回す
            console.log(turn,nuki[0])
          turn =nuki[0]-1;
          if(pvpmode==1){
            if(nuki[0]==0){
            for(var i=0;i<MEMBER.length;i++){
              MEMBER[i].turnflag=0;
            }
            MEMBER[turn].turnflag=1;
          }}
          console.log(turn,Ronturn)
          Buffdraw();
          turnrole();
          }
          return false;
        }
        //捨て牌で誰も上がらないならターンを回す
        //ロン＞ポン
        //だれもロンしないなら隣の人がポンするか判定
        var Fr1=Buff[1].findIndex(value=>value==6 || value==11);
        var Fr2=Buff[2].findIndex(value=>value==6 || value==11);
        var Fr3=Buff[3].findIndex(value=>value==6 || value==11);
        var Fr4=Buff[4].findIndex(value=>value==6 || value==11);
        var Flame1=Buff[1].findIndex(value=>value==5);
        var Flame2=Buff[2].findIndex(value=>value==5);
        var Flame3=Buff[3].findIndex(value=>value==5);
        var Flame4=Buff[4].findIndex(value=>value==5);
        if(rorder[1] !==2){
        if(rorder[1]==0 && turn !==0 && Fr1==-1 && ManaBreak==0){ron(1)};
        if(rorder[2]==0 && turn !==1 && Fr2==-1 && ManaBreak==0){ron(2)}
        if(rorder[3]==0 && turn !==2 && Fr3==-1 && ManaBreak==0){ron(3)}
        if(rorder[4]==0 && turn !==3 && Fr4==-1 && ManaBreak==0){ron(4)}
        }
        if(hand1[0]==-2){
          se6.play();
          //cx2.clearRect(630,400,80,40)
          turntemp =turn
          turn=4
          var btn1=createCircleButton("ロン",50);
          btn1.x=320;
          btn1.y=400;
          ponkanmap.addChild(btn1)
          var btn2 = createButton("キャンセル", 90, 40);
          btn2.x = 440;
          btn2.y = 420;
          ponkanmap.addChild(btn2);
          btn1.addEventListener("click", {card:2,handleEvent:TumoronBt});
          btn2.addEventListener("click", {card:-1,handleEvent:TumoronBt});
          cLock=1;
          corsor();
          console.log('操作可',cLock)
        }else if(hand2[0]==-2){
        //ron(2)
        turntemp=turn
        turn=5
        if(pvpmode==1 && MEMBER[1].pc==1){
          console.log('player2 waiting');
        }else{
        cpu(2);
        }
        }else if(hand3[0]==-2){
        //ron(3)
        turntemp=turn
        turn=6
        if(pvpmode==1 && MEMBER[2].pc==1){
          console.log('player3 waiting');
        }else{
        cpu(3);
        }
        }else if(hand4[0]==-2){
        //ron(4)
        turntemp=turn
        turn=7
        if(pvpmode==1 && MEMBER[3].pc==1){
          console.log('player4 waiting');
        }else{
        cpu(4);
        }
        }else{
          //ロン処理
          if(Ronturn.length>0){
            setTimeout(function(){
              TumoRon(Ronturn[0],turn+1);
              Ronturn.shift();
              }, 550);
            return false;
          }
          //次の人のポンへ
          if(turn==0 && ponsw[0]==0 && ManaBreak==0){
          //可能な限りポン->ライン揃えに行く場合はポンしない
          if(Reverse){
            if(!PonKanChecker(4)){return false;}
          }else{
            if(!PonKanChecker(2)){return false;}};
          };
          if(turn==1 && ponsw[0]==0 && ManaBreak==0){
          if(Reverse){
            if(!PonKanChecker(1)){return false;}
            }else{
            if(!PonKanChecker(3)){return false;}};
          }
          if(turn==2 && ponsw[0]==0 && ManaBreak==0){
          if(Reverse){
             if(!PonKanChecker(2)){return false;};
          }else{
            if(!PonKanChecker(4)){return false;}};
          }
          if(turn==3 && ponsw[0]==0 && ManaBreak==0){
          if(Reverse){
            if(!PonKanChecker(3)){return false;}
            }else{
            if(!PonKanChecker(1)){return false;}};
          }
        function PonKanChecker(p){
        //default-> 2-4を想定
        switch(p){
          case 1:
          if(LP[1]<0 || Fr1!==-1 || Flame1!==-1){return true}
            if(Kan(1)){
              //カンができるということはポンもできる
              se5.play();
              turntemp =turn
              turn=4
              ponkanmap.removeAllChildren();
              var btn1 = createButton("カン", 80, 40);
              btn1.x = 710;
              btn1.y = 400;
              ponkanmap.addChild(btn1);
              btn1.addEventListener("click", {card:3,handleEvent:PonKanBt});
              var btn1 = createButton("ポン", 80, 40);
              btn1.x = 630;
              btn1.y = 400;
              ponkanmap.addChild(btn1);
              btn1.addEventListener("click", {card:1,handleEvent:PonKanBt});
              var btn2 = createButton("キャンセル", 90, 40);
              btn2.x = 500;
              btn2.y = 400;
              ponkanmap.addChild(btn2);
              btn2.addEventListener("click", {card:-1,handleEvent:PonKanBt});
              cLock=1;
              corsor();
              console.log('操作可',cLock);
              return false;
            }
            if(Pon(1)){
            se5.play();
            turntemp =turn
            turn=4
            ponkanmap.removeAllChildren();
            var btn1 = createButton("ポン", 80, 40);
            btn1.x = 630;
            btn1.y = 400;
            ponkanmap.addChild(btn1);
            btn1.addEventListener("click", {card:1,handleEvent:PonKanBt});
            var btn2 = createButton("キャンセル", 90, 40);
            btn2.x = 500;
            btn2.y = 400;
            ponkanmap.addChild(btn2);
            btn2.addEventListener("click", {card:-1,handleEvent:PonKanBt});
            cLock=1;
            corsor();
            console.log('操作可',cLock);
            return false;
          }
          break;
          default:
          if(p==2){if(LP[2]<0 || Fr2!==-1 || Flame2!==-1){return true}};
          if(p==3){if(LP[3]<0 || Fr3!==-1 || Flame3!==-1){return true}};
          if(p==4){if(LP[4]<0 || Fr4!==-1 || Flame4!==-1){return true}};
          if(Kan(p)){
            if(pvpmode==1){
                if(MEMBER[p-1].pc==1){
                console.log('player waiting');
                return false;
              }else if(IsHost(IAM.room)){
                var R=Math.random();
                if(R>poncpu[p-1]){
                  Kan(p,tumotemp);
                    socket.emit("nuki", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[p-1].id,pai:tumotemp,status:true});
                return false;
              }else{
                  socket.emit("nuki", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[p-1].id,pai:tumotemp,status:false});
              }}else{
              return false;
              }
            }else{
              var R=Math.random();
              if(R>poncpu[p]){
              Kan(p,tumotemp);
              return false;
            }
          }
          }
            if(Pon(p)){
              if(pvpmode==1){
                if(MEMBER[p-1].pc==1){
                console.log('player waiting');
                return false;
              }else if(IsHost(IAM.room)){
                var R=Math.random();
                if(R>poncpu[p]){
                    socket.emit("pon", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[p-1].id,pai:tumotemp,status:true});
                    Pon(p,tumotemp);
                return false;
              }else{
                  socket.emit("pon", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[p-1].id,pai:tumotemp,status:false});
              if(p==2){ponsw[p]=pon2.length};
              if(p==3){ponsw[p]=pon3.length};
              if(p==4){ponsw[p]=pon4.length};
              }}else{
                return false;
              }
            }else{
              var R=Math.random();
              if(R>poncpu[p]){
              Pon(p,tumotemp);
              return false;
            }else{
              if(p==2){ponsw[p]=pon2.length};
              if(p==3){ponsw[p]=pon3.length};
              if(p==4){ponsw[p]=pon4.length};
            }
          }}
          break;
        }
        console.log('end of ponkanchecker');
        return true;
      };
        //ターンを回す
        if(deck.length <= 0 && ponsw[1]!==1 &&ponsw[2]!==1 && ponsw[3]!==1 && ponsw[4]!==1){
          if(pvpmode==1){
          if(IsHost(IAM.room)){
            socket.emit("ryukyoku", {Token:IAM.token,room:RoomName[IAM.room]});
            ryukyoku();
        };
      }else{
        ryukyoku();
      }
        }else{
        //飛んだ人を飛ばす
        if(ManaBreak>0){
          ManaBreak=0};
        //一般化
        //turn 0 1 2 3 <-> 1 2 3 4
        if(rorder[1]==1 && turn !==1){rorder[1]=0}
        if(rorder[2]==1 && turn !==2){rorder[2]=0}
        if(rorder[3]==1 && turn !==3){rorder[3]=0}
        if(rorder[4]==1 && turn !==4){rorder[4]=0}
        for(var i=0;i<3;i++){
          if(Reverse){turn -=1;}else{turn +=1};
          if(turn>=4){turn=0};
          if(turn<0){turn=3};
          if(debugmode){console.log(turn)};
          var Flame=Buff[turn+1].findIndex(value=>value==5);
          if(Flame>=0){Buff[turn+1].splice(Flame,1)}
          var Freeze=Buff[turn+1].findIndex(value=>value==6);
          var Ended=Buff[turn+1].filter(value=>value==11);
          if(Freeze>=0 || Ended.length>0 || LP[turn+1]<0){
            if(Freeze>=0){Buff[turn+1].splice(Freeze,1)}
            ctl[turn+1]=0;
          }else{
            ctl[turn+1]=0;
            break;
          }
        }
        if(pvpmode==1){
          for(var i=0;i<MEMBER.length;i++){
            MEMBER[i].turnflag=0;
          }
          MEMBER[turn].turnflag=1;
        }

        console.log(turn,Ronturn)
        Buffdraw();
        turnrole();
        }
        }};
      socket.on("throwed-pai", (data)=>{
        if(debugmode){console.log('throwed-pai',data,IAM.mwah);}
        //非送信者なら2行目の内容を更新する
        //"throwed_pai",{Num:1,Player:1,Token:IAM.token,
        //Tumotemp:tumotemp,Reach:reach,Ippatu:ippatu});
        if(IAM.token!== data.Token){
          var I=MEMBER.findIndex(value=>value.token==data.Token);
          nuki[0]=data.Nuki[0];
          ManaBreak=data.mb;
          switch(I){
            case 3:
              hand1=data.Hand.hand2.concat();
              hand2=data.Hand.hand3.concat();
              hand3=data.Hand.hand4.concat();
              hand4=data.Hand.hand1.concat();
              for(var i=1;i<4;i++){
                //reach 0 2 3 4 1
                //Reach 0 1 2 3 4
                reach[i]=data.Reach[i+1];
                DP[i]=data.Dp[i+1];
                ippatu[i]=data.Ippatu[i+1];
                nuki[i]=data.Nuki[i+1];
              }
              reach[4]=data.Reach[1];
              DP[4]=data.Dp[1];
              ippatu[4]=data.Ippatu[1];
              nuki[4]=data.Nuki[1];
              break;
            case 2:
              hand1=data.Hand.hand3.concat();
              hand2=data.Hand.hand4.concat();
              hand3=data.Hand.hand1.concat();
              hand4=data.Hand.hand2.concat();
              for(var i=1;i<3;i++){
                //reach   3 4 1 2
                //Reach 0 1 2 3 4
                reach[i]=data.Reach[i+2];
                reach[i+2]=data.Reach[i];
                DP[i]=data.Dp[i+2];
                DP[i+2]=data.Dp[i];
                nuki[i]=data.Nuki[i+2];
                nuki[i+2]=data.Nuki[i];
                ippatu[i]=data.Ippatu[i+2];
                ippatu[i+2]=data.Ippatu[i];
              }
              break;
            case 1:
              hand1=data.Hand.hand4.concat();
              hand2=data.Hand.hand1.concat();
              hand3=data.Hand.hand2.concat();
              hand4=data.Hand.hand3.concat();
              for(var i=2;i<5;i++){
                //reach   4 1 2 3
                //Reach 0 1 2 3 4
                reach[i]=data.Reach[i-1];
                DP[i]=data.Dp[i-1];
                ippatu[i]=data.Ippatu[i-1];
                nuki[i]=data.Nuki[i-1];
              }
              reach[1]=data.Reach[4];
              DP[1]=data.Dp[4];
              ippatu[1]=data.Ippatu[4];
              nuki[1]=data.Nuki[4];
              break;
            default:
              console.log('member error',I)
                hand1=data.Hand.hand1.concat();
                hand2=data.Hand.hand2.concat();
                hand3=data.Hand.hand3.concat();
                hand4=data.Hand.hand4.concat();
                reach=data.Reach.concat();
                DP=data.Dp.concat();
                ippatu=data.Ippatu.concat();
                nuki=data.Nuki.concat();
                break;
          }
          Reverse=data.R;
        };
        var N=1+MEMBER.findIndex(value=>value.id==data.who)
        tumotemp=data.Tumotemp;
        if(N>4){N-=4};
    //manabreak
    if(ManaBreak>0){
      var Ary=[0,450,150,250,350]
      se12.play();
      ManaAnimation(N,data.Num,Ary[N]);
    }else{
      handgraph(data.Num,N);
    };
  });
  function ManaAnimation(p=0,A=0,B=100){
    var Container = new createjs.Container();
  Container.alpha=0;
  stage.addChild(Container);
  // マスク
  var rect = new createjs.Shape();
    rect.graphics
    .beginFill("#001c0d")
    .drawRect(0, 0, 800, 600);
    Container.addChild(rect);
    var shapeMask = new createjs.Shape();
    shapeMask.graphics
    .beginFill("gold")
    .drawRect(0, 0, 630, 100);
    shapeMask.scaleY=0.1;
    shapeMask.y=B;
    Container.mask = shapeMask;
    if(fool){
    var C = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[p]]));          
    }else{
    var C = new createjs.Bitmap(queue.getResult(chrimg_src[chara[p]]));
    }
    C.x=-480;
    C.y=B-200;
    if(chara[p]==5){C.y+=60};
    if(chara[p]==7){C.x+=100};
    Container.addChild(C);
    if(chara[p]==7){
      createjs.Tween.get(C)
      .to({x:-460},60);
    }else{
      createjs.Tween.get(C)
      .to({x:-560},60);
    }
    MBicon.x=160;
    MBicon.y=B-50;
    Container.addChild(MBicon);
    createjs.Tween.get(Container)
    .to({alpha: 1},60)
    .wait(700)
    .to({alpha: 0},100)
    .call(next);
    createjs.Tween.get(shapeMask)
    .to({y:B-50,scaleY: 1},60);
    function next(){
      Container.removeAllChildren();
      stage.removeChild(Container);
      if(pvpmode==1){
        handgraph(A,p);
        }else{
        handgraph(1,1);
        }
    }
  }
  function handgraph(num,player,op=0){
    //捨てパイ・手札の描画
    //op 1→一番右の手パイをずらして描きたい時
    if(debugmode){console.log('handgraph',num,player,tumotemp)};
      if(num>0){
      //e5を使って捨て牌の描写してアガリ判定後ターンを進める
      Tumoname();
      //アラ裁定　演出あればhandgraphやり直し
      if(chara[player]==7 && skillswitch[0] !==-2 && skillswitch[player]!==2){
        var MS=0;
        if(trash[player-1].length>=3){
          for(var i=0;i<3;i++){
            var M=trash[player-1][trash[player-1].length-3+i];
            if(M>=0 && M<=67 && M%4 == i){
              MS+=1;
            }
          }
        if(MS==3 && tumotemp%4==3){
          skillswitch[player]=0;
          SkillAnimation(player,0,1,1);
          return false;
        }}
      }
      if(dahaiSE==1){
        se4.play()
      }else{
      se16.play();
      }
      if(nuki[0]>0){
        nuki[0]=0;
        //ドラを1枚追加
        dora.push(king.splice(0,1));
        dorax+=40;
        e7 = new createjs.Bitmap(eltear_src[dora[dora.length-1]]);
        e7.x=dorax;
        e7.y=10;
        e7.scale=33/120;
        field.addChild(e7);
      };
      if(ManaBreak==0 || player==1){
      trash[player-1].push(tumotemp);
      }else{
      trash[player-1].push(-1);
      }
      if(player==1){Elname(tumotemp)};
      e5= new createjs.Bitmap(queue.getResult(eltear_src[tumotemp]));
      if(counter[player]==28){
      rivery[player] +=50
      riverx[player] =110
      }
      if(counter[player]==14){
      rivery[player] +=50
      riverx[player] =110
      }
      if(chara[player]==4 && skillswitch[0] !==-2){
        if((tumotemp>=0 && tumotemp<=3)||(tumotemp>=12 && tumotemp<=15)||tumotemp==64){
          var MS=Buff[player].filter(value=>value==4)
          if(MS.length<3){Buff[player].push(4)}
        };
        }
      if(chara[player]==3 && skillswitch[0] !==-2){
        if((tumotemp>=8 && tumotemp<=11)||(tumotemp>=40 && tumotemp<=43)||tumotemp==66){
          var MS=Buff[player].filter(value=>value==3)
          if(MS.length<3){Buff[player].push(3)}
        };
        }
      if(chara[player]==2 && skillswitch[0] !==-2){
        if((tumotemp>=4 && tumotemp<=7)||(tumotemp>=20 && tumotemp<=23)||tumotemp==61){
          var MS=Buff[player].filter(value=>value==2)
          if(MS.length<5){Buff[player].push(2)}
        };
        }
      if(ippatu[player]==1){//守備表示
      counterR[player]=counter[player];
      riverx[player] +=43.5
      e5.rotation=90;
      e5.x=riverx[player]+33;
      e5.y=rivery[player]+5;
      e5.scale=33/120;
      field.addChild(e5);
      if(ManaBreak==1){
        var s = new createjs.Shape();
        if(player==1){
          s.graphics.beginFill("rgba(20,20,20,0.5)");
        }else{
          s.graphics.beginFill("#111a5e");
          Extrash.push(tumotemp);
        }
        s.graphics.drawRect(0, 0, 33, 43.5);
        s.rotation=90;
        s.x=riverx[player]+33;
        s.y=rivery[player]+5;
        field.addChild(s);
        var t = new createjs.Text("X", "bold 26px 'Century Gothic'", "darkred");
        t.rotation=90;
        t.x=riverx[player]+28;
        t.y=rivery[player]+10;
        field.addChild(t);
      }
      counter[player] +=1;
      if(player==parent){DP[player] +=mpVelocity*1.2}else{DP[player] +=mpVelocity};
      if(DP[player]>30){DP[player]=30}
      drawDP(player);
      if(chara[player]==1 && skillswitch[0] !==-2){Buff[player].push(1)};
        se9.play();
        if(auras==0 && musicnum!==Math.abs(musicset[1])){
          musicnum=Math.abs(musicset[1]);
          musicStart(musicnum);
        };
        //ラシェ
        if(skillswitch[0] !==-2 && skillusage[player]==0 && chara[player]==6){
          var N=LP.filter(value=>value>=0);
          if(DP[player]==30 && deck.length>=N.length){
          //デッキトップから生存メンバーの数だけ手前の部分のデッキに当たりパイを挿入する
          console.log('変身');
          DP[player]=0
          drawDP(player);
          skillusage[player]=1;
          skillswitch[player]=0;
          var Wait=Reachwait(-1,player);
          if(Wait.length>=2){
            var M=Wait[1+Math.floor(Math.random()*(Wait.length-1))]
            deck.splice(N.length-2,1,M);
          }};
          }
        //イヴ様
        for(var i=1;i<5;i++){
          if(skillswitch[0] !==-2 && i!==player && chara[i]==5 && skillusage[i]==0){
            skillusage[i]=player;
          }
        }
        //姉
        if(skillswitch[0] !==-2 && skillusage[player]==0 && chara[player]==8){
          if(DP[player]>=20){
          DP[player]-=20
          drawDP(player);
          skillusage[player]=1;
          skillswitch[player]=0;
          skillusage2[player]+=1;
          };
        }
        ReachAnimation(player);
    }else{//通常
      riverx[player] +=33
      e5.x=riverx[player];
      e5.y=rivery[player];
      e5.scale=33/120;
      field.addChild(e5);
      var s = new createjs.Shape();
      if(ManaBreak==1){
      if(player==1){
        s.graphics.beginFill("rgba(20,20,20,0.5)");
      }else{
        s.graphics.beginFill("#111a5e");
        Extrash.push(tumotemp);
      }
      s.graphics.drawRect(riverx[player], rivery[player], 33, 43.5);
      field.addChild(s);
      var t = new createjs.Text("X", "bold 26px 'Century Gothic'", "darkred");
      t.x=riverx[player]+5;
      t.y=rivery[player]+5;
      field.addChild(t);
          }
      counter[player] +=1
      if(player==parent){DP[player] +=mpVelocity*1.2}else{DP[player] +=mpVelocity};
      if(DP[player]>30){DP[player]=30}
      drawDP(player);
      turnchecker();
      }
      };
      if(num ==0){
      reachhand=[];
      var ponnum=pon1.length;
      reachhand=hand1.concat(pon1);
      var H=reachhand.findIndex(value=>value==100);
      if(H !==-1){
      reachhand.splice(H,1)
      }
      console.log(reachhand,ponnum)
      //鳴いたパイは書き直さない
      if(handlist.length){
        for (var i=0;i<handlist.length;i++){
          field.removeChild(handlist[i]);
        }
      }
      handlist=[];//左から順にパイの画像idが入る
      //handmap.removeAllChildren();
      for(var h=1;h<hand1.length;h++){
      e1= new createjs.Bitmap(queue.getResult(eltear_src[hand1[h]]));
        if(op==1 && h==hand1.length-1){
          e1.x=690;
          e1.y=500;
          e1.addEventListener("mouseover", {card:100,handleEvent:handOnCorsor});
          e1.addEventListener("mouseout", {card:-1,handleEvent:handOnCorsor});
        }else{
          e1.x=100+size*(h-1);
          e1.y=500;
          e1.addEventListener("mouseover", {card:h,handleEvent:handOnCorsor});
          e1.addEventListener("mouseout", {card:-1,handleEvent:handOnCorsor});
        }
        e1.addEventListener("click", {card:h,handleEvent:paiCut});
        e1.scale=7/12;
        field.addChild(e1);
        handlist.push(e1);
      }
      }
      if(num ==-1){//最初だけ
        //e1~e4を使って自分の手札を描画
        console.log(hand1);
        if(handlist.length){
          for (var i=0;i<handlist.length;i++){
            field.removeChild(handlist[i]);
          }
        }
        handlist=[];//左から順にパイの画像idが入る
        //handmap.removeAllChildren();
        for(var h=1;h<10;h++){
        e1= new createjs.Bitmap(queue.getResult(eltear_src[hand1[h]]));
        e1.alpha=0;
        e1.x=100+size*(h-1);
        e1.y=500;
        e1.scale=7/12;
        field.addChild(e1);
        handlist.push(e1);
        e1.addEventListener("mouseover", {card:h,handleEvent:handOnCorsor});
        e1.addEventListener("mouseout", {card:-1,handleEvent:handOnCorsor});
        e1.addEventListener("click", {card:h,handleEvent:paiCut});
        }
          se11.play();
          //時間ラグを付ける
          setTimeout(
            ()=>{
            if(dahaiSE==1){
              se4.play()
            }else{
            se16.play();
            }
            handlist[0].alpha=1;
            handlist[1].alpha=1;
            handlist[2].alpha=1;
            },200)
        setTimeout(
          ()=>{
          if(dahaiSE==1){
            se4.play()
          }else{
          se16.play();
          }
          handlist[3].alpha=1;
          handlist[4].alpha=1;
          handlist[5].alpha=1;
          },400)
        setTimeout(
          ()=>{
          if(dahaiSE==1){
            se4.play()
          }else{
          se16.play();
          }
          handlist[6].alpha=1;
          handlist[7].alpha=1;
        },800)
      setTimeout(
        ()=>{
      turnrole();
      },1000)
        }
      }
  function Setup(pvp=0){
    //デュエル開始の宣言をする pvp時1に
    if(pvp==0){
      pvpmode=0;
      se1.play();
    }else{
      field.removeAllChildren();
      textmap.alpha=0;
      musicnum=-1;
      if(pvpmode!==1){
        pvpmode=1;
        se1.play();
      }};
    console.log('Setup',pvp);//socketで飛ばすとなんか3回くらい呼び出される
    navisw=0;
    DP=new Array(0,0,0,0,0);
    if(debugmode){DP[1]=20;DP[2]=20;DP[3]=20;DP[4]=20};
    skillusage2=new Array(0,-1,-1,-1,-1,0)
    death=[
      {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
      {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
      {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
      {kill:0,assist:0,death:0,Admg:[0,0,0,0],Bdmg:[0,0,0,0]},
    ];
    scoretemp=[0,0,0,0,0,0]
    achievetemp=[];
    for(var i=0 ; i<achievetempB.length; i++){
      achievetempB[i].count=0;
    }
    if(pvp==0){parent= Math.floor(Math.random()*4);
    switch(LP[0]){
      case 0:
        for(var i=1;i<LP.length;i++){LP[i]=150000}
        break;
      case 1:
        for(var i=1;i<LP.length;i++){LP[i]=300000}
        mode=1;
        break;
      case 2:
        for(var i=1;i<LP.length;i++){LP[i]=75000}
        mode=1;
        break;
      case 4:
        for(var i=1;i<LP.length;i++){LP[i]=150000}
        break;
      default:
        mode=1;
      }
    }
    if(pvp==1){
      if(LP_PVP.Rule[0]==3){
        LP[0]=4;
      }else if(LP_PVP.Rule[0]==2){
        LP[0]=2;
      }else{
        LP[0]=0;
      };
      switch(LP_PVP.LP[0]){
        case 1:
          for(var i=1;i<LP.length;i++){LP[i]=75000}
          break;
        case 2:
          for(var i=1;i<LP.length;i++){LP[i]=150000}
          break;
        case 3:
          for(var i=1;i<LP.length;i++){LP[i]=300000}
          break;
        }
      if(LP_PVP.Block[0]==2){mode=1;}else{mode=0};
      if(LP_PVP.Skill[0]==1){skillswitch[0]=-2}else{skillswitch[0]=-1};
      }
      if(pvp==1 && !IsHost(IAM.room)){return false};
      if(pvp==1 && IsHost(IAM.room)){
        parent= Math.floor(Math.random()*4);
        MEMBER=[];
        //メンバーに追加
        for(var i=0; i<memberlist.length; i++){
          chara[i+1]=memberlist[i].chr
          MEMBER.push({id:memberlist[i].id,token:memberlist[i].token,name:memberlist[i].name,chr:memberlist[i].chr,score:LP[i+1],turnflag:0,pc:1});
        };
        //CPUを追加
        var A=MEMBER.length;
        if(A<4){
        for(var i=A; i<4; i++){
          var R=Math.floor(Math.random()*(1+HiddenChara))
        //chara[i]=R;
        chara[i+1]=i;
            MEMBER.push({id:MEMBER.length,token:0,name:"CPU"+i,chr:chara[i+1],score:LP[i+1],turnflag:0,pc:0});
          };
        }
        function shuffleM(){
          for(var i =MEMBER.length-1; i>1 ; i--){
          var r =1+Math.floor(Math.random()*(i));
          var temp = MEMBER[i];
          MEMBER[i] = MEMBER[r]
          MEMBER[r] = temp
        }};
        shuffleM();
        MEMBER[parent].turnflag=1;
        console.log(MEMBER);
        socket.emit("setup_member", {member:MEMBER,room:RoomName[IAM.room]});
      return true;
      };
    if(chara[0]==0){
      for(var i=2;i<chara.length;i++){
        var R=Math.floor(Math.random()*(1+HiddenChara))
        chara[i]=R;
      }
    }
    gamestate =1
    console.log('setup',timevalue)
    opening();
    //deckHandler();
    };
    socket.on("member",(data)=>{
      //メンバーをコピー
      if(!IsHost(IAM.room)){
        //console.log(data);
      Setup(1);
      //グローバルリストをこのプレイヤーが0番目になるようにメンバーに貼りつけ
      console.log(data);
      var chrtemp=[];
      chrtemp=data.concat(data);
      var A=data.findIndex(value=>value.token==IAM.token);
      IAM.mwah=A;
      if(IAM.mwah==-1){
        console.log('mwah error!');
        IAM.mwah=0;
      }
      chrtemp=chrtemp.splice(A,4);
      MEMBER=chrtemp.concat();
      }
      for(var i=1;i<5 ; i++){
      chara[i]=MEMBER[i-1].chr;
      }
      console.log(chara);
      parent=MEMBER.findIndex(value=>value.turnflag==1);
      gamestate =1
    //if(IsHost(IAM.room)){
      console.log('setup for pvp')
      opening();
      //deckHandler();
    });
    socket.on("deck-handler", (data)=>{
      if(!IsHost(IAM.room)){
        console.log('setup for pvp')
        //ホストが決めたデッキ・手札をコピー
        //socket.emit("deck_handler",{Deck:deck,Hand:{hand1,hand2,hand3,hand4},King:king} );
        console.log(data);
      deck=data.Deck.concat();
      king=data.King.concat();
      var I=IAM.mwah;
      console.log(I)
      hand1=[]
      hand2=[]
      hand3=[]
      hand4=[]
      switch(I){
        case 0:
          hand1=data.Hand.hand1.concat();
          hand2=data.Hand.hand2.concat();
          hand3=data.Hand.hand3.concat();
          hand4=data.Hand.hand4.concat();
          break;
        case 1:
          hand1=data.Hand.hand2.concat();
          hand2=data.Hand.hand3.concat();
          hand3=data.Hand.hand4.concat();
          hand4=data.Hand.hand1.concat();
          break;
        case 2:
          hand1=data.Hand.hand3.concat();
          hand2=data.Hand.hand4.concat();
          hand3=data.Hand.hand1.concat();
          hand4=data.Hand.hand2.concat();
          break;
        case 3:
          hand1=data.Hand.hand4.concat();
          hand2=data.Hand.hand1.concat();
          hand3=data.Hand.hand2.concat();
          hand4=data.Hand.hand3.concat();
          break;
      }
      mpVelocity=data.MPV;
      Ponrate=data.PON;
      Fever=data.FEV
      if(debugmode){
      console.log(king);//嶺上牌
      console.log(hand1);//自分の手札
      console.log(hand2);
      console.log(hand3);
      console.log(hand4);
      }
      //opening();
      deckHandler();
      }
        })
  
  function PlayertoCpu(num){
    console.log('player to cpu',cLock,reach)
    //ノーテンリーチ禁止
  if(reach[1]==2 && reach[0]==1){
    return false;
  }
  if(cLock==3){
    if(chara[1]==2){SkillAnimation(1,num)};
    return false;
  };
  if(mpC>=10){
    //マナブレイク
    DP[1]-=mpC;
    drawDP(1);
    ManaBreak=Math.floor(mpC/10);
  }
  DPlist[0].scaleX=0;
  DPlist[0].x=50;
  cLock=0;
  console.log('操作禁止',cLock);
  //切った後の整列描画と自分の捨て牌リスト
  if(ponsw[1]==1){ponsw[1]=pon1.length;}
  tumotemp=hand1[num]
  hand1[num]=hand1[hand1.length-1]
  hand1[hand1.length-1]=100
  if(debugmode){console.log(tumotemp,hand1.length-1,hand1[num],hand1[hand1.length-1])};
  if(turn ==0 && ctl[1]==0){
  if(ippatu[1]==1){ippatu[1]=2}
  if(reach[1] ==2){
  cx1.font = "bold 16px 'Century Gothic'";
  cx1.fillStyle = "orange";
  cx1.fillText("リーチ",640,465)
  ippatu[1]=1;
  reach[1]=3;
  }
  }
  if(handsort==0){
  hand1.sort(compareFunc);
  }else{
    var Hlast=hand1.pop();
    hand1.sort(compareFunc3) 
    hand1=hand1.concat(Hlast)
  }
  if(Reverse){ctl[4]=0;}else{ctl[2]=0;}
  handgraph(0,1)  
  //ボタンとカーソルを消す
  cx2.clearRect(630,440,160,80)
  ponkanmap.removeAllChildren();
  if(hand1[0] ==-3){
    hand1[0]=-1}
  if(reach[1] ==0 || reach[1] ==1){
  reach[1]=0;
  }
  if(nukiswitch[1]>0){
    nukiswitch[1]=0;
  }
  if(chara[1]!==0){
    //スキル欄
  }
  if(pvpmode==1){
    //必要な情報をポイする
    socket.emit("throwed_pai",{Num:1,Player:1,who:MEMBER[0].id,Token:IAM.token,room:RoomName[IAM.room],Tumotemp:tumotemp,Reach:reach,Ippatu:ippatu,Nuki:nuki,Dp:DP,mb:ManaBreak,Hand:{hand1,hand2,hand3,hand4},R:Reverse});
  }else{
        //manabreak
        if(ManaBreak>0){
          se12.play();
          ManaAnimation(1,0,450);
        }else{
            handgraph(1,1);
        };
  }
  };
  function Tumoname(){
    var type1=donpai.findIndex(value=>value.id==tumotemp)
    if(type1==-1){
      console.log('Donpai error!')
      return false;
    }
    tumonameA.text=donpai[type1].name;
    tumonameB.text=donpai[type1].sub;
    }    
    function turnrole(){
      console.log('turnrole',pvpmode,turn)
      //pvpmode==1の時はタイマーを使わない
      if(pvpmode==1){
        var P=MEMBER.findIndex(value=>value.turnflag==1);
        console.log(ctl,P);
        if(P==-1){
          console.log('flag error!')
          P=0;
        }
        turn=P;
        console.log(P,IAM.mwah,turn);
        ponsw[0]=0;
        tweeNsquare.paused=false;
      switch(turn){ 
        case 0:
          player1();
          Csquare.y=400;
          break;
        case 1:
        case 2:
        case 3:
          Csquare.y=100*turn;
          if(MEMBER[turn].pc==0 && IsHost(IAM.room)){
            if(Reverse){
              if(turn==0){ctl[4]=0}else{ctl[turn-1]=0};
            }else{
              ctl[turn+1]=0;};
            var Cpu =setTimeout(function(){
              cpu(turn+1);
              if(ctl[turn+1]>=1){clearTimeout(Cpu)};
              }, 250);
          }
          break;
      };
        return false;
      }
      ponsw[0]=0;
      tweeNsquare.paused=false;
      Csquare.y=100*turn;
      switch(turn){
        case 0:
          Csquare.y=400;
          var Player1 =setInterval(function(){
            player1();
            if(ctl[1]>0){
            clearInterval(Player1);
            }
            }, 340);
          break;
        case 1:
          var Cpu2 =setTimeout(function(){
            cpu(2);
            if(ctl[2]>=1){clearTimeout(Cpu2)};
            }, 250);
          break;
        case 2:
          var Cpu3 =setTimeout(function(){
            cpu(3);
            if(ctl[3]>=1){clearTimeout(Cpu3)};
            }, 250);
          break;
        case 3:
          var Cpu4 =setTimeout(function(){
            cpu(4);
            if(ctl[4]>=1){clearTimeout(Cpu4)};
            }, 250);
          break;
      }
      }
    function player1(){
    if(ponsw[1]==1){
      //疲れたのでポン後は別の場所にしますわ
      judge(1);
      ponkanmap.removeAllChildren();
      //リーチ判定だけ
      if(deck.length==0 && reach[1]!==3){reach[1]=0};
      if(reach[1] ==1){
        se5.play();
        var btn1 = createButton("リーチ", 80, 40);
          btn1.x = 630;
          btn1.y = 440;
          ponkanmap.addChild(btn1);
          btn1.addEventListener("click",{card:0,handleEvent:ReachBt});
      }
      if(chara[1] !==0 && skillswitch[1]==0 && skillswitch[0] !==-2){
        var btn1 = createButton("スキル", 80, 40);
          btn1.x = 710;
          btn1.y = 440;
          ponkanmap.addChild(btn1);
          btn1.addEventListener("click",{card:0,handleEvent:SkillBt});
      }
      setTimeout(()=>{
        cLock=1;
        console.log('操作可',cLock)
        },100)
    if(reach[1] ==0){cx2.clearRect(630,440,80,40)}
    }else{
    //山から1枚引いてくる nuki>0の場合はデッキ外からランダムにドロー
    if(nuki[0]>0){
      if(chara[1]==7 && skillswitch[0] !==-2 && DP[1]>10){
        //アラ裁定
        DP[1]-=10;
        drawDP(1);
        if(reach[1]==3){
        var Wait=Reachwait(-1,1);
        if(Wait.length>=2){
          tumo=Wait[1+Math.floor(Math.random()*(Wait.length-1))]
          }else{
          tumo=Math.floor(Math.random()*60);            
          }
        }else{
          tumo=dora[Math.floor(Math.random()*(dora.length-1))]
        }
      }else{
      tumo=Math.floor(Math.random()*60);
      }
    }else{
    if(deck.length<=0){
        console.log('deckerror');
        if(pvpmode==1){
          //error？
          socket.emit("ryukyoku", {Token:IAM.token,room:RoomName[IAM.room]});
        };    
      ryukyoku();
      return false;
    }else{
      tumo =deck.shift();
      if(pvpmode==1){
        socket.emit("deck_length",{Token:IAM.token,room:RoomName[IAM.room],Deck:deck});
      }
    decklength();
    }
  }
    ctl[1]=1
    var PE=hand1.findIndex(value=>value==100);
    hand1[PE]=tumo;
    drawcard= new createjs.Bitmap(queue.getResult(eltear_src[tumo]));
    drawcard.alpha=0;
    drawcard.x=690;
    drawcard.y=470;
    drawcard.scale=7/12;
    field.addChild(drawcard);
    handlist.push(drawcard);
    createjs.Tween.get(drawcard)
      .to({alpha: 1,y:500},300)
      .call(drawstep);
  function drawstep(){
    drawcard.addEventListener("mouseover", {card:100,handleEvent:handOnCorsor});
    drawcard.addEventListener("mouseout", {card:-1,handleEvent:handOnCorsor});
    drawcard.addEventListener("click", {card:hand1.length-1,handleEvent:paiCut});
    ponkanmap.removeAllChildren();
    if(reach[1] <3){
      if(skillusage[1]>0 && chara[1]==5){
      yoti(skillusage[1]);
      }
      //スキル
      //cLock !==3
      if(debugmode){console.log(skillswitch[1]);};
      if(skillswitch[1]==1){
        switch(chara[1]){
          case 1:
          case 9:
        if(DP[1]>=10){
          skillswitch[1]=0       
        }
          break;
          case 2:
        if(skillusage2[1]==-1 && DP[1]>=10){
          skillswitch[1]=0       
        }else if(skillusage2[1]>-1){
          skillswitch[1]=0;
        }
          break;
          case 3:
        if(DP[1]>=20){
          skillswitch[1]=0;    
        }
        case 4:
          if(DP[1]>=30){
            skillswitch[1]=0       
          }
          break;
        case 8:
        if(DP[1]>=20 && reach[1] ==1){
          skillswitch[1]=0       
        }
          break;
        default:
          break;
      }
      }
    if(chara[1] !==0 && skillswitch[1]==0 && skillswitch[0] !==-2){
      var btn1 = createButton("スキル", 80, 40);
      btn1.x = 710;
      btn1.y = 440;
      ponkanmap.addChild(btn1);
      btn1.addEventListener("click",{card:0,handleEvent:SkillBt});
    }
    }
    if(judge(1)){hand1[0]=-3};
    if(deck.length==0 && reach[1]!==3){reach[1]=0};
    if(reach[1] ==1){
      if(nukiswitch[1]!==1){se5.play()};//SE同時に鳴らないように
      var btn1 = createButton("リーチ", 80, 40);
      btn1.x = 630;
      btn1.y = 440;
      ponkanmap.addChild(btn1);
      btn1.addEventListener("click",{card:0,handleEvent:ReachBt});
      };
    if(Kan(1,-2)){
      se5.play()
      nukiswitch[1]=1;//嶺上開花判定に使用
      var btn1 = createButton("カン", 80, 40);
      btn1.x = 710;
      btn1.y = 400;
      ponkanmap.addChild(btn1);
      btn1.addEventListener("click",{card:2,handleEvent:PonKanBt});
    }
    if(hand1[0]==-3){
      se6.play();
      var btn1=createCircleButton("ツモ",50);
      btn1.x=320;
      btn1.y=400;
      ponkanmap.addChild(btn1)
      btn1.addEventListener("click", {card:1,handleEvent:TumoronBt});
    };
    setTimeout(()=>{
      cLock=1;
      console.log('操作可',cLock)
      if(debugmode){console.log(hand1)};
      },100)
    }
    }
  };
    function cpu(chr,timer=0){//expected chr=2,3,4
          console.log('cpu',chr,ctl,timer);
          timer+=1;
          var cturn=chr -1
          if(turn !==cturn){
            switch(chr){
              case 2:
                if(hand2[0]==-2){//cpu2
                  Ronturn.push(2);
                  rorder[chr]=1;turn=turntemp;hand2[0]=-1;
                  turnchecker();//他にロンする人がいないかチェックへ
                };
                break;
              case 3:
                if(hand3[0]==-2){//cpu2
                  Ronturn.push(3);
                  rorder[chr]=1;turn=turntemp;hand3[0]=-1;
                  turnchecker();//他にロンする人がいないかチェックへ
                };
                break;
              case 4:
                if(hand4[0]==-2){//cpu2
                  Ronturn.push(4);
                  rorder[chr]=1;turn=turntemp;hand4[0]=-1;
                  turnchecker();//他にロンする人がいないかチェックへ
                };
                break;
            }
          }
          if(turn ==cturn){//cpuの自分ターン
          if(ctl[chr] ==0){
          ctl[chr]=1//*
          if(deck.length<=0){
            console.log('deck.error!');
            if(pvpmode==1 && IsHost(IAM.room)){
              socket.emit("ryukyoku", {Token:IAM.token,room:RoomName[IAM.room]});
          };    
            ryukyoku();
          }else{
          //モつ
          switch(chr){
            case 2:
              Cpuhandtemp=hand2.concat();
              handtemp=Cpuhandtemp.concat(pon2)
              break;
            case 3:
              Cpuhandtemp=hand3.concat();
              handtemp=Cpuhandtemp.concat(pon3)
              break;
            case 4:
              Cpuhandtemp=hand4.concat();
              handtemp=Cpuhandtemp.concat(pon4)
              break;
          }
          //cpuponここから
          if(ponsw[chr]!==1){
            if(nuki[0]>0){
              tumo2=Math.floor(Math.random()*60);
            }else{
              tumo2=deck.shift();
            }
          var PEP=handtemp.findIndex(value=>value==100);
          handtemp[PEP]=tumo2
          Cpuhandtemp[PEP]=tumo2
        }}
        if(pvpmode==1){
          socket.emit("deck_length",{Token:IAM.token,room:RoomName[IAM.room],Deck:deck});
        }
          decklength();
          if(skillswitch[chr]==1 && skillswitch[0] !==-2){
            switch(chara[chr]){
              case 1:
            if(DP[chr]>=10){
              skillswitch[chr]=0       
            }
              break;
              case 2:
            if(skillusage2[chr]==-1 && DP[chr]>=10){
              skillswitch[chr]=0       
            }else if(skillusage2[chr]>-1){
              skillswitch[chr]=0;
            }
              break;
              case 3:
            if(DP[chr]>=20){
              skillswitch[chr]=0;    
            }
              break;
              default:
              break;
            }
  
          }
      }
      if(ctl[chr] ==1){
          var PP=handtemp.findIndex(value=>value==100);
          if(PP!==-1){
            console.log(PP);
            var PEP=handtemp.findIndex(value=>value==100);
            handtemp[PEP]=tumo2
            Cpuhandtemp[PEP]=tumo2
          console.log('waitcpu',chr,ctl[chr],turn,ctlerror);
          setTimeout(()=>{
            cpu(chr,timer);
            },100)
            return false;
          }
          if(judge(chr)){
            Cpuhandtemp[0]=-3;
          };
          if(Cpuhandtemp[0]==-3){
          if(reach[chr]==3 || deck.length==0 || counter[chr]==0){
          console.log('cp',chr,'ツモ',han[chr])
          ctl[chr]=2
          if(ippatu[chr]==1 && chara[chr]==6 && skillusage[chr]==1){
            SkillAnimation(chr,tumo2,1);
          }else{
            TumoRon(chr,0);
            if(pvpmode==1){
              socket.emit("tumo", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[chr-1].id,Tumo:tumo2,status:true});
              }
          }
          return false;
          }}
          if(Cpuhandtemp[0]==-1){
            if(ippatu[chr]==1){ippatu[chr]=2}
            }
            ctl[chr]=2
            cpu(chr,timer);
            }else if(ctl[chr]==2){
            cpuplay(chr,timer);
            }
     }};
  
     function cpuskill(chr){
      console.log(chr,reach,skillswitch[0])
      if(skillswitch[0] !==0){return false};
      if(reach[chr]==1 && skillswitch[chr]==0){//スキルを使用するかここで決める
        switch(chara[chr]){
          case 1://エ
                    //ponしてればLP25000加算 リーチで50000加算 LPでヘイト
                    var LPrank=[
                      {chara:1, elia:LP[1], pon:ponsw[1], reach:reach[1]},
                      {chara:2, elia:LP[2], pon:ponsw[2], reach:reach[2]},
                      {chara:3, elia:LP[3], pon:ponsw[3], reach:reach[3]},
                      {chara:4, elia:LP[4], pon:ponsw[4], reach:reach[4]},
                        ]
                        for(var i=0;i<4;i++){
                          if(LPrank[i].reach==3){LPrank[i].elia+=50000};
                          LPrank[i].elia+=25000*(LPrank[i].pon/3);
                        }
                        LPrank.sort(compareFunc2);
            if(LPrank[3].chara ==chr){
              SkillAnimation(chr,LPrank[2].chara);
              }else{
              SkillAnimation(chr,LPrank[3].chara);
              }
              return true;
            break;
          case 2:
            //ア//メモライズ
            console.log(skillusage2[chr],r4);
        if(skillusage2[chr]>-1){
          SkillAnimation(chr,r4);
          return true;
      }else if((Cpuhandtemp[r4]>=4 && Cpuhandtemp[r4]<=7)||(Cpuhandtemp[r4]>=20 && Cpuhandtemp[r4]<=23)){
        SkillAnimation(chr,r4);
        return true;
      }else{
        return false;
      }
            break;
          case 3:
            //LPでヘイト リーチで50000加算
            var LPrank=[
              {chara:1, elia:LP[1], reach:reach[1]},
              {chara:2, elia:LP[2], reach:reach[2]},
              {chara:3, elia:LP[3], reach:reach[3]},
              {chara:4, elia:LP[4], reach:reach[4]},
                ]
                for(var i=0;i<4;i++){
                  if(LPrank[i].reach==3){LPrank[i].elia+=50000};
                }
              LPrank.sort(compareFunc2);
              if(LPrank[3].chara ==chr){
              SkillAnimation(chr,1);
              }else{
              SkillAnimation(chr,LPrank[3].chara);
              }
            return true;
            break;
          default:
            return false;
            break;
        }
      }else{return false};
    }
    function cpuplay(chr,timer=0){
    //思考ルーチンに従い牌をきる
    console.log('cpuplay',chr,ctl[chr])
    if(ctl[chr] ==2){
      r4=-1;
      ctl[chr]=3;
      if(reach[chr]==3){r4=Cpuhandtemp.length-1}else{
        Cpuhandtemp.sort(compareFunc);//これいるのか分からんが
        r4 =Cputumo(chr);//時間がかかるとしたらcputumoのこの部分
      }
    }
    if(ctl[chr]==3 && gamestate ==1){
      if(r4==-1){
      console.log('waitcpu play',chr,ctl[chr]);
      setTimeout(()=>{
        cpuplay(chr,timer);
        },100)
        return false;
      }else{
      if(!cpuskill(chr)){
        ctl[chr]=4;
      };
        }
      }
      if(ctl[chr]==4){
        //切る
        console.log('cpuplay',r4,Cpuhandtemp[r4])
        if(reach[chr]==2 && ippatu[chr]==0){
          if(deck.length==0){reach[chr]=0}else{
          reach[chr]=3;
          ippatu[chr]=1}}
          tumotemp=Cpuhandtemp[r4]
          Cpuhandtemp[r4]=100;
          Cpuhandtemp.sort(compareFunc);
        if(chr==2){
          hand2=Cpuhandtemp.concat();
        if(ponsw[chr]==1){ponsw[chr]=pon2.length;}
        if(!Reverse){ctl[3]=0;}
        }else if(chr==3){
          hand3=Cpuhandtemp.concat();
        if(ponsw[chr]==1){ponsw[chr]=pon3.length;}
        if(Reverse){ctl[2]=0;}else{ctl[4]=0;}
        }else if(chr==4){
          hand4=Cpuhandtemp.concat();
          if(ponsw[chr]==1){ponsw[chr]=pon4.length;}
        if(Reverse){ctl[3]=0;}
        }
        if(pvpmode==1){
          //必要な情報をポイする
          socket.emit("throwed_pai",{Num:r4,Player:chr,who:MEMBER[chr-1].id,Token:IAM.token,room:RoomName[IAM.room],Tumotemp:tumotemp,Reach:reach,Ippatu:ippatu,Nuki:nuki,Dp:DP,mb:ManaBreak,Hand:{hand1,hand2,hand3,hand4},R:Reverse});
        }else{
        handgraph(r4,chr)
        }
      }
    };
    function Cputumo(player,type=0){
    //type：未使用
    startTime = Date.now()
    reach[player]=1;
    //敵の思考ルーチン
    var cputumo =Cpuhandtemp.length-1;//何番目を切るのかを返す
    //まずリーチできる場合
    var Count={};
    var Line={};
    var Color={};
    var end=0;
    for(var i=1; i<handtemp.length;i++){
      var C=donpai.findIndex(value=>value.id==handtemp[i])
      console.log(C,handtemp[i]);
      var elm=donpai[C].name;
      var elm2=donpai[C].line
      var elm3=donpai[C].color;
      Count[elm]=(Count[elm] || 0)+1
      Line[elm2]=(Line[elm2] || 0)+1
      Color[elm3]=(Color[elm3] || 0)+1
    }
    var keyj=Object.keys(Count);
    var keyj2=Object.keys(Line);
    var keyj3=Object.keys(Color);
    var reachj=0;//同じキャラ2枚をカウント
    var tumoj=0;//同じキャラ3枚をカウント
    var kanj=0;//同じキャラ4枚をカウント
    for(var j=0;j<keyj.length;j++){
      //console.log(Count[keyj[j]]);
      if(Count[keyj[j]]==2){
        reachj+=1;
      }
      if(Count[keyj[j]]==3){
        tumoj+=1;
      }
      if(Count[keyj[j]]==4){
        kanj+=1;
      }
    }
    var ponN=0;
    switch(player){
      case 2:
        ponN=pon2.length+kan2.length;
      break;
      case 3:
        ponN=pon3.length+kan3.length;
      break;
      case 4:
        ponN=pon4.length+kan4.length;
      break;
    }
          //ラインチェック
        if(ponN==0){
          switch(Line["0"]){
            case 2:
            case 1:
              if(keyj2.length==2){
                console.log('line tumo')
                  //if(reach[player]==1){reach[player]=2};
                  cputumo=1+Math.floor(Math.random()*9);
                  end=1;
              }
              if(keyj2.length==3){
                if(Line["1"]==1 || Line["2"]==1 || Line["3"]==1 || Line["4"]==1){
                  console.log('line reach')
                  //if(reach[player]==1){reach[player]=2};
                  //1枚しかないラインのやつをはじけ
                  var A=Cpuhandtemp.filter(value=>value <68 && value %4 ==0);
                  var B=Cpuhandtemp.filter(value=>value <68 && value %4 ==1);
                  var C=Cpuhandtemp.filter(value=>value <68 && value %4 ==2);
                  var D=Cpuhandtemp.filter(value=>value <68 && value %4 ==3);
                  if(A.length==1){
                    cputumo=Cpuhandtemp.findIndex(value=>value==A[0]);
                  }else if(B.length==1){
                    cputumo=Cpuhandtemp.findIndex(value=>value==B[0]);
                  }else if(C.length==1){
                    cputumo=Cpuhandtemp.findIndex(value=>value==C[0]);
                  }else if(D.length==1){
                    cputumo=Cpuhandtemp.findIndex(value=>value==D[0]);
                  }else{
                    console.log('line error')
                    reach[player]=1;
                    cputumo=1+Math.floor(Math.random()*9)
                  }
                  end=1;
                };
              }
              break;
            default:
               //0line->undefined
              if(keyj2.length==1){
                console.log('line tumo')
                //if(reach[player]==1){reach[player]=2};
                cputumo=1+Math.floor(Math.random()*9)
                end=1;
              }
              if(keyj2.length==2){
                if(Line[keyj2[0]]==1 || Line[keyj2[1]]==1){
                  console.log('line reach')
                  //if(reach[player]==1){reach[player]=2};
                  //1枚しかないラインのやつをはじけ
                  var A=Cpuhandtemp.filter(value=>value <68 && value %4 ==0);
                  var B=Cpuhandtemp.filter(value=>value <68 && value %4 ==1);
                  var C=Cpuhandtemp.filter(value=>value <68 && value %4 ==2);
                  var D=Cpuhandtemp.filter(value=>value <68 && value %4 ==3);
                  if(A.length==1){
                    cputumo=Cpuhandtemp.findIndex(value=>value==A[0]);
                  }else if(B.length==1){
                    cputumo=Cpuhandtemp.findIndex(value=>value==B[0]);
                  }else if(C.length==1){
                    cputumo=Cpuhandtemp.findIndex(value=>value==C[0]);
                  }else if(D.length==1){
                    cputumo=Cpuhandtemp.findIndex(value=>value==D[0]);
                  }else{
                    console.log('line error')
                    reach[player]=1;
                    cputumo=1+Math.floor(Math.random()*9)
                  }
                  end=1;
                }
              }
            break;
          }
          if(end>0){
          console.log('Cputumo',player,type,cputumo)
          if(reach[player]==1){reach[player]=2};
          clearTime = Date.now()
          thinkTime =clearTime - startTime;
          console.log(thinkTime)
          return cputumo;
          }
        }
          //ペアチェック
          switch(Line["0"]){
            case 2:
              //リーチとなるのは3,4 4,2,1 3,2,1,1 2,2,2,1
              if(keyj.length==4){
                if(tumoj==1 && reachj==0){
                  console.log('line reach')
                  end=4;
                }
              }
              if(keyj.length==5){
                if(kanj==1 && reachj==1){
                  console.log('line reach')
                  end=4;
                }
                //ツモとなるのは3,3,1 3,2,2
                if(tumoj==2 && reachj==0){
                  end=1;
                }
                if(tumoj==1 && reachj==2){
                  end=2;
                }
              }
              if(keyj.length==6){
                if(tumoj==1 && reachj==1){
                  console.log('line reach')
                  end=1;
                }
                if(tumoj==0 && reachj==3){
                  console.log('line reach')
                  //all以外なら何でも
                  end=2;
                }
              }
              break;
            case 1:
              //リーチとなるのは4,2,2 3,4,1 3,3,1,1 3,2,2,1 
              if(keyj.length==4){
                if(tumoj==1 && reachj==0){
                  //cputumo=1+Math.floor(Math.random()*9);
                  end=4;
                  console.log('line reach')
                }
                if(tumoj==0 && reachj==2){
                  end=4;
                  console.log('line reach')
                }
              }
              if(keyj.length==5){
                if(tumoj==2 && reachj==0){
                  end=1;
                  console.log('line reach')
                }
                if(tumoj==1 && reachj==2){
                  end=1;
                  console.log('line reach')
                }
              }
              //ツモとなるのは3,3,2
              if(tumoj==2 && reachj==1){
                end=3;
                //アガリ
              }
              break;
            default:
                //リーチとなるのは3,3,2,1 or 3,4,2
              if(tumoj==2 && reachj==1){
                end=1;
              }
              if(tumoj==1 && reachj==1 && kanj==1){
                end=4;
              }
              if(tumoj==3){
                //アガリ
                end=3;
              }
              break;
        }
    //end 4->4枚あるやつを切って立直　ポンしてないやつ
    //end 1->1枚あるやつを切って立直
    //end 3->オールマイティ以外なら何でも　ポンしてないやつ
        if(end>0){
          console.log('end',end)
          if(reach[player]==1){reach[player]=2};
              var resultH=[];
              var resultF=Object.keys(Count).filter((key)=>Count[key]==end);//->あればキャラ名が帰ってくる
              var F=resultF.findIndex(value=>value =="アリエル")
              if(F!==-1){resultF.splice(F,1)}
              var FF=resultF.findIndex(value=>value =="ルリエル")
              if(FF!==-1){resultF.splice(FF,1)}
              var R=Math.floor(Math.random()*resultF.length)
              console.log(resultF,R)
              var E=donpai.filter(value=>value.name==resultF[R]);
              for(var i=0; i<E.length ; i++){
                var A=Cpuhandtemp.findIndex(value=>value==E[i].id);//ポンに含まれていない
                if(A!==-1){
                resultH.push(A);
                }
              }
              if(resultH.length >0){
                var N=Math.floor(Math.random()*resultH.length);
                cputumo=resultH[N]
                console.log(cputumo,N)
              }
          clearTime = Date.now()
          thinkTime =clearTime - startTime;
          console.log(thinkTime)
          return cputumo;
        }
    //非テンパイ時
    if(type ==0){
      //1つのライン6枚以上あればラインを狙いに行く,ポンしない
      //1つのライン5枚以上あればラインを狙いに行き,ponRateの確率でポンしない
      //ライン条件該当しないなら（オールマイティ以外の）1枚しか持っていないキャラを優先して切る
      //↑2つに該当しなければ（オールマイティ以外の）ランダムに切る
      var resultF=Object.keys(Line).find((key)=>Line[key]>5);//->あればlineが帰ってくる
      if(ponsw[player]<3 && resultF !==undefined){
        var resultFF=Object.keys(Line).find((key)=>Line[key]==5);//->あればlineが帰ってくる
        if(resultFF !==undefined){
          if(ponsw[player]<3){poncpu[player]=Ponrate};
        }else{
        if(ponsw[player]<3){poncpu[player]=1};
        }
        resultF-=1;
        var E=Cpuhandtemp.filter(value=>value>=0 && value<68 && value%4!==resultF);
        console.log(E);
        //E=[]となると無限ループ？
        if(E.length==0){
          console.log('E.error!',cputumo)
          cputumo =1+ Math.floor(Math.random()*(Cpuhandtemp.length-1));
          return cputumo;
        }
        var F=Math.floor(Math.random()*E.length)
        cputumo=Cpuhandtemp.findIndex(value=>value==E[F]);
        console.log('noten',cputumo)
        return cputumo;
      }
      //各キャラ算出
      var resultH=[];
      for(var i=0;i<15;i++){
        var I=Cpuhandtemp.filter(value=>value/4 >=i && value/4 <i+1)
        if(I.length==1){
          resultH.push(I[0])
        }
      }
      var I=Cpuhandtemp.filter(value=>value >=60 && value < 68)
      if(I.length==1){
        resultH.push(I[0])
      }
      console.log(resultH);
      if(resultH.length >0){
        var N=Math.floor(Math.random()*resultH.length);
        cputumo=Cpuhandtemp.findIndex(value=>value==resultH[N]);
        //console.log(cputumo,N)
        console.log('noten',cputumo)
        return cputumo;
      }
      console.log('nokori')
      var K=Cpuhandtemp.filter(value=>value>=0 && value <68)
      var KK=Math.floor(Math.random()*K.length);
      cputumo=Cpuhandtemp.findIndex(value=>value==K[KK]);
      return cputumo;
    }else if(type==1){
      //ランダムに切るだけ
      cputumo =1+ Math.floor(Math.random()*(Cpuhandtemp.length-1));
    }
    //ここには飛んでこないはず
    console.log('Cputumo',player,type,cputumo)
    return cputumo;
    }
    
    function judge(player,mode=0){
      //自摸牌＋自分の手札を使ってアガれる形か否か
      //リーチ可能ならreach[player]を1にする
      //ツモ可能ならreturn trueする
      //カンがされている場合には残りのパイでのペア、クレストのみ算定する
      //mode 0->そのまま　1->参照時点でのhandtempで上がり判定のみやる
      var Count={};
      var Line={};
      var Color={};
      var reachR=0;
      var PonN=0
      switch(mode){
        case 1:
          reachR=1;
          var HH=handtemp.findIndex(value=>value==100);
        break;
        default:
            switch(player){
              case 1:
              handtemp = hand1.concat(pon1);
              PonN=pon1.length+kan1.length;
              if(kan1.length){
                var A=kan1.concat();
                if(kan1.length>=8){
                  A.splice(4,1);
                }
                if(kan1.length>=4){
                  A.splice(0,1);
                }
              handtemp = handtemp.concat(A);
              }
              break;
              case 2:
                PonN=pon2.length+kan2.length;
                if(kan2.length){
                  var A=kan2.concat();
                  if(kan2.length>=8){
                    A.splice(4,1);
                  }
                  if(kan2.length>=4){
                    A.splice(0,1);
                  }
                handtemp = handtemp.concat(A);
                }
                break;
              case 3:
                PonN=pon3.length+kan3.length;
                if(kan3.length){
                  var A=kan3.concat();
                  if(kan3.length>=8){
                    A.splice(4,1);
                  }
                  if(kan3.length>=4){
                    A.splice(0,1);
                  }
                handtemp = handtemp.concat(A);
                }
                break;
              case 4:
                PonN=pon4.length+kan4.length;
                if(kan4.length){
                  var A=kan4.concat();
                  if(kan4.length>=8){
                    A.splice(4,1);
                  }
                  if(kan4.length>=4){
                    A.splice(0,1);
                  }
                handtemp = handtemp.concat(A);
                }
              break;
              default:
                console.log('player error!')
                handtemp = hand2.concat();
              //自信ないから残しとく
              break;
            }
            //下でCがエラー吐くことがある　100が2つある？
            handtemp.sort(compareFunc);
            var HH=handtemp.filter(value=>value==100);
            //console.log(HH,handtemp)
            if(HH.length>0){
              console.log('handtemp error?')
              return false;
            }
        break;
      }
          for(var i=1; i<handtemp.length;i++){
            var C=donpai.findIndex(value=>value.id==handtemp[i])
            //console.log(i,C);
            if(C==-1){console.log('handtemp "C" error');C=0};
            var elm=donpai[C].name;//cpuでerror?
            var elm2=donpai[C].line
            var elm3=donpai[C].color;
            Count[elm]=(Count[elm] || 0)+1
            Line[elm2]=(Line[elm2] || 0)+1
            Color[elm3]=(Color[elm3] || 0)+1
          }
          if(debugmode){
            console.log(Count);//{[キャラ名:枚数]};
            console.log(Line);
            console.log(Color);
          }
          //リーチできるならreach[player]=1;
          var reachj=0;//同じキャラ2枚をカウント
          var tumoj=0;//同じキャラ3枚をカウント
          var kanj=0;//同じキャラ4枚をカウント
          //console.log(keyj2.length);//expected 1~5
          var keyj=Object.keys(Count);
          var keyj2=Object.keys(Line);
          var keyj3=Object.keys(Color);
          //console.log(keyj.length);
          //Count.length->undefined;
          for(var j=0;j<keyj.length;j++){
          //console.log(Count[keyj[j]]);
            if(Count[keyj[j]]==2){
              reachj+=1;
            }
            if(Count[keyj[j]]==3){
              tumoj+=1;
            }
            if(Count[keyj[j]]==4){
              kanj+=1;
            }
          }
          //console.log(keyj3[0],Color[keyj3[0]])
          if(PonN==0){
          switch(Line["0"]){
            case 2:
            case 1:
              if(keyj2.length==2){
                console.log('line tumo')
                if(reach[player]==0 && reachR==0){reach[player]=1};
                  return true;
              }
              if(keyj2.length==3){
                if(Line["1"]==1 || Line["2"]==1 || Line["3"]==1 || Line["4"]==1){
                  console.log('line reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
              break;
            default:
               //0line->undefined
              if(keyj2.length==1){
                console.log('line tumo')
                if(reach[player]==0 && reachR==0){reach[player]=1};
                  return true;
              }
              if(keyj2.length==2){
                if(Line[keyj2[0]]==1 || Line[keyj2[1]]==1){
                  console.log('line reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
            break;
          }
        }
          //3ペアチェック
          switch(Line["0"]){
            case 2:
              //リーチとなるのは3,4 4,2,1 3,2,1,1 2,2,2,1
              if(keyj.length==4){
                if(tumoj==1 && reachj==0){
                  console.log('pair reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
              if(keyj.length==5){
                if(kanj==1 && reachj==1){
                  console.log('pair reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
              if(keyj.length==6){
                if(tumoj==1 && reachj==1){
                  console.log('pair reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
                if(tumoj==0 && reachj==3){
                  console.log('pair reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
              //ツモとなるのは3,3,1 3,2,2
              if(keyj.length==5){
                if(tumoj==2 && reachj==0){
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                  //アガリ
                  return true;
                }
                if(tumoj==1 && reachj==2){
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                  //アガリ
                  return true;
                }
              }
              break;
            case 1:
              //リーチとなるのは4,2,2 3,4,1 3,3,1,1 3,2,2,1 
              if(keyj.length==4){
                if(tumoj==1 && reachj==0){
                  console.log('pair reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
                if(tumoj==0 && reachj==2){
                  console.log('pair reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
              if(keyj.length==5){
                if(tumoj==2 && reachj==0){
                  console.log('pair reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
                if(tumoj==1 && reachj==2){
                  console.log('pair reach')
                  if(reach[player]==0 && reachR==0){reach[player]=1};
                }
              }
              //ツモとなるのは3,3,2
              if(tumoj==2 && reachj==1){
                if(reach[player]==0 && reachR==0){reach[player]=1};
                //アガリ
                return true;
              }
              break;
            default:
                //リーチとなるのは3,3,2,1 or 3,4,2
              if(tumoj==2 && reachj==1){
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
              if(tumoj==1 && reachj==1 && kanj==1){
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
              if(tumoj==3){
                if(reach[player]==0 && reachR==0){reach[player]=1};
                //アガリ
                return true;
              }
              break;
        }
        //クレスト：同じ属性9枚、マスターロードを含む
        switch(Color["0"]){
          case 2:
          case 1:
            //オールマイティをマスロパイ代わりにすることで判定を無視
            if(keyj3.length==2){
              console.log('crest tumo')
              if(reach[player]==0 && reachR==0){reach[player]=1};
                return true;
            }
            if(keyj3.length==3){
              //keyj3[0]は0であるはず
              if(Color[keyj3[1]]==1 || Color[keyj3[2]]==1){
                console.log('crest reach')
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
            }
            break;
          default:
            if(keyj3.length==1){
              var M=handtemp.findIndex(value=>value>=60 && value<=67)
              if(M!==-1){
              console.log('crest tumo'+donpai[handtemp[M]].name)
              if(reach[player]==0 && reachR==0){reach[player]=1};
                return true;
              }else{
                //マスロパイ待ち
                console.log('crest reach')
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
            }
            if(keyj3.length==2){
              if(Color[keyj3[0]]==1 || Color[keyj3[1]]==1){
                console.log('crest reach')
                if(reach[player]==0 && reachR==0){reach[player]=1};
              }
            }
          break;
        }
        var Kokushi=[60,61,62,63,64,65,66,67,68,69]
        var Kreach=0;
        var KKreach=0;
        for(var k=1;k<handtemp.length;k++){
          var A=Kokushi.findIndex(value=>value==handtemp[k])
          if(A!==-1){
            var B=handtemp.filter(value=>value==handtemp[k])
            KKreach+=B.length-1;
          }else{
            Kreach+=1;
            if(Kreach>2){break;}
          }
        }
        //console.log(Kreach,KKreach);//0,4
        if(Kreach==1){
          if(KKreach==0 || KKreach==2){
            //8/9枚がマスロパイの場合　ダブリが1つの時にリーチとする
            console.log('国士リーチ');
            if(reach[player]==0 && reachR==0){reach[player]=1};
          }
        }
        if(Kreach==0){
          if(KKreach==4){
            //全部マスロパイの場合　ダブリが2つの時にリーチとする
            console.log('国士リーチ');
            if(reach[player]==0 && reachR==0){reach[player]=1};
          }else if(KKreach==0 || KKreach==2){
            //国士ツモ
            if(reach[player]==0 && reachR==0){reach[player]=1};
            //アガリ
            return true;
          }
        }
        console.log('judge',player)
      }//judge
  
    function ron(player){//ロン
      console.log('ron'+player,reach[player]);
      var result=0;
      if(reach[player]!==3){
        //立直していなければ基本的にロンできない
        //console.log('ron false');
        return false;
      }
      handtemp=[];
      switch(player){
        case 1:
          handtemp = hand1.concat(pon1);
          if(kan1.length){
            var A=kan1.concat();
            if(kan1.length>=8){
              A.splice(4,1);
            }
            if(kan1.length>=4){
              A.splice(0,1);
            }
          handtemp = handtemp.concat(A);
          }
        break;
        case 2:
          handtemp = hand2.concat(pon2);
          if(kan2.length){
            var A=kan2.concat();
            if(kan2.length>=8){
              A.splice(4,1);
            }
            if(kan2.length>=4){
              A.splice(0,1);
            }
          handtemp = handtemp.concat(A);
          }
        break;
        case 3:
          handtemp = hand3.concat(pon3);
          if(kan3.length){
            var A=kan3.concat();
            if(kan3.length>=8){
              A.splice(4,1);
            }
            if(kan3.length>=4){
              A.splice(0,1);
            }
          handtemp = handtemp.concat(A);
          }
        break;
        case 4:
          handtemp = hand4.concat(pon4);
          if(kan1.length){
            var A=kan4.concat();
            if(kan4.length>=8){
              A.splice(4,1);
            }
            if(kan4.length>=4){
              A.splice(0,1);
            }
          handtemp = handtemp.concat(A);
          }
        break;
      }
  
      var HH=handtemp.findIndex(value=>value==100);
      if(debugmode){
      console.log(HH,handtemp)
      };
      if(HH !==-1){
        handtemp[HH]=tumotemp
      }
      handtemp.sort(compareFunc);
        //役チェック
        if(judge(player,1)){
        if(player ==1){hand1[0]=-2}
        if(player ==2){hand2[0]=-2}
        if(player ==3){hand3[0]=-2}
        if(player ==4){hand4[0]=-2}
        console.log('ロン可')
        }
        };
    
    function yoti(player,type=0){
      //自分用
        if(reach[player]!==3){
          return false;
        }
        for(var I=1;I<hand1.length-1;I++){
        handtemp=[];
      switch(player){
        case 1:
          handtemp = hand1.concat(pon1);
        break;
        case 2:
          handtemp = hand2.concat(pon2);
        break;
        case 3:
          handtemp = hand3.concat(pon3);
        break;
        case 4:
          handtemp = hand4.concat(pon4);
        break;
      }
      var HH=handtemp.findIndex(value=>value==100);
      if(debugmode){
      console.log(HH,handtemp)
      };
      if(HH !==-1){
        handtemp[HH]=hand1[I];
      }
      handtemp.sort(compareFunc);
      //チェック
      if(judge(player,1)){
        var t = new createjs.Text("危", "20px 'Century Gothic'", "#ff4c38");
        t.x=60+size*I;
        t.y=470;
        t.outline=4;
        fieldpai.addChild(t);
        var t = new createjs.Text("危", "20px 'Century Gothic'", "white");
        t.x=60+size*I;
        t.y=470;
        fieldpai.addChild(t);
      };
    }};
    function TumoRon(player,num,dub=1){
      //上がった画面描画～次のゲーム,num=0→ツモ,1~→ロン dubダブロン用
      console.log("tumoron",player,num,ctl)
      console.log(ponsw[player])
        //ロンなら塗りつぶす
        if(num>=1){
          if(ippatu[num]==1){
            var rect = new createjs.Shape();
            rect.graphics
            .beginFill("rgba(200,0,0,0.5)")
            .drawRect(riverx[num]-10.5, rivery[num]+5.25, 43.5, 33);
            field.addChild(rect);
          }else{
            var rect = new createjs.Shape();
            rect.graphics
            .beginFill("rgba(200,0,0,0.5)")
            .drawRect(riverx[num], rivery[num], 33, 43.5);
            field.addChild(rect);
          }
        };
      se7.play();
      cLock=0
      gamestate=-2;
      LoopAnimation(player,num);
      if(Fever!==-1){Fever+=1};
      vichand=[]
      var ponf=0
      if(player ==1){
        handtemp = hand1.concat();
        var T=handtemp.splice(handtemp.length-1,1);
        handtemp=handtemp.concat(pon1);
        handtemp=handtemp.concat(kan1);
        handtemp.sort(compareFunc);
        handtemp=handtemp.concat(T);
        if(ponsw[player]>0){
        ponf=Math.floor(pon1.length/3);
        //100を[9]にしたい
      }}
      if(player ==2){
        handtemp = hand2.concat();
          handtemp=handtemp.concat(pon2);
          handtemp=handtemp.concat(kan2);
          handtemp.sort(compareFunc);
          if(ponsw[player]>0){
          ponf=Math.floor(pon2.length/3);
        }}
      if(player ==3){
        handtemp = hand3.concat();
          handtemp=handtemp.concat(pon3);
          handtemp=handtemp.concat(kan3);
          handtemp.sort(compareFunc);
          if(ponsw[player]>0){
          ponf=Math.floor(pon3.length/3);
        }}
      if(player ==4){
        handtemp = hand4.concat();
          handtemp=handtemp.concat(pon4);
          handtemp=handtemp.concat(kan4);
          handtemp.sort(compareFunc);
          if(ponsw[player]>0){
          ponf=Math.floor(pon4.length/3);
        }}
      //console.log(handtemp[9]); 
      if(num>0){
      handtemp[handtemp.length-1]=tumotemp
      }else if(player !==1){
        handtemp[handtemp.length-1]=tumo2;
      }
      //console.log(handtemp[9]);
      vichand=Array.from(handtemp)
      //handtemp.sort(compareFunc);
      var Astyle=Nodyaku(player);//ラインorペア
      //3ペア→+30符
      fu=100;
      var B=Buff[player].filter(value=>value==7);
      if(B.length>0){
      fu-=20*B.length;
      }
      if(Astyle=="3ペア"){
        fu-=10*ponf;
      }
      if(Astyle=="国士無双"){
        han[player]+=12;
      }
      if(Astyle=="クレストオブガイア"){
        han[player]+=4;
      }
      if(Astyle=="クレストオブソーレス" || Astyle=="クレストオブロッソ"||Astyle=="クレストオブデニフ"||Astyle=="クレストオブハルニエ"||Astyle=="クレストオブアドリアン"||Astyle=="クレストオブベントス"){
        han[player]+=6;
      }
      if(num==0 && ponsw[player] ==0){han[player] +=1}//門前ツモ
      if(nuki[0]>0){han[player]+=1}//嶺上
      if(ippatu[player]==1){han[player] +=1}
      if(counter[player] ==0 && num==0){han[player] +=12}//天和 12翻
      if(deck.length ==0){han[player] +=1};//海底
      if(ponsw[player] >0){
        if(chara[player]==9){han[player] -=1}else{han[player] -=2}
      };//鳴き
      var doracheck =Doracheck(player);
      function Doracheck(player){
        var result =0
        if(reach[player]==3 && dub==1 && LP[0]!==4){
          //裏ドラを1枚追加する
          dora.push(king.splice(0,1));
          dorax+=40;
          e7 = new createjs.Bitmap(eltear_src[dora[dora.length-1]]);
          e7.x=dorax;
          e7.y=10;
          e7.scale=33/120;
          field.addChild(e7);
        }
        for(var D=0 ; D< dora.length ; D++){
        var DD=dora[D];
        var dorahand =handtemp.filter(value => value== DD )
        han[player]+= dorahand.length
        result +=dorahand.length
        }
        console.log('dora',result)
        return result
        }
        nodyaku =Nodyaku2(player)
        han[player] +=nodyaku[0];
      rootscore =Score(player);
      //役満ブロック
      if(mode==0){
      if(rootscore>220000){
        rootscore=220000;
      }else if(rootscore>150000){
        rootscore=150000;
      }else if(rootscore>100000){
        rootscore=100000;
      }else if(rootscore>75000){
        rootscore=75000;
      }else if(rootscore>50000){
        rootscore=50000;
      };
    }
      if(parent==0){Scorepay(player,4,num)}else{Scorepay(player,parent,num)}
      function PB(name,count=1,pc=0){
        //pc->1なら自分以外がアガリの場合にも考慮する
        if(player==1 || pc==1){
        var A=achievetempB.findIndex(value=>value.name==name);
        if(A==-1){
          console.log('PB error',name,count)
          return false;      
        }
        achievetempB[A].count+=count;
        }};
      cx2.font = "20px 'Century Gothic'";
      cx2.fillStyle ="white";
      Resultary=[];
      console.log(Astyle);
      Resultary.push(Astyle)
      if(counter[player] ==0){
        if(num==0){Resultary.push('天和 12翻');}
        PB("天和");
        }
        if(Astyle=="国士無双"){
          Resultary.push('国士無双 12翻')
          PB(Astyle);
        }
        if(Astyle=="クレストオブガイア"){
          Resultary.push(Astyle+' 4翻')
          PB(Astyle);
        }
        if(Astyle=="クレストオブソーレス" || Astyle=="クレストオブロッソ"||Astyle=="クレストオブデニフ"||Astyle=="クレストオブハルニエ"||Astyle=="クレストオブアドリアン"||Astyle=="クレストオブベントス"){
          Resultary.push(Astyle+' 6翻')
          PB(Astyle);
        }
      if(nuki[0]>0){
        if(num==0){
          Resultary.push('嶺上開花 1翻');
          PB("嶺上開花");
      }else{
          Resultary.push('槍槓 1翻');
      }
      }
      if(num==0 && ponsw[player]==0){
      Resultary.push('門前ツモ 1翻')
      PB("門前ツモ");
      }
      if(ippatu[player]==1){
      Resultary.push('一発 1翻')
      PB("一発");
      }
      if(deck.length ==0){
      Resultary.push('海底 1翻')
      PB("海底");
      }
      if(doracheck>0){
        Resultary.push('ドラ '+doracheck+'翻')
        }
      if(ponsw[player] >0){
        if(chara[player]==9){
          Resultary.push('鳴き -1翻')          
        }else{
          Resultary.push('鳴き -2翻')
        }
      }
      //実績
      if(player==1){
        var A=achievetemp.findIndex(value=>value.name==Astyle)
        if(A==-1){
        achievetemp.push({name:Astyle,cleared:1,count:0})
        }else{
          achievetemp[A].cleared+=1;
        }
        if(num==0){PB("ツモ");}else{PB("ロン");};
        if(score>scoretemp[3]){scoretemp[3]=score};
      }else{
        if(num==1){
          PB("放銃",1,1);
        if(dub==2){
          PB('ダブル放銃',1,1)
        }};
      }
      if(LP[1]<=0){PB("飛び",1,1)};
      PB("ポン",ponsw[1]/3,1);
      PB("カン",kan1.length/4,1);
      if(rootscore==220000){
        PB("数え役満");}
        if(rootscore==150000){
        PB("三倍満");}
        if(rootscore==100000){
        PB("二倍満");}
        if(rootscore==75000){
        PB("跳満");}
        if(rootscore==50000){
        PB("満貫");}
      cx4.clearRect(0,0,800,600)
      opLock=-1;
      //gamestate =2;
      tweeNsquare.paused=true;
      Csquare.alpha=0;
      //描画 魔界モード以外の時はResultmapで描画
      if(LP[0]==4){
        //従来通りツモ画面の描画のみ
        if(fool){
          e15 = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[player]]));          
        }else{
        e15 = new createjs.Bitmap(queue.getResult(chrimg_src[chara[player]]));
        }
      if(ippatu[player]==1 && chara[player]==6 && skillusage[player]==1){
        e15.sourceRect={x:0,y:10,width:400,height:400};
        }else if(chara[player]==6){
          e15.sourceRect={x:400,y:10,width:400,height:400}
        }else{
          e15.sourceRect={x:0,y:10,width:800,height:400};
        }
        if(chara[player]==6){
        e15.x=400+raidscore[1]*800;
        }else{
        e15.x=raidscore[1]*800
        }
        e15.y=100;
      fieldmap.addChild(e15);
      var e = new createjs.Bitmap(eltearB_src[1]);
      e.scale=0.7;
      e.x=raidscore[1]*800;
      e.y=230;
      fieldmap.addChild(e);
      if(num==0){
        e16 = new createjs.Bitmap(queue.getResult(win_src[4]));
      }else{
        e16 = new createjs.Bitmap(queue.getResult(win_src[5]));
      }
      e16.scale=0.7;
      e16.x=raidscore[1]*800;
      e16.y=230;
      fieldmap.addChild(e16);
      var s = new createjs.Shape();
        s.graphics.beginFill("rgba(15,15,15,0.6)");
        s.graphics.drawRect(10, 100, 780, 400);
        s.x=raidscore[1]*800
      fieldmap.addChild(s);
        s.addEventListener("click", {handleEvent:Menu}); 
        for (var i=1;i<vichand.length;i++){
        var drawcard=new createjs.Bitmap(queue.getResult(eltear_src[vichand[i]]));
        drawcard.x=15+size*(i-1)+raidscore[1]*800;
        if(i==vichand.length-1){drawcard.x+=15}
        drawcard.y=120;
        drawcard.scaleX=7/12;
        drawcard.scaleY=31/52;
        fieldmap.addChild(drawcard);
        }
        var haix
        var haiy
        haix=30;
        haiy=250;
        cx2.font = "20px 'Century Gothic'";
        cx2.fillStyle ="white";
        cx2.fillText(Astyle,haix,haiy)
        haiy+=50;
        if(counter[player] ==0){
          if(num==0){cx2.fillText('天和 4翻',haix,haiy)}
          haiy +=25
          }
        if(nuki[0]>0){
          if(num==0){
            cx2.fillText('嶺上開花 1翻',haix,haiy)
        }else{
            cx2.fillText('槍槓 1翻',haix,haiy);
        }
          haiy +=25
        }
        if(num==0 && ponsw[player]==0){
        cx2.fillText('門前ツモ 1翻',haix,haiy)
        haiy +=25
        }
        if(ippatu[player]==1){
        cx2.fillText('一発 1翻',haix,haiy)
        haiy +=25
        }
        if(deck.length ==0){
        cx2.fillText('海底 1翻',haix,haiy)
        haiy +=25
        }
        if(doracheck>0){
          cx2.fillText('ドラ '+doracheck+'翻',haix,haiy)
          haiy +=25
          }
        if(ponsw[player] >0){
            cx2.fillText('鳴き -2翻',haix,haiy)
            haiy +=25
        }
          haiy=250
          haix=480;
        cx2.textAlign = "right";
        if(nodyaku[0] >0){
          for(var i=1 ;i<nodyaku.length;i++){
          cx2.fillText(nodyaku[i],haix,haiy)
          haiy+=25
          if(haiy>=400){
            haix+=240
            haiy=250
          }
          }}
        cx2.textAlign = "start";
        cx2.fillStyle ="white";
        cx2.font = "26px 'Century Gothic'";
        cx2.fillText(fu+"符",530,330)
        cx2.fillText(han[player]+"翻",530,360)
        cx2.font = "28px 'Century Gothic'";
        if(mode==0){
        if(rootscore==220000){
        cx2.fillStyle ="red";
        cx2.fillText("数え役満",640,360);
        PB("数え役満");}
        if(rootscore==150000){
        cx2.fillStyle ="red";
        cx2.fillText("三倍満",640,360);
        PB("三倍満");}
        if(rootscore==100000){
        cx2.fillStyle ="red";
        cx2.fillText("二倍満",640,360);
        PB("二倍満");}
        if(rootscore==75000){
        cx2.fillStyle ="red";
        cx2.fillText("跳満",640,360);
        PB("跳満");}
        if(rootscore==50000){
        cx2.fillStyle ="red";
        cx2.fillText("満貫",640,360);
        PB("満貫");}
        }
        cx2.strokeStyle ="#ff4c38";
        cx2.lineWidth = 5;
        cx2.lineJoin = 'round';
        cx2.fillStyle ="white";
        cx2.strokeText("　　　 "+score,530,400)
        cx2.fillText("戦闘力 "+score,530,400)
        cx2.font = "24px 'Century Gothic'";
        cx2.fillStyle ="white";
        if(pvpmode==1){
          var x=30;
          var y=430
          for(var i=0;i<MEMBER.length;i++){
          cx2.fillText(MEMBER[i].name, x, y);
          x+=200;
          };
    }else{
        cx2.fillText(Username,30,430)
          cx2.fillText("ＣＰＵ１",230,430)
            cx2.fillText("ＣＰＵ２",430,430)
              cx2.fillText("ＣＰＵ３",630,430)
    }
        cx2.fillText(chrlist[chara[1]],30,460)
        cx2.fillText(LPtemp[1],30,490)
        cx2.fillText(chrlist[chara[2]],230,460)
        cx2.fillText(LPtemp[2],230,490)
        cx2.fillText(chrlist[chara[3]],430,460)
        cx2.fillText(LPtemp[3],430,490)
        cx2.fillText(chrlist[chara[4]],630,460)
        cx2.fillText(LPtemp[4],630,490)  
        N1= cx2.getImageData(10, 100, 780, 400);
        var C=canvas2.toDataURL();
        var Cb = new createjs.Bitmap(C);
        Cb.x=raidscore[1]*800;
        fieldmap.addChild(Cb);
        Buff[player].push(11);
        raidscore[1]+=1;
        if(raidscore[1]>=3){
          raidscore[2]=1;
        };
        if(LP[1]<0 || LP[2]<0 || LP[3]<0 || LP[4]<0){
          raidscore[2]=1;
        };
        cx2.clearRect(10,100,780,400);
      };
    }
    //一つずつ描画するパターン loopanimation から呼ばれる
    function Resultmap(player,num){
      gamestate=-1;
      guidemap.alpha=0;
      cx2.clearRect(0,0,800,600);
      handmap.removeAllChildren();
      if(fool){
        e15 = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[player]]));          
      }else{
      e15 = new createjs.Bitmap(queue.getResult(chrimg_src[chara[player]]));
      }
      if(ippatu[player]==1 && chara[player]==6 && skillusage[player]==1){
        e15.sourceRect={x:0,y:10,width:400,height:400};
      }else if(chara[player]==6){
        e15.sourceRect={x:400,y:10,width:400,height:400}
      }else{
        e15.sourceRect={x:0,y:10,width:800,height:400};
      }
      if(chara[player]==6){
      e15.x=400+raidscore[1]*800;
      }else{
      e15.x=raidscore[1]*800
      }
      e15.y=100;
     field.addChild(e15);
     var e = new createjs.Bitmap(eltearB_src[1]);
     e.scale=1.2;
     e.alpha=0.7;
     e.x=20;
     e.y=180;
     field.addChild(e);
     if(num==0){
       e16 = new createjs.Bitmap(queue.getResult(win_src[4]));
     }else{
       e16 = new createjs.Bitmap(queue.getResult(win_src[5]));
     }
     e16.scale=0.7;
     e16.x=0;
     e16.y=230;
     field.addChild(e16);
     var s = new createjs.Shape();
       s.graphics.beginFill("rgba(15,15,15,0.6)");
       s.graphics.drawRect(10, 100, 780, 400);
       s.x=0
     field.addChild(s);
      s.addEventListener("click", {handleEvent:Menu}); 
      //handmap.alpha=1; 
      var drawcard;
      var drawcardlist=[];
      for (var i=1;i<vichand.length;i++){
      drawcard=new createjs.Bitmap(queue.getResult(eltear_src[vichand[i]]));
      drawcard.alpha=0;
      drawcard.x=15+size*(i-1);
      if(i==vichand.length-1){drawcard.x+=15}
      drawcard.y=120;
      drawcard.scaleX=7/12;
      drawcard.scaleY=31/52;
      drawcardlist[i-1]=drawcard;
      handmap.addChild(drawcard);
      }
      var t;
      var tlist=[];
      var X=-30;
      var Y=225;
      t= new createjs.Text(Resultary[0], "bold 20px 'Century Gothic'", "white");
      t.alpha=0;
      t.x=X;
      t.y=Y;
      Y+=50
      tlist[0]=t;
      handmap.addChild(t);
      if(Resultary.length>1){
      for (var i=1;i<Resultary.length;i++){
        console.log(Resultary[i]);
        t= new createjs.Text(Resultary[i], "20px ' Century Gothic'", "white");
        t.alpha=0;
        t.x=X;
        t.y=Y;
        Y+=25;
        tlist[i]=t;
        handmap.addChild(t);
        }};
      var s;
      var slist=[];
      var X=380;
      var Y=225;
      for (var i=1;i<nodyaku.length;i++){
        s= new createjs.Text(nodyaku[i], "20px ' Century Gothic'", "white");
        s.alpha=0;
        s.x=X;
        s.y=Y;
        s.textAlign = "right";
        Y+=25;
        if(i==7){
          X+=240;
          Y=225;
        }
        slist[i-1]=s;
        handmap.addChild(s);
        }
        //描画
      var I=0;
      var nIntervId=setInterval(flashText, 130);
      var nIntervId2;
      var nIntervId3;
      function flashText(){
        //console.log(I,drawcardlist[I])
        drawcard=drawcardlist[I]
        createjs.Tween.get(drawcard)
        .to({alpha: 1},150);
        I+=1;
        if(I>=drawcardlist.length){
          clearInterval(nIntervId);
          nIntervId2=setInterval(flashText2, 500);
          t=tlist[0];
          se14.play();
          createjs.Tween.get(t)
          .to({x:30, alpha: 1},125, createjs.Ease.cubicInOut)  
        }
      }
      var J=1;
      function flashText2(){
        if(tlist.length>1){
        t=tlist[J];
        se14.play();
        createjs.Tween.get(t)
        .to({x:30, alpha: 1},125, createjs.Ease.cubicInOut)  
        J+=1;
        }
        if(J>=tlist.length){
          clearInterval(nIntervId2);
          nIntervId3=setInterval(flashText3, 500);
        }
      }
      var K=0;
      function flashText3(){
        s=slist[K];
        se14.play();
        if(K>=7){
        createjs.Tween.get(s)
        .to({x:720, alpha: 1},125, createjs.Ease.cubicInOut)  
        }else{
        createjs.Tween.get(s)
        .to({x:480, alpha: 1},125, createjs.Ease.cubicInOut)  
        }
        K+=1;
        if(K>=slist.length){
          clearInterval(nIntervId3);
          setTimeout(() => {
            flashText4();
          }, "700");
        }
      }
      function flashText4(){
        gamestate =2;
        if(rootscore>=50000){
          se13.play();
        }else{
          se15.play()
        }
        cx2.textAlign = "start";
        cx2.fillStyle ="white";
        cx2.font = "26px 'Century Gothic'";
        cx2.fillText(fu+"符",530,330)
        cx2.fillText(han[player]+"翻",530,360)
        cx2.font = "28px 'Century Gothic'";
        if(mode==0){
        if(rootscore==220000){
        cx2.fillStyle ="red";
        cx2.fillText("数え役満",640,360);}
        if(rootscore==150000){
        cx2.fillStyle ="red";
        cx2.fillText("三倍満",640,360);}
        if(rootscore==100000){
        cx2.fillStyle ="red";
        cx2.fillText("二倍満",640,360);}
        if(rootscore==75000){
        cx2.fillStyle ="red";
        cx2.fillText("跳満",640,360);}
        if(rootscore==50000){
        cx2.fillStyle ="red";
        cx2.fillText("満貫",640,360);}
        }
        //cx2.font = "28px 'Century Gothic'";
        cx2.strokeStyle ="#ff4c38";
        cx2.lineWidth = 5;
        cx2.lineJoin = 'round';
        cx2.fillStyle ="white";
        cx2.strokeText("　　　 "+score,530,400)
        cx2.fillText("戦闘力 "+score,530,400)
        cx2.font = "24px 'Century Gothic'";
        cx2.fillStyle ="white";
        if(pvpmode==1){
          var x=30;
          var y=430
          for(var i=0;i<MEMBER.length;i++){
          cx2.fillText(MEMBER[i].name, x, y);
          x+=200;
          };
        }else{
        cx2.fillText(Username,30,430)
          cx2.fillText("ＣＰＵ１",230,430)
            cx2.fillText("ＣＰＵ２",430,430)
              cx2.fillText("ＣＰＵ３",630,430)
        }
        cx2.fillText(chrlist[chara[1]],30,460)
        cx2.fillText(LPtemp[1],30,490)
        cx2.fillText(chrlist[chara[2]],230,460)
        cx2.fillText(LPtemp[2],230,490)
        cx2.fillText(chrlist[chara[3]],430,460)
        cx2.fillText(LPtemp[3],430,490)
        cx2.fillText(chrlist[chara[4]],630,460)
        cx2.fillText(LPtemp[4],630,490)
        var C=canvas2.toDataURL();
        var Cb = new createjs.Bitmap(C);
        handmap.addChild(Cb);
      }
    }; 
    function Score(player){
      //符　tumoronで一部出してる
      //オールマイティ1枚につき-10
      var All=handtemp.filter(value=>value==69 || value==70)
      //console.log(All.length);
      fu-=10*(All.length)
      var Wind=Buff[player].filter(value=>value==3 || value==4);
      if(Wind.length){
        fu+=10*Wind.length;
      }
      if(fu<20){fu=20};
      if(han[player]<=0){han[player]=1};
      var h=han[player]
      var hellhan=0
      hellhan=(fu+2)*3*(16*(h+2)+h*h*h/3)
      //hellhan=fu*3*(1+h+(h*h)/2+(h*h*h)/6)
      hellhan=200*Math.ceil(hellhan/100)
      console.log(fu,hellhan)
      return hellhan
      };
  
    function Scorepay(player,parentS,num){
      //type0 通常 type1 サバイバル（予定）
      if(player ==parentS){
        //連荘
      score =rootscore *1.5
      if(LP[0]!==4 && LP[0]!==2){
        skillusage2[0]-=1;
        skillusage2[5]+=1
        if(chara[player]==8){
          skillusage2[player]+=1;
          if(skillusage2[player]>4){skillusage2[player]=4};
        }
        if(player==1){
          if(skillusage2[5]>scoretemp[1]){
            scoretemp[1]+=1;
          }};
        if(parent ==0){parent =3}else{parent -=1}
      }
      }else{
      for(var i=1;i<5;i++){
        if(chara[i]==8){
          if(player==i || skillusage[i]==1){
            skillusage2[i]+=1;
            if(skillusage2[player]>4){skillusage2[player]=4};
          }else{
            skillusage2[i]=0;
          };
        }
      }
      score=rootscore
      skillusage2[5]=0
      }
      //支払いしないならここまで
      if(LP[0] !==3){
      LPtemp=[0,0,0,0,0]
      if(num >0){//ロン
        if(LP[0]!==2){
        LPtemp[player]=score;
      }
        var MS=Buff[num].filter(value=>value==2);
        if(MS.length){
          LPtemp[num]=-Math.floor(score*(10-MS.length)/10);
        }else{
      LPtemp[num]=-score
        }
      if(LP[0]==2){
        death[player-1].Admg[num-1]+=score;
        death[num-1].Bdmg[player-1]+=score;
      }
      }
      if(num ==0){
      if(player==parentS){//おやつも
      for(var i=1;i<LP.length;i++){
      if(i==player){
        if(LP[0]!==2){
          LPtemp[i]=score;
        }
      }else{
        var MS=Buff[i].filter(value=>value==2);
        if(MS.length){
          LPtemp[i]=-Math.floor((score/3)*(10-MS.length)/10);
        }else{
          LPtemp[i]=-score/3;
        }
        if(LP[0]==2){
          death[i-1].Bdmg[player-1]+=score/3;
        }
      }
      if(LP[0]==2){
        death[player-1].Admg[player-1]+=score;
      }
      }}
      if(player!==parentS){//こつも
      for(var i=1;i<LP.length;i++){
      if(i==player){
        if(LP[0]!==2){
          LPtemp[i]=score;
        }else{
          death[player-1].Admg[player-1]+=score;
        };
      }else if(i==parentS){
      var MS=Buff[i].filter(value=>value==2);
      if(MS.length){
        LPtemp[i]=-Math.floor((score/2)*(10-MS.length)/10);
      }else{
        LPtemp[i]=-score/2;
      }
      if(LP[0]==2){
        death[i-1].Bdmg[player-1]+=score/2;
      }
      }else{
      var MS=Buff[i].filter(value=>value==2);
      if(MS.length){
        LPtemp[i]=-Math.floor((score/4)*(10-MS.length)/10);
      }else{
        LPtemp[i]=-score/4
      }
      if(LP[0]==2){
        death[i-1].Bdmg[player-1]+=score/4;
      }
    }
      }
      }}
      for(var i=1; i<LP.length;i++){
      MS=Buff[i].filter(value=>value==4)
      if(chara[i]==4 && LP[i]!==1 && MS.length>0 && LP[i]+LPtemp[i]<0){
        //食いしばり
        LP[i]=1;
      }else{
        LP[i]+=LPtemp[i]
      }
      if(LP[i]<0){
        //飛び
        if(skillusage2[i]==-1){
          skillusage2[i]=1;
          if(LP[0]==2){
            //キルアシ
            var As=death[i-1].Bdmg.concat();
            var Bs=maxIndex1(As);
            function maxIndex1(a) {
              let index = 0
              let value = -Infinity
              for (let i = 0, l = a.length; i < l; i++) {
                if (value < a[i]) {
                  value = a[i]
                  index = i
                }
              }
              return index
            }
            death[i-1].death+=1;
            death[player-1].kill+=1;
            death[Bs].assist+=1;
          }
        };
      }
      }
      if(debugmode){console.log(death)};
    switch(LP[0]){
      case 0:
      case 1:
      if(player==parentS && skillusage2[0]==7){//オーラスで1位なら対局終了
      var LPrank=[
      {chara:1, elia:LP[1]},
      {chara:2, elia:LP[2]},
      {chara:3, elia:LP[3]},
      {chara:4, elia:LP[4]},
        ]
      LPrank.sort(compareFunc2);
      if(LPrank[3].chara ==parentS){
      skillusage2[0]+=1;
      console.log('オーラス',skillusage2[0])
      }
      }
      break;
      case 2:
        //デスマッチ
        if(skillusage2[0]==7){//オーラスで1位が一意に決まっていれば終了
          var LPrank=[
          {chara:1, elia:death[0].kill,nod:death[0].assist},
          {chara:2, elia:death[1].kill,nod:death[1].assist},
          {chara:3, elia:death[2].kill,nod:death[2].assist},
          {chara:4, elia:death[3].kill,nod:death[3].assist},
            ]
          LPrank.sort(compareFunc4);
          if(LPrank[3].elia == LPrank[2].elia && LPrank[3].nod == LPrank[2].nod){
          skillusage2[0]+=1;
          console.log('オーラス',skillusage2[0])
          }else{
          console.log('オーラス続行',skillusage2[0])
          }
          }
      break;
      }}
    }
  
    function Nodyaku(){//アガリ条件チェック
      //ラインとペアの確認
      var result=0
      cx2.fillStyle = "white";
        handtemp.sort(compareFunc);
        //console.log(handtemp[9],handtemp)
            var Count={};
            var Line={};
            var Color={};
            for(var i=1; i<handtemp.length;i++){
              var C=donpai.findIndex(value=>value.id==handtemp[i]);
              if(C==-1){
                console.log(handtemp[i],'Nodyaku eroor!')
                break;
              }
              var elm=donpai[C].name;
              var elm2=donpai[C].line
              var elm3=donpai[C].color;
              Count[elm]=(Count[elm] || 0)+1
              Line[elm2]=(Line[elm2] || 0)+1
              Color[elm3]=(Color[elm3] || 0)+1
            }
            console.log(Count);
            console.log(Line);
          //クレストシリーズは最優先
          var keyj3=Object.keys(Color);
          var Ary=["0","ソーレス","デニフ","ベントス","アドリアン","ガイア","ロッソ","ハルニエ"];
          switch(Color["0"]){
            case 2:
            case 1:
              if(keyj3.length==2){
                console.log('crest tumo',keyj3[1]);
                var resultF=Object.keys(Color).find((key)=>Color[key]>2);
                result="クレストオブ"+Ary[resultF];
                  return result;
              }
              break;
            default:
              if(keyj3.length==1){
                var M=handtemp.findIndex(value=>value>=60 && value<=67);
                var resultF=Object.keys(Color).find((key)=>Color[key]>2);
                if(M!==-1){
                console.log('crest tumo',keyj3[0]);
                result="クレストオブ"+Ary[resultF];
                return result;
                }
              }
            break;
          }
            //ラインチェック
            var keyj2=Object.keys(Line);
            //console.log(keyj2.length);//expected 1~5
            switch(Line["0"]){
              case 2:
              case 1:
                if(keyj2.length==2){
                  console.log('line tumo',keyj2[1])
                  result=keyj2[1]+"ライン通貫"
                    return result;
                }
                break;
              default:
                 //0line->undefined
                if(keyj2.length==1){
                  console.log('line tumo')
                  result=keyj2[0]+"ライン通貫"
                    return result;
                }
              break;
            }
            //3ペアチェック 同キャラ6枚は考えないことにする
            var reachj=0;//同じキャラ2枚をカウント
            var tumoj=0;//同じキャラ3枚をカウント
            var kanj=0;
            var keyj=Object.keys(Count);
            //console.log(keyj.length);
            //Count.length->undefined
            for(var j=0;j<keyj.length;j++){
              //console.log(Count[keyj[j]]);
              if(Count[keyj[j]]==2){
                reachj+=1;
              }
              if(Count[keyj[j]]==3){
                tumoj+=1;
              }
              if(Count[keyj[j]]==4){
                kanj+=1;
              }
            }
            var Pair=tumoj+kanj;
            //カンしている可能性もあるため
            switch(Line["0"]){
              case 2:
                //ツモとなるのは3,3,1 3,2,2
                if(keyj.length==5){
                  if(Pair==2 && reachj==0){
                    console.log('chara tumo')
                    result="3ペア"
                      return result;
                  }
                  if(Pair==1 && reachj==2){
                    console.log('chara tumo')
                    result="3ペア"
                      return result;
                  }
                }
                break;
              case 1:
                //ツモとなるのは3,3,2
                if(Pair==2 && reachj==1){
                  console.log('chara tumo')
                  result="3ペア"
                    return result;
                }
                break;
              default:
                if(Pair==3){
                  console.log('chara tumo')
                  result="3ペア"
                    return result;
                }
                break;
          };
            //国士無双
            var Kokushi=[60,61,62,63,64,65,66,67,68,69]
            var Kreach=0;
            var KKreach=0;
            for(var k=1;k<handtemp.length;k++){
            var A=Kokushi.findIndex(value=>value==handtemp[k])
            if(A!==-1){
              //kokushi以外を含まない
              var B=handtemp.filter(value=>value==handtemp[k])
            KKreach+=B.length-1;//60-67でのダブリは1枚まで
            }else{
              Kreach+=1;
              break;
            }
          }
            if(KKreach==0 || KKreach==2){
                //アガリ
                console.log('kokushi tumo')
                result="国士無双"
                return result;
              }
      }
  
    function Nodyaku2(player,mode=-1){//役
      //該当するシナジーの組み合わせ（同キャラは重複しない）を判定
        //mode>=0 は右枠に表示 kの場合はhandtemp->hand1にしてください
        var result=0
        var noddes=[]
        var nodpair1
        var nodpair2
        var resultA=[0]
        var yy=210;
        var xx=635
        if(mode==-1){
          function PA(name,count){
            if(player==1){
              var A=achievetemp.findIndex(value=>value.name==name);
              if(A==-1){
                achievetemp.push({name:name,cleared:1,count:count})
              }else{
                if(count>achievetemp[A].count){
                  achievetemp[A].count=count;                
                }
                achievetemp[A].cleared+=1;
              }
            }
          }
          for(var k=0; k<Sinagy.length; k++){
              if(!getIsDuplicate(handtemp,Sinagy[k].chr)){
                 //一つでも所持していればGO
                 continue;
              };
              nodpair1=Sinagy[k].chr.concat();
              nodpair2=[];
              for(var i=0;i<nodpair1.length;i++){
                var A=handtemp.findIndex(value=>value==nodpair1[i]);
                if(A!==-1){nodpair2.push(nodpair1[i])}
              }
              if(nodpair2.length >=Sinagy[k].han[0]){
                //var B=1+Math.floor((nodpair2.length-1)/2)
                PA(Sinagy[k].id,nodpair2.length);
                var BB=Sinagy[k].han.findIndex(value=>value>nodpair2.length);
                //nodpair2.length 4 han 1,3,5 -> expected 2
                var C;
                var D;
                var Ary=["Ⅰ","Ⅱ","Ⅲ","Ⅳ","Ⅴ"]
                if(BB==-1){
                  C=Sinagy[k].han2[Sinagy[k].han2.length-1];
                  D=Ary[Sinagy[k].han2.length-1];
                }else{
                  C=Sinagy[k].han2[BB-1];
                  D=Ary[BB-1]
                };
                resultA[0]+=C
                resultA.push(Sinagy[k].id+D+" "+C+"翻")}
          };
           //属性枠
           nodpair1=handtemp.filter(value=>value>=0 && value<=3);
           nodpair2=handtemp.filter(value=>value>=12 && value<=15);
           if(nodpair1.length>=3 && nodpair2.length>=3){
             resultA[0]+=1
           PA("太陽のエル",1); 
             resultA.push("太陽のエル 1翻")}
           nodpair1=handtemp.filter(value=>value>=4 && value<=7);
           nodpair2=handtemp.filter(value=>value>=20 && value<=23);
           if(nodpair1.length>=3 && nodpair2.length>=3){
             resultA[0]+=1
             PA("水のエル",1); 
             resultA.push("水のエル 1翻")}
           nodpair1=handtemp.filter(value=>value>=8 && value<=11);
           nodpair2=handtemp.filter(value=>value>=40 && value<=43);
           if(nodpair1.length>=3 && nodpair2.length>=3){
             resultA[0]+=1
             PA("風のエル",1); 
             resultA.push("風のエル 1翻")}
           nodpair1=handtemp.filter(value=>value>=16 && value<=19);
           nodpair2=handtemp.filter(value=>value>=32 && value<=35);
           if(nodpair1.length>=3 && nodpair2.length>=3){
             resultA[0]+=1
             PA("闇のエル",1); 
             resultA.push("闇のエル 1翻")}
           nodpair1=handtemp.filter(value=>value>=28 && value<=31);
           nodpair2=handtemp.filter(value=>value>=36 && value<=39);
           if(nodpair1.length>=3 && nodpair2.length>=3){
             resultA[0]+=1
             PA("火のエル",1); 
             resultA.push("火のエル 1翻")}
           nodpair1=handtemp.filter(value=>value>=24 && value<=27);
           nodpair2=handtemp.filter(value=>value>=48 && value<=51);
           var nodpair3=handtemp.filter(value=>value>=56 && value<=59);
           if(nodpair1.length + nodpair2.length + nodpair3.length>=6){
             resultA[0]+=1
             PA("大地のエル",1); 
             resultA.push("大地のエル 1翻")}
           nodpair1=handtemp.filter(value=>value>=44 && value<=47);
           nodpair2=handtemp.filter(value=>value>=52 && value<=55);
           if(nodpair1.length==3 && nodpair2.length==3){
             resultA[0]+=1
             PA("月のエル",1); 
             resultA.push("月のエル 1翻")}
          console.log(resultA)
          return resultA
        }
        if(mode>-1){
          //今度は逆に選択中のパイが可能な役を表示
          //nodpair1 -> Sinagy[P].chr に置き換え
          function YakuDT(word){
            nodpair2=[];
            var P=Sinagy.findIndex(value=>value.id==word);
            for(var i=0;i<Sinagy[P].chr.length;i++){
              var A=hand1.findIndex(value=>value==Sinagy[P].chr[i]);
              if(A!==-1){nodpair2.push(Sinagy[P].chr[i])}
            }
            var t = new createjs.Text(word, "bold 18px Arial", "white");
            t.x=xx;
            t.y=yy;
            guidemap.addChild(t);
            yy+=22;
            var tt = new createjs.Text("（"+nodpair2.length+" / "+Sinagy[P].chr.length+"）", "18px Arial", "white");
            tt.x=xx+160;
            tt.y=yy;
            tt.textAlign="right";
            guidemap.addChild(tt);
            yy+=25;
            if(nodpair2.length >=Sinagy[P].han[Sinagy[P].han.length-1]){
              t.color= "#ff4c38";
              tt.color= "#ff4c38";
            }else if(nodpair2.length >=Sinagy[P].han[0] || (Sinagy[P].han.length>1 && nodpair2.length >=Sinagy[P].han[Sinagy[P].han.length-2])){
              t.color= "#388eff";
              tt.color= "#388eff";
            }
          }
          switch(mode){
            case 0://エル
              YakuDT("原初的な動き");
              YakuDT("正義を貫徹する者");
              break;
            case 1:
              YakuDT("属性鍛錬者");
              YakuDT("魔法特化");
              break;
            case 2:
              YakuDT("敏捷さ");
              YakuDT("巨人審判者");
              break;
            case 3:
              YakuDT("鋭さ");
              YakuDT("正義を貫徹する者");
              break;
            case 4://アイ
              YakuDT("探求する者");
              YakuDT("属性鍛錬者");
              break;
            case 5:
              YakuDT("マナ守護");
              YakuDT("渇望");
              break;
            case 6:
              YakuDT("物理特化");
              YakuDT("時空間");
              break;
            case 7:
              YakuDT("探求する者");
              YakuDT("渇望");
              break;
            case 8://レナ
              YakuDT("精霊の加護");
              YakuDT("敏捷さ");
              break;
            case 9:
              YakuDT("精霊の加護");
              YakuDT("鋭さ");
              break;
            case 10:
              YakuDT("精霊の加護");
              YakuDT("物理特化");
              break;
            case 11:
              YakuDT("精霊の加護");
              YakuDT("魔法特化");
              break;
            case 12://ヴン
              YakuDT("原初的な動き");
              YakuDT("敏捷さ");
              break;
            case 13:
              YakuDT("魔法特化");
              YakuDT("殴り合い");
              break;
            case 14:
              YakuDT("痛いから問題ない");
              YakuDT("巨人審判者");
              break;
            case 15:
              YakuDT("渇望");
              YakuDT("物理特化");
              break;
            case 16://イヴ
              YakuDT("ナソード研究");
              YakuDT("鋭さ");
              break;
            case 17:
              YakuDT("ナソード研究");
              YakuDT("探求する者");
              break;
            case 18:
              YakuDT("ナソード研究");
              YakuDT("戦場の天使");
              break;
            case 19:
              YakuDT("鋭さ");
              YakuDT("歪曲された視線");
              break;
            case 20://ラシェ
            YakuDT("正義を貫徹する者");
            YakuDT("属性鍛錬者");
              break;
            case 21:
              YakuDT("敏捷さ");
              YakuDT("魔法特化");
              break;
            case 22:
              YakuDT("探求する者");
              YakuDT("巨人審判者");
              break;
            case 23:
              YakuDT("痛いから問題ない");
              YakuDT("戦場の天使");
              break;
            case 24://アラ
              YakuDT("貫徹する足取り");
              YakuDT("正義を貫徹する者");
              break;
            case 25:
              YakuDT("豊かな足取り");
              YakuDT("渇望");
              break;
            case 26:
              YakuDT("上手な足取り");
              YakuDT("マナ守護");
                break;
            case 27:
              YakuDT("交感の足取り");
              YakuDT("痛いから問題ない");
                break;
            case 28://エリ
              YakuDT("原初的な動き");
              YakuDT("正義を貫徹する者");
              break;
            case 29:
              YakuDT("属性鍛錬者");
              YakuDT("鋭さ");
                break;
            case 30:
              YakuDT("痛いから問題ない");
              YakuDT("渇望");
                break;
            case 31:
              YakuDT("敏捷さ");
              YakuDT("鋭さ");
                break;
            case 32://エド
              YakuDT("魔法特化");
              YakuDT("殴り合い");
              break;
            case 33:
              YakuDT("探求する者");
              YakuDT("ナソード研究");
              break;
            case 34:
              YakuDT("時空間");
              YakuDT("渇望");
              break;
            case 35:
              YakuDT("探求する者");
              YakuDT("物理特化");
              break;
            case 36://ルシ
              YakuDT("魔族");   
              YakuDT("物理特化"); 
                break;
            case 37:
              YakuDT("魔族");
              YakuDT("鋭さ");   
              break;
            case 38:
              YakuDT("魔族");
              YakuDT("渇望"); 
              break;
            case 39:
              YakuDT("魔族");
              YakuDT("痛いから問題ない"); 
              break;
              case 44://アイン
              YakuDT("正義を貫徹する者");
              YakuDT("巨人審判者");
              break;  
              case 45:
                YakuDT("魔法特化");
                YakuDT("痛いから問題ない");
                break;
              case 46:
                YakuDT("時空間");
                YakuDT("渇望"); 
                break;
              case 47:
                YakuDT("渇望");
                YakuDT("歪曲された視線"); 
                break;
              case 48://らび
              YakuDT("殴り合い");
              YakuDT("鋭さ");
                break;
              case 49:
                YakuDT("マナ守護");
                YakuDT("痛いから問題ない");
                break;
              case 50:
                YakuDT("物理特化"); 
                YakuDT("ラビィの友達"); 
                break;
              case 51:
                YakuDT("魔法特化"); 
                YakuDT("悪戯の王"); 
                break;
              case 52://ノア
                YakuDT("敏捷さ");
                YakuDT("物理特化"); 
                break;
              case 53:
                YakuDT("探求する者");
                YakuDT("巨人審判者");
                break;
              case 54:
                YakuDT("痛いから問題ない");
                YakuDT("鋭さ");
                break;
              case 55:
                YakuDT("巨人審判者");
                YakuDT("歪曲された視線");
                break;
              case 40://ロゼ
              YakuDT("鋭さ");
              YakuDT("巨人審判者");
                break;
              case 41:
                YakuDT("敏捷さ");
                YakuDT("渇望"); 
                break;
              case 42:
                YakuDT("物理特化"); 
                YakuDT("戦場の天使"); 
                break;
              case 43:
                YakuDT("機械工学"); 
                YakuDT("探求する者"); 
                break;
                case 56://リティちゃ
                YakuDT("ナソード研究");
                YakuDT("巨人審判者");
                  break;
                case 57:
                  YakuDT("物理特化");
                  YakuDT("痛いから問題ない"); 
                  break;
                case 58:
                  YakuDT("魔法特化"); 
                  YakuDT("鋭さ"); 
                  break;
                case 59:
                  YakuDT("渇望"); 
                  YakuDT("歪曲された視線"); 
                  break;
                case 60://マスター
                  YakuDT("殴り合い"); 
                  break;
                case 61:
                YakuDT("マナ守護"); 
                break;
                case 62:
                YakuDT("魔族"); 
                break;
                case 63:
                  YakuDT("歪曲された視線"); 
                  break;
                case 64:
                  YakuDT("正義を貫徹する者"); 
                  break;
                case 65:
                  YakuDT("ナソード研究"); 
                  break;
                case 66:
                  YakuDT("精霊の加護"); 
                  break;
                case 67:
                  YakuDT("エルの巫女"); 
                  break;
                }
        }
      }
   
    function Reachwait(num,p=1){
      //hand1のnum番目を切った場合に何待ちなのか3枚くらいパイを表示する
      //0に○○待ちの文字、1~3に待ちパイ
      //p->player
      //num -1->現在の手パイで判定 -2->残パイを無視（予定）
      console.log('Reachwait',num,p)
      var Count={};
      var Line={};
      var Color={};
      var Result=[];
      Result.push("ノーテン");
      switch(p){
        case 1:
          handtemp = hand1.concat(pon1);
          if(kan1.length){
            var A=kan1.concat();
            if(kan1.length>=8){
              A.splice(4,1);
            }
            if(kan1.length>=4){
              A.splice(0,1);
            }
            handtemp = handtemp.concat(A);
          }
          break;
        case 2:
          handtemp = hand2.concat(pon2);
          if(kan2.length){
            var A=kan2.concat();
            if(kan2.length>=8){
              A.splice(4,1);
            }
            if(kan2.length>=4){
              A.splice(0,1);
            }
            handtemp = handtemp.concat(A);
          }
          break;
        case 3:
          handtemp = hand3.concat(pon3);
          if(kan3.length){
            var A=kan3.concat();
            if(kan3.length>=8){
              A.splice(4,1);
            }
            if(kan3.length>=4){
              A.splice(0,1);
            }
            handtemp = handtemp.concat(A);
          }
          break;
        case 4:
          handtemp = hand4.concat(pon4);
          if(kan4.length){
            var A=kan4.concat();
            if(kan4.length>=8){
              A.splice(4,1);
            }
            if(kan4.length>=4){
              A.splice(0,1);
            }
            handtemp = handtemp.concat(A);
          }
          break;
      }
            //下でCがエラー吐いたので
            if(num>=0){handtemp.splice(num,1)}else{
              var X=handtemp.findIndex(value=>value==100)
                if(X!==-1){handtemp.splice(X,1);};
            };
            handtemp.sort(compareFunc);
            for(var i=1; i<handtemp.length;i++){
              var C=donpai.findIndex(value=>value.id==handtemp[i])
              var elm=donpai[C].name;
              var elm2=donpai[C].line
              var elm3=donpai[C].color;
              Count[elm]=(Count[elm] || 0)+1
              Line[elm2]=(Line[elm2] || 0)+1
              Color[elm3]=(Color[elm3] || 0)+1
            }
            //ラインチェック
            var keyj2=Object.keys(Line);
            var keyj3=Object.keys(Color);
            switch(Line["0"]){
              case 2:
              case 1:
                if(keyj2.length==2){
                  var resultF=Object.keys(Line).find((key)=>Line[key]>=5);//->あればlineが帰ってくる
                  if(resultF !==undefined){
                    Result[0]=resultF+"ライン待ち"
                    resultF-=1;
                    var E=donpai.filter(value=>value.id<68 && value.id%4==resultF);
                    for(var i=0; i<E.length ; i++){
                  if(Remaincheck(E[i].id)){
                    Result.push(E[i].id);
                  }
                  if(Result.length>5){break;}
                }
                }
              }
                break;
              default:
                if(keyj2.length==1){
                  var resultF=Object.keys(Line).find((key)=>Line[key]>=5);//->あればlineが帰ってくる
                  if(resultF !==undefined){
                    Result[0]=resultF+"ライン待ち"
                    resultF-=1;
                    var E=donpai.filter(value=>value.id<68 && value.id%4==resultF);
                    for(var i=0; i<E.length ; i++){
                  if(Remaincheck(E[i].id)){
                    Result.push(E[i].id);
                  }
                  if(Result.length>5){break;}
                }
                }
              }
              break;
            }
            //3ペアチェック 同キャラ6枚は考えないことにする
            var reachj=0;//同じキャラ2枚をカウント
            var tumoj=0;//同じキャラ3枚をカウント
            var kanj=0;//同じキャラ4枚をカウント
            var keyj=Object.keys(Count);
            for(var j=0;j<keyj.length;j++){
              if(Count[keyj[j]]==2){
                reachj+=1;
              }
              if(Count[keyj[j]]==3){
                tumoj+=1;
              }
              if(Count[keyj[j]]==4){
                kanj+=1;
              }
            }
            switch(Line["0"]){
              case 2:
                //リーチとなるのは3,3+1+1 3,2,1+1+1 2,2,2+1+1
                if(keyj.length==5){
                  if(tumoj==1 && reachj==1){
                    var resultF=Object.keys(Count).find((key)=>Count[key]==2);//->あればキャラ名が帰ってくる
                    var resultG=Object.keys(Count).filter((key)=>Count[key]==1);//->あればキャラ名が帰ってくる
                    for(var i=0;i<resultG.length;i++){
                      if(resultG[i]=="アリエル"||resultG[i]=="ルリエル"){resultG.splice(i,1)}
                    }
                    Result[0]=resultF+","+resultG[0]+"待ち"
                    var E=donpai.filter(value=>value.name==resultF ||value.name==resultG[0]);
                    for(var i=0; i<E.length ; i++){
                  if(Remaincheck(E[i].id)){
                    Result.push(E[i].id);
                  }
                  if(Result.length>5){break;}
                }
                  }
                  if(tumoj==0 && reachj==3){
                    var resultF=Object.keys(Count).filter((key)=>Count[key]==2);//->あればキャラ名が帰ってくる
                    Result[0]=resultF[0]+","+resultF[1]+","+resultF[2]+"待ち"
                    var E=donpai.filter(value=>value.name==resultF[0] ||value.name==resultF[1] ||value.name==resultF[2]);
                    for(var i=0; i<E.length ; i++){
                  if(Remaincheck(E[i].id)){
                    Result.push(E[i].id);
                  }
                  if(Result.length>5){break;}
                }
                  }
                }
                if(keyj.length==4){
                  if(tumoj==2){
                    Result[0]="全待ち"
                    for(var i=0; i<70 ; i++){
                      if(Remaincheck(i)){
                        Result.push(i);
                      }
                      if(Result.length>5){break;}
                    }
                  }
                }
                break;
              case 1:
                //3,3,1+1 3,2,2+1
                if(keyj.length==4){
                  if(tumoj==2 && reachj==0){
                    var resultF=Object.keys(Count).find((key)=>Count[key]==1);//->あればキャラ名が帰ってくる
                    console.log(resultF);
                    Result[0]=resultF+"待ち"
                    var E=donpai.filter(value=>value.name==resultF);
                    for(var i=0; i<E.length ; i++){
                  if(Remaincheck(E[i].id)){
                    Result.push(E[i].id);
                  }
                  if(Result.length>5){break;}
                }
                  }
                  if(tumoj==1 && reachj==2){
                    var resultF=Object.keys(Count).filter((key)=>Count[key]==2);//->あればキャラ名が帰ってくる
                    console.log(resultF);
                    Result[0]=resultF[0]+","+resultF[1]+"待ち"
                    var E=donpai.filter(value=>value.name==resultF[0] || value.name==resultF[1]);
                    for(var i=0; i<E.length ; i++){
                  if(Remaincheck(E[i].id)){
                    Result.push(E[i].id);
                  }
                  if(Result.length>5){break;}
                }
                  }
                }
                break;
              default:
                //3ペアでリーチ後の待ちは3,3,2だけ
                if(tumoj==2 && reachj==1){
                  //アガリ
                  var resultF=Object.keys(Count).find((key)=>Count[key]==2);
                  //->あればキャラ名が帰ってくる
                  Result[0]=resultF+"待ち"
                  var E=donpai.filter(value=>value.name==resultF);
                  for(var i=0; i<E.length ; i++){
                if(Remaincheck(E[i].id)){
                  Result.push(E[i].id);
                }
                if(Result.length>5){break;}
              }
                }
                break;
          };
          //クレスト：同じ属性9枚、マスターロードを含む
          //リーチ後の待ちはラインと同じ
          var Ary=["0","ソーレス","デニフ","ベントス","アドリアン","ガイア","ロッソ","ハルニエ"];
        switch(Color["0"]){
          case 2:
          case 1:
            //オールマイティをマスロパイ代わりにすることで判定を無視
            if(keyj3.length==2){
              console.log('crest tumo',keyj3[1]);
              var resultF=Object.keys(Color).find((key)=>Color[key]>2);
              Result[0]="クレストオブ"+Ary[resultF];
              var E=donpai.filter(value=>value.color==resultF);
              for(var i=0; i<E.length ; i++){
                if(Remaincheck(E[i].id)){
                  Result.push(E[i].id);
                }
                if(Result.length>5){break;}
              }
            }
            break;
          default:
            if(keyj3.length==1){
              var M=handtemp.findIndex(value=>value>=60 && value<=67);
              var resultF=Object.keys(Color).find((key)=>Color[key]>2);
              console.log(resultF);
              Result[0]="クレストオブ"+Ary[resultF];
              if(M!==-1){
              var E=donpai.filter(value=>value.color==resultF);
              if(E.length){
              for(var i=0; i<E.length ; i++){
                if(Remaincheck(E[i].id)){
                  Result.push(E[i].id);
                }
                if(Result.length>5){break;}
              }};
              }else{
                //マスロパイ待ち
                console.log('crest reach')
                var E=donpai.filter(value=>value.color==resultF && value.id>=60);
                  if(E.length && Remaincheck(E[i].id)){
                    Result.push(E[i].id);
                  }
              }
            }
          break;
        }
        //国士無双
        var Kokushi=[60,61,62,63,64,65,66,67,68,69]
        var KokushiM=[60,61,62,63,64,65,66,67]
        var resultF=KokushiM.concat();
        var Kreach=0;
        var KKreach=0;
        for(var k=1;k<handtemp.length;k++){
          var A=Kokushi.findIndex(value=>value==handtemp[k])
          if(A!==-1){
            var C=resultF.findIndex(value=>value==handtemp[k])
            if(C!==-1){resultF.splice(C,1)};
            var B=handtemp.filter(value=>value==handtemp[k])
          KKreach+=B.length-1;
        }else{Kreach+=1}
          if(Kreach>2){break;}
          }
        if(Kreach==0){
            //国士
            console.log(Kreach,KKreach,resultF);
            if(KKreach==0){
            //8面待ちになる
            Result[0]="国士無双"
            for(var i=0; i<KokushiM.length ; i++){
              if(Remaincheck(KokushiM[i])){
                Result.push(KokushiM[i]);
              }
              if(Result.length>5){break;}
            }
            }else if(KKreach==2 || KKreach==4){
            Result[0]="国士無双"
            for(var i=0; i<resultF.length ; i++){
              if(Remaincheck(resultF[i])){
                Result.push(resultF[i]);
              }
            }}
        }
          return Result;
    }  
    function Pon(player,num=-1){//自分の同じキャラ2枚+前の人が切った同じキャラを除外
      if(num==-1){
        //ポンできるかどうかの判定
        console.log('pon'+player,reach[player]);
        if(reach[player]==3){
          //立直しているならポンできない
          return false;
        }
        if(tumotemp>=60 && tumotemp<=69){
          //マスターロード・オールマイティはポンできない、ポンに使えない
          return false;
        }
        handtemp=[];
        switch(player){
          case 1:
            if(pon1.length>=6){
              //ポンすると手札がなくなるZE
              return false;
            }
            //ponsw[1]=0;
            handtemp = hand1.concat();
          break;
          case 2:
            if(pon2.length>=6){
              return false;
            }
            handtemp = hand2.concat();
          break;
          case 3:
            if(pon3.length>=6){
              return false;
            }
            handtemp = hand3.concat();
          break;
          case 4:
            if(pon4.length>=6){
              return false;
            }
            handtemp = hand4.concat();
          break;
        }
          var A=Math.floor(tumotemp/4);
          var B=handtemp.filter(value=>value>=4*A && value<4*(A+1));
          if(B.length>=2){ponsw[player]=1;
            return true;
          }
              }else{
        handtemp=[];
        switch(player){
          case 1:
            handtemp = hand1.concat();
          break;
          case 2:
            handtemp = hand2.concat();
          break;
          case 3:
            handtemp = hand3.concat();
          break;
          case 4:
            handtemp = hand4.concat();
          break;
        }
        var pp=handtemp.findIndex(value=>value==100);
        if(pp==-1){
          console.log('pon error!',handtemp)
          return false;
        }
          handtemp[pp]=tumotemp;
          handtemp.sort(compareFunc);
      switch(player){
        case 1:
          //ポンする組み合わせは考えないものとする
          //ポンされたパイを塗りつぶす
          var s = new createjs.Shape();
            s.graphics.beginFill("rgba(20,20,20,0.5)");
          if(Reverse){
            if(ippatu[2]==1){
              s.graphics.drawRect(riverx[2]-10.5, rivery[2]+5.25, 43.5, 33);
            }else{
              s.graphics.drawRect(riverx[2], rivery[2], 33, 43.5);
            }
          }else{
            if(ippatu[4]==1){
              s.graphics.drawRect(riverx[4]-10.5, rivery[4]+5.25, 43.5, 33);
            }else{
              s.graphics.drawRect(riverx[4], rivery[4], 33, 43.5);
            }
          }
          field.addChild(s);
          cLock=0;
          hand1.splice(pp,1)
            var A=Math.floor(num/4);
          var pA=hand1.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponA=hand1.splice(pA,1)
          var pB=hand1.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponB=hand1.splice(pB,1)
          pon1.unshift(num,ponA[0],ponB[0])
          console.log(hand1.length,hand1);
          ponkandraw(player);
          //一発を潰す
          for(var i=1;i<5;i++){
            if(ippatu[i]==1){
              ippatu[i]=2;
            }
          }
            PonAnimation(player);
          break;
        case 2:
          var s = new createjs.Shape();
          s.graphics.beginFill("rgba(20,20,20,0.5)");
        if(Reverse){
          if(ippatu[3]==1){
            s.graphics.drawRect(riverx[3]-10.5, rivery[3]+5.25, 43.5, 33);
          }else{
            s.graphics.drawRect(riverx[3], rivery[3], 33, 43.5);
          }
        }else{
          if(ippatu[1]==1){
            s.graphics.drawRect(riverx[1]-10.5, rivery[1]+5.25, 43.5, 33);
          }else{
            s.graphics.drawRect(riverx[1], rivery[1], 33, 43.5);
          }
        }
        field.addChild(s);
          hand2.splice(pp,1)
            var A=Math.floor(num/4);
          var pA=hand2.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponA=hand2.splice(pA,1)
          var pB=hand2.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponB=hand2.splice(pB,1)
          pon2.unshift(num,ponA[0],ponB[0])
          ponkandraw(player);
          //一発を潰す
          for(var i=1;i<5;i++){
            if(ippatu[i]==1){
              ippatu[i]=2;
            }
          }
        PonAnimation(player);
          break;
        case 3:
          var s = new createjs.Shape();
          s.graphics.beginFill("rgba(20,20,20,0.5)");
        if(Reverse){
            if(ippatu[4]==1){
              s.graphics.drawRect(riverx[4]-10.5, rivery[4]+5.25, 43.5, 33);
            }else{
              s.graphics.drawRect(riverx[4], rivery[4], 33, 43.5);
            }
        }else{
          if(ippatu[2]==1){
            s.graphics.drawRect(riverx[2]-10.5, rivery[2]+5.25, 43.5, 33);
          }else{
            s.graphics.drawRect(riverx[2], rivery[2], 33, 43.5);
          }
        }
        field.addChild(s);
          hand3.splice(pp,1)
            var A=Math.floor(num/4);
          var pA=hand3.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponA=hand3.splice(pA,1)
          var pB=hand3.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponB=hand3.splice(pB,1)
          pon3.unshift(num,ponA[0],ponB[0])
          ponkandraw(player);
              //一発を潰す
        for(var i=1;i<5;i++){
          if(ippatu[i]==1){
            ippatu[i]=2;
          }
        }
        PonAnimation(player);
          break;
        case 4:
          var s = new createjs.Shape();
          s.graphics.beginFill("rgba(20,20,20,0.5)");
        if(Reverse){
            if(ippatu[1]==1){
              s.graphics.drawRect(riverx[1]-10.5, rivery[1]+5.25, 43.5, 33);
            }else{
              s.graphics.drawRect(riverx[1], rivery[1], 33, 43.5);
            }
        }else{
          if(ippatu[3]==1){
            s.graphics.drawRect(riverx[3]-10.5, rivery[3]+5.25, 43.5, 33);
          }else{
            s.graphics.drawRect(riverx[3], rivery[3], 33, 43.5);
          }
        }
        field.addChild(s);
          hand4.splice(pp,1)
            var A=Math.floor(num/4);
          var pA=hand4.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponA=hand4.splice(pA,1)
          var pB=hand4.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponB=hand4.splice(pB,1)
          pon4.unshift(num,ponA[0],ponB[0])
          ponkandraw(player);
              //一発を潰す
          for(var i=1;i<5;i++){
            if(ippatu[i]==1){
              ippatu[i]=2;
            }
          }
        PonAnimation(player);
      break;
      }
    }
    }
    function Kan(player,num=-1){
      console.log('Kan',player,num);
    if(num==-2){
      //自分ターンのカン
      var handtest=[];
      var tumoP;
      switch(player){
        case 1:
          tumoP=hand1[hand1.length-1]
          handtest=hand1.concat(pon1);
          break;
        case 2:
          tumoP=hand2[hand2.length-1]
          handtest=hand2.concat(pon2);
          break;
        case 3:
          tumoP=hand3[hand3.length-1]
          handtest=hand3.concat(pon3);
          break;
        case 4:
          tumoP=hand4[hand4.length-1]
          handtest=hand4.concat(pon4);
          break;
      }
      if(reach[player]==3){
        //立直中は引いたパイでのみ可能
        if(tumoP>=60 && tumoP<=69){
          //マスターロード・オールマイティはカンできない
          return false;
        }
          var A=Math.floor(tumoP/4);
          var B=handtest.filter(value=>value>=4*A && value<4*(A+1));
          if(B.length==4){kansw[player]=1;
            return true;
          }
        return false;
      }
          var Count={};
          for(var i=1; i<handtest.length;i++){
          var C=donpai.findIndex(value=>value.id==handtest[i] && value.id<60)
          if(C!==-1){
          var elm=donpai[C].name;
          Count[elm]=(Count[elm] || 0)+1
          }}
          var keyj=Object.keys(Count);
          for(var j=0;j<keyj.length;j++){
          if(Count[keyj[j]]==4){
            //同じキャラ4枚以上をカウント
            return true;
          }
        }
    }else if(num==-1){
        //相手ターンのカン　未調整
        //return false;
        if(reach[player]==3){
          //立直しているなら明カンできない
          return false;
        }
        if(tumotemp>=60 && tumotemp<=69){
          //マスターロード・オールマイティはカンできない
          return false;
        }
        handtemp=[];
        switch(player){
          case 1:
            if(pon1.length+kan1.length>=6){
              //ポンすると手札がなくなるZE
              return false;
            }
            handtemp = hand1.concat();
          break;
          case 2:
            if(pon2.length+kan2.length>=6){
              return false;
            }
            handtemp = hand2.concat();
          break;
          case 3:
            if(pon3.length+kan3.length>=6){
              return false;
            }
            handtemp = hand3.concat();
          break;
          case 4:
            if(pon4.length+kan4.length>=6){
              return false;
            }
            handtemp = hand4.concat();
          break;
        }
          var A=Math.floor(tumotemp/4);
          var B=handtemp.filter(value=>value>=4*A && value<4*(A+1));
          if(B.length>=3){kansw[player]=1;
            return true;
          }
      }else{
        //実際にカンする動き
        if(num==100){
          //ポンしているパイでカンできる時（加カン）はそっちを優先
        switch(player){
          case 1:
            if(reach[player]==3){
              var N=hand1[hand1.length-1]
                var M=Math.floor(N/4);
                if(pon1.length>=3){
                  var A=Math.floor(pon1[0]/4);
                  if(A==M){
                    hand1.splice(hand1.length-1,1);
                    kan1.unshift(N,pon1[0],pon1[1],pon1[2]);
                    pon1.splice(0,3);
                    hand1.push(100);
                    ponkandraw(player);
                    NukiAnimation(player,N);
                    return true;
                  }
                }
                if(pon1.length>=6){
                  var A=Math.floor(pon1[3]/4);
                  if(A==M){
                    hand1.splice(hand1.length-1,1);
                    kan1.unshift(N,pon1[3],pon1[4],pon1[5]);
                    pon1.splice(3,3);
                    hand1.push(100);
                    ponkandraw(player);
                    NukiAnimation(player,N);
                    return true;
                  }
                }
                var handtest=[];
                handtest=hand1.concat();
                var A=handtest.filter(value=>value>=M*4 && value<(M+1)*4)
                if(A.length>=4){
                  for(var i=0;i<4;i++){
                    var pA=hand1.findIndex(value=>value>=M*4 && value<(M+1)*4);
                    var kanA=hand1.splice(pA,1);
                    kan1.unshift(kanA);
                    };
                  hand1.push(100);
                  ponkandraw(player);
                  NukiAnimation(player,-1);
                }
              return false;
            }
            if(pon1.length>=3){
              var A=Math.floor(pon1[0]/4);
              var B=hand1.findIndex(value=>value>=4*A && value<4*(A+1));
              if(B!==-1){
                var N=hand1.splice(B,1);
                kan1.unshift(N,pon1[0],pon1[1],pon1[2]);
                pon1.splice(0,3);
                //かきなおす
                hand1.push(100);
                ponkandraw(player);
                NukiAnimation(player,N);
                return true;
              }
            };
            if(pon1.length>=6){
              var A=Math.floor(pon1[3]/4);
              var B=hand1.findIndex(value=>value>=4*A && value<4*(A+1));
              if(B!==-1){
                var N=hand1.splice(B,1);
                kan1.unshift(N,pon1[3],pon1[4],pon1[5]);
                pon1.splice(3,3);
                hand1.push(100);
                ponkandraw(player);
                NukiAnimation(player,N);
                return true;
              }
            };
            //手札のみ4枚 この場合は槍槓できない
            var handtest=[];
            var A;
            handtest=hand1.concat();
            var Count={};
            for(var i=1; i<handtest.length;i++){
            var C=donpai.findIndex(value=>value.id==handtest[i])
            if(C!==-1){
              var elm=donpai[C].name;
              Count[elm]=(Count[elm] || 0)+1
              }
            }
            var resultF=Object.keys(Count).filter((key)=>Count[key]>=4);
            if(resultF.length){
              var E=donpai.findIndex(value=>value.name==resultF[0]);
              for(var i=0;i<4;i++){
                var pA=hand1.findIndex(value=>value>=E && value<E+4);
                var kanA=hand1.splice(pA,1);
                kan1.unshift(kanA);
                };
              hand1.push(100);
              ponkandraw(player);
              NukiAnimation(player,-1);
            }
            break;
          case 2:
            if(reach[player]==3){
              var N=hand2[hand2.length-1]
                var M=Math.floor(N/4);
                if(pon2.length>=3){
                  var A=Math.floor(pon2[0]/4);
                  if(A==M){
                    hand2.splice(hand2.length-1,1);
                    kan2.unshift(N,pon2[0],pon2[1],pon2[2]);
                    pon2.splice(0,3);
                    hand2.push(100);
                    ponkandraw(player);
                    NukiAnimation(player,N);
                    return true;
                  }
                }
                if(pon2.length>=6){
                  var A=Math.floor(pon2[3]/4);
                  if(A==M){
                    hand2.splice(hand2.length-1,1);
                    kan2.unshift(N,pon2[3],pon2[4],pon2[5]);
                    pon2.splice(3,3);
                    hand2.push(100);
                    ponkandraw(player);
                    NukiAnimation(player,N);
                    return true;
                  }
                }
                var handtest=[];
                handtest=hand2.concat();
                var A=handtest.filter(value=>value>=M*4 && value<(M+1)*4)
                if(A.length>=4){
                  for(var i=0;i<4;i++){
                    var pA=hand2.findIndex(value=>value>=M*4 && value<(M+1)*4);
                    var kanA=hand2.splice(pA,1);
                    kan2.unshift(kanA);
                    };
                  hand2.push(100);
                  ponkandraw(player);
                  NukiAnimation(player,-1);
                }
              return false;
            }
            if(pon2.length>=3){
              var A=Math.floor(pon2[0]/4);
              var B=hand2.findIndex(value=>value>=4*A && value<4*(A+1));
              if(B!==-1){
                var N=hand2.splice(B,1);
                kan2.unshift(N,pon2[0],pon2[1],pon2[2]);
                pon2.splice(0,3);
                //かきなおす
                hand2.push(100);
                ponkandraw(player);
                NukiAnimation(player,N);
                return true;
              }
            };
            if(pon2.length>=6){
              var A=Math.floor(pon2[3]/4);
              var B=hand2.findIndex(value=>value>=4*A && value<4*(A+1));
              if(B!==-1){
                var N=hand2.splice(B,1);
                kan2.unshift(N,pon2[3],pon2[4],pon2[5]);
                pon2.splice(3,3);
                hand2.push(100);
                ponkandraw(player);
                NukiAnimation(player,N);
                return true;
              }
            };
            //手札のみ4枚 この場合は槍槓できない
            var handtest=[];
            var A;
            handtest=hand2.concat();
            var Count={};
            for(var i=1; i<handtest.length;i++){
            var C=donpai.findIndex(value=>value.id==handtest[i])
            if(C!==-1){
              var elm=donpai[C].name;
              Count[elm]=(Count[elm] || 0)+1
              }
            }
            var resultF=Object.keys(Count).filter((key)=>Count[key]>=4);
            if(resultF.length){
              var E=donpai.findIndex(value=>value.name==resultF[0]);
              for(var i=0;i<4;i++){
                var pA=hand2.findIndex(value=>value>=E && value<E+4);
                var kanA=hand2.splice(pA,1);
                kan2.unshift(kanA);
                };
              hand2.push(100);
              ponkandraw(player);
              NukiAnimation(player,-1);
            }
            break;
          case 3:
            if(reach[player]==3){
              var N=hand3[hand3.length-1]
                var M=Math.floor(N/4);
                if(pon3.length>=3){
                  var A=Math.floor(pon3[0]/4);
                  if(A==M){
                    hand3.splice(hand3.length-1,1);
                    kan3.unshift(N,pon3[0],pon3[1],pon3[2]);
                    pon3.splice(0,3);
                    hand3.push(100);
                    ponkandraw(player);
                    NukiAnimation(player,N);
                    return true;
                  }
                }
                if(pon3.length>=6){
                  var A=Math.floor(pon3[3]/4);
                  if(A==M){
                    hand3.splice(hand1.length-1,1);
                    kan3.unshift(N,pon3[3],pon3[4],pon3[5]);
                    pon3.splice(3,3);
                    hand3.push(100);
                    ponkandraw(player);
                    NukiAnimation(player,N);
                    return true;
                  }
                }
                var handtest=[];
                handtest=hand3.concat();
                var A=handtest.filter(value=>value>=M*4 && value<(M+1)*4)
                if(A.length>=4){
                  for(var i=0;i<4;i++){
                    var pA=hand3.findIndex(value=>value>=M*4 && value<(M+1)*4);
                    var kanA=hand3.splice(pA,1);
                    kan3.unshift(kanA);
                    };
                  hand3.push(100);
                  ponkandraw(player);
                  NukiAnimation(player,-1);
                }
              return false;
            }
            if(pon3.length>=3){
              var A=Math.floor(pon3[0]/4);
              var B=hand3.findIndex(value=>value>=4*A && value<4*(A+1));
              if(B!==-1){
                var N=hand3.splice(B,1);
                kan3.unshift(N,pon3[0],pon3[1],pon3[2]);
                pon3.splice(0,3);
                //かきなおす
                hand3.push(100);
                ponkandraw(player);
                NukiAnimation(player,N);
                return true;
              }
            };
            if(pon3.length>=6){
              var A=Math.floor(pon3[3]/4);
              var B=hand3.findIndex(value=>value>=4*A && value<4*(A+1));
              if(B!==-1){
                var N=hand3.splice(B,1);
                kan3.unshift(N,pon3[3],pon3[4],pon3[5]);
                pon3.splice(3,3);
                hand3.push(100);
                ponkandraw(player);
                NukiAnimation(player,N);
                return true;
              }
            };
            //手札のみ4枚 この場合は槍槓できない
            var handtest=[];
            var A;
            handtest=hand3.concat();
            var Count={};
            for(var i=1; i<handtest.length;i++){
            var C=donpai.findIndex(value=>value.id==handtest[i])
            if(C!==-1){
            var elm=donpai[C].name;
            Count[elm]=(Count[elm] || 0)+1
            }
            }
            var resultF=Object.keys(Count).filter((key)=>Count[key]>=4);
            if(resultF.length){
              var E=donpai.findIndex(value=>value.name==resultF[0]);
              for(var i=0;i<4;i++){
                var pA=hand3.findIndex(value=>value>=E && value<E+4);
                var kanA=hand3.splice(pA,1);
                kan3.unshift(kanA);
                };
              hand3.push(100);
              ponkandraw(player);
              NukiAnimation(player,-1);
            }
            break;
          case 4:
            if(reach[player]==3){
              var N=hand4[hand4.length-1]
                var M=Math.floor(N/4);
                if(pon4.length>=3){
                  var A=Math.floor(pon4[0]/4);
                  if(A==M){
                    hand4.splice(hand4.length-1,1);
                    kan4.unshift(N,pon4[0],pon4[1],pon4[2]);
                    pon4.splice(0,3);
                    hand4.push(100);
                    ponkandraw(player);
                    NukiAnimation(player,N);
                    return true;
                  }
                }
                if(pon4.length>=6){
                  var A=Math.floor(pon4[3]/4);
                  if(A==M){
                    hand4.splice(hand4.length-1,1);
                    kan4.unshift(N,pon4[3],pon4[4],pon4[5]);
                    pon4.splice(3,3);
                    hand4.push(100);
                    ponkandraw(player);
                    NukiAnimation(player,N);
                    return true;
                  }
                }
                var handtest=[];
                handtest=hand4.concat();
                var A=handtest.filter(value=>value>=M*4 && value<(M+1)*4)
                if(A.length>=4){
                  for(var i=0;i<4;i++){
                    var pA=hand4.findIndex(value=>value>=M*4 && value<(M+1)*4);
                    var kanA=hand4.splice(pA,1);
                    kan4.unshift(kanA);
                    };
                  hand4.push(100);
                  ponkandraw(player);
                  NukiAnimation(player,-1);
                }
              return false;
            }
            if(pon4.length>=3){
              var A=Math.floor(pon4[0]/4);
              var B=hand4.findIndex(value=>value>=4*A && value<4*(A+1));
              if(B!==-1){
                var N=hand4.splice(B,1);
                kan4.unshift(N,pon4[0],pon4[1],pon4[2]);
                pon4.splice(0,3);
                //かきなおす
                hand4.push(100);
                ponkandraw(player);
                NukiAnimation(player,N);
                return true;
              }
            };
            if(pon4.length>=6){
              var A=Math.floor(pon4[3]/4);
              var B=hand4.findIndex(value=>value>=4*A && value<4*(A+1));
              if(B!==-1){
                var N=hand4.splice(B,1);
                kan4.unshift(N,pon4[3],pon4[4],pon4[5]);
                pon4.splice(3,3);
                hand4.push(100);
                ponkandraw(player);
                NukiAnimation(player,N);
                return true;
              }
            };
            //手札のみ4枚 この場合は槍槓できない
            var handtest=[];
            handtest=hand4.concat();
            var Count={};
            for(var i=1; i<handtest.length;i++){
            var C=donpai.findIndex(value=>value.id==handtest[i])
            if(C!==-1){
              var elm=donpai[C].name;
              Count[elm]=(Count[elm] || 0)+1
              }
            }
            var resultF=Object.keys(Count).filter((key)=>Count[key]>=4);
            if(resultF.length){
              var E=donpai.findIndex(value=>value.name==resultF[0]);
              for(var i=0;i<4;i++){
                var pA=hand4.findIndex(value=>value>=E && value<E+4);
                var kanA=hand4.splice(pA,1);
                kan4.unshift(kanA);
                };
              hand4.push(100);
              ponkandraw(player);
              NukiAnimation(player,-1);
            }
            break;
        }
        };
        //相手ターン
        if(num>=0 && num<70){
        handtemp=[];
        switch(player){
          case 1:
            handtemp = hand1.concat();
          break;
          case 2:
            handtemp = hand2.concat();
          break;
          case 3:
            handtemp = hand3.concat();
          break;
          case 4:
            handtemp = hand4.concat();
          break;
        }
        var pp=handtemp.findIndex(value=>value==100);
        if(pp==-1){
          console.log('pon error!',handtemp)
          return false;
        }
      switch(player){
        case 1:
          //カンされたパイを塗りつぶす
          var s = new createjs.Shape();
            s.graphics.beginFill("rgba(20,20,20,0.5)");
          if(Reverse){
            if(ippatu[2]==1){
              s.graphics.drawRect(riverx[2]-10.5, rivery[2]+5.25, 43.5, 33);
            }else{
              s.graphics.drawRect(riverx[2], rivery[2], 33, 43.5);
            }
          }else{
            if(ippatu[4]==1){
              s.graphics.drawRect(riverx[4]-10.5, rivery[4]+5.25, 43.5, 33);
            }else{
              s.graphics.drawRect(riverx[4], rivery[4], 33, 43.5);
            }
          }
          field.addChild(s);
          cLock=0;
          var A=Math.floor(num/4);
          var pA=hand1.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponA=hand1.splice(pA,1)
          var pB=hand1.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponB=hand1.splice(pB,1)
          var pC=hand1.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponC=hand1.splice(pC,1)
          kan1.unshift(num,ponA[0],ponB[0],ponC[0])
          console.log(hand1.length,hand1);
          ponkandraw(player);
          //一発を潰す
          for(var i=1;i<5;i++){
            if(ippatu[i]==1){
              ippatu[i]=2;
            }
          }
            NukiAnimation(player);
          break;
        case 2:
          var s = new createjs.Shape();
          s.graphics.beginFill("rgba(20,20,20,0.5)");
        if(Reverse){
          if(ippatu[3]==1){
            s.graphics.drawRect(riverx[3]-10.5, rivery[3]+5.25, 43.5, 33);
          }else{
            s.graphics.drawRect(riverx[3], rivery[3], 33, 43.5);
          }
        }else{
          if(ippatu[1]==1){
            s.graphics.drawRect(riverx[1]-10.5, rivery[1]+5.25, 43.5, 33);
          }else{
            s.graphics.drawRect(riverx[1], rivery[1], 33, 43.5);
          }
        }
        field.addChild(s);
            var A=Math.floor(num/4);
          var pA=hand2.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponA=hand2.splice(pA,1)
          var pB=hand2.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponB=hand2.splice(pB,1)
          var pC=hand2.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponC=hand2.splice(pC,1)
          kan2.unshift(num,ponA[0],ponB[0],ponC[0])
          ponkandraw(player);
          //一発を潰す
          for(var i=1;i<5;i++){
            if(ippatu[i]==1){
              ippatu[i]=2;
            }
          }
        NukiAnimation(player);
          break;
        case 3:
          var s = new createjs.Shape();
          s.graphics.beginFill("rgba(20,20,20,0.5)");
        if(Reverse){
            if(ippatu[4]==1){
              s.graphics.drawRect(riverx[4]-10.5, rivery[4]+5.25, 43.5, 33);
            }else{
              s.graphics.drawRect(riverx[4], rivery[4], 33, 43.5);
            }
        }else{
          if(ippatu[2]==1){
            s.graphics.drawRect(riverx[2]-10.5, rivery[2]+5.25, 43.5, 33);
          }else{
            s.graphics.drawRect(riverx[2], rivery[2], 33, 43.5);
          }
        }
        field.addChild(s);
            var A=Math.floor(num/4);
          var pA=hand3.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponA=hand3.splice(pA,1)
          var pB=hand3.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponB=hand3.splice(pB,1)
          var pC=hand3.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponC=hand3.splice(pC,1)
          kan3.unshift(num,ponA[0],ponB[0],ponC[0])
          ponkandraw(player);
              //一発を潰す
        for(var i=1;i<5;i++){
          if(ippatu[i]==1){
            ippatu[i]=2;
          }
        }
        NukiAnimation(player);
          break;
        case 4:
          var s = new createjs.Shape();
          s.graphics.beginFill("rgba(20,20,20,0.5)");
        if(Reverse){
            if(ippatu[1]==1){
              s.graphics.drawRect(riverx[1]-10.5, rivery[1]+5.25, 43.5, 33);
            }else{
              s.graphics.drawRect(riverx[1], rivery[1], 33, 43.5);
            }
        }else{
          if(ippatu[3]==1){
            s.graphics.drawRect(riverx[3]-10.5, rivery[3]+5.25, 43.5, 33);
          }else{
            s.graphics.drawRect(riverx[3], rivery[3], 33, 43.5);
          }
        }
        field.addChild(s);
            var A=Math.floor(num/4);
          var pA=hand4.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponA=hand4.splice(pA,1)
          var pB=hand4.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponB=hand4.splice(pB,1)
          var pC=hand4.findIndex(value=>value>=4*A && value<4*(A+1));
          var ponC=hand4.splice(pC,1)
          kan4.unshift(num,ponA[0],ponB[0],ponC[0])
          ponkandraw(player);
              //一発を潰す
          for(var i=1;i<5;i++){
            if(ippatu[i]==1){
              ippatu[i]=2;
            }
          }
        NukiAnimation(player);
      break;
      }
    }
    }
    };
    function ponkandraw(p){
      console.log(pon1.length,kan1.length);
      switch(p){
        case 1:
          if(pon1.length){
            for(var i=0;i<pon1.length;i++){
              e9 = new createjs.Bitmap(queue.getResult(eltear_src[pon1[i]]));
              e9.x=590-33*i;
              e9.y=450;
              e9.scale=33/120;
              field.addChild(e9);
              var s = new createjs.Shape();
              s.graphics.beginFill("rgba(20,20,20,0.5)");
              s.graphics.drawRect(590-33*i, 450, 33, 43.5);
              field.addChild(s);
              }
            }
          if(kan1.length){
            for(var i=0;i<kan1.length;i++){
              e9 = new createjs.Bitmap(queue.getResult(eltear_src[kan1[i]]));
              e9.x=590-33*(pon1.length+i);
              e9.y=450;
              e9.scale=33/120;
              field.addChild(e9);
              var s = new createjs.Shape();
              s.graphics.beginFill("rgba(20,20,20,0.5)");
              s.graphics.drawRect(590-33*(pon1.length+i), 450, 33, 43.5);
              field.addChild(s);
              }
            }
          break;
        case 2:
          if(pon2.length){
            for(var i=0;i<pon2.length;i++){
              e9 = new createjs.Bitmap(queue.getResult(eltear_src[pon2[i]]));
              e9.x=590-33*i;
              e9.y=150;
              e9.scale=33/120;
              field.addChild(e9);
              var s = new createjs.Shape();
              s.graphics.beginFill("rgba(20,20,20,0.5)");
              s.graphics.drawRect(590-33*i, 150, 33, 43.5);
              field.addChild(s);
              }
            }
          if(kan2.length){
            for(var i=0;i<kan2.length;i++){
              e9 = new createjs.Bitmap(queue.getResult(eltear_src[kan2[i]]));
              e9.x=590-33*(pon2.length+i);
              e9.y=150;
              e9.scale=33/120;
              field.addChild(e9);
              var s = new createjs.Shape();
              s.graphics.beginFill("rgba(20,20,20,0.5)");
              s.graphics.drawRect(590-33*(pon2.length+i), 150, 33, 43.5);
              field.addChild(s);
              }
            }
          break;
        case 3:
          if(pon3.length){
            for(var i=0;i<pon3.length;i++){
              e9 = new createjs.Bitmap(queue.getResult(eltear_src[pon3[i]]));
              e9.x=590-33*i;
              e9.y=250;
              e9.scale=33/120;
              field.addChild(e9);
              var s = new createjs.Shape();
              s.graphics.beginFill("rgba(20,20,20,0.5)");
              s.graphics.drawRect(590-33*i, 250, 33, 43.5);
              field.addChild(s);
              }
            }
          if(kan3.length){
            for(var i=0;i<kan3.length;i++){
              e9 = new createjs.Bitmap(queue.getResult(eltear_src[kan3[i]]));
              e9.x=590-33*(pon3.length+i);
              e9.y=250;
              e9.scale=33/120;
              field.addChild(e9);
              var s = new createjs.Shape();
              s.graphics.beginFill("rgba(20,20,20,0.5)");
              s.graphics.drawRect(590-33*(pon3.length+i), 250, 33, 43.5);
              field.addChild(s);
              }
            }
         break;
        case 4:
          if(pon4.length){
            for(var i=0;i<pon4.length;i++){
              e9 = new createjs.Bitmap(queue.getResult(eltear_src[pon4[i]]));
              e9.x=590-33*i;
              e9.y=350;
              e9.scale=33/120;
              field.addChild(e9);
              var s = new createjs.Shape();
              s.graphics.beginFill("rgba(20,20,20,0.5)");
              s.graphics.drawRect(590-33*i, 350, 33, 43.5);
              field.addChild(s);
              }
            }
          if(kan4.length){
            for(var i=0;i<kan4.length;i++){
              e9 = new createjs.Bitmap(queue.getResult(eltear_src[kan4[i]]));
              e9.x=590-33*(pon4.length+i);
              e9.y=350;
              e9.scale=33/120;
              field.addChild(e9);
              var s = new createjs.Shape();
              s.graphics.beginFill("rgba(20,20,20,0.5)");
              s.graphics.drawRect(590-33*(pon4.length+i), 350, 33, 43.5);
              field.addChild(s);
              }
            }
          break;
      }
      };
    socket.on("ryukyoku", (data)=>{
      if(IAM.token!==data.Token){
        ryukyoku();
      }
    });
    function ryukyoku(){
      //emit
      tweeNsquare.paused=true;
      Csquare.alpha=0;
      field.addChild(OKtext1);
      field.addChild(OKtext2);
      if(pvpmode==1){
      if(IsHost(IAM.room)){
        MEMBER[0].turnflag=1;
    for(var i=1;i<MEMBER.length;i++){
      if(MEMBER[i].pc==1 && MEMBER[i].turnflag !==2){
        MEMBER[i].turnflag=0;
      }else{
        MEMBER[i].turnflag=2;
      }
    }}
      var M=MEMBER.filter(value=>value.turnflag==2)
      var MM=4-M.length
      OKtext1.text="OK ("+MM+")";
      OKtext2.text="OK ("+MM+")";
    }
    yakumap.alpha=0;
    cx4.clearRect(0,0,800,600)
    opLock=-1;
    se10.play();
    var s = new createjs.Shape();
              s.graphics.beginFill("rgba(20,20,20,0.5)");
              s.graphics.drawRect(10, 100, 680, 400);
              field.addChild(s);
              s.addEventListener("click", {handleEvent:Menu}); 
    var t = new createjs.Text("流局", "36px 'Century Gothic'", "white");
    t.x=390;
    t.y=300;
    field.addChild(t);
    createjs.Tween.get(s)
            .wait(300)
            .call(next);
    if(LP[0]!==4){
    if(parent ==0){parent =3}else{parent -=1}
    skillusage2[0]-=1;
    skillusage2[5]+=1;
    }
    for(var i=1 ;i<5; i++){
    ctl[i]=2;
  }
  function next(){
    cLock=0;
    gamestate=0;
    if(LP[0]==4){
      raidscore[2]=1;
      if(raidscore[0]==0){raidscore[0]=2};
      ResultPhase();
        //以降resultphaseは↑のほうで呼び出し
      return false;
    };
  }
    console.log('流局',ctl)
    }
    function ResultPhase(){
      //ccanvasに保存した画像を順に見せる
      cLock=0;
      console.log('操作禁止',cLock);
      if(raidscore[2]==1){
        //はじめて
        fieldmap.x=800;
        field.addChild(fieldmap);
        guidemap.alpha=0;
        raidscore[2]=2;
        msgstate=0;
        cLock=1;
        return;
      }
      console.log('resultphase',raidscore);
      console.log(msgstate);
      if(raidscore[1]<=msgstate){
        raidscore[0]=1;
        return false;
      }
      //ツモ画面を順番に表示
        switch(msgstate){
          case 0:
            createjs.Tween.get(fieldmap)
            .to({x:0},250, createjs.Ease.cubicInOut)
            .call(next);
            break;
          case 1:
            createjs.Tween.get(fieldmap)
            .to({x:-800},250, createjs.Ease.cubicInOut)  
            .call(next);
            break;
          case 2:
            createjs.Tween.get(fieldmap)
            .to({x:-1600},250, createjs.Ease.cubicInOut)  
            .call(next);
            break;
          default:
            console.log(msgstate);
            return false;
        }
        function next(){
          msgstate+=1;
          cLock=1;
        }
    }
    function SortButton(){
      //一番右のパイを除いて並び替える
      if(cLock==1 && turn ==0 && reach[1]!==2){
        if(handsort==1){
          handsort=0;
          var Hlast=hand1.pop();
          if(debugmode){console.log(Hlast)};
          hand1.sort(compareFunc) 
          hand1=hand1.concat(Hlast)
          handgraph(0,1,1)
          //eltear.src=eltear_src[hand1[hand1.length-1]]
          se4.play();
          if(skillusage[1]>0 && chara[1]==5){
            fieldHint(-1);
            yoti(skillusage[1]);
          }
            }else if(handsort==0){
          handsort=1;
          var Hlast=hand1.pop();
          if(debugmode){console.log(Hlast)};
          hand1.sort(compareFunc3);
          hand1=hand1.concat(Hlast) 
          handgraph(0,1,1)
          se4.play();
          if(skillusage[1]>0 && chara[1]==5){
            fieldHint(-1);
            yoti(skillusage[1]);
          }
        }
      }
    }
    function paiCut(){
    //クリックしてから捨て牌を描写してturnroleに繋げるところまで
    mouseX=stage.mouseX*(1/stage.scaleX);
    mouseY=stage.mouseY*(1/stage.scaleY);
    if(cLock==3){
      //スキルで自分のパイ選択画面 手札
    if(mouseY >490 && mouseY < 590){
        if(hand1[this.card] ==69 || hand1[this.card] ==70){
        cLock=1;
        return false;
        }
        PlayertoCpu(this.card);
        return true;
      }
    };
    if(cLock==1 && opLock>=0 && opLock !==2){
      ///switch(this.card)
      ctl[1]=0
      if(turn ==0){
      if(reach[1] !==3){
      //自分のツモ
      if(mouseY >490 && mouseY < 590){
        PlayertoCpu(this.card);
        }
      }else{//reach[1] ==3
      if(this.card==hand1.length-1){
          PlayertoCpu(this.card);
        }
      }
    }
    }
    }
    function handOnCorsor(){
      //手札のカーソル
      if(opLock==2 || gamestate !==1){return false};//カーソル表示しない時
      if(cLock==2 || cLock==4){return false};
      switch(this.card){
        case -1:
          tweeNcor.paused=true;
          CorsorKey.alpha=0;
          fieldHint(-1);
          if(skillusage[1]>0 && chara[1]==5){
            yoti(skillusage[1]);
            }
          break;
        case 101:
          //ソートぼたん
          CorsorKey.scaleX=0.8;
          CorsorKey.scaleY=0.4;
          CorsorKey.x=10
          CorsorKey.y=550;
          CorsorKey.alpha=1;
          tweeNcor.paused=false;
          break;
        case 100:
          //ツモパイ
          CorsorKey.scaleX=0.7;
          CorsorKey.scaleY=0.91;
          CorsorKey.x=690
          CorsorKey.y=500;
          CorsorKey.alpha=1;
          tweeNcor.paused=false;
          Elname(hand1[hand1.length-1],hand1.length-1)
          fieldHint(0,hand1[hand1.length-1])
          if(skillusage[1]>0 && chara[1]==5){
            yoti(skillusage[1]);
            }
          break;
        default:
          CorsorKey.scaleX=0.7;
          CorsorKey.scaleY=0.91;
          CorsorKey.x=100+size*(this.card-1)
          CorsorKey.y=500;
          CorsorKey.alpha=1;
          tweeNcor.paused=false;    
          Elname(hand1[this.card],this.card)  
          fieldHint(0,hand1[this.card])
          if(skillusage[1]>0 && chara[1]==5){
            yoti(skillusage[1]);
            }
          break;
      }
    }
    function fieldHint(p=0,pai=-1){
    //handsort時は場の同じキャラのパイ、handsort1時は同じラインに色付けを行う
    if(debugmode){console.log('fieldHint',p,pai)}
    if(p==-1){
      //カーソルが離れた時
      fieldpai.removeAllChildren();
      return true;
    }
    if(p==0){
      fieldpai.removeAllChildren();
      //同じキャラに色付け
      var X=[0,153,153,153,153];
      var Y=[0,400,100,200,300];
      var Ary=[];
      for(var i=1;i<5;i++){
        Ary=trash[i-1].concat();
        for(var j=0;j<counter[i];j++){
        if(j==14){
          Y[i] +=50
          X[i] =143
          }
        if(j==28){
          Y[i] +=50
          X[i] =143
          }
          if(counterR[i]>=0 && counterR[i]==j){
            if(chrlinecheck(pai,Ary[j])){
            var rect = new createjs.Shape();
            rect.graphics.beginFill("rgba(0, 200, 173, 0.5)").drawRoundRect(X[i]-10.5, Y[i]+5.25, 43.5, 33,5,5)
            rect.compositeOperation = "lighter";
            fieldpai.addChild(rect);
            }
            X[i]+=43.5;
          }else{
            if(chrlinecheck(pai,Ary[j])){
            var rect = new createjs.Shape();
            rect.graphics
            .beginFill("rgba(0, 200, 173, 0.5)").drawRoundRect(X[i], Y[i], 33, 43.5,5,5)
            rect.compositeOperation = "lighter";
            fieldpai.addChild(rect);
            }
            X[i] +=33;
          }
        }
      }
    };
    function chrlinecheck(a,b){
      if(handsort==0){
        if(a>=0 && a<=67){
          //エルス-リティア
          if(a<60 && b<60){
            if(Math.floor(a/4)==Math.floor(b/4)){
              return true;
            }
          }
          if(a>=60 && b>=60){
            //マスロ
            if(a==b){
              return true;
            }
          }
        }
      }else if(handsort==1){
        if(a>=0 && a<=67 && b>=0 && b<=67){
          //ライン
            if(Math.floor(a%4)==Math.floor(b%4)){
              return true;
            }
        }
      }
    }
    }
    function ReachBt(){
      switch(this.card){
        case 0:
          //リーチ状態に移行する
          se5.play();
          var btn1 = createButton("キャンセル", 80, 40);
          btn1.x = 630;
          btn1.y = 440;
          reach[1]=2//reach=2は仮確定、切った後3に確定
          ponkanmap.addChild(btn1)
          btn1.addEventListener("click",{card:1,handleEvent:ReachBt});
          //リーチのパイを色付けたりリーチボタンを隠すなど
          for(var i=1;i<hand1.length;i++){
            var Wait=Reachwait(i)
            if(Wait[0]=="ノーテン"){
              var C= new createjs.Shape();
              C.graphics.beginFill("rgba(13, 100, 141, 0.7)");
              C.graphics.drawRoundRect(0,500,70,91,10,10)
              C.x=100+size*(i-1)
              if(ponsw[1]!==1 && i==hand1.length-1){
                C.x=690;
              }
              ponkanmap.addChild(C);
            }
          }
          ElnameM=0;
          break;
        case 1:
          se3.play()
          guidemap.removeAllChildren();
          ponkanmap.removeAllChildren();
          var btn1 = createButton("リーチ", 80, 40);
          btn1.x = 630;
          btn1.y = 440;
          ponkanmap.addChild(btn1);
          btn1.addEventListener("click",{card:0,handleEvent:ReachBt});
          if(Kan(1,-2)){
            nukiswitch[1]=1;//嶺上開花判定に使用
            var btn1 = createButton("カン", 80, 40);
            btn1.x = 710;
            btn1.y = 400;
            ponkanmap.addChild(btn1);
            btn1.addEventListener("click",{card:2,handleEvent:PonKanBt});
          }
          if(hand1[0]==-3){
            se6.play();
            var btn1=createCircleButton("ツモ",50);
            btn1.x=320;
            btn1.y=400;
            ponkanmap.addChild(btn1)
            btn1.addEventListener("click", {card:1,handleEvent:TumoronBt});
          };
          if(chara[1] !==0 && skillswitch[1]==0 && skillswitch[0] !==-2){
            var btn1 = createButton("スキル", 80, 40);
              btn1.x = 710;
              btn1.y = 440;
              ponkanmap.addChild(btn1);
              btn1.addEventListener("click",{card:0,handleEvent:SkillBt});
          }
          reach[1]=1;
        break;
      }
    }
    function PonKanBt(){
      //1->ポン 2->カン -1->キャンセル
      console.log('PonKanBt!',this.card)
      if(cLock==1){
        switch(this.card){
          case -1:
            if(debugmode){console.log('ポン・カン・スルー')}
            cLock=0;
            se3.play();
            cx2.clearRect(630,400,80,40)
            ponkanmap.removeAllChildren();
            ponsw[1]=pon1.length;
            ponsw[0]=1;
            turn=turntemp;
            turnchecker();
            if(pvpmode==1){
              socket.emit("pon", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,status:false});
              }
            break;
          case 1:
            if(ponsw[1]==1 && turn !==0){
                if(debugmode){console.log(ponsw[1]);}
                    Pon(1,tumotemp);
                    if(pvpmode==1){
                      socket.emit("pon", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,status:true});
                      }
                }
            break;
          case 2:
            if(debugmode){console.log(nukiswitch)};
              if(pvpmode==1){
                //emitの文字を変えると面倒なかもしれない
              socket.emit("nuki", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,pai:100,handtest:hand1,status:true});
              }
              cLock=0;
              console.log('操作禁止',cLock);
              Kan(1,100);
            break;
          case 3:
            if(debugmode){console.log(nukiswitch)};
              if(pvpmode==1){
                //emitの文字を変えると面倒なかもしれない
                socket.emit("nuki", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,pai:tumotemp,status:true});
              }
              cLock=0;
              console.log('操作禁止',cLock);
              console.log(turn,turntemp);
              Kan(1,tumotemp);
            break;
        }
      }
    }
    function TumoronBt(){
      switch(this.card){
        case 1:
          //つも
          if(hand1[0]==-3){
          if(debugmode){console.log('アガリ',han[1])}
          ponkanmap.removeAllChildren();
            if(ippatu[1]==1 && chara[1]==6 && skillusage[1]==1){
              SkillAnimation(1,tumo,1);
            }else{
              TumoRon(1,0);
              if(pvpmode==1){
                socket.emit("tumo", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,Tumo:tumo,status:true});
              }
            }
          };
          break;
        case 2:
          //ロン
          if(hand1[0]==-2){
            if(debugmode){console.log('アガリ',han[1])}
            ponkanmap.removeAllChildren();
            Ronturn.push(1);
            if(pvpmode==1){
            socket.emit("ron", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,status:true});
            }
            se3.play();
            rorder[1]=1
            hand1[0]=-1
            turn=turntemp;
            turnchecker();
            }
          break;
        case -1:
          //ロンをキャンセル
          if(hand1[0]==-2){
          if(debugmode){console.log('ロンをスルー')}
          se3.play();
          ponkanmap.removeAllChildren();
          if(pvpmode==1){
          socket.emit("ron", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,status:false});
          }
          rorder[1]=1
          hand1[0]=-1
          turn=turntemp;
          turnchecker();
          }
          break;
      }
    };
    function SkillBt(){
      switch(this.card){
        case 0:
          //スキルボタン
          se5.play();
          //リーチのパイを色付けたりリーチボタンを隠すなど
          SpecialSkill(1,0);
          Skillname(1);
          break;
        case 1:
          se3.play();
          cLock=1;
          guidemap.removeAllChildren();
          ponkanmap.removeAllChildren();
          if(reach[1] ==1){
          var btn1 = createButton("リーチ", 80, 40);
          btn1.x = 630;
          btn1.y = 440;
          ponkanmap.addChild(btn1);
          btn1.addEventListener("click",{card:0,handleEvent:ReachBt});
          }
          if(Kan(1,-2)){
            nukiswitch[1]=1;//嶺上開花判定に使用
            var btn1 = createButton("カン", 80, 40);
            btn1.x = 710;
            btn1.y = 400;
            ponkanmap.addChild(btn1);
            btn1.addEventListener("click",{card:2,handleEvent:PonKanBt});
          }
          if(hand1[0]==-3){
            se6.play();
            var btn1=createCircleButton("ツモ",50);
            btn1.x=320;
            btn1.y=400;
            ponkanmap.addChild(btn1)
            btn1.addEventListener("click", {card:1,handleEvent:TumoronBt});
          };
          if(chara[1] !==0 && skillswitch[1]==0 && skillswitch[0] !==-2){
            var btn1 = createButton("スキル", 80, 40);
              btn1.x = 710;
              btn1.y = 440;
              ponkanmap.addChild(btn1);
              btn1.addEventListener("click",{card:0,handleEvent:SkillBt});
          }
        break;
      }
    }
    function corsor(){
      if(gamestate ==10){
        switch(pagestate){
          case 1:
            //usercrest
              if(mouseX >40 && mouseX <400 && mouseY >90 && mouseY < 205){
                Textlist[0].text="あなたのプロフィールです。";
                Textlist[1].text="クリックすると実績画面に移動します。";
              }
          break;
          case 3:
            //フリーバトル
          if(mouseX >470 && mouseX <640 && mouseY >410 && mouseY <470){
            Textlist[0].text="現在の設定で対局を開始します！";
            Textlist[1].text="　";  
          }
        if(mouseX >510 && mouseX <705 && mouseY >80 && mouseY <110){
          //通常テキスト
          cx2.clearRect(80,530,670,70)
          switch(LP[0]){
            case 0:
              Textlist[0].text=LPlist[LP[0]]+"：持ち点150,000の半荘戦で満貫ブロックが適応されます。";
              Textlist[1].text="誰かの戦闘力がなくなった時点で試合終了となります。";  
            break;
            case 1:
              Textlist[0].text=LPlist[LP[0]]+"：持ち点300,000の半荘戦で満貫ブロックが適応されません。";
              Textlist[1].text="誰か一人が生き残るか半荘経過まで戦いが続きます。";  
            break;
            case 2:
              Textlist[0].text=LPlist[LP[0]]+"：和了しても得点は増えず、飛んでも復活します。";
              Textlist[1].text="半荘経過までにより多くの人を飛ばした人が勝者となります。";  
            break;
            case 3:
              Textlist[0].text=LPlist[LP[0]]+"：際限なく自由に打ち続けるモードです。";
              Textlist[1].text="Escキーでタイトル画面に戻ることで抜けられます。";  
            break;
            case 4:
              Textlist[0].text=LPlist[LP[0]]+"：持ち点150,000の半荘戦です。";
              Textlist[1].text="このモードでは一局に最大3人まで和了することができます。";  
              break;
          }
        }
        if(mouseX >520 && mouseX <650 && mouseY >175 && mouseY <205){
          Textlist[0].text="CPUのキャラクターを設定します。";
          Textlist[1].text="おまかせにするとランダムに決定されます。";  
        }
        if(mouseX >520 && mouseX <650 && mouseY >345 && mouseY <375){
          Textlist[0].text="キャラごとのパッシブ・アクティブスキルの設定です。";
          Textlist[1].text="「プレイヤーのみ」では、CPUのパッシブスキルは適用されます。";  
        }
            break;
          case 2:
            //オプション
            if(mouseX >380 && mouseX <750 && mouseY >200 && mouseY <260){
              //通常テキスト
              Textlist[0].text="通常対局時に流れるBGMを変更できます。";
              Textlist[1].text=musiclistDT[musicset[0]].title+", "+musiclistDT[musicset[0]].elia+", "+musiclistDT[musicset[0]].nod;  
            }
            if(mouseX >380 && mouseX <750 && mouseY >270 && mouseY <330){
              //リーチテキスト
              Textlist[0].text="オーラスを除くリーチ時に流れるBGMを変更できます。";
              Textlist[1].text=musiclistDT[musicset[1]].title+", "+musiclistDT[musicset[1]].elia+", "+musiclistDT[musicset[1]].nod;
            }
            if(mouseX >380 && mouseX <750 && mouseY >340 && mouseY <400){
              //オーラステキスト
              Textlist[0].text="オーラス時に流れるBGMを変更できます。";
              Textlist[1].text=musiclistDT[musicset[2]].title+", "+musiclistDT[musicset[2]].elia+", "+musiclistDT[musicset[2]].nod;
            }
            if(mouseX >50 && mouseX <360 && mouseY >100 && mouseY <170){
              Textlist[0].text="対局中に右クリックした時にツモ切りする";
              Textlist[1].text="ショートカット機能の使用設定です。"
            }
            if(mouseX >50 && mouseX <300 && mouseY >200 && mouseY <260){
              Textlist[0].text="CPUのポンのしやすさを調節します。";
              Textlist[1].text="右に行くほどCPUがポンしやすくなるようです。"
            }
            if(mouseX >50 && mouseX <350 && mouseY >260 && mouseY <350){
              Textlist[0].text="パイを切った時にMPが溜まる速度です。";
              Textlist[1].text="MPはスキルやマナブレイクに使用します。"
            }
            if(mouseX >50 && mouseX <350 && mouseY >350 && mouseY <400){
              Textlist[0].text="パイを切った時に鳴る効果音です。";
              Textlist[1].text="A：トランプっぽい音　B：麻雀牌っぽい音"
            }
            if(mouseX >600 && mouseX <700 && mouseY >450 && mouseY <490){
              Textlist[0].text="現在の設定を反映して戻ります。";
              Textlist[1].text="　"
            }
            if(mouseX >400 && mouseX <580 && mouseY >450 && mouseY <490){
              Textlist[0].text="オプションを初回起動時の設定に戻します。";
              Textlist[1].text="※『音量設定』のみ初期化されません。"
            }
          break;
          case 4:
            //プレイガイド
            switch(msgstate){
              case 0:
                if(mouseX >700 && mouseX <750 && mouseY >50 && mouseY <90){
                  cx3.strokeRect(710,55,30,30)
                }
                if(mouseX >50 && mouseX <250 && mouseY >70 && mouseY <110){
                  cx3.strokeRect(52,70,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >110 && mouseY <150){
                  cx3.strokeRect(52,110,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >150 && mouseY <190){
                  cx3.strokeRect(52,150,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >190 && mouseY <230){
                  cx3.strokeRect(52,190,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >230 && mouseY <270){
                  cx3.strokeRect(52,230,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >270 && mouseY <310){
                  cx3.strokeRect(52,270,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >310 && mouseY <350){
                  cx3.strokeRect(52,310,200,40)
                }
                if(mouseX >50 && mouseX <250 && mouseY >350 && mouseY <390){
                  cx3.strokeRect(52,350,200,40)
                }
                break;
              case 1:
                if(mouseX >90 && mouseX <200 && mouseY >60 && mouseY <100){
              Textlist[0].text="ここにはドラパイが表示されます。";
              Textlist[1].text="ドラと同じパイを持っていると、いいことが……？"
                }
                if(mouseX >85 && mouseX <200 && mouseY >120 && mouseY <420){
              Textlist[0].text="この数字は各プレイヤーの戦闘力（持ち点）です。";
              Textlist[1].text="0を下回ると戦意喪失状態になってしまいます。";
                }
                if(mouseX >160 && mouseX <670 && mouseY >420 && mouseY <505){
                  Textlist[0].text="これは何でしょう？　そう、あなたの手札のパイです！";
                  Textlist[1].text="自分の番になったらこの中から1枚選んで捨てましょう。";
                }
                if(mouseX >200 && mouseX <370 && mouseY >120 && mouseY <420){
                  Textlist[0].text="ここは川。各プレイヤーが捨てたパイが沈んでいます。";
                  Textlist[1].text="山札にどんなパイが眠っているのか想像してみてください。";
                }
                if(mouseX >560 && mouseX <690 && mouseY >350 && mouseY <420){
                  Textlist[0].text="ゲーム中に使用するポン、リーチなどのボタンです。";
                  Textlist[1].text="あと1つで役が揃うならリーチ！　リーチ！";
                }
                if(mouseX >560 && mouseX <690 && mouseY >60 && mouseY <330){
                  Textlist[0].text="右側の情報欄には、選択中のパイやプレイヤーに";
                  Textlist[1].text="関する内容が表示されます。";
                }
                if(mouseX >390 && mouseX <560 && mouseY >60 && mouseY <100){
                  Textlist[0].text="山札の残りのパイがなくなったら、";
                  Textlist[1].text="その局は流局（引き分け）です！";
                }
                break;
            }
          break;
          case 5:
            //実績
            switch(msgstate){
              case 1:
              if(mouseX >195 && mouseX <380 && mouseY >95 && mouseY <515){
                var I=Math.floor((mouseY-95)/20);
                if(achieveA[I].cleared>0){
                Textlist[0].text=achieveA[I].name;
                Textlist[1].text=achieveA[I].sub;
                }else{
                  Textlist[0].text="？？？";
                  Textlist[1].text=achieveA[I].sub;
                }
              }
              if(mouseX >475 && mouseX <660 && mouseY >95 && mouseY <515){
                var I=Math.floor((mouseY-95)/20);
                if(I>=achieveA.length){
                  return false;
                }
                if(achieveA[I+21].cleared>0){
                  Textlist[0].text=achieveA[I+21].name;
                  Textlist[1].text=achieveA[I+21].sub;
                }else{
                  Textlist[0].text="？？？";
                  Textlist[1].text=achieveA[I+21].sub;
                }
              }
                break;
            }
          break;
          case 6:
            //たいせん
            switch(msgstate){
              case 2:
                cx2.fillStyle = "white";
                cx2.font = "18px Arial";
                var elskunn=[
                  {name:"サバイバル　一般的な麻雀のようなルールです。",sub:"誰かが飛ぶかオーラス終了までドンジャラをします。"},
                  {name:"デスマッチ　より多くの相手を飛ばした人が勝つルールです。",sub:"和了で自分の得点が増えず、飛んだ人は1局経過後に復活します。"},
                  {name:"魔界血戦　4人中3人が和了するまで対局が続きます。",sub:"後の局ほど点数が高くなります。"},
                  {name:"持ち点　ゲーム開始時の持ち点です。",sub:"※得点基準参考：親が満貫の場合、75000点"},
                  {name:"対局数の設定　東風では最大4局まで、",sub:"半荘では最大8局までドンジャラが続きます。"},
                  {name:"満貫打ち止め　満貫ブロックの有無の設定です。",sub:"「なし」にすると高得点が出やすくなります。"},
                  {name:"スキル　キャラごとのパッシブ/アクティブスキルの設定です。",sub:"スキルありにすると、無法地帯になりやすくなります。"},
                ];
                if(mouseX >160 && mouseX <330 && mouseY >0 && mouseY <45){
                  if(LP_PVP.Rule[0]==1){
                  Textlist[0].text=elskunn[0].name
                  Textlist[1].text=elskunn[0].sub
                  }else if(LP_PVP.Rule[0]==2){
                    Textlist[0].text=elskunn[1].name
                    Textlist[1].text=elskunn[1].sub
                }else if(LP_PVP.Rule[0]==3){
                  Textlist[0].text=elskunn[2].name
                  Textlist[1].text=elskunn[2].sub
                  }                  
                }
                if(mouseX >340 && mouseX <460 && mouseY >0 && mouseY <45){
                  Textlist[0].text=elskunn[4].name
                  Textlist[1].text=elskunn[4].sub
                }
                if(mouseX >160 && mouseX <360 && mouseY >45 && mouseY <80){
                  Textlist[0].text=elskunn[3].name
                  Textlist[1].text=elskunn[3].sub
                }
                if(mouseX >360 && mouseX <530 && mouseY >45 && mouseY <80){
                  Textlist[0].text=elskunn[5].name
                  Textlist[1].text=elskunn[5].sub
                }
                if(mouseX >530 && mouseX <660 && mouseY >45 && mouseY <80){
                  Textlist[0].text=elskunn[6].name
                  Textlist[1].text=elskunn[6].sub
                }
                if(IsHost(IAM.room)){
                  if(mouseX >610 && mouseX <790 && mouseY >80 && mouseY <150){
                    cx2.clearRect(10,521,400,70)
                    if(LP_PVP.Rule[0]==1){
                      Textlist[0].text=elskunn[0].name
                      Textlist[1].text=elskunn[0].sub
                    }else if(LP_PVP.Rule[0]==2){
                      Textlist[0].text=elskunn[1].name
                      Textlist[1].text=elskunn[1].sub
                    }else if(LP_PVP.Rule[0]==3){
                      Textlist[0].text=elskunn[2].name
                      Textlist[1].text=elskunn[2].sub
                    }
                  }
                  if(mouseX >610 && mouseX <790 && mouseY >160 && mouseY <220){
                    Textlist[0].text=elskunn[3].name
                    Textlist[1].text=elskunn[3].sub
                  }
                  if(mouseX >610 && mouseX <790 && mouseY >230 && mouseY <290){
                    Textlist[0].text=elskunn[4].name
                    Textlist[1].text=elskunn[4].sub
                  }
                  if(mouseX >610 && mouseX <790 && mouseY >300 && mouseY <360){
                    Textlist[0].text=elskunn[5].name
                    Textlist[1].text=elskunn[5].sub
                  }
                  if(mouseX >610 && mouseX <790 && mouseY >370 && mouseY <430){
                    Textlist[0].text=elskunn[6].name
                    Textlist[1].text=elskunn[6].sub
                  }
                } 
              break;      
            }
          break;
        }
      };
      if(cLock >0 && gamestate !==10){//カーソル
        if(cLock==2){
          //スキル対象選択プレイヤー編
          if(mouseX>10 && mouseX<140){
            if(mouseY>100 && mouseY<200){
              cx3.clearRect(10,100,130,400);
              cx3.strokeStyle ='yellow'
              cx3.lineWidth = 2;
              cx3.strokeRect(12,102,126,96);
            }
            if(mouseY>200 && mouseY<300){
              cx3.clearRect(10,100,130,400);
              cx3.strokeStyle ='yellow'
              cx3.lineWidth = 2;
              cx3.strokeRect(12,202,126,96);
            }
            if(mouseY>300 && mouseY<400){
              cx3.clearRect(10,100,130,400);
              cx3.strokeStyle ='yellow'
              cx3.lineWidth = 2;
              cx3.strokeRect(12,302,126,96);
            }
            if(mouseY>400 && mouseY<500){
              cx3.clearRect(10,100,130,400);
              cx3.strokeStyle ='yellow'
              cx3.lineWidth = 2;
              cx3.strokeRect(12,402,126,96);
            }
          }
          return false;
        }
      }
      if(gamestate ==1){
      //スキルは右下に移動
        if(mouseX >0 && mouseX< 100){
          if(skillswitch[0]==-2){
            if(mouseY >100 && mouseY<200){Skillname(2,1);}
            if(mouseY >200 && mouseY<300){Skillname(3,1);}
            if(mouseY >300 && mouseY<400){Skillname(4,1);}
            if(mouseY >400 && mouseY<480){Skillname(1,1);}
          }else{
          if(mouseY >100 && mouseY<200){Skillname(2,navisw);}
          if(mouseY >200 && mouseY<300){Skillname(3,navisw);}
          if(mouseY >300 && mouseY<400){Skillname(4,navisw);}
          if(mouseY >400 && mouseY<480){Skillname(1,navisw);}
          }
        }
      }
      };
    function Elname(num,numb=0){
            //num->id の説明文を右枠に　numb->リーチ時の待ち　hand1の何番目
            if(num==ElnameM){
              return false;
            }else{
              ElnameM=num;
            };
          guidemap.removeAllChildren();
          cx2.clearRect(0,0,800,600);
          var type1=donpai.findIndex(value=>value.id==num)
          if(type1==-1){
            console.log('Donpai error!')
            return false;
          }
          var e6 = new createjs.Bitmap(queue.getResult(eltear_src[type1]));
          e6.x=635;
          e6.y=15;
          e6.scale=7/12;
          guidemap.addChild(e6);
          var t = new createjs.Text(donpai[type1].name, "bold 24px Arial", "#ff601c");
          if(donpai[type1].sub=="ニーシャラビリンス"){t.text="ニーシャ"}
          t.x=635;
          t.y=120;
          guidemap.addChild(t);
          if(donpai[type1].sub.length>7){
            var t = new createjs.Text("（"+donpai[type1].sub+"）", "14px Arial", "#ff601c");
          }else{
            var t = new createjs.Text("（"+donpai[type1].sub+"）", "18px Arial", "#ff601c");
          }
          t.x=630;
          t.y=150;
          guidemap.addChild(t);
          var t = new createjs.Text("CLASS："+donpai[type1].line+"Line", "20px Arial", "white");
          if(donpai[type1].line==0){t.text="オールマイティ"};
          t.x=635;
          t.y=180;
          guidemap.addChild(t);
          Nodyaku2(1,num);
          if(reach[1]==2){
            var Wait=Reachwait(numb)
            if(Wait[0]=="ノーテン"){
              reach[0]=1;
            }else{
              reach[0]=0;
              var s = new createjs.Shape();
              s.graphics.beginFill("rgba(20,20,20,0.7)");
              s.graphics.drawRect(201, 371, 358, 118);
              guidemap.addChild(s);
              var t = new createjs.Text(Wait[0], "bold 20px Arial", "#ff601c");
              t.x=220;
              t.y=380;
              guidemap.addChild(t);
            };
            if(Wait.length>1){
              for(var i=1;i<Wait.length;i++){
              var e9 = new createjs.Bitmap(queue.getResult(eltear_src[Wait[i]]));
              e9.x=140+70*i;
              e9.y=410;
              e9.scale=1/2;
              guidemap.addChild(e9);
            }}
          }
        };
    function drawDP(p=0){
      if(p==0){
      //mpゲージ書く
        var Ary=[0,470,170,270,370];
        for(var i=1;i<5;i++){
        var x=50;
        var y=Ary[i];
        var s = new createjs.Shape();
        s.graphics.beginFill("#0080ff");
        s.graphics.drawRect(0, y, 90, 15);
        s.graphics.beginFill("#75eaff");
        s.graphics.drawRect(0, y, 90, 5);
        s.scaleX=DP[i]/30;
        s.x=x;
        field.addChild(s);
        DPlist[i]=s;
        if(i==1){
          var s = new createjs.Shape();
          s.graphics.beginFill("#99ed68");
          s.graphics.drawRect(0, y, 90, 15);
          s.graphics.beginFill("#e3e3e3");
          s.graphics.drawRect(0, y, 90, 5);
          s.scaleX=0;
          s.x=x;
          field.addChild(s);
          DPlist[0]=s;
          }
        var s = new createjs.Shape();
        s.graphics.beginStroke("#e3e3e3");
        s.graphics.setStrokeStyle(2);
        s.graphics.drawRect(x, y, 30, 15);
        s.graphics.drawRect(x+30, y, 30, 15);
        s.graphics.drawRect(x+60, y, 30, 15);
        field.addChild(s);
        }
      }else{
        if(debugmode){console.log(DP[p])};
        DPlist[p].scaleX=DP[p]/30;
        DPlist[p].x=50;
        return true;
      }
      //
    }
    function SoundConfig(){
      SEbuffer(-1)
      if(!cLock && debugmode){
        //for debug
        cLock=true;
      }
      //ミュートの切り替え
      if( mute=="OFF" ){
        SEbuffer();
        Bgm.mute(false);
        mute="ON";
        se11.play();
        musicStart(musicnum);
        }else{
        Bgm.mute(true);
        Bgm.stop();
        mute="OFF";
    }
    muteshape.text=mute;
    };
    function createButton(text, width, height, keyColorA="#68ceed", keyColorB="#0080ff", keyColorC="#233237", keyColorD="#043342"){
      // ボタン要素をグループ化 keycolor A,B：通常時　C,D：活性化時
      var button = new createjs.Container();
      button.name = text; // ボタンに参考までに名称を入れておく(必須ではない)
      // 通常時の座布団を作成
      var bgUp = new createjs.Shape();
      bgUp.graphics
      .setStrokeStyle(1.0)
      .beginStroke(keyColorA)
      .beginFill(keyColorB)
      .drawRoundRect(0.5, 0.5, width - 1.0, height - 1.0, 2)
      .beginFill(keyColorA)
      .moveTo(1,1)
      .lineTo(width*3/7-1,1)
      .lineTo(1,height*4/15-1)
      .lineTo(1,height*5/12-1)
      .lineTo(1,1)
      .moveTo(1,1)
      .lineTo(width*5/17-1,1)
      .lineTo(1,height*5/12-1)
      .lineTo(1,1)
      button.addChild(bgUp);
      bgUp.visible = true; // 表示する
      // ロールオーバー時の座布団を作成
      var bgOver = new createjs.Shape();
      bgOver.graphics
      .setStrokeStyle(1.0)
      .beginStroke(keyColorC)
      .beginFill(keyColorD)
      .drawRoundRect(0.5, 0.5, width - 1.0, height - 1.0, 2)
      .beginFill(keyColorA)
      .moveTo(1,1)
      .lineTo(width*3/7-1,1)
      .lineTo(1,height*4/15-1)
      .lineTo(1,height*5/12-1)
      .lineTo(1,1)
      .moveTo(1,1)
      .lineTo(width*5/17-1,1)
      .lineTo(1,height*5/12-1)
      .lineTo(1,1)
      bgOver.visible = false; // 非表示にする
      button.addChild(bgOver);

      // ラベルを作成
      var label = new createjs.Text(text, "18px sans-serif", "#ffffff");
      label.x = width / 2;
      label.y = height / 2;
      label.textAlign = "center";
      label.textBaseline = "middle";
      button.addChild(label);

      // ロールオーバーイベントを登録
      button.addEventListener("mouseover", handleMouseOver);
      button.addEventListener("mouseout", handleMouseOut);
      function handleMouseOver(event) {
        bgUp.visble = false;
        bgOver.visible = true;
        label.color = "white";
      }

      function handleMouseOut(event) {
        bgUp.visble = true;
        bgOver.visible = false;
        label.color = "white";
      }

      return button;      
    }
    function createCircleButton(text, width, keyColorA="rgb(255,155,135)", keyColorB="rgb(221,84,72)", keyColorC="rgb(255,255,150)", keyColorD="rgb(223,163,0)"){
      // ツモ・ロンのぼたん width=>径
      var button = new createjs.Container();
      button.name = text; // ボタンに参考までに名称を入れておく(必須ではない)
      // 通常時の座布団を作成
      var bgUp = new createjs.Shape();
      bgUp.graphics
      .beginRadialGradientFill([keyColorB, keyColorA, "rgba(255, 255, 255, 0)"], [0, 0.8, 1], width/2, width/2, 0, width/2, width/2, width)
      .drawCircle(width/2, width/2, width)
      button.addChild(bgUp);
      bgUp.visible = true; // 表示する
      // ロールオーバー時の座布団を作成
      var bgOver = new createjs.Shape();
      bgOver.graphics
      .beginRadialGradientFill([keyColorD, keyColorC, "rgba(255, 255, 255, 0)"], [0, 0.8, 1], width/2, width/2, 0, width/2, width/2, width)
      .drawCircle(width/2, width/2, width)
      bgOver.visible = false; // 非表示にする
      button.addChild(bgOver);
      //くるくる
      var s = new createjs.Bitmap(queue.getResult("don/circle88.png"));
      s.regX = 44;
      s.regY = 46;
      s.x=width/2+2;
      s.y=width/2;
      s.scale=width/30;
      s.compositeOperation = "lighter";
      button.addChild(s);
    var tweeNc;
      tweeNc=createjs.Tween.get(s, {loop: true})
      .to({rotation:-360},2000);
      // ラベルを作成
      var label = new createjs.Text(text, "20px sans-serif", "#ffffff");
      label.x = width / 2;
      label.y = width / 2;
      label.textAlign = "center";
      label.textBaseline = "middle";
      button.addChild(label);
      // ロールオーバーイベントを登録
      button.addEventListener("mouseover", handleMouseOver);
      button.addEventListener("mouseout", handleMouseOut);
      function handleMouseOver(event) {
        bgUp.visble = false;
        bgOver.visible = true;
        label.color = "white";
      }

      function handleMouseOut(event) {
        bgUp.visble = true;
        bgOver.visible = false;
        label.color = "white";
      }

      return button;      
    }
      function drawbuttom(x,y,word,type=0,w=80,z=40,R=0,context=cx2){
        //type->活性化時1に
        context.lineWidth = 2;
        if(type==0){
        context.strokeStyle="#68ceed";//水色
        context.fillStyle="#0080ff"//蒼
        }else{
        context.strokeStyle="#233237";
        context.fillStyle="#043342";
        }
        context.beginPath();
        context.moveTo(x+1,y+1);
        context.lineTo(x+w-2, y+1);
        context.lineTo(x+w-2, y+z-2);
        context.lineTo(x+1,y+z-2);
        context.lineTo(x+1,y+1);
        context.fill();
        context.fillStyle="#68ceed";
        context.stroke();
        context.beginPath();
        context.moveTo(x+1,y+1);
        context.lineTo(x+31, y+1);
        context.lineTo(x+1, y+11);
        context.lineTo(x+1,y+1);
        context.fill();
        context.fillStyle = "#ffffff";
        context.textAlign = "start";
        switch(R){
          case 1:
        context.font = "28px 'Century Gothic'";
        context.fillText(word,x+30,y+35)
            break;
          default:
        context.font = "16px 'Century Gothic'";
        context.fillText(word,x+10,y+25)
            break;
        }
        }
        function drawbuttom2(x,y,word,type=0,w=170,z=60,R=0,context=cx2){
          //オレンジボタン Rを大きくすると文字の大きさを小さくします
          context.lineWidth = 2;
          if(type==0){
          context.strokeStyle="#ffbb4d";
          context.fillStyle="#ff7b00"
          }else{
          context.strokeStyle="#372d23";
          context.fillStyle="#5e5e5e";
          }
          context.beginPath();
          context.moveTo(x+1,y+1);
          context.lineTo(x+w-2, y+1);
          context.lineTo(x+w-2, y+z-2);
          context.lineTo(x+1,y+z-2);
          context.lineTo(x+1,y+1);
          context.fill();
          context.fillStyle="rgba(255, 187, 77,0.6)";//=#ffbb4d
          context.stroke();
          context.beginPath();
          context.moveTo(x+1,y+1);
          context.lineTo(x+75, y+1);
          context.lineTo(x+1, y+16);
          context.lineTo(x+1,y+1);
          context.fill();
          context.beginPath();
          context.moveTo(x+1,y+1);
          context.lineTo(x+51, y+1);
          context.lineTo(x+1, y+26);
          context.lineTo(x+1,y+1);
          context.fill();
          context.fillStyle = "#ffffff";
          context.textAlign = "start";
          switch(R){
            case 1:
              context.font = "16px 'Century Gothic'";
              context.fillText(word,x+20,y+25)
              break;
            case 2:
              context.font = "28px 'Century Gothic'";
              context.fillText(word,x+30,y+35)
                  break;
            default:
              context.font = "32px 'Century Gothic'";
              context.fillText(word,x+20,y+45)
              break;
          }
          }  
    function LoopAnimation(player,type=0){
      //type->0 ツモ 1 ロン
      var Container = new createjs.Container();
      Container.alpha=0;
      stage.addChild(Container);
      var C = new createjs.Bitmap(queue.getResult(win_src[7]));
      C.regX=400
      C.regY=300;
      C.x=400;
      C.y=300;
      C.scale=1.5;
      Container.addChild(C);
      createjs.Tween.get(C)
      .to({scale:1},200, createjs.Ease.cubicInOut);
      if(fool){
      var C = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[player]]));          
      }else{
      var C = new createjs.Bitmap(queue.getResult(chrimg_src[chara[player]]));
      }
      if(ippatu[player]==1 && chara[player]==6 && skillusage[player]==1){
        C.sourceRect={x:0,y:0,width:400,height:600};
      }else if(chara[player]==6){
        C.sourceRect={x:400,y:0,width:400,height:600}
      }else{
        C.sourceRect={x:0,y:0,width:800,height:600}
      }
      if(chara[player]==6){
        C.x=-200;
        createjs.Tween.get(C)
        .to({x:400, scaleX:1, scaleY:1},200, createjs.Ease.cubicInOut)
      }else{
        C.x=-600;
        createjs.Tween.get(C)
        .to({x:-0, scaleX:1, scaleY:1},200, createjs.Ease.cubicInOut)
      };
      C.y=0;
      C.scaleX=14/8;
      C.scaleY=2;
      Container.addChild(C);
      if(type==0){
      var C = new createjs.Bitmap(queue.getResult(win_src[4]));
      }else{
      var C = new createjs.Bitmap(queue.getResult(win_src[5]));
      }
      C.x=-20
      C.y=260;
      C.scale=0.8
      Container.addChild(C);
      createjs.Tween.get(C)
      .to({x:0,y:230,scale:0.7},60, createjs.Ease.cubicInOut)
      .wait(800);
      createjs.Tween.get(Container)
      .to({alpha: 1},50)
      .wait(1600)
      .call(next);
      function next(){
      opLock=0;
      if(LP[0]!==4){Resultmap(player,type);
      };
      createjs.Tween.get(Container)
      .to({alpha: 0},500)
      .call(end);
      }
      function end(){
        Container.removeAllChildren();
        stage.removeChild(Container);
        if(LP[0]==4){Raidscore()};
      }
      };
      function Raidscore(){
          if(raidscore[0]==0 && raidscore[2] ==0){
            gamestate=1;
            ctl=new Array(0,0,0,0,0)
            ctlerror=new Array(0,0,0,0,0)
            ponsw[0]=1;
              var Mary=[0,0,0,0,0];
              var Vmax=60;
              var count = 0
              var Container = new createjs.Container();
              field.addChild(Container);
              createjs.Ticker.addEventListener("tick", handleTick);
            return false;
          }else{
            if(raidscore[2]==1){
              se10.play();
              var s = new createjs.Shape();
              s.graphics.beginFill("rgba(20,20,20,0.5)");
              s.graphics.drawRect(10, 100, 700, 400);
              field.addChild(s);
              s.addEventListener("click", {handleEvent:Menu});
              var t = new createjs.Text("TIME UP", "36px 'Century Gothic'", "white");
              t.x=320;
              t.y=300;
              field.addChild(t);
              gamestate =2;
              }
          };
        function handleTick(){
            var Ary=[0,450,150,250,350]
            for(var i=1;i<LPtemp.length;i++){
              if(LPtemp[i]>0){
                var t = new createjs.Text("+"+LPtemp[i], "16px 'Century Gothic'", "white");
                t.x=165;
                t.y=Ary[i];
                t.outline=3;
                Container.addChild(t);
                var t = new createjs.Text("+"+LPtemp[i], "16px 'Century Gothic'", "red");
                t.x=165;
                t.y=Ary[i];
                Container.addChild(t);
              }else if(LPtemp[i]<0){
                var t = new createjs.Text(LPtemp[i], "16px 'Century Gothic'", "white");
                t.x=165;
                t.y=Ary[i];
                t.outline=3;
                Container.addChild(t);
                var t = new createjs.Text(LPtemp[i], "16px 'Century Gothic'", "blue");
                t.x=165;
                t.y=Ary[i];
                Container.addChild(t);
              }
            }
          count+=1;
          var M=count/Vmax;
          if(M>1){M==1};
          for(var i=1;i<LPtemp.length;i++){
            if(LPtemp[i]!==0){
              Mary[i]=Math.floor(LP[i]-LPtemp[i]+(LPtemp[i]*M));
              LPtextlist[i*2-2].text=Mary[i];
              LPtextlist[i*2-1].text=Mary[i];
            }
          } 
          if(count>Vmax){
            for(var i=1;i<LPtemp.length;i++){
              if(LPtemp[i]!==0){
                LPtextlist[i*2-2].text=LP[i];
                LPtextlist[i*2-1].text=LP[i];
              }
            };
            createjs.Ticker.removeEventListener("tick", handleTick);
            field.removeChild(Container);
            turnchecker();
          }
            stage.update();
        }
      }
  function ReachAnimation(p){
    var Container = new createjs.Container();
    Container.alpha=0;
    stage.addChild(Container);
    var C= new createjs.Shape();
    C.graphics.beginFill("#001c0d")
    C.graphics.moveTo(0,200);
    C.graphics.lineTo(1600/3,0);
    C.graphics.lineTo(800, 0);
    C.graphics.lineTo(800,400);
    C.graphics.lineTo(800/3,600)
    C.graphics.lineTo(0,600)
    C.graphics.lineTo(0,200)
    Container.addChild(C);
    var Reachtext='Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach! Reach!'
    for(var i=0;i<5;i++){
    var D= new createjs.Text(Reachtext, "bold 24px Arial", "#919191");
    D.rotation=-20.5;
    D.x=-450;
    D.y=390+86*i;
    Container.addChild(D);
    createjs.Tween.get(D, {loop: true})
    .to({x:D.x+800/3,y:D.y-100},1100);
    }
    for(var i=0;i<5;i++){
      var D= new createjs.Text(Reachtext, "bold 24px Arial", "#919191");
      D.rotation=-20.5;
      D.x=-50;
      D.y=280+86*i;
      Container.addChild(D);
      createjs.Tween.get(D, {loop: true})
      .to({x:D.x-800/3,y:D.y+100},1100);
      }
      if(fool){
      var C = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[p]]));          
      }else{
      var C = new createjs.Bitmap(queue.getResult(chrimg_src[chara[p]]));
      }
      if(ippatu[p]==1 && chara[p]==6 && skillusage[p]==1){
        C.sourceRect={x:0,y:0,width:400,height:600};
      }else if(chara[p]==6){
        C.sourceRect={x:400,y:0,width:400,height:600}
      }else{
        C.sourceRect={x:0,y:0,width:800,height:600}
      }
      if(chara[p]==6){
        C.x=-200;
        createjs.Tween.get(C)
        .to({x:400, scaleX:1, scaleY:1},200, createjs.Ease.cubicInOut)
        .wait(800)
        .to({x:-400, scaleX:1.1, scaleY:1.1,alpha:0.5},150);
      }else{
        C.x=-600;
        createjs.Tween.get(C)
        .to({x:0, scaleX:1, scaleY:1},200, createjs.Ease.cubicInOut)
        .wait(800)
        .to({x:-800, scaleX:1.1, scaleY:1.1,alpha:0.5},150);
      }
      C.y=0;
      C.scaleX=14/8;
      C.scaleY=2;
      Container.addChild(C);
      var C = new createjs.Bitmap(queue.getResult(win_src[6]));
      C.x=110
      C.y=260;
      C.scale=0.7
      Container.addChild(C);
      createjs.Tween.get(Container)
      .to({alpha: 1},50)
      .wait(1000)
      .to({alpha: 0},100)
      .call(next);
    function next (){
      Container.removeAllChildren();
      stage.removeChild(Container);
      turnchecker();
    }
    };
  
  function PonAnimation(p=0){
    se8.play();
    ponkanmap.removeAllChildren();
    var Container = new createjs.Container();
    Container.alpha=0;
    stage.addChild(Container);
    // マスク
    var rect = new createjs.Shape();
      rect.graphics
      .beginFill("#001c0d")
      .drawRect(0, 0, 800, 600);
      Container.addChild(rect);
      var shapeMask = new createjs.Shape();
      shapeMask.graphics
      .beginFill("gold")
      .drawRect(0, 0, 800, 100);
      shapeMask.scaleY=0.1;
      shapeMask.y=200;
      Container.mask = shapeMask;
      if(fool){
        var C = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[p]]));          
        }else{
        var C = new createjs.Bitmap(queue.getResult(chrimg_src[chara[p]]));
        }
    if(ippatu[p]==1 && chara[p]==6 && skillusage[p]==1){
      C.sourceRect={x:0,y:0,width:400,height:400};
    }else{
      C.sourceRect={x:400,y:0,width:400,height:400}
    }
      C.x=100;
      C.y=0;
      if(chara[p]==5){C.y=60};
      Container.addChild(C);
    var t = new createjs.Text("PON!", "bold 64px Arial", "white");
    t.rotation=-15;
    t.x=50;
    t.y=190;
    t.outline=6;
    Container.addChild(t);
    var t = new createjs.Text("PON!", "bold 64px Arial", "#919191");
    t.rotation=-15;
    t.x=50;
    t.y=190;
    Container.addChild(t);
    createjs.Tween.get(Container)
    .to({alpha: 1},60)
    .wait(700)
    .to({alpha: 0},100)
    .call(next);
    createjs.Tween.get(shapeMask)
    .to({y:150,scaleY: 1},60);
    if(chara[p]==7){
      createjs.Tween.get(C)
      .to({x:300},60);  
    }else{
    createjs.Tween.get(C)
    .to({x:200},60);
    }
    //
      function next(){
        Container.removeAllChildren();
        stage.removeChild(Container);
        switch(p){
          case 1:
          handgraph(0,1)
          turn=0;
          Csquare.y=400;
          if(pvpmode==1){
            for(var i=0;i<MEMBER.length;i++){
              MEMBER[i].turnflag=0;
            }
            MEMBER[turn].turnflag=1;
          }
          player1();
          break;
          default:
            if(pvpmode==1){
              turn=p-1;
                for(var i=0;i<MEMBER.length;i++){
                  MEMBER[i].turnflag=0;
                }
                MEMBER[turn].turnflag=1;
                turnrole();
            }else{
            turn=p-1;
            cpu(p);
            }
            break;
        }
      };
    };
  function NukiAnimation(p=0,pai=-1,type=0){
      console.log('Kan!',p,pai,type)
      se8.play();
      se18.play();
      var Container = new createjs.Container();
      Container.alpha=0;
      stage.addChild(Container);
      // マスク
      var rect = new createjs.Shape();
        rect.graphics
        .beginFill("#001c0d")
        .drawRect(0, 0, 800, 600);
        Container.addChild(rect);
        var shapeMask = new createjs.Shape();
        shapeMask.graphics
        .beginFill("gold")
        .drawRect(0, 0, 800, 100);
        shapeMask.scaleY=0.1;
        shapeMask.y=200;
        Container.mask = shapeMask;
        if(fool){
          var C = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[p]]));          
          }else{
          var C = new createjs.Bitmap(queue.getResult(chrimg_src[chara[p]]));
          }
      if(ippatu[p]==1 && chara[p]==6 && skillusage[p]==1){
        C.sourceRect={x:0,y:0,width:400,height:400};
      }else{
        C.sourceRect={x:400,y:0,width:400,height:400}
      }
        C.x=100;
        C.y=0;
        if(chara[p]==5){C.y=60};
        Container.addChild(C);
      var t = new createjs.Text("カン", "bold 64px Arial", "white");
      t.rotation=-15;
      t.x=50;
      t.y=190;
      t.outline=6;
      Container.addChild(t);
      var t = new createjs.Text("カン", "bold 64px Arial", "#919191");
      t.rotation=-15;
      t.x=50;
      t.y=190;
      Container.addChild(t);
      createjs.Tween.get(Container)
      .to({alpha: 1},60)
      .wait(700)
      .to({alpha: 0},100)
      .call(next);
      createjs.Tween.get(shapeMask)
      .to({y:150,scaleY: 1},60);
      if(chara[p]==7){
        createjs.Tween.get(C)
        .to({x:300},60);  
      }else{
      createjs.Tween.get(C)
      .to({x:200},60);
      }
        function next(){
          //pai -1-> もう一度自分のターン 0- ->加カンで使用 
          ponkanmap.removeAllChildren();
          Container.removeAllChildren();
          stage.removeChild(Container);
          nuki[1]+=1;
          if(nuki[0]>0){
            //もいっこカン！の場合にドラを追加しておく
            dora.push(king.splice(0,1));
            dorax+=40;
            e7 = new createjs.Bitmap(eltear_src[dora[dora.length-1]]);
            e7.x=dorax;
            e7.y=10;
            e7.scale=33/120;
            field.addChild(e7);
          };
          nuki[0]=p;
          handgraph(0,1)
          if(pai==-1){
            switch(p){
              case 1:
              turn=0;
              Csquare.y=400;
              if(pvpmode==1){
                for(var i=0;i<MEMBER.length;i++){
                  MEMBER[i].turnflag=0;
                }
                MEMBER[turn].turnflag=1;
              }
              player1();
              break;
              default:
                turn=p-1;
                if(pvpmode==1){
                    for(var i=0;i<MEMBER.length;i++){
                      MEMBER[i].turnflag=0;
                    }
                    MEMBER[turn].turnflag=1;
                    turnrole();
                }else{
                ctl[p]=0;
                cpu(p);
                }
                break;
            }         
            return false;
          }else{
            //槍槓チェックが入る場合
            turnchecker(pai);
            return false;
          }
        };
      };    
  function SkillAnimation(p=0,target=0,SEtype=0,pp=0){
    //pp 1-> socket送信しない　したくない場合に
    if(pvpmode==1 && pp==0){
      if(target>0 && target<5){
      socket.emit("skill", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,to:MEMBER[target-1].id,Target:target,SEtype:SEtype,status:true});
      }else{
      socket.emit("skill", {Token:IAM.token,room:RoomName[IAM.room],who:MEMBER[0].id,to:MEMBER[0].id,Target:target,SEtype:SEtype,status:true});
      }
    }
    cLock=0;
    console.log('操作禁止')
    if(SEtype==0){se12.play()}else{se19.play()};
    skilltext1=skilltext[chara[p]].fir
    skilltext2=skilltext[chara[p]].sec
    skilltext3=skilltext[chara[p]].thr
    var Container = new createjs.Container();
    Container.alpha=0;
    stage.addChild(Container);
    var C= new createjs.Shape();
    C.graphics.beginFill("#001c0d")
    C.graphics.moveTo(0,200);
    C.graphics.lineTo(1600/3,0);
    C.graphics.lineTo(800, 0);
    C.graphics.lineTo(800,400);
    C.graphics.lineTo(800/3,600)
    C.graphics.lineTo(0,600)
    C.graphics.lineTo(0,200)
    Container.addChild(C);
    var C = new createjs.Bitmap(queue.getResult(win_src[7]));
      C.regX=400
      C.regY=300;
      C.x=400;
      C.y=300;
      C.scale=1.5;
      Container.addChild(C);
      createjs.Tween.get(C)
      .to({scale:1},200, createjs.Ease.cubicInOut);
      if(fool){
        var C = new createjs.Bitmap(queue.getResult(chrimgR_src[chara[p]]));          
        }else{
        var C = new createjs.Bitmap(queue.getResult(chrimg_src[chara[p]]));
        }
    if(chara[p]==6){
      C.sourceRect={x:0,y:0,width:400,height:600};
      C.x=-200
      C.y=0;
      C.scaleX=14/8;
      C.scaleY=2;
      Container.addChild(C);
      createjs.Tween.get(C)
      .to({x:400, scaleX:1, scaleY:1},200, createjs.Ease.cubicInOut)
      .wait(760)
      .to({x:-400, scaleX:1.1, scaleY:1.1,alpha:0.5},150);
    }else{
      C.sourceRect={x:0,y:0,width:800,height:600}
      C.x=-600
      C.y=0;
      C.scaleX=14/8;
      C.scaleY=2;
      Container.addChild(C);
      createjs.Tween.get(C)
      .to({x:0, scaleX:1, scaleY:1},200, createjs.Ease.cubicInOut)
      .wait(760)
      .to({x:-800, scaleX:1.1, scaleY:1.1,alpha:0.5},150);
    }
    createjs.Tween.get(Container)
    .to({alpha: 1},60)
    .wait(820)
    .to({alpha: 0},100)
    .call(next);
    var t = new createjs.Text(skilltext1, "32px 'Century Gothic'", "#05ff9b");
    t.x=100;
    t.y=280;
    t.outline=5;
    Container.addChild(t);
    createjs.Tween.get(t)
    .to({x:170},400, createjs.Ease.cubicOut)
    var t = new createjs.Text(skilltext1, "32px 'Century Gothic'", "white");
    t.x=100;
    t.y=280;
    Container.addChild(t);
    createjs.Tween.get(t)
    .to({x:170},400, createjs.Ease.cubicOut)
    var t = new createjs.Text(skilltext2, "24px 'Century Gothic'", "#05ff9b");
    t.x=200;
    t.y=320;
    t.outline=5;
    Container.addChild(t);
    createjs.Tween.get(t)
    .to({x:250},400, createjs.Ease.cubicOut)
    var t = new createjs.Text(skilltext2, "24px 'Century Gothic'", "white");
    t.x=200;
    t.y=320;
    Container.addChild(t);
    createjs.Tween.get(t)
    .to({x:250},400, createjs.Ease.cubicOut);
  function next(){
  Container.removeAllChildren();
  field.removeChild(Container);
  SpecialSkill(p,target)
  if(debugmode){console.log('4789'+ctl)};
  }
  };
  function SpecialSkill(player,target=0){
    //skillanimationではp=1-4に対してこちらではp=charaなので注意　こら！
    var p=chara[player]
    console.log("skill",player,p,target,skillswitch[player])
    if(skillswitch[player]==0){
    //skillswitch 0使用可能 1次の自分のターンにリセット 2この局では使用不可
    if(p==1){//エル
      if(player==1){
        if(target>1){
        switch(target){
          case 2:
          case 3:
          case 4:
          var Skin=Buff[target].findIndex(value=>value==1);
          if(Skin ==-1){
            Buff[target].push(5,5,5,5,5)
            Buffdraw(target);
            console.log(Buff[target]);
            DP[player]-=20;
            drawDP(player);
          }
          break;
        }
        //ctlswitch=player
        ponkanmap.removeAllChildren();
        skillusage[player]+=1
        skillswitch[player]=2
        cLock=1;
        //player1();
        }else if(target==0){
        //対象選択画面
        se5.play()
        var s = new createjs.Shape();
        s.graphics.beginFill("rgba(20,20,20,0.3)");
        s.graphics.drawRect(0, 0, 800, 100)
        s.graphics.drawRect(150, 100, 650, 300)
        s.graphics.drawRect(0, 400, 800, 200);
        ponkanmap.addChild(s);
        var btn1 = createButton("キャンセル", 80, 40);
          btn1.x = 710;
          btn1.y = 440;
          ponkanmap.addChild(btn1)
          btn1.addEventListener("click",{card:1,handleEvent:SkillBt});
        for(var i=0;i<3;i++){
        var CKey = new createjs.Shape();
        CKey.graphics.beginStroke("#0088f0").setStrokeStyle(5).drawRoundRect(0,100+100*i,150,100,10,10)
        ponkanmap.addChild(CKey);
        var tweeNcor;
        tweeNcor=createjs.Tween.get(CKey, {loop: true})
        .to({alpha:1},200)
        .to({alpha:0.2},400)
        .to({alpha:1},200);
        }
        cLock=2;
        }}else{//cpu
            console.log('cpu skill')
              var Skin=Buff[target].findIndex(value=>value==1);
              if(Skin ==-1){
                Buff[target].push(5,5,5,5,5)
                Buffdraw(target);
                console.log(Buff[target]);
                DP[player]-=20;
                drawDP(player);
              }
            skillusage[player]+=1
            skillswitch[player]=2
            ctl[player]=4
            cpuplay(player);
        }
    }
    if(p==2){//アイ
      if(player==1){
      if(target>0){
      cLock=0;
      console.log('操作禁止')
      if(skillusage2[player]>-1){
        //メモライズしたパイに変える
        Cskillprepare[3]=hand1[target];
        Cskillprepare[4]=skillusage2[player];
        hand1[target]=skillusage2[player]
        cLock=1;
        skillusage2[player]=-1;
        handgraph(0,1,1);
        judge(1);
        return false;
      }else{
        //メモライズしてから切る
        cLock=1;
        ponkanmap.removeAllChildren();
        skillswitch[player]=1
        skillusage[player]+=1;
        if(skillusage[player]>=4){skillswitch[player]=2}
        skillusage2[player]=hand1[target];
        var SX=hand1.findIndex(value=>value==skillusage2[player])
        DP[player]-=10;
        drawDP(player);
        PlayertoCpu(SX);
        return false;
      }
      //ctlswitch=player
      }else if(target==0){
      se5.play()
      var s = new createjs.Shape();
        s.graphics.beginFill("rgba(20,20,20,0.3)");
        s.graphics.drawRect(0, 0, 630, 490)
        ponkanmap.addChild(s);
        var btn1 = createButton("キャンセル", 80, 40);
          btn1.x = 710;
          btn1.y = 440;
          ponkanmap.addChild(btn1)
          btn1.addEventListener("click",{card:1,handleEvent:SkillBt});
      cLock=3;
      }}else{//cpu
      if(skillusage2[player]>-1){
        //メモライズしたパイに変える
        skillusage2[player]=-1;
        Cskillprepare[3]=Cpuhandtemp[target];
        Cskillprepare[4]=skillusage2[player];
        Cpuhandtemp[target]=skillusage2[player];
        skillusage[player]+=1;
      }else{
        //メモライズしてから切る
        skillusage2[player]=Cpuhandtemp[target];
        var SX=Cpuhandtemp[target]
        DP[player]-=10;
        drawDP(player);
      }
      skillswitch[player]=1
      if(skillusage[player]>=2){skillswitch[player]=2}
        ctl[player]=4
        cpuplay(player);
      }
      }
    if(p==3){
      //レナ
      if(player==1){
        if(target>1){
        switch(target){
          case 2:
          case 3:
          case 4:
          var Skin=Buff[target].findIndex(value=>value==1);
          if(Skin ==-1){
            Buff[target].push(6,6,6)
            Buffdraw(target);
            console.log(Buff[target]);
            DP[player]-=20;
            drawDP(player);
          }
          break;
        }
        //ctlswitch=player
        ponkanmap.removeAllChildren();
        skillusage[player]+=1
        skillswitch[player]=2
        cLock=1;
        //player1();
        }else if(target==0){
        //対象選択画面
        se5.play()
        var s = new createjs.Shape();
        s.graphics.beginFill("rgba(20,20,20,0.3)");
        s.graphics.drawRect(0, 0, 630, 100)
        s.graphics.drawRect(150, 100, 480, 300)
        s.graphics.drawRect(0, 400, 630, 200);
        ponkanmap.addChild(s);
        var btn1 = createButton("キャンセル", 80, 40);
          btn1.x = 710;
          btn1.y = 440;
          ponkanmap.addChild(btn1)
          btn1.addEventListener("click",{card:1,handleEvent:SkillBt});
        for(var i=0;i<3;i++){
        var CKey = new createjs.Shape();
        CKey.graphics.beginStroke("#0088f0").setStrokeStyle(5).drawRoundRect(0,100+100*i,150,100,10,10)
        ponkanmap.addChild(CKey);
        var tweeNcor;
        tweeNcor=createjs.Tween.get(CKey, {loop: true})
        .to({alpha:1},200)
        .to({alpha:0.2},400)
        .to({alpha:1},200);
        }
        cLock=2;
        }}else{//cpu
            console.log('cpu skill')
              var Skin=Buff[target].findIndex(value=>value==1);
              if(Skin ==-1){
                Buff[target].push(6,6,6)
                Buffdraw(target);
                console.log(Buff[target]);
                DP[player]-=20;
                drawDP(player);
              }
            skillusage[player]+=1
            skillswitch[player]=2
            ctl[player]=4
            cpuplay(player);
        }
      };
      if(p==4){//ヴン
      if(target==1){
          //スキル演出中
          DP[player]-=30;
          drawDP(player);
          ponkanmap.removeAllChildren();
          ryukyoku();
          cLock=1;
          console.log('操作可能')
        }else{
        se5.play()
        var s = new createjs.Shape();
          s.graphics.beginFill("rgba(20,20,20,0.3)");
          s.graphics.drawRect(150, 100, 480, 390)
          ponkanmap.addChild(s);
          s.addEventListener("click", {handleEvent:Menu}); 
          var CKey = new createjs.Shape();
          CKey.graphics.beginStroke("#0088f0").setStrokeStyle(5).drawRoundRect(150,100,480,390,10,10)
          ponkanmap.addChild(CKey);
          var tweeNcor;
          tweeNcor=createjs.Tween.get(CKey, {loop: true})
          .to({alpha:1},200)
          .to({alpha:0.2},400)
          .to({alpha:1},200);
          var btn1 = createButton("キャンセル", 80, 40);
            btn1.x = 710;
            btn1.y = 440;
            ponkanmap.addChild(btn1)
            btn1.addEventListener("click",{card:1,handleEvent:SkillBt});
          cLock=4;
        }
      }
    if(p==6){//ラシェ
      if(pvpmode==1 && target>=0){
        tumo2=target;
      }
      TumoRon(player,0);
    }
    if(p==7){//アラ
      //ドラ追加
        skillswitch[player]=2;
        //ドラを1枚追加
        dora.push(king.splice(0,1));
        dorax+=40;
        e7 = new createjs.Bitmap(eltear_src[dora[dora.length-1]]);
        e7.x=dorax;
        e7.y=10;
        e7.scale=33/120;
        field.addChild(e7);
        DP[player]-=10;
        drawDP(player);
        handgraph(1,player);
    }
    if(p==9){//エド
        if(target==1){
              //スキル演出中
              DP[player]-=10;
              drawDP(player);
              ponkanmap.removeAllChildren();
              if(Reverse){Reverse=false}else{Reverse=true};
              cLock=1;
              console.log('操作可能')
          }else{
            se5.play()
            var s = new createjs.Shape();
              s.graphics.beginFill("rgba(20,20,20,0.3)");
              s.graphics.drawRect(150, 100, 480, 390)
              ponkanmap.addChild(s);
              s.addEventListener("click", {handleEvent:Menu}); 
              var CKey = new createjs.Shape();
              CKey.graphics.beginStroke("#0088f0").setStrokeStyle(5).drawRoundRect(150,100,480,390,10,10)
              ponkanmap.addChild(CKey);
              var tweeNcor;
              tweeNcor=createjs.Tween.get(CKey, {loop: true})
              .to({alpha:1},200)
              .to({alpha:0.2},400)
              .to({alpha:1},200);
              var btn1 = createButton("キャンセル", 80, 40);
                btn1.x = 710;
                btn1.y = 440;
                ponkanmap.addChild(btn1)
                btn1.addEventListener("click",{card:1,handleEvent:SkillBt});
              cLock=4;
            }
    }
    }
    };//specialskill
    
  socket.on("game-over", (data)=>{
    if(IAM.token!==data.Token){
      if(data.scoretemp==-1){
        scoretemp[0]=-1;
        gameover('ルーム人数が変化したため、ゲームが終了しました');
      }
      if(data.scoretemp==-2){
        scoretemp[0]=-1;
        var RsString=['ルーム長がトイレに行きました','ルーム長権限が発動しました','ルーム長がゲームを終了させました'];
        var A=Math.floor(Math.random()*RsString.length);
        gameover(RsString[A]);
      }
    }
  });
  function gameover(word="クリックで進む"){//けっかはっぴょぉうする
    gamestate =-2;//終了時3に
    tweeNsquare.paused=true;
    Csquare.alpha=0;
    tweeNcor.paused=true;
    CorsorKey.alpha=0;
    Configmap.removeAllChildren();
    guidemap.removeAllChildren();
    handmap.removeAllChildren();
    ponkanmap.removeAllChildren();
    fieldpai.removeAllChildren();
    jingle2.seek(1);
    jingle2.play();
    if(musicset[1]<=0){musicset[1]=0};
    if(pvpmode==1){
      cx4.clearRect(0,0,800,500);
      if(IsHost(IAM.room)){
        socket.emit("game_over", {Token:IAM.token,room:RoomName[IAM.room],type:0,scoretemp:scoretemp[0]});
      }
    }
    musicnum=0;
    Bgm.fade(0.05*vBar, 0, 1000);
    Bgm.on("fade", ()=>{
    Bgm.stop();
    });
    //ユーザー名をcpu2とかにされたらたまらんので
    if(LP[0]==2){
    //デスマッチ
    var LPresult=[
      {pc:"Player", token:0, chara:chara[1], elia:death[0].kill,nod:death[0].assist,city:death[0].death},
      {pc:"CPU2", token:0, chara:chara[2], elia:death[1].kill,nod:death[1].assist,city:death[1].death},
      {pc:"CPU3", token:0, chara:chara[3], elia:death[2].kill,nod:death[2].assist,city:death[2].death},
      {pc:"CPU1", token:0, chara:chara[4], elia:death[3].kill,nod:death[3].assist,city:death[3].death},
        ]
      if(pvpmode==1){
        for(var i=0; i<LPresult.length;i++){
          LPresult[i].pc=MEMBER[i].name;
          LPresult[i].token=MEMBER[i].token
        }
      }
      LPresult.sort(compareFunc4);
      var RankingStr=["1st","2nd","3rd","4th"];
    if(LPresult[3].elia==LPresult[2].elia && LPresult[3].nod==LPresult[2].nod){
      RankingStr[1]=RankingStr[0];
    }
    if(LPresult[2].elia==LPresult[1].elia && LPresult[2].nod==LPresult[1].nod){
      RankingStr[2]=RankingStr[1];
    }
    if(LPresult[1].elia==LPresult[0].elia && LPresult[1].nod==LPresult[0].nod){
      RankingStr[3]=RankingStr[2];
    }
    }else{
    //ソレ=イガイ
    var LPresult=[
      {pc:"Player", token:0, chara:chara[1], elia:LP[1]},
      {pc:"CPU2", token:0, chara:chara[2], elia:LP[2]},
      {pc:"CPU3", token:0, chara:chara[3], elia:LP[3]},
      {pc:"CPU1", token:0, chara:chara[4], elia:LP[4]},
        ]
      if(pvpmode==1){
        for(var i=0; i<LPresult.length;i++){
          LPresult[i].pc=MEMBER[i].name;
          LPresult[i].token=MEMBER[i].token
        }
      }
    LPresult.sort(compareFunc2);
    console.log(LPresult)
    var RankingStr=["1st","2nd","3rd","4th"];
    if(LPresult[3].elia==LPresult[2].elia){
      RankingStr[1]=RankingStr[0];
    }
    if(LPresult[2].elia==LPresult[1].elia){
      RankingStr[2]=RankingStr[1];
    }
    if(LPresult[1].elia==LPresult[0].elia){
      RankingStr[3]=RankingStr[2];
    }
  }
    field.removeAllChildren();
    var s = new createjs.Shape();
    s.graphics.beginFill("#001c0d");
    s.graphics.drawRect(0, 0, 800, 600);
    field.addChild(s);
    s.addEventListener("click", {handleEvent:Menu}); 
    if(fool){
     var e10 = new createjs.Bitmap(queue.getResult(chrimgR_src[LPresult[3].chara]));          
    }else{
     var e10 = new createjs.Bitmap(queue.getResult(chrimg_src[LPresult[3].chara]));
    }
      e10.sourceRect={x:400,y:0,width:400,height:600}
      e10.y=50;
      e10.scale=1.2;
      e10.alpha=0;
      field.addChild(e10);
      e10.x=200;
      createjs.Tween.get(e10)
      .wait(1800)
      .to({alpha:1,x:400,scale:3/4}, 200, createjs.Ease.cubicInOut)
      .call(next);
    //字幕
    var D= new createjs.Text("終　局", "bold 45px Arial", "white");
    D.x=350;
    D.y=15;  
    field.addChild(D);
    var D= new createjs.Text(RankingStr[0], "bold 40px Arial", "white");
    D.x=-100;
    D.y=100;  
    D.alpha=0;  
    field.addChild(D);
    createjs.Tween.get(D)
    .wait(1800)
    .to({x: 50,alpha:1}, 200, createjs.Ease.cubicInOut)
    field.addChild(D);
    var D= new createjs.Text(LPresult[3].pc, "bold 30px Arial", "white");
    D.x=-100;
    D.y=130;  
    D.alpha=0;  
    field.addChild(D);
    createjs.Tween.get(D)
    .wait(1800)
    .to({x: 120,alpha:1}, 200, createjs.Ease.cubicInOut)
    field.addChild(D);
    if(LP[0]==2){
    //デスマッチ
    var D= new createjs.Text("キル："+LPresult[3].elia+"　アシスト："+LPresult[3].nod+"　デス："+LPresult[3].city, "bold 24px Arial", "white");
    D.x=-100;
    D.y=160; 
    D.alpha=0;     
    field.addChild(D);
    createjs.Tween.get(D)
    .wait(1800)
    .to({x: 120,alpha:1}, 200, createjs.Ease.cubicInOut)
      }else{
    var D= new createjs.Text("戦闘力："+LPresult[3].elia, "bold 28px Arial", "white");
    D.x=-100;
    D.y=160;    
    D.alpha=0;  
    field.addChild(D);
    createjs.Tween.get(D)
    .wait(1800)
    .to({x: 120,alpha:1}, 200, createjs.Ease.cubicInOut)
      }
    field.addChild(e10);
    var Ary=[500,500,500,500,480,500,500,400,430,460];
    var Ary2=[50,120,50,50,70,50,70,50,80,50];
    for(var i=0;i<3;i++){
    if(fool){
      var e10 = new createjs.Bitmap(queue.getResult(chrimgR_src[LPresult[2-i].chara]));          
     }else{
      var e10 = new createjs.Bitmap(queue.getResult(chrimg_src[LPresult[2-i].chara]));
     }
      e10.sourceRect={x:Ary[LPresult[2-i].chara],y:Ary2[LPresult[2-i].chara],width:215,height:215}
      e10.scale=60/215;
      e10.x=-100;
      e10.y=231+100*i;
      createjs.Tween.get(e10)
        .wait(600*(2-i))
        .to({x: 50}, 200, createjs.Ease.cubicInOut)
        .call(se1)
      field.addChild(e10);
    //字幕
    var D= new createjs.Text(RankingStr[i+1], "bold 32px Arial", "white");
    D.x=-100;
    D.y=200+100*i;  
    D.alpha=0;  
    field.addChild(D);
    createjs.Tween.get(D)
    .wait(600*(2-i))
    .to({x: 50,alpha:1}, 200, createjs.Ease.cubicInOut)
    field.addChild(D);
    var D= new createjs.Text(LPresult[2-i].pc, "bold 26px Arial", "white");
    D.x=-100;
    D.y=230+100*i;  
    D.alpha=0;  
    field.addChild(D);
    createjs.Tween.get(D)
    .wait(600*(2-i))
    .to({x: 120,alpha:1}, 200, createjs.Ease.cubicInOut)
    field.addChild(D);
    if(LP[0]==2){
    //デスマッチ
    var D= new createjs.Text("キル："+LPresult[2-i].elia+"　アシスト："+LPresult[2-i].nod+"　デス："+LPresult[2-i].city, "bold 24px Arial", "white");
    D.x=-100;
    D.y=260+100*i; 
    D.alpha=0;     
    field.addChild(D);
    createjs.Tween.get(D)
    .wait(600*(2-i))
    .to({x: 120,alpha:1}, 200, createjs.Ease.cubicInOut)
      }else{
    var D= new createjs.Text("戦闘力："+LPresult[2-i].elia, "bold 24px Arial", "white");
    D.x=-100;
    D.y=260+100*i;    
    D.alpha=0;  
    field.addChild(D);
    createjs.Tween.get(D)
    .wait(600*(2-i))
    .to({x: 120,alpha:1}, 200, createjs.Ease.cubicInOut)
      }
    }
    function se1(){
      se14.play();
    };
    function next(){
      console.log(cLock,gamestate);
      se17.play();
      gamestate=3;
      var D= new createjs.Text(word, "26px Arial", "white");
      D.x=50;
      D.y=530;    
      field.addChild(D);
    }
      if(scoretemp[0]>=0){
        var A;
        if(pvpmode==1){
          //tokenで判別
          A=3-LPresult.findIndex(value=>value.token==IAM.token);
          //RankingStr=["1st","2nd","3rd","4th"];
        }else{
          A=3-LPresult.findIndex(value=>value.pc=="Player");         
        }
        console.log(A);
        if(A==4){
          console.log('token error!',LPresult);
          A=0;
        }
        switch(RankingStr[A]){
          case "1st":
            scoretemp[0]=1;
            break;
          case "2nd":
            scoretemp[0]=2;
            break;
          case "3rd":
            scoretemp[0]=3;
            break;
          case "4th":
            scoretemp[0]=4;
            break;
          default:
            break;
        };
      if(pvpmode==0){
        highscore[0]+=1;
      }else{
        highscore[4]+=1;
      }
      //スコア更新
      console.log(scoretemp,achievetemp,achievetempB)
        if(scoretemp[1]>highscore[3]){highscore[3]=scoretemp[1];};
        if(LP[1]>highscore[1]){highscore[1]=LP[1]};
        //if(LP[1]<=0){};
        if(pvpmode==0 && LP[0]!==3){
        var N=LP[0];
        //3フリバ, 4魔界血戦なので
        if(N!==3){
            winrank[N][scoretemp[0]-1]+=1;
        }
        };
        if(scoretemp[3]>highscore[2]){highscore[2]=scoretemp[3]};
        for(var i=0;i<achievetemp.length;i++){
            var A=achieveB.findIndex(value=>value.name==achievetemp[i].name);
            achieveB[A].cleared+=achievetemp[i].cleared;
            if(achievetemp[i].count>achieveB[A].count){achieveB[A].count=achievetemp[i].count};
        }
        for(var i=0;i<achievetempB.length;i++){
          if(achievetempB[i].count>0){
            var A=achieveB.findIndex(value=>value.name==achievetempB[i].name);
            if(A==-1){
              console.log('achieveB.error,', achievetempB[i].name)
            }else{
            achieveB[A].cleared+=achievetempB[i].count;
            }
          }
        }
        var T=achievetempB.findIndex(value=>value.name=="ツモ");
        var S=achievetempB.findIndex(value=>value.name=="ロン");
        var R=achievetempB.findIndex(value=>value.name=="ポン");
        var U=achievetempB.findIndex(value=>value.name=="放銃");
      if(scoretemp[0]==1 && achievetempB[U].count==0){
        AK("見える、見えるぞ！")
      }
      if(achievetempB[U].count>=3){
        AK("スケアチェイス")
      }
      if(achievetempB[R].count==0 && achievetempB[U].count==0){
        AK("もしかして空気？")
      }
      if(achievetempB[T].count==0 && achievetempB[S].count==0 && skillusage2[0]>=8){
        AK("地獄の生還者");
      }
      if(skillusage2[0]<=4){
        AK("スーパーソニック")    
      }
      var A=achieveB.filter(value=>value.sub=="シナジー役");
      var B=A.findIndex(value=>value.cleared==0);
      if(B ==-1){
        AK("シナジーコンプリート")
      };
      var A=achieveB.filter(value=>value.sub=="キャラ役");
      var B=A.findIndex(value=>value.cleared==0);
      if(B ==-1){
        AK("クレストコンプリート")
      };
      save_Local();
    };
  }//
        
  function Skillname(player,num=0){
    //num 0->キャラ情報　1->バフ情報
  cx2.font = "bold 18px Arial";
  if(LP[player]>=0){
  cx2.fillStyle = "white";
  }else{
  cx2.fillStyle = "#ff4c38";
  }
  cx2.clearRect(630,10,160,350)
  var p=chara[player]
  if(pvpmode==1){
        if(IsHost(IAM.room)){
        cx2.fillText("★"+MEMBER[player-1].name, 635, 66);
        }else{
        cx2.fillText(MEMBER[player-1].name, 635, 66);
        }
  }else{
  switch(player){
    case 1:
      cx2.fillText(Username, 635, 66);
      break;
      case 2:
        cx2.fillText("CPU1", 635, 66);
        break;
        case 3:
          cx2.fillText("CPU2", 635, 66);
          break;
          case 4:
            cx2.fillText("CPU3", 635, 66);
            break;            
  }}
  cx2.font = "bold 16px Arial";
  cx2.fillText(chrlist[p], 640, 80);
  cx2.fillStyle = "white";
  if(LP[0]==2){
    cx2.font = "bold 14px Arial";
    cx2.fillText("キル"+death[player-1].kill+"/アシ"+death[player-1].assist+"/デス"+death[player-1].death, 645, 96);
  }
  switch(num){
    case 0:
    drawbuttom(635,10,"スキル",1,70,40)
    if(p==1){
      cx2.font = "bold 16px Arial";
      cx2.fillText("ストーンスキン", 635, 130);
      cx2.font = "14px Arial";
      cx2.fillText("・リーチしている間,", 635, 150);
      cx2.fillText("他のスキルの効果を", 635, 170);
      cx2.fillText("受けない。", 635, 190);
      cx2.font = "bold 16px Arial";
      cx2.fillText("フレイムガイザー", 635, 210);
      cx2.font = "13px Arial";
      cx2.fillText("MP消費:1ゲージ", 635, 230);
      cx2.fillText("対象:プレイヤー1人", 635, 250);
      cx2.fillText("効果:対象を5巡の間", 635, 270);
      cx2.fillText("「火傷」状態にする.", 635, 290);
      cx2.fillText("(火傷状態の間は", 635, 310);
      cx2.fillText(" ポン・カンできない)", 635, 330);
      }else if(p==2){
        var MS=Buff[player].filter(value=>value==2)
        if(!MS.length){MS=[]};
      cx2.font = "bold 16px Arial";
      cx2.fillText("マナシールド", 635, 130);
      cx2.font = "14px Arial";
      cx2.fillText("・水パイを捨てる度に", 635, 150);
      cx2.fillText("マナシールドを張る." ,635, 170);
      cx2.font = "bold 16px Arial";
      cx2.fillText("メモライズ", 635, 190);
      cx2.font = "14px Arial";
      cx2.fillText("対象:手札のパイ1つ", 635, 210);
      cx2.fillText("(オールマイティ以外)", 635, 230);
      if(skillusage2[player]==-1){
        cx2.fillText("効果:①MPを1ゲージ", 635, 250);
        cx2.fillText("消費し,対象のパイを", 635, 270);
        cx2.fillText("メモしてから切る.", 635, 290);
        cx2.fillText("メモしたパイは,", 635, 310);
        cx2.fillText("いつでも思い出せる.", 635, 330);
      }else{
      cx2.fillText("効果：②対象のパイを", 635, 250);
      cx2.fillStyle="orange"
      cx2.fillText(donpai[skillusage2[player]].name, 635, 270);
      cx2.fillText("("+donpai[skillusage2[player]].sub+")", 635, 290);
      cx2.fillStyle="white";
      cx2.fillText("に変える.", 640, 310);
      }
      }else if(p==3){
      cx2.font = "bold 15px Arial";
      cx2.fillText("ネイチャーフォース", 635, 130);
      cx2.font = "14px Arial";
      cx2.fillText("・風パイを切る度に", 635, 150);
      cx2.fillText("NFバフを得る.", 635, 170);
      cx2.fillText("・強靭番の時,風パイ", 635, 190);
      cx2.fillText("が初手で入りやすい.", 635, 210);
      cx2.font = "bold 15px Arial";
      cx2.fillText("フリージングアロー", 635, 230);
      cx2.font = "14px Arial";
      cx2.fillText("MP消費:2ゲージ", 635, 250);
      cx2.fillText("対象:他のプレイヤー1人", 635, 270);
      cx2.fillText("効果:対象を3巡の間", 635, 290);
      cx2.fillText("「凍結」状態にする.", 635, 310);
      }else if(p==4){
      cx2.font = "bold 15px Arial";
      cx2.fillText("ナソードコア", 635, 130);
      cx2.font = "14px Arial";
      cx2.fillText("・太陽パイを切る度に", 635, 150);
      cx2.fillText("ナソードコアを生成する", 635, 170);
      cx2.fillText("・ナソードコアがある時", 635, 190);
      cx2.fillText("致死ダメージを受けても", 635, 210);
      cx2.fillText("1度だけ食いしばる.", 635, 230);
      cx2.font = "bold 15px Arial";
      cx2.fillText("グラウンドクラッシュ", 635, 250);
      cx2.font = "14px Arial";
      cx2.fillText("MP消費:3ゲージ", 635, 270);
      cx2.fillText("対象:全体", 635, 290);
      cx2.fillText("効果:台パンにより", 635, 310);
      cx2.fillText("この局を流局にする.", 635, 330);
    }else if(p==5){
      cx2.font = "bold 15px Arial";
      cx2.fillText("チートコード", 635, 130);
      cx2.font = "14px Arial";
      cx2.fillText("・リーチが発生した時", 635, 150);
      cx2.fillText("危険パイを察知する.", 635, 170);
      cx2.fillText("・引いたばかりのパイは", 635, 190);
      cx2.fillText("察知できず, その局の", 635, 210);
      cx2.fillText("最初のリーチに対して", 635, 230);
      cx2.fillText("のみ発動する.", 635, 250);
      if(skillusage[player]>0){
      switch(skillusage[player]){
        case 1:
          cx2.fillText("対象："+Username, 635, 270);
          break;
          case 2:
            cx2.fillText("対象：CPU1", 635, 270);
            break;
            case 3:
              cx2.fillText("対象：CPU2", 635, 270);
              break;
              case 4:
                cx2.fillText("対象：CPU3", 635, 270);
                break;
                default:
                  cx2.fillText("対象：--", 635, 270);
      }}
      }else if(p==6){
      cx2.font = "bold 15px Arial";
      cx2.fillText("変身", 635, 130);
      cx2.font = "14px Arial";
      cx2.fillText("・MPが3ゲージ溜まった", 635, 150);
      cx2.fillText("状態で立直する時,", 635, 170);
      cx2.fillText("ゲージを全消費して", 635, 190);
      cx2.fillText("バーサクモードになる!", 635, 210);
      cx2.fillText("・変身すると,高確率で", 635, 230);
      cx2.fillText("一発ツモが発生する.", 635, 250);
    }else if(p==7){
      cx2.font = "bold 15px Arial";
      cx2.fillText("連技-龍牙爆砕", 635, 130);
      cx2.font = "14px Arial";
      cx2.fillText("・1局に1度だけ,", 635, 150);
      cx2.fillText("1,2,3,4ラインの順に", 635, 170);
      cx2.fillText("パイを切ると発動する.", 635, 190);
      cx2.fillText("ドラを1つ追加する.", 635, 210);
      cx2.font = "bold 15px Arial";
      cx2.fillText("花蓮", 635, 230);
      cx2.font = "14px Arial";
      cx2.fillText("・カンをした時,", 635, 250);
      cx2.fillText("MPを1ゲージ消費して,", 635, 270);
      cx2.fillText("リーチ時は当たりパイを,", 635, 290);
      cx2.fillText("非リーチ時はドラを,", 635, 310);
      cx2.fillText("ランダムにドローする.", 635, 330);
    }else if(p==8){
      cx2.font = "bold 15px Arial";
      cx2.fillText("ウォープレリュード", 635, 130);
      cx2.font = "14px Arial";
      cx2.fillText("連続で和了するほど,", 635, 150);
      cx2.fillText("初手で同じラインの", 635, 170);
      cx2.fillText("パイが入りやすくなる.", 635, 190);
      cx2.fillText("(他の人が和了すると,", 635, 210);
      cx2.fillText("効果はリセットされる)", 635, 230);
      cx2.font = "bold 15px Arial";
      cx2.fillText("克己-強", 635, 250);
      cx2.font = "14px Arial";
      cx2.fillText("MP消費:2ゲージ", 635, 270);
      cx2.fillText("リーチ時にMPを消費し", 635, 290);
      cx2.fillText("自動的に発動する.", 635, 310);
      cx2.fillText("ウォープレリュードの", 635, 330);
      cx2.fillText("効果を延長する.", 635, 350);
      }else if(p==9){
      cx2.font = "bold 15px Arial";
      cx2.fillText("量子化", 635, 130);
      cx2.font = "14px Arial";
      cx2.fillText("常時, ポンをした際の", 635, 150);
      cx2.fillText("食い下がりが", 635, 170);
      cx2.fillText("2翻から1翻に減る.", 635, 190);
      cx2.font = "bold 15px Arial";
      cx2.fillText("リバースサークル", 635, 210);
      cx2.font = "14px Arial";
      cx2.fillText("MP消費:1ゲージ", 635, 230);
      cx2.fillText("逆転の空間を作り出し", 635, 250);
      cx2.fillText("その局の間,", 635, 270);
      cx2.fillText("パイを切る順序が", 635, 290);
      cx2.fillText("逆向きになる.", 635, 310);
    }else if(p==10){
      cx2.font = "bold 15px Arial";
      cx2.fillText("万能ニーシャ", 635, 130);
      cx2.font = "14px Arial";
      cx2.fillText("MP消費:1ゲージ", 635, 150);
      cx2.fillText("1局に1度だけ, ", 635, 170);
      cx2.fillText("以下のどちらかを", 635, 190);
      cx2.fillText("発動できる.", 635, 210);
      cx2.fillText("①次の局,ニーシャが", 635, 230);
      cx2.fillText("助けに来てくれる!", 635, 250);
      cx2.fillText("②手札の「ニーシャ」を", 635, 270);
      cx2.fillText("好きなパイに変える.", 635, 290);
      cx2.fillText("(オールマイティを除く)", 635, 310);
      }else{
      cx2.font = "bold 16px Arial";
      cx2.fillText("パッシブスキル", 635, 130);
      cx2.font = "14px Arial";
      cx2.fillText("　なし", 635, 150);
      cx2.font = "bold 16px Arial";
      cx2.fillText("アクティブスキル", 635, 210);
      cx2.font = "14px Arial";
      cx2.fillText("　なし", 635, 230);
      }
    break;
   default:
    //Buff
    drawbuttom2(635,10,"バフ",1,70,40,1)
    var y=130;
    if(LP[player]<0){
      cx2.font = "bold 20px Arial";
      cx2.fillText("戦闘不可", 635, y);
      cx2.font = "14px Arial";
      y+=20;
      var T=1+skillusage2[player]
      cx2.fillText(" "+T+"局後に復活", 635, y);
      y+=22
    }
    for(var i=1;i<12;i++){
      var A=Buff[player].filter(value=>value==i)
      if(A.length>0){
        switch(i){
          case 1:
            cx2.font = "bold 16px Arial";
            cx2.fillText("ストーンスキン", 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 自分へのスキル無効", 635, y);
            y+=22
            break;
          case 2:
            cx2.font = "bold 16px Arial";
            cx2.fillText("マナシールド"+A.length, 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 受けるダメージ減少", 635, y);
            y+=22
            break;
          case 3:
            cx2.font = "bold 16px Arial";
            cx2.fillText("ネイチャーフォース"+A.length, 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 勝利時戦闘力増加", 635, y);
            y+=22
            break;
          case 4:
            cx2.font = "bold 16px Arial";
            cx2.fillText("ナソードコア"+A.length, 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 勝利時追加ダメージ", 635, y);
            y+=20
            cx2.fillText(" 1度だけ,致死ダメージ", 635, y);
            y+=20
            cx2.fillText(" を受けた時食いしばり", 635, y);
            y+=22
            break;
          case 5:
            cx2.font = "bold 16px Arial";
            cx2.fillText("火傷", 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" ポン不可", 635, y);
            y+=22
            break;
          case 6:
            cx2.font = "bold 16px Arial";
            cx2.fillText("凍結"+A.length, 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 行動不可.", 635, y);
            y+=22
            break;
          case 7:
            cx2.font = "bold 16px Arial";
            cx2.fillText("環境　魔界"+A.length, 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 和了時の戦闘力が低下.", 635, y);
            y+=20;
            cx2.fillText(" だんだん適応していく.", 635, y);
            y+=20;
            cx2.fillText(" (1局ごとに重複数減少)", 635, y);
            y+=22
            break;
          case 11:
            cx2.font = "bold 16px Arial";
            cx2.fillText("再結集のための休息", 635, y);
            cx2.font = "14px Arial";
            y+=20;
            cx2.fillText(" 次の局まで待機.", 635, y);
            y+=22
            break;
          default:
            break;
        }
      }
    }
    break;
  }
  guidemap.removeAllChildren();
  var C=canvas2.toDataURL();
  var Cb = new createjs.Bitmap(C);
  guidemap.addChild(Cb);
  };
  function PopAnm(word=0,delay=800,width=135,height=35,x=30,y=20){
    //少しの時間だけ情報を表示する
  var C= new createjs.Shape();
  C.graphics.beginFill("black").drawRect(0,0,width,height);
  C.x=x-60;
  C.y=y;
  C.alpha=0;
  stage.addChild(C);
  var D= new createjs.Text(word, "bold 16px Arial", "white");
  D.x=x-60;
  D.y=y+10;
  D.alpha=0;
  stage.addChild(D);
  createjs.Tween.get(C)
  .to({x:x-30,alpha:0.7},200)
  .wait(delay)
  .to({alpha:0},200)
  .call(CDend);
  createjs.Tween.get(D)
  .to({x:30,alpha:1},200)
  .wait(delay)
  .to({alpha:0},200);
    function CDend (){
      stage.removeChild(C);
      stage.removeChild(D);
    }
  }
  //ローカルストレージ
  function save_Local(){
    try{
      UserData_Don = {
        "Title": Savetitle[0],
        "Name": Username,
        "Crest": Usercrest,
        "Chara":chara,
        "Volume":vBar,
        "SEVolume":sBar,
        "Config":musicset,
        "Rank":winrank,
        "AchieveA":achieveA,
        "AchieveB":achieveB,
        "Highscore":highscore,
        "MPV":mpVelocity,
        "DHS":dahaiSE,
        "tumoCon":tumoConfig,
        "PON":Ponrate,
        "FEV":Fever,
        "HiddenChr":HiddenChara,
      };    
  console.log(UserData_Don);
  PopAnm("セーブ完了");
  localStorage.setItem('UserData_Don', JSON.stringify(UserData_Don));
    }catch(e){
      console.log('ねこ')
    }
  }
  function saveUP_Local(){
    try{
  var getdata; // 読込むデータ
  getdata = JSON.parse(localStorage.getItem('UserData_Don'));
  Username=getdata.Name
  Usercrest=getdata.Crest
  chara=getdata.Chara.concat();
  musicset=getdata.Config.concat();
  vBar=getdata.Volume;
  sBar=getdata.SEVolume;
  winrank=getdata.Rank.concat();
  mpVelocity=getdata.MPV;
  dahaiSE=getdata.DHS
  tumoConfig=getdata.tumoCon;
  Ponrate=getdata.PON;
  Fever=getdata.FEV;
  HiddenChara=getdata.HiddenChr;
  //追加データ部分　undefinedなら初期値にしておく
  if(!winrank[0].length){
    winrank=[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
  }
  if (mpVelocity === void 0) {
    mpVelocity=1;
  }
  if (dahaiSE ===void 0){
    dahaiSE=1;
  }
  if (tumoConfig === void 0) {
    tumoConfig=0;
  }
  if (Fever === void 0) {
    Fever=-1;
  }
  if (HiddenChara === void 0) {
    HiddenChara=3;
  }
  if (Ponrate === void 0) {
    Ponrate=0.4;
  }
  for(var i=0; i<getdata.AchieveA.length; i++){
    A=achieveA.findIndex(value=>value.name==getdata.AchieveA[i].name);
    if(A!==-1){
      achieveA[A].cleared=getdata.AchieveA[i].cleared;
    }
  }
  for(var i=0; i<getdata.AchieveB.length; i++){
    A=achieveB.findIndex(value=>value.name==getdata.AchieveB[i].name);
    if(A!==-1){
      achieveB[A].cleared=getdata.AchieveB[i].cleared;
    }
  }
  highscore=getdata.Highscore.concat();
  if(highscore.length==4){
    var B=[0,0];
    highscore=highscore.concat(B);
  }
  SEbuffer();
  PopAnm("データロード完了",800,200);
  console.log('Userdata loaded');
    }catch(e){
      console.log('ねこ')
    }
  }
  function saveDel(){
    //デフォルトに戻す
  Username = "player";
  Usercrest = "称号なし";
  chara =new Array(0,0,0,0,0);
  vBar=1;
  sBar=1;
  musicset=new Array(0,0,0);
  winrank=[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
  highscore=[0,0,0,0,0,0];
  tumoConfig=0;
  Ponrate=0.4;
  mpVelocity=1;
  dahaiSE=1;
  for(var i=0; i<achieveA.length;i++){
    achieveA[i].id=i;
    achieveA[i].cleared=0;
  }
  for(var i=0; i<achieveB.length;i++){
    achieveB[i].id=i;
    achieveB[i].cleared=0;
    achieveB[i].count=0;
  }
  SEbuffer();
  //PopAnm("データ初期化完了",800,200);メッセージが流れない
    try{
      localStorage.clear();
      console.log('localStorage cleared');
      pagestate=0;
      Menu();
        }catch(e){
          console.log('ねこ')
      }
  }
  //セーブ&ロード
  function saveDL(){//*
    var json_obj = {
      "Title": Savetitle[0],
      "Name": Username,
      "Crest": Usercrest,
      "Chara":chara,
      "Volume":vBar,
      "SEVolume":sBar,
      "Config":musicset,
      "Rank":winrank,
      "AchieveA":achieveA,
      "AchieveB":achieveB,
      "Highscore":highscore,
      "MPV":mpVelocity,
      "DHS":dahaiSE,
      "tumoCon":tumoConfig,
      "PON":Ponrate,
      "FEV":Fever,
      "HiddenChr":HiddenChara,
    }
    console.log(json_obj)
    var write_json=JSON.stringify(json_obj);
    var blob=new Blob([write_json],{type: 'application/json'});
    var a =document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download='eldon_save.json';
    a.click();
    URL.revokeObjectURL(a.href);
    alert("【セーブデータ】\nファイル名／「eldon_save.json」\n保存方法／ファイルの中身や拡張子は変更しないでください。\n※セーブデータを読み込む際は、メニュー画面の状態で、画面枠外下部に記載の『ファイル選択』ボタンから、ダウンロードしたファイルを選んでくださいね。");
    }
    function saveUP(){
    var data; // 読込むデータ
    var button_read=document.createElement('input');
    button_read.setAttribute('type', 'file');
    // 参照要素を取得
    var sp2 = document.getElementById("child")
    // 親要素を取得
    var parentDiv = sp2.parentNode
    // 新しい要素を sp2 の手前に挿入
    parentDiv.insertBefore(button_read, sp2)
    //ボタン追加ここまで
    button_read.addEventListener("change" , function(){
        if(!(button_read.value)) return; // ファイルが選択されない場合
        var file_list=button_read.files;
        if(!file_list) return; // ファイルリストが選択されない場合
        var file=file_list[0];
        if(!file) return; // ファイルが無い場合
        if(pagestate!==1){
          alert("❌　セーブデータはメインメニュー画面の状態で読み込んでください");
          button_read.value = "";
          return;
        }
        if(JSON.parse(localStorage.getItem('UserData_Don')) !== null){
          var result = window.confirm('現在プレイ中のデータが上書きされますがよろしいですか？');
        if(!result) {
          console.log('upload cancelled');
          button_read.value = "";
          return;
            }
          }
        var file_reader=new FileReader();
        file_reader.readAsText(file);
        file_reader.onload=function(){
        if(file_reader.result.slice(1, 74)=='"Title":"This is savedata of <https://azurelsword.web.fc2.com/ronan.html>'){
        // .jsonの確認
    data=JSON.parse(file_reader.result); // 読込んでdataを上書き
    sp2.innerHTML = "<h1>Welcome Back!</h1>"
    //各々グローバル変数に代入していく
    Username=data.Name
    Usercrest=data.Crest
    chara=data.Chara.concat();
    musicset=data.Config.concat();
    vBar=data.Volume;
    sBar=data.SEVolume;
    winrank=data.Rank.concat();
    mpVelocity=data.MPV;
    dahaiSE=data.DHS;
    tumoConfig=data.tumoCon;
    Ponrate=data.PON;
    Fever=data.FEV;
    HiddenChara=data.HiddenChr;
    //追加データ部分　undefinedなら初期値にしておく
    if(!winrank[0].length){
      winrank=[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
    }
    if (mpVelocity === void 0) {
      mpVelocity=1;
    }
    if (dahaiSE === void 0){
      dahaiSE=1;
    }
    if (tumoConfig === void 0) {
      tumoConfig=0;
    }
    if (Fever === void 0) {
      Fever=-1;
    }
    if (HiddenChara === void 0) {
      HiddenChara=3;
    }
    if (Ponrate === void 0) {
      Ponrate=0.4;
    }
    //achieveA=data.AchieveA.concat();
    //dataにある分だけ上書き
    for(var i=0; i<data.AchieveA.length; i++){
      A=achieveA.findIndex(value=>value.name==data.AchieveA[i].name);
      if(A!==-1){
        achieveA[A].cleared=data.AchieveA[i].cleared;
      }
    }
    for(var i=0; i<data.AchieveB.length; i++){
      A=achieveB.findIndex(value=>value.name==data.AchieveB[i].name);
      if(A!==-1){
        achieveB[A].cleared=data.AchieveB[i].cleared;
      }
    }
    highscore=data.Highscore.concat();
    if(highscore.length==4){
      var B=[0,0];
      highscore=highscore.concat(B);
    }
    SEbuffer();
      jingle.seek(1);
      jingle.play();
      PopAnm("✅「"+Username+"」さんの　セーブデータを読み込みました",1200,500,35,30,55);
    console.log(Username,musicset);
    save_Local();
    pagestate=0;
    Menu();
    }  
    else{
        alert("❌　ファイルが異なります。");
        button_read.value = "";
    }}});
    }
    function SEbuffer(p=0){
      if(p!==0){
        se1.volume(0);
        se2.volume(0);
        se3.volume(0);
        se4.volume(0);
        se5.volume(0);
        se6.volume(0);
        se7.volume(0);
        se8.volume(0);
        se9.volume(0);
        se10.volume(0);
        se11.volume(0);
        se12.volume(0);
        se13.volume(0);
        se14.volume(0);
        se15.volume(0);
        se16.volume(0);
        se17.volume(0);
        se18.volume(0);
        se19.volume(0);
        se20.volume(0);
        jingle.volume(0);
        jingle2.volume(0);
        jingle3.volume(0);
      }else{
      se1.volume(0.25*sBar);
      se2.volume(0.4*sBar);
      se3.volume(0.3*sBar);
      se4.volume(0.3*sBar);
      se5.volume(0.2*sBar);
      se6.volume(0.25*sBar);
      se7.volume(0.15*sBar);
      se8.volume(0.2*sBar);
      se9.volume(0.3*sBar);
      se10.volume(0.3*sBar);
      se11.volume(0.3*sBar);
      se12.volume(0.2*sBar);
      se13.volume(0.3*sBar);
      se14.volume(0.3*sBar);
      se15.volume(0.3*sBar);
      se16.volume(0.3*sBar);
      se17.volume(0.3*sBar);
      se18.volume(0.18*sBar);
      se19.volume(0.6*sBar);
      se20.volume(0.15*sBar);
      jingle.volume(0.3*sBar);
      jingle2.volume(0.3*sBar);
      jingle3.volume(0.3*sBar);
      }
    }   
  };