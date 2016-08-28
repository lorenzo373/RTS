class Building extends Entity {
    constructor(vec2, sprite) {
        super(vec2);

        var texture = Game.assets.getAsset(sprite);
        this.sprite = new PIXI.Sprite(texture);

        this.sprite.position.x = vec2.x;
        this.sprite.position.y = vec2.y;
        this.sprite.displayGroup = LAYER_DECORATIONS;

        Game.sceneHandler.scenes['map'].addChild(this.sprite);
    }
}