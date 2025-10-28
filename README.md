# 💸 Finance & Budget Tracker

A comprehensive personal finance and budget tracking application with receipt scanning, automatic categorization, and folder organization capabilities.

## ✨ Features

### 🏠 Dashboard
- **Summary Cards**: Track total income, expenses, net savings, and scanned receipts
- **Quick Actions**: Fast access to scan receipts, add expenses/income, and manage folders
- **Visual Charts**: Spending breakdown by category with interactive doughnut chart
- **Recent Transactions**: View latest financial activities with category indicators

### 🧾 Receipt Scanning & OCR
- **Multiple Input Methods**: Upload images or use device camera
- **AI-Powered OCR**: Automatic text extraction using Tesseract.js
- **Smart Data Extraction**: Automatically detects merchant name, amount, date, and tax
- **Intelligent Categorization**: AI suggests categories based on merchant and content
- **Manual Review**: Edit and confirm extracted data before saving

### 📁 Folder Management
- **Organized Storage**: Create custom folders (e.g., "2025 Taxes", "Business Expenses")
- **Drag & Drop**: Easy organization of receipts and expenses
- **Folder Insights**: Track total spending and receipt count per folder
- **Default Folders**: Pre-configured tax and business expense folders

### 💰 Expense & Income Tracking
- **Manual Entry**: Quick expense and income addition
- **Category System**: 7 predefined categories with custom icons and colors
- **Date Management**: Automatic date setting with manual override
- **Notes Support**: Add detailed notes to transactions
- **Receipt Attachment**: Link scanned receipts to transactions

### 📊 Budget & Analytics
- **Category Breakdown**: Visual spending analysis by category
- **Budget Progress**: Track spending against set budgets (coming soon)
- **Spending Trends**: Historical data visualization
- **Export Capabilities**: Download reports in CSV/PDF format (planned)

### 🔔 Reminders & Notifications
- **Smart Notifications**: Success, error, and warning messages
- **Reminder System**: Set up payment and budget reminders (planned)
- **Real-time Updates**: Instant dashboard updates after transactions

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript
- **OCR Engine**: Tesseract.js for text recognition
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome 6
- **Storage**: Local Storage for data persistence
- **Responsive**: Mobile-first design with responsive layouts

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)

### Installation

1. **Clone or Download** the project files
2. **Install Dependencies** (optional):
   ```bash
   npm install
   ```

3. **Start Local Server**:
   ```bash
   npm start
   # or use any local server like Live Server, Python's http.server, etc.
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:3000` or open `mk.html` directly

### Quick Setup
1. Open `mk.html` in your web browser
2. Start adding transactions or scanning receipts
3. Create custom folders for organization
4. View your spending analytics on the dashboard

## 📱 Usage Guide

### Scanning Receipts
1. Click **"Scan Receipt"** from Quick Actions
2. Choose **"Upload Image"** or **"Use Camera"**
3. Wait for AI processing to extract data
4. Review and edit the extracted information
5. Assign to a folder (optional)
6. Click **"Save Receipt"**

### Adding Manual Expenses
1. Click **"Add Expense"** from Quick Actions
2. Fill in description, amount, category, and date
3. Click **"Add Expense"**

### Managing Folders
1. Click **"Manage Folders"** or **"New Folder"**
2. Create custom folders for different purposes
3. Assign transactions to folders during entry
4. View folder summaries in the Folders section

### Viewing Analytics
- Dashboard shows real-time summary cards
- Category chart displays spending breakdown
- Recent transactions list shows latest activities
- Color-coded categories for easy identification

## 🎨 Categories & Color Coding

| Category | Icon | Color | Examples |
|----------|------|-------|----------|
| 🍔 Food & Dining | Utensils | Amber | Restaurants, groceries, cafes |
| 🚗 Transportation | Car | Blue | Gas, Uber, public transport |
| 🛍️ Shopping | Shopping Bag | Pink | Retail, online purchases |
| ⚡ Utilities | Bolt | Green | Electric, water, phone, internet |
| 🎬 Entertainment | Film | Purple | Movies, games, subscriptions |
| 🏥 Healthcare | Heartbeat | Red | Medical, pharmacy, insurance |
| 📦 Other | Question | Gray | Miscellaneous expenses |

## 🔧 Customization

### Adding New Categories
1. Edit the category arrays in `js/app.js`
2. Add corresponding CSS classes for colors
3. Update the categorization logic

### Modifying OCR Accuracy
- Adjust the text extraction patterns in `extractReceiptData()`
- Fine-tune the smart categorization rules
- Add merchant-specific recognition patterns

### Styling Changes
- Modify Tailwind CSS classes in the HTML
- Add custom CSS in the `<style>` section
- Update color schemes and animations

## 📊 Data Storage

All data is stored locally in your browser using Local Storage:
- **Transactions**: All income and expense records
- **Folders**: Custom folder configurations
- **Budgets**: Budget settings and limits
- **Reminders**: Scheduled notifications

### Data Export/Import (Planned)
- Export data to JSON, CSV, or PDF
- Import from other finance apps
- Backup and restore functionality

## 🔒 Privacy & Security

- **Local Storage**: All data stays on your device
- **No Server**: No data transmitted to external servers
- **Secure Processing**: OCR processing happens locally
- **Privacy First**: No tracking or analytics

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Basic expense/income tracking
- ✅ Receipt scanning with OCR
- ✅ Folder organization
- ✅ Category-based analytics

### Phase 2 (Planned)
- 🔄 Budget management with alerts
- 🔄 Advanced reporting and exports
- 🔄 Reminder system
- 🔄 Multi-currency support

### Phase 3 (Future)
- 🔄 Cloud sync and backup
- 🔄 Mobile app version
- 🔄 Bank integration
- 🔄 AI-powered insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or feature requests:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- **Tesseract.js** for OCR capabilities
- **Chart.js** for beautiful data visualization
- **Tailwind CSS** for rapid UI development
- **Font Awesome** for comprehensive icons

---

**Happy Budgeting! 💰📊**