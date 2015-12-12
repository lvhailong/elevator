
var ElevatorTiles = [
    'oooooooo',
    'o      o',
    'd      o',
    'd      o',
    'd      o',
    'd      o',
    'd      o',
    'oooooooo'
];

var Elevator = function(options) {
    var defaults = {
        floorNumber: 0, // Floor number rises upwards
        x: 0,
        level: null
    };
    // Player intent for moving
    this.moveUp = 0;
    this.moveDown = 0;
    this.currentMovementSpeed = 0;

    objectUtil.initWithDefaults(this, defaults, options);
    this.occupants = [];
    this.maxTotalOccupantWidth = 6;
    this.tilemap = new TileMap({initTile: TileMap.initFromData(ElevatorTiles), height: ElevatorTiles.length, width: ElevatorTiles[0].length });
    this.doorOpenTimer = 0;
    this.doorOpen = false;
};

Elevator.sprite = new Sprite('lift.png');
Elevator.shaftSprite = new Sprite('shaft.png');
Elevator.doorSprite = new Sprite('door_closed.png');
Elevator.doorOpenSprite = new Sprite('door_open1.png');

Elevator.prototype.removeOccupant = function(toRemove) {
    if (this.occupants.indexOf(toRemove) >= 0) {
        this.occupants.splice(this.occupants.indexOf(toRemove), 1);
    }
};

Elevator.prototype.getTotalUsedSpace = function() {
    var usedSpace = 0;
    for (var i = 0; i < this.occupants.length; ++i) {
        usedSpace += this.occupants[i].width;
    }
    return usedSpace;
};

Elevator.prototype.hasSpace = function(space) {
    return this.getTotalUsedSpace() + space <= this.maxTotalOccupantWidth;
};

Elevator.prototype.upPress = function() {
    this.moveUp = 1;
};

Elevator.prototype.downPress = function() {
    this.moveDown = -1;
};

Elevator.prototype.upRelease = function() {
    this.moveUp = 0;
};

Elevator.prototype.downRelease = function() {
    this.moveDown = 0;
};

Elevator.prototype.update = function(deltaTime) {
    var moveIntent = this.moveUp + this.moveDown;    
    var appliedIntent = this.doorOpen ? 0 : moveIntent;
    this.currentMovementSpeed = this.currentMovementSpeed * 0.9 + (appliedIntent * 2) * 0.1;
    var snappiness = Math.abs(this.floorNumber - Math.round(this.floorNumber));
    if (moveIntent === 0) {
        if (snappiness < 0.15) {
            this.floorNumber = this.floorNumber * 0.9 + Math.round(this.floorNumber) * 0.1;
        }
        if (snappiness < 0.01) {
            this.doorOpenTimer += deltaTime;
        }
    }
    if (snappiness > 0.01 || moveIntent != 0) {
        this.doorOpenTimer -= deltaTime;
    }
    this.doorOpenTimer = mathUtil.clamp(0, 0.5, this.doorOpenTimer);
    this.doorOpen = this.doorOpenTimer > 0.25;
    this.floorNumber += this.currentMovementSpeed * deltaTime;
    this.floorNumber = mathUtil.clamp(0, this.level.numFloors - 1, this.floorNumber);
    var fromRight = this.maxTotalOccupantWidth - this.getTotalUsedSpace();
    for (var i = 0; i < this.occupants.length; ++i) {
        this.occupants[i].elevatorTargetX = this.x + this.maxTotalOccupantWidth + 1 - fromRight - this.occupants[i].width * 0.5;
        fromRight += this.occupants[i].width;
    }
};

Elevator.prototype.render = function(ctx) {
    ctx.save();
    ctx.translate(this.x, 0);
    ctx.save();
    ctx.scale(1 / 6, 1 / 6);
    Elevator.shaftSprite.draw(ctx, 0, 0);
    ctx.restore();
    var drawY = this.level.getFloorTopY(this.floorNumber);
    ctx.translate(0, drawY);
    ctx.fillStyle = 'red';
    //this.tilemap.render(ctx, function(tile) { return tile === 'o'; }, 0.05, 0.05);
    ctx.save();
    ctx.translate(0, -2);
    ctx.scale(1 / 6, 1 / 6);
    Elevator.sprite.draw(ctx, 0, 0);
    if (!this.doorOpen) {
        this.doorVisual = 1.0;
    } else {
        this.doorVisual = 1.0 - (this.doorOpenTimer - 0.25) * 4.0;
    }
    Elevator.doorOpenSprite.draw(ctx, 1, 21);
    ctx.globalAlpha = this.doorVisual;
    Elevator.doorSprite.draw(ctx, 1, 21);
    /*ctx.fillStyle = '#da4';
    this.tilemap.render(ctx, function(tile) { return tile === 'd'; }, 0.05, 0.05);*/
    ctx.restore();
    ctx.restore();
};

var minTimeUntilSpawn = 3;
var maxTimeUntilSpawn = 9;

var Level = function() {
    this.timeUntilSpawn = maxTimeUntilSpawn;
    this.numFloors = 6;

    this.elevator = new Elevator({x: this.getFloorWidth(), level: this});
    this.floors = [];
    
    var shuffledFloors = arrayUtil.shuffle(GameData.floors);
    
    // Fixed, functional floors
    var floor;
    var randomIndex = Math.floor(Math.random() * this.numFloors);
    
    for (var i = 0; i < this.numFloors; ++i) {
        var floorOptions = {floorNumber: i, elevator: this.elevator, level: this};
        for (var key in shuffledFloors[i]) {
            if (shuffledFloors[i].hasOwnProperty(key)) {
                floorOptions[key] = shuffledFloors[i][key];
            }
        }
        floor = new Floor(floorOptions);
        this.floors.push(floor);
    }
    this.characters = [];
    this.spawnCharacter();
};

Level.prototype.spawnCharacter = function() {
    var shuffledFloors = arrayUtil.shuffle(this.floors);
    
    for ( var i = 0; i < shuffledFloors.length; i++ ) {
        if ( shuffledFloors[i].spawnIds.length !== 0 ) {
            var character = shuffledFloors[i].spawnCharacter();
            this.characters.push(character);
            return;
        }
    }
};

Level.prototype.getFloorTopY = function(floor) {
    return (this.numFloors - floor - 1) * Floor.height;
};

Level.prototype.getFloorFloorY = function(floor) {
    return (this.numFloors - floor - 1) * Floor.height + Floor.height - 1;
};

Level.prototype.getFloorWidth = function() {
    return 23;
};

Level.prototype.render = function(ctx) {
    ctx.save();
    ctx.translate(ctx.canvas.width * 0.5, ctx.canvas.height * 0.5);
    ctx.scale(6, 6);
    ctx.translate(-this.floors[0].tilemap.width * 0.5, -this.numFloors * Floor.height * 0.5);

    this.elevator.render(ctx);
    for (var i = 0; i < this.floors.length; ++i) {
        this.floors[i].render(ctx);
    }
    for (var i = 0; i < this.characters.length; ++i) {
        this.characters[i].render(ctx);
    }
    ctx.restore();
};

Level.prototype.update = function(deltaTime) {
    for (var i = 0; i < this.floors.length; ++i) {
        this.floors[i].update(deltaTime);
    }
    this.elevator.update(deltaTime);
    for (var i = 0; i < this.characters.length;) {
        this.characters[i].update(deltaTime);
        if (this.characters[i].dead) {
            this.characters.splice(i, 1);
        } else {
            ++i;
        }
    }
    this.timeUntilSpawn -= deltaTime;
    if ( this.timeUntilSpawn <= 0 ) {
        this.spawnCharacter();
        this.timeUntilSpawn = minTimeUntilSpawn + Math.random() * (maxTimeUntilSpawn - minTimeUntilSpawn);
    }
        
};

Level.prototype.upPress = function(playerNumber) {
    this.elevator.upPress();
};

Level.prototype.downPress = function(playerNumber) {
    this.elevator.downPress();
};

Level.prototype.upRelease = function(playerNumber) {
    this.elevator.upRelease();
};

Level.prototype.downRelease = function(playerNumber) {
    this.elevator.downRelease();
};
