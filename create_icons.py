#!/usr/bin/env python3
"""
Simple script to create placeholder icons for the extension.
Requires PIL/Pillow: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow is required. Install it with: pip install Pillow")
    exit(1)

import os

def create_icon(size, filename):
    """Create a simple icon with a shield emoji"""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw a shield shape
    # Calculate shield points
    width = size
    height = size
    center_x = width // 2
    center_y = height // 2
    
    # Draw shield background (purple gradient)
    shield_points = [
        (center_x, height * 0.1),  # Top point
        (width * 0.2, height * 0.2),  # Top left
        (width * 0.2, height * 0.6),  # Left middle
        (center_x, height * 0.9),  # Bottom point
        (width * 0.8, height * 0.6),  # Right middle
        (width * 0.8, height * 0.2),  # Top right
    ]
    
    # Fill shield
    draw.polygon(shield_points, fill=(102, 126, 234, 255))  # Purple
    
    # Draw border
    draw.polygon(shield_points, outline=(255, 255, 255, 255), width=max(1, size // 32))
    
    # Try to add text "AS" for Anti-Spoiler
    try:
        font_size = size // 2
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        try:
            font = ImageFont.load_default()
        except:
            font = None
    
    if font:
        text = "AS"
        # Get text bounding box
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Center text
        text_x = center_x - text_width // 2
        text_y = center_y - text_height // 2
        
        draw.text((text_x, text_y), text, fill=(255, 255, 255, 255), font=font)
    
    # Save icon
    os.makedirs('icons', exist_ok=True)
    img.save(f'icons/{filename}', 'PNG')
    print(f"Created {filename} ({size}x{size})")

if __name__ == '__main__':
    print("Creating extension icons...")
    create_icon(16, 'icon16.png')
    create_icon(48, 'icon48.png')
    create_icon(128, 'icon128.png')
    print("Done! Icons created in icons/ directory.")

