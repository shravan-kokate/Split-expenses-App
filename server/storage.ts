import { expenses, people, settlements, type Expense, type InsertExpense, type Person, type InsertPerson, type Settlement, type PersonBalance, type SettlementSummary } from "@shared/schema";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const EXPENSES_FILE = path.join(DATA_DIR, "expenses.json");
const PEOPLE_FILE = path.join(DATA_DIR, "people.json");
const SETTLEMENTS_FILE = path.join(DATA_DIR, "settlements.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface IStorage {
  // Expense operations
  getExpenses(): Promise<Expense[]>;
  getExpense(id: number): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: number): Promise<boolean>;

  // People operations
  getPeople(): Promise<Person[]>;
  getPerson(name: string): Promise<Person | undefined>;
  createPerson(person: InsertPerson): Promise<Person>;
  
  // Settlement operations
  getSettlements(): Promise<Settlement[]>;
  createSettlement(settlement: Omit<Settlement, "id" | "created_at">): Promise<Settlement>;
  markSettlementPaid(id: number): Promise<boolean>;
  
  // Calculation operations
  getPersonBalances(): Promise<PersonBalance[]>;
  getSettlementSummary(): Promise<SettlementSummary[]>;
}

export class FileStorage implements IStorage {
  private expenseIdCounter: number = 1;
  private peopleIdCounter: number = 1;
  private settlementIdCounter: number = 1;

  constructor() {
    this.initializeCounters();
  }

  private initializeCounters() {
    try {
      const expenses = this.readExpensesFromFile();
      const people = this.readPeopleFromFile();
      const settlements = this.readSettlementsFromFile();
      
      this.expenseIdCounter = Math.max(...expenses.map(e => e.id), 0) + 1;
      this.peopleIdCounter = Math.max(...people.map(p => p.id), 0) + 1;
      this.settlementIdCounter = Math.max(...settlements.map(s => s.id), 0) + 1;
    } catch (error) {
      // Files don't exist yet, start with 1
    }
  }

  private readExpensesFromFile(): Expense[] {
    try {
      const data = fs.readFileSync(EXPENSES_FILE, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private writeExpensesToFile(expenses: Expense[]): void {
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2));
  }

  private readPeopleFromFile(): Person[] {
    try {
      const data = fs.readFileSync(PEOPLE_FILE, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private writePeopleToFile(people: Person[]): void {
    fs.writeFileSync(PEOPLE_FILE, JSON.stringify(people, null, 2));
  }

  private readSettlementsFromFile(): Settlement[] {
    try {
      const data = fs.readFileSync(SETTLEMENTS_FILE, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private writeSettlementsToFile(settlements: Settlement[]): void {
    fs.writeFileSync(SETTLEMENTS_FILE, JSON.stringify(settlements, null, 2));
  }

  async getExpenses(): Promise<Expense[]> {
    return this.readExpensesFromFile();
  }

  async getExpense(id: number): Promise<Expense | undefined> {
    const expenses = this.readExpensesFromFile();
    return expenses.find(expense => expense.id === id);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const expenses = this.readExpensesFromFile();
    const expense: Expense = {
      ...insertExpense,
      id: this.expenseIdCounter++,
      created_at: new Date(),
    };
    
    expenses.push(expense);
    this.writeExpensesToFile(expenses);

    // Auto-create person if they don't exist
    await this.ensurePersonExists(insertExpense.paid_by);

    return expense;
  }

  async updateExpense(id: number, updateData: Partial<InsertExpense>): Promise<Expense | undefined> {
    const expenses = this.readExpensesFromFile();
    const index = expenses.findIndex(expense => expense.id === id);
    
    if (index === -1) {
      return undefined;
    }

    expenses[index] = { ...expenses[index], ...updateData };
    this.writeExpensesToFile(expenses);

    // Auto-create person if paid_by changed
    if (updateData.paid_by) {
      await this.ensurePersonExists(updateData.paid_by);
    }

    return expenses[index];
  }

  async deleteExpense(id: number): Promise<boolean> {
    const expenses = this.readExpensesFromFile();
    const filteredExpenses = expenses.filter(expense => expense.id !== id);
    
    if (filteredExpenses.length === expenses.length) {
      return false;
    }

    this.writeExpensesToFile(filteredExpenses);
    return true;
  }

  async getPeople(): Promise<Person[]> {
    return this.readPeopleFromFile();
  }

  async getPerson(name: string): Promise<Person | undefined> {
    const people = this.readPeopleFromFile();
    return people.find(person => person.name === name);
  }

  async createPerson(insertPerson: InsertPerson): Promise<Person> {
    const people = this.readPeopleFromFile();
    const person: Person = {
      ...insertPerson,
      id: this.peopleIdCounter++,
      created_at: new Date(),
    };
    
    people.push(person);
    this.writePeopleToFile(people);
    return person;
  }

  private async ensurePersonExists(name: string): Promise<Person> {
    const existingPerson = await this.getPerson(name);
    if (existingPerson) {
      return existingPerson;
    }
    return await this.createPerson({ name });
  }

  async getSettlements(): Promise<Settlement[]> {
    return this.readSettlementsFromFile();
  }

  async createSettlement(settlementData: Omit<Settlement, "id" | "created_at">): Promise<Settlement> {
    const settlements = this.readSettlementsFromFile();
    const settlement: Settlement = {
      ...settlementData,
      id: this.settlementIdCounter++,
      created_at: new Date(),
    };
    
    settlements.push(settlement);
    this.writeSettlementsToFile(settlements);
    return settlement;
  }

  async markSettlementPaid(id: number): Promise<boolean> {
    const settlements = this.readSettlementsFromFile();
    const index = settlements.findIndex(settlement => settlement.id === id);
    
    if (index === -1) {
      return false;
    }

    settlements[index].is_settled = 1;
    this.writeSettlementsToFile(settlements);
    return true;
  }

  async getPersonBalances(): Promise<PersonBalance[]> {
    const expenses = await this.getExpenses();
    const people = await this.getPeople();
    
    if (expenses.length === 0) {
      return people.map(person => ({
        name: person.name,
        totalPaid: 0,
        totalOwed: 0,
        balance: 0,
        expenseCount: 0,
      }));
    }

    const totalExpenseAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const personCount = people.length;
    const fairSharePerPerson = totalExpenseAmount / personCount;

    const balances: PersonBalance[] = people.map(person => {
      const personExpenses = expenses.filter(expense => expense.paid_by === person.name);
      const totalPaid = personExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      const balance = totalPaid - fairSharePerPerson;

      return {
        name: person.name,
        totalPaid,
        totalOwed: fairSharePerPerson,
        balance,
        expenseCount: personExpenses.length,
      };
    });

    return balances;
  }

  async getSettlementSummary(): Promise<SettlementSummary[]> {
    const balances = await this.getPersonBalances();
    
    // Separate creditors (positive balance) and debtors (negative balance)
    const creditors = balances.filter(person => person.balance > 0).map(person => ({
      name: person.name,
      amount: person.balance
    }));
    
    const debtors = balances.filter(person => person.balance < 0).map(person => ({
      name: person.name,
      amount: Math.abs(person.balance)
    }));

    const settlements: SettlementSummary[] = [];

    // Simple settlement algorithm - not fully optimized but works
    let creditorIndex = 0;
    let debtorIndex = 0;

    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex];
      const debtor = debtors[debtorIndex];

      const settlementAmount = Math.min(creditor.amount, debtor.amount);

      if (settlementAmount > 0.01) { // Avoid tiny settlements due to floating point precision
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(settlementAmount * 100) / 100, // Round to 2 decimal places
        });
      }

      creditor.amount -= settlementAmount;
      debtor.amount -= settlementAmount;

      if (creditor.amount < 0.01) creditorIndex++;
      if (debtor.amount < 0.01) debtorIndex++;
    }

    return settlements;
  }
}

export const storage = new FileStorage();
