import sys
import json
from flask import Flask, render_template, jsonify, request, make_response, session
from flask_cors import CORS
from plugins.sheets_loader import SheetsLoader
from models.models import convert_from_sheets

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=[
    "https://nonagon-turquoise-kpp9.squarespace.com"
])

# Initialize SheetsLoader
sheet_helper = SheetsLoader()

# Add a secret key for session management
app.secret_key = 'your-secret-key-here'  # TODO: Move to environment variable

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
        raise e
        return render_template('error.html', error=e)

@app.route('/rallynext')
def rallynext():
    try:
        rallies = convert_from_sheets(sheet_helper.get_sheet_data())
        if len(rallies) > 3:
            rallies = rallies[:3]
        return render_template('rally_list.html', rallies=rallies, full_list=False)
    except Exception as e:
        print(e)
        return render_template('error.html', error=e)


@app.route('/events-list')
def iframe_list():
    return render_template('loading_list.html')

@app.route('/events-next')
def iframe_next():
    return render_template('loading_next.html')

@app.route('/book/<rally_id>')
def show_booking_form(rally_id):
    try:
        rallies = convert_from_sheets(sheet_helper.get_sheet_data())
        target_rally = [rally for rally in rallies if rally.id == rally_id]
        print(target_rally[0].nights)
        if not target_rally:
            return render_template('error.html', error="Rally not found")
        from_homepage = request.args.get('homepage', False)
        return render_template('booking_form.html', rally=target_rally[0], from_homepage=from_homepage)
    except Exception as e:
        print(e)
        return render_template('error.html', error=e)


@app.route('/xhr/<action>', methods=['GET','POST'])
def xhr(action):
    print(action, file=sys.stderr)
    if action == 'events':
        return jsonify({"message": "This is an example response"})
    elif action == "load_events":
        data = sheet_helper.get_sheet_data()
        return jsonify({"message": "Events loaded"})
    elif action == "set_cookies":
        form_data = request.get_json()
        cookie_value = json.dumps(form_data)
        response = make_response(jsonify({"status": "cookie set"}))
        response.set_cookie(
            key='bccFormData',
            value=cookie_value,
            max_age=60*60*24*365,  # 1 year
            path='/',
            secure=True,           # Required for SameSite=None
            samesite='None'        # Required for cross-site iframe
        )
        return response
    elif action == "get_cookies":
        cookie = request.cookies.get('bccFormData')
        if cookie:
            try:
                return jsonify({"bccFormData": json.loads(cookie)})
            except Exception:
                return jsonify({"error": "Invalid cookie format"}), 400
        return jsonify({"error": "No cookie found"}), 404


    return jsonify({"error": "Unknown action"}), 404

@app.route('/admin')
def admin():
    return app.send_static_file('admin/index.html')

@app.route('/admin/<path:path>')
def admin_assets(path):
    return app.send_static_file(f'admin/{path}')

@app.route('/api/admin/auth/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    # TODO: Add actual authentication logic
    # For now, just accept any email and return dummy data
    session['admin_user'] = {
        'email': email,
        'name': 'Jack Tidbury'  # TODO: Get actual name from database
    }
    
    return jsonify(session['admin_user'])

@app.route('/api/admin/auth/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_user', None)
    return jsonify({"message": "Logged out successfully"})

@app.route('/api/admin/auth/check')
def admin_check():
    user = session.get('admin_user')
    if not user:
        return jsonify({"error": "Not authenticated"}), 401
    return jsonify(user)

@app.route('/api/admin/bookings')
def admin_bookings():
    # TODO: Add actual authentication check
    # TODO: Add actual booking data
    return jsonify([
        {
            "id": "1",
            "fullname": "John Doe",
            "email": "john@example.com",
            "arrival_date": "2024-03-15",
            "party_adults": 2,
            "party_teenagers": 1,
            "party_children": 0,
            "rally_name": "Spring Rally 2024",
            "status": "pending"
        },
        {
            "id": "2",
            "fullname": "Jane Smith",
            "email": "jane@example.com",
            "arrival_date": "2024-03-16",
            "party_adults": 2,
            "party_teenagers": 0,
            "party_children": 2,
            "rally_name": "Spring Rally 2024",
            "status": "pending"
        }
    ])

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)

