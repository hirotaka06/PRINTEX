import fs from 'node:fs';
import openapiTS, { astToString } from 'openapi-typescript';
import path from 'path';
import { factory } from 'typescript';

const BLOB = factory.createTypeReferenceNode(factory.createIdentifier('Blob'));

async function generateTypes() {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  const SCHEMA_URL = `${API_BASE_URL}/api/schema/`;

  const ast = await openapiTS(SCHEMA_URL, {
      transform(schemaObject) {
        if (schemaObject.format === 'binary') {
          return BLOB;
        }
      },
    });

    const contents = astToString(ast);
    const outputDir = path.resolve(process.cwd(), './src/generated/api');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.resolve(outputDir, 'index.ts');
    fs.writeFileSync(outputPath, contents);
}

generateTypes();
