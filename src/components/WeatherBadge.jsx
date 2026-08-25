const CONDITION_ICON = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
};

const RAIN_CONDITIONS = ["Rain", "Drizzle", "Thunderstorm"];

export default function WeatherBadge({ weather }) {
  if (!weather || weather === "loading") {
    return <span className="text-xs text-gray-400">Weather: loading...</span>;
  }

  if (weather.error) {
    return <span className="text-xs text-gray-400">Weather unavailable</span>;
  }

  const { temperature, condition, description } = weather;
  const isRainy = RAIN_CONDITIONS.includes(condition);

  return (
    <div className="inline-flex flex-col gap-1">
      <span className="inline-flex items-center gap-1 text-xs bg-stone-100 rounded-full px-3 py-1">
        <span>{CONDITION_ICON[condition] || "🌡️"}</span>
        <span>
          {Math.round(temperature)}°C, {description}
        </span>
      </span>
      {isRainy && (
        <span className="text-xs text-amber-700">
          Rain expected — check current conditions before hiking trails.
        </span>
      )}
    </div>
  );
}
