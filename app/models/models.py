import datetime

class RallyOfficer():
    def __init__(self, name, email, phone):
        self.name = name
        self.email = email
        self.phone = phone

class RallySite():
    def __init__(self, name, address, post_code, w3w, facilities, van_limit, site_fee, description, directions):
        self.name = name
        self.address = address
        self.post_code = post_code
        self.w3w = w3w
        self.facilities = facilities
        self.van_limit = van_limit
        self.site_fee = site_fee
        self.description = description
        self.directions = directions

class Rally():
    def __init__(self, id, name, start_dt, end_dt, book_by, rallysite, rally_officers, admin_fee, rally_fee, plaque_type, whats_on, start_date, end_date, start_time, end_time):
        self.id = id
        self.name = name
        self.start_dt = start_dt
        self.end_dt = end_dt
        self.book_by = book_by
        self.rallysite = rallysite
        self.rally_officers = rally_officers
        self.admin_fee = admin_fee
        self.rally_fee = rally_fee
        self.plaque_type = plaque_type
        self.whats_on = whats_on
        self.start_dt = datetime.datetime.strptime(f"{start_date} {start_time}", "%d/%m/%Y %I:%M:%S %p")
        self.end_dt = datetime.datetime.strptime(f"{end_date} {end_time}", "%d/%m/%Y %I:%M:%S %p")
        self.s_day = self.start_dt.strftime("%d")
        self.s_month = self.start_dt.strftime("%b")
        self.s_year = self.start_dt.strftime("%Y")
        self.e_day = self.start_dt.strftime("%d")
        self.e_month = self.start_dt.strftime("%b")
        self.e_year = self.start_dt.strftime("%Y")
        self.nights = (self.end_dt - self.start_dt).days
        self.s_formatted = f"{self.ordinal(self.start_dt.day)} {self.start_dt.strftime('%B (%I %p)')}"
        self.e_formatted = f"{self.ordinal(self.end_dt.day)} {self.end_dt.strftime('%B (%I %p)')}"
        self.w3w_url = f"https://what3words.com/{self.rallysite.w3w}"
        self.short_desc = self.whats_on[:200] + (self.whats_on[200:] and '...')
        self.rally_officers_name = ", ".join([x.name for x in self.rally_officers])
    
    def ordinal(self, n):
        return f"{n}{'st' if n % 10 == 1 and n % 100 != 11 else 'nd' if n % 10 == 2 and n % 100 != 12 else 'rd' if n % 10 == 3 and n % 100 != 13 else 'th'}"

def convert_from_sheets(raw_sheet_data):

    # First, lets convert the Rally Officers...
    rally_officers = [RallyOfficer(x['Name'], x['Email'], x['Phone Number']) for x in raw_sheet_data['officers']]

    # Next, lets convert the Rally Sites...
    rally_sites = [RallySite(x['Name'], x['Address'], x['Postcode'], x['What 3 Words'], x['Facilities'], x['Van Limit'], x['Site Fee'], x['Description'], x['Directions']) for x in raw_sheet_data['locations']]

    # Finally, lets convert the Rallies...
    rallies = []
    for raw_rally in raw_sheet_data['rallies']:
        rally_officers = [x for x in rally_officers if x.name in raw_rally['Rally Officer(s)']]
        rally_site = [x for x in rally_sites if x.name == raw_rally['Rally Location']][0]
        rally = Rally(raw_rally['ID'], raw_rally['Name'], raw_rally['Start Date'], raw_rally['End Date'], raw_rally['Book By Date'], rally_site, rally_officers, raw_rally['Admin Fee'], raw_rally['Rally Fee'], raw_rally['Plaque Type'], raw_rally['Whats On'], raw_rally['Start Date'], raw_rally['End Date'], raw_rally['Start Time'], raw_rally['End Time'])
        rallies.append(rally)
    return rallies