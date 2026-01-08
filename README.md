# Pathfinder - Applicant Tracking System

A modern Applicant Tracking System (ATS) platform built with React 19, TypeScript, and Material-UI. Designed to streamline recruitment workflows and provide comprehensive candidate management capabilities.

## 🚀 Features

- **Candidate Management**: Track and manage job applicants throughout the hiring process
- **Job Posting Management**: Create and manage job listings with rich content
- **Application Workflow**: Streamlined hiring process with customizable stages
- **User Authentication**: Secure access for HR teams and recruiters
- **Dashboard & Analytics**: Insights into recruitment metrics and performance
- **Responsive Design**: Modern UI built with Material-UI and styled-components

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.x with TypeScript 5.x
- **Build Tool**: Vite 7.x
- **UI Library**: Material-UI 7.x with Styled Components 5.x
- **State Management**: Redux Toolkit 2.x with React Redux 9.x
- **Routing**: React Router DOM 7.x
- **Code Quality**: ESLint + Prettier
- **Package Manager**: Yarn

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- Yarn package manager
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pathfinder-frontend
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Start Development Server

```bash
yarn dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Development

### Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build the application for production
- `yarn lint` - Run ESLint to check code quality
- `yarn preview` - Preview the production build locally

### Project Structure

```
src/
├── api/                   # API service functions and HTTP clients
├── assets/                # Static assets (images, fonts, etc.)
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── pages/                 # Page components (route-level)
├── redux/                 # Redux store and slices
├── theme/                 # Material-UI theme configuration
├── utils/                 # Utility functions and helpers
└── main.tsx              # Application entry point
```

### Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run `yarn lint` to check for code quality issues.

## 🚀 Deployment

### Current Deployment (Home Server)

The application is currently deployed on a home server with Nginx. The deployment process involves:

1. **Build the Application**

   ```bash
    yarn build
   ```

2. **Transfer to Server**

   ```bash
    scp -i ~/.ssh/ant_home_lab -P 8493 -r dist/* antdangnz@ant-home-lab:/home/antdangnz/dist/
   ```

3. **Move the build files to the right directory**

   ```bash
    ssh ant_home_lab

    # On the server:

    # wipe out the old build
    sudo rm -rf /var/www/pathfinder/*

    # move in the new files
    sudo mv ~/dist/* /var/www/pathfinder/

    sudo chown -R www-data:www-data /var/www/pathfinder
   ```

4. **Restart Nginx** (if necessary)
   ```bash
    sudo systemctl restart nginx
   ```

### Future Deployment (AWS)

The platform is planned for migration to AWS. Deployment steps will be updated once the migration is complete.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for local development:

```env
VITE_API_URL=your_api_url_here
VITE_AMPLIFY_CONFIG=your_amplify_config
```

### AWS Amplify Configuration

The project uses AWS Amplify for authentication and backend services. Configuration is handled in `src/config/amplify.ts`.

## SVG Guidelines

When working with SVG icons in this project:

1. **Use CSS-friendly SVGs**
   - All SVGs should use `currentColor` instead of hardcoded colors
   - Replace attributes like `stroke="#666666"` with `stroke="currentColor"`
   - Replace attributes like `fill="#666666"` with `fill="currentColor"`

2. **Processing SVGs**
   - Use the `convert-icons.js` script to automatically convert new SVGs
   - Run with: `node convert-icons.js`

3. **Importing SVGs in components**
   - Use the `?react` suffix for Vite to convert them to React components

4. **Styling SVGs in components**
   - Set the `color` property on the parent element
   - The SVG will inherit the color via `currentColor`
   - Applies to both fill and stroke properties

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions, please contact the development team.

---

**Note**: This is a work-in-progress ATS platform currently in active development. Features and documentation will be updated as the platform evolves.
