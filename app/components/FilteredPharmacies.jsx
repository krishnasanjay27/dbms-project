import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function FilteredPharmacies({ medicine, pharmacies }) {
  const { data: session } = useSession();
  const [bookingPharmacy, setBookingPharmacy] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Ensure pharmacies is always an array
  const pharmacyArray = Array.isArray(pharmacies) ? pharmacies : 
                       (pharmacies && typeof pharmacies === 'object' ? [pharmacies] : []);

  if (!medicine || pharmacyArray.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No pharmacies found with this medicine and filters.</p>;
  }

  const handleBookClick = (pharmacy) => {
    if (!session) {
      toast.error('Please sign in to book medicines');
      return;
    }
    // Ensure pharmacy has an ID before setting
    if (!pharmacy.pharmacy_id) {
      toast.error('Cannot book from this pharmacy: Missing ID');
      return;
    }
    setBookingPharmacy(pharmacy);
    setQuantity(1);
  };

  const handleBookingSubmit = async () => {
    if (!session || !medicine || !bookingPharmacy) return;
    
    try {
      setIsLoading(true);
      
      // Here we need to find the stock ID
      // Since we don't have it directly in the filtered results,
      // we'll make a request to get it first
      const stockResponse = await fetch(`/api/pharmacy-stock?medicineId=${medicine.id}&pharmacyId=${bookingPharmacy.pharmacy_id}`);
      const stockData = await stockResponse.json();
      
      if (!stockResponse.ok || !stockData.stockId) {
        throw new Error('Could not find stock information');
      }
      
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockId: stockData.stockId,
          medicineId: medicine.id,
          pharmacyId: bookingPharmacy.pharmacy_id,
          quantity: quantity,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to book medicine');
      }

      toast.success('Medicine booked successfully!');
      setBookingPharmacy(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setBookingPharmacy(null);
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-3">{medicine.name}</h2>
      
      <div className="space-y-4">
        {pharmacyArray.map((pharmacy, index) => (
          <div 
            key={pharmacy.pharmacy_id || `pharmacy-${index}`} 
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{pharmacy.pharmacy_name || 'Unknown Pharmacy'}</h3>
                <p className="text-sm text-gray-600">{pharmacy.pharmacy_location || 'Location not available'}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Hours:</span> {pharmacy.operating_hours || 'Not specified'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Contact:</span> {pharmacy.pharmacy_contact || 'Not available'}
                </p>
                <p className="text-sm mt-2">
                  <span className="font-medium">Price:</span> ₹{pharmacy.selling_price || 0} | 
                  <span className="font-medium"> Available:</span> {pharmacy.stock_quantity || 0} units
                </p>
              </div>
              <button
                onClick={() => handleBookClick(pharmacy)}
                disabled={!pharmacy.pharmacy_id}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingPharmacy && medicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Book Medicine</h3>
            
            <div className="mb-4">
              <p><span className="font-medium">Medicine:</span> {medicine.name}</p>
              <p><span className="font-medium">Pharmacy:</span> {bookingPharmacy.pharmacy_name}</p>
              <p><span className="font-medium">Price per unit:</span> ₹{bookingPharmacy.selling_price}</p>
              <p><span className="font-medium">Available stock:</span> {bookingPharmacy.stock_quantity}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Quantity:</label>
              <div className="flex items-center">
                <button 
                  className="bg-gray-200 px-3 py-1 rounded-l-md"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={bookingPharmacy.stock_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(bookingPharmacy.stock_quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="border-y p-1 text-center w-16"
                />
                <button 
                  className="bg-gray-200 px-3 py-1 rounded-r-md"
                  onClick={() => setQuantity(Math.min(bookingPharmacy.stock_quantity, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-lg font-semibold">Total Price: ₹{bookingPharmacy.selling_price * quantity}</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 