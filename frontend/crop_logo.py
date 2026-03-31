from PIL import Image

def master_transparency_crop(path):
    print(f"Executing Master Transparency Crop on {path}...")
    img = Image.open(path).convert("RGBA")
    
    # 1. Get the background color from the top-left corner
    bg_color = img.getpixel((0, 0))
    print(f"Detected background color: {bg_color}")
    
    # 2. Convert ALL pixels matching this color (with tolerance) to transparent
    data = img.getdata()
    newData = []
    tolerance = 30 # Catch near-match whites/grays
    
    for item in data:
        # Check if the pixel is close to the background color
        is_bg = True
        for i in range(3): # Check R, G, B channels
            if abs(item[i] - bg_color[i]) > tolerance:
                is_bg = False
                break
        
        if is_bg:
            # Make it transparent
            newData.append((item[0], item[1], item[2], 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # 3. Tight crop to the actual content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        img.save(path, "PNG")
        print(f"SUCCESS: Logo is now transparent and tightly cropped to {img.size}")
    else:
        print("ERROR: Image appears to be solid background. No content found.")

if __name__ == "__main__":
    master_transparency_crop("public/logo.png")
