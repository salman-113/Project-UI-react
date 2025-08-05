import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* 🟣 Hero Section */}
      <section className="bg-pink-100 py-16 px-6 text-center ">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-700 mb-4">Welcome to GlamCart</h1>
        <p className="text-lg md:text-xl mb-6">
          Discover trendy & elegant women’s tops for every mood & occasion.
        </p>
        <Link
          to="/products"
          className="inline-block bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition"
        >
          Shop Now
        </Link>
      </section>

      {/* 🟣 Categories Section */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {["T-Shirts", "Tops", "Tank Tops", "Jackets"].map((cat, i) => (
            <div key={i} className="bg-pink-50 py-6 rounded shadow hover:shadow-lg transition">
              <p className="text-lg font-semibold text-pink-700">{cat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🟣 About Section */}
      <section className="py-12 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-pink-600">Why GlamCart?</h2>
          <p className="text-gray-700 text-md leading-relaxed">
            GlamCart is your one-stop fashion destination for modern women’s topwear.
            From casual crop tops to formal blouses and trendy jackets, we bring you
            hand-picked collections made with love and comfort. ✨
          </p>
        </div>
      </section>

      {/* 🟣 Call to Action */}
      <section className="py-10 px-6 text-center">
        <h3 className="text-xl font-semibold mb-3">Don’t miss out on new arrivals!</h3>
        <Link
          to="/products"
          className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition"
        >
          Explore Products
        </Link>
      </section>
    </div>
  );
};

export default Home;
