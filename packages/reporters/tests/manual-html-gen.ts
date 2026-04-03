import fs from 'node:fs';
import path from 'node:path';
import { HtmlWriter } from '../src/html/HtmlWriter.js';

async function test() {
  // Use absolute path or relative to workspace root
  const workspaceRoot = path.resolve(process.cwd(), '../../');
  const reportPath = path.join(workspaceRoot, 'e2e-tests/report/report-x1pi7a.json');
  
  if (!fs.existsSync(reportPath)) {
    console.error(`Report file not found at: ${reportPath}`);
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  
  const outputDir = path.join(workspaceRoot, 'e2e-tests/report');
  const outputPath = HtmlWriter.write(report, outputDir);
  
  console.log(`HTML report generated at: ${outputPath}`);
}

test().catch(console.error);
