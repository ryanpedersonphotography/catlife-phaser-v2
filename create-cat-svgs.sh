#!/bin/bash

# Create assets directory
mkdir -p assets/sprites

echo "Generating Cat Life SVG sprites..."

# Function to create a cat SVG sprite sheet
create_cat_svg() {
    local name=$1
    local color=$2
    local filename="assets/sprites/cat_${name}.svg"
    
    echo "Creating SVG for $name (color: $color)"
    
    cat > "$filename" << EOF
<svg width="512" height="64" xmlns="http://www.w3.org/2000/svg">
  <!-- Frame 0: Idle 1 -->
  <g id="frame0">
    <ellipse cx="32" cy="42" rx="16" ry="20" fill="$color"/>
    <circle cx="32" cy="22" r="12" fill="$color"/>
    <polygon points="22,12 27,2 32,12" fill="$color"/>
    <polygon points="32,12 37,2 42,12" fill="$color"/>
    <rect x="20" y="52" width="5" height="12" fill="$color"/>
    <rect x="27" y="52" width="5" height="12" fill="$color"/>
    <rect x="34" y="52" width="5" height="12" fill="$color"/>
    <rect x="41" y="52" width="5" height="12" fill="$color"/>
    <circle cx="28" cy="20" r="2" fill="white"/>
    <circle cx="36" cy="20" r="2" fill="white"/>
    <circle cx="28" cy="20" r="1" fill="black"/>
    <circle cx="36" cy="20" r="1" fill="black"/>
    <polygon points="30,26 34,26 32,28" fill="#FFB6C1"/>
  </g>
  
  <!-- Frame 1: Idle 2 -->
  <g id="frame1">
    <ellipse cx="96" cy="42" rx="16" ry="20" fill="$color"/>
    <circle cx="96" cy="20" r="12" fill="$color"/>
    <polygon points="86,10 91,0 96,10" fill="$color"/>
    <polygon points="96,10 101,0 106,10" fill="$color"/>
    <rect x="84" y="52" width="5" height="12" fill="$color"/>
    <rect x="91" y="52" width="5" height="12" fill="$color"/>
    <rect x="98" y="52" width="5" height="12" fill="$color"/>
    <rect x="105" y="52" width="5" height="12" fill="$color"/>
    <circle cx="92" cy="18" r="2" fill="white"/>
    <circle cx="100" cy="18" r="2" fill="white"/>
    <circle cx="92" cy="18" r="1" fill="black"/>
    <circle cx="100" cy="18" r="1" fill="black"/>
    <polygon points="94,24 98,24 96,26" fill="#FFB6C1"/>
  </g>
  
  <!-- Frame 2-5: Walking -->
  <g id="frame2">
    <ellipse cx="160" cy="42" rx="16" ry="20" fill="$color"/>
    <circle cx="160" cy="22" r="12" fill="$color"/>
    <polygon points="150,12 155,2 160,12" fill="$color"/>
    <polygon points="160,12 165,2 170,12" fill="$color"/>
    <rect x="148" y="52" width="5" height="10" fill="$color"/>
    <rect x="155" y="54" width="5" height="10" fill="$color"/>
    <rect x="162" y="52" width="5" height="10" fill="$color"/>
    <rect x="169" y="54" width="5" height="10" fill="$color"/>
  </g>
  
  <g id="frame3">
    <ellipse cx="224" cy="42" rx="16" ry="20" fill="$color"/>
    <circle cx="224" cy="22" r="12" fill="$color"/>
    <rect x="212" y="54" width="5" height="10" fill="$color"/>
    <rect x="219" y="52" width="5" height="10" fill="$color"/>
    <rect x="226" y="54" width="5" height="10" fill="$color"/>
    <rect x="233" y="52" width="5" height="10" fill="$color"/>
  </g>
  
  <g id="frame4">
    <ellipse cx="288" cy="42" rx="16" ry="20" fill="$color"/>
    <circle cx="288" cy="22" r="12" fill="$color"/>
    <rect x="276" y="52" width="5" height="10" fill="$color"/>
    <rect x="283" y="54" width="5" height="10" fill="$color"/>
    <rect x="290" y="52" width="5" height="10" fill="$color"/>
    <rect x="297" y="54" width="5" height="10" fill="$color"/>
  </g>
  
  <g id="frame5">
    <ellipse cx="352" cy="42" rx="16" ry="20" fill="$color"/>
    <circle cx="352" cy="22" r="12" fill="$color"/>
    <rect x="340" y="54" width="5" height="10" fill="$color"/>
    <rect x="347" y="52" width="5" height="10" fill="$color"/>
    <rect x="354" y="54" width="5" height="10" fill="$color"/>
    <rect x="361" y="52" width="5" height="10" fill="$color"/>
  </g>
  
  <!-- Frame 6-7: Sleeping -->
  <g id="frame6">
    <ellipse cx="416" cy="48" rx="22" ry="16" fill="$color"/>
    <path d="M 394 48 Q 416 30 438 48" fill="$color"/>
  </g>
  
  <g id="frame7">
    <ellipse cx="480" cy="48" rx="22" ry="16" fill="$color"/>
    <path d="M 458 48 Q 480 30 502 48" fill="$color"/>
    <text x="498" y="38" font-family="Arial" font-size="12" fill="white">Z</text>
  </g>
</svg>
EOF
    
    # Convert SVG to PNG
    magick -background transparent "$filename" -resize 512x64 "assets/sprites/cat_${name}.png"
}

# Generate all cat sprites
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
    create_cat_svg "$name" "$color"
done

# Create additional game assets
echo "Creating UI elements..."

# Create a simple UI panel
cat > "assets/sprites/ui_panel.svg" << EOF
<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="300" height="400" rx="15" fill="#2d3748" opacity="0.9"/>
  <rect x="0" y="0" width="300" height="400" rx="15" fill="none" stroke="#667eea" stroke-width="2"/>
</svg>
EOF

# Convert UI panel to PNG
magick -background transparent "assets/sprites/ui_panel.svg" "assets/sprites/ui_panel.png"

echo "Asset generation complete!"
ls -la assets/sprites/*.png
# Create heart icon
cat > "assets/sprites/icon_heart.svg" << EOFSVG
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <path d="M 16,8 C 16,4 12,0 8,0 C 4,0 0,4 0,8 C 0,12 16,28 16,28 C 16,28 32,12 32,8 C 32,4 28,0 24,0 C 20,0 16,4 16,8 Z" fill="#FF69B4"/>
</svg>
EOFSVG

magick -background transparent "assets/sprites/icon_heart.svg" "assets/sprites/icon_heart.png"

# Create sparkle particle  
cat > "assets/sprites/particle_sparkle.svg" << EOFSVG
<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
  <rect x="7" y="0" width="2" height="16" fill="white"/>
  <rect x="0" y="7" width="16" height="2" fill="white"/>
  <rect x="3" y="3" width="10" height="10" fill="white" opacity="0.5"/>
</svg>
EOFSVG

magick -background transparent "assets/sprites/particle_sparkle.svg" "assets/sprites/particle_sparkle.png"

# Create heart particle
cat > "assets/sprites/particle_heart.svg" << EOFSVG
<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
  <path d="M 8,4 C 8,2 6,0 4,0 C 2,0 0,2 0,4 C 0,6 8,14 8,14 C 8,14 16,6 16,4 C 16,2 14,0 12,0 C 10,0 8,2 8,4 Z" fill="#FF69B4"/>
</svg>
EOFSVG

magick -background transparent "assets/sprites/particle_heart.svg" "assets/sprites/particle_heart.png"

echo "Additional sprites created\!"
