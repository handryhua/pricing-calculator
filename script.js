/*************************************************
 * PRICING CALCULATOR – MOBILE FINAL VERSION
 *************************************************/

const TAX_RATE = 0.11;
const PROMO_MIN = 850000;

/* ========= PRODUCT MASTER ========= */
const products = [
  // NORMAL PRODUCTS
  { sku:"E658", category:"BPM", name:"HEM-7142T2", price:412000, maxDiscount:0.20, qty:0, bonusQty:0, isBonus:false },
  { sku:"8085", category:"BPM", name:"HEM-7120", price:408000, maxDiscount:0.20, qty:0, bonusQty:0, isBonus:false },
  { sku:"4682", category:"NEBU", name:"NE-C28", price:619500, maxDiscount:0.125, qty:0, bonusQty:0, isBonus:false },
  { sku:"E245", category:"EFT", name:"MC-246", price:56880, maxDiscount:0.058, qty:0, bonusQty:0, isBonus:false },

  // BONUS PRODUCTS
  { sku:"BONUS-MC246", category:"EFT", name:"MC-246 (BONUS)", price:56880, maxDiscount:0, qty:0, bonusQty:0, isBonus:true },
  { sku:"BONUS-7120", category:"BPM", name:"HEM-7120 (BONUS)", price:408000, maxDiscount:0, qty:0, bonusQty:0, isBonus:true }
];

/* ========= DOM ========= */
const tbody = document.getElementById("tableBody");
const totalPriceEl = document.getElementById("totalPrice");
const floatingTotalFinalEl = document.getElementById("floatingTotalFinal");
const floatingBalanceBonusEl = document.getElementById("floatingBalanceBonus");

/* ========= HELPERS ========= */
function total() {
  return products
    .filter(p => !p.isBonus)
    .reduce((s, p) => s + p.qty * p.price, 0);
}

function countCategories() {
  return new Set(
    products.filter(p => p.qty > 0 && !p.isBonus).map(p => p.category)
  ).size;
}

function promoActive() {
  return total() >= PROMO_MIN && countCategories() >= 2;
}

function getDiscount(p) {
  if (p.isBonus || p.qty === 0) return 0;
  if (!promoActive()) return 0.02;
  return p.maxDiscount;
}

function balanceBonus() {
  if (!promoActive()) return 0;
  const used = products
    .filter(p => p.isBonus)
    .reduce((s, p) => s + p.bonusQty * p.price, 0);
  return total() - used;
}

/* ========= RENDER ========= */
function render() {
  tbody.innerHTML = "";

  let totalPrice = 0;
  let totalFinal = 0;

  products.forEach(p => {
    const discount = getDiscount(p);
    const base = p.isBonus ? 0 : p.qty * p.price;
    const final = base * (1 - discount) * (1 + TAX_RATE);

    totalPrice += base;
    totalFinal += final;

    const qtyCell = p.isBonus
      ? "-"
      : `<button onclick="changeQty('${p.sku}',-1)">−</button>
         ${p.qty}
         <button onclick="changeQty('${p.sku}',1)">+</button>`;

    const bonusCell = p.isBonus
      ? `<button onclick="changeBonus('${p.sku}',-1)">−</button>
         ${p.bonusQty}
         <button onclick="changeBonus('${p.sku}',1)">+</button>`
      : "-";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.sku}</td>
      <td>${p.name}</td>
      <td>${qtyCell}</td>
      <td>${p.isBonus ? "-" : p.price.toLocaleString("id-ID")}</td>
      <td>${p.isBonus ? "-" : (discount*100).toFixed(2)+"%"}</td>
      <td>${p.isBonus ? "-" : final.toLocaleString("id-ID")}</td>
      <td>${bonusCell}</td>
    `;
    tbody.appendChild(tr);
  });

  totalPriceEl.innerText = totalPrice.toLocaleString("id-ID");
  floatingTotalFinalEl.innerText = totalFinal.toLocaleString("id-ID");
  floatingBalanceBonusEl.innerText = balanceBonus().toLocaleString("id-ID");
}

/* ========= ACTIONS ========= */
function changeQty(sku, delta) {
  const p = products.find(x => x.sku === sku);
  if (!p || p.isBonus) return;
  p.qty = Math.max(0, p.qty + delta);
  render();
}

function changeBonus(sku, delta) {
  const p = products.find(x => x.sku === sku);
  if (!p || !p.isBonus) return;

  const next = p.bonusQty + delta;
  if (next < 0) return;
  if (delta > 0 && balanceBonus() < p.price) return;

  p.bonusQty = next;
  render();
}

/* ========= INIT ========= */
render();
