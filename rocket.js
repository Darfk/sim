var Rocket = function (position, owner, target) {
  this.position = new Vec2(position.x, position.y);
  this.size = 1;
  this.team = owner.team;

  this.life = 1000;

  this.target = target;

  this.velocity = new Vec2();
  this.speed = 0.4;
  
};

Rocket.prototype.update = function (t) {

  if(this.target){
    if(this.target.trash){
      this.target = null
    }else{
      this.velocity.sub(this.target.position, this.position);
      this.velocity.normalize();
      this.velocity.scale(this.speed);
    }
  }

  if(t%1===0){
    fx.explosion(this.position, 0.2);
  }

  this.position.add(this.position, this.velocity);
  this.life -= 1;

  if(this.life<=0){
    fx.explosion(this.position, 1);
    this.trash = true;
  }

};

Rocket.prototype.draw = function () {

  cx.save();
  cx.translate(this.position.x, this.position.y);
  cx.fillStyle = colors.rocket;
  cx.rotate(Math.atan2(this.velocity.y, this.velocity.x));
  cx.fillRect(-0.4, -0.2, 0.8, 0.4);
  cx.restore();
  
};

Rocket.prototype.type = "rocket";
