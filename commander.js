var Commander = function (position, team) {
  this.position = new Vec2(position.x, position.y);
  this.size = 3;
  this.team = team;

  this.target = null;
  this.energy = 0;
  this.hit = false;

  this.hp = 3;
  
  this.range = 50;

  this.diff = new Vec2();
  this.velocity = new Vec2();

};

Commander.prototype.think = function () {

  // var newTarget = null;

  // for(var i in entities) {
  //   var e = entities[i];
  //   if(e === this) continue;
  //   if(e.type === "commander" && this.team !== e.team) {
  //     this.diff.sub(this.position, e.position);
  //     if(this.diff.magSq() < this.range * this.range + e.size + e.size) {
  //       newTarget = e;
  //     }
  //   }
  // }

}

Commander.prototype.update = function () {
  this.hit = false;

  if(this.energy >= 50){
    spawn(new Fighter(this.position, this.team));
    this.energy -= 50;
  }

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
    fx.explosion(this.position, 20);
    return;
  }

  this.energy += 1;
  this.energy = Math.max(this.energy, 0);
  this.energy = Math.min(this.energy, 100);

  this.position.add(this.position, this.velocity);
};

Commander.prototype.draw = function () {

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
  var m = 5;
  for(var i=0;i<m;++i){
    cx.lineTo(Math.sin(Math.TAU*i/m) * this.size, Math.cos(Math.TAU*i/m) * this.size)
  }
  cx.closePath();

  cx.fillStyle = colors.team[this.team];
  cx.strokeStyle = this.hit ? colors.hit : colors.black;
  cx.fill();
  cx.stroke();

  cx.restore();
  
};

Commander.prototype.type = "commander";
