// Finance & Budget Tracker - Main Application
class FinanceTracker {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.folders = JSON.parse(localStorage.getItem('folders')) || [
            { id: 'taxes', name: '2025 Taxes', color: 'yellow', receipts: [], totalAmount: 0 },
            { id: 'business', name: 'Business Expenses', color: 'blue', receipts: [], totalAmount: 0 }
        ];
        this.budgets = JSON.parse(localStorage.getItem('budgets')) || {};
        this.reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        this.sideNotes = JSON.parse(localStorage.getItem('sideNotes')) || [];
        this.editingNoteId = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.renderTransactions();
        this.renderFolders();
        this.renderReminders();
        this.renderSideNotes();
        this.initializeChart();
        this.setDefaultDate();
        this.startReminderScheduler();
    }

    setupEventListeners() {
        // Quick Action Buttons
        document.getElementById('scanReceiptBtn').addEventListener('click', () => this.openScannerModal());
        document.getElementById('addExpenseBtn').addEventListener('click', () => this.openExpenseModal());
        document.getElementById('addIncomeBtn').addEventListener('click', () => this.openIncomeModal());
        document.getElementById('manageFoldersBtn').addEventListener('click', () => this.manageFolders());

        // Reminders
        const addReminderBtn = document.getElementById('addReminderBtn');
        if (addReminderBtn) addReminderBtn.addEventListener('click', () => this.openReminderModal());
        const closeReminderBtn = document.getElementById('closeReminderBtn');
        if (closeReminderBtn) closeReminderBtn.addEventListener('click', () => this.closeReminderModal());
        const cancelReminderBtn = document.getElementById('cancelReminderBtn');
        if (cancelReminderBtn) cancelReminderBtn.addEventListener('click', () => this.closeReminderModal());
        const reminderForm = document.getElementById('reminderForm');
        if (reminderForm) reminderForm.addEventListener('submit', (e) => this.handleReminderSubmit(e));

        // Scanner Modal
        document.getElementById('closeScannerBtn').addEventListener('click', () => this.closeScannerModal());
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileUpload(e));
        document.getElementById('cameraBtn').addEventListener('click', () => this.openCamera());
        const captureBtn = document.getElementById('captureBtn');
        if (captureBtn) captureBtn.addEventListener('click', () => this.capturePhoto());
        const stopCameraBtn = document.getElementById('stopCameraBtn');
        if (stopCameraBtn) stopCameraBtn.addEventListener('click', () => this.stopCamera());
        document.getElementById('saveReceiptBtn').addEventListener('click', () => this.saveScannedReceipt());
        document.getElementById('cancelReceiptBtn').addEventListener('click', () => this.closeScannerModal());

        // Expense Modal
        document.getElementById('closeExpenseBtn').addEventListener('click', () => this.closeExpenseModal());
        document.getElementById('cancelExpenseBtn').addEventListener('click', () => this.closeExpenseModal());
        document.getElementById('expenseForm').addEventListener('submit', (e) => this.handleExpenseSubmit(e));

        // Folder Management
        document.getElementById('createFolderBtn').addEventListener('click', () => this.createNewFolder());

        // Side Notes Panel
        const openNotesBtn = document.getElementById('openNotesPanelBtn');
        if (openNotesBtn) openNotesBtn.addEventListener('click', () => this.openNotesPanel());
        const closeNotesBtn = document.getElementById('closeNotesPanelBtn');
        if (closeNotesBtn) closeNotesBtn.addEventListener('click', () => this.closeNotesPanel());
        const sideNoteForm = document.getElementById('sideNoteForm');
        if (sideNoteForm) sideNoteForm.addEventListener('submit', (e) => this.handleSideNoteSubmit(e));
        const clearSideNoteBtn = document.getElementById('clearSideNoteBtn');
        if (clearSideNoteBtn) clearSideNoteBtn.addEventListener('click', () => this.clearSideNoteForm());
        const sideNotesList = document.getElementById('sideNotesList');
        if (sideNotesList) {
            sideNotesList.addEventListener('click', (e) => {
                const target = e.target.closest('button');
                if (!target) return;
                const noteId = target.getAttribute('data-id');
                if (target.classList.contains('editSideNoteBtn')) {
                    this.startEditingSideNote(noteId);
                } else if (target.classList.contains('deleteSideNoteBtn')) {
                    this.deleteSideNote(noteId);
                }
            });
        }
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        const expenseDateInput = document.getElementById('expenseDate');
        const receiptDateInput = document.getElementById('receiptDate');
        
        if (expenseDateInput) expenseDateInput.value = today;
        if (receiptDateInput) receiptDateInput.value = today;
    }

    // Dashboard Updates
    updateDashboard() {
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const netSavings = totalIncome - totalExpenses;
        const receiptsCount = this.transactions.filter(t => t.hasReceipt).length;

        document.getElementById('totalIncome').textContent = `$${totalIncome.toFixed(2)}`;
        document.getElementById('totalExpenses').textContent = `$${totalExpenses.toFixed(2)}`;
        document.getElementById('netSavings').textContent = `$${netSavings.toFixed(2)}`;
        document.getElementById('receiptsCount').textContent = receiptsCount;

        // Update net savings color based on positive/negative
        const netSavingsElement = document.getElementById('netSavings');
        if (netSavings >= 0) {
            netSavingsElement.className = 'text-2xl font-bold text-green-600';
        } else {
            netSavingsElement.className = 'text-2xl font-bold text-red-600';
        }
    }

    // Transaction Management
    addTransaction(transaction) {
        transaction.id = Date.now().toString();
        transaction.createdAt = new Date().toISOString();
        this.transactions.unshift(transaction);
        this.saveData();
        this.updateDashboard();
        this.renderTransactions();
        this.updateChart();
    }

    renderTransactions() {
        const container = document.getElementById('transactionsList');
        
        if (this.transactions.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-receipt text-4xl mb-4 opacity-50"></i>
                    <p>No transactions yet. Start by scanning a receipt or adding an expense!</p>
                </div>
            `;
            return;
        }

        const recentTransactions = this.transactions.slice(0, 5);
        container.innerHTML = recentTransactions.map(transaction => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg category-${transaction.category}">
                <div class="flex items-center space-x-3">
                    <div class="p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}">
                        <i class="fas ${this.getCategoryIcon(transaction.category)} ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}"></i>
                    </div>
                    <div>
                        <h3 class="font-medium text-gray-800">${transaction.description}</h3>
                        <p class="text-sm text-gray-600">${this.formatDate(transaction.date)} • ${this.getCategoryName(transaction.category)}</p>
                        ${transaction.notes ? `<p class="text-xs text-gray-500 mt-1">${this.escapeHtml(transaction.notes)}</p>` : ''}
                        ${transaction.folder ? `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">${this.getFolderName(transaction.folder)}</span>` : ''}
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                        ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                    </p>
                    ${transaction.hasReceipt ? '<i class="fas fa-receipt text-gray-400 text-sm mt-1"></i>' : ''}
                </div>
            </div>
        `).join('');
    }

    // Receipt Scanner
    openScannerModal() {
        document.getElementById('scannerModal').classList.remove('hidden');
        this.resetScannerModal();
    }

    closeScannerModal() {
        document.getElementById('scannerModal').classList.add('hidden');
        this.resetScannerModal();
    }

    resetScannerModal() {
        document.getElementById('previewArea').classList.add('hidden');
        document.getElementById('extractedDataForm').classList.add('hidden');
        document.getElementById('fileInput').value = '';
        document.getElementById('cameraArea')?.classList.add('hidden');
        document.getElementById('cameraError')?.classList.add('hidden');
        this.stopCamera();
        
        // Reset form fields
        document.getElementById('merchantName').value = '';
        document.getElementById('receiptAmount').value = '';
        document.getElementById('receiptNotes').value = '';
        document.getElementById('receiptCategory').value = 'food';
        document.getElementById('receiptFolder').value = '';
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const imageUrl = e.target.result;
            document.getElementById('receiptPreview').src = imageUrl;
            document.getElementById('previewArea').classList.remove('hidden');
            
            // Start OCR processing
            await this.processReceiptOCR(imageUrl);
        };
        reader.readAsDataURL(file);
    }

    async openCamera() {
        const cameraArea = document.getElementById('cameraArea');
        const videoEl = document.getElementById('cameraStream');
        const cameraError = document.getElementById('cameraError');
        const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        if (!isSecure) {
            if (cameraError) {
                cameraError.textContent = 'Camera requires HTTPS or localhost. Please run via a local server.';
                cameraError.classList.remove('hidden');
            }
            this.showNotification('Camera blocked: use https or http://localhost.', 'warning');
            return;
        }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            if (cameraError) {
                cameraError.textContent = 'Camera not supported in this browser.';
                cameraError.classList.remove('hidden');
            }
            return;
        }
        try {
            document.getElementById('previewArea').classList.add('hidden');
            document.getElementById('extractedDataForm').classList.add('hidden');
            cameraArea.classList.remove('hidden');
            cameraError.classList.add('hidden');
            this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            videoEl.srcObject = this.cameraStream;
        } catch (err) {
            console.error('Failed to access camera:', err);
            if (cameraError) {
                cameraError.textContent = 'Failed to access camera. Please check permissions.';
                cameraError.classList.remove('hidden');
            }
            this.showNotification('Unable to open camera. Check permissions.', 'error');
        }
    }

    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(t => t.stop());
            this.cameraStream = null;
        }
        const videoEl = document.getElementById('cameraStream');
        if (videoEl) videoEl.srcObject = null;
        const cameraArea = document.getElementById('cameraArea');
        if (cameraArea) cameraArea.classList.add('hidden');
    }

    capturePhoto() {
        const videoEl = document.getElementById('cameraStream');
        const canvas = document.getElementById('cameraCanvas');
        const previewArea = document.getElementById('previewArea');
        const img = document.getElementById('receiptPreview');
        if (!videoEl || !canvas || !img) return;

        const width = videoEl.videoWidth || 640;
        const height = videoEl.videoHeight || 480;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoEl, 0, 0, width, height);
        const imageUrl = canvas.toDataURL('image/png');
        img.src = imageUrl;

        // Show preview and stop camera
        previewArea.classList.remove('hidden');
        this.stopCamera();

        // Begin OCR processing
        this.processReceiptOCR(imageUrl);
    }

    async processReceiptOCR(imageUrl) {
        const progressBar = document.querySelector('#ocrProgress > div');
        
        try {
            // Simulate OCR processing with Tesseract.js
            progressBar.style.width = '20%';
            
            const worker = await Tesseract.createWorker('eng');
            
            progressBar.style.width = '50%';
            
            const { data: { text } } = await worker.recognize(imageUrl);
            await worker.terminate();
            
            progressBar.style.width = '100%';
            
            // Extract information from OCR text
            const extractedData = this.extractReceiptData(text);
            this.populateReceiptForm(extractedData);
            
            // Show the form
            setTimeout(() => {
                document.getElementById('extractedDataForm').classList.remove('hidden');
            }, 500);
            
        } catch (error) {
            console.error('OCR processing failed:', error);
            // Show form anyway for manual entry
            document.getElementById('extractedDataForm').classList.remove('hidden');
            this.showNotification('OCR processing failed. Please enter details manually.', 'warning');
        }
    }

    extractReceiptData(text) {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        
        // Extract amount (look for currency patterns)
        const amountRegex = /\$?(\d+\.?\d{0,2})/g;
        const amounts = [];
        let match;
        while ((match = amountRegex.exec(text)) !== null) {
            amounts.push(parseFloat(match[1]));
        }
        const amount = amounts.length > 0 ? Math.max(...amounts) : 0;

        // Extract date (look for date patterns)
        const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g;
        const dateMatch = text.match(dateRegex);
        let date = new Date().toISOString().split('T')[0];
        if (dateMatch) {
            try {
                const parsedDate = new Date(dateMatch[0]);
                if (!isNaN(parsedDate)) {
                    date = parsedDate.toISOString().split('T')[0];
                }
            } catch (e) {
                // Use default date
            }
        }

        // Extract merchant name (usually first few lines)
        const merchant = lines.slice(0, 3).find(line => 
            line.length > 2 && 
            !line.match(/^\d+$/) && 
            !line.match(/\$\d+/) &&
            !line.match(/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/)
        ) || '';

        // Smart categorization
        const category = this.categorizeTransaction(merchant + ' ' + text);

        return { merchant, amount, date, category };
    }

    categorizeTransaction(text) {
        const textLower = text.toLowerCase();
        
        if (textLower.includes('mcdonald') || textLower.includes('burger') || textLower.includes('pizza') || 
            textLower.includes('restaurant') || textLower.includes('cafe') || textLower.includes('food')) {
            return 'food';
        }
        if (textLower.includes('gas') || textLower.includes('shell') || textLower.includes('exxon') || 
            textLower.includes('uber') || textLower.includes('taxi') || textLower.includes('transport')) {
            return 'transport';
        }
        if (textLower.includes('walmart') || textLower.includes('target') || textLower.includes('amazon') || 
            textLower.includes('shopping') || textLower.includes('store')) {
            return 'shopping';
        }
        if (textLower.includes('electric') || textLower.includes('water') || textLower.includes('utility') || 
            textLower.includes('phone') || textLower.includes('internet')) {
            return 'utilities';
        }
        if (textLower.includes('movie') || textLower.includes('theater') || textLower.includes('netflix') || 
            textLower.includes('entertainment') || textLower.includes('game')) {
            return 'entertainment';
        }
        if (textLower.includes('hospital') || textLower.includes('pharmacy') || textLower.includes('doctor') || 
            textLower.includes('medical') || textLower.includes('health')) {
            return 'healthcare';
        }
        
        return 'other';
    }

    populateReceiptForm(data) {
        document.getElementById('merchantName').value = data.merchant;
        document.getElementById('receiptAmount').value = data.amount;
        document.getElementById('receiptDate').value = data.date;
        document.getElementById('receiptCategory').value = data.category;
    }

    saveScannedReceipt() {
        const transaction = {
            type: 'expense',
            description: document.getElementById('merchantName').value || 'Receipt',
            amount: parseFloat(document.getElementById('receiptAmount').value) || 0,
            date: document.getElementById('receiptDate').value,
            category: document.getElementById('receiptCategory').value,
            notes: document.getElementById('receiptNotes').value,
            folder: document.getElementById('receiptFolder').value,
            hasReceipt: true,
            receiptImage: document.getElementById('receiptPreview').src
        };

        if (transaction.amount <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
            return;
        }

        this.addTransaction(transaction);
        
        // Add to folder if selected
        if (transaction.folder) {
            this.addToFolder(transaction.folder, transaction);
        }

        this.closeScannerModal();
        this.showNotification('Receipt saved successfully!', 'success');
    }

    // Expense Modal
    openExpenseModal() {
        document.getElementById('expenseModal').classList.remove('hidden');
    }

    closeExpenseModal() {
        document.getElementById('expenseModal').classList.add('hidden');
        document.getElementById('expenseForm').reset();
        this.setDefaultDate();
    }

    handleExpenseSubmit(event) {
        event.preventDefault();
        
        const transaction = {
            type: 'expense',
            description: document.getElementById('expenseDescription').value,
            amount: parseFloat(document.getElementById('expenseAmount').value),
            date: document.getElementById('expenseDate').value,
            category: document.getElementById('expenseCategory').value,
            notes: document.getElementById('expenseNotes')?.value || '',
            hasReceipt: false
        };

        this.addTransaction(transaction);
        this.closeExpenseModal();
        this.showNotification('Expense added successfully!', 'success');
    }

    // Income Modal (placeholder)
    openIncomeModal() {
        // Create a simple prompt for now
        const amount = prompt('Enter income amount:');
        const description = prompt('Enter income description:');
        
        if (amount && description) {
            const transaction = {
                type: 'income',
                description: description,
                amount: parseFloat(amount),
                date: new Date().toISOString().split('T')[0],
                category: 'income',
                hasReceipt: false
            };
            
            this.addTransaction(transaction);
            this.showNotification('Income added successfully!', 'success');
        }
    }

    // Reminders
    openReminderModal() {
        document.getElementById('reminderModal').classList.remove('hidden');
        this.setDefaultReminderDateTime();
    }

    closeReminderModal() {
        document.getElementById('reminderModal').classList.add('hidden');
        const form = document.getElementById('reminderForm');
        if (form) form.reset();
        this.setDefaultReminderDateTime();
    }

    setDefaultReminderDateTime() {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const pad = (n) => String(n).padStart(2, '0');
        const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        const dateInput = document.getElementById('reminderDate');
        const timeInput = document.getElementById('reminderTime');
        if (dateInput && !dateInput.value) dateInput.value = dateStr;
        if (timeInput && !timeInput.value) timeInput.value = timeStr;
    }

    handleReminderSubmit(event) {
        event.preventDefault();
        const title = document.getElementById('reminderTitle').value.trim();
        const date = document.getElementById('reminderDate').value;
        const time = document.getElementById('reminderTime').value;
        const notes = document.getElementById('reminderNotes').value.trim();

        if (!title || !date || !time) {
            this.showNotification('Please fill in title, date and time', 'error');
            return;
        }

        const triggerAt = new Date(`${date}T${time}:00`).getTime();
        if (isNaN(triggerAt)) {
            this.showNotification('Invalid date/time for reminder', 'error');
            return;
        }

        const reminder = {
            id: Date.now().toString(),
            title,
            date,
            time,
            notes,
            triggerAt,
            completed: false,
            notified: false,
            createdAt: new Date().toISOString()
        };

        this.reminders.unshift(reminder);
        this.saveData();
        this.renderReminders();
        this.closeReminderModal();
        this.showNotification('Reminder added successfully!', 'success');
    }

    renderReminders() {
        const container = document.getElementById('remindersList');
        const empty = document.getElementById('noReminders');
        if (!container) return;

        if (this.reminders.length === 0) {
            if (empty) empty.classList.remove('hidden');
            container.querySelectorAll('.reminder-item').forEach(el => el.remove());
            return;
        }
        if (empty) empty.classList.add('hidden');

        // Show next upcoming reminders (limit 5)
        const upcoming = this.reminders
            .filter(r => !r.completed)
            .sort((a, b) => a.triggerAt - b.triggerAt)
            .slice(0, 5);

        // Clear previous items
        container.innerHTML = '';

        upcoming.forEach(reminder => {
            const dateStr = this.formatDate(reminder.date);
            const item = document.createElement('div');
            item.className = 'reminder-item flex items-center justify-between p-4 bg-gray-50 rounded-lg';
            item.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="p-2 rounded-full bg-yellow-100">
                        <i class="fas fa-bell text-yellow-600"></i>
                    </div>
                    <div>
                        <h3 class="font-medium text-gray-800">${this.escapeHtml(reminder.title)}</h3>
                        <p class="text-sm text-gray-600">${dateStr} • ${reminder.time}</p>
                        ${reminder.notes ? `<p class="text-xs text-gray-500 mt-1">${this.escapeHtml(reminder.notes)}</p>` : ''}
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="mark-complete px-3 py-1 text-xs bg-green-100 text-green-700 rounded" data-id="${reminder.id}">
                        <i class="fas fa-check mr-1"></i>Done
                    </button>
                    <button class="delete-reminder px-3 py-1 text-xs bg-red-100 text-red-700 rounded" data-id="${reminder.id}">
                        <i class="fas fa-trash mr-1"></i>Delete
                    </button>
                </div>
            `;
            container.appendChild(item);
        });

        // Wire actions
        container.querySelectorAll('.mark-complete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                this.completeReminder(id);
            });
        });
        container.querySelectorAll('.delete-reminder').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                this.deleteReminder(id);
            });
        });
    }

    completeReminder(id) {
        const r = this.reminders.find(x => x.id === id);
        if (r) {
            r.completed = true;
            this.saveData();
            this.renderReminders();
            this.showNotification('Reminder marked as done', 'success');
        }
    }

    deleteReminder(id) {
        this.reminders = this.reminders.filter(x => x.id !== id);
        this.saveData();
        this.renderReminders();
        this.showNotification('Reminder deleted', 'warning');
    }

    startReminderScheduler() {
        // Check every 30 seconds
        if (this._reminderInterval) {
            clearInterval(this._reminderInterval);
        }
        this._reminderInterval = setInterval(() => this.checkReminders(), 30000);
        // Initial check
        this.checkReminders();
    }

    checkReminders() {
        const now = Date.now();
        this.reminders.forEach(rem => {
            if (!rem.completed && !rem.notified && typeof rem.triggerAt === 'number' && rem.triggerAt <= now) {
                this.triggerReminder(rem);
            }
        });
    }

    triggerReminder(rem) {
        this.showNotification(`Reminder: ${rem.title}`, 'info');
        rem.notified = true;
        this.saveData();
    }

    // Folder Management
    renderFolders() {
        const container = document.getElementById('foldersList');
        
        container.innerHTML = this.folders.map(folder => `
            <div class="folder-item bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition cursor-pointer" data-folder-id="${folder.id}">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas fa-folder text-${folder.color}-500 text-xl mr-3"></i>
                        <div>
                            <h3 class="font-medium text-gray-800">${folder.name}</h3>
                            <p class="text-sm text-gray-600">${folder.receipts.length} receipts • $${folder.totalAmount.toFixed(2)}</p>
                        </div>
                    </div>
                    <i class="fas fa-ellipsis-v text-gray-400"></i>
                </div>
            </div>
        `).join('');
    }

    createNewFolder() {
        const name = prompt('Enter folder name:');
        if (name) {
            const folder = {
                id: Date.now().toString(),
                name: name,
                color: 'blue',
                receipts: [],
                totalAmount: 0
            };
            
            this.folders.push(folder);
            this.saveData();
            this.renderFolders();
            this.updateFolderOptions();
            this.showNotification('Folder created successfully!', 'success');
        }
    }

    addToFolder(folderId, transaction) {
        const folder = this.folders.find(f => f.id === folderId);
        if (folder) {
            folder.receipts.push(transaction.id);
            folder.totalAmount += transaction.amount;
            this.saveData();
            this.renderFolders();
        }
    }

    updateFolderOptions() {
        const select = document.getElementById('receiptFolder');
        select.innerHTML = '<option value="">No folder</option>' + 
            this.folders.map(folder => `<option value="${folder.id}">${folder.name}</option>`).join('');
    }

    manageFolders() {
        this.showNotification('Folder management feature coming soon!', 'info');
    }

    // Chart Management
    initializeChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#f59e0b', '#3b82f6', '#ec4899', '#10b981', 
                        '#8b5cf6', '#ef4444', '#6b7280'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        
        this.updateChart();
    }

    updateChart() {
        if (!this.chart) return;
        
        const expenses = this.transactions.filter(t => t.type === 'expense');
        const categoryTotals = {};
        
        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });
        
        const labels = Object.keys(categoryTotals).map(cat => this.getCategoryName(cat));
        const data = Object.values(categoryTotals);
        
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }

    // Utility Functions
    getCategoryIcon(category) {
        const icons = {
            food: 'fa-utensils',
            transport: 'fa-car',
            shopping: 'fa-shopping-bag',
            utilities: 'fa-bolt',
            entertainment: 'fa-film',
            healthcare: 'fa-heartbeat',
            income: 'fa-dollar-sign',
            other: 'fa-question'
        };
        return icons[category] || icons.other;
    }

    getCategoryName(category) {
        const names = {
            food: 'Food & Dining',
            transport: 'Transportation',
            shopping: 'Shopping',
            utilities: 'Utilities',
            entertainment: 'Entertainment',
            healthcare: 'Healthcare',
            income: 'Income',
            other: 'Other'
        };
        return names[category] || 'Other';
    }

    getFolderName(folderId) {
        const folder = this.folders.find(f => f.id === folderId);
        return folder ? folder.name : 'Unknown Folder';
    }

    // Side Notes Feature
    openNotesPanel() {
        const panel = document.getElementById('notesPanel');
        if (panel) panel.classList.remove('hidden');
    }

    closeNotesPanel() {
        const panel = document.getElementById('notesPanel');
        if (panel) panel.classList.add('hidden');
        this.clearSideNoteForm();
    }

    renderSideNotes() {
        const listEl = document.getElementById('sideNotesList');
        const emptyEl = document.getElementById('noSideNotes');
        if (!listEl) return;

        if (!this.sideNotes || this.sideNotes.length === 0) {
            listEl.innerHTML = '';
            if (emptyEl) emptyEl.classList.remove('hidden');
            return;
        }

        if (emptyEl) emptyEl.classList.add('hidden');

        const itemsHtml = this.sideNotes.map(note => {
            const titleHtml = note.title ? `<div class="font-semibold text-gray-800">${this.escapeHtml(note.title)}</div>` : '';
            const contentHtml = `<div class="text-gray-700 whitespace-pre-wrap">${this.escapeHtml(note.content)}</div>`;
            const timeLabel = new Date(note.updatedAt || note.createdAt).toLocaleString('en-US');
            return `
                <div class="p-3 border border-gray-200 rounded-lg shadow-sm">
                    ${titleHtml}
                    ${contentHtml}
                    <div class="mt-2 text-xs text-gray-500">${this.escapeHtml(timeLabel)}</div>
                    <div class="mt-2 flex space-x-2">
                        <button class="editSideNoteBtn px-2 py-1 text-xs border rounded hover:bg-gray-50" data-id="${this.escapeHtml(note.id)}">
                            <i class="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button class="deleteSideNoteBtn px-2 py-1 text-xs border rounded hover:bg-gray-50 text-red-600" data-id="${this.escapeHtml(note.id)}">
                            <i class="fas fa-trash mr-1"></i>Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        listEl.innerHTML = itemsHtml;
    }

    handleSideNoteSubmit(event) {
        event.preventDefault();
        const titleInput = document.getElementById('sideNoteTitle');
        const contentInput = document.getElementById('sideNoteContent');
        const title = titleInput ? titleInput.value.trim() : '';
        const content = contentInput ? contentInput.value.trim() : '';

        if (!content) {
            this.showNotification('Please write a note before saving.', 'warning');
            return;
        }

        const nowIso = new Date().toISOString();
        if (this.editingNoteId) {
            const note = this.sideNotes.find(n => n.id === this.editingNoteId);
            if (note) {
                note.title = title;
                note.content = content;
                note.updatedAt = nowIso;
                this.showNotification('Note updated.', 'success');
            }
        } else {
            this.sideNotes.unshift({
                id: String(Date.now()),
                title,
                content,
                createdAt: nowIso,
                updatedAt: nowIso
            });
            this.showNotification('Note saved.', 'success');
        }

        this.editingNoteId = null;
        this.saveData();
        this.renderSideNotes();
        this.clearSideNoteForm();
    }

    clearSideNoteForm() {
        const titleInput = document.getElementById('sideNoteTitle');
        const contentInput = document.getElementById('sideNoteContent');
        if (titleInput) titleInput.value = '';
        if (contentInput) contentInput.value = '';
        this.editingNoteId = null;
    }

    startEditingSideNote(noteId) {
        const note = this.sideNotes.find(n => n.id === noteId);
        if (!note) return;
        const titleInput = document.getElementById('sideNoteTitle');
        const contentInput = document.getElementById('sideNoteContent');
        if (titleInput) titleInput.value = note.title || '';
        if (contentInput) contentInput.value = note.content || '';
        this.editingNoteId = note.id;
        this.openNotesPanel();
        this.showNotification('Editing note. Make changes and save.', 'info');
    }

    deleteSideNote(noteId) {
        const prevLen = this.sideNotes.length;
        this.sideNotes = this.sideNotes.filter(n => n.id !== noteId);
        if (this.sideNotes.length !== prevLen) {
            this.saveData();
            this.renderSideNotes();
            this.showNotification('Note deleted.', 'success');
        }
        if (this.editingNoteId === noteId) {
            this.clearSideNoteForm();
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Data Persistence
    saveData() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        localStorage.setItem('folders', JSON.stringify(this.folders));
        localStorage.setItem('budgets', JSON.stringify(this.budgets));
        localStorage.setItem('reminders', JSON.stringify(this.reminders));
        localStorage.setItem('sideNotes', JSON.stringify(this.sideNotes));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.financeTracker = new FinanceTracker();
});

// Add some demo data for testing
function addDemoData() {
    const tracker = window.financeTracker;
    
    // Demo transactions
    const demoTransactions = [
        {
            type: 'expense',
            description: 'Grocery Shopping',
            amount: 85.50,
            date: '2025-01-15',
            category: 'food',
            hasReceipt: true
        },
        {
            type: 'expense',
            description: 'Gas Station',
            amount: 45.00,
            date: '2025-01-14',
            category: 'transport',
            hasReceipt: false
        },
        {
            type: 'income',
            description: 'Salary',
            amount: 3500.00,
            date: '2025-01-01',
            category: 'income',
            hasReceipt: false
        }
    ];
    
    demoTransactions.forEach(transaction => {
        tracker.addTransaction(transaction);
    });
}

// Expose demo function globally for testing
window.addDemoData = addDemoData;