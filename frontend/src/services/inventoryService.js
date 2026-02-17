const STORAGE_KEY = 'inventory';

const getInventory = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

const saveInventory = (stored) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
};

const addStock = (productId, qty, batch, expiredDate) => {
    const inventory = getInventory();

    inventory.push({
        id: Date.now(),
        productId,
        qty,
        batch,
        expiredDate
    });
    saveInventory(inventory);
};

const reduceStock = (productId, qty) => {
    const inventory = getInventory();

    inventory.sort((a, b) => new Date(a.expiredDate) - new Date(b.expiredDate));

    let remaining = qty;
    for (let item of inventory) {
        if (item.productId === productId && item.qty > 0) {
            if (item.qty >= remaining) {
                item.qty -= remaining;
                remaining = 0;
                break;
            } else {
                remaining -= item.qty;
                item.qty = 0;
            }
        }
    }

    const cleaned = inventory.filter(item => item.qty > 0);
    saveInventory(cleaned);
    saveInventory(inventory);
};

const getStockByProductId = (productId) => {
    const inventory = getInventory();
    return inventory.filter(item => item.productId === productId)
        .reduce((sum, item) => sum + item.qty, 0);
};

export default {
    getInventory,
    addStock,
    reduceStock,
    getStockByProductId
};
