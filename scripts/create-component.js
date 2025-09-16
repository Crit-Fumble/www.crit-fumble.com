#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createComponent(packageName, componentType, componentName) {
  if (!packageName || !componentType || !componentName) {
    console.error('Please provide: package name, component type (client/server/model), and component name');
    process.exit(1);
  }

  const packagePath = path.join(__dirname, '..', 'packages', packageName);
  
  if (!fs.existsSync(packagePath)) {
    console.error(`Package @crit-fumble/${packageName} does not exist`);
    process.exit(1);
  }

  let targetDir;
  let template;

  switch (componentType) {
    case 'client':
      targetDir = path.join(packagePath, 'client');
      template = `export class ${componentName}Client {
  constructor(config) {
    // Initialize client with configuration
  }

  // Add client methods here
}
`;
      break;

    case 'server':
      targetDir = path.join(packagePath, 'server');
      template = `export class ${componentName}Service {
  constructor(client) {
    // Initialize service with client dependency
  }

  // Add service methods here
}

export class ${componentName}Controller {
  constructor(service) {
    // Initialize controller with service dependency
  }

  // Add controller methods here
}
`;
      break;

    case 'model':
      targetDir = path.join(packagePath, 'models');
      template = `export interface ${componentName} {
  // Define interface properties here
}

export class ${componentName}Config {
  // Define configuration properties here
}
`;
      break;

    default:
      console.error('Invalid component type. Use: client, server, or model');
      process.exit(1);
  }

  // Create test file
  const testTemplate = `import { ${componentName}${componentType === 'client' ? 'Client' : 
    componentType === 'server' ? 'Service' : ''} } from '../${componentType}/${componentName}';

describe('${componentName}', () => {
  it('should be properly initialized', () => {
    // Add test implementation
  });
});
`;

  // Ensure directories exist
  fs.mkdirSync(targetDir, { recursive: true });
  fs.mkdirSync(path.join(packagePath, '__tests__'), { recursive: true });

  // Write component file
  const componentFile = path.join(targetDir, `${componentName}.ts`);
  fs.writeFileSync(componentFile, template);

  // Write test file
  const testFile = path.join(packagePath, '__tests__', `${componentName}.test.ts`);
  fs.writeFileSync(testFile, testTemplate);

  console.log(`Component ${componentName} created in @crit-fumble/${packageName}/${componentType}`);
}

// Execute if run directly
const [packageName, componentType, componentName] = process.argv.slice(2);
createComponent(packageName, componentType, componentName);