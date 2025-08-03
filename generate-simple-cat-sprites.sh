#!/bin/bash

# Create assets directory
mkdir -p assets/sprites

# Function to create a simple cat sprite sheet
create_cat_sprite() {
    local name=$1
    local color=$2
    local pattern=$3
    local filename="assets/sprites/cat_${name}.png"
    
    echo "Generating sprite for $name (color: $color)"
    
    # Create a basic 512x64 sprite sheet (8 frames of 64x64) with simple cat shapes
    convert -size 512x64 xc:transparent \
        -fill "$color" \
        -draw "ellipse 32,42 16,20 0,360" \
        -draw "circle 32,26 12" \
        -draw "polygon 22,16 27,8 32,16" \
        -draw "polygon 32,16 37,8 42,16" \
        -draw "rectangle 22,54 26,64" \
        -draw "rectangle 28,54 32,64" \
        -draw "rectangle 34,54 38,64" \
        -draw "rectangle 40,54 44,64" \
        -draw "ellipse 96,42 16,20 0,360" \
        -draw "circle 96,26 12" \
        -draw "polygon 86,16 91,8 96,16" \
        -draw "polygon 96,16 101,8 106,16" \
        -draw "rectangle 86,54 90,64" \
        -draw "rectangle 92,54 96,64" \
        -draw "rectangle 98,54 102,64" \
        -draw "rectangle 104,54 108,64" \
        -draw "ellipse 160,42 16,20 0,360" \
        -draw "circle 160,26 12" \
        -draw "polygon 150,16 155,8 160,16" \
        -draw "polygon 160,16 165,8 170,16" \
        -draw "rectangle 150,54 154,64" \
        -draw "rectangle 156,54 160,64" \
        -draw "rectangle 162,54 166,64" \
        -draw "rectangle 168,54 172,64" \
        -draw "ellipse 224,42 16,20 0,360" \
        -draw "circle 224,26 12" \
        -draw "polygon 214,16 219,8 224,16" \
        -draw "polygon 224,16 229,8 234,16" \
        -draw "rectangle 214,54 218,64" \
        -draw "rectangle 220,54 224,64" \
        -draw "rectangle 226,54 230,64" \
        -draw "rectangle 232,54 236,64" \
        -draw "ellipse 288,42 16,20 0,360" \
        -draw "circle 288,26 12" \
        -draw "polygon 278,16 283,8 288,16" \
        -draw "polygon 288,16 293,8 298,16" \
        -draw "rectangle 278,54 282,64" \
        -draw "rectangle 284,54 288,64" \
        -draw "rectangle 290,54 294,64" \
        -draw "rectangle 296,54 300,64" \
        -draw "ellipse 352,42 16,20 0,360" \
        -draw "circle 352,26 12" \
        -draw "polygon 342,16 347,8 352,16" \
        -draw "polygon 352,16 357,8 362,16" \
        -draw "rectangle 342,54 346,64" \
        -draw "rectangle 348,54 352,64" \
        -draw "rectangle 354,54 358,64" \
        -draw "rectangle 360,54 364,64" \
        -draw "ellipse 416,48 20,16 0,360" \
        -draw "ellipse 480,48 20,16 0,360" \
        "$filename"
    
    # Add eyes and nose to all frames
    convert "$filename" \
        -fill white \
        -draw "circle 27,26 2" \
        -draw "circle 37,26 2" \
        -draw "circle 91,26 2" \
        -draw "circle 101,26 2" \
        -draw "circle 155,26 2" \
        -draw "circle 165,26 2" \
        -draw "circle 219,26 2" \
        -draw "circle 229,26 2" \
        -draw "circle 283,26 2" \
        -draw "circle 293,26 2" \
        -draw "circle 347,26 2" \
        -draw "circle 357,26 2" \
        -fill black \
        -draw "circle 27,26 1" \
        -draw "circle 37,26 1" \
        -draw "circle 91,26 1" \
        -draw "circle 101,26 1" \
        -draw "circle 155,26 1" \
        -draw "circle 165,26 1" \
        -draw "circle 219,26 1" \
        -draw "circle 229,26 1" \
        -draw "circle 283,26 1" \
        -draw "circle 293,26 1" \
        -draw "circle 347,26 1" \
        -draw "circle 357,26 1" \
        -fill "#FFB6C1" \
        -draw "polygon 30,30 34,30 32,32" \
        -draw "polygon 94,30 98,30 96,32" \
        -draw "polygon 158,30 162,30 160,32" \
        -draw "polygon 222,30 226,30 224,32" \
        -draw "polygon 286,30 290,30 288,32" \
        -draw "polygon 350,30 354,30 352,32" \
        "$filename"
    
    # Add patterns
    if [ "$pattern" = "stripes" ]; then
        convert "$filename" \
            -fill "${color}CC" \
            -draw "rectangle 26,36 38,46" \
            -draw "rectangle 90,36 102,46" \
            -draw "rectangle 154,36 166,46" \
            -draw "rectangle 218,36 230,46" \
            -draw "rectangle 282,36 294,46" \
            -draw "rectangle 346,36 358,46" \
            -draw "rectangle 406,42 426,52" \
            -draw "rectangle 470,42 490,52" \
            "$filename"
    elif [ "$pattern" = "spots" ]; then
        if [ "$name" = "oreo" ]; then
            convert "$filename" \
                -fill white \
                -draw "ellipse 32,38 6,8 0,360" \
                -draw "ellipse 96,38 6,8 0,360" \
                -draw "ellipse 160,38 6,8 0,360" \
                -draw "ellipse 224,38 6,8 0,360" \
                -draw "ellipse 288,38 6,8 0,360" \
                -draw "ellipse 352,38 6,8 0,360" \
                -draw "ellipse 416,45 8,6 0,360" \
                -draw "ellipse 480,45 8,6 0,360" \
                "$filename"
        elif [ "$name" = "patches" ]; then
            convert "$filename" \
                -fill white \
                -draw "ellipse 28,38 4,6 0,360" \
                -draw "ellipse 36,40 4,6 0,360" \
                -draw "ellipse 92,38 4,6 0,360" \
                -draw "ellipse 100,40 4,6 0,360" \
                -draw "ellipse 156,38 4,6 0,360" \
                -draw "ellipse 164,40 4,6 0,360" \
                -draw "ellipse 220,38 4,6 0,360" \
                -draw "ellipse 228,40 4,6 0,360" \
                -draw "ellipse 284,38 4,6 0,360" \
                -draw "ellipse 292,40 4,6 0,360" \
                -draw "ellipse 348,38 4,6 0,360" \
                -draw "ellipse 356,40 4,6 0,360" \
                "$filename"
        else
            convert "$filename" \
                -fill "${color}CC" \
                -draw "circle 28,38 2" \
                -draw "circle 36,40 2" \
                -draw "circle 92,38 2" \
                -draw "circle 100,40 2" \
                -draw "circle 156,38 2" \
                -draw "circle 164,40 2" \
                -draw "circle 220,38 2" \
                -draw "circle 228,40 2" \
                -draw "circle 284,38 2" \
                -draw "circle 292,40 2" \
                -draw "circle 348,38 2" \
                -draw "circle 356,40 2" \
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

echo "Sprite generation complete!"
echo "Generated sprites in: assets/sprites/"
ls -la assets/sprites/cat_*.png