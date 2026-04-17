import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface ShopCategory {
  id: string;
  key: string;
  label: string;
}

const defaultCategories: ShopCategory[] = [
  { id: "cat-1", key: "courses", label: "Courses" },
  { id: "cat-2", key: "games", label: "Games" },
  { id: "cat-3", key: "films", label: "Films" },
  { id: "cat-4", key: "books", label: "Books" },
  { id: "cat-5", key: "video-short", label: "Video Short" },
  { id: "cat-6", key: "strategy-trading", label: "Strategy Trading" },
  { id: "cat-7", key: "holding", label: "Holding" },
  { id: "cat-8", key: "clothes", label: "Clothes" },
];

const defaultProducts: Product[] = [
  { id: "p1", title: "Complete Web Development Course", description: "Learn React, JavaScript, and modern web development from scratch.", price: 29.99, category: "courses", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop" },
  { id: "p2", title: "Pixel Adventure", description: "A retro-style platformer game with 50+ levels.", price: 9.99, category: "games", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop" },
  { id: "p3", title: "The Developer's Journey", description: "A documentary about the life of indie developers.", price: 7.99, category: "films", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=250&fit=crop" },
  { id: "p4", title: "Clean Code Handbook", description: "Best practices for writing maintainable and scalable code.", price: 15.99, category: "books", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop" },
];

interface ShopContextType {
  products: Product[];
  categories: ShopCategory[];
  loading: boolean;
  addProduct: (p: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (key: string, label: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<ShopCategory[]>(defaultCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodSnap, catSnap] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "categories")),
        ]);
        if (!prodSnap.empty) {
          setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
        }
        if (!catSnap.empty) {
          setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() } as ShopCategory)));
        }
      } catch {
        console.log("Using default shop data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addProduct = async (p: Omit<Product, "id">) => {
    try {
      const ref = await addDoc(collection(db, "products"), p);
      setProducts(prev => [...prev, { ...p, id: ref.id }]);
    } catch {
      const id = "local-" + Date.now();
      setProducts(prev => [...prev, { ...p, id }]);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      if (!id.startsWith("local-")) {
        await updateDoc(doc(db, "products", id), updates);
      }
    } catch {}
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = async (id: string) => {
    try {
      if (!id.startsWith("local-")) {
        await deleteDoc(doc(db, "products", id));
      }
    } catch {}
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCategory = async (key: string, label: string) => {
    try {
      const ref = await addDoc(collection(db, "categories"), { key, label });
      setCategories(prev => [...prev, { id: ref.id, key, label }]);
    } catch {
      setCategories(prev => [...prev, { id: "local-" + Date.now(), key, label }]);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      if (!id.startsWith("local-") && !id.startsWith("cat-")) {
        await deleteDoc(doc(db, "categories", id));
      }
    } catch {}
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <ShopContext.Provider value={{ products, categories, loading, addProduct, updateProduct, deleteProduct, addCategory, deleteCategory }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
};
