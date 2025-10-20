// Path: src/pages/location-management/data.ts

import type { LocationItem, FabricRoll } from './types';

export const locationListData: LocationItem[] = [
  // Dữ liệu cũ giữ nguyên...
  {
    id: 'F1-01-01',
    warehouse: 'F1',
    shelf: 1,
    pallet: 1,
    capacity: 100,
    currentOccupancy: 85,
    lastUpdated: '10/18/2025',
    description: 'Khu vực vải cotton',
  },
  {
    id: 'F2-05-03',
    warehouse: 'F2',
    shelf: 5,
    pallet: 3,
    capacity: 120,
    currentOccupancy: 110,
    lastUpdated: '10/17/2025',
    description: 'Khu vực vải kaki màu',
  },
  {
    id: 'F1-02-02',
    warehouse: 'F1',
    shelf: 2,
    pallet: 2,
    capacity: 80,
    currentOccupancy: 50,
    lastUpdated: '10/18/2025',
    description: 'Khu vực vải lụa',
  },
  {
    id: 'F3-10-08',
    warehouse: 'F3',
    shelf: 10,
    pallet: 8,
    capacity: 150,
    currentOccupancy: 150,
    lastUpdated: '10/16/2025',
    description: 'Khu vực vải denim (jean)',
  },
  {
    id: 'F2-03-05',
    warehouse: 'F2',
    shelf: 3,
    pallet: 5,
    capacity: 100,
    currentOccupancy: 75,
    lastUpdated: '10/18/2025',
    description: 'Khu vực vải voan',
  },
    {
    id: 'F1-01-02',
    warehouse: 'F1',
    shelf: 1,
    pallet: 2,
    capacity: 100,
    currentOccupancy: 95,
    lastUpdated: '10/19/2025',
    description: 'Khu vực vải cotton',
  },
];

// --- Dữ liệu mới cho các cuộn vải ---
export const fabricRollData: FabricRoll[] = [
    { id: 'ROLL-C001', locationId: 'F1-01-01', colorCode: 'BLUE-01', yards: 50.5, rollNo: 'R1', lotNo: 'LOT-2025-A'},
    { id: 'ROLL-C002', locationId: 'F1-01-01', colorCode: 'BLUE-01', yards: 48.2, rollNo: 'R2', lotNo: 'LOT-2025-A'},
    { id: 'ROLL-C003', locationId: 'F1-01-01', colorCode: 'RED-05', yards: 55.0, rollNo: 'R3', lotNo: 'LOT-2025-B'},
    { id: 'ROLL-K011', locationId: 'F2-05-03', colorCode: 'GREEN-02', yards: 60.0, rollNo: 'R11', lotNo: 'LOT-2025-C'},
    { id: 'ROLL-S025', locationId: 'F1-02-02', colorCode: 'WHITE-01', yards: 100.0, rollNo: 'R25', lotNo: 'LOT-2025-D'},
    { id: 'ROLL-C004', locationId: 'F1-01-02', colorCode: 'BLACK-01', yards: 52.0, rollNo: 'R4', lotNo: 'LOT-2025-E'},
    { id: 'ROLL-C005', locationId: 'F1-01-02', colorCode: 'BLACK-01', yards: 51.5, rollNo: 'R5', lotNo: 'LOT-2025-E'},
];


// Hàm giả lập API để lấy các cuộn vải theo vị trí
export const getRollsByLocationId = (locationId: string): Promise<FabricRoll[]> => {
    console.log(`Fetching rolls for location: ${locationId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const rolls = fabricRollData.filter(roll => roll.locationId === locationId);
            resolve(rolls);
        }, 300); // Giả lập độ trễ mạng
    });
}