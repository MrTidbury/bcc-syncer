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


class RallyBooking:
    def __init__(self, 
                 fullname: str,
                 phone_number: str,
                 mobile_number: str,
                 email: str,
                 membership_number: str,
                 center_name: str,
                 emergency_contact_name: str,
                 emergency_contact_number: str,
                 vehicle_reg: str,
                 outfit_type: str,
                 outfit_length: str,
                 party_adults: int,
                 party_teenagers: int,
                 party_children: int,
                 social_food_adults: int,
                 social_food_teenagers: int,
                 social_food_children: int,
                 social_no_food_adults: int,
                 social_no_food_teenagers: int,
                 social_no_food_children: int,
                 dietary_needs: str,
                 rally_plaque: str,
                 first_event: str,
                 anniversary_event: str,
                 twelfth_event: str,
                 is_disabled: str,
                 additional_notes: str,
                 arrival_date: str,
                 arrival_time: str,
                 length_of_stay: str):
        
        # Personal Information
        self.fullname = fullname
        self.phone_number = phone_number
        self.mobile_number = mobile_number
        self.email = email
        self.membership_number = membership_number
        self.center_name = center_name
        
        # Emergency Contact
        self.emergency_contact_name = emergency_contact_name
        self.emergency_contact_number = emergency_contact_number
        
        # Vehicle Information
        self.vehicle_reg = vehicle_reg
        self.outfit_type = outfit_type
        self.outfit_length = outfit_length
        
        # Party Size
        self.party_adults = party_adults
        self.party_teenagers = party_teenagers
        self.party_children = party_children
        
        # Social Event Attendance
        self.social_food_adults = social_food_adults
        self.social_food_teenagers = social_food_teenagers
        self.social_food_children = social_food_children
        self.social_no_food_adults = social_no_food_adults
        self.social_no_food_teenagers = social_no_food_teenagers
        self.social_no_food_children = social_no_food_children
        
        # Additional Information
        self.dietary_needs = dietary_needs
        self.rally_plaque = rally_plaque
        self.first_event = first_event
        self.anniversary_event = anniversary_event
        self.twelfth_event = twelfth_event
        self.is_disabled = is_disabled
        self.additional_notes = additional_notes
        
        # Arrival Information
        self.arrival_date = arrival_date
        self.arrival_time = arrival_time
        self.length_of_stay = length_of_stay
        self.booking_status = 'pending'

    @classmethod
    def from_form_data(cls, form_data: dict) -> 'RallyBooking':
        """Create a RallyBooking instance from form data."""
        return cls(
            fullname=form_data.get('fullname', ''),
            phone_number=form_data.get('phoneNumber', ''),
            mobile_number=form_data.get('mobileNumber', ''),
            email=form_data.get('email', ''),
            membership_number=form_data.get('membershipNumber', ''),
            center_name=form_data.get('centerName', ''),
            emergency_contact_name=form_data.get('emergencyContactName', ''),
            emergency_contact_number=form_data.get('emergencyContactNumber', ''),
            vehicle_reg=form_data.get('vehicleReg', ''),
            outfit_type=form_data.get('outfitType', ''),
            outfit_length=form_data.get('outfitLength', ''),
            party_adults=int(form_data.get('partyAdults', 0)),
            party_teenagers=int(form_data.get('partyTeenagers', 0)),
            party_children=int(form_data.get('partyChildren', 0)),
            social_food_adults=int(form_data.get('socialFoodAdults', 0)),
            social_food_teenagers=int(form_data.get('socialFoodTeenagers', 0)),
            social_food_children=int(form_data.get('socialFoodChildren', 0)),
            social_no_food_adults=int(form_data.get('socialNoFoodAdults', 0)),
            social_no_food_teenagers=int(form_data.get('socialNoFoodTeenagers', 0)),
            social_no_food_children=int(form_data.get('socialNoFoodChildren', 0)),
            dietary_needs=form_data.get('dietaryNeeds', ''),
            rally_plaque=form_data.get('rallyPlaque', ''),
            first_event=form_data.get('firstEvent', ''),
            anniversary_event=form_data.get('anniversaryEvent', ''),
            twelfth_event=form_data.get('twelfthEvent', ''),
            is_disabled=form_data.get('isDisabled', ''),
            additional_notes=form_data.get('additionalNotes', ''),
            arrival_date=form_data.get('arrivalDate', ''),
            arrival_time=form_data.get('arrivalTime', ''),
            length_of_stay=form_data.get('lengthOfStay', '')
        )

    def to_dict(self) -> dict:
        """Convert the booking to a dictionary format."""
        return {
            'fullname': self.fullname,
            'phoneNumber': self.phone_number,
            'mobileNumber': self.mobile_number,
            'email': self.email,
            'membershipNumber': self.membership_number,
            'centerName': self.center_name,
            'emergencyContactName': self.emergency_contact_name,
            'emergencyContactNumber': self.emergency_contact_number,
            'vehicleReg': self.vehicle_reg,
            'outfitType': self.outfit_type,
            'outfitLength': self.outfit_length,
            'partyAdults': self.party_adults,
            'partyTeenagers': self.party_teenagers,
            'partyChildren': self.party_children,
            'socialFoodAdults': self.social_food_adults,
            'socialFoodTeenagers': self.social_food_teenagers,
            'socialFoodChildren': self.social_food_children,
            'socialNoFoodAdults': self.social_no_food_adults,
            'socialNoFoodTeenagers': self.social_no_food_teenagers,
            'socialNoFoodChildren': self.social_no_food_children,
            'dietaryNeeds': self.dietary_needs,
            'rallyPlaque': self.rally_plaque,
            'firstEvent': self.first_event,
            'anniversaryEvent': self.anniversary_event,
            'twelfthEvent': self.twelfth_event,
            'isDisabled': self.is_disabled,
            'additionalNotes': self.additional_notes,
            'arrivalDate': self.arrival_date,
            'arrivalTime': self.arrival_time,
            'lengthOfStay': self.length_of_stay,
            'bookingStatus': self.booking_status
        }

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