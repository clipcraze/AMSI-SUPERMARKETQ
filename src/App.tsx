import { useState } from 'react'
import './App.css'
import {
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  Trash2,
  Plus,
  Minus,
  Search,
  X,
  Check,
  ArrowLeft,
  Receipt,
} from 'lucide-react'

// --- Types ---
interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
}

interface CartItem {
  product: Product
  quantity: number
}

type PaymentMethod = 'cash' | 'card' | 'contactless' | null
type Screen = 'register' | 'payment' | 'receipt'

// --- Product data ---
const products: Product[] = [
  // Groenten & Fruit
  { id: 1, name: 'Appels (1kg)', price: 2.49, category: 'Groenten & Fruit', image: 'https://placehold.co/80x80/4ade80/ffffff/png?text=🍎' },
  { id: 2, name: 'Bananen (1kg)', price: 1.79, category: 'Groenten & Fruit', image: 'https://placehold.co/80x80/fbbf24/ffffff/png?text=🍌' },
  { id: 3, name: 'Tomaten (500g)', price: 1.99, category: 'Groenten & Fruit', image: 'https://placehold.co/80x80/ef4444/ffffff/png?text=🍅' },
  { id: 4, name: 'Komkommer', price: 0.89, category: 'Groenten & Fruit', image: 'https://placehold.co/80x80/22c55e/ffffff/png?text=🥒' },
  { id: 5, name: 'Aardbeien (250g)', price: 3.49, category: 'Groenten & Fruit', image: 'https://placehold.co/80x80/f43f5e/ffffff/png?text=🍓' },
  { id: 6, name: 'Sinaasappels (1kg)', price: 2.29, category: 'Groenten & Fruit', image: 'https://placehold.co/80x80/f97316/ffffff/png?text=🍊' },

  // Zuivel
  { id: 7, name: 'Volle Melk (1L)', price: 1.29, category: 'Zuivel', image: 'https://placehold.co/80x80/93c5fd/ffffff/png?text=🥛' },
  { id: 8, name: 'Boter (250g)', price: 2.19, category: 'Zuivel', image: 'https://placehold.co/80x80/fde047/ffffff/png?text=🧈' },
  { id: 9, name: 'Kaas Gouda (400g)', price: 4.99, category: 'Zuivel', image: 'https://placehold.co/80x80/fbbf24/ffffff/png?text=🧀' },
  { id: 10, name: 'Yoghurt Naturel', price: 1.49, category: 'Zuivel', image: 'https://placehold.co/80x80/e0e7ff/333333/png?text=🫙' },
  { id: 11, name: 'Eieren (10st)', price: 2.89, category: 'Zuivel', image: 'https://placehold.co/80x80/fef3c7/333333/png?text=🥚' },

  // Brood & Bakkerij
  { id: 12, name: 'Wit Brood', price: 1.89, category: 'Brood & Bakkerij', image: 'https://placehold.co/80x80/d4a373/ffffff/png?text=🍞' },
  { id: 13, name: 'Volkoren Brood', price: 2.39, category: 'Brood & Bakkerij', image: 'https://placehold.co/80x80/92400e/ffffff/png?text=🍞' },
  { id: 14, name: 'Croissants (4st)', price: 2.99, category: 'Brood & Bakkerij', image: 'https://placehold.co/80x80/f59e0b/ffffff/png?text=🥐' },

  // Dranken
  { id: 15, name: 'Cola (1.5L)', price: 1.69, category: 'Dranken', image: 'https://placehold.co/80x80/7f1d1d/ffffff/png?text=🥤' },
  { id: 16, name: 'Sinaasappelsap (1L)', price: 2.49, category: 'Dranken', image: 'https://placehold.co/80x80/f97316/ffffff/png?text=🧃' },
  { id: 17, name: 'Water (6x1.5L)', price: 2.99, category: 'Dranken', image: 'https://placehold.co/80x80/38bdf8/ffffff/png?text=💧' },
  { id: 18, name: 'Koffie (500g)', price: 5.99, category: 'Dranken', image: 'https://placehold.co/80x80/78350f/ffffff/png?text=☕' },

  // Vlees & Vis
  { id: 19, name: 'Kipfilet (500g)', price: 5.49, category: 'Vlees & Vis', image: 'https://placehold.co/80x80/fca5a5/333333/png?text=🍗' },
  { id: 20, name: 'Gehakt (500g)', price: 4.99, category: 'Vlees & Vis', image: 'https://placehold.co/80x80/dc2626/ffffff/png?text=🥩' },
  { id: 21, name: 'Zalm (200g)', price: 6.99, category: 'Vlees & Vis', image: 'https://placehold.co/80x80/fb923c/ffffff/png?text=🐟' },

  // Snacks & Snoep
  { id: 22, name: 'Chips Naturel', price: 1.89, category: 'Snacks & Snoep', image: 'https://placehold.co/80x80/eab308/ffffff/png?text=🍟' },
  { id: 23, name: 'Chocoladereep', price: 1.49, category: 'Snacks & Snoep', image: 'https://placehold.co/80x80/78350f/ffffff/png?text=🍫' },
  { id: 24, name: 'Koekjes (200g)', price: 2.29, category: 'Snacks & Snoep', image: 'https://placehold.co/80x80/d97706/ffffff/png?text=🍪' },
]

const categories = ['Alle', ...Array.from(new Set(products.map((p) => p.category)))]

function App() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Alle')
  const [searchQuery, setSearchQuery] = useState('')
  const [screen, setScreen] = useState<Screen>('register')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [cashGiven, setCashGiven] = useState('')
  const [, setPaymentComplete] = useState(false)

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Alle' || p.category === selectedCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Cart functions
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const clearCart = () => setCart([])

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const btw = subtotal * 0.21
  const total = subtotal + btw
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const cashGivenNum = parseFloat(cashGiven) || 0
  const change = cashGivenNum - total

  const handlePayment = () => {
    if (paymentMethod === 'cash' && cashGivenNum < total) return
    setPaymentComplete(true)
    setScreen('receipt')
  }

  const handleNewTransaction = () => {
    setCart([])
    setPaymentMethod(null)
    setCashGiven('')
    setPaymentComplete(false)
    setScreen('register')
  }

  // --- RECEIPT SCREEN ---
  if (screen === 'receipt') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Betaling Geslaagd!</h2>
            <p className="text-gray-500 mt-1">
              Betaald met{' '}
              {paymentMethod === 'cash' ? 'Contant' : paymentMethod === 'card' ? 'Pinpas' : 'Contactloos'}
            </p>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-700">Bon</h3>
            </div>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm text-gray-600">
                  <span>
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-medium">€{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotaal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>BTW (21%)</span>
              <span>€{btw.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-800">
              <span>Totaal</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            {paymentMethod === 'cash' && (
              <>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Ontvangen</span>
                  <span>€{cashGivenNum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-green-600">
                  <span>Wisselgeld</span>
                  <span>€{change.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleNewTransaction}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Nieuwe Transactie
          </button>
        </div>
      </div>
    )
  }

  // --- PAYMENT SCREEN ---
  if (screen === 'payment') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
          <button
            onClick={() => {
              setScreen('register')
              setPaymentMethod(null)
              setCashGiven('')
            }}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Terug naar kassa</span>
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Afrekenen</h2>
          <p className="text-gray-500 mb-6">{totalItems} artikel(en) in winkelwagen</p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Subtotaal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>BTW (21%)</span>
              <span>€{btw.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-800 border-t border-gray-200 pt-2">
              <span>Totaal</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-700 mb-3">Kies betaalmethode</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'cash'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <Banknote className="w-8 h-8" />
              <span className="text-sm font-medium">Contant</span>
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <CreditCard className="w-8 h-8" />
              <span className="text-sm font-medium">Pinpas</span>
            </button>
            <button
              onClick={() => setPaymentMethod('contactless')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'contactless'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <Smartphone className="w-8 h-8" />
              <span className="text-sm font-medium">Contactloos</span>
            </button>
          </div>

          {paymentMethod === 'cash' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ontvangen bedrag (€)
              </label>
              <input
                type="number"
                value={cashGiven}
                onChange={(e) => setCashGiven(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {cashGivenNum > 0 && cashGivenNum >= total && (
                <p className="mt-2 text-green-600 font-medium">
                  Wisselgeld: €{change.toFixed(2)}
                </p>
              )}
              {cashGivenNum > 0 && cashGivenNum < total && (
                <p className="mt-2 text-red-500 font-medium">Onvoldoende bedrag</p>
              )}
              <div className="flex gap-2 mt-3 flex-wrap">
                {[5, 10, 20, 50].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setCashGiven(amount.toString())}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                  >
                    €{amount}
                  </button>
                ))}
                <button
                  onClick={() => setCashGiven(Math.ceil(total).toString())}
                  className="px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg text-sm font-medium text-green-700 transition-colors"
                >
                  Exact (€{Math.ceil(total)})
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={!paymentMethod || (paymentMethod === 'cash' && cashGivenNum < total)}
            className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-all ${
              !paymentMethod || (paymentMethod === 'cash' && cashGivenNum < total)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {!paymentMethod
              ? 'Kies een betaalmethode'
              : paymentMethod === 'cash' && cashGivenNum < total
              ? 'Onvoldoende bedrag'
              : `Betaal €${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    )
  }

  // --- MAIN REGISTER SCREEN ---
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AMSI Supermarkt</h1>
              <p className="text-blue-200 text-sm">Kassasysteem</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-blue-200 text-xs">Artikelen in wagen</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left side: Products */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search & Categories */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek artikelen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredProducts.map((product) => {
                const inCart = cart.find((item) => item.product.id === product.id)
                return (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className={`relative bg-white rounded-xl p-3 border-2 transition-all hover:shadow-md active:scale-95 text-left ${
                      inCart ? 'border-blue-400 shadow-sm' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    {inCart && (
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        {inCart.quantity}
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-lg mb-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://placehold.co/80x80/e2e8f0/64748b/png?text=?'
                      }}
                    />
                    <p className="text-sm font-medium text-gray-800 leading-tight line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-1">€{product.price.toFixed(2)}</p>
                  </button>
                )
              })}
            </div>
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Search className="w-12 h-12 mb-3" />
                <p className="text-lg font-medium">Geen artikelen gevonden</p>
                <p className="text-sm">Probeer een andere zoekterm of categorie</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Cart */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Winkelwagen
              </h2>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Leegmaken
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingCart className="w-16 h-16 mb-3 opacity-30" />
                <p className="font-medium">Winkelwagen is leeg</p>
                <p className="text-sm">Klik op artikelen om toe te voegen</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://placehold.co/48x48/e2e8f0/64748b/png?text=?'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-sm text-gray-500">€{item.product.price.toFixed(2)} / stuk</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-7 h-7 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-7 h-7 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-sm font-bold text-gray-800">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart footer / totals */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotaal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>BTW (21%)</span>
                <span>€{btw.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
                <span>Totaal</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setScreen('payment')}
              disabled={cart.length === 0}
              className={`w-full py-3.5 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                cart.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Afrekenen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
