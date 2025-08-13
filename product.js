document.addEventListener("DOMContentLoaded", function () {
  const productForm = document.getElementById("addProductForm");
  const productTable = document.getElementById("productTable");
  const productImageInput = document.getElementById("productImage");
  let imageBase64 = "";

  // แสดง preview รูปเมื่อเลือกไฟล์
  productImageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) {
      imageBase64 = "";
      document.getElementById("previewImage").style.display = "none";
      return;
    }
    const reader = new FileReader();
    reader.onload = function (evt) {
      imageBase64 = evt.target.result;
      document.getElementById("previewImage").src = imageBase64;
      document.getElementById("previewImage").style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  function loadProducts() {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    productTable.innerHTML = "";
    products.forEach((p, i) => {
      const row = `<tr>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>${p.stock}</td>
        <td>${p.image ? `<img src="${p.image}" style="max-width:60px;max-height:60px;">` : ""}</td>
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
    products.push({ name, price, stock, image: imageBase64 });
    localStorage.setItem("products", JSON.stringify(products));
    productForm.reset();
    imageBase64 = "";
    document.getElementById("previewImage").style.display = "none";
    loadProducts();
  });

  loadProducts();
});