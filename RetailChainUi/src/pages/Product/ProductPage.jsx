import React from "react";
import ProductHeader from "./components/ProductHeader/ProductHeader";
import ProductFilter from "./components/FilterBar/ProductFilter";
import ProductTable from "./components/ProductTable/ProductTable";

// Mock Data from template
const MOCK_PRODUCTS = [
  {
    name: "Organic Almond Milk",
    sku: "SKU-892210",
    category: "Dairy Alternatives",
    unit: "1L Carton",
    price: "$3.50",
    status: "Active",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXHNTo7Wu3fAe8jReq5k2HyNNHKJyHeKoIfMSzt6J1pH1U0mx8oLhlfhFzxbwJ8491F3016VoXsqo9588qFyr2WNl9Jn1q5SQ9NMhocNIj6UpeETageuEP03YKRAWhiy3Lj77_dcdnMZZbGmSi58gXdtKxB1-TSJNy2xrRaScVEHwn-EpQCK3oMaVuBmUKHxECD7FNfkyCroGj0Pxcp-sHcZcr70AK52V4swPD8H5sResTfGq9RzwmBNy-Y-9wGInx65a231XApx0"
  },
  {
    name: "Premium Coffee Beans",
    sku: "SKU-892211",
    category: "Beverages",
    unit: "500g Bag",
    price: "$12.00",
    status: "Low Stock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAddAJiSlcDagEZqRY2EJ_uFJqYrkRiTlghy3CCoDkFXTpFKygMrQTOYrZbunb-gr8PSbl_0km5IL4xClYECpFmuhsZbBECICeWUap_yzGZkFyP2_WGUR__F099b7xEzk3Yye3b_6wIB1fZLSielqtZZq4jtph_-UREJmr8Jv4YW_OtH1tGLy0_JtUzxeDGtpnqFKJS9fl1mrvgd5y5s7Ae2GSrhaZCfAzT2tJnP7Q1IHHhYofMqO9sarr8yHmzj814gmC1bQdFFys"
  },
  {
    name: "Sourdough Bread",
    sku: "SKU-892212",
    category: "Bakery",
    unit: "Loaf",
    price: "$4.25",
    status: "Discontinued",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwVoBW_7MCqHIV0fKYjyLXpwvu7cRU-KhUE-zo-S543cVjhljXIJrNZYLbotS4tUZzZASf58KVK4FDIhvzRmCkk_n1MsocE53IIWWEmbqk55ErJOd04tMqkxhKIX3X0tmSC6WjfD8kwXYrq98xRYaLnOWSMtYhZ-GNNYMYz5U_bTO1aJMBj2IbBmpZ6GurMJdHvypnmBfnNb9pD4AQ4Fjb_OGCCBQcqFJB-qceVcSBrzfjUNGgUYzL9ZoEsHCLQQ4mEvDLN-aJgg"
  },
  {
    name: "Extra Virgin Olive Oil",
    sku: "SKU-892214",
    category: "Pantry",
    unit: "750ml Bottle",
    price: "$15.50",
    status: "Active",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAirAmRzQGwrxf1K65yET4U-JkGHWbqDBPWdAleGtJLEXBZDyWA5V8unXOBCdLQ5gEYjTh3VddD5lLfWPvXYTJg-2dG0Vm2o6mdhs8M6yXDyOqnfbmoFvGMHREtCUC5jpG79IM546o-oMKC9t0qGOlsEIFrD4JyGrRL8ja4GW2C7xtu4XBv3tiGG6hGMamya5wO74DkFyOckBYwKJ547ZKRlb6xNOINYsirZfAaWuE5oEfHWljJwK7DMhogTOA6eD6PsD3Yy2Jr9rs"
  },
  {
    name: "Free Range Eggs",
    sku: "SKU-892215",
    category: "Dairy & Eggs",
    unit: "Dozen",
    price: "$5.20",
    status: "Active",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9DZ2q9WyY6m61WAy4VPdaluR4BLMX5DD1FzKXMTyWUC9buS8CyqJzYHwnY8vOyWp1x5sDxL59Kj1KbfU3847oJQr_Hpxke_YH3jDs4Dhq2igh68EXH7F_PMaaU1ZykjGR_Vvy4oQ1-jFBhov7bFkbphoWLPaBED5F1-FAMEnyNTrYWTTob7esW4DYRNuTr_Lq_jfguSfa8Tv8LSRnfN4nqDzeeze0b0p6_AEuUW56TTzpmMv3AU3yBfCw8nr9TjF0L0bSszcmaYs"
  }
];

const ProductPage = () => {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <ProductHeader />
      <ProductFilter />
      <ProductTable products={MOCK_PRODUCTS} />
    </div>
  );
};

export default ProductPage;
