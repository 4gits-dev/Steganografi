from PIL import Image
import base64

def embed_lsbm(image_path, message, output_path):
    img = Image.open(image_path).convert('RGB')
    pixels = img.load()
    w, h = img.size

    # Encode pesan → base64 → ASCII → binari
    encoded = base64.b64encode(message.encode('utf-8')).decode('ascii')
    binary = ''.join(format(ord(c), '08b') for c in encoded)
    
    # Tambahkan panjang pesan di awal (16 bit, cukup untuk pesan base64 s.d 65535 karakter)
    length_bin = format(len(binary), '016b')
    data = length_bin + binary
    if len(data) > w * h:
        raise ValueError("Pesan terlalu besar untuk gambar ini")

    idx = 0
    for y in range(h):
        for x in range(w):
            if idx >= len(data):
                img.save(output_path)
                print(f"[DEBUG] Embed selesai. Total bit tertanam: {idx}")
                return
            r, g, b = pixels[x, y]
            bit = int(data[idx])
            if (r & 1) != bit:
                r ^= 1
            pixels[x, y] = (r, g, b)
            idx += 1
    img.save(output_path)
    print(f"[DEBUG] Embed selesai. Total bit tertanam: {idx}")

def extract_lsbm(image_path):
    img = Image.open(image_path).convert('RGB')
    pixels = img.load()
    w, h = img.size

    bits = ''
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            bits += str(r & 1)

    # Ambil panjang pesan (16 bit pertama)
    length_bin = bits[:16]
    length = int(length_bin, 2)
    print(f"[DEBUG] Length encoded message: {length} bits")

    # Ambil data pesan
    data_bits = bits[16:16+length]
    chars = [chr(int(data_bits[i:i+8], 2)) for i in range(0, len(data_bits), 8)]
    encoded = ''.join(chars)

    try:
        decoded = base64.b64decode(encoded).decode('utf-8')
        print(f"[SUCCESS] Pesan berhasil diekstrak: {decoded}")
        return decoded
    except Exception as e:
        err = f"[ERROR] Failed to decode message: {e}"
        print(err)
        return err
