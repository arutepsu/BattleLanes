// src/game/components/LanesView.tsx
import type { HeroCatalog, LaneId, MatchState } from "../../types/game";
import { LaneView } from "./LaneView";

const ACTIVE_LANE: LaneId = 0;

type LanesViewProps = {
  match: MatchState;
  heroCatalog: HeroCatalog;
  onLaneClick: (lane: LaneId) => void;
};

export function LanesView({
  match,
  heroCatalog,
  onLaneClick,
}: LanesViewProps) {
  return (
    <div className="board">
      <LaneView
        lane={ACTIVE_LANE}
        match={match}
        heroCatalog={heroCatalog}
        onClick={() => onLaneClick(ACTIVE_LANE)}
      />
    </div>
  );
}
