var aspect = 16/9;
var height = 720;
var canvas = document.createElement("canvas");
document.body.style.backgroundColor = "black";
document.body.appendChild(canvas);
document.documentElement.style.height = "100%";

if(window.location.host === "darfk.github.io"){
  canvas.style.top = "0";
  canvas.style.bottom = "0";
  canvas.style.left = "0";
  canvas.style.right = "0";
  canvas.style.position = "absolute";
  canvas.style.width = "100%";
  canvas.style.height = "100%";

}

canvas.width = height * aspect;
canvas.height = height;
var cx = canvas.getContext("2d");

var colors = {
  team:{
    0:"#f88",
    1:"#88f",
    2:"#8f8",
    3:"#eee",
  },
  hit: "#fff",
  black: "#000",
  rocket: "#888",
  range: "#800",
  feel: "#080",
  personal: "#008",
  boom: "#ff8",
  res: "#ff8",
};

var rescap = 5000;

var res = {
  0:0,
  1:0,
  2:0,
  3:0,
};

var popcap = 50;

var pop = {
  0:0,
  1:0,
  2:0,
  3:0,
};

var bounds = {
  left:0,
  top:0,
  bottom:200,
  right:200*aspect,
  moveIn:function (e) {
    if(e.position.x > bounds.right) e.position.x = bounds.right;
    if(e.position.x < bounds.left) e.position.x = bounds.left;
    if(e.position.y > bounds.bottom) e.position.y = bounds.bottom;
    if(e.position.y < bounds.top) e.position.y = bounds.top;
  },
}

var fxCanvas = document.createElement('canvas');
fxCanvas.width = height * aspect;
fxCanvas.height = height;
var fx = fxCanvas.getContext("2d");

fx.explosion = function (position, magnitude) {
  fx.beginPath();
  fx.arc(position.x, position.y, magnitude, 0, Math.TAU);
  fx.fillStyle = colors.boom;
  fx.fill();
};

var entities = [];
var newEntities = [];

var redCommander = new Commander(new Vec2(bounds.left + 50, bounds.bottom - 50), 0);
redCommander.buildQueue = [0,1];
var blueCommander = new Commander(new Vec2(bounds.right - 50, bounds.top + 50), 1);
blueCommander.buildQueue = [0,1,1,1,1];
var greenCommander = new Commander(new Vec2(bounds.left + 50, bounds.top + 50), 2);
greenCommander.buildQueue = [0,1,1,1,1];
var whiteCommander = new Commander(new Vec2(bounds.right - 50, bounds.bottom - 50), 3);
whiteCommander.buildQueue = [0,1,1];

spawn(redCommander);
spawn(blueCommander);
spawn(greenCommander);
spawn(whiteCommander);


function buildFighter(position, team) {
  if(res[team] >= 1000 && pop[team] < popcap) {
    res[team] -= 1000;
    spawn(new Fighter(position, team));
    return true;
  }
  return false;
}

function buildTurret(position, team) {
  if(res[team] >= 1200 && pop[team] < popcap) {
    res[team] -= 1200;
    spawn(new Turret(position, team));
    return true;
  }
  return false;
}


function buildSheep(position, team) {
  if(res[team] >= 300 && pop[team] < popcap) {
    res[team] -= 300;
    spawn(new Sheep(position, team));
    return true;
  }
  return false;
}

function spawn(e) {
  newEntities.push(e);
}

function start() {

  var timing = 0;

  function main () {

    fx.save();
    fx.scale(cx.canvas.width / bounds.right, cx.canvas.height / bounds.bottom);
    fx.globalAlpha = 1;

    if(timing % 10 === 0){
      for(var i in entities){
        if(typeof entities[i].think === "function") {
          entities[i].think();
        }
      }
    }

    var bbents = [];

    for(var i in newEntities){
      entities.push(newEntities[i]);
    }
    newEntities = [];

    for(var i in res){
      res[i] = Math.min(res[i], rescap);
    }

    for(var i in entities){
      entities[i].update(timing);
      if(entities[i].trash) {
        delete entities[i];
      }
    }

    cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height);
    cx.fillStyle = colors.black;
    cx.fillRect(0, 0, cx.canvas.width, cx.canvas.height)
    cx.drawImage(fx.canvas, 0, 0);

    cx.lineWidth = 0.2;

    cx.save();

    cx.scale(cx.canvas.width / bounds.right, cx.canvas.height / bounds.bottom);
    for(var i in entities){
      entities[i].draw();
    }

    fx.restore();
    cx.restore();

    fx.globalAlpha = 0.1;
    fx.fillRect(0, 0, fx.canvas.width, fx.canvas.height)
    timing++;
    requestAnimationFrame(main);
  }
  main();
}
