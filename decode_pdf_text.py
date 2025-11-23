#!/usr/bin/env python3
import re
import zlib
import sys

def extract_and_decode_pdf(pdf_path):
    with open(pdf_path, 'rb') as f:
        pdf_data = f.read()
    
    # Find character mappings (beginbfchar sections)
    char_map = {}
    bfchar_pattern = rb'(\d+)\s+beginbfchar\s+(.*?)\s+endbfchar'
    for match in re.finditer(bfchar_pattern, pdf_data, re.DOTALL):
        content = match.group(2).decode('latin-1', errors='ignore')
        # Parse mappings like "0003 0020" (maps 0003 to Unicode 0020)
        mappings = re.findall(r'([0-9A-F]{4})\s+([0-9A-F]{4})', content)
        for src, dst in mappings:
            char_map[src] = chr(int(dst, 16))
    
    # Find character range mappings (beginbfrange sections)
    bfrange_pattern = rb'(\d+)\s+beginbfrange\s+(.*?)\s+endbfrange'
    for match in re.finditer(bfrange_pattern, pdf_data, re.DOTALL):
        content = match.group(2).decode('latin-1', errors='ignore')
        # Parse range mappings like "0175 0176 006D"
        ranges = re.findall(r'([0-9A-F]{4})\s+([0-9A-F]{4})\s+([0-9A-F]{4})', content)
        for start, end, dst in ranges:
            start_val = int(start, 16)
            end_val = int(end, 16)
            dst_val = int(dst, 16)
            for i in range(end_val - start_val + 1):
                char_map[f'{start_val + i:04X}'] = chr(dst_val + i)
    
    # Find text content (Tj commands)
    text_pattern = rb'\((.*?)\)\s*Tj'
    hex_text_pattern = rb'<([0-9A-F]+)>\s*Tj'
    
    decoded_text = []
    
    # Extract hex-encoded text
    for match in re.finditer(hex_text_pattern, pdf_data):
        hex_str = match.group(1).decode('ascii')
        # Split into 4-character chunks
        chars = [hex_str[i:i+4] for i in range(0, len(hex_str), 4)]
        text = ''.join([char_map.get(c, '') for c in chars])
        if text.strip():
            decoded_text.append(text)
    
    # Extract regular text
    for match in re.finditer(text_pattern, pdf_data):
        text = match.group(1).decode('latin-1', errors='ignore')
        if text.strip():
            decoded_text.append(text)
    
    return '\n'.join(decoded_text)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 decode_pdf_text.py <pdf_file>")
        sys.exit(1)
    
    text = extract_and_decode_pdf(sys.argv[1])
    print(text)
