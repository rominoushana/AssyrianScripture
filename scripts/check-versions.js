const fs = require('fs');
const path = require('path');

// #region agent log
fetch('http://127.0.0.1:7242/ingest/33ef14fa-ee49-4820-ae4a-c7ce7f070234',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scripts/check-versions.js:8',message:'Version check script started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
// #endregion

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const versions = {
  'react-native': packageJson.dependencies['react-native'],
  'react-native-svg': packageJson.dependencies['react-native-svg'],
  'expo': packageJson.dependencies['expo'],
  'react': packageJson.dependencies['react'],
  'react-native-reanimated': packageJson.dependencies['react-native-reanimated'],
  'react-native-gesture-handler': packageJson.dependencies['react-native-gesture-handler'],
  'react-native-worklets': packageJson.dependencies['react-native-worklets'] || 'not installed',
};

// #region agent log
fetch('http://127.0.0.1:7242/ingest/33ef14fa-ee49-4820-ae4a-c7ce7f070234',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scripts/check-versions.js:20',message:'Package versions captured',data:versions,timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
// #endregion

console.log('Current versions:');
console.log(JSON.stringify(versions, null, 2));

// #region agent log
fetch('http://127.0.0.1:7242/ingest/33ef14fa-ee49-4820-ae4a-c7ce7f070234',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'scripts/check-versions.js:28',message:'Version check script completed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
// #endregion

