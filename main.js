const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');


const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

const N = 1;
const cars = generateCars(N);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50,"DUMMY",2),
    new Car(road.getLaneCenter(0), -200, 30, 50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -200, 30, 50,"DUMMY",2),
    new Car(road.getLaneCenter(1), -400, 30, 50,"DUMMY",2),
    new Car(road.getLaneCenter(2), -400, 30, 50,"DUMMY",2)
];

let bestCar = cars[0];
if(localStorage.getItem("bestbrain")){
    for(let i=0; i<cars.length; i++){
        cars[i].brain = JSON.parse(localStorage.getItem("bestbrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

animate();
function animate(time){
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, []); //empty array is being passed because the NPC cars are allowed to collide with each other, and not stop when they collide
    }
    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(car => car.y == Math.min( ...cars.map(c=>c.y))); //best car is the one with the max y-coordinate, the one that went the farthest

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    // carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.7); //moving canvas so it looks like a moving drone is following the car, and the road is moving backwards
    
    road.draw(carCtx);
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "orange");
    }

    carCtx.globalAlpha = 0.5; //reducing the opacity of the AI cars
    for(let i=0; i<cars.length; i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true); //drawing the main car with 100% opacity and with sensors

    // carCtx.restore();

    networkCtx.lineDashOffset = -time/50; //for the animation of dashed lines
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate); //calls the animate method again and again
}

function generateCars(N){
    //generating AI cars
    const cars = [];
    for(let i=0; i<N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function save(){
    console.log("saved");
    localStorage.setItem("bestbrain", JSON.stringify(bestCar.brain));
}
function discard(){
    console.log("discarded");
    localStorage.removeItem("bestbrain");
}