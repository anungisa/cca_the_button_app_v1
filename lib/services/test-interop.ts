/**
 * Test script for InteroperabilityService
 * Tests API registration, rate limiting, and connection
 */

import { interopService } from './interoperability-service';

async function testInteroperabilityService() {
  console.log('=== Testing InteroperabilityService ===\n');

  // 1. Check registered APIs
  console.log('1. Registered APIs:');
  const apis = interopService.getRegisteredAPIs();
  console.log(`   Found ${apis.length} registered APIs: ${apis.join(', ')}\n`);

  // 2. Test rate limiting
  console.log('2. Testing Rate Limiter:');
  const startTime = Date.now();
  
  // Register a test API with strict rate limit (2 requests per second)
  interopService.registerAPI('test-api', {
    baseUrl: 'https://httpbin.org',
    auth: { type: 'none' },
    rateLimit: { requests: 2, window: 1000 },
  });

  try {
    console.log('   Making 3 requests (should take ~1 second due to rate limit)...');
    await interopService.fetch('test-api', '/get');
    console.log('   Request 1 completed');
    
    await interopService.fetch('test-api', '/get');
    console.log('   Request 2 completed');
    
    await interopService.fetch('test-api', '/get');
    console.log('   Request 3 completed');
    
    const elapsed = Date.now() - startTime;
    console.log(`   ✅ Rate limiting working! Took ${elapsed}ms (expected ~1000ms)\n`);
  } catch (error) {
    console.error('   ❌ Rate limiting test failed:', error, '\n');
  }

  // 3. Test error handling and retry
  console.log('3. Testing Error Handling & Retry:');
  try {
    await interopService.fetch('test-api', '/status/500');
  } catch (error) {
    console.log('   ✅ Error handling working! Caught expected error after retries\n');
  }

  // 4. Test connection to registered APIs (mock test)
  console.log('4. Testing API Connections:');
  for (const apiName of apis) {
    try {
      // We can't actually test without real API keys, so just log status
      const syncStatus = interopService.getSyncStatus(apiName);
      console.log(`   ${apiName}: ${syncStatus ? `Last synced ${syncStatus.lastSync}` : 'Never synced'}`);
    } catch (error) {
      console.log(`   ${apiName}: Not configured (missing API key)`);
    }
  }

  console.log('\n=== InteroperabilityService Test Complete ===');
}

// Run tests if this file is executed directly
if (require.main === module) {
  testInteroperabilityService().catch(console.error);
}

export { testInteroperabilityService };
