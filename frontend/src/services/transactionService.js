const TRANSACTIONS_KEY = "transactions";

const getTransactions = () => {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveTransactions = (transactions) => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

const addTransaction = (transaction) => {
    const transactions = getTransactions();
    transactions.push(transaction);
    saveTransactions(transactions);
};

export default {
    getTransactions,
    addTransaction
};