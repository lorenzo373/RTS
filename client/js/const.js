// Renderer
const RENDERER_WIDTH = 800;
const RENDERER_HEIGHT = 600;
const RENDERER_BGCOLOR = "#FFFFFF";

// Tiles
// category 2: water, category 1: solid, category 0: ground
const TILES = {
	OCEAN: { category: 2, assets: ['ocean'], name: 'Ocean' },
	WATER: { category: 2, assets: ['water', 'water2'], name: 'Water' },
	SAND: { category: 0, assets: ['sand', 'sand2'], name: 'Sand' },
	GRASS: { category: 0, assets: ['grass', 'grass2'], name: 'Grass' },
	TAIGA: { category: 0, assets: ['taiga', 'taiga2'], name: 'Taiga' },
	ROCK: { category: 1, assets: ['rock', 'rock2'], name: 'Rock' },
	SNOW: { category: 0, assets: ['snow', 'snow2'], name: 'Snow' }
};
const TREES = {
	NORMAL: ['tree4', 'tree5', 'tree6'],
	PALMS: ['palm1', 'palm2', 'palm3']
};
const TILESIZE = 64;