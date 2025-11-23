#!/usr/bin/env python3
import re
import sys

def decode_pdf_content(pdf_path):
    with open(pdf_path, 'rb') as f:
        content = f.read().decode('latin-1', errors='ignore')
    
    # Extract character mappings
    char_map = {}
    
    # Find beginbfchar sections
    bfchar_matches = re.findall(r'beginbfchar\s+(.*?)\s+endbfchar', content, re.DOTALL)
    for section in bfchar_matches:
        # Extract pairs like "0003 0020"
        pairs = re.findall(r'([0-9A-F]{4})\s+([0-9A-F]{4})', section)
        for src, dst in pairs:
            char_map[src] = chr(int(dst, 16))
    
    # Find beginbfrange sections
    bfrange_matches = re.findall(r'beginbfrange\s+(.*?)\s+endbfrange', content, re.DOTALL)
    for section in bfrange_matches:
        ranges = re.findall(r'([0-9A-F]{4})\s+([0-9A-F]{4})\s+([0-9A-F]{4})', section)
        for start, end, dst in ranges:
            start_val = int(start, 16)
            end_val = int(end, 16)
            dst_val = int(dst, 16)
            for i in range(end_val - start_val + 1):
                char_map[f'{start_val + i:04X}'] = chr(dst_val + i)
    
    print("Character map size:", len(char_map))
    print("Sample mappings:", list(char_map.items())[:10])
    
    # Find hex text strings
    hex_texts = re.findall(r'<([0-9A-F]+)>\s*Tj', content)
    
    decoded_lines = []
    for hex_text in hex_texts:
        # Split into 4-char chunks
        chunks = [hex_text[i:i+4] for i in range(0, len(hex_text), 4)]
        decoded = ''.join([char_map.get(chunk, '?') for chunk in chunks])
        if decoded.strip() and decoded.strip() != '?':
            decoded_lines.append(decoded)
    
    return '\n'.join(decoded_lines)

if __name__ == '__main__':
    text = decode_pdf_content(sys.argv[1])
    print("\n=== DECODED TEXT ===\n")
    print(text)
