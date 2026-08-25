const MODES = [
  { value: "DRIVING", label: "Driving" },
  { value: "WALKING", label: "Walking" },
  { value: "TRANSIT", label: "Transit" },
];

export default function TravelModeSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <span className="text-sm font-semibold text-stone-700">Travel mode:</span>
      <div className="flex gap-3">
        {MODES.map((mode) => (
          <label
            key={mode.value}
            className="flex items-center gap-1 text-sm text-stone-700"
          >
            <input
              type="radio"
              name="travel-mode"
              value={mode.value}
              checked={value === mode.value}
              onChange={() => onChange(mode.value)}
              className="accent-[#2E6B4F]"
            />
            {mode.label}
          </label>
        ))}
      </div>
    </div>
  );
}
