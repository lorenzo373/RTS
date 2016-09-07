class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.map = [];
        this.resources = [];
        this.generator = 'PERLIN';
        this.noise = new Vector2(45, 45);

        // Load map
        this.load();

        // Init events
        this.initEvents();
    }

    load() {
        var pos;
        var scale;
        if (this.scene) {
            pos = this.scene.position;
            scale = this.scene.scale;
        }

        Game.sceneHandler.destroyScene('map');
        this.scene = Game.sceneHandler.createScene('map', true, 0);

        if (pos) {
            this.scene.position = pos;
            this.scene.scale = scale;
        }

        delete this.map;
        this.map = [];
        this.destroyAllResources();

        noise.seed(Math.random());

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (!this.map[x]) {
                    this.map[x] = [];
                }

                if (this.generator == 'PERLIN') {
                    var value = Math.abs(noise.perlin2(x / this.noise.x, y / this.noise.y));
                } else {
                    var value = Math.abs(noise.simplex2(x / this.noise.x, y / this.noise.y));
                }

                var tile;
                if (value < 0.08) tile = new Tile(TILES.OCEAN);
                else if (value < 0.15) tile = new Tile(TILES.WATER);
                else if (value < 0.35) tile = new Tile(TILES.SAND);
                else if (value < 0.55) tile = new Tile(TILES.GRASS);
                else if (value < 0.75) tile = new Tile(TILES.TAIGA);
                else if (value < 0.90) tile = new Tile(TILES.ROCK);
                else tile = new Tile(TILES.SNOW);

                tile.sprite.position.x = x * TILESIZE;
                tile.sprite.position.y = y * TILESIZE;
                tile.sprite.displayGroup = LAYER_GROUND;

                this.scene.addChild(tile.sprite);

                this.generateTree(value, new Vector2(x, y));

                this.map[x][y] = tile;
            }
        }

        this.hideAllTiles();
        this.lastViewPort = this.getViewportSquare();
        this.cul();

        setTimeout(function() {
            // Load minimap
            Game.GUI.renderMinimap();
        }, 100);
    }

    generateTree(value, vec2) {
        // Trees
        if (value > 0.35 && value < 0.50) {
            var rand = Math.floor(Math.random() * 100);

            if (rand > 75) {
                var tree = new Tree(vec2, TREE_TYPES.NORMAL);

                this.scene.addChild(tree.shadow);
                this.scene.addChild(tree.sprite);
                this.resources.push(tree);
            }
        }

        // Palms
        if (value > 0.16 && value < 0.20) {
            var rand = Math.floor(Math.random() * 100);

            if (rand > 90) {
                var tree = new Tree(vec2, TREE_TYPES.PALM);

                this.scene.addChild(tree.shadow);
                this.scene.addChild(tree.sprite);
                this.resources.push(tree);
            }
        }
    }

    destroyAllResources() {
        delete this.resources;
        this.resources = [];

        return true;
    }

    initEvents() {
        Game.input.onMouseDown('mapDrag', e => {
            // Left mouse button
            if (e.which === 1) {
                let mousePosition = Game.map.getTileForRealPosition(new Vector2(e.clientX, e.clientY));

                if (mousePosition != false) {
                    console.log(mousePosition.type.name);
                }
            }

            // Right mouse button
            if (e.which === 3) {
                Game.map.isDragging = true;
                Game.map.lastDrag = {
                    x: e.clientX,
                    y: e.clientY
                };
            }
        });

        Game.input.onMouseUp('mapDrag', e => {
            // Left mouse button
            if (e.which === 1) {
                let mousePosition = this.getCoordinates(new Vector2(e.clientX, e.clientY));

                let tilePosition = this.nearestTileWorldPosition(mousePosition);

                let tile = new Vector2(tilePosition.x / TILESIZE, tilePosition.y / TILESIZE);

                if (Game.map.isInMap(tile)) {
                    if (Game.map.canBuildHere(tile)) {
                        Game.player.placeBuilding('command', tilePosition);
                    }
                }
            }

            // Right mouse button
            if (e.which === 3) {
                Game.map.isDragging = false;
            }
        });

        Game.input.onMouseMove('mapDrag', e => {
            if (Game.map.isDragging) {
                Game.map.scene.position.x += e.clientX - Game.map.lastDrag.x;
                Game.map.scene.position.y += e.clientY - Game.map.lastDrag.y;
                Game.map.lastDrag = {
                    x: e.clientX,
                    y: e.clientY
                };

                Game.map.cul();
                Game.GUI.renderViewport();
            }
        });

        Game.input.onMouseWheel('mapZoom', e => {
            let direction = (e.deltaY < 0) ? 1 : -1;
            let factor = (1 + direction * 0.1);

            if ((direction == -1 && Game.map.scene.scale.x > 0.15) || (direction == 1 && Game.map.scene.scale.x < 1.85)) {
                Game.map.scene.scale.x *= factor;
                Game.map.scene.scale.y *= factor;
            }

            let before = this.getCoordinates(new Vector2(e.clientX, e.clientY));
            Game.map.scene.updateTransform();
            let after = this.getCoordinates(new Vector2(e.clientX, e.clientY));

            Game.map.scene.position.x += (after.x - before.x) * Game.map.scene.scale.x;
            Game.map.scene.position.y += (after.y - before.y) * Game.map.scene.scale.y;
            Game.map.scene.updateTransform();

            Game.map.cul();
            Game.GUI.renderViewport();
        });
    }

    hideAllTiles() {
        for (var y = 0; y < this.map[0].length; y++) {
            for (var x = 0; x < this.map.length; x++) {
                this.map[x][y].sprite.visible = false;
            }
        }
    }

    cul() {
        // TODO: only cul when there is a change of viewport
        if (this.lastViewport) {
            var sx = this.lastViewport.TL ? this.lastViewport.TL.sprite.position.x / TILESIZE : 0;
            var sy = this.lastViewport.TL ? this.lastViewport.TL.sprite.position.y / TILESIZE : 0;
            var xx = this.lastViewport.TL && this.lastViewport.BR ? (this.lastViewport.BR.sprite.position.x / TILESIZE) - (this.lastViewport.TL.sprite.position.x / TILESIZE) + 1 : 0;
            var yy = this.lastViewport.TL && this.lastViewport.BR ? (this.lastViewport.BR.sprite.position.y / TILESIZE) - (this.lastViewport.TL.sprite.position.y / TILESIZE) + 1 : 0;

            for (var i = 0; i < yy; i++) {
                for (var j = 0; j < xx; j++) {
                    if (this.map[j + sx] && this.map[j + sx][i + sy]) {
                        this.map[j + sx][i + sy].sprite.visible = false;
                    }
                }
            }
        }

        this.lastViewport = this.getViewportSquare();

        if (this.lastViewport) {
            var sx = this.lastViewport.TL ? this.lastViewport.TL.sprite.position.x / TILESIZE : 0;
            var sy = this.lastViewport.TL ? this.lastViewport.TL.sprite.position.y / TILESIZE : 0;
            var xx = this.lastViewport.TL && this.lastViewport.BR ? (this.lastViewport.BR.sprite.position.x / TILESIZE) - (this.lastViewport.TL.sprite.position.x / TILESIZE) + 1 : 0;
            var yy = this.lastViewport.TL && this.lastViewport.BR ? (this.lastViewport.BR.sprite.position.y / TILESIZE) - (this.lastViewport.TL.sprite.position.y / TILESIZE) + 1 : 0;

            for (var i = 0; i < yy; i++) {
                for (var j = 0; j < xx; j++) {
                    if (this.map[j + sx] && this.map[j + sx][i + sy]) {
                        this.map[j + sx][i + sy].sprite.visible = true;
                    }
                }
            }
        }
    }

    isInMap(vec2) {
        if (vec2.x < 0 || vec2.y < 0 || vec2.x > this.map.length || vec2.y > this.map[0].length) {
            return false;
        }

        return true;
    }

    canBuildHere(vec2) {
        if (Game.map.getTileForMapPosition(vec2).type.category === 2) {
            return false;
        }

        return true;
    }

    getTileForMapPosition(vec2) {
        if (!this.map[vec2.x]) {
            return false;
        }

        if (!this.map[vec2.x][vec2.y]) {
            return false;
        }

        return this.map[vec2.x][vec2.y];
    }

    getTileForRealPosition(vec2) {
        var _x = 1 / this.scene.scale.x;
        var _y = 1 / this.scene.scale.y;

        var xx = vec2.x * _x - (_x * this.scene.position.x);
        var yy = vec2.y * _y - (_y * this.scene.position.y);

        var fx = Math.floor(xx / TILESIZE);
        var fy = Math.floor(yy / TILESIZE);

        if (!this.isInMap(new Vector2(fx, fy))) {
            return false;
        }

        if (!this.map[fx]) {
            return false;
        }

        if (!this.map[fx][fy]) {
            return false;
        }

        return this.map[fx][fy];
    }

    getRealPositionForTile(x, y) {
        var _x = 1 / this.scene.scale.x;
        var _y = 1 / this.scene.scale.y;
        var pos = this.map[x][y].sprite.position;

        if (!pos) {
            return false;
        }

        var xx = pos.x / _x + (_x * this.scene.position.x);
        var yy = pos.y / _y + (_y * this.scene.position.y);

        return new Vector2(xx, yy);
    }

    getCoordinates(vec2) {
        return PIXI.interaction.InteractionData.prototype.getLocalPosition.call({
            global: {
                x: vec2.x,
                y: vec2.y
            }
        }, Game.map.scene);
    }

    nearestTileWorldPosition(vec2) {
        return new Vector2(Math.floor(vec2.x / TILESIZE) * TILESIZE, Math.floor(vec2.y / TILESIZE) * TILESIZE);
    }

    getViewportSquare() {
        var viewport = {
            TL: this.getTileForRealPosition(new Vector2(0, 0)),
            TR: this.getTileForRealPosition(new Vector2(Game.viewport.width, 0)),
            BL: this.getTileForRealPosition(new Vector2(0, Game.viewport.height)),
            BR: this.getTileForRealPosition(new Vector2(Game.viewport.width, Game.viewport.height))
        };

        // Exceptions
        if (!viewport.TR && !viewport.BR && !viewport.BL && viewport.TL) {
            viewport.TR = this.getTileForMapPosition(new Vector2(this.map.length - 1, viewport.TL.sprite.position.y / TILESIZE));
            viewport.BR = this.getTileForMapPosition(new Vector2(this.map.length - 1, this.map[0].length - 1));
            viewport.BL = this.getTileForMapPosition(new Vector2(viewport.TL.sprite.position.x / TILESIZE, this.map[0].length - 1));
        }

        if(!viewport.TL && !viewport.TR && !viewport.BL && viewport.BR) {
            viewport.TL = this.getTileForMapPosition(new Vector2(0, 0));
            viewport.TR = this.getTileForMapPosition(new Vector2(viewport.BR.sprite.position.x / TILESIZE, 0));
            viewport.BL = this.getTileForMapPosition(new Vector2(0, viewport.BR.sprite.position.y / TILESIZE));
        }

        if(!viewport.TL && !viewport.TR && !viewport.BL && !viewport.BR) {
            viewport.TL = this.getTileForMapPosition(new Vector2(0, 0));
            viewport.TR = this.getTileForMapPosition(new Vector2(this.map.length - 1, 0));
            viewport.BR = this.getTileForMapPosition(new Vector2(this.map.length - 1, this.map[0].length - 1));
            viewport.BL = this.getTileForMapPosition(new Vector2(0, this.map[0].length - 1));
        }

        if (!viewport.TL) {
            if (viewport.TR) {
                viewport.TL = this.getTileForMapPosition(new Vector2(0, viewport.TR.sprite.position.y / TILESIZE));
            }

            if (!viewport.TL && viewport.BL) {
                viewport.TL = this.getTileForMapPosition(new Vector2(viewport.BL.sprite.position.x / TILESIZE, 0));
            }
        }

        if (!viewport.TR) {
            if (viewport.TL) {
                viewport.TR = this.getTileForMapPosition(new Vector2(viewport.TL.sprite.position.x / TILESIZE, this.map.length - 1));
            }

            if (!viewport.TR && viewport.BR) {
                viewport.TR = this.getTileForMapPosition(new Vector2(viewport.BR.sprite.position.x / TILESIZE, 0));
            }
        }

        if (!viewport.BR) {
            if (viewport.BL) {
                viewport.BR = this.getTileForMapPosition(new Vector2(this.map.length - 1, viewport.BL.sprite.y / TILESIZE));
            }

            if (!viewport.BR && viewport.TR) {
                viewport.BR = this.getTileForMapPosition(new Vector2(viewport.TR.sprite.position.x / TILESIZE, this.map[0].length - 1));
            }
        }

        if (!viewport.BL) {
            if (viewport.TL) {
                viewport.BL = this.getTileForMapPosition(new Vector2(viewport.TL.sprite.x / TILESIZE, this.map[0].length - 1));
            }

            if (!viewport.BL && viewport.BR) {
                viewport.BL = this.getTileForMapPosition(new Vector2(0, viewport.BR.sprite.y / TILESIZE));
            }
        }

        return viewport;
    }

    setShadowOffset(vec2) {
        for (var i = 0; i < this.resources.length; i++) {
            var ref = this.resources[i];

            if (!ref.hasOwnProperty('shadow')) {
                continue;
            }

            ref.shadow.position.x = ref.shadow.position.x - SHADOWOFFSET.x + vec2.x;
            ref.shadow.position.y = ref.shadow.position.y - SHADOWOFFSET.y + vec2.y;
        }

        SHADOWOFFSET.x = vec2.x;
        SHADOWOFFSET.y = vec2.y;

        return true;
    }
}