import struct, zlib, os, sys

def crop_bottom(path, crop_px):
    with open(path, 'rb') as f:
        data = f.read()
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError('Not a PNG file')
    pos = 8
    chunks = []
    while pos < len(data):
        length = struct.unpack('>I', data[pos:pos+4])[0]
        ctype = data[pos+4:pos+8]
        chunk_data = data[pos+8:pos+8+length]
        crc = data[pos+8+length:pos+12+length]
        chunks.append([ctype, chunk_data])
        pos += 12 + length
        if ctype == b'IEND':
            break
    ihdr = chunks[0][1]
    width, height, bit_depth, color_type, compression, filter_method, interlace = struct.unpack('>IIBBBBB', ihdr)
    bytes_per_pixel = 4  # Assuming RGBA 8-bit
    row_bytes = width * bytes_per_pixel + 1
    idat_data = b''.join(chunk[1] for chunk in chunks if chunk[0] == b'IDAT')
    raw = zlib.decompress(idat_data)
    if len(raw) != row_bytes * height:
        raise ValueError('Unexpected raw size')
    new_height = height - crop_px
    new_raw = raw[:row_bytes * new_height]
    new_idat = zlib.compress(new_raw)
    # Rebuild PNG
    out = bytearray()
    out.extend(b'\x89PNG\r\n\x1a\n')
    new_ihdr = struct.pack('>IIBBBBB', width, new_height, bit_depth, color_type, compression, filter_method, interlace)
    out.extend(struct.pack('>I', len(new_ihdr)))
    out.extend(b'IHDR')
    out.extend(new_ihdr)
    out.extend(struct.pack('>I', zlib.crc32(b'IHDR' + new_ihdr) & 0xffffffff))
    out.extend(struct.pack('>I', len(new_idat)))
    out.extend(b'IDAT')
    out.extend(new_idat)
    out.extend(struct.pack('>I', zlib.crc32(b'IDAT' + new_idat) & 0xffffffff))
    out.extend(struct.pack('>I', 0))
    out.extend(b'IEND')
    out.extend(struct.pack('>I', zlib.crc32(b'IEND') & 0xffffffff))
    with open(path, 'wb') as f:
        f.write(out)

if __name__ == '__main__':
    files = sys.argv[1:]
    for fpath in files:
        crop_bottom(fpath, 32)
        print('Cropped', fpath)