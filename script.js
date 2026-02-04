// ================== CATEGORY LABEL ==================
const CATEGORY_LABEL = {
  BPM: "Blood Pressure Monitor",
  NEBU: "Nebulizer",
  EFT: "Thermometer",
  BCM: "Body Composition",
  TENS: "TENS / Massager"
};

// ================== PRODUCT MASTER ==================
let products = [
  { sku:"8085", category:"BPM", displayName:"BPM HEM-7120", price:408000, specialDiscount:0.20, qty:0 },
  { sku:"4682", category:"NEBU", displayName:"Nebu NE-C28", price:619500, specialDiscount:0.125, qty:0 },
  { sku:"E245", category:"EFT", displayName:"EFT MC-246", price:56880, specialDiscount:0.058, qty:0 },
  { sku:"6865", category:"BPM", displayName:"Adaptor BPM", price:98011, specialDiscount:0.00, qty:0 }
];

// ================== BONUS MASTER ==================
const BONUS_LIST = [
  { label:"MC-246 (2 unit)", cost:850000 },
  { label:"Adaptor BPM (1 unit)", cost:850000 },
  { label:"BPM HEM-7120 (1 unit)", cost:2550000 },
  { label:"Nebulizer NE-C801 (1 unit)", cost:3400000 },
  { label:"BPM HEM-7156T (1 unit)", cost:4250000 }
];

// ================== DOM ==================
const tbody = document.getElementById("tableBody");
const discountLabel = document.getElementById("discountLabel");
const balanceBonusEl = document.getElementById("balanceBonus");
const bonusListEl = document.getElementById("bonusList");

// ================== CORE LOGIC ==================
function countCategories() {
  return new Set(products.filter(p => p.qty > 0).map(p => p.category)).size;
}

function grossTotal() {
  return products.reduce((sum, p) => sum + p.qty * p.price, 0);
}

function promoActive() {
  return grossTotal() >= 850000 && countCategories() >= 2;
}

function getDiscount(p) {
  return promoActive() ? p.specialDiscount : 0.02;
}

function balanceBonus() {
  return promoActive() ? grossTotal() : 0;
}

// ================== RENDER ==================
function render() {
  tbody.innerHTML = "";

  products.sort((a, b) => {
    if (a.category !== b.category)
      return a.category.localeCompare(b.category);
    if ((a.qty > 0) !== (b.qty > 0))
      return b.qty - a.qty;
    return a.displayName.localeCompare(b.displayName);
  });

  products.forEach(p => {
    const final = p.qty * p.price * (1 - getDiscount(p));
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
  <td>${final.toLocaleString("id-ID")}</td>
`;
    tbody.appendChild(tr);
  });

  discountLabel.innerText = promoActive() ? "Diskon SKU" : "2%";
  balanceBonusEl.innerText = balanceBonus().toLocaleString("id-ID");

  renderBonus();
}

function renderBonus() {
  bonusListEl.innerHTML = "";
  let balance = balanceBonus();

  BONUS_LIST.forEach(b => {
    const li = document.createElement("li");
    li.innerText = `${b.label} (−${b.cost.toLocaleString("id-ID")})`;
    li.style.color = balance >= b.cost ? "black" : "#aaa";
    bonusListEl.appendChild(li);
  });
}

// ================== ACTION ==================
function changeQty(sku, delta) {
  const p = products.find(x => x.sku === sku);
  p.qty = Math.max(0, p.qty + delta);
  render();
}

// ================== INIT ==================
render();
