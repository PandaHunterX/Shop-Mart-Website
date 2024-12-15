import { useState, useEffect } from 'react';
import ShoppingCart from '../components/ShoppingCart';
import Link from 'next/link';
import "../app/globals.css";
import { auth, db } from '../app/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { serverTimestamp } from "firebase/firestore";
import { useRouter } from 'next/router';

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
  const [district, setDistrict] = useState("");
  const [barangay, setBarangay] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    document.title = "Shop Mart | Shopping Cart";
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
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!district || !barangay) {
      alert("Please select a district and barangay.");
      return;
    }

    if (user) {
      try {
        const totalPrice = calculateTotalPrice();
        await addDoc(collection(db, "orders"), {
          userId: user.uid,
          cart: cart,
          address: {
            district: district,
            barangay: barangay,
          },
          totalPrice: totalPrice,
          timestamp: serverTimestamp(),
        });
        alert("Checkout successful! Order saved.");
        clearCart();
      } catch (error) {
        alert("Error saving order");
      }
    } else {
      alert("Please log in to checkout.");
    }
    router.push('/profile');
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 flex justify-between items-center rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold tracking-wide">Shopping Cart</h1>
        <div className="flex space-x-4">
          <Link
            href="/"
            className="md:text-lg text-sm font-medium bg-blue-700 px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition-all duration-300"
          >
            Home
          </Link>
          <Link
            href="/profile"
            className="md:text-lg text-sm font-medium bg-blue-900 px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition-all duration-300"
          >
            Profile
          </Link>
        </div>
      </div>

      {/* Shopping Cart Section */}
      <div className="mt-8">
        <div>
          <ShoppingCart
            cart={cart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            updateQuantity={updateQuantity}
          />
        </div>
      </div>

      {/* Delivery Address Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Delivery Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-md p-6 rounded-lg">
          {/* District */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full text-lg shadow-md">
              📍
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                District
              </label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setBarangay("");
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              >
                <option value="">Select District</option>
                {Object.keys(districts).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Barangay */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full text-lg shadow-md">
              🏠
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Barangay
              </label>
              <select
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              >
                <option value="">Select Barangay</option>
                {districts[district]?.map((barangay) => (
                  <option key={barangay} value={barangay}>
                    {barangay}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleCheckout}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 hover:scale-105 transition-transform transform focus:ring-4 focus:ring-purple-400"
        >
          🛒 Proceed to Checkout
        </button>
      </div>
    </div>

  );
}
