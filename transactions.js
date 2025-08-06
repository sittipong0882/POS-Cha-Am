document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("transactionsContainer");
  const totalIncome = document.getElementById("totalIncome");
  const totalExpense = document.getElementById("totalExpense");

  const buttons = {
    today: document.getElementById("filterToday"),
    yesterday: document.getElementById("filterYesterday"),
    week: document.getElementById("filter7days"),
    all: document.getElementById("filterAll")
  };

  function groupByDate(transactions) {
    const groups = {};
    transactions.forEach(t => {
      const day = t.date.split(",")[0].trim(); // ตัดเฉพาะวันที่
      if (!groups[day]) groups[day] = [];
      groups[day].push(t);
    });
    return groups;
  }

  function isSameDate(d1, d2) {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }

  function isWithinNDays(dateObj, n) {
    const now = new Date();
    const diffTime = now - dateObj;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= n;
  }

  function loadTransactions(filter = "today") {
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    let income = 0, expense = 0;
    container.innerHTML = "";

    const grouped = groupByDate(transactions);

    // เรียงวันที่จากใหม่ไปเก่า
    const sortedDates = Object.keys(grouped).sort((a, b) => {
      const [d1, m1, y1] = a.split("/");
      const [d2, m2, y2] = b.split("/");
      return new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1);
    });

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    sortedDates.forEach(day => {
      const [d, m, y] = day.split("/");
      const dateObj = new Date(y, m - 1, d);

      // กรองตามช่วงวันที่ที่เลือก
      if (
        (filter === "today" && !isSameDate(dateObj, today)) ||
        (filter === "yesterday" && !isSameDate(dateObj, yesterday)) ||
        (filter === "7days" && !isWithinNDays(dateObj, 7)) // ถ้าเกิน 7 วันจะถูกข้าม
      ) {
        return; // ข้ามไม่แสดง
      }

      const dailyTransactions = grouped[day];

      let tableHTML = `
        <h3>วันที่: ${day}</h3>
        <table class="table table-bordered table-hover mb-4">
          <thead>
            <tr>
              <th>ประเภท</th>
              <th>จำนวนเงิน</th>
              <th>รายละเอียดสินค้า / รายละเอียด</th>
              <th>เวลา</th>
            </tr>
          </thead>
          <tbody>
      `;

      dailyTransactions.forEach(t => {
        let detailHTML = "";
        if (t.type === "income" && Array.isArray(t.products)) {
          detailHTML += "<ul class='mb-0 ps-3'>";
          t.products.forEach(p => {
            detailHTML += `<li>${p.name} x ${p.qty}</li>`;
          });
          detailHTML += "</ul>";
        } else {
          detailHTML = t.detail || "-";
        }

        const time = t.date.split(",")[1]?.trim() || "";

        tableHTML += `
          <tr>
            <td>${t.type === "income" ? "รายรับ" : "รายจ่าย"}</td>
            <td>${t.amount.toFixed(2)}</td>
            <td>${detailHTML}</td>
            <td>${time}</td>
          </tr>
        `;

        if (t.type === "income") income += t.amount;
        else expense += t.amount;
      });

      tableHTML += "</tbody></table>";
      container.innerHTML += tableHTML;
    });

    totalIncome.textContent = income.toFixed(2);
    totalExpense.textContent = expense.toFixed(2);
  }

  // โหลดเริ่มต้นเป็น "วันนี้"
  loadTransactions("today");

  // เชื่อมปุ่มกับฟังก์ชันกรอง
  buttons.today.addEventListener("click", () => loadTransactions("today"));
  buttons.yesterday.addEventListener("click", () => loadTransactions("yesterday"));
  buttons.week.addEventListener("click", () => loadTransactions("7days"));
  buttons.all.addEventListener("click", () => loadTransactions("all"));
});
