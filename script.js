/*************************************************
 * PRICING CALCULATOR – FINAL (FULL PRODUCT)
 *************************************************/

const TAX_RATE = 0.11;
const PROMO_MIN = 850000;

/* ========== PRODUCT MASTER (LENGKAP) ========== */
const products = [
  // BCM
  { sku:"8504", category:"BCM", name:"HN-289-EBK", price:227739, maxDiscount:0.0625, qty:0, bonusQty:0 },
  { sku:"8091", category:"BCM", name:"HBF-214-AP", price:1229500, maxDiscount:0.1667, qty:0, bonusQty:0 },
  { sku:"6830", category:"BCM", name:"HBF-375-AP", price:1641320, maxDiscount:0.11, qty:0, bonusQty:0 },

  // BPM
  { sku:"E658", category:"BPM", name:"HEM-7142T2-AP2", price:412000, maxDiscount:0.20, qty:0, bonusQty:0 },
  { sku:"8085", category:"BPM", name:"HEM-7120", price:408000, maxDiscount:0.20, qty:0, bonusQty:0 },
  { sku:"B813", category:"BPM", name:"HEM-7156AAP", price:685000, maxDiscount:0.08, qty:0, bonusQty:0 },
  { sku:"E250", category:"BPM", name:"HEM-7156-AP", price:577280, maxDiscount:0.08, qty:0, bonusQty:0 },
  { sku:"D526", category:"BPM", name:"HEM-7156T-AP", price:619500, maxDiscount:0.08, qty:0, bonusQty:0 },
  { sku:"D239", category:"BPM", name:"HEM-7156T-AAP", price:783000, maxDiscount:0.08, qty:0, bonusQty:0 },
  { sku:"F140", category:"BPM", name:"HEM-7383T1-AP", price:1230000, maxDiscount:0.0625, qty:0, bonusQty:0 },
  { sku:"E670", category:"BPM", name:"HEM-7157-AP3[JPN750]", price:702512, maxDiscount:0.10, qty:0, bonusQty:0 },
  { sku:"E457", category:"BPM", name:"HEM-7530T-AP3", price:2492440, maxDiscount:0.11, qty:0, bonusQty:0 },

  // NEBU
  { sku:"4682", category:"NEBU", name:"NE-C28", price:619500, maxDiscount:0.125, qty:0, bonusQty:0 },
  { sku:"D252", category:"NEBU", name:"NE-C28-C1", price:619500, maxDiscount:0.125, qty:0, bonusQty:0 },
  { sku:"B292", category:"NEBU", name:"NE-C101-AP", price:429250, maxDiscount:0.10, qty:0, bonusQty:0 },
  { sku:"7727", category:"NEBU", name:"NE-C801S-AP", price:468500, maxDiscount:0.11, qty:0, bonusQty:0 },

  // EFT
  { sku:"E245", category:"EFT", name:"MC-246-AP4", price:56880, maxDiscount:0.058, qty:0, bonusQty:0 },
  { sku:"E297", category:"EFT", name:"MC-341-AP4", price:59940, maxDiscount:0.09, qty:0, bonusQty:0 },
  { sku:"E089", category:"EFT", name:"MC-343F-AP4", price:78220, maxDiscount:0.047, qty:0, bonusQty:0 },
  { sku:"F139", category:"EFT", name:"MC-F300-AP", price:452000, maxDiscount:0.09, qty:0, bonusQty:0 },
  { sku:"8375", category:"EFT", name:"MC-523-AP", price:452153, maxDiscount:0.07, qty:0, bonusQty:0 },

  // TENS
  { sku:"B735", category:"TENS", name:"HV-F013-AP4", price:445493, maxDiscount:0.14, qty:0, bonusQty:0 },

  // ACCESSORY
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
  return total() >= PROMO_MIN && countCategories() >= 2;
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

  const next = p.bonusQty + delta;
  if (next < 0) return;

  if (delta > 0 && balanceBonus() < p.price) return;

  p.bonusQty = next;
  render();
}

/* ========== INIT ========== */
render();
