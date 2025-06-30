from flask import Flask, render_template, request, send_file, jsonify
from werkzeug.utils import secure_filename
from stego import embed_lsbm, extract_lsbm
from PIL import Image
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# pastikan folder uploads ada
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/embed', methods=['POST'])
def embed():
    image_file = request.files.get('image')
    message = request.form.get('message')

    if not image_file or not message:
        return jsonify({'error': 'Gambar dan pesan wajib diisi'}), 400

    filename = secure_filename(image_file.filename)
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], f'stego_{filename}')

    image_file.save(input_path)

    # Log untuk debug embed
    print(f"[DEBUG] Embed input disimpan di: {input_path}")
    print(f"[DEBUG] Embed output akan disimpan di: {output_path}")

    embed_lsbm(input_path, message, output_path)

    # Cek apakah file embed benar-benar tersimpan
    if os.path.exists(output_path):
        print(f"[SUCCESS] File stego berhasil dibuat: {output_path}")
    else:
        print(f"[ERROR] File stego tidak ditemukan setelah embed!")

    return send_file(output_path, mimetype='image/png')

@app.route('/extract', methods=['POST'])
def extract():
    image_file = request.files.get('image')

    if not image_file:
        return jsonify({'error': 'Gambar wajib diunggah'}), 400

    filename = secure_filename(image_file.filename)
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image_file.save(path)

    # Log untuk debug extract
    print(f"[DEBUG] Extract: file disimpan di {path}")

    try:
        message = extract_lsbm(path)
        print(f"[SUCCESS] Pesan berhasil diekstrak: {message}")
        return jsonify({'message': message})
    except Exception as e:
        print(f"[ERROR] Gagal mengekstrak pesan: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
