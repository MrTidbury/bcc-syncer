
import time
import json
from google.cloud import secretmanager
import gspread





class SheetsLoader:
    def __init__(self):
        self.worksheet_id = "1fC1AeFSGpMltq8c1SN0WaTki1Vpu6_77969ZS-h4LPo"
        self.last_loaded = None
        self.sheet_data = None
        self.gs = self.get_sheets_client()
        self.load_from_sheets()

    def get_sheets_client(self):
        client = secretmanager.SecretManagerServiceClient()
        secret_name = "projects/560029034966/secrets/bcc_google_json/versions/latest"
        response = client.access_secret_version(request={"name": secret_name})
        google_json = json.loads(response.payload.data.decode("UTF-8"))
        with open("/tmp/google.json", "w") as f:
            json.dump(google_json, f)
        gs = gspread.service_account(filename='/tmp/google.json')
        return gs

    def load_from_sheets(self):
        # Code to load data from sheets
        print("Caling Sheets API to load data")
        
        ss = self.gs.open_by_key(self.worksheet_id)
        rally_sheet = ss.worksheet("Rallies")
        rally_locations = ss.worksheet("Sites")
        rally_officers = ss.worksheet("Rally Officers")
        raw_rallies = rally_sheet.get_all_records()
        raw_locations = rally_locations.get_all_records()
        raw_officers = rally_officers.get_all_records()

        self.sheet_data = {
            "rallies": raw_rallies,
            "locations": raw_locations,
            "officers": raw_officers
        }

        self.last_loaded = time.time()
        # self.sheet_data = response.payload.data.decode("UTF-8")
        return self.sheet_data

    def get_sheet_data(self):
        if self.last_loaded is None or time.time() - self.last_loaded > 60:
            print("Cache expired, loading fresh data")
            return self.load_from_sheets()
        print("Cache is still valid, returning cached data")
        return self.sheet_data
