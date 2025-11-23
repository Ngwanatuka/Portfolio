#!/usr/bin/env python3
import sys

try:
    import PyPDF2
    with open(sys.argv[1], 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            print(page.extract_text())
except ImportError:
    # Try alternative method using pdfminer
    try:
        from pdfminer.high_level import extract_text
        text = extract_text(sys.argv[1])
        print(text)
    except ImportError:
        # Try pypdf
        try:
            import pypdf
            with open(sys.argv[1], 'rb') as file:
                reader = pypdf.PdfReader(file)
                for page in reader.pages:
                    print(page.extract_text())
        except ImportError:
            print("ERROR: No PDF library available. Please install PyPDF2, pdfminer, or pypdf")
            sys.exit(1)
