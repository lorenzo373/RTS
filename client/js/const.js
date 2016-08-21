// Renderer
const RENDERER_WIDTH = 800;
const RENDERER_HEIGHT = 600;
const RENDERER_BGCOLOR = "#FFFFFF";

// Map
const MAP_WIDTH = 100;
const MAP_HEIGHT = 100;

// category 2: water, category 1: solid, category 0: ground
const TILES = {
	OCEAN: { category: 2, asset: 'ocean', name: 'Ocean' },
	WATER: { category: 2, asset: 'water', name: 'Water' },
	SAND: { category: 0, asset: 'sand', name: 'Sand' },
	GRASS: { category: 0, asset: 'grass', name: 'Grass' },
	TAIGA: { category: 0, asset: 'taiga', name: 'Taiga' },
	ROCK: { category: 1, asset: 'rock', name: 'Rock' },
	SNOW: { category: 0, asset: 'snow', name: 'Snow' }
};
const TREES = {
	NORMAL: ['tree4', 'tree5', 'tree6'],
	PALMS: ['palm1', 'palm2', 'palm3']
};
const TILESIZE = 64;

// Shadows
var SHADOWOFFSET = {
	x: 4,
	y: 4
};