var Sheep = function (position, team) {
  this.position = new Vec2(position.x, position.y);
  this.size = 1;
  this.team = team;

  this.target = null;
  this.scan = 100;
  this.hit = false;

  this.hp = 1;

  this.velocity = new Vec2(Math.random() - 0.5, Math.random() - 0.5);
  this.diff = new Vec2();

  pop[team]++;
};

Sheep.prototype.speed = 0.1;

Sheep.prototype.think = function () {
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


  this.velocity.scale(0.9);
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
