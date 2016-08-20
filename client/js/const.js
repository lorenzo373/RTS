// Renderer
const RENDERER_WIDTH = 800;
const RENDERER_HEIGHT = 600;
const RENDERER_BGCOLOR = "#FFFFFF";

// Directories
const ASSET_DIR = "./assets/";

// Tiles
// category 2: water, category 1: solid, category 0: ground
const TILES = {
	OCEAN: { category: 2, assets: ['ocean.png'], name: 'Ocean' },
	WATER: { category: 2, assets: ['water.png', 'water2.png'], name: 'Water' },
	SAND: { category: 0, assets: ['sand.png', 'sand2.png'], name: 'Sand' },
	GRASS: { category: 0, assets: ['grass.png', 'grass2.png'], name: 'Grass' },
	TAIGA: { category: 0, assets: ['taiga.png', 'taiga2.png'], name: 'Taiga' },
	ROCK: { category: 1, assets: ['rock.png', 'rock2.png'], name: 'Rock' },
	SNOW: { category: 0, assets: ['snow.png', 'snow2.png'], name: 'Snow' }
};
const TREES = {
	NORMAL: ['tree4.png', 'tree5.png', 'tree6.png'],
	PALMS: ['palm1.png', 'palm2.png', 'palm3.png']
};
const SPRITESIZE = 64;

const TILESIZE = 64;