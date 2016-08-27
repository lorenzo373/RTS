const TREE_TYPES = {
    NORMAL: 0,
    PALM: 1
};

class Tree extends Resource {
    constructor(position, treeType) {
        var texture;
        if (treeType == TREE_TYPES.NORMAL) {
            var texture = Game.assets.getAsset(TREES.NORMAL[Math.floor(Math.random() * TREES.NORMAL.length)]);
        } else if (treeType == TREE_TYPES.PALM) {
            var texture = Game.assets.getAsset(TREES.PALMS[Math.floor(Math.random() * TREES.PALMS.length)]);
        }

        super(position, RESOURCE_TYPES.TREE, 40, new PIXI.Sprite(texture), null);
        this.sprite.tint = Game.assets.randomTint(40);
        this.sprite.displayGroup = new PIXI.DisplayGroup(3, false);

        this.shadow = new PIXI.Sprite(texture);
        this.shadow.tint = 0x000000;
        this.shadow.alpha = 0.3;
        this.shadow.displayGroup = new PIXI.DisplayGroup(1, false);

        this.shadow.position = this.sprite.position;
        this.shadow.position.x += SHADOWOFFSET.x;
        this.shadow.position.y += SHADOWOFFSET.y;
    }
}