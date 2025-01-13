// Copyright (c) 2024, THE MANISH and contributors
// For license information, please see license.txt


// frappe.ui.form.on("Fetch Master 2", {

//     fetch_masters: function (frm) {
//         // Call the server-side method
//         frappe.call({
//             method: "manishsav.manishsav.doctype.fetch_master_2.fetch_master_2.get_data",
//             args: {
//                 skip: 0, // Starting index for data fetching
//                 update_date: "2023-01-01" // Replace with the appropriate date
//             },

//             callback: function (response) {
//                 if (response.message) {
//                     let invoice = response.message; // Assuming a single invoice is fetched
//                     let invoice2 = response.message.value;

//                     // Check if the response contains valid invoice data

//                     if (invoice && invoice.DocEntry) {
//                         // Save the header (Sales Invoice_Demo) data
//                         frappe.call({
//                             method: "frappe.client.insert",
//                             args: {
//                                 doc: {
//                                     doctype: "Sales Invoice_Demo",
//                                     doc_entry: invoice.DocEntry,
//                                     docnum: invoice.DocNum || "", // Add more fields as required
//                                     card_code: invoice.CardCode || "",
//                                     card_name: invoice.CardName || "",
//                                     document_details: [] // Initialize the child table data
//                                 }
//                             },
//                             callback: function (headerResponse) {
//                                 if (headerResponse.message) {
//                                     let parentName = headerResponse.message.name; // Fetch parent document's name (ID)

//                                     // Prepare the child table data
//                                     if (invoice.DocumentLines && Array.isArray(invoice.DocumentLines)) {
//                                         let childRows = invoice.DocumentLines.map(line => ({
//                                             doctype: "Document Lines",
//                                             parent: parentName,
//                                             parentfield: "document_details", // Ensure this matches your child table's fieldname
//                                             parenttype: "Sales Invoice_Demo",
//                                             line_num: line.LineNum || 0,
//                                             item_code: line.ItemCode || "",
//                                             item_name: line.ItemName || "",
//                                             quantity: line.Quantity || 0,
//                                             price: line.Price || 0,
//                                             rate: line.Rate || 0
//                                         }));

//                                         // Insert all child rows in one go
//                                         frappe.call({
//                                             method: "frappe.client.insert_many",
//                                             args: {
//                                                 docs: childRows
//                                             },
//                                             callback: function (childResponse) {
//                                                 frappe.msgprint(__('Sales Invoice and Document Lines have been saved successfully.'));
//                                                 console.log("Child Rows Saved Successfully:", childResponse.message);
//                                             },
//                                             error: function (error) {
//                                                 console.error("Error saving child data:", error);
//                                                 frappe.msgprint(__('Failed to save document lines.'));
//                                             }
//                                         });
//                                     }
//                                 }
//                             },
//                             error: function (error) {
//                                 console.error("Error saving Sales Invoice:", error);
//                                 frappe.msgprint(__('Failed to save Sales Invoice.'));
//                             }
//                         });
//                     }
//                     else {
//                         frappe.msgprint(__('Invalid response: No valid invoice found.'));                        
//                     }
//                 }
//             },
//             error: function (error) {
//                 frappe.msgprint(__('Failed to fetch data from SAP.'));
//                 console.error(error);
//             }



//         });

//     },

//     post_masters: function (frm) {
//         frappe.call({
//             method: "manishsav.manishsav.doctype.fetch_master_2.fetch_master_2.create_order",
//             callback: function (response) {
//                 if (response.message) {
//                     frappe.msgprint({
//                         title: __('Success'),
//                         message: __('Order sended successfully to SAP.'),
//                         indicator: 'green'
//                     });
//                     console.log(response.message.data); // Log the SAP response

//                     let invoice = response.message.data; // Assuming response is an array of invoices

//                     if ((invoice)) {
//                         // Iterate through the array of responses

//                         // Insert each invoice
//                         frappe.call({
//                             method: "frappe.client.insert",
//                             args: {
//                                 doc: {
//                                     doctype: "Post Invoices_2", // Target DocType
//                                     doc_entry: invoice.DocEntry || 0, // Set doc_entry field
//                                     doc_num: invoice.DocNum || 0,      // Set doc_num field
//                                     card_code: invoice.CardCode,
//                                     card_name: invoice.CardName,
//                                     journal_memo: invoice.JournalMemo
//                                 }
//                             },
//                             callback: function (insertResponse) {
//                                 if (insertResponse.message) {
//                                     console.log("Inserted Record:", insertResponse.message);
//                                 }
//                             },
//                             error: function (error) {
//                                 frappe.msgprint({
//                                     title: __('Error'),
//                                     message: __('Failed to insert Post Invoice record.'),
//                                     indicator: 'red'
//                                 });
//                                 console.error("Insert Error:", error);
//                             }
//                         });


//                         frappe.msgprint({
//                             title: __('Success'),
//                             message: __('All Post Invoice records have been inserted successfully!'),
//                             indicator: 'blue'
//                         });
//                     } else {
//                         frappe.msgprint(__('Invalid response format: Expected an array of invoices.'));
//                     }

//                 }
//             },
//             error: function (error) {
//                 frappe.msgprint({
//                     title: __('Error'),
//                     message: __('Failed to send the order in SAP.'),
//                     indicator: 'red'
//                 });
//                 console.error(error);
//             }
//         });

//     }

// });


frappe.ui.form.on("Fetch Master 2", {
    fetch_masters: function (frm) {
        // Call the server-side method
        frappe.call({
            method: "manishsav.manishsav.doctype.fetch_master_2.fetch_master_2.get_data",
            args: {
                skip: 0, // Starting index for data fetching
                update_date: "2023-01-01" // Replace with the appropriate date
            },
            callback: function (response) {
                if (response.message) {
                    let invoices;

                    // Check if multiple invoices are present
                    if (Array.isArray(response.message.value)) {
                        invoices = response.message.value; // Multiple invoices case
                    } else if (typeof response.message === "object" && response.message.DocEntry) {
                        invoices = [response.message]; // Single invoice case, wrap it in an array
                    } else {
                        frappe.msgprint(__('Invalid response: No valid invoice found.'));
                        return; // Exit if no valid invoice data is found
                    }

                    // Process the invoices (array of invoices)
                    invoices.forEach(invoice => {
                        saveInvoice(invoice); // Save each invoice
                    });

                    frappe.msgprint(__('Invoices have been successfully processed.'));
                } else {
                    frappe.msgprint(__('No response message received.'));
                }
            },
            error: function (error) {
                frappe.msgprint(__('Failed to fetch data from SAP.'));
                console.error(error);
            }
        });

        // Helper function to save invoice data
        function saveInvoice(invoice) {
            frappe.call({
                method: "frappe.client.insert",
                args: {
                    doc: {
                        doctype: "Sales Invoice_Demo",
                        doc_entry: invoice.DocEntry || 0,
                        docnum: invoice.DocNum || "", // Add more fields as required
                        card_code: invoice.CardCode || "",
                        card_name: invoice.CardName || "",
                        document_details: [] // Initialize the child table
                    }
                },
                callback: function (headerResponse) {
                    if (headerResponse.message) {
                        let parentName = headerResponse.message.name; // Get the parent document's name

                        // If DocumentLines exist, process them
                        if (invoice.DocumentLines && Array.isArray(invoice.DocumentLines)) {
                            let childRows = invoice.DocumentLines.map(line => ({
                                doctype: "Document Lines",
                                parent: parentName,
                                parentfield: "document_details",
                                parenttype: "Sales Invoice_Demo",
                                line_num: line.LineNum || 0,
                                item_code: line.ItemCode || "",
                                item_name: line.ItemName || "",
                                quantity: line.Quantity || 0,
                                price: line.Price || 0,
                                rate: line.Rate || 0
                            }));

                            // Insert child rows
                            frappe.call({
                                method: "frappe.client.insert_many",
                                args: { docs: childRows },
                                callback: function (childResponse) {
                                    console.log("Child Rows Saved Successfully:", childResponse.message);
                                },
                                error: function (error) {
                                    console.error("Error saving child data:", error);
                                    frappe.msgprint(__('Failed to save document lines.'));
                                }
                            });
                        }
                    }
                },
                error: function (error) {
                    console.error("Error saving Sales Invoice:", error);
                    frappe.msgprint(__('Failed to save Sales Invoice.'));
                }
            });
        }
    }
});



