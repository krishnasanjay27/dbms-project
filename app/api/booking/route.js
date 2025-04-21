import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stockId, medicineId, pharmacyId, quantity } = await request.json();
    
    // Validate inputs
    if (!stockId || !medicineId || !pharmacyId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Missing required fields or invalid quantity' },
        { status: 400 }
      );
    }

    // Get the current stock
    const stock = await prisma.pharmacyMedicineStock_.findUnique({
      where: {
        stock_id: stockId
      }
    });

    if (!stock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    }

    if (stock.stock_quantity < quantity) {
      return NextResponse.json({ error: 'Not enough stock available' }, { status: 400 });
    }

    // Create booking and update stock in a transaction
    const result = await prisma.$transaction([
      // Create the booking record
      prisma.medicineBooking.create({
        data: {
          user_id: session.user.id,
          pharmacy_id: pharmacyId,
          medicine_id: medicineId,
          quantity: quantity,
          status: 'confirmed'
        }
      }),
      
      // Update the stock quantity
      prisma.pharmacyMedicineStock_.update({
        where: {
          stock_id: stockId
        },
        data: {
          stock_quantity: {
            decrement: quantity
          }
        }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      booking: result[0]
    });

  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking: ' + error.message },
      { status: 500 }
    );
  }
} 