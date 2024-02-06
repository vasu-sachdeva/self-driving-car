const canvas = document.getElementById('myCanvas');

canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width/2, canvas.width*0.9);
const car = new Car(road.getLaneCenter(1),100,30,50,"CONTROLLED"); // x, y, width, height
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -100, 30, 50,"DUMMY",2)
];

animate();
function animate(){
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, []); //empty array is being passed because the NPC cars are allowed to collide with each other, and not stop when they collide
    }
    car.update(road.borders, traffic);

    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height*0.7); //moving canvas so it looks like a moving drone is following the car, and the road is moving backwards
    
    road.draw(ctx);
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(ctx);
    }
    car.draw(ctx);

    ctx.restore();

    requestAnimationFrame(animate); //calls the animate method again and again
}