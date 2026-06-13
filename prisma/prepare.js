const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'schema.prisma');
const dbUrl = process.env.DATABASE_URL || '';

let provider = 'sqlite';
if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
  provider = 'postgresql';
}

console.log(`[Prisma Prepare] Database URL detected. Configuring schema provider to: "${provider}"`);

try {
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Replace the provider in the datasource db block
  const updatedSchemaContent = schemaContent.replace(
    /(datasource db\s*\{[^}]*provider\s*=\s*")[^"]*(")/,
    `$1${provider}$2`
  );
  
  if (schemaContent !== updatedSchemaContent) {
    fs.writeFileSync(schemaPath, updatedSchemaContent, 'utf8');
    console.log(`[Prisma Prepare] Successfully updated schema.prisma provider to "${provider}".`);
  } else {
    console.log(`[Prisma Prepare] schema.prisma is already configured for "${provider}".`);
  }
} catch (error) {
  console.error('[Prisma Prepare] Failed to update schema.prisma:', error);
  process.exit(1);
}
