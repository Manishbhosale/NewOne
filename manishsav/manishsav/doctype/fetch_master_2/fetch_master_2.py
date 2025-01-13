# Copyright (c) 2024, THE MANISH and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
import requests
import frappe
from frappe import _

class FetchMaster2(Document):
	pass


@frappe.whitelist()
def create_order():
    """Create an order in SAP."""
    # Define SAP credentials and URL
    s_username = "manager"
    s_password = "Sap@1234"
    base_url = "https://172.16.10.5:50000/b1s/v1/"

    # Adjust credentials and URL based on company
    company_id = 36  # Adjust to your implementation
    print(company_id)
    if company_id == 31:
        s_username = "SAPB1\\M001"
        s_password = "Megal@!234"
        base_url = "https://vmsapb1hana02.centralindia.cloudapp.azure.com:50000/b1s/v1/"
        
    elif company_id == 36:
        
        s_username = '{ UserName: "SAPB1\\\\M001", CompanyDB: "MEGALO_TEST" }'
        s_password = 'Megal@!234'
        base_url = 'https://vmsapb1hana02.centralindia.cloudapp.azure.com:50000/b1s/v1/'

    print(base_url)
    # Construct the request URL
    url = f"{base_url}Orders"

    # Construct the JSON payload
    payload = {
        "DocDate": "2024-11-20T00:00:00.000Z",
        "DocDueDate": "2024-11-20T00:00:00.000Z",
        "RequriedDate": "2024-11-20T00:00:00.000Z",
        "CardCode": "CF0001",
        "CardName": "ABDUL HAKEEN S/O ALAVI",
        "Series": 351,
        "U_POSBatchNo": "CF0001F6861",
        "U_POSShedID": 2548,
        "U_POSFarmerEnqID": 686,
        "U_ShedNm": "w2",
        "U_Remark": "PR00000635",
        "U_BrnchCd": "T001",
        "U_BrnchNm": "Tindivanam, Settu",
        "U_FarmrCd": "CF0001",
        "U_FarmrNm": "ABDUL HAKEEN S/O ALAVI",
        "DocumentLines": [
            {
                "ItemCode": "CHBR00001",
                "ItemDescription": "DAY OLD CHICKS BROILER",
                "Quantity": 3400,
                "UnitPrice": 44,
                "RequiredDate": "2024-11-20T00:00:00.000Z",
                "TaxCode": ""
            }
        ]
    }

    # Make the API request
    try:
        response = requests.post(
            url,
            auth=(s_username, s_password),
            json=payload,  # Pass JSON payload here
            headers={"Content-Type": "application/json"},
            verify=False  # Bypass SSL verification
        )
        response.raise_for_status()  # Raise exception for HTTP errors

        # Return success response
        return {"message": "Order Sent to SAP successfully", "data": response.json()}

    except requests.exceptions.RequestException as e:
        # Log and throw error
        frappe.log_error(message=str(e), title=_("SAP Order Creation Error"))
        frappe.throw(_("Unable to create SAP order. Please check the logs for details."))
        

@frappe.whitelist()
def get_data(skip, update_date):
    """Fetch Business Partners from SAP."""
    print("Randchya Shreyas and Dhokebaaj manus")
    
    # Define SAP credentials and URL
    s_username = "manager"
    s_password = "Sap@1234"
    base_url = "https://172.16.10.5:50000/b1s/v1/"
    
    # Adjust credentials and URL based on company
    company_id = 35  # Adjust to your implementation
    if company_id == 31:
        s_username = "SAPB1\\M001"
        s_password = "Megal@!234"
        base_url = "https://vmsapb1hana02.centralindia.cloudapp.azure.com:50000/b1s/v1/"
    elif company_id == 35:
        # s_username = "SAPB1\\M001"
        # s_password = "Megal@!234"
        # base_url = "https://vmsapb1hana02.centralindia.cloudapp.azure.com:50000/b1s/v1/"
        
        s_username = '{ UserName: "manager", CompanyDB: "MEGALO" }'
        s_password = 'Sap@1234'
        baseURL = "http://172.16.10.5:50000/b1s/v1/"

    # Construct the request URL
    # url = f"{base_url}BusinessPartners?$skip={skip}&$filter=UpdateDate ge {update_date}"
    # url = f"{base_url}Invoices?$filter=DocEntry eq 108 or DocEntry eq 109"
    url = f"{base_url}Invoices(110)"
    print(url)

    # Make the API request
    try:
        response = requests.get(
            url,
            auth=(s_username, s_password),
            headers={"Content-Type": "application/json"},
            verify=False  # Bypass SSL verification
        )
        response.raise_for_status()  # Raise exception for HTTP errors
        return response.json()
    except requests.exceptions.RequestException as e:
        frappe.log_error(message=str(e), title=_("SAP Business Partners Fetch Error"))
        frappe.throw(_("Unable to fetch SAP Business Partners. Please check the logs for details."))

