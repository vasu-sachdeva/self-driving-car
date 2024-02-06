class Car{
    constructor(x, y, width, height, controlsType, maxSpeed=3){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;

        this.damaged = false;
        if(controlsType == "CONTROLLED") this.sensor = new Sensor(this);
        this.controls = new Controls(controlsType);
    }

    update(roadBorders, traffic){
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if(this.sensor) this.sensor.update(roadBorders, traffic);
    }
    #move(){
        if(this.controls.forward) this.speed += this.acceleration;
        if(this.controls.reverse) this.speed -= this.acceleration;
        
        if(this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        if(this.speed < -this.maxSpeed/2) this.speed = -this.maxSpeed/2;

        if(this.speed > 0) this.speed -= this.friction;
        if(this.speed < 0) this.speed += this.friction;
        if(Math.abs(this.speed) < this.friction) this.speed = 0;
        
        if(this.speed != 0){
            const flip = this.speed>0 ? 1 : -1; //takes care of opposite rotation when car is being reversed
            if(this.controls.left) this.angle += 0.03*flip;
            if(this.controls.right) this.angle -= 0.03*flip;
        }

        //moving them forward and backward in the direction of the angle
        this.x -= this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }
    #createPolygon(){
        const points = []; //stores all corners of the car
        const halfDiagonal = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan(this.width/this.height); //atan is tan-inverse (arc tan)
        points.push({
            //bottom right corner
            x: this.x - Math.sin(this.angle - alpha) * halfDiagonal,
            y: this.y - Math.cos(this.angle - alpha) * halfDiagonal
        });
        points.push({
            //bottom left corner
            x: this.x - Math.sin(this.angle + alpha) * halfDiagonal,
            y: this.y - Math.cos(this.angle + alpha) * halfDiagonal
        });
        points.push({
            //top left corner
            x: this.x + Math.sin(this.angle - alpha) * halfDiagonal,
            y: this.y + Math.cos(this.angle - alpha) * halfDiagonal
        });
        points.push({
            //top right corner
            x: this.x + Math.sin(this.angle + alpha) * halfDiagonal,
            y: this.y + Math.cos(this.angle + alpha) * halfDiagonal
        });
        return points;
    }
    #assessDamage(roadBorders, traffic){
        for(let i=0; i<roadBorders.length; i++){
            if(polysIntersect(this.polygon, roadBorders[i])) return true;
        }
        for(let i=0; i<traffic.length; i++){
            if(polysIntersect(this.polygon, traffic[i].polygon)) return true;
        }
        return false;
    }

    
    draw(ctx){
        if(this.damaged) ctx.fillStyle = "red";
        else ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.#createPolygon()[0].x, this.#createPolygon()[0].y);
        for(let i=1; i<this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        
        if(this.sensor) this.sensor.draw(ctx);
    }
}