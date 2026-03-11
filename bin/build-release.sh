#!/bin/bash
# ─────────────────────────────────────────────────
# GutenX Blocks — Build Release Script
# Creates a distributable .zip for WP.org / manual install.
# ─────────────────────────────────────────────────

set -e

PLUGIN_SLUG="gutenx-blocks"
VERSION=$(node -p "require('./package.json').version")
BUILD_DIR="./release"
ZIP_FILE="${PLUGIN_SLUG}-${VERSION}.zip"

echo "🚀 Building ${PLUGIN_SLUG} v${VERSION}..."

# 1. Clean previous builds.
rm -rf "${BUILD_DIR}"
rm -f "${ZIP_FILE}"

# 2. Install production dependencies.
echo "📦 Installing dependencies..."
npm ci --omit=dev --silent 2>/dev/null || npm install --omit=dev --silent

# 3. Run production build.
echo "⚙️  Running production build..."
npm run build

# 4. Create release directory with only distributable files.
echo "📁 Assembling release..."
mkdir -p "${BUILD_DIR}/${PLUGIN_SLUG}"

# Copy PHP files.
cp gutenx-blocks.php "${BUILD_DIR}/${PLUGIN_SLUG}/"
cp uninstall.php "${BUILD_DIR}/${PLUGIN_SLUG}/"
cp readme.txt "${BUILD_DIR}/${PLUGIN_SLUG}/"
cp -r includes "${BUILD_DIR}/${PLUGIN_SLUG}/"
cp -r vendor "${BUILD_DIR}/${PLUGIN_SLUG}/"

# Copy build output.
cp -r build "${BUILD_DIR}/${PLUGIN_SLUG}/"

# Copy block source metadata (block.json files needed for registration).
mkdir -p "${BUILD_DIR}/${PLUGIN_SLUG}/src/blocks"
for block_dir in src/blocks/*/; do
    block_name=$(basename "$block_dir")
    mkdir -p "${BUILD_DIR}/${PLUGIN_SLUG}/src/blocks/${block_name}"
    if [ -f "${block_dir}block.json" ]; then
        cp "${block_dir}block.json" "${BUILD_DIR}/${PLUGIN_SLUG}/src/blocks/${block_name}/"
    fi
done

# Copy languages directory if it exists.
if [ -d "languages" ]; then
    cp -r languages "${BUILD_DIR}/${PLUGIN_SLUG}/"
fi

# 5. Create .zip archive.
echo "🗜️  Creating ZIP archive..."
cd "${BUILD_DIR}"
zip -r "../${ZIP_FILE}" "${PLUGIN_SLUG}/" -q
cd ..

# 6. Cleanup.
rm -rf "${BUILD_DIR}"

# 7. Report.
ZIP_SIZE=$(du -h "${ZIP_FILE}" | cut -f1)
echo ""
echo "✅ Build complete!"
echo "   File: ${ZIP_FILE}"
echo "   Size: ${ZIP_SIZE}"
echo "   Version: ${VERSION}"
echo ""
echo "📋 Contents:"
unzip -l "${ZIP_FILE}" | tail -1
