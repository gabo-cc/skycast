type HourLabel = {
  time: string;
  date: string;
  offset: string;
  full: string;
};

export function weatherHourLabel(iso: string, timeZone: string): HourLabel {
  const fallback = {
    time: "--:--",
    date: "Fecha no disponible",
    offset: "",
    full: "Fecha no disponible",
  };

  const date = new Date(iso);

  if (!Number.isFinite(date.getTime())) {
    return fallback;
  }

  try {
    const parts = new Intl.DateTimeFormat("es-419", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZoneName: "shortOffset",
    }).formatToParts(date);

    const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";

    const time = `${part("hour")}:${part("minute")}`;

    const localDate = [part("day"), part("month"), part("year")].filter(Boolean).join(" ");

    const offset = part("timeZoneName");

    return {
      time,
      date: localDate,
      offset,
      full: `${localDate}, ${time} ${offset}`.trim(),
    };
  } catch {
    return fallback;
  }
}

export function repeatedLocalHours(
  hours: readonly { hora: string }[],
  timeZone: string,
): Set<string> {
  const counts = new Map<string, number>();

  for (const hour of hours) {
    const label = weatherHourLabel(hour.hora, timeZone);
    const key = `${label.date}|${label.time}`;

    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const repeated = new Set<string>();

  for (const [key, count] of counts) {
    if (count > 1) repeated.add(key);
  }

  return repeated;
}
