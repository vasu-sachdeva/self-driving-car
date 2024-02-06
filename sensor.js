class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI/3;
        this.rays = [];
        this.readings = []; //telling if there is a border collision with this ray or not
    }

    update(roadBorders, traffic){
        this.#castRays();
        this.readings = [];
        for(let i=0; i<this.rays.length; i++){
            const reading = this.#getReading(this.rays[i], roadBorders, traffic);
            this.readings.push(reading);
        } 
    }

    #getReading(ray, roadBorders, traffic){
        let touches = [];
        for(let i=0; i<roadBorders.length; i++){
            const touch = getIntersection( //getIntersection returns {x,y,offset} - the point of intersection with the border, and the distance of the intersection
                ray[0],ray[1],
                roadBorders[i][0],roadBorders[i][1]
            );
            if(touch) touches.push(touch);
        }
        for(let i=0; i<traffic.length; i++){
            const poly = traffic[i].polygon;
            for(let j=0; j<poly.length; j++){
                const touch = getIntersection(ray[0],ray[1], poly[j], poly[(j+1)%poly.length]);
                if(touch) touches.push(touch);
            }
        }
        if(touches.length == 0) return null;
        
        const offset = touches.map(t => t.offset); //getting the offset of the intersection points
        const minOffset = Math.min(...offset); //getting the minimum offset
        return touches.find(t => t.offset==minOffset); //getting the intersection point with the minimum offset
    }
    #castRays(){
        this.rays = [];
        for(let i=0; i<this.rayCount; i++){
            const rayAngle = lerp(this.raySpread/2, -this.raySpread/2, i/(this.rayCount-1));
            const start = {x: this.car.x, y: this.car.y};
            const end = {
                x: this.car.x - Math.sin(this.car.angle + rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(this.car.angle + rayAngle) * this.rayLength
            };
            this.rays.push([start, end]);
        }
    }

    draw(ctx){
        for(let i=0; i<this.rayCount; i++){
            let end = this.rays[i][1];
            if(this.readings[i]){ //if this ray is touching a border
                end = this.readings[i];
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'yellow';
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.stroke();
        }
    }
}