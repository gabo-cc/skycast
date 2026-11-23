# SkyCast

Aplicación meteorológica académica construida con Next.js, React, TypeScript y Tailwind CSS. Permite buscar ciudades, consultar el pronóstico de Open-Meteo, guardar favoritos en el navegador y comparar dos ubicaciones.

## Desarrollo

Se utiliza exclusivamente pnpm. No se requiere una clave de API para la integración actual.

```sh
pnpm install
pnpm dev
```

Abrir `http://localhost:3000`. Para verificar el proyecto:

```sh
pnpm format:check
pnpm lint
pnpm test
pnpm build
pnpm encoding:check
```

Los favoritos se almacenan en `localStorage` del navegador. Los agregados diarios de Open-Meteo usan el desplazamiento vigente al consultar y pueden abarcar horas distintas del día local durante una transición de horario de verano. El proceso de desarrollo y sus verificaciones se documentan en `VIBE_CODING.md`.
