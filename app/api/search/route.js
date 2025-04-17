import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim() || '';

    let medicines;

    if (!query) {
      medicines = await prisma.medicine.findMany({ take: 10 });
    } else {
      medicines = await prisma.medicine.findMany({
        where: {
          medicine_name: {
            startsWith: query,
          }
          ,
        },
      });
    }

    const results = medicines.slice(0, 10).map((med) => ({
      name: med.medicine_name,
      price: med.price,
      id: med.Medicine_id,
    }));

    return NextResponse.json({ results: results || [] });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search medicines: ' + error.message },
      { status: 500 }
    );
  }
}
