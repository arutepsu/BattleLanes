import type { PlayerSide } from "../../types/game";

type ControlsPanelProps = {
  activeSide: PlayerSide;
  onChangeActiveSide: (side: PlayerSide) => void;
  isRunning: boolean;
  onToggleRunning: () => void;
};

export function ControlsPanel({
  activeSide,
  onChangeActiveSide,
  isRunning,
  onToggleRunning,
}: ControlsPanelProps) {
  return (
    <div className="controls-panel">
      <div className="spawn-toggle">
        <span>Spawning for:&nbsp;</span>
        <button
          className={
            activeSide === "left" ? "spawn-btn spawn-btn--active" : "spawn-btn"
          }
          onClick={() => onChangeActiveSide("left")}
        >
          Left
        </button>
        <button
          className={
            activeSide === "right" ? "spawn-btn spawn-btn--active" : "spawn-btn"
          }
          onClick={() => onChangeActiveSide("right")}
        >
          Right
        </button>
      </div>

      <button className="pause-btn" onClick={onToggleRunning}>
        {isRunning ? "Pause" : "Resume"}
      </button>
    </div>
  );
}
