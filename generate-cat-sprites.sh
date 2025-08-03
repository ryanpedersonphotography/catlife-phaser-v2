#!/bin/bash

# Create assets directory
mkdir -p assets/sprites

# Function to create a cat sprite
create_cat_sprite() {
    local name=$1
    local color=$2
    local pattern=$3
    local filename="assets/sprites/cat_${name}.png"
    
    echo "Generating sprite for $name (color: $color)"
    
    # Create a 512x64 sprite sheet (8 frames of 64x64)
    convert -size 512x64 xc:transparent \
        -fill "$color" \
        \
        $(# Frame 0 - Idle 1) \
        -draw "ellipse 32,42 18,22 0,360" \
        -draw "circle 32,22 15" \
        -draw "polygon 22,12 27,2 32,12" \
        -draw "polygon 32,12 37,2 42,12" \
        -draw "rectangle 20,52 25,64" \
        -draw "rectangle 27,52 32,64" \
        -draw "rectangle 34,52 39,64" \
        -draw "rectangle 41,52 46,64" \
        \
        $(# Frame 1 - Idle 2 - slight movement) \
        -draw "ellipse 96,42 18,22 0,360" \
        -draw "circle 96,20 15" \
        -draw "polygon 86,10 91,0 96,10" \
        -draw "polygon 96,10 101,0 106,10" \
        -draw "rectangle 84,52 89,64" \
        -draw "rectangle 91,52 96,64" \
        -draw "rectangle 98,52 103,64" \
        -draw "rectangle 105,52 110,64" \
        \
        $(# Frame 2 - Walk 1) \
        -draw "ellipse 160,42 18,22 0,360" \
        -draw "circle 160,22 15" \
        -draw "polygon 150,12 155,2 160,12" \
        -draw "polygon 160,12 165,2 170,12" \
        -draw "rectangle 148,52 153,62" \
        -draw "rectangle 155,54 160,64" \
        -draw "rectangle 162,52 167,62" \
        -draw "rectangle 169,54 174,64" \
        \
        $(# Frame 3 - Walk 2) \
        -draw "ellipse 224,42 18,22 0,360" \
        -draw "circle 224,22 15" \
        -draw "polygon 214,12 219,2 224,12" \
        -draw "polygon 224,12 229,2 234,12" \
        -draw "rectangle 212,54 217,64" \
        -draw "rectangle 219,52 224,62" \
        -draw "rectangle 226,54 231,64" \
        -draw "rectangle 233,52 238,62" \
        \
        $(# Frame 4 - Walk 3) \
        -draw "ellipse 288,42 18,22 0,360" \
        -draw "circle 288,22 15" \
        -draw "polygon 278,12 283,2 288,12" \
        -draw "polygon 288,12 293,2 298,12" \
        -draw "rectangle 276,52 281,62" \
        -draw "rectangle 283,54 288,64" \
        -draw "rectangle 290,52 295,62" \
        -draw "rectangle 297,54 302,64" \
        \
        $(# Frame 5 - Walk 4) \
        -draw "ellipse 352,42 18,22 0,360" \
        -draw "circle 352,22 15" \
        -draw "polygon 342,12 347,2 352,12" \
        -draw "polygon 352,12 357,2 362,12" \
        -draw "rectangle 340,54 345,64" \
        -draw "rectangle 347,52 352,62" \
        -draw "rectangle 354,54 359,64" \
        -draw "rectangle 361,52 366,62" \
        \
        $(# Frame 6 - Sleep 1) \
        -draw "ellipse 416,48 22,18 0,360" \
        -draw "arc 416,48 18,18 180,0" \
        \
        $(# Frame 7 - Sleep 2) \
        -draw "ellipse 480,48 22,18 0,360" \
        -draw "arc 480,48 18,18 180,0" \
        -strokewidth 2 -stroke white -fill none \
        -draw "path 'M 498,38 L 502,38 L 498,42 L 502,42'" \
        -strokewidth 0 -fill "$color" \
        \
        "$filename"
    
    # Add details (eyes, nose, patterns)
    convert "$filename" \
        -fill white \
        -draw "circle 27,22 2" \
        -draw "circle 37,22 2" \
        -draw "circle 91,20 2" \
        -draw "circle 101,20 2" \
        -draw "circle 155,22 2" \
        -draw "circle 165,22 2" \
        -draw "circle 219,22 2" \
        -draw "circle 229,22 2" \
        -draw "circle 283,22 2" \
        -draw "circle 293,22 2" \
        -draw "circle 347,22 2" \
        -draw "circle 357,22 2" \
        -fill black \
        -draw "circle 27,22 1" \
        -draw "circle 37,22 1" \
        -draw "circle 91,20 1" \
        -draw "circle 101,20 1" \
        -draw "circle 155,22 1" \
        -draw "circle 165,22 1" \
        -draw "circle 219,22 1" \
        -draw "circle 229,22 1" \
        -draw "circle 283,22 1" \
        -draw "circle 293,22 1" \
        -draw "circle 347,22 1" \
        -draw "circle 357,22 1" \
        -fill "#FFB6C1" \
        -draw "polygon 30,26 34,26 32,28" \
        -draw "polygon 94,24 98,24 96,26" \
        -draw "polygon 158,26 162,26 160,28" \
        -draw "polygon 222,26 226,26 224,28" \
        -draw "polygon 286,26 290,26 288,28" \
        -draw "polygon 350,26 354,26 352,28" \
        "$filename"
    
    # Add pattern if specified
    if [ "$pattern" = "stripes" ]; then
        convert "$filename" \
            -fill "${color}CC" \
            -draw "rectangle 28,35 36,50" \
            -draw "rectangle 92,35 100,50" \
            -draw "rectangle 156,35 164,50" \
            -draw "rectangle 220,35 228,50" \
            -draw "rectangle 284,35 292,50" \
            -draw "rectangle 348,35 356,50" \
            -draw "rectangle 412,40 424,56" \
            -draw "rectangle 476,40 488,56" \
            "$filename"
    elif [ "$pattern" = "spots" ]; then
        if [ "$name" = "oreo" ]; then
            # Special black and white pattern for Oreo
            convert "$filename" \
                -fill white \
                -draw "ellipse 32,35 8,12 0,360" \
                -draw "ellipse 96,33 8,12 0,360" \
                -draw "ellipse 160,35 8,12 0,360" \
                -draw "ellipse 224,35 8,12 0,360" \
                -draw "ellipse 288,35 8,12 0,360" \
                -draw "ellipse 352,35 8,12 0,360" \
                -draw "ellipse 416,41 10,10 0,360" \
                -draw "ellipse 480,41 10,10 0,360" \
                "$filename"
        elif [ "$name" = "patches" ]; then
            # Special red and white patches
            convert "$filename" \
                -fill white \
                -draw "ellipse 25,38 6,8 0,360" \
                -draw "ellipse 39,40 6,8 0,360" \
                -draw "ellipse 89,38 6,8 0,360" \
                -draw "ellipse 103,40 6,8 0,360" \
                -draw "ellipse 153,38 6,8 0,360" \
                -draw "ellipse 167,40 6,8 0,360" \
                -draw "ellipse 217,38 6,8 0,360" \
                -draw "ellipse 231,40 6,8 0,360" \
                -draw "ellipse 281,38 6,8 0,360" \
                -draw "ellipse 295,40 6,8 0,360" \
                -draw "ellipse 345,38 6,8 0,360" \
                -draw "ellipse 359,40 6,8 0,360" \
                "$filename"
        else
            # Regular spots pattern
            convert "$filename" \
                -fill "${color}CC" \
                -draw "circle 25,38 3" \
                -draw "circle 39,40 3" \
                -draw "circle 89,38 3" \
                -draw "circle 103,40 3" \
                -draw "circle 153,38 3" \
                -draw "circle 167,40 3" \
                -draw "circle 217,38 3" \
                -draw "circle 231,40 3" \
                -draw "circle 281,38 3" \
                -draw "circle 295,40 3" \
                -draw "circle 345,38 3" \
                -draw "circle 359,40 3" \
                "$filename"
        fi
    fi
}

# Generate all cat sprites based on the game data
echo "Generating Cat Life sprite assets..."

# All 20 cats with their exact colors and patterns
create_cat_sprite "whiskers" "#FF6B6B" "stripes"    # coral
create_cat_sprite "simba" "#FF9F1C" "stripes"       # orange  
create_cat_sprite "luna" "#9B59B6" "none"           # purple
create_cat_sprite "tigger" "#F39C12" "stripes"      # gold
create_cat_sprite "smokey" "#7F8C8D" "none"         # gray
create_cat_sprite "patches" "#E74C3C" "spots"       # red/white patches
create_cat_sprite "shadow" "#2C3E50" "none"         # dark gray
create_cat_sprite "oreo" "#000000" "spots"          # black/white
create_cat_sprite "mittens" "#ECF0F1" "none"        # white
create_cat_sprite "felix" "#34495E" "none"          # charcoal
create_cat_sprite "coco" "#8B4513" "none"           # brown
create_cat_sprite "pepper" "#5D6D7E" "stripes"      # blue-gray
create_cat_sprite "boots" "#D35400" "spots"         # burnt orange
create_cat_sprite "bella" "#F8BBD0" "none"          # pink
create_cat_sprite "milo" "#FFAB00" "stripes"        # amber
create_cat_sprite "nala" "#FDD835" "none"           # yellow
create_cat_sprite "oliver" "#43A047" "none"         # green
create_cat_sprite "roxy" "#E91E63" "stripes"        # hot pink
create_cat_sprite "chester" "#FF5722" "none"        # deep orange
create_cat_sprite "tink" "#FDD835" "spots"          # yellow - special cat

# Also create special sprites
echo "Creating additional game sprites..."

# Food bowl sprites
convert -size 64x64 xc:transparent \
    -fill "#8B6914" -draw "ellipse 32,35 28,15 0,360" \
    -fill "#654321" -draw "ellipse 32,32 24,12 0,360" \
    "assets/sprites/food_bowl_empty.png"

convert -size 64x64 xc:transparent \
    -fill "#8B6914" -draw "ellipse 32,35 28,15 0,360" \
    -fill "#654321" -draw "ellipse 32,32 24,12 0,360" \
    -fill "#8B4513" \
    -draw "circle 28,30 3" \
    -draw "circle 36,29 3" \
    -draw "circle 32,31 3" \
    -draw "circle 30,28 2" \
    -draw "circle 34,30 2" \
    "assets/sprites/food_bowl_full.png"

# Litter box sprites
convert -size 64x64 xc:transparent \
    -fill "#696969" -draw "roundRectangle 0,10 64,54 5,5" \
    -fill "#F5DEB3" -draw "rectangle 5,35 59,50" \
    "assets/sprites/litter_box_clean.png"

convert -size 64x64 xc:transparent \
    -fill "#696969" -draw "roundRectangle 0,10 64,54 5,5" \
    -fill "#F5DEB3" -draw "rectangle 5,35 59,50" \
    -fill "#8B451380" \
    -draw "circle 20,40 4" \
    -draw "circle 40,38 3" \
    -draw "circle 30,42 3" \
    "assets/sprites/litter_box_dirty.png"

# UI elements
convert -size 32x32 xc:transparent \
    -fill "#FF69B4" \
    -draw "path 'M 16,8 C 16,4 12,0 8,0 C 4,0 0,4 0,8 C 0,12 16,28 16,28 C 16,28 32,12 32,8 C 32,4 28,0 24,0 C 20,0 16,4 16,8 Z'" \
    "assets/sprites/icon_heart.png"

convert -size 32x32 xc:transparent \
    -fill "#FFD700" \
    -draw "polygon 16,0 20,12 32,12 22,20 26,32 16,24 6,32 10,20 0,12 12,12" \
    "assets/sprites/particle_star.png"

echo "Sprite generation complete!"
echo "Generated sprites in: assets/sprites/"
ls -la assets/sprites/