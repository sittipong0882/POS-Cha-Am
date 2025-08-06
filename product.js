document.addEventListener("DOMContentLoaded", function () {
  const productForm = document.getElementById("addProductForm");
  const productTable = document.getElementById("productTable");

  function loadProducts() {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    productTable.innerHTML = "";
    products.forEach((p, i) => {
      const row = `<tr>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>${p.stock}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteProduct(${i})">ลบ</button></td>
      </tr>`;
      productTable.innerHTML += row;
    });
  }

  window.deleteProduct = function (index) {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
  };

  productForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const stock = parseInt(document.getElementById("productStock").value);

    const products = JSON.parse(localStorage.getItem("products") || "[]");
    products.push({ name, price, stock });
    localStorage.setItem("products", JSON.stringify(products));
    productForm.reset();
    loadProducts();
  });

  loadProducts();
});