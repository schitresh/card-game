import { faces } from "./constants.js"

export class Card{
    constructor(value){
        if(value) this.value = value
        else this.value = Math.floor(Math.random() * faces.length)
    }

    face(){
        return faces[this.value]
    }
}