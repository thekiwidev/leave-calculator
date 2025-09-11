# Advanced Leave Calculator

A modern, responsive web application for calculating employee leave with accurate working day calculations, public holiday exclusions, and local data persistence. Built as a Progressive Web Application (PWA) with offline capabilities.

## Features

### ✨ Core Functionality

- **Accurate Leave Calculation**: Calculates working days only, excluding weekends and public holidays
- **Multiple Leave Types**: Supports Vacation/Annual, Maternity, Casual, Study, Sick, and Sabbatical leave
- **Grade Level Support**: Automatic entitlement calculation for Vacation leave based on Grade Level (GL 0-06: 21 days, GL 07+: 30 days)
- **Public Holiday Management**: Add, remove, and manage public holidays used in calculations
- **Real-time Results**: Displays leave expiration date, resumption date, and skipped holidays

### 🛠 Technical Features

- **Progressive Web App (PWA)**: Installable and works offline
- **Local Storage**: Persistent data storage for holidays and user preferences
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **API Integration**: Fetches Nigerian public holidays from external API
- **Type Safety**: Built with TypeScript for robust development

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7 with PWA plugin
- **Styling**: Tailwind CSS 4 with utility-first approach
- **State Management**: Zustand for lightweight, scalable state management
- **Date Management**: date-fns for reliable date operations
- **Icons**: Lucide React for beautiful, consistent icons
- **PWA**: Service worker and manifest for offline capabilities

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd advanced-leave-calculator
   ```

2. **Install dependencies**

   ```bash
   # Using npm
   npm install

   # Using bun (recommended)
   bun install
   ```

3. **Environment Setup (Optional)**

   ```bash
   cp .env.example .env
   ```

   Configure your environment variables in `.env`:

   ```env
   # API Ninjas key for fetching public holidays
   VITE_API_NINJAS_KEY=your_api_key_here

   # Supabase configuration
   VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   VITE_SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

   # Admin access
   VITE_ADMIN_SECRET_KEY="your-super-secret-password"
   ```

   **Important**:

   - For production deployment, implement server-side API key handling for security
   - The `VITE_SUPABASE_SERVICE_ROLE_KEY` is used for keep-alive functionality to prevent database auto-pause

4. **Start Development Server**

   ```bash
   # Using npm
   npm run dev

   # Using bun
   bun dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
# Using npm
npm run build

# Using bun
bun run build
```

The built files will be in the `dist` directory, ready for deployment.

## Usage Guide

### Calculating Leave

1. **Select Leave Type**: Choose from available leave types
2. **Enter Details**:
   - **Vacation Leave**: Select your Grade Level (GL)
   - **Maternity Leave**: Uses fixed 112 working days
   - **Other Leaves**: Enter desired number of days
3. **Choose Start Date**: Select when your leave begins
4. **Calculate**: Click "Calculate Leave" to get results

### Managing Public Holidays

1. **View Current Holidays**: See all recognized public holidays
2. **Add Holiday**: Use the "Add Holiday" button to add custom holidays
3. **Remove Holiday**: Click the delete icon and confirm removal
4. **Refresh from API**: Use "Refresh" to fetch latest holidays from API

### Results Interpretation

- **Leave Expiration Date**: Last day of your leave
- **Resumption Date**: First working day after leave ends
- **Skipped Holidays**: Public holidays that occurred during your leave
- **Total Working Days**: Actual working days calculated

## Core Calculation Logic

The application follows this logic for leave calculation:

1. Start from the selected start date
2. Count only working days (Monday-Friday, excluding public holidays)
3. Skip weekends and public holidays without counting them
4. Continue until the required number of working days is reached
5. Calculate resumption as the next working day after leave expiration

## Project Structure

```file
src/
├── components/          # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LeaveCalculatorForm.tsx
│   ├── LeaveResults.tsx
│   └── PublicHolidayManager.tsx
├── lib/                 # Core business logic
│   └── leaveCalculator.ts
├── store/               # Zustand state management
│   └── useLeaveCalculatorStore.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── dateUtils.ts
│   └── storage.ts
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles (Tailwind CSS)
```

## API Integration

### Public Holidays API

The application integrates with [API Ninjas Public Holidays API](https://api.api-ninjas.com/) to fetch Nigerian public holidays. The integration includes:

- Automatic retry on failure
- Fallback to local storage data
- Graceful error handling
- Secure API key management (environment variables)

### Supabase Database & Keep-Alive

The application uses Supabase for persistent data storage and includes an automated keep-alive system to prevent free-tier database auto-pause:

#### Keep-Alive Features

- **Automatic Scheduling**: Pings database every 6 days to prevent 7-day timeout
- **GitHub Actions**: Daily automated pings via CI/CD workflow
- **Manual Testing**: Admin interface for testing keep-alive functionality
- **Error Handling**: Comprehensive logging and error reporting

#### Setup Keep-Alive

1. **Environment Variables**: Add your Supabase service role key to `.env`
2. **GitHub Secrets**: Configure repository secrets for automated pings:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_SERVICE_ROLE_KEY`: Service role key from Supabase settings
3. **Manual Testing**: Run `bun run keep-alive` to test the functionality

#### Keep-Alive Commands

```bash
# Test keep-alive functionality
bun run keep-alive

# Check keep-alive status (in development)
# The app automatically starts keep-alive scheduler when running
```

## Browser Support

- Chrome 88+
- Firefox 84+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built according to Product Requirements Document v1.0
- Nigerian public holidays sourced from API Ninjas
- Icons provided by Lucide React
- Styling powered by Tailwind CSS

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Advanced Leave Calculator v1.0** - Accurate, reliable, and user-friendly leave calculation for Nigerian organizations.
