document.addEventListener("DOMContentLoaded", function () {
  const productList = document.getElementById("productList");
  const cartTable = document.getElementById("cartTable");
  const totalAmount = document.getElementById("totalAmount");
  const checkoutBtn = document.getElementById("checkoutBtn");

  function loadProducts() {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    productList.innerHTML = "";
    products.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "col-md-3 mb-2";
      card.innerHTML = `
        <div class="card p-2">
          <h5 style="color: black;">${p.name}</h5>
          <p>ราคา: ${p.price} บาท<br>คงเหลือ: ${p.stock}</p>
          <button class="btn btn-primary btn-sm" onclick="addToCart(${i})">เพิ่มลงตะกร้า</button>
        </div>
      `;
      productList.appendChild(card);
    });
  }

  window.addToCart = function (index) {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const product = products[index];

    if (product.stock <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'สินค้าในสต็อกหมดแล้ว',
        text: `สินค้าชื่อ "${product.name}" หมดสต็อก กรุณาเลือกสินค้าอื่น`,
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    const found = cart.find(c => c.name === product.name);
    if (found) {
      found.quantity += 1;
    } else {
      cart.push({ name: product.name, price: product.price, quantity: 1 });
    }

    product.stock -= 1;
    products[index] = product;

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("products", JSON.stringify(products));
    renderCart();
    loadProducts();
  };


  window.removeFromCart = function (index) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const item = cart[index];
    const product = products.find(p => p.name === item.name);
    if (product) product.stock += item.quantity;

    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("products", JSON.stringify(products));
    renderCart();
    loadProducts();
  };

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cartTable.innerHTML = "";
    let total = 0;
    cart.forEach((item, i) => {
      const sum = item.price * item.quantity;
      total += sum;
      cartTable.innerHTML += `<tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${sum.toFixed(2)}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${i})">ลบ</button></td>
      </tr>`;
    });
    totalAmount.textContent = total.toFixed(2);
  }

  checkoutBtn.addEventListener("click", function () {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'ตะกร้าว่างเปล่า',
        text: 'ยังไม่มีสินค้าในตะกร้า กรุณาเพิ่มสินค้าก่อนชำระเงิน',
        confirmButtonText: 'ตกลง',
        timer: 3000,
        timerProgressBar: true
      });
      return;
    }

    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    const date = new Date().toLocaleString();
    const total = parseFloat(totalAmount.textContent);

    transactions.push({
      type: "income",
      amount: total,
      products: cart.map(item => ({
        name: item.name,
        qty: item.quantity,
        price: item.price
      })),
      date
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.removeItem("cart");
    renderCart();

    Swal.fire({
      icon: 'success',
      title: 'ทำรายการสำเร็จ',
      text: `ชำระเงินรวม ${total.toFixed(2)} บาทเรียบร้อยแล้ว`,
      confirmButtonText: 'ขอบคุณ',
      timer: 3000,
      timerProgressBar: true
    });

    loadProducts();
  });


  renderCart();
  loadProducts();
});
