var Fighter = function (position, team) {
  this.position = new Vec2(position.x, position.y);
  this.size = 2;
  this.team = team;

  this.target = null;
  this.energy = 0;
  this.hit = false;

  this.hp = 3;
  
  this.range = 30;
  this.feel = 30;
  this.personal = 5;

  this.diff = new Vec2();

  this.velocity = new Vec2();
  this.speed = 0.4;
  this.direction = new Vec2(Math.random() - 0.5, Math.random() - 0.5);

  this.cooldown = 0;

  pop[team]++;

};

Fighter.prototype.speed = 0.2;

Fighter.prototype.think = function () {

  var newTarget = null;

  for(var i in entities) {
    var e = entities[i];
    if(e === this) continue;
    if(this.team !== e.team && (e.type === "fighter" || e.type === "sheep" || e.type === "commander")) {
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
  
}

Fighter.prototype.update = function () {

  this.hit = false;

  var friends = [];

  for(var i in entities) {
    var e = entities[i];
    if(!e) continue;
    if(e === this) continue;
    if(e.type === "rocket") {
      if(e.team === this.team) continue;
      this.diff.sub(this.position, e.position);
      if(this.diff.magSq() < this.size * this.size + e.size + e.size) {
        fx.explosion(e.position, 1);
        e.trash = true;
        this.hit = true;
        this.hp -= 1;
      }
    }

    if(e.type === "fighter" && e.team === this.team) {
      this.diff.sub(this.position, e.position);
      if(this.diff.magSq() < this.feel * this.feel) {
        friends.push(e);
      }
    }
  }

  for(var i in friends) {
    this.diff.sub(friends[i].position, this.position);

    var dmsq = this.diff.magSq();

    this.diff.scale(0.002);
    if(dmsq < this.personal * this.personal) {
      this.diff.scale(friends.length);
      this.direction.sub(this.direction, this.diff);
    }else{
      this.diff.scale(1/friends.length);
      this.direction.add(this.direction, this.diff);
    }
  }

  if(this.hp <= 0){
    this.trash = true;
    pop[this.team]--;
    fx.explosion(this.position, 4);
    return;
  }

  if(this.target && this.cooldown < 0) {
    this.cooldown = 100;
    spawn(new Rocket(this.position, this, this.target));
  }

  this.cooldown -= 1;

  if(this.position.y > bounds.bottom - this.feel) this.direction.y -= 0.1;
  if(this.position.y < bounds.top + this.feel) this.direction.y += 0.1;

  if(this.position.x > bounds.right - this.feel) this.direction.x -= 0.1;
  if(this.position.x < bounds.left + this.feel) this.direction.x += 0.1;
  

  this.direction.normalize();
  this.velocity.add(this.velocity, this.direction);

  this.velocity.normalize();
  this.velocity.scale(this.speed);


  this.position.add(this.position, this.velocity);
  bounds.moveIn(this);
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
  // cx.fillStyle = colors.feel;
  // cx.strokeStyle = colors.feel;
  // cx.beginPath();
  // cx.arc(0, 0, this.feel, 0, Math.TAU);
  // cx.stroke();
  // cx.restore();

  // cx.save();
  // cx.fillStyle = colors.personal;
  // cx.strokeStyle = colors.personal;
  // cx.beginPath();
  // cx.arc(0, 0, this.personal, 0, Math.TAU);
  // cx.stroke();
  // cx.restore();

  // cx.save();
  // cx.fillStyle = colors.range;
  // cx.strokeStyle = colors.range;
  // cx.beginPath();
  // cx.arc(0, 0, this.range, 0, Math.TAU);
  // cx.stroke();
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
