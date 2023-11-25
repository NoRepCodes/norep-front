

export class Evento {
    constructor({ name, date, place, categories }) {
        this.name = name
        this.date = date
        this.place = place
        this.categories = categories
    }
}

export class Team {
    constructor({name,event_id,category_id,box}){
        this.name = name
        this.event_id = event_id
        this.category_id = category_id
        this.wods = []
        this.box = box

    }
}