import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const targets = [
  'wa-a-mizuhiki',
  'wa-b-ensou',
  'wa-c-sakura',
  'wa-d-noshi',
]

for (const t of targets) {
  const buf = readFileSync(`design/${t}.svg`)
  await sharp(buf, { density: 512 }).resize(512, 512).png().toFile(`design/preview-${t}.png`)
  console.log('wrote', `design/preview-${t}.png`)
}
