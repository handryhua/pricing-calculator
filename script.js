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
  // ================= BCM =================
  { sku:"8504", category:"BCM", displayName:"HN-289-EBK", price:227739, specialDiscount:0.0625, qty:0 },
  { sku:"8091", category:"BCM", displayName:"HBF-214-AP", price:1229500, specialDiscount:0.1667, qty:0 },
  { sku:"6830", category:"BCM", displayName:"HBF-375-AP", price:1641320, specialDiscount:0.11, qty:0 },

  // ================= BPM =================
  { sku:"E658", category:"BPM", displayName:"HEM-7142T2-AP2", price:412000, specialDiscount:0.20, qty:0 },
  { sku:"8085", category:"BPM", displayName:"HEM-7120", price:408000, specialDiscount:0.20, qty:0 },
  { sku:"B813", category:"BPM", displayName:"HEM-7156AAP", price:685000, specialDiscount:0.08, qty:0 },
  { sku:"E250", category:"BPM", displayName:"HEM-7156-AP", price:577280, specialDiscount:0.08, qty:0 },
  { sku:"D526", category:"BPM", displayName:"HEM-7156T-AP", price:619500, specialDiscount:0.08, qty:0 },
  { sku:"D239", category:"BPM", displayName:"HEM-7156T-AAP", price:783000, specialDiscount:0.08, qty:0 },
  { sku:"F140", category:"BPM", displayName:"HEM-7383T1-AP", price:1230000, specialDiscount:0.0625, qty:0 },
  { sku:"E670", category:"BPM", displayName:"HEM-7157-AP3[JPN750]", price:702512, specialDiscount:0.10, qty:0 },
  { sku:"E457", category:"BPM", displayName:"HEM-7530T-AP3", price:2492440, specialDiscount:0.11, qty:0 },

  // ================= NEBU =================
  { sku:"4682", category:"NEBU", displayName:"NE-C28", price:619500, specialDiscount:0.125, qty:0 },
  { sku:"D252", category:"NEBU", displayName:"NE-C28-C1", price:619500, specialDiscount:0.125, qty:0 },
  { sku:"B292", category:"NEBU", displayName:"NE-C101-AP", price:429250, specialDiscount:0.10, qty:0 },
  { sku:"7727", category:"NEBU", displayName:"NE-C801S-AP", price:468500, specialDiscount:0.11, qty:0 },

  // ================= EFT =================
  { sku:"E245", category:"EFT", displayName:"MC-246-AP4", price:56880, specialDiscount:0.058, qty:0 },
  { sku:"E297", category:"EFT", displayName:"MC-341-AP4", price:59940, specialDiscount:0.09, qty:0 },
  { sku:"E089", category:"EFT", displayName:"MC-343F-AP4", price:78220, specialDiscount:0.047, qty:0 },
  { sku:"F139", category:"EFT", displayName:"MC-F300-AP", price:452000, specialDiscount:0.09, qty:0 },
  { sku:"8375", category:"EFT", displayName:"MC-523-AP", price:452153, specialDiscount:0.07, qty:0 },

  // ================= TENS =================
  { sku:"B735", category:"TENS", displayName:"HV-F013-AP4", price:445493, specialDiscount:0.14, qty:0 },

  // ================= ACCESSORY =================
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
  if (p.qty <= 0) return 0;
  if (!promoActive()) return 0.02;
  return p.specialDiscount;
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

   const discountRate = getDiscountRate(p);
   const final = p.qty * p.price * (1 - discountRate);

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
