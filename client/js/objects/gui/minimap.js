class Minimap {
    constructor() {
        var canvas = document.getElementById('minimap');
        if (canvas) {
            document.body.removeChild(canvas);
        }

        var canvasLayer = document.getElementById('minimaplayer');
        if (canvasLayer) {
            document.body.removeChild(canvasLayer);
        }

        var minimapCanvas = document.createElement('canvas');
        minimapCanvas.width = Game.map.map.length;
        minimapCanvas.height = Game.map.map[0].length;
        minimapCanvas.id = 'minimap';
        minimapCanvas.className = 'minimap';

        var minimapCanvasLayer = document.createElement('canvas');
        minimapCanvasLayer.width = Game.map.map.length;
        minimapCanvasLayer.height = Game.map.map[0].length;
        minimapCanvasLayer.id = 'minimaplayer';
        minimapCanvasLayer.className = 'minimap';

        this.minimap = minimapCanvas;
        this.minimapLayer = minimapCanvasLayer;
        document.body.appendChild(this.minimap);
        document.body.appendChild(this.minimapLayer);
    }

    render() {
        var canvas = document.getElementById('minimap');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, Game.map.map.length, Game.map.map[0].length);

        for (var y = 0; y < Game.map.map[0].length; y++) {
            for (var x = 0; x < Game.map.map.length; x++) {
                var tile = Game.map.getTileForMapPosition(new Vector2(x, y));
                ctx.fillStyle = tile.type.color;
                ctx.fillRect(x, y, 1, 1);
            }
        }

        Game.GUI.renderViewport();
    }
}