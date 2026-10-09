import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const script = `
import zipfile, os

zip_path = 'public/snapdoc-web-source.zip'
if os.path.exists(zip_path):
    os.remove(zip_path)

include_files = [
    'index.html',
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'wrangler.toml',
    '.gitignore',
    '.env.example',
    'metadata.json',
    'README.md',
    'scripts/generate-icons.js',
    '.github/workflows/deploy-cloudflare.yml'
]

include_dirs = [
    'src',
    'public'
]

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for f in include_files:
        if os.path.exists(f):
            zipf.write(f, arcname=f)
    for d in include_dirs:
        for root, dirs, files in os.walk(d):
            for file in files:
                full_path = os.path.join(root, file)
                if file.endswith('.zip') or file.endswith('.exe') or file.endswith('.apk'):
                    continue
                zipf.write(full_path, arcname=full_path)

print('Zip created successfully. Size in KB:', os.path.getsize(zip_path) / 1024)
`;

try {
  execSync(`python3 -c "${script.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
} catch (e) {
  console.error('Failed to create zip', e);
}
