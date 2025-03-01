import sys
from flask import Flask, render_template, jsonify
from plugins.sheets_loader import SheetsLoader
from models.models import convert_from_sheets

app = Flask(__name__)

# Initialize SheetsLoader
sheet_helper = SheetsLoader()

@app.after_request
def add_header(response):
    response.headers["X-Frame-Options"] = "ALLOWALL"
    return response

@app.route('/list-test')
def test_list():
    return render_template('test_list.html')

@app.route('/next-test')
def test_next():
    return render_template('test_next.html')

@app.route('/rallylist')
def rallylist():
    try:
        rallies = convert_from_sheets(sheet_helper.get_sheet_data())
        return render_template('rally_list.html', rallies=rallies, full_list=True)
    except Exception as e:
        return render_template('error.html', error=e)

@app.route('/rallynext')
def rallynext():
    try:
        rallies = convert_from_sheets(sheet_helper.get_sheet_data())
        if len(rallies) > 2:
            rallies = rallies[:2]
        return render_template('rally_list.html', rallies=rallies, full_list=False)
    except Exception as e:
        return render_template('error.html', error=e)


@app.route('/events-list')
def iframe_list():
    return render_template('loading_list.html')

@app.route('/events-next')
def iframe_next():
    return render_template('loading_next.html')


@app.route('/xhr/<action>')
def xhr(action):
    print(action, file=sys.stderr)
    if action == 'events':
        return jsonify({"message": "This is an example response"})
    elif action == "load_events":
        data = sheet_helper.get_sheet_data()
        return jsonify({"message": "Events loaded"})
    return jsonify({"error": "Unknown action"}), 404

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)

