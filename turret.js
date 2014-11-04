var Turret = function (position, team) {
  this.position = new Vec2(position.x, position.y);
  this.size = 4;
  this.team = team;

  this.target = null;
  this.energy = 0;
  this.hit = false;

  this.hp = 5;
  
  this.state = 0;

  this.range = 40;

  this.diff = new Vec2();

  this.velocity = new Vec2(Math.random() - 0.5, Math.random() - 0.5);
  this.cooldown = 0;

  pop[team]++;

};

Turret.prototype.speed = 0.2;

Turret.prototype.think = function () {

  //if(this.state === 0) return;

  var newTarget = null;

  for(var i in entities) {
    var e = entities[i];
    if(e === this) continue;
    if(this.team !== e.team && (e.type === "fighter")) {
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

Turret.prototype.update = function () {

  this.hit = false;

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

  }

  if(this.hp <= 0){
    this.trash = true;
    pop[this.team]--;
    fx.explosion(this.position, 4);
    return;
  }

  if(this.target && this.cooldown < 0) {
    this.cooldown = 50;
    spawn(new Rocket(this.position, this, this.target));
  }

  this.cooldown -= 1;
  bounds.moveIn(this);
};

Turret.prototype.draw = function () {

  if(this.target){
    cx.strokeStyle = colors.range;
    cx.beginPath()
    cx.moveTo(this.position.x, this.position.y);
    cx.lineTo(this.target.position.x, this.target.position.y);
    cx.stroke();
  }

  cx.save();
  cx.translate(this.position.x, this.position.y);


  cx.fillStyle = colors.team[this.team];
  cx.strokeStyle = this.hit ? colors.hit : colors.black;
  cx.fillRect(0,0,this.size,this.size);
  cx.strokeRect(0,0,this.size,this.size);

  cx.restore();
  
};

Turret.prototype.type = "turret";
