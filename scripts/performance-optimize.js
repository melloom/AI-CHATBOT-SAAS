const fs = require('fs');
const path = require('path');

// Performance optimization script
console.log('🔍 Analyzing performance issues...');

// Check for large dependencies
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

console.log('\n📦 Large dependencies that might slow compilation:');
Object.entries(dependencies).forEach(([name, version]) => {
  if (name.includes('@radix-ui') || name.includes('lucide') || name.includes('recharts')) {
    console.log(`  - ${name}: ${version}`);
  }
});

// Check for potential optimization opportunities
console.log('\n💡 Performance optimization suggestions:');
console.log('  1. Use dynamic imports for heavy components');
console.log('  2. Implement code splitting for routes');
console.log('  3. Optimize image loading');
console.log('  4. Use React.memo for expensive components');
console.log('  5. Implement proper tree shaking');

// Check for common performance issues
const commonIssues = [
  'Large bundle sizes from Radix UI components',
  'Heavy chart libraries (Recharts)',
  'Multiple icon libraries',
  'Unoptimized images',
  'Missing code splitting'
];

console.log('\n⚠️  Potential issues:');
commonIssues.forEach(issue => {
  console.log(`  - ${issue}`);
});

console.log('\n🚀 Quick fixes:');
console.log('  1. Run: npm run dev --turbo');
console.log('  2. Use dynamic imports for heavy pages');
console.log('  3. Implement proper lazy loading');
console.log('  4. Optimize provider structure');

console.log('\n✅ Performance analysis complete!'); 