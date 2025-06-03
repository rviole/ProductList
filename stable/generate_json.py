import sqlite3
import json
import argparse
import sys


with open('discount_ids.txt', 'r') as file:
    discount_ids = file.read().strip().split("\n")
    discount_ids = [int(chars) for chars in discount_ids if len(chars.strip())]
    
print("Discount will apply on products with ids", discount_ids)


def fetch_inventory(db_path):
    """
    Fetches all inventory items from the SQLite database.
    Uses 'inventory' table and groups by 'category'.
    """
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    query = f'''
    SELECT id,
           category,
           name,
           description,
           unit,
           sell_price,
           min_sell_price,
           quantity,
           image
    FROM inventory
    WHERE show_on_website
    ORDER BY category
    
    '''

    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()
    return rows


def group_by_category(rows):
    """
    Groups rows by category into a JSON-friendly structure.
    """
    result = {"sections": []}
    section_map = {}

    for inventory_id, category, name, description, unit, sell_price, min_sell_price, quantity, image in rows:
        product = {
            "name": name,
            "description": description,
            "unit": unit,
            "sell_price": sell_price,
            "discount_price": sell_price,
            "quantity": quantity,
            "image": image or ""
        }

        if category not in section_map:
            section_map[category] = {
                "name": category,
                "products": []
            }
            result["sections"].append(section_map[category])

        section_map[category]["products"].append(product)

    return result


def main():
    parser = argparse.ArgumentParser(description="Generate grouped JSON from inventory DB.")
    parser.add_argument("-db", help="Path to SQLite database file", default="../final/instance/database.db")
    parser.add_argument("-o", "--output", default="products.json", help="Output JSON file")
    args = parser.parse_args()

    rows = fetch_inventory(args.db)
    grouped = group_by_category(rows)

    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(grouped, f, indent=2, ensure_ascii=False)

    print(f"JSON written to {args.output}")

if __name__ == '__main__':
    main()