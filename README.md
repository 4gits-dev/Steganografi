# 🧠 LSBM Steganography Web App

A simple Flask-based web application to embed and extract secret messages in images using the LSBM (Least Significant Bit Matching) algorithm.

## ✨ Features

- Embed secret messages inside images using LSBM
- Extract messages from stego images
- Intuitive web interface (HTML/CSS/JS)
- Fully Python-powered using Flask & Pillow

## 🛠 Built With

- Python
- Flask
- Pillow (image processing)
- HTML, CSS, JavaScript

## 🚀 Live Demo

Visit on Railway: [https://web-production-fb184.up.railway.app/](https://web-production-fb184.up.railway.app/)  

## 📁 Project Structure
```
Steganografi-LSBM/
├── app.py # Main Flask app
├── stego.py # Contains embed_lsbm & extract_lsbm functions
├── requirements.txt # Dependencies: Flask & Pillow
├── Procfile # Railway deployment command
├── templates/
│ └── index.html # HTML interface
├── static/
│ ├── style.css # Styling
│ └── script.js # Client-side logic
├── upload/ # Folder for uploaded & output images
└── README.md
```

## ⚙️ Deployment to Railway

1. Push project to GitHub
2. Go to [https://railway.app](https://railway.app)
3. Create new project
4. Add a `Procfile` if not detected
5. Wait for build & access your public URL 🎉

## 🧪 Local Development

```bash
git clone https://github.com/MFikriZaelani/Steganografi-LSBM.git
cd Steganografi-LSBM
pip install -r requirements.txt
python app.py
Then open: http://localhost:5000
```
## 📌 Notes
- Only PNG images are fully supported (JPG may cause decoding errors)
- Do not use lossy-compressed images for embedding
- Folder upload/ is auto-created for saving images

## 📃 License
Free to use for educational purposes.# Steganografi
