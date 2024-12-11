import { useState, useEffect } from 'react';
import ShoppingCart from '../components/ShoppingCart';
import Link from 'next/link';
import "../app/globals.css";
import { auth, db } from '../app/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const districts = {
  "Arevalo, Iloilo City": ["Bonifacio (Arevalo)", "Calaparan", "Dulonan", "Mohon", "San Jose", "Santa Cruz", "Santo Domingo", "Santo Niño Norte", "Santo Niño Sur", "Sooc", "Yulo Drive"],
  "City Proper, Iloilo City": ["Arsenal Aduana", "Baybay Tanza", "Bonifacio Tanza", "Concepcion-Montes", "Danao", "Delgado-Jalandoni-Bagumbayan", "Edganzon", "Flores", "General Hughes-Montes", "Gloria", "Hipodromo", "Inday", "Jalandoni-Wilson", "Kahirupan", "Kauswagan", "Legaspi dela Rama", "Liberation", "Mabolo-Delgado", "Magsaysay", "Malipayon-Delgado", "Maria Clara", "Monica Blumentritt", "Muelle Loney-Montes", "Nonoy", "Ortiz", "Osmeña", "President Roxas", "Rima-Rizal", "Rizal Estanzuela", "Rizal Ibarra", "Rizal Palapala I", "Rizal Palapala II", "Roxas Village", "Sampaguita", "San Agustin", "San Felix", "San Jose", "San Juan", "San Pedro", "Santa Filomena", "Santa Isabel", "Santo Rosario-Duran", "Tanza-Esperanza", "Tanza-Baybay", "Veterans Village", "Yulo-Arroyo"],
  "Jaro, Iloilo City": ["Aguinaldo", "Arguelles", "Balabago", "Balantang", "Benedicto", "Bito-on", "Buhang", "Buntatala", "Calubihan", "Camalig", "Cubay", "Democracia", "Desamparados", "Dungon", "Dungon A", "Dungon B", "El 98 Castilla (Claudio Lopez)", "Fajardo", "Gustilo", "Hipodromo", "Javellana", "Kauswagan", "Laguda", "Lanit", "Lopez Jaena", "Lopez Jaena Norte", "Lopez Jaena Sur", "Luna", "Magsaysay", "Magsaysay Village", "Maria Clara", "Montinola", "Our Lady of Fatima", "Our Lady of Lourdes", "Quintin Salas", "San Isidro", "San Jose", "San Nicolas", "San Pedro", "San Roque", "Seminario", "Simon Ledesma", "Tabuc Suba", "Tacas", "Taytay Zone II", "Tiza", "Ungka", "Veterans Village", "West Timawa"],
  "La Paz, Iloilo City": ["Aguinaldo", "Baldoza", "Bantud", "Banuyao", "Burgos-Mabini-Plaza", "Caingin", "Divinagracia", "Gustilo", "Hinactacan", "Ingore", "Jereos", "Laguda", "Lopez Jaena Norte", "Lopez Jaena Sur", "Luna", "MacArthur", "Magdalo", "Magsaysay Village", "Nabitasan", "Railway", "Rizal", "San Isidro", "San Nicolas", "Tabuc Suba", "Ticud"],
  "Lapuz, Iloilo City": ["Alalasan Lapuz", "Don Esteban-Lapuz", "Jalandoni Estate-Lapuz", "Lapuz Norte", "Lapuz Sur", "Libertad-Lapuz", "Loboc-Lapuz", "Mansaya-Lapuz", "Obrero-Lapuz", "Progreso-Lapuz", "Punong-Lapuz"],
  "Mandurriao, Iloilo City": ["Abeto Mirasol Taft South (Quirino Abeto)", "Airport (Tabucan Airport)", "Bakhaw", "Bolilao", "Buhang Taft North", "Calahunan", "Dungon C", "Guzman-Jesena", "Hibao-an Norte", "Hibao-an Sur", "Iloilo City Estates", "Kauswagan", "Lapuz Norte", "Lapuz Sur", "Libertad-Lapuz", "Loboc-Lapuz", "Mansaya-Lapuz", "Obrero-Lapuz", "Oñate de Leon", "PHHC Block 17", "PHHC Block 22 NHA", "Q. Abeto", "Q. Abeto Mirasol", "Q. Abeto Mirasol Taft South"]
};

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [district, setDistrict] = useState('');
  const [barangay, setBarangay] = useState('');

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    if (!district || !barangay) {
      alert('Please select a district and barangay.');
      return;
    }

    if (user) {
      try {
        await addDoc(collection(db, 'orders'), {
          userId: user.uid,
          cart: cart,
          address: {
            district: district,
            barangay: barangay
          },
          timestamp: new Date()
        });
        alert('Checkout successful! Order saved.');
        clearCart();
      } catch (error) {
        alert('Error saving order');
      }
    } else {
      alert('Please log in to checkout.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      <div className="flex justify-between mb-4">
        <Link href="/" className="bg-blue-500 text-white p-2 rounded-full shadow-md">
          🏠
        </Link>
        <Link href="/profile" className="bg-green-500 text-white p-2 rounded-full shadow-md">
          👤
        </Link>
      </div>
      <ShoppingCart
        cart={cart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        updateQuantity={updateQuantity}
      />
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Delivery Address</h2>
        <div className="mb-4">
          <label className="block text-gray-700">District</label>
          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setBarangay('');
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select District</option>
            {Object.keys(districts).map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Barangay</label>
          <select
            value={barangay}
            onChange={(e) => setBarangay(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            disabled={!district}
          >
            <option value="">Select Barangay</option>
            {district && districts[district].map((barangay) => (
              <option key={barangay} value={barangay}>{barangay}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCheckout}
          className="bg-sky-500 text-white p-3 rounded-lg shadow-sm hover:bg-sky-600"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}