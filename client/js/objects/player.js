class Player {
    constructor() {
        this.money = 0;
        this.mapEntities = [];
    }

    placeBuilding(building, vec2) {
        this.mapEntities.push(new Building(vec2, building));
    }
}