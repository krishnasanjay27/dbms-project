import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function SearchResults({ results }) {
  const { data: session } = useSession();
  const [bookingMedicine, setBookingMedicine] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  if (!results || results.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No medicines found</p>;
  }

  const handleBookClick = (medicine, pharmacy) => {
    if (!session) {
      toast.error('Please sign in to book medicines');
      return;
    }
    setBookingMedicine(medicine);
    setSelectedPharmacy(pharmacy);
    setQuantity(1);
  };

  const handleBookingSubmit = async () => {
    if (!session || !bookingMedicine || !selectedPharmacy) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockId: selectedPharmacy.stockId,
          medicineId: bookingMedicine.id,
          pharmacyId: selectedPharmacy.id,
          quantity: quantity,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to book medicine');
      }

      toast.success('Medicine booked successfully!');
      setBookingMedicine(null);
      setSelectedPharmacy(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setBookingMedicine(null);
    setSelectedPharmacy(null);
  };

  return (
    <div className="mt-4">
      {results.map((medicine) => (
        <div key={medicine.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-lg font-semibold">{medicine.name}</h3>
          
          
          {medicine.pharmacies && medicine.pharmacies.length > 0 ? (
            <div className="mt-2">
              <h4 className="text-md font-medium mb-2">Available at these pharmacies:</h4>
              <div className="space-y-2">
                {medicine.pharmacies.map((pharmacy) => (
                  <div key={`${medicine.id}-${pharmacy.id}`} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{pharmacy.name}</p>
                      <p className="text-sm text-gray-600">{pharmacy.location}</p>
                      <p className="text-sm">Price: ₹{pharmacy.price} | Stock: {pharmacy.stock}</p>
                    </div>
                    <button
                      onClick={() => handleBookClick(medicine, pharmacy)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">Not available at any pharmacy</p>
          )}
        </div>
      ))}

      {/* Booking Modal */}
      {bookingMedicine && selectedPharmacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Book Medicine</h3>
            
            <div className="mb-4">
              <p><span className="font-medium">Medicine:</span> {bookingMedicine.name}</p>
              <p><span className="font-medium">Pharmacy:</span> {selectedPharmacy.name}</p>
              <p><span className="font-medium">Price per unit:</span> ₹{selectedPharmacy.price}</p>
              <p><span className="font-medium">Available stock:</span> {selectedPharmacy.stock}</p>
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
                  max={selectedPharmacy.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(selectedPharmacy.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="border-y p-1 text-center w-16"
                />
                <button 
                  className="bg-gray-200 px-3 py-1 rounded-r-md"
                  onClick={() => setQuantity(Math.min(selectedPharmacy.stock, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-lg font-semibold">Total Price: ₹{selectedPharmacy.price * quantity}</p>
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