export type HeroState = 'idle' | 'walk' | 'attack' | 'hit' | 'dead';

export interface AnimConfig {
  spriteSheetSrc: string;
  frameWidth: number;
  frameHeight: number;
  framesPerRow: number;
  totalFrames: number;
  fps: number;
  scale: number;
  startFrame: number;
  loop: boolean;
  backgroundColor: string | null;
}

export interface HeroAnimations {
  idle: AnimConfig;
  walk: AnimConfig;
  attack: AnimConfig | AnimConfig[];
  hit: AnimConfig;
  dead: AnimConfig;
}

export interface HeroCoreStats {
  type: string;
  name: string;
  maxHp: number;
  attack: number;
  range: number;
  speed: number;
  cost: number;
  attackCooldownMs: number;
}

export interface HeroDefinition extends HeroCoreStats {
  animations: HeroAnimations;
}

export type HeroCatalog = Record<string, HeroDefinition>;

function spritePath(heroName: string, stateFile: string): string {
  return `/sprites/${heroName}_${stateFile}.png`;
}

function makeAnim(
  heroName: string,
  stateFile: string,
  frameWidth: number,
  frameHeight: number,
  framesPerRow: number,
  totalFrames: number,
  fps: number = 10,
  scale: number = 2,
  loop: boolean = true
): AnimConfig {
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

export const HERO_CATALOG: HeroCatalog = {
  // samurai: {
  //   type: 'samurai',
  //   name: 'Samurai',
  //   maxHp: 170,
  //   attack: 26,
  //   range: 1,
  //   speed: 24,
  //   cost: 4,
  //   attackCooldownMs: 900,
  //   animations: {
  //     idle:   makeAnim('samurai', 'idle',   200, 200, 4, 4,  8),
  //     walk:   makeAnim('samurai', 'run',    200, 200, 8, 8, 10),
  //     attack: [
  //       makeAnim('samurai', 'attack',  200, 200, 4, 4, 12, 2),
  //       makeAnim('samurai', 'attack1', 200, 200, 4, 4, 12, 2),
  //     ],
  //     hit:    makeAnim('samurai', 'hit',    200, 200, 3, 3, 10, 2),
  //     dead:   makeAnim('samurai', 'dead',   200, 200, 7, 7,  8, 8, false),
  //   },
  // },

  // warrior: {
  //   type: 'warrior',
  //   name: 'Warrior',
  //   maxHp: 130,
  //   attack: 22,
  //   range: 1,
  //   speed: 18,
  //   cost: 3,
  //   attackCooldownMs: 1100,
  //   animations: {
  //     idle:   makeAnim('warrior', 'idle',   162, 162, 10, 10, 8),
  //     walk:   makeAnim('warrior', 'run',    162, 162, 8, 8, 10),
  //     attack: [
  //       makeAnim('warrior', 'attack', 162, 162, 7, 7, 7, 2),
  //       makeAnim('warrior', 'attack1', 162, 162, 7, 7, 7, 2)
  //     ]
  //     ,
  //     hit:    makeAnim('warrior', 'hit',    162, 162, 3, 3, 10, 2),
  //     dead:   makeAnim('warrior', 'dead',   162, 162, 7, 7, 8, 2, false),
  //   },
  // },

  // wizard: {
  //   type: 'wizard',
  //   name: 'Wizard',
  //   maxHp: 90,
  //   attack: 26,
  //   range: 3,
  //   speed: 17,
  //   cost: 3,
  //   attackCooldownMs: 1150,
  //   animations: {
  //     idle:   makeAnim('wizard', 'idle',   231, 190, 6, 6, 8),
  //     walk:   makeAnim('wizard', 'run',    231, 190, 8, 8, 10),
  //     attack: [
  //       makeAnim('wizard', 'attack', 231, 190, 8, 8, 10, 2),
  //       makeAnim('wizard', 'attack1', 231, 190, 8, 8, 10, 2)
  //     ],
  //     hit:    makeAnim('wizard', 'hit',    231, 190, 4, 4, 10, 2),
  //     dead:   makeAnim('wizard', 'dead',   231, 190, 7, 7, 8, 2, false),
  //   },
  // },

  // knight: {
  //   type: 'knight',
  //   name: 'Knight',
  //   maxHp: 260,
  //   attack: 26,
  //   range: 1,
  //   speed: 18,
  //   cost: 5,
  //   attackCooldownMs: 950,
  //   animations: {
  //     idle:   makeAnim('knight', 'idle',   180, 180, 11, 11, 8),
  //     walk:   makeAnim('knight', 'run',    180, 180, 8, 8, 10),
  //     attack: [
  //     makeAnim('knight', 'attack', 180, 180, 7, 7, 12, 2),
  //     makeAnim('knight', 'attack1',180, 180, 7, 7, 12, 2)
  //     ],
  //     hit:    makeAnim('knight', 'hit',    180, 180, 4, 4, 10, 2),
  //     dead:   makeAnim('knight', 'dead',   180, 180, 11, 11, 8, 2, false),
  //   },
  // },

  // evilWizard: {
  //   type: 'evilWizard',
  //   name: 'Evil Wizard',
  //   maxHp: 150,
  //   attack: 38,
  //   range: 3,
  //   speed: 18,
  //   cost: 5,
  //   attackCooldownMs: 1100,
  //   animations: {
  //     idle:   makeAnim('evilWizard', 'idle',   250, 250, 8, 8, 8),
  //     walk:   makeAnim('evilWizard', 'run',    250, 250, 8, 8, 10),
  //     attack: [
  //       makeAnim('evilWizard', 'attack', 250, 250, 8, 8, 10, 2),
  //       makeAnim('evilWizard', 'attack1',250, 250, 8, 8, 10, 2),
  //     ],
  //     hit:    makeAnim('evilWizard', 'hit',    250, 250, 3, 3, 10, 2),
  //     dead:   makeAnim('evilWizard', 'dead',   250, 250, 7, 7, 8, 2, false),
  //   },
  // },

  // jungleWarrior: {
  //   type: 'jungleWarrior',
  //   name: 'Jungle Warrior',
  //   maxHp: 180,
  //   attack: 28,
  //   range: 1,
  //   speed: 27,
  //   cost: 4,
  //   attackCooldownMs: 900,
  //   animations: {
  //     idle:   makeAnim('jungleWarrior', 'idle',   126, 126, 3, 3, 8),
  //     walk:   makeAnim('jungleWarrior', 'run',    126, 126, 8, 8, 10),
  //     attack: [
  //       makeAnim('jungleWarrior', 'attack', 126, 126, 9, 9, 12, 2),
  //       makeAnim('jungleWarrior', 'attack1', 126, 126, 7, 7, 12, 2),
  //       makeAnim('jungleWarrior', 'attack2', 126, 126, 6, 6, 12, 2),
  //     ],
  //     hit:    makeAnim('jungleWarrior', 'hit',    126, 126, 3, 3, 10, 2),
  //     dead:   makeAnim('jungleWarrior', 'dead',   126, 126, 11, 11, 8, 2, false),
  //   },
  // },

  // knight2: {
  //   type: 'knight2',
  //   name: 'Knight 2',
  //   maxHp: 150,
  //   attack: 20,
  //   range: 1,
  //   speed: 20,
  //   cost: 3,
  //   attackCooldownMs: 1000,
  //   animations: {
  //     idle:   makeAnim('knight2', 'idle',   140, 140, 11, 11, 8),
  //     walk:   makeAnim('knight2', 'run',    140, 140, 8, 8, 10),
  //     attack: makeAnim('knight2', 'attack', 140, 140, 6, 6, 12, 2),
  //     hit:    makeAnim('knight2', 'hit',    140, 140, 4, 4, 10, 2),
  //     dead:   makeAnim('knight2', 'dead',   140, 140, 9, 9, 8, 2, false),
  //   },
  // },

  // bossWizard: {
  //   type: 'bossWizard',
  //   name: 'Boss Wizard',
  //   maxHp: 320,
  //   attack: 80,
  //   range: 3,
  //   speed: 16,
  //   cost: 6,
  //   attackCooldownMs: 1200,
  //   animations: {
  //     idle:   makeAnim('bossWizard', 'idle',   140, 140, 10, 10, 8),
  //     walk:   makeAnim('bossWizard', 'run',    140, 140, 8, 8, 10),
  //     attack: makeAnim('bossWizard', 'attack', 140, 140, 13, 13, 12, 2),
  //     hit:    makeAnim('bossWizard', 'hit',    140, 140, 3, 3, 10, 2),
  //     dead:   makeAnim('bossWizard', 'dead',   140, 140, 18, 18, 8, 2, false),
  //   },
  // },

  // huntress: {
  //   type: 'huntress',
  //   name: 'Huntress',
  //   maxHp: 130,
  //   attack: 30,
  //   range: 2,
  //   speed: 28,
  //   cost: 4,
  //   attackCooldownMs: 900,
  //   animations: {
  //     idle:   makeAnim('huntress', 'idle',   150, 150, 8, 8, 8),
  //     walk:   makeAnim('huntress', 'run',    150, 150, 8, 8, 10),
  //     attack: [
  //       makeAnim('huntress', 'attack', 150, 150, 5, 5, 12, 2),
  //       makeAnim('huntress', 'attack1', 150, 150, 5, 5, 12, 2),
  //       makeAnim('huntress', 'attack2', 150, 150, 5, 5, 12, 2)
  //     ],
  //     hit:    makeAnim('huntress', 'hit',    150, 150, 3, 3, 10, 2),
  //     dead:   makeAnim('huntress', 'dead',   150, 150, 8, 8, 8, 2, false),
  //   },
  // },

  // strongSamurai: {
  //   type: 'strongSamurai',
  //   name: 'Strong Samurai',
  //   maxHp: 230,
  //   attack: 34,
  //   range: 1,
  //   speed: 23,
  //   cost: 5,
  //   attackCooldownMs: 900,
  //   animations: {
  //     idle:   makeAnim('strongSamurai', 'idle',   200, 200, 8, 8, 8),
  //     walk:   makeAnim('strongSamurai', 'run',    200, 200, 8, 8, 10),
  //     attack: [
  //       makeAnim('strongSamurai', 'attack', 200, 200, 6, 6, 12, 2),
  //       makeAnim('strongSamurai', 'attack1',200, 200, 6, 6, 12, 2)
  //     ],
  //     hit:    makeAnim('strongSamurai', 'hit',    200, 200, 4, 4, 10, 2),
  //     dead:   makeAnim('strongSamurai', 'dead',   200, 200, 6, 6, 8, 2, false),
  //   },
  // },

  // skeleton: {
  //   type: 'skeleton',
  //   name: 'Skeleton',
  //   maxHp: 100,
  //   attack: 18,
  //   range: 1,
  //   speed: 22,
  //   cost: 2,
  //   attackCooldownMs: 950,
  //   animations: {
  //     idle:   makeAnim('skeleton', 'idle',   150, 150, 4, 4, 8),
  //     walk:   makeAnim('skeleton', 'run',    150, 150, 4, 4, 10),
  //     attack: [
  //       makeAnim('skeleton', 'attack', 150, 150, 8, 8, 12, 2),
  //       makeAnim('skeleton', 'attack1', 150, 150, 8, 8, 12, 2),
  //       makeAnim('skeleton', 'attack2', 150, 150, 6, 6, 12, 2),
  //     ],
  //     hit:    makeAnim('skeleton', 'hit',    150, 150, 4, 4, 10, 2),
  //     dead:   makeAnim('skeleton', 'dead',   150, 150, 4, 4, 8, 2, false),
  //   },
  // },

  // goblin: {
  //   type: 'goblin',
  //   name: 'Goblin',
  //   maxHp: 60,
  //   attack: 12,
  //   range: 1,
  //   speed: 32,
  //   cost: 1,
  //   attackCooldownMs: 850,
  //   animations: {
  //     idle:   makeAnim('goblin', 'idle',   150, 150, 4, 4, 8),
  //     walk:   makeAnim('goblin', 'run',    150, 150, 8, 8, 10),
  //     attack: [
  //       makeAnim('goblin', 'attack', 150, 150, 8, 8, 12, 2),
  //       makeAnim('goblin', 'attack1',150, 150, 8, 8, 12, 2),
  //       makeAnim('goblin', 'attack2',150, 150, 12, 12, 12, 2),
  //     ],
  //     hit:    makeAnim('goblin', 'hit',    150, 150, 4, 4, 10, 2),
  //     dead:   makeAnim('goblin', 'dead',   150, 150, 4, 4, 8, 2, false),
  //   },
  // },

  // mushroom: {
  //   type: 'mushroom',
  //   name: 'Mushroom',
  //   maxHp: 90,
  //   attack: 14,
  //   range: 1,
  //   speed: 18,
  //   cost: 2,
  //   attackCooldownMs: 950,
  //   animations: {
  //     idle:   makeAnim('mushroom', 'idle',   150, 150, 4, 4, 8),
  //     walk:   makeAnim('mushroom', 'run',    150, 150, 8, 8, 10),
  //     attack: [
  //       makeAnim('mushroom', 'attack', 150, 150, 8, 8, 12, 2),
  //       makeAnim('mushroom', 'attack1',150, 150, 8, 8, 12, 2),
  //       makeAnim('mushroom', 'attack2',150, 150, 11, 11, 12, 2),
  //     ],
  //     hit:    makeAnim('mushroom', 'hit',    150, 150, 4, 4, 10, 2),
  //     dead:   makeAnim('mushroom', 'dead',   150, 150, 4, 4, 8, 2, false),
  //   },
  // },
  // taurus:{
  //   type: 'taurus',
  //   name: 'Taurus',
  //   maxHp: 2000,
  //   attack: 100,
  //   range: 5,
  //   speed: 5,
  //   cost: 8,
  //   attackCooldownMs: 1500,
  //   animations: {
  //     idle:   makeAnim('taurus', 'idle',   900, 500, 18, 18, 8),
  //     walk:   makeAnim('taurus', 'run',    900, 500, 16, 16, 10),
  //     attack: [
  //       makeAnim('taurus', 'attack', 900, 500, 13, 13, 12, 2),
  //       makeAnim('taurus', 'attack1',900, 500, 17, 17, 12, 2)
  //     ],
  //     hit:    makeAnim('taurus', 'hit',    900, 500, 4, 4, 10, 2),
  //     dead:   makeAnim('taurus', 'dead',   900, 500, 18, 18, 8, 2, false),
  //   },
  // },
  // fireWizard:{
  //   type: 'fireWizard',
  //   name: 'Fire Wizard',
  //   maxHp: 160,
  //   attack: 45,
  //   range: 3, 
  //   speed: 20,
  //   cost: 5,
  //   attackCooldownMs: 1000,
  //   animations: {
  //     idle:   makeAnim('fireWizard', 'idle',   150, 150, 8, 8, 8),
  //     walk:   makeAnim('fireWizard', 'run',    150, 150, 8, 8, 10),
  //     attack: [
  //       makeAnim('fireWizard', 'attack', 150, 150, 8, 8, 10, 2),
  //     ],
  //     hit:    makeAnim('fireWizard', 'hit',    150, 150, 4, 4, 10, 2),
  //     dead:   makeAnim('fireWizard', 'dead',   150, 150, 5, 5, 8, 2, false),
  //   },
  // },
  // worm: {
  //   type: 'worm',
  //   name: 'Worm',
  //   maxHp: 220,
  //   attack: 28,
  //   range: 2,
  //   speed: 12,
  //   cost: 4,
  //   attackCooldownMs: 1100,
  //   animations: {
  //     idle:   makeAnim('worm', 'idle',   90, 90, 6, 6, 8),
  //     walk:   makeAnim('worm', 'run',    90, 90, 9, 9, 10),
  //     attack: [
  //       makeAnim('worm', 'attack', 90, 90, 16, 16, 12, 2),
  //     ],
  //     hit:    makeAnim('worm', 'hit',    90, 90, 3, 3, 10, 2),
  //     dead:   makeAnim('worm', 'dead',   90, 90, 9, 9, 8, 2, false),
  //   },
  // },
  // 1) Assassin – fast burst, low-ish range, very high speed
  kuroshiin: {
    type: 'kuroshiin',
    name: 'Kuroshiin',
    maxHp: 210,
    attack: 38,
    range: 1,
    speed: 27,
    cost: 5,
    attackCooldownMs: 780,
    animations: {
      idle:   makeAnim('kuroshiin', 'idle',   93, 93, 4, 4, 8),
      walk:   makeAnim('kuroshiin', 'run',    93, 93, 8, 8, 11),
      attack: [
        makeAnim('kuroshiin', 'attack', 93, 93, 4, 4, 13, 2),
        makeAnim('kuroshiin', 'attack1',93, 93,4, 4, 13, 2),
      ],
      hit:    makeAnim('kuroshiin', 'hit',    180, 180, 4, 4, 10, 2),
      dead:   makeAnim('kuroshiin', 'dead',   180, 180, 4, 4, 8, 2, false),
    },
  },

  // 2) Dark Knight – tanky bruiser, slow-ish, hard hits
  kagemori: {
    type: 'kagemori',
    name: 'Kagemori',
    maxHp: 300,
    attack: 40,
    range: 1,
    speed: 16,
    cost: 6,
    attackCooldownMs: 980,
    animations: {
      idle:   makeAnim('kagemori', 'idle',   103, 103, 4, 4, 7),
      walk:   makeAnim('kagemori', 'run',    103, 103, 8, 8, 9),
      attack: [
        makeAnim('kagemori', 'attack', 103, 103, 4, 4, 12, 2),
        makeAnim('kagemori', 'attack1',103, 103, 4, 4, 12, 2),
      ],
      hit:    makeAnim('kagemori', 'hit',    103, 103, 4, 4, 10, 2),
      dead:   makeAnim('kagemori', 'dead',   103, 103, 4, 4, 8, 2, false),
    },
  },

  // 3) Monarch – staff/royal aura, mid-range, reliable DPS (commander feel)
  tianlong: {
    type: 'tianlong',
    name: 'Tianlong',
    maxHp: 260,
    attack: 36,
    range: 3,
    speed: 18,
    cost: 6,
    attackCooldownMs: 900,
    animations: {
      idle:   makeAnim('tianlong', 'idle',    103, 104, 4, 4, 8),
      walk:   makeAnim('tianlong', 'run',     103, 104, 8, 8, 10),
      attack: [
        makeAnim('tianlong', 'attack', 103, 104, 4, 4, 12, 2),
        makeAnim('tianlong', 'attack1', 103, 104, 4, 4, 12, 2),
      ],
      hit:    makeAnim('tianlong', 'hit',     103, 104, 4, 4, 10, 2),
      dead:   makeAnim('tianlong', 'dead',    103, 104, 4, 4, 8, 2, false),
    },
  },

  // 4) Frost Duelist – high speed, slightly longer reach, consistent pressure
  elowen: {
    type: 'elowen',
    name: 'Elowen',
    maxHp: 235,
    attack: 33,
    range: 2,
    speed: 24,
    cost: 5,
    attackCooldownMs: 840,
    animations: {
      idle:   makeAnim('elowen', 'idle',   82, 105, 4, 4, 8),
      walk:   makeAnim('elowen', 'run',    82, 105, 8, 8, 11),
      attack: [
        makeAnim('elowen', 'attack', 82, 105, 4, 4, 12, 2),
        makeAnim('elowen', 'attack1',82, 105, 4, 4, 12, 2),
      ],
      hit:    makeAnim('elowen', 'hit',    82, 105, 4, 4, 10, 2),
      dead:   makeAnim('elowen', 'dead',   82, 105, 4, 4, 8, 2, false),
    },
  },

  // 5) Horned Demon – big melee cleave vibe, very high damage, durable
  onikage: {
    type: 'onikage',
    name: 'Onikage',
    maxHp: 290,
    attack: 46,
    range: 1,
    speed: 17,
    cost: 7,
    attackCooldownMs: 1050,
    animations: {
      idle:   makeAnim('onikage', 'idle',   200, 200, 4, 4, 7),
      walk:   makeAnim('onikage', 'run',    200, 200, 8, 8, 9),
      attack: [
        makeAnim('onikage', 'attack', 200, 200, 4, 4, 12, 2),
        makeAnim('onikage', 'attack1',200, 200, 4, 4, 12, 2),
        makeAnim('onikage', 'attack2',200, 200, 4, 4, 12, 2),
      ],
      hit:    makeAnim('onikage', 'hit',    200, 200, 4, 4, 10, 2),
      dead:   makeAnim('onikage', 'dead',   200, 200, 4, 4, 8, 2, false),
    },
  },

  // 6) Executioner – slow but long reach, punishing hits, anti-frontline feel
  morren: {
    type: 'morren',
    name: 'Morren',
    maxHp: 275,
    attack: 44,
    range: 2,
    speed: 15,
    cost: 6,
    attackCooldownMs: 1020,
    animations: {
      idle:   makeAnim('morren', 'idle',   128, 123, 4, 4, 7),
      walk:   makeAnim('morren', 'run',    128, 123, 8, 8, 9),
      attack: [
        makeAnim('morren', 'attack', 128, 123, 4, 4, 12, 2),
        makeAnim('morren', 'attack1',128, 123, 4, 4, 12, 2),
      ],
      hit:    makeAnim('morren', 'hit',    128, 123, 4, 4, 10, 2),
      dead:   makeAnim('morren', 'dead',   128, 123, 4, 4, 8, 2, false),
    },
  },
  //  // 1) Raiken – elite samurai, fast and lethal
    raiken: {
    type: 'raiken',
    name: 'Raiken',
    maxHp: 235,
    attack: 36,
    range: 1,
    speed: 24,
    cost: 5,
    attackCooldownMs: 880,
    animations: {
      idle:   makeAnim('raiken', 'idle',   100, 100, 4, 4, 8),
      walk:   makeAnim('raiken', 'run',    100, 100, 8, 8, 10),
      attack: [
        makeAnim('raiken', 'attack', 100, 100, 4, 4, 12, 2),
        makeAnim('raiken', 'attack1',100, 100, 4, 4, 12, 2),
      ],
      hit:    makeAnim('raiken', 'hit',    100, 100, 4, 4, 10, 2),
      dead:   makeAnim('raiken', 'dead',   100, 100, 4, 4, 8, 2, false),
    },
  },

    // 2) Nyxar – assassin, extreme DPS, fragile if caught
    nyxar: {
    type: 'nyxar',
    name: 'Nyxar',
    maxHp: 210,
    attack: 40,
    range: 1,
    speed: 27,
    cost: 5,
    attackCooldownMs: 760,
    animations: {
      idle:   makeAnim('nyxar', 'idle',   100, 100, 4, 4, 8),
      walk:   makeAnim('nyxar', 'run',    100, 100, 8, 8, 11),
      attack: [
        makeAnim('nyxar', 'attack', 100, 100, 4, 4, 13, 2),
        makeAnim('nyxar', 'attack1',100, 100, 4, 4, 13, 2),
      ],
      hit:    makeAnim('nyxar', 'hit',    100, 100, 4, 4, 10, 2),
      dead:   makeAnim('nyxar', 'dead',   100, 100, 4, 4, 8, 2, false),
    },
  },

  // 3) Arixen – disciplined blade master
  arixen: {
    type: 'arixen',
    name: 'Arixen',
    maxHp: 245,
    attack: 34,
    range: 1,
    speed: 22,
    cost: 5,
    attackCooldownMs: 900,
    animations: {
      idle:   makeAnim('arixen', 'idle',   100, 100, 4, 4, 8),
      walk:   makeAnim('arixen', 'run',    100, 100, 8, 8, 10),
      attack: [
        makeAnim('arixen', 'attack', 100, 100, 4, 4, 12, 2),
        makeAnim('arixen', 'attack1',100, 100, 4, 4, 12, 2),
      ],
      hit:    makeAnim('arixen', 'hit',    100, 100, 4, 4, 10, 2),
      dead:   makeAnim('arixen', 'dead',   100, 100, 4, 4, 8, 2, false),
    },
  },

  // 4) Solkar – golden frontline champion
  solkar: {
    type: 'solkar',
    name: 'Solkar',
    maxHp: 310,
    attack: 38,
    range: 1,
    speed: 16,
    cost: 6,
    attackCooldownMs: 980,
    animations: {
      idle:   makeAnim('solkar', 'idle',   100, 100, 4, 4, 7),
      walk:   makeAnim('solkar', 'run',    100, 100, 8, 8, 9),
      attack: [
        makeAnim('solkar', 'attack', 100, 100, 4, 4, 12, 2),
        makeAnim('solkar', 'attack1',100, 100, 4, 4, 12, 2),
      ],
      hit:    makeAnim('solkar', 'hit',    100, 100, 4, 4, 10, 2),
      dead:   makeAnim('solkar', 'dead',   100, 100, 4, 4, 8, 2, false),
    },
  },

  // 5) Vireth – agile duelist, mid-range pressure
  vireth: {
    type: 'vireth',
    name: 'Vireth',
    maxHp: 230,
    attack: 32,
    range: 2,
    speed: 25,
    cost: 5,
    attackCooldownMs: 860,
    animations: {
      idle:   makeAnim('vireth', 'idle',   100, 100, 4, 4, 8),
      walk:   makeAnim('vireth', 'run',    100, 100, 8, 8, 11),
      attack: [
        makeAnim('vireth', 'attack', 100, 100, 4, 4, 12, 2),
        makeAnim('vireth', 'attack1',100, 100, 4, 4, 12, 2),
      ],
      hit:    makeAnim('vireth', 'hit',    100, 100, 4, 4, 10, 2),
      dead:   makeAnim('vireth', 'dead',   100, 100, 4, 4, 8, 2, false),
    },
  },

  // 6) Obryx – corrupted juggernaut
  obryx: {
    type: 'obryx',
    name: 'Obryx',
    maxHp: 330,
    attack: 48,
    range: 1,
    speed: 14,
    cost: 7,
    attackCooldownMs: 1100,
    animations: {
      idle:   makeAnim('obryx', 'idle',   100, 100, 4, 4, 7),
      walk:   makeAnim('obryx', 'run',    100, 100, 8, 8, 9),
      attack: [
        makeAnim('obryx', 'attack', 100, 100, 4, 4, 12, 2),
        makeAnim('obryx', 'attack1',100, 100, 4, 4, 12, 2),
      ],
      hit:    makeAnim('obryx', 'hit',    100, 100, 4, 4, 10, 2),
      dead:   makeAnim('obryx', 'dead',   100, 100, 4, 4, 8, 2, false),
    },
  },
};

export type HeroId = keyof typeof HERO_CATALOG;
