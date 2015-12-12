
var FloorTiles = [
    'xxxxxxxxxxxxxxxxxxxxxxh        h',
    '                      h        h',
    '                      d        h',
    '                      d        h',
    '                      d        h',
    '                      d        h',
    '                      d        h',
    'xxxxxxxxxxxxxxxxxxxxxxh        h',
    'xxxxxxxxxxxxxxxxxxxxxxh        h'
];

var Floor = function(options) {
    var defaults = {
        floor: 0, // Floor number rises upwards
        name: 'Products',
        elevator: null,
        level: null,
        spawnIds : ["customer"],
        excludeAsDestination : false
    };
    objectUtil.initWithDefaults(this, defaults, options);
    this.tilemap = new TileMap({initTile: TileMap.initFromData(FloorTiles), height: FloorTiles.length, width: FloorTiles[0].length });
};

Floor.height = FloorTiles.length - 1;

Floor.sprite = new Sprite('floor_gfx.png');

Floor.prototype.render = function(ctx) {
    ctx.save();
    var drawY = this.level.getFloorTopY(this.floor);
    ctx.translate(0, drawY);
    ctx.fillStyle = '#222';
    this.tilemap.render(ctx, function(tile) { return tile === 'x'; }, 0.05, 0.05);
    ctx.fillStyle = '#888';
    this.tilemap.render(ctx, function(tile) { return tile === 'h'; }, 0.05, 0.05);
    ctx.save();
    ctx.translate(0, -0.3333333);
    ctx.scale(1 / 6, 1 / 6);
    Floor.sprite.draw(ctx, 0, 0);
    ctx.restore();
    
    ctx.globalAlpha = this.doorVisual;
    ctx.fillStyle = '#da4';
    this.tilemap.render(ctx, function(tile) { return tile === 'd'; }, 0.05, 0.05);
    
    ctx.globalAlpha = 1;
    ctx.translate(21.5, 1.5);
    ctx.scale(1 / 6, 1 / 6);
    ctx.fillStyle = 'black';
    ctx.textAlign = "right";
    bitmapFont.drawText(ctx, ((this.floor + 1) + ' ' + this.name).toUpperCase(), 0, 0);

    ctx.restore();
};

Floor.prototype.update = function(deltaTime) {
    if (Math.round(this.elevator.floor) == this.floor) {
        this.doorOpen = this.elevator.doorOpen;
        this.doorVisual = this.elevator.doorVisual;
    }
};
