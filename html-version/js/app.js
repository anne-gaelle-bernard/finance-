// Finance & Budget Tracker - Main Application
class FinanceTracker {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.folders = JSON.parse(localStorage.getItem('folders')) || [
            { id: 'taxes', name: '2025 Taxes', color: 'rose', receipts: [], totalAmount: 0 },
            { id: 'business', name: 'Business Expenses', color: 'pink', receipts: [], totalAmount: 0 }
        ];
        this.budgets = JSON.parse(localStorage.getItem('budgets')) || {};
        this.reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        this.sideNotes = JSON.parse(localStorage.getItem('sideNotes')) || [];
        this.goals = JSON.parse(localStorage.getItem('goals')) || [];
        this.settings = JSON.parse(localStorage.getItem('settings')) || { name: '', currency: 'USD', theme: 'light', onboardingCompleted: false };
        this.editingNoteId = null;
        this.editingGoalId = null;
        this.calculator = { expr: '', lastResult: 0 };
        this.onboarding = { step: 0, stepsTotal: 4 };

        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.updateDashboard();
        this.renderTransactions();
        this.renderFolders();
        this.renderReminders();
        this.renderSideNotes();
        this.renderGoals();
        this.initializeChart();
        this.setDefaultDate();
        this.updateFolderOptions();
        this.startReminderScheduler();
        // Ensure UI reflects persisted settings (currency, etc.)
        this.applySettingsToUI();
        // Open onboarding on first run
        if (this.currentUser && !this.settings.onboardingCompleted) {
            this.openOnboardingModal();
        }
    }

    setupEventListeners() {
        // Authentication
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) loginBtn.addEventListener('click', () => this.openLoginModal());
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) registerBtn.addEventListener('click', () => this.openRegisterModal());
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
        
        const closeLoginBtn = document.getElementById('closeLoginBtn');
        if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => this.closeLoginModal());
        const cancelLoginBtn = document.getElementById('cancelLoginBtn');
        if (cancelLoginBtn) cancelLoginBtn.addEventListener('click', () => this.closeLoginModal());
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        
        const closeRegisterBtn = document.getElementById('closeRegisterBtn');
        if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', () => this.closeRegisterModal());
        const cancelRegisterBtn = document.getElementById('cancelRegisterBtn');
        if (cancelRegisterBtn) cancelRegisterBtn.addEventListener('click', () => this.closeRegisterModal());
        const registerForm = document.getElementById('registerForm');
        if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        
        const switchToRegister = document.getElementById('switchToRegister');
        if (switchToRegister) switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeLoginModal();
            this.openRegisterModal();
        });
        const switchToLogin = document.getElementById('switchToLogin');
        if (switchToLogin) switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeRegisterModal();
            this.openLoginModal();
        });
        
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

        // Profile & Settings Modal
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) profileBtn.addEventListener('click', () => this.openProfileModal());
        const closeProfileBtn = document.getElementById('closeProfileBtn');
        if (closeProfileBtn) closeProfileBtn.addEventListener('click', () => this.closeProfileModal());
        const cancelProfileBtn = document.getElementById('cancelProfileBtn');
        if (cancelProfileBtn) cancelProfileBtn.addEventListener('click', () => this.closeProfileModal());
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        if (saveProfileBtn) saveProfileBtn.addEventListener('click', () => this.handleProfileSave());
        const profileForm = document.getElementById('profileForm');
        if (profileForm) profileForm.addEventListener('submit', (e) => { e.preventDefault(); this.handleProfileSave(); });

        // Financial Goals Modal & Actions
        const addGoalBtn = document.getElementById('addGoalBtn');
        if (addGoalBtn) addGoalBtn.addEventListener('click', () => this.openGoalModal());
        const closeGoalBtn = document.getElementById('closeGoalBtn');
        if (closeGoalBtn) closeGoalBtn.addEventListener('click', () => this.closeGoalModal());
        const cancelGoalBtn = document.getElementById('cancelGoalBtn');
        if (cancelGoalBtn) cancelGoalBtn.addEventListener('click', () => this.closeGoalModal());
        const goalForm = document.getElementById('goalForm');
        if (goalForm) goalForm.addEventListener('submit', (e) => this.handleGoalSubmit(e));
        const goalsList = document.getElementById('goalsList');
        if (goalsList) {
            goalsList.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;
                if (btn.classList.contains('deleteGoalBtn')) {
                    const id = btn.getAttribute('data-id');
                    this.deleteGoal(id);
                } else if (btn.classList.contains('editGoalBtn')) {
                    const id = btn.getAttribute('data-id');
                    this.startEditingGoal(id);
                }
            });
            // Live update progress on slider input, persist on change
            goalsList.addEventListener('input', (e) => {
                const slider = e.target.closest('.goalProgressSlider');
                if (!slider) return;
                const id = slider.getAttribute('data-id');
                const value = Number(slider.value) || 0;
                const goal = this.goals.find(g => g.id === id);
                if (!goal) return;
                goal.currentAmount = Math.min(value, goal.targetAmount || 0);
                const percent = goal.targetAmount > 0 ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) : 0;
                const progressEl = goalsList.querySelector(`.goal-progress[data-id="${id}"]`);
                const textEl = goalsList.querySelector(`.goal-text[data-id="${id}"]`);
                if (progressEl) progressEl.style.width = `${percent}%`;
                if (textEl) textEl.textContent = `${this.formatCurrency(goal.currentAmount)} of ${this.formatCurrency(goal.targetAmount)}${goal.deadline ? ` • Due ${this.formatDate(goal.deadline)}` : ''}`;
            });
            goalsList.addEventListener('change', (e) => {
                const slider = e.target.closest('.goalProgressSlider');
                if (!slider) return;
                const id = slider.getAttribute('data-id');
                const value = Number(slider.value) || 0;
                const goal = this.goals.find(g => g.id === id);
                if (!goal) return;
                goal.currentAmount = Math.min(value, goal.targetAmount || 0);
                this.saveData();
                this.renderGoals();
                this.showNotification('Goal progress updated', 'success');
            });
        }

        // Income Modal
        const closeIncomeBtn = document.getElementById('closeIncomeBtn');
        if (closeIncomeBtn) closeIncomeBtn.addEventListener('click', () => this.closeIncomeModal());
        const cancelIncomeBtn = document.getElementById('cancelIncomeBtn');
        if (cancelIncomeBtn) cancelIncomeBtn.addEventListener('click', () => this.closeIncomeModal());
        const incomeForm = document.getElementById('incomeForm');
        if (incomeForm) incomeForm.addEventListener('submit', (e) => this.handleIncomeSubmit(e));

        // Calculator Modal & Actions
        const calcBtn = document.getElementById('calcBtn');
        if (calcBtn) calcBtn.addEventListener('click', () => this.openCalculatorModal());
        const closeCalcBtn = document.getElementById('closeCalcBtn');
        if (closeCalcBtn) closeCalcBtn.addEventListener('click', () => this.closeCalculatorModal());
        const cancelCalcBtn = document.getElementById('cancelCalcBtn');
        if (cancelCalcBtn) cancelCalcBtn.addEventListener('click', () => this.closeCalculatorModal());
        const copyCalcBtn = document.getElementById('copyCalcBtn');
        if (copyCalcBtn) copyCalcBtn.addEventListener('click', () => this.copyCalculatorResult());
        const calcKeys = document.getElementById('calcKeys');
        if (calcKeys) {
            calcKeys.addEventListener('click', (e) => {
                const btn = e.target.closest('button[data-key]');
                if (!btn) return;
                const key = btn.getAttribute('data-key');
                this.handleCalculatorKey(key);
            });
        }

        // Push Notification Quick Action
        const notifyBtn = document.getElementById('notifyBtn');
        if (notifyBtn) {
            notifyBtn.addEventListener('click', async () => {
                await this.pushNotification('Hello from Finance Tracker!', {
                    body: 'Your dashboard is ready. Stay on top of your finances.',
                    icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4b0.png'
                });
            });
        }

        // Theme Toggle
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark';
                this.saveData();
                this.applySettingsToUI();
                const icon = themeToggleBtn.querySelector('i');
                if (icon) icon.className = this.settings.theme === 'dark' ? 'fas fa-sun text-xl' : 'fas fa-moon text-xl';
            });
        }

        // Onboarding controls
        const closeOnboardingBtn = document.getElementById('closeOnboardingBtn');
        const onboardingPrevBtn = document.getElementById('onboardingPrevBtn');
        const onboardingNextBtn = document.getElementById('onboardingNextBtn');
        const onboardingSkipBtn = document.getElementById('onboardingSkipBtn');
        if (closeOnboardingBtn) closeOnboardingBtn.addEventListener('click', () => this.closeOnboardingModal());
        if (onboardingPrevBtn) onboardingPrevBtn.addEventListener('click', () => this.prevOnboardingStep());
        if (onboardingNextBtn) onboardingNextBtn.addEventListener('click', () => this.nextOnboardingStep());
        if (onboardingSkipBtn) onboardingSkipBtn.addEventListener('click', () => this.completeOnboarding());
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
        // Currency-aware display using profile settings
        document.getElementById('totalIncome').textContent = this.formatCurrency(totalIncome);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(totalExpenses);
        const netText = netSavings < 0
            ? `-${this.formatCurrency(Math.abs(netSavings))}`
            : this.formatCurrency(netSavings);
        document.getElementById('netSavings').textContent = netText;
        document.getElementById('receiptsCount').textContent = receiptsCount;

        // Update net savings color based on positive/negative (elegant pink)
        const netSavingsElement = document.getElementById('netSavings');
        if (netSavings >= 0) {
            netSavingsElement.className = 'text-2xl font-bold text-rose-600';
        } else {
            netSavingsElement.className = 'text-2xl font-bold text-pink-700';
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
                        ${transaction.folder ? `<span class="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full mt-1">${this.getFolderName(transaction.folder)}</span>` : ''}
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold ${transaction.type === 'income' ? 'text-rose-600' : 'text-pink-700'}">
                        ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
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

    // Income Modal
    openIncomeModal() {
        document.getElementById('incomeModal').classList.remove('hidden');
        const today = new Date().toISOString().split('T')[0];
        const incomeDateInput = document.getElementById('incomeDate');
        if (incomeDateInput) incomeDateInput.value = today;
    }

    closeIncomeModal() {
        document.getElementById('incomeModal').classList.add('hidden');
        document.getElementById('incomeForm').reset();
        const today = new Date().toISOString().split('T')[0];
        const incomeDateInput = document.getElementById('incomeDate');
        if (incomeDateInput) incomeDateInput.value = today;
    }

    handleIncomeSubmit(event) {
        event.preventDefault();
        
        const transaction = {
            type: 'income',
            description: document.getElementById('incomeDescription').value,
            amount: parseFloat(document.getElementById('incomeAmount').value),
            date: document.getElementById('incomeDate').value,
            category: 'income',
            notes: document.getElementById('incomeNotes')?.value || '',
            hasReceipt: false
        };

        this.addTransaction(transaction);
        this.closeIncomeModal();
        this.showNotification('Income added successfully!', 'success');
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
                    <div class="p-2 rounded-full bg-pink-100">
                        <i class="fas fa-bell text-pink-600"></i>
                    </div>
                    <div>
                        <h3 class="font-medium text-gray-800">${this.escapeHtml(reminder.title)}</h3>
                        <p class="text-sm text-gray-600">${dateStr} • ${reminder.time}</p>
                        ${reminder.notes ? `<p class="text-xs text-gray-500 mt-1">${this.escapeHtml(reminder.notes)}</p>` : ''}
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="mark-complete px-3 py-1 text-xs bg-rose-100 text-rose-700 rounded" data-id="${reminder.id}">
                        <i class="fas fa-check mr-1"></i>Done
                    </button>
                    <button class="delete-reminder px-3 py-1 text-xs bg-pink-100 text-pink-700 rounded" data-id="${reminder.id}">
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
        // Attempt desktop notification, fallback to in-app toast
        this.pushNotification(`Reminder: ${rem.title}`, {
            body: `${rem.date} • ${rem.time}${rem.notes ? ' • ' + rem.notes : ''}`,
            icon: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f514.png'
        });
        this.showNotification(`Reminder: ${rem.title}`, 'info');
        rem.notified = true;
        this.saveData();
    }

    // Folder Management
    renderFolders() {
        const container = document.getElementById('foldersList');
        
        container.innerHTML = this.folders.map(folder => `
            <div class="folder-item bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-pink-400 transition cursor-pointer" data-folder-id="${folder.id}">
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
                color: 'pink',
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
if (!select) return;
        
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
                        '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899',
                        '#db2777', '#be185d', '#9d174d'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#6b7280',
                            boxWidth: 12,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: '#ec4899',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff'
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

    // Profile & Settings
    openProfileModal() {
        const modal = document.getElementById('profileModal');
        if (!modal) return;
        const nameInput = document.getElementById('profileName');
        const currencySelect = document.getElementById('profileCurrency');
        if (nameInput) nameInput.value = this.settings?.name || '';
        if (currencySelect) currencySelect.value = this.settings?.currency || 'USD';
        modal.classList.remove('hidden');
    }

    closeProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) modal.classList.add('hidden');
    }

    handleProfileSave() {
        const nameInput = document.getElementById('profileName');
        const currencySelect = document.getElementById('profileCurrency');
        const name = nameInput ? nameInput.value.trim() : '';
        const currency = currencySelect ? currencySelect.value : 'USD';
        this.settings = { ...(this.settings || {}), name, currency };
        this.saveData();
        this.applySettingsToUI();
        this.showNotification('Profile saved', 'success');
        this.closeProfileModal();
    }

    formatCurrency(amount) {
        const currency = (this.settings && this.settings.currency) || 'USD';
        try {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(amount) || 0);
        } catch (e) {
            const symbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
            const symbol = symbols[currency] || '$';
            return `${symbol}${(Number(amount) || 0).toFixed(2)}`;
        }
    }

    applySettingsToUI() {
        // Theme
        const body = document.body;
        if (body) {
            if (this.settings && this.settings.theme === 'dark') {
                body.classList.add('dark-theme');
            } else {
                body.classList.remove('dark-theme');
            }
        }
        // Re-render key UI areas that depend on settings
        this.updateDashboard();
        this.renderTransactions();
        this.renderGoals();
        // Keep onboarding content in sync
        this.renderOnboardingStep();
    }

    // Onboarding
    openOnboardingModal() {
        const modal = document.getElementById('onboardingModal');
        if (!modal) return;
        modal.classList.remove('hidden');
        this.onboarding.step = 0;
        this.renderOnboardingStep();
    }

    closeOnboardingModal() {
        const modal = document.getElementById('onboardingModal');
        if (!modal) return;
        modal.classList.add('hidden');
    }

    nextOnboardingStep() {
        if (this.onboarding.step < this.onboarding.stepsTotal - 1) {
            this.onboarding.step++;
            this.renderOnboardingStep();
        } else {
            this.completeOnboarding();
        }
    }

    prevOnboardingStep() {
        if (this.onboarding.step > 0) {
            this.onboarding.step--;
            this.renderOnboardingStep();
        }
    }

    completeOnboarding() {
        this.settings.onboardingCompleted = true;
        this.saveData();
        this.closeOnboardingModal();
    }

    renderOnboardingStep() {
        const content = document.getElementById('onboardingContent');
        const indicator = document.getElementById('onboardingStepIndicator');
        if (!content || !indicator) return;
        const step = this.onboarding.step;
        const total = this.onboarding.stepsTotal;
        indicator.textContent = `Étape ${step + 1} / ${total}`;
        let html = '';
        if (step === 0) {
            html = `
                <div class="space-y-2">
                    <p class="text-gray-700">Découvrez votre tableau de bord financier moderne.</p>
                    <ul class="list-disc pl-5 text-gray-600">
                        <li>Suivi des dépenses et catégories</li>
                        <li>Objectifs financiers avec progression</li>
                        <li>Rappels et dossiers</li>
                    </ul>
                </div>
            `;
        } else if (step === 1) {
            html = `
                <div class="space-y-2">
                    <p class="text-gray-700">Actions rapides et nouveaux outils.</p>
                    <ul class="list-disc pl-5 text-gray-600">
                        <li>Boutons d’ajout rapide</li>
                        <li>Calculatrice intégrée</li>
                    </ul>
                </div>
            `;
        } else if (step === 2) {
            html = `
                <div class="space-y-2">
                    <p class="text-gray-700">Objectifs et progression élégante.</p>
                    <ul class="list-disc pl-5 text-gray-600">
                        <li>Glissière de progression en temps réel</li>
                        <li>Animation fluide et sauvegarde automatique</li>
                    </ul>
                </div>
            `;
        } else if (step === 3) {
            html = `
                <div class="space-y-2">
                    <p class="text-gray-700">Personnalisation et thème.</p>
                    <ul class="list-disc pl-5 text-gray-600">
                        <li>Basculer le thème dans la barre de navigation</li>
                        <li>Préférences persistantes (clair/sombre)</li>
                    </ul>
                    <div class="mt-4">
                        <button class="btn w-full" id="onboardingDoneBtn">Terminer</button>
                    </div>
                </div>
            `;
        }
        content.innerHTML = html;
        const doneBtn = document.getElementById('onboardingDoneBtn');
        if (doneBtn) doneBtn.addEventListener('click', () => this.completeOnboarding());
    }

    // Calculator Feature
    openCalculatorModal() {
        const modal = document.getElementById('calcModal');
        if (modal) modal.classList.remove('hidden');
        this.updateCalculatorDisplay();
    }
    closeCalculatorModal() {
        const modal = document.getElementById('calcModal');
        if (modal) modal.classList.add('hidden');
        this.calculator.expr = '';
        this.calculator.lastResult = 0;
        this.updateCalculatorDisplay();
    }
    updateCalculatorDisplay() {
        const display = document.getElementById('calcDisplay');
        if (!display) return;
        const expr = this.calculator.expr || '0';
        display.textContent = expr;
    }
    copyCalculatorResult() {
        const result = this.safeEvaluate(this.calculator.expr);
        if (result == null) {
            this.showNotification('Invalid expression', 'warning');
            return;
        }
        const text = String(result);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Result copied', 'success');
            }).catch(() => {
                this.showNotification('Copy failed', 'error');
            });
        }
    }
    handleCalculatorKey(key) {
        if (key === 'C') {
            this.calculator.expr = '';
            this.calculator.lastResult = 0;
            this.updateCalculatorDisplay();
            return;
        }
        if (key === '⌫') {
            this.calculator.expr = (this.calculator.expr || '').slice(0, -1);
            this.updateCalculatorDisplay();
            return;
        }
        if (key === '=') {
            const result = this.safeEvaluate(this.calculator.expr);
            if (result == null || !isFinite(result)) {
                this.showNotification('Invalid expression', 'warning');
                return;
            }
            this.calculator.lastResult = result;
            this.calculator.expr = String(result);
            this.updateCalculatorDisplay();
            return;
        }
        // Append allowed keys
        const allowed = /[0-9+\-*/().]/;
        if (allowed.test(key)) {
            this.calculator.expr = (this.calculator.expr || '') + key;
            this.updateCalculatorDisplay();
        }
    }
    safeEvaluate(expr) {
        if (!expr) return 0;
        // Only allow digits, operators, parentheses, and dots
        const sanitized = String(expr).replace(/[^0-9+\-*/().]/g, '');
        try {
            // eslint-disable-next-line no-new-func
            const fn = new Function(`return (${sanitized})`);
            const val = fn();
            return typeof val === 'number' ? val : null;
        } catch (e) {
            return null;
        }
    }

    // Financial Goals
    openGoalModal() {
        const modal = document.getElementById('goalModal');
        if (modal) modal.classList.remove('hidden');
    }

    closeGoalModal() {
        const modal = document.getElementById('goalModal');
        if (modal) modal.classList.add('hidden');
        // Reset editing state and form fields
        this.editingGoalId = null;
        const titleEl = modal ? modal.querySelector('h2') : null;
        const submitEl = modal ? modal.querySelector('button[type="submit"]') : null;
        if (titleEl) titleEl.textContent = '🎯 Add Financial Goal';
        if (submitEl) submitEl.innerHTML = '<i class="fas fa-save mr-2"></i>Save Goal';
        const nameEl = document.getElementById('goalName');
        const targetEl = document.getElementById('goalTarget');
        const currentEl = document.getElementById('goalCurrent');
        const deadlineEl = document.getElementById('goalDeadline');
        if (nameEl) nameEl.value = '';
        if (targetEl) targetEl.value = '';
        if (currentEl) currentEl.value = '';
        if (deadlineEl) deadlineEl.value = '';
    }

    handleGoalSubmit(event) {
        event.preventDefault();
        const nameEl = document.getElementById('goalName');
        const targetEl = document.getElementById('goalTarget');
        const currentEl = document.getElementById('goalCurrent');
        const deadlineEl = document.getElementById('goalDeadline');
        const name = nameEl ? nameEl.value.trim() : '';
        const targetAmount = Number(targetEl ? targetEl.value : 0) || 0;
        const currentAmount = Number(currentEl ? currentEl.value : 0) || 0;
        const deadline = deadlineEl ? deadlineEl.value : '';
        if (!name || targetAmount <= 0) {
            this.showNotification('Please provide a goal name and valid target', 'warning');
            return;
        }
        if (this.editingGoalId) {
            const idx = this.goals.findIndex(g => g.id === this.editingGoalId);
            if (idx !== -1) {
                this.goals[idx] = {
                    ...this.goals[idx],
                    name,
                    targetAmount,
                    currentAmount,
                    deadline
                };
            }
        } else {
            const goal = {
                id: Date.now().toString(),
                name,
                targetAmount,
                currentAmount,
                deadline,
                createdAt: new Date().toISOString()
            };
            this.goals.unshift(goal);
        }
        this.saveData();
        this.renderGoals();
        this.closeGoalModal();
        this.showNotification(this.editingGoalId ? 'Goal updated' : 'Goal added', 'success');
        this.editingGoalId = null;
        // Form is cleared in closeGoalModal
    }

    renderGoals() {
        const listEl = document.getElementById('goalsList');
        const emptyEl = document.getElementById('noGoals');
        if (!listEl) return;
        if (!this.goals || this.goals.length === 0) {
            listEl.innerHTML = '';
            if (emptyEl) emptyEl.classList.remove('hidden');
            return;
        }
        if (emptyEl) emptyEl.classList.add('hidden');
        listEl.innerHTML = this.goals.map(goal => {
            const percent = goal.targetAmount > 0 ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) : 0;
            return `
                <div class="p-4 bg-gray-50 rounded-lg">
                    <div class="flex justify-between items-center mb-2">
                        <div>
                            <h3 class="font-medium text-gray-800">${this.escapeHtml(goal.name)}</h3>
                            <p class="text-sm text-gray-600 goal-text" data-id="${goal.id}">${this.formatCurrency(goal.currentAmount)} of ${this.formatCurrency(goal.targetAmount)}${goal.deadline ? ` • Due ${this.formatDate(goal.deadline)}` : ''}</p>
                        </div>
                        <div class="flex gap-2">
                            <button class="btn-outline text-sm editGoalBtn" data-id="${goal.id}">
                                <i class="fas fa-edit mr-1"></i>Edit
                            </button>
                            <button class="btn-outline text-sm deleteGoalBtn" data-id="${goal.id}">
                                <i class="fas fa-trash mr-1"></i>Delete
                            </button>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-rose-500 h-2 rounded-full goal-progress" data-id="${goal.id}" style="width: ${percent}%;"></div>
                    </div>
                    <div class="mt-1 text-xs text-gray-600">${Math.round(percent)}%</div>
                    <div class="mt-3">
                        <input type="range" class="w-full goalProgressSlider" min="0" max="${goal.targetAmount || 0}" step="1" value="${Math.min(goal.currentAmount || 0, goal.targetAmount || 0)}" data-id="${goal.id}" ${goal.targetAmount > 0 ? '' : 'disabled'} />
                        <div class="text-xs text-gray-500 mt-1">Drag to adjust current amount</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    startEditingGoal(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;
        this.editingGoalId = goalId;
        const modal = document.getElementById('goalModal');
        const titleEl = modal ? modal.querySelector('h2') : null;
        const submitEl = modal ? modal.querySelector('button[type="submit"]') : null;
        if (titleEl) titleEl.textContent = '🎯 Edit Financial Goal';
        if (submitEl) submitEl.innerHTML = '<i class="fas fa-save mr-2"></i>Save Changes';
        const nameEl = document.getElementById('goalName');
        const targetEl = document.getElementById('goalTarget');
        const currentEl = document.getElementById('goalCurrent');
        const deadlineEl = document.getElementById('goalDeadline');
        if (nameEl) nameEl.value = goal.name;
        if (targetEl) targetEl.value = goal.targetAmount;
        if (currentEl) currentEl.value = goal.currentAmount;
        if (deadlineEl) deadlineEl.value = goal.deadline || '';
        this.openGoalModal();
    }

    deleteGoal(id) {
        this.goals = this.goals.filter(g => g.id !== id);
        this.saveData();
        this.renderGoals();
        this.showNotification('Goal deleted', 'success');
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
            type === 'success' ? 'bg-rose-600 text-white' :
            type === 'error' ? 'bg-pink-700 text-white' :
            type === 'warning' ? 'bg-pink-500 text-white' :
            'bg-pink-400 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Push Notifications
    async requestNotificationPermission() {
        if (!('Notification' in window)) return 'unsupported';
        try {
            if (Notification.permission === 'granted' || Notification.permission === 'denied') {
                return Notification.permission;
            }
            const perm = await Notification.requestPermission();
            return perm;
        } catch (e) {
            return 'denied';
        }
    }

    async pushNotification(title, options = {}) {
        if (!('Notification' in window)) {
            this.showNotification(title, 'info');
            return;
        }
        const permission = await this.requestNotificationPermission();
        if (permission === 'granted') {
            try {
                const n = new Notification(title, options);
                setTimeout(() => n.close && n.close(), 5000);
            } catch (e) {
                this.showNotification(title, 'info');
            }
        } else {
            this.showNotification(title, 'info');
        }
    }

    // Data Persistence
    saveData() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        localStorage.setItem('folders', JSON.stringify(this.folders));
        localStorage.setItem('budgets', JSON.stringify(this.budgets));
        localStorage.setItem('reminders', JSON.stringify(this.reminders));
        localStorage.setItem('sideNotes', JSON.stringify(this.sideNotes));
        localStorage.setItem('goals', JSON.stringify(this.goals));
        localStorage.setItem('settings', JSON.stringify(this.settings));
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    // Authentication Methods
    checkAuth() {
        // Toujours marquer comme logged-in si l'utilisateur existe
        if (this.currentUser) {
            document.body.classList.add('logged-in');
            this.loadUserData();
        } else {
            document.body.classList.remove('logged-in');
        }
    }

    openLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) modal.classList.remove('hidden');
    }

    closeLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) modal.classList.add('hidden');
        const form = document.getElementById('loginForm');
        if (form) form.reset();
    }

    handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = { email: user.email, name: user.name };
            this.saveData();
            this.checkAuth();
            this.closeLoginModal();
            this.showNotification(`Bienvenue ${user.name}!`, 'success');
            // Load user-specific data
            this.loadUserData();
            // Refresh all displays
            this.updateDashboard();
            this.renderTransactions();
            this.renderGoals();
        } else {
            this.showNotification('Email ou mot de passe incorrect', 'error');
        }
    }

    openRegisterModal() {
        const modal = document.getElementById('registerModal');
        if (modal) modal.classList.remove('hidden');
    }

    closeRegisterModal() {
        const modal = document.getElementById('registerModal');
        if (modal) modal.classList.add('hidden');
        const form = document.getElementById('registerForm');
        if (form) form.reset();
    }

    handleRegister(event) {
        event.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (password !== confirmPassword) {
            this.showNotification('Les mots de passe ne correspondent pas', 'error');
            return;
        }
        
        if (this.users.find(u => u.email === email)) {
            this.showNotification('Cet email est déjà utilisé', 'error');
            return;
        }
        
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.currentUser = { email: newUser.email, name: newUser.name };
        this.settings.name = name;
        this.saveData();
        this.checkAuth();
        this.closeRegisterModal();
        this.showNotification(`Compte créé avec succès! Bienvenue ${name}!`, 'success');
        
        // Open onboarding for new users
        setTimeout(() => this.openOnboardingModal(), 500);
    }

    logout() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            this.showNotification('Déconnexion réussie', 'success');
            // Rediriger vers la page de connexion
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 500);
        }
    }

    loadUserData() {
        if (!this.currentUser) return;
        // Load user-specific data from localStorage with user prefix
        const userKey = this.currentUser.email;
        this.transactions = JSON.parse(localStorage.getItem(`${userKey}_transactions`)) || [];
        this.folders = JSON.parse(localStorage.getItem(`${userKey}_folders`)) || [
            { id: 'taxes', name: '2025 Taxes', color: 'rose', receipts: [], totalAmount: 0 },
            { id: 'business', name: 'Business Expenses', color: 'pink', receipts: [], totalAmount: 0 }
        ];
        this.budgets = JSON.parse(localStorage.getItem(`${userKey}_budgets`)) || {};
        this.reminders = JSON.parse(localStorage.getItem(`${userKey}_reminders`)) || [];
        this.sideNotes = JSON.parse(localStorage.getItem(`${userKey}_sideNotes`)) || [];
        this.goals = JSON.parse(localStorage.getItem(`${userKey}_goals`)) || [];
        this.settings = JSON.parse(localStorage.getItem(`${userKey}_settings`)) || { 
            name: this.currentUser.name, 
            currency: 'USD', 
            theme: 'light', 
            onboardingCompleted: false 
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.financeTracker = new FinanceTracker();
});