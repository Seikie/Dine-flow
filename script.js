const tables = [
  {id:1,status:"available"},{id:2,status:"occupied",customer:"Juan Dela Cruz"},{id:3,status:"available"},
  {id:4,status:"reserved",customer:"Maria Santos"},{id:5,status:"occupied",customer:"Juan Dela Cruz"},{id:6,status:"available"},
  {id:7,status:"available"},{id:8,status:"occupied"},{id:9,status:"available"},{id:10,status:"reserved"},
  {id:11,status:"available"},{id:12,status:"occupied"}
];
const menu = [
  ["Chicken Meal",150,"Meals","https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"],
  ["Burger Meal",120,"Meals","https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"],
  ["Pasta",130,"Meals","https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80"],
  ["Carbonara",140,"Meals","https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80"],
  ["Iced Coffee",90,"Drinks","https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80"],
  ["Fries",80,"Snacks","https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80"]
];
const customers = [
  {name:"Maria Santos",phone:"09XX XXX 1111",table:"Table 04",orders:3,visits:5},
  {name:"Juan Dela Cruz",phone:"09XX XXX 2222",table:"Table 05",orders:2,visits:4},
  {name:"Anna Reyes",phone:"09XX XXX 3333",table:"Table 02",orders:5,visits:8},
  {name:"Rica Tolentino",phone:"09XX XXX 4444",table:"Table 07",orders:1,visits:2},
  {name:"Ken Villanueva",phone:"09XX XXX 5555",table:"Table 10",orders:4,visits:6}
];
let cart = [];
let currentTable = 5;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const peso = n => "₱" + n.toLocaleString("en-PH");

function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}

function updateCounts(){
  $("#availableCount").textContent=tables.filter(t=>t.status==="available").length;
  $("#occupiedCount").textContent=tables.filter(t=>t.status==="occupied").length;
  $("#reservedCount").textContent=tables.filter(t=>t.status==="reserved").length;
  $("#totalTables").textContent=tables.length;
}
function tableCard(t){
  const label=t.status[0].toUpperCase()+t.status.slice(1);
  return `<div class="table-card" data-id="${t.id}" onclick="openTable(${t.id})"><div class="table-symbol">▣</div><div class="table-number">T${String(t.id).padStart(2,"0")}</div><div class="table-status ${t.status}">${label}</div></div>`;
}
function renderTables(){
  const html=tables.map(tableCard).join("");
  $("#dashboardTables").innerHTML=html;
  const q=($("#tableSearch")?.value||"").toLowerCase();
  const f=$("#statusFilter")?.value||"all";
  $("#allTables").innerHTML=tables.filter(t=>(f==="all"||t.status===f)&&String(t.id).includes(q.replace("t",""))).map(tableCard).join("");
  updateCounts();
}
function openTable(id){
  currentTable=id;
  const t=tables.find(x=>x.id===id);
  $("#detailTableName").textContent=`Table ${String(id).padStart(2,"0")}`;
  $("#detailStatus").textContent=t.status[0].toUpperCase()+t.status.slice(1);
  $("#detailStatus").className=`status-pill ${t.status}`;
  $("#detailCustomer").textContent=t.customer||"No customer";
  $("#detailGuests").textContent=t.status==="occupied"?"4":"—";
  $("#detailOrder").innerHTML=t.status==="occupied"?`<div class="order-line"><span>Chicken Meal ×2</span><span>₱300</span></div><div class="order-line"><span>Iced Coffee ×1</span><span>₱90</span></div><div class="order-line"><span>Fries ×1</span><span>₱80</span></div>`:`<p style="font-size:11px;color:#8994a4">No current order.</p>`;
  $("#orderTableNo").textContent=String(id).padStart(2,"0");
  showPage("tableDetail");
}
function showPage(page){
  const pages={dashboard:"Dashboard",tables:"Table Management",tableDetail:"Table Details",orders:"New Order",billing:"Billing",customers:"Customers",reservations:"Reservations",settings:"Settings"};
  $$(".page").forEach(p=>p.classList.add("hidden"));
  $(`#${page}Page`).classList.remove("hidden");
  $("#pageTitle").textContent=pages[page]||"Dashboard";
  $$(".nav-item[data-page]").forEach(n=>n.classList.toggle("active",n.dataset.page===page || (page==="tableDetail"&&n.dataset.page==="tables")));
  window.scrollTo({top:0,behavior:"smooth"});
  if(page==="orders") renderMenu();
  if(page==="customers") renderCustomers();
  if(page==="reservations") renderReservations();
}
function renderMenu(){
  $("#menuGrid").innerHTML=menu.map((m,i)=>`<div class="menu-item"><div class="food-photo" style="background-image:url('${m[3]}')"></div><div class="menu-info"><strong>${m[0]}</strong><span>${peso(m[1])}</span><button class="add-food" onclick="addToCart(${i})">＋</button></div></div>`).join("");
  renderCart();
}
function addToCart(i){cart.push(menu[i]);renderCart();showToast(`${menu[i][0]} added to order`)}
function renderCart(){
  $("#cartCount").textContent=`${cart.length} item${cart.length===1?"":"s"}`;
  $("#cartItems").innerHTML=cart.length?cart.map((m,i)=>`<div class="cart-item"><span>${m[0]}</span><strong>${peso(m[1])}</strong></div>`).join(""):`<p style="font-size:11px;color:#8b96a6">No items added yet.</p>`;
  $("#cartTotal").textContent=peso(cart.reduce((s,m)=>s+m[1],0));
}
function renderCustomers(){
  $("#customerList").innerHTML=customers.map((c,i)=>`<div class="customer-row-card ${i===0?"active":""}" onclick="selectCustomer(${i},this)"><div class="avatar">${c.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><div><strong>${c.name}</strong><span>${c.phone} · ${c.orders} orders</span></div><span style="margin-left:auto">›</span></div>`).join("");
  selectCustomer(0);
}
function selectCustomer(i,el){
  if(el){$$(".customer-row-card").forEach(x=>x.classList.remove("active"));el.classList.add("active")}
  const c=customers[i];
  $("#customerProfile").innerHTML=`<div class="profile-header"><div class="avatar">${c.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><div><h3>${c.name}</h3><p>${c.phone}</p></div></div><div class="profile-stats"><div class="profile-stat"><span>Total Visits</span><strong>${c.visits}</strong></div><div class="profile-stat"><span>Current Table</span><strong>${c.table}</strong></div></div><div class="history-title">Previous Orders</div>${["Chicken Meal","Iced Coffee","Burger Meal","Pasta","Fries"].map((x,j)=>`<div class="history-item"><span>${j+1}. ${x}</span><span>${["Nov 16, 2026","Nov 10, 2026","Oct 28, 2026","Oct 14, 2026","Sep 30, 2026"][j]}</span></div>`).join("")}`;
}
function renderReservations(){
  const data=[["7:00 PM","Maria Santos","Table 04","4 guests"],["8:00 PM","John Reyes","Table 08","2 guests"],["10:00 PM","Liza Mercado","Table 09","3 guests"]];
  $("#reservationList").innerHTML=data.map(r=>`<div class="reservation-item"><div class="res-time">${r[0]}</div><div><h4>${r[1]}</h4><p>${r[2]} · ${r[3]}</p></div><div class="res-actions"><button class="outline-btn">View</button><button class="outline-btn">Edit</button><button class="res-cancel">Cancel</button></div></div>`).join("");
}

function init(){
  $("#todayLabel").textContent=new Date().toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"});
  renderTables();
  $("#loginForm").addEventListener("submit",e=>{e.preventDefault();$("#loginScreen").classList.add("hidden");$("#app").classList.remove("hidden");showToast("Welcome to DineFlow")});
  $("#showPass").onclick=()=>{$("#loginPassword").type=$("#loginPassword").type==="password"?"text":"password"};
  $$(".nav-item[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
  $$("[data-page]").forEach(b=>{if(!b.classList.contains("nav-item"))b.addEventListener("click",()=>showPage(b.dataset.page))});
  $("#tableSearch").addEventListener("input",renderTables);$("#statusFilter").addEventListener("change",renderTables);
  $("#addTableBtn").onclick=()=>{const id=tables.length+1;tables.push({id,status:"available"});renderTables();showToast(`Table ${id} added`)};
  $("#placeOrder").onclick=()=>{if(!cart.length)return showToast("Add at least one item first");showToast("Order placed successfully");cart=[];renderCart();showPage("tableDetail")};
  $("#confirmPayment").onclick=()=>{showToast("Payment confirmed");const t=tables.find(x=>x.id===5);if(t)t.status="available";renderTables();showPage("tables")};
  $("#newReservation").onclick=()=>showToast("Reservation form is ready to connect to your backend");
  $("#saveSettings").onclick=()=>showToast("Settings saved");
}
init();
