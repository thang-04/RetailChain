import mysql.connector
import sys

def cleanup():
    config = {
        'user': 'root',
        'password': '123',
        'host': 'localhost',
        'database': 'retail_chain',
        'raise_on_warnings': True
    }

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        print("Connected to DB.")

        # 1. Get Bad Warehouse IDs
        cursor.execute("SELECT id FROM warehouses WHERE warehouse_type = 1 AND id != 1")
        bad_wh_rows = cursor.fetchall()
        bad_wh_ids = [str(row[0]) for row in bad_wh_rows]

        if not bad_wh_ids:
            print("No bad warehouses found to delete.")
            return

        bad_wh_str = ",".join(bad_wh_ids)
        print(f"Found {len(bad_wh_ids)} bad warehouses: {bad_wh_str}")

        # 2. Find Documents involving these warehouses
        # Source OR Target
        doc_query = f"""
            SELECT id FROM inventory_document 
            WHERE source_warehouse_id IN ({bad_wh_str}) 
               OR target_warehouse_id IN ({bad_wh_str})
        """
        cursor.execute(doc_query)
        doc_rows = cursor.fetchall()
        doc_ids = [str(row[0]) for row in doc_rows]
        
        if doc_ids:
            doc_str = ",".join(doc_ids)
            print(f"Found {len(doc_ids)} documents to clean up.")

            # 3. Delete History linked to these Documents
            print("Deleting Inventory History...")
            cursor.execute(f"DELETE FROM inventory_history WHERE document_id IN ({doc_str})")
            
            # 4. Delete Document Items linked to these Documents
            print("Deleting Inventory Document Items...")
            cursor.execute(f"DELETE FROM inventory_document_item WHERE document_id IN ({doc_str})")

            # 5. Delete Documents
            print("Deleting Inventory Documents...")
            cursor.execute(f"DELETE FROM inventory_document WHERE id IN ({doc_str})")
        else:
            print("No dependent documents found.")

        # 6. Delete Stocks in these warehouses (Already tried, but do again to be sure)
        print("Deleting Stocks...")
        cursor.execute(f"DELETE FROM inventory_stock WHERE warehouse_id IN ({bad_wh_str})")

        # 7. Delete Warehouses
        print("Deleting Warehouses...")
        cursor.execute(f"DELETE FROM warehouses WHERE id IN ({bad_wh_str})")

        conn.commit()
        print("✅ Cleanup Successful!")

    except mysql.connector.Error as err:
        print(f"❌ Error: {err}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    cleanup()
