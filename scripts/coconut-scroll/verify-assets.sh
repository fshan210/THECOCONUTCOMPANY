#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-public/experience/coconut-bottle/v1}"

if ! command -v ffprobe >/dev/null 2>&1; then
  echo "ffprobe is required to validate the Scroll World media outputs." >&2
  exit 1
fi

while IFS= read -r -d '' asset; do
  printf '%s: ' "$asset"
  ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,pix_fmt \
    -of default=noprint_wrappers=1:nokey=1 "$asset" | paste -sd ',' -
done < <(find "$ROOT" -type f \( -name '*.avif' -o -name '*.jpg' \) -print0 | sort -z)
