/*************************************************
 * PRICING CALCULATOR + TAX + BONUS
 *************************************************/

const TAX_RATE = 0.11;

/* ========== PRODUCT MASTER ========== */
const products = [
  { sku:"8085", category:"BPM", displayName:"HEM-7120", price:408000, specialDiscount:0.20, qty:0, bonus:0 },
  { sku:"4682", category:"NEBU", displayName:"NE-C28", price:619500, specialDiscount:0.125, qty:0, bonus:0 },
  { sku:"E245", category:"EFT", displayName:"MC-246", price:56880, specialDiscount:0.058, qty:0, bonus:0 },
  { sku:"6865", category:"BPM", displayName:"Adaptor BPM", price:98011, specialDiscount:0.00, qty:0, bonus:0 }
];

/* ========== DOM ========== */
const tbody = document.getElementById("tableBody");
const totalPriceEl = document.getElementById("totalPrice");
const totalFinalEl = document.getElementById("totalFinal");
const totalBonusEl = document.getElementById("totalBonus");

/* ========== HELPERS ========== */
function countCategories() {
  return new Set(products.filter(p => p.qty > 0).map(p => p.category)).size;
}

function grossTotal() {
  return products.reduce((sum, p) => sum + p.qty * p.price, 0);
}

function promoActive() {
  return grossTotal() >= 850000 && countCategories() >= 2;
}

function getDiscountRate(p) {
  if (p.qty <= 0) return 0;
  if (!promoActive()) return 0.02;
  return p.specialDiscount;
}

/* ========== RENDER ========== */
function render() {
  tbody.innerHTML = "";

  let totalPrice = 0;
  let totalFinal = 0;
  let totalBonus = 0;

  products.forEach(p => {
    const discountRate = getDiscountRate(p);
    const base = p.qty * p.price;
    const discounted = base * (1 - discountRate);
    const finalWithTax = discounted * (1 + TAX_RATE);

    totalPrice += base;
    totalFinal += finalWithTax;
    totalBonus += p.bonus;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.sku}</td>
      <td>${p.displayName}</td>
      <td>
        <button onclick="changeQty('${p.sku}', -1)">−</button>
        ${p.qty}
        <button onclick="changeQty('${p.sku}', 1)">+</button>
      </td>
      <td>${p.price.toLocaleString("id-ID")}</td>
      <td>${(discountRate * 100).toFixed(2)}%</td>
      <td>${finalWithTax.toLocaleString("id-ID")}</td>
      <td>${p.bonus}</td>
    `;
    tbody.appendChild(tr);
  });

  totalPriceEl.innerText = totalPrice.toLocaleString("id-ID");
  totalFinalEl.innerText = totalFinal.toLocaleString("id-ID");
  totalBonusEl.innerText = totalBonus;
}

/* ========== ACTION ========== */
function changeQty(sku, delta) {
  const p = products.find(x => x.sku === sku);
  if (!p) return;
  p.qty = Math.max(0, p.qty + delta);
  render();
}

/* ========== INIT ========== */
render();
