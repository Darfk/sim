var Rocket = function (position, owner, target) {
  this.position = new Vec2(position.x, position.y);
  this.size = 1;
  this.team = owner.team;

  this.life = 100;

  this.velocity = new Vec2();
  this.direction = new Vec2();

  this.velocityOffset = new Vec2();

  this.direction.sub(target.position, this.position);
  this.velocityOffset.add(this.velocityOffset, target.velocity);
  // because the rocket's velocity is not linear, this gets tricky
  this.velocityOffset.scale(this.direction.mag() * 1.85);
  this.direction.add(this.velocityOffset, this.direction);
  this.direction.normalize();

  this.speed = 0;
  
};

Rocket.prototype.update = function (t) {

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

  this.position.add(this.position, this.velocity);

  this.speed += 0.01;
  this.speed = Math.min(this.speed, 1);
  
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
