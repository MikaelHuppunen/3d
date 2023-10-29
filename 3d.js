
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

let size = [];
size[0] = 1;
size[1] = 1;
let newsize = [];
let dx = [];
let dz = [];
let x = [0,0,50];
let y = [100,100,100];
let z = [0,25,25];
let visible = [];
let object = [];
const dobject = [];
const dzobject = [];
let floor = [];
let shoot_projectiles = true;
let throw_velocity = 10;

class cube{
	constructor(b, c, d, e){
		let coordinates = [];
		coordinates[0] = [[b,c+e,d],[b,c+e,d+e],[b+e,c+e,d+e]];
		coordinates[1] = [[b+e,c+e,d+e],[b+e,c+e,d],[b,c+e,d]];
		coordinates[2] = [[b+e,c+e,d+e],[b+e,c+e,d],[b+e,c,d]];
		coordinates[3] = [[b+e,c+e,d+e],[b+e,c,d],[b+e,c,d+e]];
		coordinates[4] = [[b+e,c,d],[b+e,c,d+e],[b,c,d]];
		coordinates[5] = [[b+e,c,d+e],[b,c,d],[b,c,d+e]];
		coordinates[6] = [[b,c,d],[b,c,d+e],[b,c+e,d]];
		coordinates[7] = [[b,c,d+e],[b,c+e,d],[b,c+e,d+e]];
		coordinates[8] = [[b,c,d+e],[b,c+e,d+e],[b+e,c+e,d+e]];
		coordinates[9] = [[b,c,d+e],[b+e,c,d+e],[b+e,c+e,d+e]];
		coordinates[10] = [[b,c,d],[b,c+e,d],[b+e,c+e,d]];
		coordinates[11] = [[b,c,d],[b+e,c,d],[b+e,c+e,d]];
		for(let i = b; i < b+e+1; i++){
			floor[i] = floor[i]??[];
			for(let ii = c; ii < c+e+i; ii++){
				floor[i][ii] = d+e;
			}
		}
		this.coordinates = coordinates;
		this.type = "cube";
		this.gravity = false;
		this.color = "black";
	}

}

class rectangle{
	constructor(x, y, z, width, length, height){
		let coordinates = [];
		coordinates[0] = [[x,y+length,z],[x,y+length,z+height],[x+width,y+length,z+height]];
		coordinates[1] = [[x+width,y+length,z+height],[x+width,y+length,z],[x,y+length,z]];
		coordinates[2] = [[x+width,y+length,z+height],[x+width,y+length,z],[x+width,y,z]];
		coordinates[3] = [[x+width,y+length,z+height],[x+width,y,z],[x+width,y,z+height]];
		coordinates[4] = [[x+width,y,z],[x+width,y,z+height],[x,y,z]];
		coordinates[5] = [[x+width,y,z+height],[x,y,z],[x,y,z+height]];
		coordinates[6] = [[x,y,z],[x,y,z+height],[x,y+length,z]];
		coordinates[7] = [[x,y,z+height],[x,y+length,z],[x,y+length,z+height]];
		coordinates[8] = [[x,y,z+height],[x,y+length,z+height],[x+width,y+length,z+height]];
		coordinates[9] = [[x,y,z+height],[x+width,y,z+height],[x+width,y+length,z+height]];
		coordinates[10] = [[x,y,z],[x,y+length,z],[x+width,y+length,z]];
		coordinates[11] = [[x,y,z],[x+width,y,z],[x+width,y+length,z]];
		for(let i = x; i < x+width+1; i++){
			floor[i] = floor[i]??[];
			for(let ii = y; ii < y+length+1; ii++){
				floor[i][ii] = z+height;
			}
		}
		this.coordinates = coordinates;
		this.type = "rectangle";
		this.gravity = false;
		this.color = "black";
	}
}

class ball{
	constructor(x, y, z, radius){
		this.coordinates = [[[x, y, z]]];
		this.radius = radius;
		this.perceived_radius = radius;
		this.type = "ball";
		this.gravity = true;
		this.bounce = 1;
		this.velocity = [0,0,0];
		this.color = "white";
	}
}

class cup{
	constructor(){
		let object1 = new rectangle(1100, 1100, 100, 5, 50, 25);
		let object2 = new rectangle(1100, 1100, 100, 50, 5, 25);
		let object3 = new rectangle(1150, 1100, 100, 5, 50, 25);
		let object4 = new rectangle(1100, 1150, 100, 50, 5, 25);
		
		object1.color = "red";
		object2.color = "red";
		object3.color = "red";
		object4.color = "red";

		object.push(object1);
		object.push(object2);
		object.push(object3);
		object.push(object4);
	}
}

for(let i = 0; i < 100; i++){
	let new_object = new cube(0,600+300*i,100*i,100);
	object.push(new_object);
}
object.push(new rectangle(1000, 1000, 0, 500, 200, 100));
new cup();
for(let i = 0; i < 1; i++){
	let new_object = new ball(200,700+300*i,100+100*i,10);
	object.push(new_object);
}

for(let i = 0; i < object.length; i++){
	visible[i] = [];
	dobject[i] = [];
	dzobject[i] = [];
	for(let ii = 0; ii < object[i].coordinates.length; ii++){
		dobject[i][ii] = [];
		dzobject[i][ii] = [];
		visible[i][ii] = [];
	}
}
let playerx = 0, playery = 0;
let playerheight = 200;
let playerz = 0;
let playervz = 0;
let playervx = 0;
let playervy = 0;
let horizontal_angle = 0, vertical_angle = 0;
let angle2 = 0;
let angle3;
let anglez;
let playerspeed = 5;
let wpressed = 0;
let apressed = 0;
let spressed = 0;
let dpressed = 0;

function floorheight(x, y){
	return (floor[Math.floor(x)] == undefined?0:floor[Math.floor(x)][Math.floor(y)]??0);
}

function draw_triangle(a, b, c, d, e, f){
	ctx.beginPath();
	ctx.moveTo(750+a, 350-d);
	ctx.lineTo(750+b, 350-e);
	ctx.lineTo(750+c, 350-f);
	ctx.lineTo(750+a, 350-d);
	ctx.fill();
}

function draw_ball(x, y, radius){
	ctx.beginPath();
	ctx.arc(750+x, 350-y, radius, 0, 2 * Math.PI);
	ctx.fill();
}

function perspective(){
	for(let i = 0; i < object.length; i++){
		for(let ii = 0; ii < object[i].coordinates.length; ii++){
			for(let iii = 0; iii < object[i].coordinates[ii].length; iii++){
				let d = object[i].coordinates[ii][iii][1] - playery;
				let d1 = object[i].coordinates[ii][iii][0] - playerx;
				let d2 = object[i].coordinates[ii][iii][2] - (playerz + playerheight);
				angle2 = Math.atan(d1/d) + Math.PI*(d < 0);
				angle3 = angle2-horizontal_angle;
				angle3 += 2*Math.PI*(angle3 < -Math.PI) - 2*Math.PI*(angle3 > Math.PI);
				anglez = Math.atan(d2/Math.sqrt(Math.pow(d,2)+Math.pow(d1,2))) - vertical_angle;
				dobject[i][ii][iii] = angle3*750/(Math.PI/4);
				dzobject[i][ii][iii] = 750*anglez/(Math.PI/4);
				visible[i][ii][iii] = (angle3<Math.PI/2)
				*(angle3>-Math.PI/2);
				if(object[i].type == "ball"){
					object[i].perceived_radius = object[i].radius*Math.abs(750/Math.sqrt(Math.pow(d,2)+Math.pow(d1,2)));
				}
			}
		}
	}
}

function object_move(dt){
	for(let i = 0; i < object.length; i++){
		if(object[i].gravity){
			object[i].velocity[2] -= 1/10*dt;
			object[i].coordinates[0][0][0] += object[i].velocity[0]*dt;
			object[i].coordinates[0][0][1] += object[i].velocity[1]*dt;
			object[i].coordinates[0][0][2] += object[i].velocity[2]*dt;
			if(object[i].coordinates[0][0][2] <= floorheight(object[i].coordinates[0][0][0],object[i].coordinates[0][0][1])
			  && object[i].velocity[2] < 0){
				object[i].velocity[2] *= -object[i].bounce;
			}
			if(object[i].coordinates[0][0][2] < floorheight(object[i].coordinates[0][0][0],object[i].coordinates[0][0][1])-object[i].radius){
			  object[i].velocity[0] *= -object[i].bounce;
			  object[i].velocity[1] *= -object[i].bounce;
		  }
		}
	}
}

document.addEventListener('mousedown', throw_projectile);


function throw_projectile(){
	let new_projectile = new ball(playerx,playery,playerz+playerheight, 5);

	new_projectile.bounce = 0.6;

	new_projectile.velocity[0] = throw_velocity*Math.cos(vertical_angle)*Math.sin(horizontal_angle)+playervx;
	new_projectile.velocity[1] = throw_velocity*Math.cos(vertical_angle)*Math.cos(horizontal_angle)+playervy;
	new_projectile.velocity[2] = throw_velocity*Math.sin(vertical_angle)+playervz;

	object.push(new_projectile);

	let index = object.length-1;
	visible[index] = [];
	dobject[index] = [];
	dzobject[index] = [];
	for(let ii = 0; ii < object[index].coordinates.length; ii++){
		dobject[index][ii] = [];
		dzobject[index][ii] = [];
		visible[index][ii] = [];
	}
}

function move(event){
	let k = event.keyCode;
	if(k == 83){
		spressed = 1;
	}
	if(k == 87){
		wpressed = 1;
	}
	if(k == 65){
		apressed = 1;
	}
	if(k == 68){
		dpressed = 1;
	}
	if(k == 32 && playerz == floorheight(playerx, playery)){
		playervz += 5;
	}
}

function keyup(event){
	let k = event.keyCode;
	if(k == 83){
		spressed = 0;
	}
	if(k == 87){
		wpressed = 0;
	}
	if(k == 65){
		apressed = 0;
	}
	if(k == 68){
		dpressed = 0;
	}
}

addEventListener('keyup', keyup);
addEventListener('keydown', move);

function turn(event){
	horizontal_angle = (event.clientX-750)*Math.PI/750;
	vertical_angle = (350-event.clientY)*Math.PI/700;
}

function playermovement(){
	playervx = (wpressed*Math.sin(horizontal_angle)-spressed*Math.sin(horizontal_angle)+dpressed*Math.cos(horizontal_angle)-apressed*Math.cos(horizontal_angle))*playerspeed;
	playervy = (wpressed*Math.cos(horizontal_angle)-spressed*Math.cos(horizontal_angle)+apressed*Math.sin(horizontal_angle)-dpressed*Math.sin(horizontal_angle))*playerspeed;
	let speednow = Math.sqrt(Math.pow(playervx,2)+Math.pow(playervy,2))/playerspeed;
	playervx /= speednow + (speednow == 0);
	playervy /= speednow + (speednow == 0);
	playerz += playervz;
	playerx += (floorheight(playerx+playervx,playery+playervy) - playerz < 50) * playervx;
	playery += (floorheight(playerx+playervx,playery+playervy) - playerz < 50) * playervy;
	if(playerz > floorheight(playerx,playery) || playervz > 0){
		playervz -= 1/10;
	}
	playervz *= (playerz > floorheight(playerx,playery));
	if(playerz < floorheight(playerx,playery)){
		playerz = floorheight(playerx,playery);
	}
}

addEventListener('mousemove', turn);

let real_time = new Date();
let cycle = 0;
function draw(){
	perspective();
	playermovement();
	for(let i = 0; i < 100; i++){
		object_move(1/100);
	}
	if(cycle < 100){
		cycle++;
	}else{
		cycle = 0;
		console.log(Math.round(10*100000/(new Date()-real_time))/10 + "fps");
		real_time = new Date();
	}
	ctx.clearRect(0,0,1500,700);
	ctx.fillStyle = "#87CEEB";
	ctx.fillRect(0,0,1500,2000);
	ctx.fillStyle = "gray";
	ctx.fillRect(0,350+750*vertical_angle/(Math.PI/4),1500,2000);
	for(let i = 0; i < object.length; i++){
		ctx.fillStyle = object[i].color;
		if(object[i].type == "ball"){
			draw_ball(dobject[i][0][0], dzobject[i][0][0], object[i].perceived_radius);
		}
		else{
			for(let ii = 0; ii < object[i].coordinates.length; ii++){
				if(visible[i][ii][0] == 1 || visible[i][ii][1] || visible[i][ii][2]){
					draw_triangle(dobject[i][ii][0],dobject[i][ii][1],dobject[i][ii][2],dzobject[i][ii][0],dzobject[i][ii][1],dzobject[i][ii][2]);
				}
			}
		}
	}
	for(let i = 0; i < 0; i++){
		ctx.fillRect(750+dx[i]-(newsize[i]/2), 300-(newsize[i]/2), newsize[i], newsize[i]);
	}
}

let game = setInterval(draw, 10);