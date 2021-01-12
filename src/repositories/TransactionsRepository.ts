import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balance: Balance;

  constructor() {
    this.transactions = [];
    this.balance = { income: 0, outcome: 0, total: 0 };
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    return this.balance;
  }

  public create({ title, value, type }: Request): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (
      transaction.type === 'outcome' &&
      this.balance.total < transaction.value
    ) {
      throw Error('Saldo insuficiente para essa operação');
    }

    this.transactions.push(transaction);

    if (transaction.type === 'income') {
      this.balance.total += value;
      this.balance.income += value;
    } else if (transaction.type === 'outcome') {
      this.balance.outcome += value;
      this.balance.total -= value;
    } else {
      throw Error('Operação inválida: Aceito apenas income e outcome!');
    }

    return transaction;
  }
}

export default TransactionsRepository;
