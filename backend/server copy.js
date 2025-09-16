// server.js
const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const products = require('./products.json'); // 你的 JSON 文件

const app = express();
app.use(cors());
app.use(express.json());

// 创建 / 打开数据库
const db = new Database('./my_project.db');
// --- 初始化数据库 ---
// 产品表
db.exec(`CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  data TEXT
)`);

// 购物车表
db.exec(`CREATE TABLE IF NOT EXISTS cart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  productId TEXT,
  quantity INTEGER
)`);

// orders
db.exec(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  createdAt TEXT,
  items TEXT,  
  totalPrice REAL
)`);
// 清空旧数据
db.exec(`DELETE FROM products`);

// 插入数据
const stmt = db.prepare("INSERT INTO products (id, data) VALUES (?, ?)");
products.forEach(p => stmt.run(p.id, JSON.stringify(p)));

// --- 产品 API ---
app.get('/products', (req, res) => {
  try {
    const rows = db.prepare("SELECT data FROM products").all();
    const result = rows.map(r => JSON.parse(r.data));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 购物车 API ---
// 获取购物车列表
app.get('/cart', (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM cart").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 添加商品到购物车
app.post('/cart', (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const stmt = db.prepare("INSERT INTO cart (productId, quantity) VALUES (?, ?)");
    const info = stmt.run(productId, quantity);
    res.json({ success: true, id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 创建订单 API
app.post('/orders', (req, res) => {
  try {
    const { cart } = req.body;

    const stmt = db.prepare(`
      INSERT INTO orders (createdAt, items, totalPrice)
      VALUES (?, ?, ?)
    `);

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const info = stmt.run(
      new Date().toISOString(),
      JSON.stringify(cart),
      totalPrice
    );

    // 查询刚插入的订单
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(info.lastInsertRowid);

    console.log('订单保存成功:', order); // 
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '数据库错误' });
  }
});





// 启动服务器
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
