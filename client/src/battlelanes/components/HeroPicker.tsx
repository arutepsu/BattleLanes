// src/game/components/HeroPicker.tsx
import type { HeroCatalog, HeroId } from "../../types/game";

type HeroPickerProps = {
  heroCatalog: HeroCatalog;
  selectedHeroId: HeroId | null;
  onSelectHero: (id: HeroId) => void;
};

export function HeroPicker({
  heroCatalog,
  selectedHeroId,
  onSelectHero,
}: HeroPickerProps) {
  const entries = Object.entries(heroCatalog);

  return (
    <div className="hero-bar">
      {entries.map(([id, hero]) => (
        <button
          key={id}
          className={
            "hero-btn" + (selectedHeroId === id ? " hero-btn--selected" : "")
          }
          onClick={() => onSelectHero(id as HeroId)}
        >
          <div>{hero.name}</div>
          <small>Cost: {hero.cost}</small>
        </button>
      ))}
    </div>
  );
}
