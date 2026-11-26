type Point = { x: number; y: number };

export function graficaTemperaturas(hours: readonly { temperatura: number | null }[]) {
  const temperatures = hours.flatMap((hour) =>
    hour.temperatura === null ? [] : [hour.temperatura],
  );
  if (temperatures.length === 0) return null;

  const min = Math.min(...temperatures);
  const max = Math.max(...temperatures);
  const points = hours.map((hour, index): Point | null => {
    if (hour.temperatura === null) return null;
    return {
      x: hours.length < 2 ? 50 : 5 + (index * 90) / (hours.length - 1),
      y: max === min ? 35 : 52 - ((hour.temperatura - min) / (max - min)) * 34,
    };
  });
  const segments: Point[][] = [];
  let segment: Point[] = [];
  for (const point of points) {
    if (point) {
      segment.push(point);
    } else if (segment.length) {
      segments.push(segment);
      segment = [];
    }
  }
  if (segment.length) segments.push(segment);

  return { min, max, points, segments };
}
