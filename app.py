from flask import Flask, request, send_file, render_template
from rembg import remove
from PIL import Image
import io

app = Flask(__name__)

@app.route('/')
def index():
    """Serves the main HTML page."""
    return render_template('index.html')

@app.route('/remove-background', methods=['POST'])
def remove_background():
    """
    Receives an image, removes its background, and returns the processed image.
    """
    if 'image' not in request.files:
        return 'No image file provided', 400

    file = request.files['image']
    if file.filename == '':
        return 'No selected file', 400

    if file:
        try:
            input_image_bytes = file.read()
            output_image_bytes = remove(input_image_bytes)
            output_image = Image.open(io.BytesIO(output_image_bytes))

            img_byte_arr = io.BytesIO()
            output_image.save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)

            return send_file(
                img_byte_arr,
                mimetype='image/png',
                as_attachment=True,
                download_name='no_background.png'
            )

        except Exception as e:
            print(f"Error processing image: {e}")
            return f'Error processing image: {str(e)}', 500

if __name__ == '__main__':
    app.run(debug=True)