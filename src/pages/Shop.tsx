import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useShop } from "@/contexts/ShopContext";

const Shop = () => {
  const { products, categories, loading } = useShop();
  const [active, setActive] = useState<string>("all");

  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Shop</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Browse my collection of courses, games, films, books, and more.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Button
            variant={active === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActive("all")}
            className="gap-2"
          >
            <ShoppingCart size={16} /> All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={active === cat.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActive(cat.key)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="shop-card">
              <div className="h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs capitalize">{product.category}</Badge>
                  <span className="text-lg font-bold text-primary">${product.price}</span>
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{product.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <Button
                  className="w-full gap-2"
                  onClick={() => toast.success(`"${product.title}" added to cart!`)}
                >
                  <ShoppingCart size={16} /> Add to Cart
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No products in this category yet.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
