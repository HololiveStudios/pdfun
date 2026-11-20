import React, { useState, useEffect, createContext, useContext } from 'react';
import { Book, ShoppingCart, User, Upload, LogOut, Lock, Check, Menu, X } from 'lucide-react';

// Context para autenticação e dados globais
const AppContext = createContext(null);

// Simulação do Firebase (em produção, usar Firebase SDK real)
const mockFirebase = {
  currentUser: null,
  users: [
    { id: '1', email: 'user@test.com', password: '123456', purchases: ['1'] }
  ],
  products: [
    {
      id: '1',
      title: 'Matemática Avançada',
      author: 'Prof. João Silva',
      description: 'Guia completo de cálculo diferencial e integral',
      price: 49.90,
      format: 'PDF',
      coverUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=600&fit=crop',
      fileUrl: 'mock-file-1.pdf'
    },
    {
      id: '2',
      title: 'Física Quântica Essencial',
      author: 'Dra. Maria Santos',
      description: 'Fundamentos da mecânica quântica para estudantes',
      price: 59.90,
      format: 'EPUB',
      coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=600&fit=crop',
      fileUrl: 'mock-file-2.epub'
    },
    {
      id: '3',
      title: 'Programação em Python',
      author: 'Carlos Oliveira',
      description: 'Do básico ao avançado em Python',
      price: 39.90,
      format: 'PDF',
      coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop',
      fileUrl: 'mock-file-3.pdf'
    },
    {
      id: '4',
      title: 'Química Orgânica',
      author: 'Prof. Ana Costa',
      description: 'Reações e mecanismos orgânicos explicados',
      price: 44.90,
      format: 'MOBI',
      coverUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=600&fit=crop',
      fileUrl: 'mock-file-4.mobi'
    }
  ]
};

// Hook customizado para gerenciar estado global
const useApp = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(mockFirebase.products);
  const [currentPage, setCurrentPage] = useState('store');
  const [cart, setCart] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Simular verificação de sessão
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password) => {
    const foundUser = mockFirebase.users.find(
      u => u.email === email && u.password === password
    );
    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Credenciais inválidas' };
  };

  const register = async (email, password) => {
    const exists = mockFirebase.users.find(u => u.email === email);
    if (exists) {
      return { success: false, error: 'Email já cadastrado' };
    }
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      purchases: []
    };
    mockFirebase.users.push(newUser);
    const userData = { ...newUser };
    delete userData.password;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage('store');
  };

  const purchaseProduct = (productId) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      purchases: [...(user.purchases || []), productId]
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Atualizar no mock
    const userIndex = mockFirebase.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockFirebase.users[userIndex].purchases.push(productId);
    }
  };

  const hasAccess = (productId) => {
    return user?.purchases?.includes(productId) || false;
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    mockFirebase.products.push(newProduct);
    setProducts([...mockFirebase.products]);
  };

  return {
    user,
    products,
    currentPage,
    setCurrentPage,
    login,
    register,
    logout,
    purchaseProduct,
    hasAccess,
    addProduct,
    cart,
    setCart,
    mobileMenuOpen,
    setMobileMenuOpen
  };
};

// Componente de Login/Registro
const AuthPage = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = isLogin 
      ? await onLogin(email, password)
      : await onRegister(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-3 rounded-full">
            <Book className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          {isLogin ? 'Bem-vindo!' : 'Criar Conta'}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {isLogin ? 'Entre para acessar seus eBooks' : 'Cadastre-se para começar'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
          </button>
        </div>

        {isLogin && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
            <p className="font-semibold mb-1">Usuário de teste:</p>
            <p>Email: user@test.com</p>
            <p>Senha: 123456</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Card de Produto
const ProductCard = ({ product, hasAccess, onPurchase, onView }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.coverUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {hasAccess && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Check className="w-3 h-3" />
            Adquirido
          </div>
        )}
        {!hasAccess && (
          <div className="absolute top-3 right-3 bg-gray-900 bg-opacity-80 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Bloqueado
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.author}</p>
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500">Formato: {product.format}</span>
            <p className="text-2xl font-bold text-indigo-600">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
          
          {hasAccess ? (
            <button
              onClick={() => onView(product)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Abrir
            </button>
          ) : (
            <button
              onClick={() => onPurchase(product)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Comprar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente da Loja
const StorePage = ({ products, hasAccess, onPurchase, onView }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Loja de eBooks</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            hasAccess={hasAccess(product.id)}
            onPurchase={onPurchase}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
};

// Componente Meus Livros
const MyBooksPage = ({ products, userPurchases, onView }) => {
  const myBooks = products.filter(p => userPurchases?.includes(p.id));

  if (myBooks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Meus Livros</h1>
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Nenhum livro adquirido ainda
          </h2>
          <p className="text-gray-600">
            Explore nossa loja e adquira seus primeiros eBooks!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Meus Livros</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {myBooks.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            hasAccess={true}
            onPurchase={() => {}}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
};

// Componente Admin Upload
const AdminPage = ({ onAddProduct }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [format, setFormat] = useState('PDF');
  const [coverUrl, setCoverUrl] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onAddProduct({
      title,
      author,
      description,
      price: parseFloat(price),
      format,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
      fileUrl: `mock-file-${Date.now()}.${format.toLowerCase()}`
    });

    setSuccess(true);
    setTitle('');
    setAuthor('');
    setDescription('');
    setPrice('');
    setCoverUrl('');
    
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin - Upload de eBooks</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-8">
        {success && (
          <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            eBook adicionado com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do eBook
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Autor
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option>PDF</option>
                <option>EPUB</option>
                <option>MOBI</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da Capa (opcional)
            </label>
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="https://exemplo.com/capa.jpg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Adicionar eBook
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p className="font-semibold mb-2">Nota:</p>
          <p>Em produção, o arquivo seria enviado para o Firebase Storage. Esta é uma simulação funcional.</p>
        </div>
      </div>
    </div>
  );
};

// Modal de Compra
const PurchaseModal = ({ product, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirmar Compra</h2>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            <strong>{product.title}</strong>
          </p>
          <p className="text-gray-600 text-sm mb-4">por {product.author}</p>
          <p className="text-3xl font-bold text-indigo-600">
            R$ {product.price.toFixed(2)}
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-sm text-yellow-800">
          <p className="font-semibold mb-1">Pagamento Simulado</p>
          <p>Em produção, integraria com Stripe/PayPal. Clique em confirmar para simular a compra.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de Visualização
const ViewModal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{product.title}</h2>
            <p className="text-gray-600">{product.author}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <Book className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-700 mb-2">
              Visualizando: <strong>{product.fileUrl}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Em produção, o arquivo seria carregado do Firebase Storage com autenticação.
            </p>
            <p className="text-sm text-gray-600 mt-4">
              Formato: {product.format}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
const App = () => {
  const app = useApp();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  if (!app.user) {
    return <AuthPage onLogin={app.login} onRegister={app.register} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Book className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">eBook Store</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => app.setCurrentPage('store')}
                className={`font-medium transition ${
                  app.currentPage === 'store'
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Loja
              </button>
              <button
                onClick={() => app.setCurrentPage('mybooks')}
                className={`font-medium transition ${
                  app.currentPage === 'mybooks'
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Meus Livros
              </button>
              <button
                onClick={() => app.setCurrentPage('admin')}
                className={`font-medium transition ${
                  app.currentPage === 'admin'
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Admin
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                {app.user.email}
              </div>
              <button
                onClick={app.logout}
                className="hidden md:flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => app.setMobileMenuOpen(!app.mobileMenuOpen)}
                className="md:hidden text-gray-600"
              >
                {app.mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {app.mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t space-y-2">
              <button
                onClick={() => {
                  app.setCurrentPage('store');
                  app.setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium ${
                  app.currentPage === 'store'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Loja
              </button>
              <button
                onClick={() => {
                  app.setCurrentPage('mybooks');
                  app.setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium ${
                  app.currentPage === 'mybooks'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Meus Livros
              </button>
              <button
                onClick={() => {
                  app.setCurrentPage('admin');
                  app.setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium ${
                  app.currentPage === 'admin'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Admin
              </button>
              <div className="px-4 py-2 text-sm text-gray-600 border-t mt-2 pt-2">
                <User className="w-4 h-4 inline mr-2" />
                {app.user.email}
              </div>
              <button
                onClick={() => {
                  app.logout();
                  app.setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Sair
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Content */}
      <main>
        {app.currentPage === 'store' && (
          <StorePage
            products={app.products}
            hasAccess={app.hasAccess}
            onPurchase={setSelectedProduct}
            onView={setViewingProduct}
          />
        )}
        {app.currentPage === 'mybooks' && (
          <MyBooksPage
            products={app.products}
            userPurchases={app.user.purchases}
            onView={setViewingProduct}
          />
        )}
        {app.currentPage === 'admin' && (
          <AdminPage onAddProduct={app.addProduct} />
        )}
      </main>

      {/* Modals */}
      {selectedProduct && (
        <PurchaseModal
          product={selectedProduct}
          onConfirm={() => {
            app.purchaseProduct(selectedProduct.id);
            setSelectedProduct(null);
          }}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {viewingProduct && (
        <ViewModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}
    </div>
  );
};

export default App;