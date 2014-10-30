var Sheep = function (position, team) {
  this.position = new Vec2(position.x, position.y);
  this.size = 1;
  this.team = team;

  this.target = null;
  this.hit = false;

  this.hp = 1;
  
  this.velocity = new Vec2();
  this.diff = new Vec2();

  pop[team]++;
};

Sheep.prototype.speed = 0.1;

Sheep.prototype.think = function () {

  // for(var i in entities) {
  //   var e = entities[i];
  //   if(e === this) continue;
  //   if(e.type === "sheep" && this.team !== e.team) {
  //     this.diff.sub(this.position, e.position);
  //     if(this.diff.magSq() < this.range * this.range + e.size + e.size) {
  //       newTarget = e;
  //     }
  //   }
  // }

  this.velocity.x = Math.random() * 0.5 - 0.25;
  this.velocity.y = Math.random() * 0.5 - 0.25;
  
}

Sheep.prototype.update = function () {
  res[this.team] += 1;

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
    pop[this.team]--;
    fx.explosion(this.position, 3);
    return;
  }


  this.position.add(this.position, this.velocity);
  bounds.moveIn(this);
};

Sheep.prototype.draw = function () {

  cx.save();
  cx.translate(this.position.x, this.position.y);

  cx.beginPath();
  cx.arc(0, 0, this.size, Math.TAU, 0);
  cx.closePath();

  cx.fillStyle = colors.team[this.team];
  cx.strokeStyle = colors.black;

  cx.fill();
  cx.stroke();

  cx.restore();
  
};

Sheep.prototype.type = "sheep";
