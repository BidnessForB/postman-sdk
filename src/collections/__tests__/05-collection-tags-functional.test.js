const { 
  getCollectionTags,
  updateCollectionTags
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds } = require('../../__tests__/test-helpers');

describe('collection tags functional tests', () => {
  let persistedIds = {};
  let testCollectionId;
  let userId;

  beforeAll(async () => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }

    persistedIds = loadTestIds();
    testCollectionId = persistedIds?.collection?.id;
    userId = persistedIds?.userId;

    if (!testCollectionId) {
      throw new Error('Collection ID not found in test-ids.json. Run collection functional tests first.');
    }

    if (!userId) {
      throw new Error('User ID not found in test-ids.json. Run user functional tests first.');
    }

    console.log('Using collection ID:', testCollectionId);
    console.log('Using user ID:', userId);
  });

  test('1. getCollectionTags - should get collection tags (initially empty)', async () => {
    const result = await getCollectionTags(userId, testCollectionId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(Array.isArray(result.data.tags)).toBe(true);
    // Tags may or may not be empty depending on previous test runs
    console.log(`Collection has ${result.data.tags.length} tag(s)`);
  });

  test('2. updateCollectionTags - should add tags to collection', async () => {
    const tags = [
      { slug: 'sdk-test' },
      { slug: 'automated-test' }
    ];

    const result = await updateCollectionTags(userId, testCollectionId, tags);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(result.data.tags).toHaveLength(2);
    expect(result.data.tags[0].slug).toBe('sdk-test');
    expect(result.data.tags[1].slug).toBe('automated-test');
    console.log('Successfully added 2 tags to collection');
  });

  test('3. getCollectionTags - should retrieve the added tags', async () => {
    const result = await getCollectionTags(userId, testCollectionId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(result.data.tags).toHaveLength(2);
    expect(result.data.tags.some(tag => tag.slug === 'sdk-test')).toBe(true);
    expect(result.data.tags.some(tag => tag.slug === 'automated-test')).toBe(true);
    console.log('Successfully verified tags on collection');
  });

  test('4. updateCollectionTags - should replace existing tags', async () => {
    const tags = [
      { slug: 'updated-tag' }
    ];

    const result = await updateCollectionTags(userId, testCollectionId, tags);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(result.data.tags).toHaveLength(1);
    expect(result.data.tags[0].slug).toBe('updated-tag');
    console.log('Successfully replaced tags on collection');
  });

  test('5. updateCollectionTags - should clear all tags', async () => {
    const result = await updateCollectionTags(userId, testCollectionId, []);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(result.data.tags).toHaveLength(0);
    console.log('Successfully cleared all tags from collection');
  });

  test('6. getCollectionTags - should verify tags are cleared', async () => {
    const result = await getCollectionTags(userId, testCollectionId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(result.data.tags).toHaveLength(0);
    console.log('Verified collection has no tags');
  });

  test('7. updateCollectionTags - should handle maximum 5 tags', async () => {
    const tags = [
      { slug: 'tag1' },
      { slug: 'tag2' },
      { slug: 'tag3' },
      { slug: 'tag4' },
      { slug: 'tag5' }
    ];

    const result = await updateCollectionTags(userId, testCollectionId, tags);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(result.data.tags).toHaveLength(5);
    console.log('Successfully added maximum 5 tags to collection');
  });

  test('8. updateCollectionTags - should reject invalid tag slug (too short)', async () => {
    const tags = [
      { slug: 'a' } // Too short (min 2 characters)
    ];

    await expect(
      updateCollectionTags(userId, testCollectionId, tags)
    ).rejects.toThrow();
    console.log('Successfully rejected invalid tag slug (too short)');
  });

  test('9. updateCollectionTags - should reject invalid tag slug (invalid characters)', async () => {
    const tags = [
      { slug: 'Invalid_Tag' } // Underscores not allowed
    ];

    await expect(
      updateCollectionTags(userId, testCollectionId, tags)
    ).rejects.toThrow();
    console.log('Successfully rejected invalid tag slug (invalid characters)');
  });

  test('10. getCollectionTags - should handle non-existent collection', async () => {
    const fakeCollectionId = '00000000-0000-0000-0000-000000000000';

    await expect(
      getCollectionTags(userId, fakeCollectionId)
    ).rejects.toThrow();
    console.log('Successfully handled non-existent collection');
  });

  // Cleanup: clear tags after tests
  afterAll(async () => {
    try {
      await updateCollectionTags(userId, testCollectionId, []);
      console.log('Cleaned up: cleared all tags from collection');
    } catch (error) {
      console.log('Note: Could not clean up tags (collection may have been deleted)');
    }
  });
});

