import os
from flask import Flask, request, render_template, jsonify,  redirect, send_from_directory
from flask_compress import Compress
from flask_cors import CORS # pip install flask-cors

import mimetypes
from model import Agent

app = Flask(__name__)
CORS(app)
app.secret_key = "geheimniszahl"
Compress(app) # Damit modul pdfjs funktioniert
mimetypes.add_type('application/javascript', '.mjs')
app.jinja_env.filters['zip'] = zip

dir_pdf = 'pdf' # der Ordner für PDF Dateien
os.makedirs(os.path.join(os.path.dirname(__file__), dir_pdf), exist_ok=True)
agent1=Agent(dir1=dir_pdf)

# host UI from react
dist_folder = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
@app.route("/",defaults={"filename":""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(dist_folder,filename)

@app.route('/upload', methods=['POST'])
def upload():
    """pdf Dateien im vorgegebene Ordner einfügen für später zusammenzufassen"""
    if 'file' not in request.files:
        return redirect(request.url)
    files = request.files.getlist('file')
    lst_filename=[]
    for file in files:
        if file.filename == '':
            continue
        file.save(os.path.join(dir_pdf, file.filename))
        lst_filename.append(file.filename)
    # if cannot be saved, it should save temp files here
    return jsonify({'lst_filename':lst_filename})

@app.route('/delete_pdf', methods=['POST'])
def delete_pdf():
    """Inhalt vom pdf Ordner löschen"""
    folder = dir_pdf
    # reset qa
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')
    return jsonify({'lst_filename':[]})
    # return redirect(url_for('index'))

@app.route("/add_api", methods=["post"])
def add_api():
    """API key einfügen"""
    api=request.json.get('apiKey')
    if agent1.valid_api(api):
        agent1.init_llama(True, api)
        return jsonify({'ok':True, 'warning':'API key erfolgreich eingefügt'})
    else:
        return jsonify({'ok':False, 'warning':'API key ist falsch'})
    # return jsonify({'api':api+'_tested'})
    
@app.route('/frag', methods=['POST'])
def frag():
    if not agent1.inited:
        agent1.init_llama(False)
    # if files cannot be saved, it embed function should be changed to take files as parameter
    if not agent1.embeded:
        agent1.embed()
        
    question=request.json.get('question')
    # return jsonify({'answer': 'answer of the question: '+question})
    response=agent1.qa(question)
    answer=str(response)
    if response is not None:
        node=response.source_nodes[0]
        print('filename', node.metadata['file_name'], 'pagenr',int(node.metadata['page_label']), 'text',node.text)
        return jsonify({
            'answer':answer,
            'ok':True, 
            'filename':node.metadata['file_name'],
            'pagenr':int(node.metadata['page_label']),
            'text':node.text})
    return jsonify({"answer": answer})

# PDF_FOLDER = os.path.join(os.getcwd(), dir_pdf)
# @app.route('/pdf/<filename>')
# def serve_pdf(filename):
#     """pdf hosten, sonst kann pdfjs das pdf nicht erkennen"""
#     return send_from_directory(PDF_FOLDER, filename, mimetype='application/javascript')

if __name__ == "__main__":
    app.run(debug=True)  # host="127.0.0.6", port=6666,

# file system, use temp_file instead of saving pdf
# pdf highlight