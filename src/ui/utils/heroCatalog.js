// heroCatalog.js

// helper: build file path
function spritePath(heroName, stateFile) {
  return `../../../assets/sprites/${heroName}_${stateFile}.png`;
}

// helper: build animation config
function makeAnim(
  heroName,
  stateFile,
  frameWidth,
  frameHeight,
  framesPerRow,
  totalFrames,
  fps = 10,
  scale = 2,
  loop = true
) {
  return {
    spriteSheetSrc: spritePath(heroName, stateFile),
    frameWidth,
    frameHeight,
    framesPerRow,
    totalFrames,
    fps,
    scale,
    startFrame: 0,
    loop,
    backgroundColor: null,
  };
}

// export a plain JS object
const HERO_CATALOG = {
  samurai: {
    type: 'samurai',
    name: 'Samurai',
    maxHp: 150,
    attack: 25,
    range: 1,
    speed: 25,
    cost: 3,
    attackCooldownMs: 900,
    animations: {
      idle:   makeAnim('samurai', 'idle',   200, 200, 4, 4,  8),
      walk:   makeAnim('samurai', 'run',    200, 200, 8, 8, 10),
      attack: [
        makeAnim('samurai', 'attack', 200, 200, 4, 4, 12, 2),
        makeAnim('samurai', 'attack1',200, 200, 4, 4, 12, 2)
      ],
      hit:    makeAnim('samurai', 'hit',    200, 200, 3, 3, 10, 2),
      dead:   makeAnim('samurai', 'dead',   200, 200, 7, 7,  8, 2, false),
    },
  },
    warrior: {
    type: 'warrior',
    name: 'Warrior',
    maxHp: 80,
    attack: 40,
    range: 3,
    speed: 15,
    cost: 4,
    attackCooldownMs: 1200,
    animations: {
      idle: makeAnim('warrior', 'idle', 162, 162, 10, 10, 8),
      walk: makeAnim('warrior', 'run', 162, 162, 8, 8, 10),
      attack: makeAnim('warrior', 'attack', 162, 162, 7, 7, 7, 2),
      hit: makeAnim('warrior', 'hit', 162, 162, 3, 3, 10, 2),
      dead: makeAnim('warrior', 'dead', 162, 162, 7, 7, 8, 2, false),
    },
  },
    wizard: {
    type: 'wizard',
    name: 'Wizard',
    maxHp: 80,
    attack: 40,
    range: 3,
    speed: 15,
    cost: 4,
    attackCooldownMs: 1200,
    animations: {
      idle: makeAnim('wizard', 'idle', 231, 190, 6, 6, 8),
      walk: makeAnim('wizard', 'run', 231, 190, 8, 8, 10),
      attack: makeAnim('wizard', 'attack', 231, 190, 8, 8, 10, 2),
      hit: makeAnim('wizard', 'hit', 231, 190, 4, 4, 10, 2),
      dead: makeAnim('wizard', 'dead', 231, 190, 7, 7, 8, 2, false),
    },
  },
    knight: { 
    type: 'knight',
    name: 'Knight',
    maxHp: 240,            // stronger than knight
    attack: 24,            // good damage
    range: 1,
    speed: 20,             // heavy armor, slower
    cost: 4,
    attackCooldownMs: 950,
    animations: {
      idle:   makeAnim('knight', 'idle',   180, 180, 11, 11,  8),
      walk:   makeAnim('knight', 'run',    180, 180, 8, 8, 10),
      attack: makeAnim('knight', 'attack', 180, 180, 7, 7, 12, 2),
      hit:    makeAnim('knight', 'hit',    180, 180, 4, 4, 10, 2),
      dead:   makeAnim('knight', 'dead',   180, 180, 11, 11,  8, 2, false),
    },
  },
    evilWizard: {
    type: 'evilWizard',
    name: 'Evil Wizard',
    maxHp: 100,          // squishier than normal wizard but still dangerous
    attack: 35,          // strong damage
    range: 3,            // ranged caster
    speed: 18,           // slower movement
    cost: 4,             // expensive unit
    attackCooldownMs: 1100,
    animations: {
      idle: makeAnim('evilWizard', 'idle', 250, 250, 8, 8, 8),
      walk: makeAnim('evilWizard', 'run', 250, 250, 8, 8, 10),
      attack: makeAnim('evilWizard', 'attack', 250, 250, 8, 8, 10, 2),
      hit: makeAnim('evilWizard', 'hit', 250, 250, 3, 3, 10, 2),
      dead: makeAnim('evilWizard', 'dead', 250, 250, 7, 7, 8, 2, false),
    },
  },
   jungleWarrior: {
    type: 'jungleWarrior',
    name: 'Jungle Warrior',
    maxHp: 180,          // tough, but not as tanky as knight
    attack: 28,          // strong melee
    range: 1,
    speed: 27,           // fast in the jungle
    cost: 3,
    attackCooldownMs: 900,
    animations: {
      idle:   makeAnim('junglewarrior', 'idle',   126, 126, 3, 3,  8),
      walk:   makeAnim('junglewarrior', 'run',    126, 126, 8, 8, 10),
      attack: makeAnim('junglewarrior', 'attack', 126, 126, 9, 9, 12, 2),
      hit:    makeAnim('junglewarrior', 'hit',    126, 126, 3, 3, 10, 2),
      dead:   makeAnim('junglewarrior', 'dead',   126, 126, 11, 11,  8, 2, false),
    },
  },
  knight2: { 
    type: 'knight2',
    name: 'Knight 2',
    maxHp: 220,          // Knights are tankier than Samurai
    attack: 20,          // Slightly lower attack
    range: 1,            // Melee unit
    speed: 22,           // Heavy but not slow
    cost: 3,             // Same cost as Samurai
    attackCooldownMs: 1000,
    animations: {
      idle:   makeAnim('knight2', 'idle',   140, 140, 11, 11,  8),
      walk:   makeAnim('knight2', 'run',    140, 140, 8, 8, 10),
      attack: makeAnim('knight2', 'attack', 140, 140, 6, 6, 12, 2),
      hit:    makeAnim('knight2', 'hit',    140, 140, 4, 4, 10, 2),
      dead:   makeAnim('knight2', 'dead',   140, 140, 9, 9,  8, 2, false),
    },
  },
  bossWizard: { 
    type: 'bossWizard',
    name: 'Boss Wizard',
    maxHp: 300,            // big HP pool, he's a boss
    attack: 45,            // heavy magic damage
    range: 4,              // long range caster
    speed: 16,             // slow but dangerous
    cost: 6,               // very expensive unit
    attackCooldownMs: 1200,
    animations: {
      idle:   makeAnim('bosswizard', 'idle',   140, 140, 10, 10,  8),
      walk:   makeAnim('bosswizard', 'run',    140, 140, 8, 8, 10),
      attack: makeAnim('bosswizard', 'attack', 140, 140, 13, 13, 12, 2),
      hit:    makeAnim('bosswizard', 'hit',    140, 140, 3, 3, 10, 2),
      dead:   makeAnim('bosswizard', 'dead',   140, 140, 18, 18,  8, 2, false),
    },
  },
  huntress: {
  type: 'huntress',
  name: 'Huntress',
  maxHp: 120,           // less HP, ranged unit
  attack: 26,           // strong single-target hits
  range: 4,             // good range
  speed: 28,            // fast
  cost: 3,
  attackCooldownMs: 850,
  animations: {
    idle:   makeAnim('huntress', 'idle',   150, 150, 8, 8,  8),
    walk:   makeAnim('huntress', 'run',    150, 150, 8, 8, 10),
    attack: makeAnim('huntress', 'attack', 150, 150, 5, 5, 12, 2),
    hit:    makeAnim('huntress', 'hit',    150, 150, 3, 3, 10, 2),
    dead:   makeAnim('huntress', 'dead',   150, 150, 8, 8,  8, 2, false),
  },
},
strongSamurai: {
  type: 'strongSamurai',
  name: 'Strong Samurai',
  maxHp: 200,           // more HP than normal samurai (150)
  attack: 32,           // stronger hits (was 25)
  range: 1,
  speed: 23,            // slightly heavier
  cost: 4,              // more expensive
  attackCooldownMs: 900,
  animations: {
    idle:   makeAnim('strongsamurai', 'idle',   200, 200, 8, 8,  8),
    walk:   makeAnim('strongsamurai', 'run',    200, 200, 8, 8, 10),
    attack: makeAnim('strongsamurai', 'attack', 200, 200, 6, 6, 12, 2),
    hit:    makeAnim('strongsamurai', 'hit',    200, 200, 4, 4, 10, 2),
    dead:   makeAnim('strongsamurai', 'dead',   200, 200, 6, 6,  8, 2, false),
  },
},
skeleton: {
  type: 'skeleton',
  name: 'Skeleton',
  maxHp: 90,            // fragile
  attack: 18,           // ok melee dmg
  range: 1,
  speed: 22,            // shuffling forward
  cost: 2,              // cheap unit
  attackCooldownMs: 950,
  animations: {
    idle:   makeAnim('skeleton', 'idle',   150, 150, 4, 4,  8),
    walk:   makeAnim('skeleton', 'run',    150, 150, 4, 4, 10),
    attack: makeAnim('skeleton', 'attack', 150, 150, 8, 8, 12, 2),
    hit:    makeAnim('skeleton', 'hit',    150, 150, 4, 4, 10, 2),
    dead:   makeAnim('skeleton', 'dead',   150, 150, 4, 4,  8, 2, false),
  },
},
goblin: {
  type: 'goblin',
  name: 'Goblin',
  maxHp: 70,            // very squishy
  attack: 16,           // low-ish damage
  range: 1,             // melee
  speed: 30,            // very fast
  cost: 1,              // cheap swarm unit
  attackCooldownMs: 800,
  animations: {
    idle:   makeAnim('goblin', 'idle',   150, 150, 4, 4,  8),
    walk:   makeAnim('goblin', 'run',    150, 150, 8, 8, 10),
    attack: makeAnim('goblin', 'attack', 150, 150, 8, 8, 12, 2),
    hit:    makeAnim('goblin', 'hit',    150, 150, 4, 4, 10, 2),
    dead:   makeAnim('goblin', 'dead',   150, 150, 4, 4,  8, 2, false),
  },
},
mushroom: {
  type: 'mushroom',
  name: 'Mushroom',
  maxHp: 100,           // small but not too squishy
  attack: 14,           // low melee/poison poke
  range: 1,
  speed: 18,            // waddles slowly
  cost: 2,
  attackCooldownMs: 900,
  animations: {
    idle:   makeAnim('mushroom', 'idle',   150, 150, 4, 4,  8),
    walk:   makeAnim('mushroom', 'run',    150, 150, 8, 8, 10),
    attack: makeAnim('mushroom', 'attack', 150, 150, 8, 8, 12, 2),
    hit:    makeAnim('mushroom', 'hit',    150, 150, 4, 4, 10, 2),
    dead:   makeAnim('mushroom', 'dead',   150, 150, 4, 4,  8, 2, false),
  },
},



};
