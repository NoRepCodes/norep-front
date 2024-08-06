
export type ResultType = {
    _id: string,
    team_id: string,
    time: number,
    tiebrake: number,
    penalty: number,
    amount: number, // decimal
    //ghost values
    _tie_winner?: boolean,
    _points?: number,
    _percent?: number,
    _pos?: number,
    _wod_type?: "AMRAP" | 'FORTIME' | "RM" | "CIRCUITO",
    _amount_type?: "Lbs" | "Puntos" | "Reps" | "CAP+",
    _amount_left?: number,
    _wod_name?: string,
}

export type WodType = {
    _id: string,
    name: string,
    time_cap?: number,
    amount_cap?: number,
    amount_type: "Lbs" | "Puntos" | "Reps",
    wod_type: "AMRAP" | 'FORTIME' | "RM" | "CIRCUITO",
    results: ResultType[],
    category_id: string
}

export type TeamType = {
    _id: string,
    users: string[],
    name: string,
    // captain: string,
    _points?: number,
    _percent?: number,
    _tie_total?: number,
    _results?: ResultType[]
}

export type CategoryType = {
    _id: string,
    teams: TeamType[],
    name: string,
    updating: boolean,
    price: number,
    slots: number,
    filter?: {
        male?: number,
        female?: number,
        amount?: number,
        age_min?: number,
        age_max?: number,
        limit?:number
    },
    wods: WodType[],
    createdAt: Date,
    updatedAt: Date,
}

export type KeyByString = {
    [key: string]: any;
}

export type EventType = KeyByString & {
    _id?: string,
    name: string,
    since: string,
    until: string,
    // since: number|string,
    // until: number|string,
    place: string,
    dues: number,
    secure_url: string,
    public_id: string
    accesible: boolean,
    partners: ImageType[],
    categories: CategoryType[],
    createdAt?: Date,
    updatedAt?: Date,
    manual_teams:boolean
    register_time:{since:string,until:string},
}






export type ImageType ={ secure_url: string, public_id?: string }