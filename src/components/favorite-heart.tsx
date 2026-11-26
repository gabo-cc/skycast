"use client";

import { Icon } from "@/components/icon";
import { rellenoFavorito } from "@/lib/favorite-presentation";

export function FavoriteHeart({
  active,
  disabled,
  label,
  onClick,
}: {
  active: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={`${active ? "Quitar de favoritos" : "Agregar a favoritos"}: ${label}`}
      className="favorite-heart inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon name="heart" fill={rellenoFavorito(active)} className="size-6" />
    </button>
  );
}
