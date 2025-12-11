# Warehouse Management System - Error Codes & Response Messages

## Overview
This document provides comprehensive error codes and response messages for the Warehouse Management System, covering Fabric Warehouse, Accessory Warehouse, and Packaging Warehouse modules.

---

## 1. FABRIC WAREHOUSE - Error Codes & Messages

### 1.1 Inbound & Receiving (Packing List Management)

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| FW-IN-001 | Packing list not found | User attempts to view/edit a non-existent packing list | The requested packing list ID does not exist in the system |
| FW-IN-002 | Invalid invoice number format | User enters incorrect invoice number during import | The invoice number doesn't match the required format (e.g., A2507403) |
| FW-IN-003 | Duplicate roll number detected | User imports packing list with existing roll number | A fabric roll with the same roll number already exists in the system |
| FW-IN-004 | Packing list already printed | User attempts to edit/delete a printed packing list | Cannot modify packing list that has been printed |
| FW-IN-005 | No items selected for printing | User clicks "Print Selected" without selecting items | At least one item must be selected before printing |
| FW-IN-006 | Import file format invalid | User uploads incorrect file type for packing list | Only Excel (.xlsx) or CSV files are accepted |
| FW-IN-007 | Missing required fields in import | User uploads file with incomplete data | Required fields (Invoice, PO, Item Code, Roll No, etc.) are missing |
| FW-IN-008 | Fabric roll already scanned in | User scans QR code of a roll already in system | This fabric roll has already been received into the warehouse |
| FW-IN-009 | QR code not recognized | User scans invalid or damaged QR code | The QR code cannot be decoded or doesn't match system format |
| FW-IN-010 | Yard measurement out of range | User enters invalid yard value (negative or too large) | Yard value must be between 0.01 and 9999.99 |

### 1.2 Inventory Management

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| FW-INV-001 | Fabric roll not found in inventory | User searches for non-existent roll | The specified fabric roll ID does not exist in inventory |
| FW-INV-002 | Insufficient fabric quantity | User attempts to issue more fabric than available | Requested quantity exceeds current stock level |
| FW-INV-003 | Fabric roll already allocated | User tries to allocate a roll that's already reserved | This fabric roll is already allocated to another job |
| FW-INV-004 | Location not found | User assigns fabric to non-existent warehouse location | The specified warehouse location code doesn't exist |
| FW-INV-005 | Fabric roll in wrong status | User performs operation on fabric with incompatible status | Operation not allowed for fabric in current status (e.g., Relaxing, Quarantine) |
| FW-INV-006 | Batch/Lot mismatch | System detects different batch numbers in same allocation | Cannot mix different batches for the same style/color |
| FW-INV-007 | Color code mismatch | User selects fabric with wrong color for the job | Fabric color doesn't match the color specified in the cutting order |
| FW-INV-008 | Width measurement incompatible | User selects fabric with incorrect width | Fabric width doesn't meet the job requirements |
| FW-INV-009 | FOC fabric unavailable | User requests FOC (Free of Charge) fabric that's not marked | This fabric roll is not marked as FOC in the system |
| FW-INV-010 | QC inspection pending | User attempts to issue fabric pending QC approval | Fabric roll must pass QC inspection before issuing |

### 1.3 Fabric Relaxing Process

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| FW-RLX-001 | Relax time standard not configured | User scans fabric for relaxing but no standard time set | Relax time standard must be configured for this fabric type |
| FW-RLX-002 | Fabric already in relaxing | User scans fabric roll already in relaxing process | This fabric roll is currently being relaxed |
| FW-RLX-003 | Relaxing time not completed | User attempts to complete relaxing before minimum time | Fabric must relax for the specified duration before completion |
| FW-RLX-004 | Relaxing machine not available | User assigns fabric to occupied machine | The selected relaxing machine is currently in use |
| FW-RLX-005 | Relaxing capacity exceeded | User attempts to start relaxing with full capacity | Maximum relaxing capacity reached, please wait for completion |
| FW-RLX-006 | Invalid relax completion time | User enters incorrect completion timestamp | Completion time cannot be earlier than start time |

### 1.4 Fabric Issuing (Issue from Job)

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| FW-ISS-001 | Job/PO not found in ERP | User scans job/PO that doesn't exist | The scanned PO number is not found in the ERP system |
| FW-ISS-002 | Cutting order not created | User attempts to issue fabric without cutting order | A cutting order must be created first before issuing fabric |
| FW-ISS-003 | Issue request already completed | User scans already fulfilled issue request | This issue request has been completed and cannot be modified |
| FW-ISS-004 | Fabric allocation mismatch | System finds wrong fabric assigned to cutting order | The fabric roll doesn't match the cutting order specifications |
| FW-ISS-005 | Issue quantity exceeds order | User issues more fabric than required by cutting order | Issue quantity cannot exceed the total order quantity |
| FW-ISS-006 | Barcode scan timeout | User's scan session expired due to inactivity | Please scan again, session has timed out |
| FW-ISS-007 | Multiple lots detected | User selects fabric from different lots for same job | Cannot issue fabric from multiple lots for the same cutting job |
| FW-ISS-008 | Issue transaction failed | Database error during issue transaction | Failed to record issue transaction, please try again |
| FW-ISS-009 | Cutting room location invalid | User selects invalid delivery location | The specified cutting room location is not configured |
| FW-ISS-010 | ERP sync failed | System cannot connect to ERP for validation | Unable to validate with ERP system, please check connection |

---

## 2. ACCESSORY WAREHOUSE - Error Codes & Messages

### 2.1 Inbound & Receiving

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| AW-IN-001 | Accessory item not found | User scans non-existent accessory barcode | The scanned accessory item doesn't exist in the system |
| AW-IN-002 | Duplicate accessory barcode | User receives accessory with existing barcode | This accessory barcode has already been received |
| AW-IN-003 | Supplier code invalid | User enters unrecognized supplier code | The supplier code is not registered in the system |
| AW-IN-004 | Packing list mismatch | Scanned item doesn't match packing list | The item doesn't exist in the uploaded packing list |
| AW-IN-005 | Quantity discrepancy | Physical count doesn't match packing list | Received quantity differs from packing list quantity |
| AW-IN-006 | Accessory type mismatch | User assigns wrong accessory type | The accessory type doesn't match the item specification |
| AW-IN-007 | Unit of measure conflict | User selects incompatible unit (pcs, sets, etc.) | Unit of measure conflicts with master data |
| AW-IN-008 | Invalid expiry date | User enters past date for expiry | Expiry date cannot be in the past |
| AW-IN-009 | Missing inspection certificate | Required QC certificate not uploaded | Accessories from this supplier require inspection certificate |
| AW-IN-010 | Carton label scan failed | User scans damaged or invalid carton label | Cannot decode carton label, please verify or enter manually |

### 2.2 Inventory Management

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| AW-INV-001 | Accessory out of stock | User requests unavailable accessory | The requested accessory is currently out of stock |
| AW-INV-002 | Below minimum stock level | System detects stock below reorder point | Stock level is below minimum, reorder recommended |
| AW-INV-003 | Shelf location full | User attempts to assign to full storage location | The selected shelf location has reached maximum capacity |
| AW-INV-004 | Size/Color combination invalid | User selects non-existent size/color variant | This size and color combination is not available |
| AW-INV-005 | Supplier lot mismatch | User mixes different supplier lots | Cannot combine accessories from different supplier lots |
| AW-INV-006 | Accessory expired | User selects expired accessory for issue | This accessory has passed its expiry date |
| AW-INV-007 | Reserved for other PO | User selects accessory already reserved | This accessory is reserved for another purchase order |
| AW-INV-008 | Physical count mismatch | Cycle count result differs from system | Physical inventory doesn't match system quantity |
| AW-INV-009 | Accessory in quarantine | User attempts to use quarantined items | This accessory is in quarantine pending inspection |
| AW-INV-010 | Batch traceability required | User issues accessory without batch tracking | Batch number must be recorded for traceability |

### 2.3 Accessory Issuing

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| AW-ISS-001 | PO number not valid | User scans unrecognized PO number | The purchase order number is not found in the system |
| AW-ISS-002 | Style/color not matching | Selected accessory doesn't match PO spec | Accessory specification doesn't match PO requirements |
| AW-ISS-003 | Issue quantity exceeds BOM | User issues more than bill of materials requires | Cannot issue more than BOM quantity for this style |
| AW-ISS-004 | Multiple variants selected | User selects different variants for same item | Only one variant can be selected per issue request |
| AW-ISS-005 | Sewing line not specified | User doesn't select target sewing line | Please specify the sewing line for delivery |
| AW-ISS-006 | Issue request duplicate | User creates duplicate issue request | An issue request for this PO/item already exists |
| AW-ISS-007 | Accessory substitution not allowed | User selects alternative accessory without approval | Accessory substitution requires approval from merchandiser |
| AW-ISS-008 | Insufficient sets for PO | Not enough complete sets available | Cannot fulfill complete sets for the entire PO quantity |
| AW-ISS-009 | Kanban card not found | User scans missing kanban card | The scanned kanban card is not recognized |
| AW-ISS-010 | Cross-contamination risk | User issues accessories from restricted area | Cannot issue from quarantine/restricted area |

---

## 3. PACKAGING WAREHOUSE - Error Codes & Messages

### 3.1 Inbound & Receiving

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| PW-IN-001 | Packaging material not found | User scans unrecognized packaging item | The scanned packaging material doesn't exist in master data |
| PW-IN-002 | Carton specification mismatch | Received carton size doesn't match PO | Carton dimensions differ from purchase order specification |
| PW-IN-003 | Poly bag thickness invalid | Measured thickness outside tolerance | Poly bag thickness must be within ±0.01mm tolerance |
| PW-IN-004 | Supplier quality issue | System flags supplier with quality history | This supplier has recent quality issues, inspection required |
| PW-IN-005 | Packaging already received | User scans duplicate delivery note | This delivery note has already been processed |
| PW-IN-006 | ECT test result missing | Required carton strength test not provided | Edge Crush Test (ECT) certificate is required for approval |
| PW-IN-007 | Print quality unacceptable | Visual inspection failed for printed materials | Carton/poly bag print quality doesn't meet standards |
| PW-IN-008 | Dimension measurement error | Scanned dimensions don't match specification | Please verify and re-measure packaging dimensions |
| PW-IN-009 | Pallet configuration invalid | User creates non-standard pallet layout | Pallet stacking doesn't follow warehouse standards |
| PW-IN-010 | Moisture content exceeded | Packaging material moisture level too high | Material failed moisture test, cannot be stored |

### 3.2 Inventory Management

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| PW-INV-001 | Carton size not available | User requests unavailable carton dimension | The requested carton size is out of stock |
| PW-INV-002 | Poly bag type mismatch | User selects wrong poly bag specification | Poly bag type doesn't match customer requirements |
| PW-INV-003 | Sticker/label out of stock | User requests unavailable label type | The requested sticker/label is currently unavailable |
| PW-INV-004 | Packaging in damage zone | User selects damaged packaging area | Materials in this location are marked as damaged |
| PW-INV-005 | Custom packaging not ready | Special packaging order not completed | Custom packaging order is still in production |
| PW-INV-006 | Storage temperature violation | System detects temperature out of range | Storage area temperature exceeds recommended range |
| PW-INV-007 | Packaging shelf life expired | User selects expired packaging material | This packaging material has exceeded shelf life |
| PW-INV-008 | Incompatible material mixing | User combines incompatible packaging types | Cannot store different material types in same location |
| PW-INV-009 | Pallet location not found | User assigns to non-existent pallet location | The specified pallet location code doesn't exist |
| PW-INV-010 | Stock rotation violation | User issues newer stock before older | Must follow FIFO (First In First Out) rule |

### 3.3 Packaging Issuing

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| PW-ISS-001 | Packing list not found | User scans non-existent packing list | The packing list number is not in the system |
| PW-ISS-002 | Carton ratio mismatch | Selected cartons don't match assortment | Carton size ratio doesn't comply with packing plan |
| PW-ISS-003 | Poly bag size incorrect | Selected poly bag too small/large | Poly bag dimensions incompatible with garment size |
| PW-ISS-004 | Label artwork not approved | User selects unapproved label design | Label artwork requires merchandiser approval first |
| PW-ISS-005 | Hanger type not matching | Wrong hanger type for garment category | Selected hanger type incompatible with garment spec |
| PW-ISS-006 | Tissue paper grade low | Tissue paper quality below standard | Tissue paper GSM (grams per square meter) too low |
| PW-ISS-007 | Carton flaps damaged | System detects damaged cartons in selection | Please select cartons without flap damage |
| PW-ISS-008 | Issue to wrong packing line | User delivers to incorrect packing line | This material is assigned to a different packing line |
| PW-ISS-009 | Overissue detected | Issued quantity exceeds requirement | Total issued quantity exceeds packing list requirement |
| PW-ISS-010 | Barcode duplication found | Multiple items scanned with same barcode | Duplicate barcodes detected, please verify items |

---

## 4. CROSS-MODULE Error Codes & Messages

### 4.1 Scanning & QR Code Operations

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| CM-QR-001 | QR code format invalid | User scans non-standard QR code | QR code doesn't match system format requirements |
| CM-QR-002 | Camera permission denied | User blocks camera access | Please allow camera access in browser settings |
| CM-QR-003 | QR code already scanned | User scans duplicate QR code in session | This QR code has already been scanned in this session |
| CM-QR-004 | Barcode scanner disconnected | Hardware scanner connection lost | Please check scanner connection and try again |
| CM-QR-005 | Multiple items scanned simultaneously | User scans too many codes at once | Please scan one item at a time |
| CM-QR-006 | QR code checksum failed | Corrupted or damaged QR code scanned | QR code validation failed, code may be damaged |
| CM-QR-007 | Scanning session timeout | User idle during scanning process | Session expired due to inactivity, please restart |
| CM-QR-008 | Invalid warehouse location code | Scanned location doesn't exist in system | The location code is not registered in the warehouse |
| CM-QR-009 | Item not in scanned location | Physical location doesn't match system | Item location in system doesn't match scanned location |
| CM-QR-010 | QR generation failed | System cannot generate QR code | Failed to generate QR code, please try again |

### 4.2 Location Management

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| CM-LOC-001 | Location already occupied | User assigns to occupied storage location | This location is already occupied by other items |
| CM-LOC-002 | Location not enabled | User selects disabled warehouse location | This location is currently disabled in the system |
| CM-LOC-003 | Location capacity exceeded | User assigns more items than capacity allows | Location capacity limit has been reached |
| CM-LOC-004 | Location type mismatch | User assigns wrong item type to location | This location is designated for different item type |
| CM-LOC-005 | Restricted area access | User without permission accesses restricted area | You don't have permission to access this area |
| CM-LOC-006 | Location audit pending | User modifies location under audit | This location is under audit and cannot be modified |
| CM-LOC-007 | Cross-dock location invalid | User uses cross-dock location for storage | Cross-dock locations cannot be used for long-term storage |
| CM-LOC-008 | Location hierarchy error | User creates invalid location structure | Location hierarchy structure is invalid |
| CM-LOC-009 | Duplicate location code | User creates location with existing code | This location code already exists in the system |
| CM-LOC-010 | Location zone mismatch | User moves item across incompatible zones | Cannot move item from this zone to target zone |

### 4.3 Transaction & Reporting

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| CM-TRX-001 | Transaction log failed | System cannot record transaction | Failed to create transaction record, operation rolled back |
| CM-TRX-002 | Transaction already reversed | User attempts to reverse completed transaction | This transaction has already been reversed |
| CM-TRX-003 | Insufficient privilege | User lacks permission for operation | You don't have permission to perform this transaction |
| CM-TRX-004 | Transaction date invalid | User enters incorrect transaction date | Transaction date cannot be in the future |
| CM-TRX-005 | Concurrent update conflict | Multiple users modify same record | Record was modified by another user, please refresh |
| CM-TRX-006 | Report generation failed | System cannot generate requested report | Failed to generate report, please try again later |
| CM-TRX-007 | Export limit exceeded | User exports too many records | Export limit is 10,000 records, please apply filters |
| CM-TRX-008 | Period already closed | User modifies transaction in closed period | This accounting period is closed and cannot be modified |
| CM-TRX-009 | Audit trail incomplete | System detects missing audit records | Transaction audit trail is incomplete |
| CM-TRX-010 | Approval workflow pending | User proceeds without required approval | This transaction requires approval before proceeding |

### 4.4 System & Integration

| Error Code | Response Message | Business Scenario | Description |
|------------|------------------|-------------------|-------------|
| CM-SYS-001 | Database connection lost | System loses database connection | Cannot connect to database, please try again |
| CM-SYS-002 | Session expired | User session timeout | Your session has expired, please log in again |
| CM-SYS-003 | ERP integration offline | ERP system not responding | Cannot connect to ERP system, using offline mode |
| CM-SYS-004 | File upload failed | User's file upload unsuccessful | Failed to upload file, please check file size and format |
| CM-SYS-005 | Concurrent user limit reached | Too many simultaneous users | Maximum concurrent users reached, please try later |
| CM-SYS-006 | System maintenance mode | System under maintenance | System is under maintenance, please try again later |
| CM-SYS-007 | Invalid request format | Malformed API request | Request format is invalid, please check parameters |
| CM-SYS-008 | Server error | Unexpected server error | An unexpected error occurred, please contact support |
| CM-SYS-009 | Network timeout | Request timeout due to slow connection | Request timed out, please check network connection |
| CM-SYS-010 | Version mismatch | Client version incompatible with server | Please refresh your browser to get the latest version |

---

## Error Code Structure & Naming Convention

### Format: `[Module]-[Category]-[Number]`

**Module Prefixes:**
- `FW` = Fabric Warehouse
- `AW` = Accessory Warehouse
- `PW` = Packaging Warehouse
- `CM` = Cross-Module (Common)

**Category Codes:**
- `IN` = Inbound/Receiving
- `INV` = Inventory Management
- `ISS` = Issuing Operations
- `RLX` = Relaxing Process (Fabric specific)
- `QR` = QR Code/Scanning
- `LOC` = Location Management
- `TRX` = Transactions & Reporting
- `SYS` = System & Integration

**Number Range:** 001-999 (sequential within each category)

---

## Usage Guidelines

1. **Error Code Display:** Always display error code alongside message for support reference
2. **User Notifications:** Use toast notifications for minor errors, modals for critical errors
3. **Logging:** All errors should be logged with timestamp, user, and context
4. **Localization:** Response messages should support multiple languages
5. **Support Escalation:** Include error code in all support tickets for faster resolution

---

## Document Version
- **Version:** 1.0.0
- **Last Updated:** 2025-12-11
- **Maintained By:** Warehouse System Team
- **Review Cycle:** Quarterly

---

*This document is a living document and should be updated as new features are added or error scenarios are discovered.*
