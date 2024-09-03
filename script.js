document.addEventListener("DOMContentLoaded", function () {
  const addItemButton = document.getElementById("add-item");
  const printInvoiceButton = document.getElementById("print-invoice");
  const itemsBody = document.getElementById("items-body");
  const totalElem = document.getElementById("total");
  const gstElem = document.getElementById("gst");
  const cstElem = document.getElementById("cst");
  const grandTotalElem = document.getElementById("grand-total");

  const itemsList = [
    { name: "Rice", price: 40 },
    { name: "Wheat Flour", price: 50 },
    { name: "Sugar", price: 30 },
    { name: "Salt", price: 20 },
    { name: "Milk", price: 60 },
    { name: "Eggs", price: 70 },
    { name: "Butter", price: 80 },
    { name: "Cheese", price: 90 },
    { name: "Coffee", price: 100 },
    { name: "Tea", price: 110 },
    { name: "Pasta", price: 120 },
    { name: "Rice Bran Oil", price: 130 },
    { name: "Canned Tomatoes", price: 140 },
    { name: "Tomato Paste", price: 150 },
    { name: "Vegetable Oil", price: 160 },
    { name: "Soy Sauce", price: 170 },
    { name: "Vinegar", price: 180 },
    { name: "Honey", price: 190 },
    { name: "Peanut Butter", price: 200 },
    { name: "Jam", price: 210 },
    { name: "Bread", price: 220 },
  ];

  function calculateTotals() {
    let total = 0;
    const rows = itemsBody.querySelectorAll("tr");
    rows.forEach((row) => {
      const qty = parseFloat(row.querySelector(".qty").value) || 0;
      const price =
        parseFloat(row.querySelector(".price input")?.value) ||
        parseFloat(row.querySelector(".price").innerText) ||
        0;
      const rowTotal = qty * price;
      row.querySelector(".total").innerText = rowTotal.toFixed(2);
      total += rowTotal;
    });
    const gst = total * 0.025;
    const cst = total * 0.025;
    const grandTotal = total + gst + cst;
    totalElem.innerText = total.toFixed(2);
    gstElem.innerText = gst.toFixed(2);
    cstElem.innerText = cst.toFixed(2);
    grandTotalElem.innerText = grandTotal.toFixed(2);
  }

  function addItemToTable(name, price, qty) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td><input type="number" class="qty" value="${qty}" min="1" step="1"></td>
      <td class="price">${price.toFixed(2)}</td>
      <td class="total">${(price * qty).toFixed(2)}</td>
    `;
    itemsBody.appendChild(row);

    row.querySelector(".qty").addEventListener("input", calculateTotals);
    calculateTotals();
  }

  function showAddItemPrompt() {
    const name = prompt("Enter item name:");
    if (!name) return;

    const qty = parseFloat(prompt("Enter quantity:")) || 1;
    const price = parseFloat(prompt("Enter price:")) || 0;

    addItemToTable(name, price, qty);
  }

  function populateItemDropdown(selectElement) {
    selectElement.innerHTML = itemsList
      .map((item) => `<option value="${item.price}">${item.name}</option>`)
      .concat(`<option value="0">Item not Found</option>`)
      .join("");
  }

  addItemButton.addEventListener("click", function () {
    const row = document.createElement("tr");
    const itemSelect = document.createElement("select");
    populateItemDropdown(itemSelect);

    row.innerHTML = `
      <td></td>
      <td><input type="number" class="qty" value="1" min="1" step="1"></td>
      <td class="price">${itemsList[0].price.toFixed(2)}</td>
      <td class="total">${itemsList[0].price.toFixed(2)}</td>
    `;
    row.querySelector("td").appendChild(itemSelect);
    itemsBody.appendChild(row);

    itemSelect.addEventListener("change", function () {
      const selectedPrice = parseFloat(this.value);
      if (selectedPrice === 0) {
        // Handle "Add Item" prompt
        showAddItemPrompt();
        itemsBody.removeChild(row); // Remove the current row
      } else {
        row.querySelector(".price").innerText = selectedPrice.toFixed(2);
        calculateTotals();
      }
    });

    row.querySelector(".qty").addEventListener("input", calculateTotals);
    calculateTotals();
  });

  printInvoiceButton.addEventListener("click", function () {
    calculateTotals(); // Ensure totals are updated before generating the PDF

    // Hide buttons while generating PDF
    addItemButton.style.display = "none";
    printInvoiceButton.style.display = "none";

    const element = document.getElementById("invoice");
    const opt = {
      margin: 0.5,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .from(element)
      .set(opt)
      .toPdf()
      .output("blob")
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        URL.revokeObjectURL(url);

        // Show buttons again after PDF is generated
        addItemButton.style.display = "block";
        printInvoiceButton.style.display = "block";
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        // Show buttons again in case of error
        addItemButton.style.display = "block";
        printInvoiceButton.style.display = "block";
      });
  });

  // Initial setup
  populateItemDropdown(document.createElement("select"));
});
