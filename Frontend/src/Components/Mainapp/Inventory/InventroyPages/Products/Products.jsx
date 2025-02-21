import React, { useEffect, useState } from "react";
import ProductsNavlinks from "./ProductsNavlinks";
import { Route, Routes } from "react-router-dom";
import CreateProducts from "./CreateProducts";
import ProductsList from "./ProductsList";

const Products = () => {
  const [isselected, setIsSelected] = useState(0);

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedDealersIndex", isselected);
  }, [isselected]);

  return (
    <>
      <div className="product-container w100 h1 d-flex-col">
        <div className="Product-navigation w100 h10 d-flex bg3">
          <ProductsNavlinks
            isselected={isselected}
            setIsSelected={setIsSelected}
          />
        </div>
        <div className="product-views w100 h90 d-flex center">
          {/* <ProductsNavViews index={isselected} /> */}
          <Routes>
            <Route path="list" element={<ProductsList />} />
            <Route path="add-product" element={<CreateProducts />} />
            <Route path="*" element={<ProductsList />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Products;
