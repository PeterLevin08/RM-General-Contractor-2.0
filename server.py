"""Static file server with correct MIME types for Decap CMS."""
import http.server
import os
import socketserver

PORT = int(os.environ.get('PORT', 5000))

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.yml':  'text/yaml',
        '.yaml': 'text/yaml',
        '.json': 'application/json',
        '.js':   'application/javascript',
        '.css':  'text/css',
        '.html': 'text/html',
        '.svg':  'image/svg+xml',
        '.webp': 'image/webp',
        '':      'application/octet-stream',
    }

    def log_message(self, format, *args):
        print(format % args)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('0.0.0.0', PORT), Handler) as httpd:
    print(f'Serving on port {PORT}')
    httpd.serve_forever()
