// Simple in-memory database (for production, use MongoDB or PostgreSQL)
class Database {
  constructor() {
    this.users = [];
    this.transactions = [];
    this.folders = [];
    this.goals = [];
    this.reminders = [];
    this.notes = [];
  }

  // User operations
  createUser(user) {
    this.users.push(user);
    return user;
  }

  getUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  getUserById(id) {
    return this.users.find(u => u.id === id);
  }

  updateUser(id, updates) {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      return this.users[index];
    }
    return null;
  }

  // Transaction operations
  createTransaction(transaction) {
    this.transactions.push(transaction);
    return transaction;
  }

  getTransactionsByUserId(userId) {
    return this.transactions.filter(t => t.userId === userId);
  }

  updateTransaction(id, userId, updates) {
    const index = this.transactions.findIndex(t => t.id === id && t.userId === userId);
    if (index !== -1) {
      this.transactions[index] = { ...this.transactions[index], ...updates };
      return this.transactions[index];
    }
    return null;
  }

  deleteTransaction(id, userId) {
    const index = this.transactions.findIndex(t => t.id === id && t.userId === userId);
    if (index !== -1) {
      return this.transactions.splice(index, 1)[0];
    }
    return null;
  }

  // Folder operations
  createFolder(folder) {
    this.folders.push(folder);
    return folder;
  }

  getFoldersByUserId(userId) {
    return this.folders.filter(f => f.userId === userId);
  }

  updateFolder(id, userId, updates) {
    const index = this.folders.findIndex(f => f.id === id && f.userId === userId);
    if (index !== -1) {
      this.folders[index] = { ...this.folders[index], ...updates };
      return this.folders[index];
    }
    return null;
  }

  deleteFolder(id, userId) {
    const index = this.folders.findIndex(f => f.id === id && f.userId === userId);
    if (index !== -1) {
      return this.folders.splice(index, 1)[0];
    }
    return null;
  }

  // Goal operations
  createGoal(goal) {
    this.goals.push(goal);
    return goal;
  }

  getGoalsByUserId(userId) {
    return this.goals.filter(g => g.userId === userId);
  }

  updateGoal(id, userId, updates) {
    const index = this.goals.findIndex(g => g.id === id && g.userId === userId);
    if (index !== -1) {
      this.goals[index] = { ...this.goals[index], ...updates };
      return this.goals[index];
    }
    return null;
  }

  deleteGoal(id, userId) {
    const index = this.goals.findIndex(g => g.id === id && g.userId === userId);
    if (index !== -1) {
      return this.goals.splice(index, 1)[0];
    }
    return null;
  }

  // Reminder operations
  createReminder(reminder) {
    this.reminders.push(reminder);
    return reminder;
  }

  getRemindersByUserId(userId) {
    return this.reminders.filter(r => r.userId === userId);
  }

  updateReminder(id, userId, updates) {
    const index = this.reminders.findIndex(r => r.id === id && r.userId === userId);
    if (index !== -1) {
      this.reminders[index] = { ...this.reminders[index], ...updates };
      return this.reminders[index];
    }
    return null;
  }

  deleteReminder(id, userId) {
    const index = this.reminders.findIndex(r => r.id === id && r.userId === userId);
    if (index !== -1) {
      return this.reminders.splice(index, 1)[0];
    }
    return null;
  }

  // Note operations
  createNote(note) {
    this.notes.push(note);
    return note;
  }

  getNotesByUserId(userId) {
    return this.notes.filter(n => n.userId === userId);
  }

  updateNote(id, userId, updates) {
    const index = this.notes.findIndex(n => n.id === id && n.userId === userId);
    if (index !== -1) {
      this.notes[index] = { ...this.notes[index], ...updates };
      return this.notes[index];
    }
    return null;
  }

  deleteNote(id, userId) {
    const index = this.notes.findIndex(n => n.id === id && n.userId === userId);
    if (index !== -1) {
      return this.notes.splice(index, 1)[0];
    }
    return null;
  }
}

module.exports = new Database();
