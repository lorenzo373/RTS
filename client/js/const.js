// Renderer
const RENDERER_WIDTH = 800;
const RENDERER_HEIGHT = 600;
const RENDERER_BGCOLOR = "#FFFFFF";

// Map
const MAP_WIDTH = 100;
const MAP_HEIGHT = 100;

// category 2: water, category 1: solid, category 0: ground
const TILES = {
	OCEAN: { category: 2, asset: 'ocean', name: 'Ocean', color: '#008cc8' },
	WATER: { category: 2, asset: 'water', name: 'Water', color: '#00a0e6' },
	SAND: { category: 0, asset: 'sand', name: 'Sand', color: '#e9dfad' },
	GRASS: { category: 0, asset: 'grass', name: 'Grass', color: '#22ad4a' },
	TAIGA: { category: 0, asset: 'taiga', name: 'Taiga', color: '#3b923d' },
	ROCK: { category: 1, asset: 'rock', name: 'Rock', color: '#787878' },
	SNOW: { category: 0, asset: 'snow', name: 'Snow', color: '#e3e3e3' }
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