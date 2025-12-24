const { collections, workspaces, specs } = require('@bidnessforb/postman-sdk');

// Set your API key
//process.env.POSTMAN_API_KEY = 'your_actual_api_key';

async function test() {
  console.log('Testing Postman SDK - Create Workspace, Collection, and Spec...\n');
  
  try {
    // 1. Create a workspace
    console.log('1. Creating workspace...');
    
    const workspaceResponse = await workspaces.createWorkspace('SDK Client Test Workspace', 'team', 'Test workspace created via SDK');
    const workspaceId = workspaceResponse.data.workspace.id;
    console.log(`✓ Workspace created with ID: ${workspaceId}`);
    
    // 2. Create a collection in the workspace
    console.log('\n2. Creating collection in workspace...');
    

    const collection = {
      
        info: {
          name: `Test Collection ${Date.now()}`,
          description: 'Test collection created via SDK',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        },
        item: [
          {
            name: 'Sample Request',
            request: {
              method: 'GET',
              url: 'https://postman-echo.com/get'
            }
          }
        ]
      
        };
    const collectionResponse = await collections.createCollection(collection, workspaceId);
    const collectionId = collectionResponse.data.collection.id;
    console.log(`✓ Collection created with ID: ${collectionId}`);
    
    // 3. Create a spec in the workspace
    console.log('\n3. Creating spec in workspace...');
    
      const specName =  `Test Spec ${Date.now()}`
      const type = 'OPENAPI:3.0'
      const files = [
        {
          path: 'index.yaml',
          content: `openapi: 3.0.0
  info:
    title: Functional Test API
    version: 1.0.0
  paths:
    /test:
      get:
        summary: Test endpoint
        responses:
          '200':
            description: Success
            content:
              application/json:
                schema:
                  $ref: './components/schemas.json#/TestSchema'`
        }
      ];
  
    const specResponse = await specs.createSpec(workspaceId, specName, type, files)
    const specId = specResponse.data.id;
    console.log(`✓ Spec created with ID: ${specId}`);
    
    console.log('\n✅ All resources created successfully!');
    console.log(`\nWorkspace ID: ${workspaceId}`);
    console.log(`Collection ID: ${collectionId}`);
    console.log(`Spec ID: ${specId}`);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

test();
