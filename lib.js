Math.TAU = Math.PI * 2;

var Vec2 = function(x, y){
  this.x = x || 0;
  this.y = y || 0;
};

Vec2.prototype = {
  add: function(a, b){
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
  },
  sub: function(a, b){
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  },
  mag: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  magSq: function () {
    return this.x * this.x + this.y * this.y;
  },
  normalize: function () {
    var m = this.mag();
    if(m===0){
      this.x = 0;
      this.y = 0;
      return this;
    }
    this.x /= m;
    this.y /= m;
    return this;
  },
  scale: function (s) {
    this.x *= s;
    this.y *= s;
    return this;
  },
  copy: function (a) {
    this.x = a.x;
    this.y = a.y;
    return this;
  },
  lerp:function(v, a){
    this.x += ( v.x - this.x ) * a;
    this.y += ( v.y - this.y ) * a;
    return this;
  },
  lerp2:function(v1, v2, a){
    this.x = (1 - a) * v1.x + a * v2.x;
    this.y = (1 - a) * v1.y + a * v2.y;
    return this;
  },
  derp:function(v1, v2, a){
    a = -Math.pow(a-1,2)+1;
    this.x = (1 - a) * v1.x + a * v2.x;
    this.y = (1 - a) * v1.y + a * v2.y;
    return this;
  },
  dot:function(v){
    return this.x * v.x + this.y * v.y;
  }
};

Input = function() {
  this.keys = []; this.keyPressFrame = []; this.keyReleaseFrame = [];
  
  for(var i=0;i<255;i++) {
    this.keys[i] = 0;
  }

  for(var i=0;i<255;i++) {
    this.keyReleaseFrame[i] = 0;
  }

  for(var i=0;i<255;i++) {
    this.keyPressFrame[i] = 0;
  }
};

Input.prototype = {
  keyPress:function (c) { this.keyPressFrame[c] = true; },
  keyRelease:function (c) { this.keyPressFrame[c] = false; },
  update:function() {
    for(var i=0;i<255;i++) { if(this.keyPressFrame[i]) { ++this.keys[i]; }else{ this.keys[i] = 0; } }
  },
  bind:function () {
    document.body.addEventListener("keydown", function (e) { this.keyPress(e.keyCode); }, false);
    document.body.addEventListener("keyup", function (e) { this.keyRelease(e.keyCode); }, false);
  },
};
