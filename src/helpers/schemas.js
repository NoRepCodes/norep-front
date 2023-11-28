

export class Evento {
    constructor({ name, date, place, categories }) {
        this.name = name
        this.date = date
        this.place = place
        this.categories = categories
    }
}

export class Categories {
    constructor({ name, wods }) {
        this.name = name
        this.wods = wods
    }
}

// WODTYPE: 1=AMRAP 2=FORTIME 3=RM 4=Circuit
export class Wods {
    constructor({ name, time_cap, amount_cap, amount_type, wod_type }) {
        this.name = name
        this.time_cap = time_cap
        this.amount_cap = amount_cap
        this.amount_type = amount_type
        this.wod_type = wod_type
    }
}

export class Team {
    constructor({ name, event_id, category_id, box, wods_length }) {
        this.name = name
        this.event_id = event_id
        this.category_id = category_id
        this.wods = []
        this.box = box

        wods_length.forEach(elm => {
            this.wods.push({ amount: null, amount_type: null, tiebrake: null, time: null })
        });
    }
}

export class TeamWod {
    constructor({ time, amount, amount_type, tiebrake }) {
        this.time = time
        this.amount = amount
        this.amount_type = amount_type
        this.tiebrake = tiebrake
    }
}