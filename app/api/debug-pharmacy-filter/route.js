import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const medicineName = searchParams.get('medicineName') || 'para'; // Default example
    
    // Direct SQL query to understand the structure
    const directQuery = await prisma.$queryRaw`
      SELECT
        p.pharmacy_id,
        p.pharmacy_name,
        p.pharmacy_location,
        p.pharmacy_contact,
        p.operating_hours,
        ps.stock_quantity,
        ps.selling_price,
        ps.stock_id,
        m.Medicine_id,
        m.medicine_name,
        m.price
      FROM Medicine m
      JOIN PharmacyMedicineStock_ ps ON m.Medicine_id = ps.Medicine_id
      JOIN Pharmacy p ON p.pharmacy_id = ps.pharmacy_id
      WHERE m.medicine_name LIKE ${`%${medicineName}%`}
      LIMIT 10
    `;
    
    // Call the stored procedure 
    const spResults = await prisma.$queryRawUnsafe(
      `CALL GetPharmaciesByMedicineAndFilters(?, ?, ?, ?)`,
      medicineName,
      1, // minStock
      0, // minPrice
      10000 // maxPrice
    );
    
    // Return both for comparison
    return NextResponse.json({
      directQuery: {
        type: typeof directQuery,
        isArray: Array.isArray(directQuery),
        length: Array.isArray(directQuery) ? directQuery.length : 'not an array',
        sample: Array.isArray(directQuery) && directQuery.length > 0 ? directQuery[0] : directQuery,
        data: directQuery
      },
      storedProcedure: {
        type: typeof spResults,
        isArray: Array.isArray(spResults),
        length: Array.isArray(spResults) ? spResults.length : 'not an array',
        firstElement: Array.isArray(spResults) && spResults.length > 0 ? {
          type: typeof spResults[0],
          isArray: Array.isArray(spResults[0]),
          length: Array.isArray(spResults[0]) ? spResults[0].length : 'not an array'
        } : 'no elements',
        data: spResults
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Debug query failed: ' + error.message },
      { status: 500 }
    );
  }
} 