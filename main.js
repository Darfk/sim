var aspect = 16/9;
var height = 720;
var canvas = document.createElement('canvas');
document.body.style.backgroundColor = 'black';
document.body.appendChild(canvas);
document.documentElement.style.height = '100%';
canvas.width = height * aspect;
canvas.height = height;
var cx = canvas.getContext("2d");

var colors = {
  team:{
    0:"#f88",
    1:"#88f",
  },
  hit: "#fff",
  black: "#000",
  rocket: "#888",
  range: "#800",
  boom: "#ff8",
};

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

spawn(new Commander(new Vec2(10, 30), 0));
spawn(new Commander(new Vec2(80, 30), 1));

function spawn(e) {
  newEntities.push(e);
}

function start() {

  var timing = 0;

  function main () {

    fx.save();
    fx.scale(10, 10);
    fx.globalAlpha = 1;

    if(timing % 60 === 0){
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

    cx.scale(10, 10);
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
