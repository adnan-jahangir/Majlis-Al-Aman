const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generate() {
  const svgPath = path.join(__dirname, 'public', 'logo.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  const targets = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-maskable-512.png', size: 512 }
  ];

  for (const t of targets) {
    const outPath = path.join(__dirname, 'public', t.name);
    await sharp(svgBuffer)
      .resize(t.size, t.size)
      .png()
      .toFile(outPath);
    console.log(`Generated ${t.name} (${t.size}x${t.size})`);
  }
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
