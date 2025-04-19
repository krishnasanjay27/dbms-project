import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name     = searchParams.get('medicine');
    const minStock = parseInt(searchParams.get('minStock')) || 0;
    const maxPrice = parseInt(searchParams.get('maxPrice')) || Number.MAX_SAFE_INTEGER;

    if (!name) {
      return NextResponse.json({ error: 'No medicine name provided' }, { status: 400 });
    }

    // call your stored procedure
    const raw = await prisma.$queryRawUnsafe(
      `CALL GetPharmaciesByMedicineAndFilters(?, ?, ?, ?)`,
      name,
      minStock,
      0,        // minPrice
      maxPrice
    );

    console.log('Stored Procedure raw result:', JSON.stringify(raw));

    //   raw might be:
    //   • [[{f0:…,f1:…,…},…], …]  OR
    //   • [{f0:…,f1:…,…},…]
    const rows = Array.isArray(raw[0]) ? raw[0] : raw;

    const pharmacies = rows.map((r) => ({
      pharmacy:      r.f0,
      location:      r.f1,
      contact:       r.f2,
      hours:         r.f3,
      quantity:      r.f4,
      selling_price: r.f5,
    }));

    return NextResponse.json({ pharmacies });
  } catch (err) {
    console.error('Stored Procedure API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
