// src/pages/inbound-dashboard/data.ts
import { parse } from 'date-fns';
import type { InventoryItem, WarehouseLocation, CuttingPlan, Shipment } from './types';

// --- RAW DATA (strings remain unchanged) ---
const inventoryDataStr = `
PO Number	Item Code	Factory	Supplier	Invoice No	Color Code	Color	Roll No	Lot No	Yards	Net Weight (Kgs)	Gross Weight (Kgs)	Width	Location	QR Code	Date In House	Description	QC Status	QC Date	QC By	Comment	Printed	Balance Yards	Hour Standard	Hour Relax	Relax Date	Relax Time	Relax By	JOB	Issued Date	Issued By	Destination	Parent QR Code
POPU0018251	CK-101-04-00332	Factory A	Supplier Y	INV-001	CC-003	Light Gold	1	225628091	65	16.5	16.9	60"	F1-01-01	QR-43468	6/8/2023	Denim Material	Failed	12/23/2023	John Doe	No issues found	TRUE	46	24	24	12/25/2023	10:30	Alice	JOB-B5	8/26/2023	David	Warehouse A	null
POPU0018251	CK-101-04-00332	Factory B	Supplier Z	INV-002	CC-004	Royal Sapphire	2	225628091	82	20.1	20.5	60"	F1-01-02	QR-33961	8/10/2023	Silk Blend	Failed	10/22/2023	John Doe	Approved for production	FALSE	39	24	24	9/28/2023	14:00	Bob	JOB-A2	3/15/2023	Eve	Store B	null
PSPU0002932	CK-101-04-00483	Factory B	Supplier Z	INV-003	CC-003	Puma Black	1	225628091	82	17.7	18.1	60"	F1-01-03	QR-81808	10/14/2023	Polyester Blend	Failed	9/19/2023	Peter Jones	Approved for production	TRUE	22	36	36	1/20/2023	9:00	Charlie	JOB-B2	10/5/2023	Frank	Store B	null
POPU0018238	CK-102-05-00049	Factory B	Supplier Y	INV-004	CC-002	Puma Black	1	225628091	55	17.5	18	53"	F1-01-04	QR-35149	4/21/2023	Polyester Blend	Failed	3/5/2023	John Doe	No issues found	TRUE	34	36	36	8/1/2023	10:30	Bob	JOB-A5	4/29/2023	David	Warehouse A	null
POPU0018235	CK-126-04-00277	Factory C	Supplier Z	INV-005	CC-002	Puma Black	1	225628091	45	17.4	17.8	68"	F2-03-05	QR-76433	2/18/2023	Polyester Blend	Failed	4/29/2023	John Doe	Minor defect on edge	TRUE	37	48	48	1/17/2023	9:00	Alice	JOB-C4	9/22/2023	Eve	Store B	null
PSPU0002986	WO-413-04-00361	Factory B	Supplier X	INV-006	CC-004	PUMA BLACK	1	225628091	22	4.5	4.8	57"	F2-03-06	QR-93641	3/16/2023	Silk Blend	Passed	8/5/2023	Jane Smith	No issues found	FALSE	13	48	48	5/10/2023	15:45	Bob	JOB-A9	2/12/2023	Eve	Distribution Center C	null
PSPU0002986	WO-413-04-00361	Factory B	Supplier X	INV-007	CC-003	PUMA WHITE	2	225628091	119	24.6	24.7	57"	F2-03-07	QR-89437	11/22/2023	Polyester Blend	Failed	3/18/2023	Peter Jones	Approved for production	TRUE	26	48	48	5/25/2023	15:45	Bob	JOB-B6	10/30/2023	Eve	Distribution Center C	null
SPPU0004476	CK-105-05-00062	Factory C	Supplier Y	INV-008	CC-003	PUMA WHITE	1	225628091	4	1	1.4	61"	F2-03-08	QR-22682	12/8/2023	Cotton Fabric	Failed	2/27/2023	John Doe	No issues found	FALSE	32	48	48	3/6/2023	10:30	Charlie	JOB-C8	6/2/2023	Frank	Distribution Center C	null
SSPU0002939	CK-105-04-00325	Factory C	Supplier Y	INV-009	CC-002	PUMA WHITE	1	225628091	90	24	24.4	63"	F2-03-09	QR-16812	5/5/2023	Denim Material	Pending	3/12/2023	Peter Jones	Rework required	TRUE	26	48	48	2/24/2023	15:45	Alice	JOB-A8	4/26/2023	David	Warehouse A	null
`;

const warehouseDataStr = `
Location	Warehouse	Shelf	Pallet	Capacity	Current Occupancy	Last Updated	Description
F1-01-01	F1	1	1	100	85	10/18/2025	Khu vực vải cotton
F2-05-03	F2	5	3	120	110	10/17/2025	Khu vực vải kaki màu
F1-02-02	F1	2	2	80	50	10/18/2025	Khu vực vải lụa
F3-10-08	F3	10	8	150	150	10/16/2025	Khu vực vải denim (jean)
F2-03-05	F2	3	5	100	75	10/18/2025	Khu vực vải voan
`;

const cuttingPlanDataStr = `
ID	Plan Name	Factory	Plan Date	Style	JOB	Item Code	Color	Request Quantity	Issued Quantity	Status	Created By	Remarks
CP001	Kế hoạch cắt áo T-Shirt đợt 1	F1	10/20/2025	TSH-001	JOB-101	CTN-005	Trắng	500	0	Planned	an.nguyen	Ưu tiên cắt trước.
CP002	Kế hoạch cắt quần Jean nam	F1	10/21/2025	JEA-002	DNM-003	Xanh đậm	350	0	Planned	an.nguyen	Vải denim cần kiểm tra độ co rút.
CP003	Kế hoạch cắt váy liền thân	F2	10/22/2025	DRS-004	JOB-103	SIL-001	Đỏ đô	200	150	In Progress	bao.tran	Đã nhận đủ vải.
CP004	Kế hoạch cắt áo sơ mi nữ	F2	10/23/2025	SHT-003	POP-002	Xanh nhạt	420	0	Planned	chi.le	Yêu cầu kiểm tra sơ đồ cắt.
CP005	Kế hoạch cắt áo khoác bomber	F3	10/25/2025	JCK-005	JOB-105	NYL-007	Đen	150	150	Completed	bao.tran	Đã hoàn thành, chờ chuyển sang may.
`;

const today = new Date();
const formatDate = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// --- NEW SHIPMENT DATA ---
const shipmentDataStr = `
PO Number	Supplier	Item Code	ETD	ETA	Quantity (Yards)	Status
PO-SHIP-001	Supplier X	WO-413-04-00361	${formatDate(addDays(today, -5))}	${formatDate(addDays(today, 2))}	1200	In Transit
PO-SHIP-002	Supplier Y	CK-105-05-00062	${formatDate(addDays(today, -10))}	${formatDate(addDays(today, 5))}	850	Delayed
PO-SHIP-003	Supplier Z	CK-101-04-00483	${formatDate(addDays(today, -2))}	${formatDate(addDays(today, 6))}	2500	In Transit
PO-SHIP-004	Supplier X	WO-413-04-00361	${formatDate(addDays(today, 1))}	${formatDate(addDays(today, 9))}	1500	In Transit
PO-SHIP-005	Supplier Z	CK-126-04-00277	${formatDate(addDays(today, 3))}	${formatDate(addDays(today, 12))}	980	In Transit
`;


// --- PARSING FUNCTION ---
const parseData = <T extends object>(dataString: string): T[] => {
  const lines = dataString.trim().split('\n');
  const headers = lines[0].split('\t').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split('\t').map(v => v.trim());
    const obj: Record<string, string | number | Date | null> = {};
    headers.forEach((header, i) => {
      const value = values[i];
      if (['Yards', 'Net Weight (Kgs)', 'Gross Weight (Kgs)', 'Balance Yards', 'Capacity', 'Current Occupancy', 'Request Quantity', 'Issued Quantity', 'Roll No', 'Quantity (Yards)'].includes(header)) {
        obj[header] = parseFloat(value) || 0;
      } else if (header.toLowerCase().includes('date') || header === 'ETD' || header === 'ETA' && value) {
         try {
            obj[header] = parse(value, 'M/d/yyyy', new Date());
         } catch {
            obj[header] = null;
         }
      } else {
        obj[header] = value === 'null' ? null : value;
      }
    });
    return obj as T;
  });
};

// --- EXPORT PARSED DATA ---
export const inventoryData: InventoryItem[] = parseData<InventoryItem>(inventoryDataStr);
export const warehouseData: WarehouseLocation[] = parseData<WarehouseLocation>(warehouseDataStr);
export const cuttingPlanData: CuttingPlan[] = parseData<CuttingPlan>(cuttingPlanDataStr);
export const shipmentData: Shipment[] = parseData<Shipment>(shipmentDataStr);