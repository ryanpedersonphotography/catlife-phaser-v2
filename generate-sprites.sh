#!/bin/bash

# Create assets directory
mkdir -p assets/sprites

echo "Generating Cat Life sprite assets..."

# Generate cat sprites for each cat
cats=(
    "whiskers:#FF6B6B"
    "mittens:#4ECDC4"
    "shadow:#2C3E50"
    "bella:#F7DC6F"
    "oreo:#34495E"
    "luna:#BB8FCE"
    "simba:#E67E22"
    "cleo:#85929E"
    "felix:#3498DB"
    "daisy:#F1948A"
    "oliver:#58D68D"
    "chloe:#AED6F1"
    "leo:#F8C471"
    "lily:#D7BDE2"
    "charlie:#A9DFBF"
    "sophie:#F9E79F"
    "rocky:#AEB6BF"
    "mia:#FAD7A0"
    "jasper:#ABEBC6"
    "tink:#D5A6BD"
)

for cat_data in "${cats[@]}"; do
    IFS=':' read -r name color <<< "$cat_data"
    filename="assets/sprites/cat_${name}.png"
    
    echo "Generating sprite for $name (color: $color)"
    
    # Create a simple 512x64 sprite sheet (8 frames)
    magick -size 512x64 xc:transparent \
        -fill "$color" \
        -draw "ellipse 32,42 16,20 0,360" \
        -draw "circle 32,22 12" \
        -draw "ellipse 96,42 16,20 0,360" \
        -draw "circle 96,22 12" \
        -draw "ellipse 160,42 16,20 0,360" \
        -draw "circle 160,22 12" \
        -draw "ellipse 224,42 16,20 0,360" \
        -draw "circle 224,22 12" \
        -draw "ellipse 288,42 16,20 0,360" \
        -draw "circle 288,22 12" \
        -draw "ellipse 352,42 16,20 0,360" \
        -draw "circle 352,22 12" \
        -draw "ellipse 416,48 20,16 0,360" \
        -draw "ellipse 480,48 20,16 0,360" \
        -fill white \
        -draw "circle 28,20 2" \
        -draw "circle 36,20 2" \
        -fill black \
        -draw "circle 28,20 1" \
        -draw "circle 36,20 1" \
        "$filename"
done

# Create food bowl sprites
echo "Creating food bowl sprites..."
magick -size 64x64 xc:transparent \
    -fill "#8B6914" -draw "ellipse 32,35 28,15 0,360" \
    -fill "#654321" -draw "ellipse 32,32 24,12 0,360" \
    "assets/sprites/food_bowl_empty.png"

magick -size 64x64 xc:transparent \
    -fill "#8B6914" -draw "ellipse 32,35 28,15 0,360" \
    -fill "#654321" -draw "ellipse 32,32 24,12 0,360" \
    -fill "#8B4513" \
    -draw "circle 28,30 3" \
    -draw "circle 36,29 3" \
    -draw "circle 32,31 3" \
    "assets/sprites/food_bowl_full.png"

# Create litter box sprites
echo "Creating litter box sprites..."
magick -size 64x64 xc:transparent \
    -fill "#696969" -draw "rectangle 5,10 59,54" \
    -fill "#F5DEB3" -draw "rectangle 10,35 54,50" \
    "assets/sprites/litter_box_clean.png"

magick -size 64x64 xc:transparent \
    -fill "#696969" -draw "rectangle 5,10 59,54" \
    -fill "#F5DEB3" -draw "rectangle 10,35 54,50" \
    -fill "#8B451380" \
    -draw "circle 20,40 4" \
    -draw "circle 40,38 3" \
    "assets/sprites/litter_box_dirty.png"

# Create UI sprites
echo "Creating UI sprites..."
magick -size 32x32 xc:transparent \
    -fill "#FF69B4" \
    -draw "circle 16,16 10" \
    "assets/sprites/icon_heart.png"

magick -size 32x32 xc:transparent \
    -fill "#FFD700" \
    -draw "polygon 16,4 20,12 28,12 22,18 24,28 16,22 8,28 10,18 4,12 12,12" \
    "assets/sprites/particle_star.png"

echo "Sprite generation complete!"
ls -la assets/sprites/