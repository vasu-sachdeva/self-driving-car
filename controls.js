class Controls{
    constructor(controlsType){
        this.left = false;
        this.right = false;
        this.forward = false;
        this.reverse = false;
        switch(controlsType){
            case "CONTROLLED":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward = true;
                break;
        }
    }

    #addKeyboardListeners(){ //# means private method
        document.onkeydown = (event) => {
            switch(event.key){
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
            }
            // console.table(this);
        }

        document.onkeyup = (event) => {
            switch(event.key){
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
            }
            // console.table(this);
        }
    }
}