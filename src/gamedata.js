var GameData = {};

GameData.floors =
[
    {
        id: "acme",
        name: "Acme",
        spawnIds: [
            {id: "customer", chance: 5},
            {id: "horse", chance: 1},
            {id: "heavy", chance: 5},
            {id: "runner", chance: 2},
            {id: "renovator", chance: 1}
        ]
    },
    {
        id: "stables",
        name: "Stables",
        spawnIds: [
            {id: "customer", chance: 5},
            {id: "horse", chance: 5},
            {id: "heavy", chance: 1}
        ]
    },
    {
        id: "graveyard",
        name: "Graveyard",
        spawnIds: [
            {id: "customer", chance: 3},
            {id: "horse", chance: 1},
            {id: "ghost", chance: 2}
        ]
    },
    {
        id: "lounge",
        name: "Business lounge",
        spawnIds: [
            {id: "customer", chance: 3},
            {id: "runner", chance: 3}
        ]
    },
    {
        id: "garage",
        name: "Garage",
        spawnIds: [
            {id: "customer", chance: 5},
            {id: "car", chance: 2},
            {id: "renovator", chance: 1}
        ]
    },
    {
        id: "security",
        name: "Security",
        spawnIds: [],
        excludeAsDestination: true
    },
    {
        id: "clowncamp",
        name: "Clown bootcamp",
        spawnIds: [
            {id: "clown", chance: 5},
            {id: "horse", chance: 2},
            {id: "customer", chance: 1}
        ]
    },  /*,
    {
        id: "bioweapon",
        name: "Bio weapons lab"
    },
    {
        id: "surgeryspa",
        name: "Surgery Spa"
    },
    {
        id: "dogfood",
        name: "Dog restaurant"
    },
    {
        id: "gym",
        name: "Gym"
    },
    {
        id: "heavystuff",
        name: "Anvils & grand pianos"
    },
    {
        id: "balloonpop",
        name: "Porcupines & balloons"
    },
    {
        id: "carwash",
        name: "Car wash & cocktail bar"
    },
    {
        id: "cakepoison",
        name: "Fruit cakes & cyanide pills"
    },
    {
        id: "babyblender",
        name: "Baby blenders"
    },
    {
        id: "dogpedicure",
        name: "Dog pedicures"
    },
    {
        id: "fishbicycle",
        name: "Fish bicycles"
    },
    {
        id: "travel",
        name: "Cat travel agency"
    },
    {
        id: "burnerfabric",
        name: "Flamethrowers & envelopes"
    },
    {
        id: "elephantslippers",
        name: "Elephant slippers"
    },
    {
        id: "positivesign",
        name: "Exit signs & demotivators"
    },
    {
        id: "dynamite",
        name: "Dynamite & short fuses"
    },
    {
        id: "magnets",
        name: "Giant magnets"
    },
    {
        id: "coffeemeditation",
        name: "Coffee & meditation beads"
    },
    {
        id: "seamonkey",
        name: "Sea-monkey farm"
    },
    {
        id: "tapdanceearplugs",
        name: "Tuba repair shop & earplugs"
    },
    {
        id: "underwearsnowshoe",
        name: "Underwear & snowshoes"
    },
    {
        id: "cheeseandraincoats",
        name: "Cheese kits & raincoats"
    },
    {
        id: "beetherapy",
        name: "Bee therapy"
    }*/
];

function getAllButExcluded() {
    var group = [];
    
    for ( var i = 0; i < GameData.floors.length; i++ ) {
        if ( !GameData.floors[i].hasOwnProperty("excludeAsDestination") ) {
            group.push(GameData.floors[i]);
        }
    }
    
    return group;
};

GameData.destinationGroups =
[
    getAllButExcluded()
];

GameData.characters =
{
    'customer' : {
        destinations : getAllButExcluded(),
        characterConstructor: Character,
        weight: 1
    },
    'clown' : {
        destinations : getAllButExcluded(),
        characterConstructor: Character,
        weight: -4
    },
    'heavy' : {
        destinations : getAllButExcluded(),
        characterConstructor: Character,
        weight: 4,
        minTip: 5,
        maxTip: 10
    },
    'runner' : {
        destinations : getAllButExcluded(),
        characterConstructor: Runner,
        weight: 1,
        minTip: 20,
        maxTip: 30,
        takesSpaceInLine: false
    },
    'horse': {
        destinations : getAllButExcluded(),
        characterConstructor: Horse,
        weight: 2,
        minTip: 5
    },
    'ghost': {
        destinations : getAllButExcluded(),
        characterConstructor: Ghost,
        weight: -1,
        minTip: 10,
        maxTip: 10,
        scary: true,
        immuneToScary: true
    },
    'car': {
        destinations : getAllButExcluded(),
        characterConstructor: Car,
        weight: 10,
        width: 6,
        minTip: 30
    },
    'renovator': {
        destinations : getAllButExcluded(),
        characterConstructor: Renovator,
        weight: 1,
        width: 2,
        minTip: 0,
        maxTip: 0
    }
};

BaseCharacter.loadSprites();
