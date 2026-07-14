"use client";

import { useEffect, useState } from "react";

export default function WeatherCard({ destination }: { destination: string }) {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`/api/weather?city=${encodeURIComponent(destination)}`);
        if (!res.ok) { setError(true); return; }
        const data = await res.json();
        setWeather(data);
      } catch {
        setError(true);
      }
    };
    fetchWeather();
  }, [destination]);

  if (error) return null;

  if (!weather) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 animate-pulse flex gap-4 items-center">
        <div className="w-10 h-10 bg-white/10 rounded-full" />
        <div className="space-y-2">
          <div className="w-32 h-3 bg-white/10 rounded" />
          <div className="w-48 h-3 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  const temp = weather.main?.temp;
  const humidity = weather.main?.humidity;
  const condition = weather.weather?.[0]?.main;
  const icon = weather.weather?.[0]?.icon;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 flex items-center gap-5">
      {icon && (
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={condition}
          width={56}
          height={56}
        />
      )}
      <div>
        <p className="text-xs text-slate-400 mb-0.5">Current weather in {destination}</p>
        <p className="text-xl font-bold">
          {temp !== undefined ? `${Math.round(temp)}°C` : "—"}
          <span className="text-slate-400 font-normal text-sm ml-2">{condition}</span>
        </p>
        {humidity !== undefined && (
          <p className="text-slate-400 text-sm">💧 {humidity}% humidity</p>
        )}
      </div>
    </div>
  );
}
