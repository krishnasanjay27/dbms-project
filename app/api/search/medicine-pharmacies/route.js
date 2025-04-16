import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('medicine');

    if (!name) {
      return NextResponse.json({ error: 'No medicine name provided' }, { status: 400 });
    }

    // Fetch the medicine ID
    const medicine = await prisma.medicine.findFirst({
      where: { medicine_name: name },
      select: { Medicine_id: true }
    });

    if (!medicine) {
      return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
    }

    // Fetch all pharmacy stock entries for this medicine
    const stocks = await prisma.pharmacyMedicineStock_.findMany({
      where: { Medicine_id: medicine.Medicine_id },
      include: {
        Pharmacy: true
      }
    });

    const pharmacies = stocks.map(s => ({
      pharmacy: s.Pharmacy.pharmacy_name,
      location: s.Pharmacy.pharmacy_location,
      contact: s.Pharmacy.pharmacy_contact,
      quantity: s.stock_quantity,
      selling_price: s.selling_price
    }));

    // 👇 This is the key addition
    return NextResponse.json({ pharmacies: pharmacies || [] });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
