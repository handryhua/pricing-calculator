/*************************************************
 * PRICING CALCULATOR - FINAL WITH BONUS & SORTING
 *************************************************/

const TAX_RATE = 0.11;
const BONUS_THRESHOLD = 850000;

/* ========== PRODUCT MASTER ========== */
const products = [
  { sku:"8085", category:"BPM", name:"HEM-7120", price:408000, maxDiscount:0.20, qty:0, bonusQty:0 },
  { sku:"4682", category:"NEBU", name:"NE-C28", price:619500, maxDiscount:0.125, qty:0, bonusQty:0 },
  { sku:"E245", category:"EFT", name:"MC-246", price:56880, maxDiscount:0.058, qty:0, bonusQty:0 },
  { sku:"6865", category:"BPM", name:"Adaptor BPM", price:98011, maxDiscount:0.00, qty:0, bonusQty:0 }
];

/* ========== DOM ========== */
const tbody = document.getElementById("tableBody");
const totalPriceEl = document.getElementById("totalPrice");
const totalFinalEl = document.getElementById("totalFinal");
const totalBonusEl = document.getElementById("totalBonus");
const balanceBonusEl = document.getElementById("balanceBonus");

/* ========== HELPERS ========== */
function countCategories() {
  return new Set(products.filter(p => p.qty > 0).map(p => p.category)).size;
}

function total() {
  return products.reduce((sum, p) => sum + p.qty * p.price, 0);
}

function promoActive() {
  return total() >= BONUS_THRESHOLD && countCategories() >= 2;
}

function getDiscount(p) {
  if (p.qty <= 0) return 0;
  if (!promoActive()) return 0.02;
  return p.maxDiscount;
}

function balanceBonus() {
  if (!promoActive()) return 0;
  return total() - products.reduce((sum, p) => sum + p.bonusQty * p.price, 0);
}

/* ========== SORTING ========== */
function sortProducts() {
  products.sort((a, b) => {
    if (a.category !== b.category)
      return a.category.localeCompare(b.category);
    if ((a.qty > 0) !== (b.qty > 0))
      return b.qty - a.qty;
    return a.name.localeCompare(b.name);
  });
}

/* ========== RENDER ========== */
function render() {
  tbody.innerHTML = "";
  sortProducts();

  let totalPrice = 0;
  let totalFinal = 0;
  let totalBonus = 0;

  products.forEach(p => {
    const discount = getDiscount(p);
    const base = p.qty * p.price;
    const final = base * (1 - discount) * (1 + TAX_RATE);

    totalPrice += base;
    totalFinal += final;
    totalBonus += p.bonusQty;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.sku}</td>
      <td>${p.name}</td>
      <td>
        <button onclick="changeQty('${p.sku}', -1)">−</button>
        ${p.qty}
        <button onclick="changeQty('${p.sku}', 1)">+</button>
      </td>
      <td>${p.price.toLocaleString("id-ID")}</td>
      <td>${(discount * 100).toFixed(2)}%</td>
      <td>${final.toLocaleString("id-ID")}</td>
      <td>
        <button onclick="changeBonus('${p.sku}', -1)">−</button>
        ${p.bonusQty}
        <button onclick="changeBonus('${p.sku}', 1)">+</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  totalPriceEl.innerText = totalPrice.toLocaleString("id-ID");
  totalFinalEl.innerText = totalFinal.toLocaleString("id-ID");
  totalBonusEl.innerText = totalBonus;
  balanceBonusEl.innerText = balanceBonus().toLocaleString("id-ID");
}

/* ========== ACTIONS ========== */
function changeQty(sku, delta) {
  const p = products.find(x => x.sku === sku);
  if (!p) return;
  p.qty = Math.max(0, p.qty + delta);
  render();
}

function changeBonus(sku, delta) {
  const p = products.find(x => x.sku === sku);
  if (!p) return;

  const newBonus = p.bonusQty + delta;
  if (newBonus < 0) return;

  // cek balance bonus cukup
  if (delta > 0 && balanceBonus() < p.price) return;

  p.bonusQty = newBonus;
  render();
}

/* ========== INIT ========== */
render();
