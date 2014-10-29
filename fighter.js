var Fighter = function (position, team) {
  this.position = new Vec2(position.x, position.y);
  this.size = 2;
  this.team = team;

  this.target = null;
  this.energy = 0;
  this.hit = false;

  this.hp = 3;
  
  this.range = 50;

  this.diff = new Vec2();
  this.velocity = new Vec2();

  this.cooldown = 0;
};

Fighter.prototype.think = function () {

  var newTarget = null;

  for(var i in entities) {
    var e = entities[i];
    if(e === this) continue;
    if(e.type === "fighter" && this.team !== e.team) {
      this.diff.sub(this.position, e.position);
      if(this.diff.magSq() < this.range * this.range + e.size + e.size) {
        newTarget = e;
      }
    }
  }

  if(newTarget) {
    this.target = newTarget;
  }else{
    this.target = null;
  }

  this.velocity.x = Math.random() * 0.2 - 0.1;
  this.velocity.y = Math.random() * 0.2 - 0.1;
  
}

Fighter.prototype.update = function () {

  this.hit = false;

  for(var i in entities) {
    var e = entities[i];
    if(!e) continue;
    if(e === this) continue;
    if(e.type === "rocket") {
      if(e.team === this.team) continue;
      this.diff.sub(this.position, e.position)
      if(this.diff.magSq() < this.size * this.size + e.size + e.size) {
        fx.explosion(e.position, 1);
        e.trash = true;
        this.hit = true;
        this.hp -= 1;
      }
    }
  }

  if(this.hp <= 0){
    this.trash = true;
    fx.explosion(this.position, 4);
    return;
  }

  if(this.target && this.cooldown < 0 && this.energy >= 5) {
    this.cooldown = 100;
    spawn(new Rocket(this.position, this, this.target));
  }

  this.cooldown -= 1;

  this.energy += 1;
  this.energy = Math.max(this.energy, 0);
  this.energy = Math.min(this.energy, 10);

  this.position.add(this.position, this.velocity);
};

Fighter.prototype.draw = function () {

  // if(this.target){
  //   cx.strokeStyle = colors.range;
  //   cx.beginPath()
  //   cx.moveTo(this.position.x, this.position.y);
  //   cx.lineTo(this.target.position.x, this.target.position.y);
  //   cx.stroke();
  // }

  cx.save();
  cx.translate(this.position.x, this.position.y);

  // cx.save();
  // cx.fillStyle = colors.range;
  // cx.strokeStyle = colors.range;
  // cx.beginPath();
  // cx.arc(0, 0, this.range, 0, Math.TAU);
  // cx.stroke();
  // cx.globalAlpha = 0.2;
  // cx.fill();
  // cx.restore();

  cx.beginPath();
  cx.moveTo(Math.sin(0) * this.size, Math.cos(0) * this.size)
  cx.lineTo(Math.sin(Math.TAU*1/3) * this.size, Math.cos(Math.TAU*1/3) * this.size)
  cx.lineTo(Math.sin(Math.TAU*2/3) * this.size, Math.cos(Math.TAU*2/3) * this.size)
  cx.closePath();

  cx.fillStyle = colors.team[this.team];
  cx.strokeStyle = this.hit ? colors.hit : colors.black;

  cx.fill();
  cx.stroke();

  cx.restore();
  
};

Fighter.prototype.type = "fighter";
