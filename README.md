# Split App - Expense Splitting Application

A full-stack expense-splitting application that helps groups of people split expenses fairly and calculate who owes money to whom. Built with React frontend and Express backend using local JSON storage.
App is deployed on Railway.
![image](https://github.com/user-attachments/assets/6b9e9dc7-9209-40b1-8cdd-3c6ab112cb8e)



![image](https://github.com/user-attachments/assets/27054cd8-e24f-4db8-b903-cd00ec5e3bff)
Main DashBoard Of the app.
![image](https://github.com/user-attachments/assets/eb97af67-81cf-47f5-994d-a97c0cda59c6)
People Tab.
![image](https://github.com/user-attachments/assets/43cb8b2f-7711-46d6-9e92-0645a6b20cfe)
Expenses Tab



## Features

### Core Features
- **Expense Tracking**: Add, edit, and delete expenses with automatic person creation
- **Settlement Calculations**: Calculate optimized settlements to minimize transactions
- **Balance Management**: Real-time balance calculations for each person
- **Data Validation**: Comprehensive input validation and error handling

### Pages
- **Dashboard**: Overview of total expenses, active people, and pending settlements
- **Expenses**: Complete expense management with filtering and sorting
- **Settlements**: Optimized settlement summary showing who owes whom
- **People**: Detailed balance information for each group member

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (routing), TanStack Query
- **Backend**: Node.js, Express, TypeScript
- **Storage**: Local JSON files (no database required)
- **UI Components**: Shadcn/ui components
- **Validation**: Zod schema validation

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **VS Code**: Latest version (recommended)

### Check your Node.js version:
```bash
node --version
npm --version
```

If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/)

## Local Setup Instructions

### 1. Clone or Download the Project

If you have the project files, navigate to the project directory:
```bash
cd split-app
```

### 2. Install Dependencies

Install all required packages:
```bash
npm install
```

This will install both frontend and backend dependencies including:
- React and related packages
- Express server
- TypeScript
- Tailwind CSS
- UI components and utilities

### 3. Project Structure

```
split-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and API functions
│   │   └── hooks/          # Custom React hooks
│   └── index.html
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # File-based storage implementation
│   └── vite.ts            # Vite integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Zod schemas and TypeScript types
├── data/                  # Local storage (created automatically)
│   ├── expenses.json      # Expenses data
│   ├── people.json        # People data
│   └── settlements.json   # Settlement history
└── package.json
```

### 4. Run the Application

Start the development server:
```bash
npm run dev
```

This command will:
- Start the Express backend server on port 5000
- Start the Vite frontend development server
- Automatically open your browser to the application
- Enable hot reloading for both frontend and backend

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

The application will be running with both frontend and backend on the same port.

## VS Code Setup

### Recommended Extensions

Install these VS Code extensions for the best development experience:

1. **TypeScript and JavaScript Language Features** (built-in)
2. **Tailwind CSS IntelliSense** - For CSS class autocomplete
3. **ES7+ React/Redux/React-Native snippets** - React code snippets
4. **Prettier - Code formatter** - Code formatting
5. **ESLint** - Code linting
6. **Auto Rename Tag** - HTML/JSX tag renaming
7. **Bracket Pair Colorizer** - Better bracket visualization

### VS Code Settings

Create a `.vscode/settings.json` file in your project root:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Debugging Configuration

Create a `.vscode/launch.json` file for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      },
      "runtimeArgs": ["-r", "tsx/cjs"]
    }
  ]
}
```

## Usage Guide

### Adding Your First Expense

1. Click "Add New Expense" on the dashboard
2. Fill in the expense details:
   - **Description**: e.g., "Dinner at restaurant"
   - **Amount**: e.g., 600
   - **Paid By**: e.g., "Shantanu"
   - **Split Type**: Choose "Equal Split" for now
3. Click "Add Expense"

The person will be automatically created and added to the system.

### Viewing Settlements

1. Add several expenses with different people
2. Navigate to the "Settlements" page
3. View the optimized settlement summary showing who owes whom

### Example Test Data

Try adding these expenses to test the application:

1. **Dinner** - ₹600 paid by Shantanu
2. **Groceries** - ₹450 paid by Sanket  
3. **Petrol** - ₹300 paid by Om
4. **Movie Tickets** - ₹500 paid by Shantanu

After adding these, check the settlements page to see the calculated payments.

## API Endpoints

The backend provides these REST API endpoints:

### Expenses
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### People & Balances
- `GET /api/people` - List all people
- `GET /api/balances` - Get current balances for each person

### Settlements
- `GET /api/settlements` - Get settlement summary
- `GET /api/settlements/history` - Get settlement history

## Data Storage

The application uses local JSON files for data storage:

- **expenses.json**: Stores all expense records
- **people.json**: Stores person information
- **settlements.json**: Stores settlement history

These files are created automatically in the `data/` directory when you first run the application.

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   Error: listen EADDRINUSE: address already in use :::5000
   ```
   Solution: Kill the process using port 5000 or change the port in `server/index.ts`

2. **Node modules not found**:
   ```bash
   npm install
   ```

3. **TypeScript errors**:
   Ensure you're using Node.js 18+ and run:
   ```bash
   npm run build
   ```

4. **Permission denied on data files**:
   Ensure the `data/` directory has write permissions

### Clearing Data

To reset all data, simply delete the `data/` directory:
```bash
rm -rf data/
```

The application will recreate the files on next startup.

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
