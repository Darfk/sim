var Res = function (position) {
  this.position = new Vec2(position.x, position.y);
  this.size = 1;
  this.team = -1;

  this.life = 100;

  this.velocity = new Vec2();
};

Res.prototype.update = function (t) {

  this.velocity.copy(this.direction);
  this.velocity.scale(this.speed);
  
  this.life -= 1;
  if(this.life<=0){
    fx.explosion(this.position, 1);
    this.trash = true;
  }

  if(t%4===0){
    fx.explosion(this.position, 0.2);
  }

};

Res.prototype.draw = function () {

  cx.save();
  cx.translate(this.position.x, this.position.y);
  cx.fillStyle = colors.res;
  cx.rotate(Math.atan2(this.velocity.y, this.velocity.x));
  cx.fillRect(-0.4, -0.2, 0.8, 0.4);
  cx.restore();
  
};

Res.prototype.type = "res";
