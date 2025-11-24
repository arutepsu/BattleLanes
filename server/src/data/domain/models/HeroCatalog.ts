// heroCatalog.ts

// --- Types ---

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

// Attack can be one animation or an array of variants
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

// If you want stricter typing for keys, you can later refine this to a union.
export type HeroCatalog = Record<string, HeroDefinition>;

// --- Helpers ---

// helper: build file path
// helper: build file path for the CLIENT
function spritePath(heroName: string, stateFile: string): string {
  // This will be resolved by the browser against the page origin (http://localhost:5173)
  return `/sprites/${heroName}_${stateFile}.png`;
}


// helper: build animation config
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

// --- Catalog ---

export const HERO_CATALOG: HeroCatalog = {
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
        makeAnim('samurai', 'attack',  200, 200, 4, 4, 12, 2),
        makeAnim('samurai', 'attack1', 200, 200, 4, 4, 12, 2),
      ],
      hit:    makeAnim('samurai', 'hit',    200, 200, 3, 3, 10, 2),
      dead:   makeAnim('samurai', 'dead',   200, 200, 7, 7,  8, 8, false),
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
      idle:   makeAnim('warrior', 'idle',   162, 162, 10, 10, 8),
      walk:   makeAnim('warrior', 'run',    162, 162, 8, 8, 10),
      attack: [
        makeAnim('warrior', 'attack', 162, 162, 7, 7, 7, 2),
        makeAnim('warrior', 'attack1', 162, 162, 7, 7, 7, 2)
      ]
      ,
      hit:    makeAnim('warrior', 'hit',    162, 162, 3, 3, 10, 2),
      dead:   makeAnim('warrior', 'dead',   162, 162, 7, 7, 8, 2, false),
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
      idle:   makeAnim('wizard', 'idle',   231, 190, 6, 6, 8),
      walk:   makeAnim('wizard', 'run',    231, 190, 8, 8, 10),
      attack: [
        makeAnim('wizard', 'attack', 231, 190, 8, 8, 10, 2),
        makeAnim('wizard', 'attack1', 231, 190, 8, 8, 10, 2)
      ],
      hit:    makeAnim('wizard', 'hit',    231, 190, 4, 4, 10, 2),
      dead:   makeAnim('wizard', 'dead',   231, 190, 7, 7, 8, 2, false),
    },
  },

  knight: {
    type: 'knight',
    name: 'Knight',
    maxHp: 240,
    attack: 24,
    range: 1,
    speed: 20,
    cost: 4,
    attackCooldownMs: 950,
    animations: {
      idle:   makeAnim('knight', 'idle',   180, 180, 11, 11, 8),
      walk:   makeAnim('knight', 'run',    180, 180, 8, 8, 10),
      attack: [
      makeAnim('knight', 'attack', 180, 180, 7, 7, 12, 2),
      makeAnim('knight', 'attack1',180, 180, 7, 7, 12, 2)
      ],
      hit:    makeAnim('knight', 'hit',    180, 180, 4, 4, 10, 2),
      dead:   makeAnim('knight', 'dead',   180, 180, 11, 11, 8, 2, false),
    },
  },

  evilWizard: {
    type: 'evilWizard',
    name: 'Evil Wizard',
    maxHp: 100,
    attack: 35,
    range: 3,
    speed: 18,
    cost: 4,
    attackCooldownMs: 1100,
    animations: {
      idle:   makeAnim('evilWizard', 'idle',   250, 250, 8, 8, 8),
      walk:   makeAnim('evilWizard', 'run',    250, 250, 8, 8, 10),
      attack: [
        makeAnim('evilWizard', 'attack', 250, 250, 8, 8, 10, 2),
        makeAnim('evilWizard', 'attack1',250, 250, 8, 8, 10, 2),
      ],
      hit:    makeAnim('evilWizard', 'hit',    250, 250, 3, 3, 10, 2),
      dead:   makeAnim('evilWizard', 'dead',   250, 250, 7, 7, 8, 2, false),
    },
  },

  jungleWarrior: {
    type: 'jungleWarrior',
    name: 'Jungle Warrior',
    maxHp: 180,
    attack: 28,
    range: 1,
    speed: 27,
    cost: 3,
    attackCooldownMs: 900,
    animations: {
      idle:   makeAnim('jungleWarrior', 'idle',   126, 126, 3, 3, 8),
      walk:   makeAnim('jungleWarrior', 'run',    126, 126, 8, 8, 10),
      attack: [
        makeAnim('jungleWarrior', 'attack', 126, 126, 9, 9, 12, 2),
        makeAnim('jungleWarrior', 'attack1', 126, 126, 7, 7, 12, 2),
        makeAnim('jungleWarrior', 'attack2', 126, 126, 6, 6, 12, 2),
      ],
      hit:    makeAnim('jungleWarrior', 'hit',    126, 126, 3, 3, 10, 2),
      dead:   makeAnim('jungleWarrior', 'dead',   126, 126, 11, 11, 8, 2, false),
    },
  },

  knight2: {
    type: 'knight2',
    name: 'Knight 2',
    maxHp: 220,
    attack: 20,
    range: 1,
    speed: 22,
    cost: 3,
    attackCooldownMs: 1000,
    animations: {
      idle:   makeAnim('knight2', 'idle',   140, 140, 11, 11, 8),
      walk:   makeAnim('knight2', 'run',    140, 140, 8, 8, 10),
      attack: makeAnim('knight2', 'attack', 140, 140, 6, 6, 12, 2),
      hit:    makeAnim('knight2', 'hit',    140, 140, 4, 4, 10, 2),
      dead:   makeAnim('knight2', 'dead',   140, 140, 9, 9, 8, 2, false),
    },
  },

  bossWizard: {
    type: 'bossWizard',
    name: 'Boss Wizard',
    maxHp: 300,
    attack: 45,
    range: 4,
    speed: 16,
    cost: 6,
    attackCooldownMs: 1200,
    animations: {
      idle:   makeAnim('bossWizard', 'idle',   140, 140, 10, 10, 8),
      walk:   makeAnim('bossWizard', 'run',    140, 140, 8, 8, 10),
      attack: makeAnim('bossWizard', 'attack', 140, 140, 13, 13, 12, 2),
      hit:    makeAnim('bossWizard', 'hit',    140, 140, 3, 3, 10, 2),
      dead:   makeAnim('bossWizard', 'dead',   140, 140, 18, 18, 8, 2, false),
    },
  },

  huntress: {
    type: 'huntress',
    name: 'Huntress',
    maxHp: 120,
    attack: 26,
    range: 4,
    speed: 28,
    cost: 3,
    attackCooldownMs: 850,
    animations: {
      idle:   makeAnim('huntress', 'idle',   150, 150, 8, 8, 8),
      walk:   makeAnim('huntress', 'run',    150, 150, 8, 8, 10),
      attack: [
        makeAnim('huntress', 'attack', 150, 150, 5, 5, 12, 2),
        makeAnim('huntress', 'attack1', 150, 150, 5, 5, 12, 2),
        makeAnim('huntress', 'attack2', 150, 150, 5, 5, 12, 2)
      ],
      hit:    makeAnim('huntress', 'hit',    150, 150, 3, 3, 10, 2),
      dead:   makeAnim('huntress', 'dead',   150, 150, 8, 8, 8, 2, false),
    },
  },

  strongSamurai: {
    type: 'strongSamurai',
    name: 'Strong Samurai',
    maxHp: 200,
    attack: 32,
    range: 1,
    speed: 23,
    cost: 4,
    attackCooldownMs: 900,
    animations: {
      idle:   makeAnim('strongSamurai', 'idle',   200, 200, 8, 8, 8),
      walk:   makeAnim('strongSamurai', 'run',    200, 200, 8, 8, 10),
      attack: [
        makeAnim('strongSamurai', 'attack', 200, 200, 6, 6, 12, 2),
        makeAnim('strongSamurai', 'attack1',200, 200, 6, 6, 12, 2)
      ],
      hit:    makeAnim('strongSamurai', 'hit',    200, 200, 4, 4, 10, 2),
      dead:   makeAnim('strongSamurai', 'dead',   200, 200, 6, 6, 8, 2, false),
    },
  },

  skeleton: {
    type: 'skeleton',
    name: 'Skeleton',
    maxHp: 90,
    attack: 18,
    range: 1,
    speed: 22,
    cost: 2,
    attackCooldownMs: 950,
    animations: {
      idle:   makeAnim('skeleton', 'idle',   150, 150, 4, 4, 8),
      walk:   makeAnim('skeleton', 'run',    150, 150, 4, 4, 10),
      attack: [
        makeAnim('skeleton', 'attack', 150, 150, 8, 8, 12, 2),
        makeAnim('skeleton', 'attack1', 150, 150, 8, 8, 12, 2),
        makeAnim('skeleton', 'attack2', 150, 150, 6, 6, 12, 2),
      ],
      hit:    makeAnim('skeleton', 'hit',    150, 150, 4, 4, 10, 2),
      dead:   makeAnim('skeleton', 'dead',   150, 150, 4, 4, 8, 2, false),
    },
  },

  goblin: {
    type: 'goblin',
    name: 'Goblin',
    maxHp: 70,
    attack: 16,
    range: 1,
    speed: 30,
    cost: 1,
    attackCooldownMs: 800,
    animations: {
      idle:   makeAnim('goblin', 'idle',   150, 150, 4, 4, 8),
      walk:   makeAnim('goblin', 'run',    150, 150, 8, 8, 10),
      attack: [
        makeAnim('goblin', 'attack', 150, 150, 8, 8, 12, 2),
        makeAnim('goblin', 'attack1',150, 150, 8, 8, 12, 2),
        makeAnim('goblin', 'attack2',150, 150, 12, 12, 12, 2),
      ],
      hit:    makeAnim('goblin', 'hit',    150, 150, 4, 4, 10, 2),
      dead:   makeAnim('goblin', 'dead',   150, 150, 4, 4, 8, 2, false),
    },
  },

  mushroom: {
    type: 'mushroom',
    name: 'Mushroom',
    maxHp: 100,
    attack: 14,
    range: 1,
    speed: 18,
    cost: 2,
    attackCooldownMs: 900,
    animations: {
      idle:   makeAnim('mushroom', 'idle',   150, 150, 4, 4, 8),
      walk:   makeAnim('mushroom', 'run',    150, 150, 8, 8, 10),
      attack: [
        makeAnim('mushroom', 'attack', 150, 150, 8, 8, 12, 2),
        makeAnim('mushroom', 'attack1',150, 150, 8, 8, 12, 2),
        makeAnim('mushroom', 'attack2',150, 150, 11, 11, 12, 2),
      ],
      hit:    makeAnim('mushroom', 'hit',    150, 150, 4, 4, 10, 2),
      dead:   makeAnim('mushroom', 'dead',   150, 150, 4, 4, 8, 2, false),
    },
  },
};

export type HeroId = keyof typeof HERO_CATALOG;
