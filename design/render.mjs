import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const src = readFileSync('design/wa-e-usagi.svg')

const targets = [
  { out: 'public/icon-192.png', size: 192 },
  { out: 'public/icon-512.png', size: 512 },
  { out: 'public/apple-touch-icon.png', size: 180 },
]

for (const t of targets) {
  await sharp(src, { density: 512 }).resize(t.size, t.size).png().toFile(t.out)
  console.log('wrote', t.out)
}
