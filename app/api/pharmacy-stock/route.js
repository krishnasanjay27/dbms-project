import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const medicineId = parseInt(searchParams.get('medicineId') || '0');
    const pharmacyId = parseInt(searchParams.get('pharmacyId') || '0');
    
    if (!medicineId || !pharmacyId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    const stock = await prisma.pharmacyMedicineStock_.findFirst({
      where: {
        Medicine_id: medicineId,
        pharmacy_id: pharmacyId
      }
    });
    
    if (!stock) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      stockId: stock.stock_id,
      quantity: stock.stock_quantity,
      price: stock.selling_price
    });
    
  } catch (error) {
    console.error('Get stock error:', error);
    return NextResponse.json(
      { error: 'Failed to get stock information: ' + error.message },
      { status: 500 }
    );
  }
} 