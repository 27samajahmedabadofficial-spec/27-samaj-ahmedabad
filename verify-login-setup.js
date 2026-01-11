#!/usr/bin/env node

/**
 * LOGIN IMPLEMENTATION VERIFICATION SCRIPT
 * 
 * Run this script to verify that all components of the login system are properly installed.
 * Usage: node verify-login-setup.ts (or similar)
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}\n`),
};

const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

const fileContains = (filePath, substring) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes(substring);
  } catch {
    return false;
  }
};

// Verification checks
let passCount = 0;
let failCount = 0;
let warningCount = 0;

function checkFile(filePath, description) {
  if (fileExists(filePath)) {
    log.success(`${description}: ${filePath}`);
    passCount++;
    return true;
  } else {
    log.error(`${description}: ${filePath}`);
    failCount++;
    return false;
  }
}

function checkFileContent(filePath, searchString, description) {
  if (fileExists(filePath)) {
    if (fileContains(filePath, searchString)) {
      log.success(`${description}`);
      passCount++;
      return true;
    } else {
      log.error(`${description}`);
      failCount++;
      return false;
    }
  } else {
    log.error(`File not found: ${filePath}`);
    failCount++;
    return false;
  }
}

// Start verification
console.clear();
log.header('🔐 LOGIN IMPLEMENTATION VERIFICATION');

// Check environment
log.header('1. Environment Configuration');
checkFile('.env', 'Environment file exists');
if (fileExists('.env')) {
  checkFileContent('.env', 'VITE_API_URL', 'Backend API URL configured');
}

// Check core files
log.header('2. Core Authentication Files');
checkFile('src/contexts/AuthContext.tsx', 'AuthContext created');
if (fileExists('src/contexts/AuthContext.tsx')) {
  checkFileContent('src/contexts/AuthContext.tsx', 'export const useAuth', 'useAuth hook exported');
  checkFileContent('src/contexts/AuthContext.tsx', 'UserProfile', 'UserProfile interface defined');
  checkFileContent('src/contexts/AuthContext.tsx', 'fetchUserProfile', 'Profile fetching implemented');
  checkFileContent('src/contexts/AuthContext.tsx', 'signIn', 'signIn method implemented');
  checkFileContent('src/contexts/AuthContext.tsx', 'signUp', 'signUp method implemented');
  checkFileContent('src/contexts/AuthContext.tsx', 'signOut', 'signOut method implemented');
}

// Check services
log.header('3. Service Layer');
checkFile('src/services/profileService.ts', 'Profile service created');
if (fileExists('src/services/profileService.ts')) {
  checkFileContent('src/services/profileService.ts', 'getProfile', 'getProfile service method');
  checkFileContent('src/services/profileService.ts', 'updateProfile', 'updateProfile service method');
  checkFileContent('src/services/profileService.ts', 'createProfile', 'createProfile service method');
  checkFileContent('src/services/profileService.ts', 'profileExists', 'profileExists service method');
}

// Check components
log.header('4. React Components');
checkFile('src/pages/Auth.tsx', 'Auth page exists');
checkFile('src/components/auth/ProtectedRoute.tsx', 'ProtectedRoute component exists');
checkFile('src/components/auth-examples.tsx', 'Auth examples created');

// Check App configuration
log.header('5. Application Configuration');
checkFile('src/App.tsx', 'App.tsx exists');
if (fileExists('src/App.tsx')) {
  checkFileContent('src/App.tsx', 'AuthProvider', 'AuthProvider wrapped in App');
  checkFileContent('src/App.tsx', 'ProtectedRoute', 'ProtectedRoute used in App');
  checkFileContent('src/App.tsx', '/auth', 'Auth route configured');
  checkFileContent('src/App.tsx', 'BrowserRouter', 'React Router configured');
}

// Check Supabase integration (REMOVED - Using Backend API instead)
log.header('6. Backend API Integration');
checkFile('backend/src/index.js', 'Backend API server');
checkFile('backend/src/routes/authRoutes.js', 'Auth routes configured');
checkFile('backend/src/controllers/authController.js', 'Auth controller implemented');

// Check documentation
log.header('7. Documentation');
checkFile('LOGIN_SETUP.md', 'Setup guide documentation');
checkFile('IMPLEMENTATION_SUMMARY.md', 'Implementation summary');
checkFile('ARCHITECTURE.md', 'Architecture documentation');
checkFile('LOGIN_CHECKLIST.ts', 'Verification checklist');

// Check package.json
log.header('8. Dependencies');
if (fileExists('package.json')) {
  checkFileContent('package.json', 'axios', 'Axios HTTP client');
  checkFileContent('package.json', 'react-router-dom', 'React Router dependency');
  checkFileContent('package.json', 'zod', 'Zod validation library');
  checkFileContent('package.json', 'lucide-react', 'Lucide icons library');
}

// Summary
log.header('📊 VERIFICATION SUMMARY');
const totalChecks = passCount + failCount + warningCount;
const passPercentage = ((passCount / totalChecks) * 100).toFixed(1);

console.log(`${colors.green}Passed: ${passCount}${colors.reset}`);
if (failCount > 0) console.log(`${colors.red}Failed: ${failCount}${colors.reset}`);
if (warningCount > 0) console.log(`${colors.yellow}Warnings: ${warningCount}${colors.reset}`);
console.log(`Total: ${totalChecks}`);
console.log(`Success Rate: ${passPercentage}%\n`);

if (failCount === 0 && warningCount === 0) {
  log.success('All checks passed! Login system is properly configured.');
  console.log('\n📝 Next steps:');
  console.log('1. Start backend server: cd backend && npm start');
  console.log('2. Start dev server: npm run dev');
  console.log('3. Visit http://localhost:5173/auth');
  console.log('4. Test signup and login');
  console.log('5. Check MySQL database for user creation');
  process.exit(0);
} else if (failCount > 0) {
  log.error('Some checks failed! Please review the errors above.');
  console.log('\n📖 See documentation:');
  console.log('   - LOGIN_SETUP.md for setup instructions');
  console.log('   - IMPLEMENTATION_SUMMARY.md for overview');
  console.log('   - ARCHITECTURE.md for system design');
  process.exit(1);
} else {
  log.warning('Some warnings detected. Review above.');
  process.exit(0);
}
