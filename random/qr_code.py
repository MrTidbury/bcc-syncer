import qrcode
from PIL import Image, ImageDraw, ImageFont
import cairosvg

# Function to create a QR code with customization options
def generate_qr_code(url, qr_color="black", bg_color="white", icon_color="blue", icon_name="fa-solid fa-star", corner_radius=0):
    # Create a basic QR code
    qr = qrcode.QRCode(
        version=1,  # Adjust version for different sizes
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    # Convert QR code to an image
    qr_img = qr.make_image(fill_color=qr_color, back_color=bg_color).convert("RGBA")

    # Apply corner radius if specified
    if corner_radius > 0:
        qr_img = apply_corner_radius(qr_img, corner_radius)
    
    # Overlay Font Awesome icon
    icon = generate_font_awesome_icon(icon_name, icon_color)
    if icon:
        qr_img = overlay_icon(qr_img, icon)
    
    # Save the QR code
    qr_img.save("custom_qr_code.png")
    print("QR code generated and saved as 'custom_qr_code.png'")

# Function to apply rounded corners to an image
def apply_corner_radius(img, radius):
    circle = Image.new('L', (radius * 2, radius * 2), 0)
    draw = ImageDraw.Draw(circle)
    draw.ellipse((0, 0, radius * 2, radius * 2), fill=255)
    alpha = Image.new('L', img.size, 255)
    
    w, h = img.size
    alpha.paste(circle.crop((0, 0, radius, radius)), (0, 0))
    alpha.paste(circle.crop((0, radius, radius, radius * 2)), (0, h - radius))
    alpha.paste(circle.crop((radius, 0, radius * 2, radius)), (w - radius, 0))
    alpha.paste(circle.crop((radius, radius, radius * 2, radius * 2)), (w - radius, h - radius))
    
    img.putalpha(alpha)
    return img

# Function to generate a Font Awesome icon as an image
def generate_font_awesome_icon(icon_name, icon_color):
    try:
        # Convert Font Awesome icon to SVG and then to PNG
        svg_template = f"""
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="{icon_color}">
            <text font-family="FontAwesome" font-size="90" x="10" y="90">{icon_name}</text>
        </svg>
        """
        cairosvg.svg2png(bytestring=svg_template, write_to="icon.png")
        icon = Image.open("icon.png").convert("RGBA")
        return icon
    except Exception as e:
        print(f"Failed to generate Font Awesome icon: {e}")
        return None

# Function to overlay an icon onto the center of the QR code
def overlay_icon(qr_img, icon):
    qr_width, qr_height = qr_img.size
    icon_width, icon_height = icon.size
    
    # Resize the icon if it's too large
    factor = 4
    icon = icon.resize((qr_width // factor, qr_height // factor), Image.ANTIALIAS)
    icon_width, icon_height = icon.size
    
    # Calculate position to overlay the icon
    pos = ((qr_width - icon_width) // 2, (qr_height - icon_height) // 2)
    
    qr_img.paste(icon, pos, icon)
    return qr_img

# Example usage
generate_qr_code(
    url="https://www.example.com",
    qr_color="black",
    bg_color="white",
    icon_color="red",
    icon_name="fa-caravan",
    corner_radius=20
)
