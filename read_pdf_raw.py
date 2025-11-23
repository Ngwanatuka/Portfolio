#!/usr/bin/env python3
import re
import zlib
import sys

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as f:
        pdf_data = f.read()
    
    # Find all stream objects
    pattern = rb'stream\s+(.*?)\s+endstream'
    streams = re.findall(pattern, pdf_data, re.DOTALL)
    
    text_content = []
    
    for stream in streams:
        try:
            # Try to decompress the stream
            decompressed = zlib.decompress(stream)
            # Look for text patterns
            text = decompressed.decode('latin-1', errors='ignore')
            # Extract readable text (simple heuristic)
            readable = re.findall(r'[A-Za-z0-9\s\.,;:\-\(\)@]+', text)
            text_content.extend([t.strip() for t in readable if len(t.strip()) > 3])
        except:
            pass
    
    return '\n'.join(text_content)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 read_pdf_raw.py <pdf_file>")
        sys.exit(1)
    
    text = extract_text_from_pdf(sys.argv[1])
    print(text)
