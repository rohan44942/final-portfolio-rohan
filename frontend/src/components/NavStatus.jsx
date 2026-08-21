import { useEffect, useState } from "react";

const WEATHER_REFRESH_MS = 15 * 60 * 1000;

const weatherIcons = {
  clear: "☀",
  cloud: "☁",
  fog: "Fog",
  drizzle: "🌦",
  rain: "🌧",
  snow: "❄",
  thunder: "⛈",
};

function weatherFromCode(code) {
  if (code === 0) return { label: "Clear", icon: weatherIcons.clear };
  if ([1, 2, 3].includes(code)) return { label: "Clouds", icon: weatherIcons.cloud };
  if ([45, 48].includes(code)) return { label: "Fog", icon: weatherIcons.fog };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: "Drizzle", icon: weatherIcons.drizzle };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: "Rain", icon: weatherIcons.rain };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snow", icon: weatherIcons.snow };
  if ([95, 96, 99].includes(code)) return { label: "Storm", icon: weatherIcons.thunder };
  return { label: "Clouds", icon: weatherIcons.cloud };
}

function formatTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function NavStatus({
  locationLabel = "Gurgaon, IN",
  latitude = 28.4595,
  longitude = 77.0266,
}) {
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let intervalId;
    const msUntilNextMinute = 60000 - (Date.now() % 60000) + 50;
    const timeoutId = setTimeout(() => {
      setNow(new Date());
      intervalId = setInterval(() => setNow(new Date()), 60000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadWeather = async () => {
      try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", String(latitude));
        url.searchParams.set("longitude", String(longitude));
        url.searchParams.set("current", "temperature_2m,weather_code");
        url.searchParams.set("timezone", "auto");

        const response = await fetch(url.toString());
        if (!response.ok) return;
        const data = await response.json();
        if (cancelled || !data?.current) return;

        const meta = weatherFromCode(Number(data.current.weather_code));
        setWeather({
          temp: Math.round(Number(data.current.temperature_2m)),
          icon: meta.icon,
          label: meta.label,
        });
      } catch {
        // Keep previous weather if fetch fails.
      }
    };

    loadWeather();
    const refresh = setInterval(loadWeather, WEATHER_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(refresh);
    };
  }, [latitude, longitude]);

  return (
    <div className="nav-status" aria-label="Local time and weather">
      <time className="nav-status-time" dateTime={now.toISOString()}>
        {formatTime(now)}
      </time>
      <span className="nav-status-place">{locationLabel}</span>
      {weather ? (
        <span className="nav-status-weather" title={weather.label}>
          <span className="nav-status-icon" aria-hidden="true">
            {weather.icon}
          </span>
          <span>{weather.temp}°C</span>
        </span>
      ) : null}
    </div>
  );
}

export default NavStatus;
