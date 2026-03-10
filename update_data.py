import csv
import json
import uuid
import os

def convert_csv_to_json(csv_file_path, json_file_path):
    # Ensure CSV file exists
    if not os.path.exists(csv_file_path):
        print(f"Error: Could not find the file '{csv_file_path}'. Please create it in the same directory.")
        return

    tickets = []
    success_count = 0
    
    print(f"Reading from {csv_file_path}...")
    
    try:
        with open(csv_file_path, mode='r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            
            # Print detected headers for debugging
            headers = [h.strip() for h in reader.fieldnames]
            print(f"Detected columns: {headers}")
            
            for row in reader:
                # Basic validation - check if the row is mostly empty
                if not any(row.values()):
                    continue
                    
                # Clean up keys and values
                clean_row = {k.strip() if k else '': v.strip() if v else '' for k, v in row.items()}
                
                try:
                    price = float(clean_row.get('Price', 40)) if clean_row.get('Price') else 40.0
                except ValueError:
                    price = 40.0 # Default fallback
                    
                ticket = {
                    'id': str(uuid.uuid4())[:8],  # Give each ticket a unique ID for the cart system
                    'lottery_name': clean_row.get('Lottery Name', 'Unknown Lottery'),
                    'ticket_number': clean_row.get('Ticket Number', 'N/A'),
                    'draw_date': clean_row.get('Draw Date', 'N/A'),
                    'draw_number': clean_row.get('Draw Number', '0000'),
                    'price': price
                }
                
                # Only add if it has essential info
                if ticket['lottery_name'] and ticket['ticket_number']:
                    tickets.append(ticket)
                    success_count += 1
        
        print(f"Writing {success_count} tickets to {json_file_path}...")
        
        with open(json_file_path, mode='w', encoding='utf-8') as file:
            json.dump(tickets, file, indent=4)
            
        print("\n✅ SUCCESS!")
        print(f"Converted {success_count} tickets.")
        print("You can now commit the updated data.json to GitHub.")
        
    except Exception as e:
        print(f"\n❌ Error occurred: {e}")
        print("Please check if your CSV format matches: Lottery Name,Ticket Number,Draw Date,Draw Number,Price")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, 'tickets.csv')
    json_path = os.path.join(current_dir, 'data.json')
    
    convert_csv_to_json(csv_path, json_path)
    
    # Keep console window open if run via double click on Windows
    input("\nPress Enter to exit...")
