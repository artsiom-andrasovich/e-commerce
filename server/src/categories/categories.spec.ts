import request from 'supertest';
import app from '../app';
import { Category } from './model';

describe('GET /categories', () => {
  it('Have to send status 200 and return empty array if db is empty', async () => {
    const res = await request(app).get('/categories');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: [],
        nextCursor: null,
      })
    );
  });

  it('Have to return array of categories, only if they are into DB', async () => {
    await Category.create({ name: 'Laptops' });
    await Category.create({ name: 'Phones' });

    const res = await request(app).get('/categories');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('Have to return correct pages with cursor (limit = 2, total = 3)', async () => {
    await Category.create({ name: 'Laptops' });
    await Category.create({ name: 'Smartphones' });
    await Category.create({ name: 'Tablets' });

    const resPage1 = await request(app).get('/categories?limit=2');

    expect(resPage1.status).toBe(200);
    expect(resPage1.body.data).toHaveLength(2);

    expect(resPage1.body.data[0].name).toBe('Laptops');
    expect(resPage1.body.data[1].name).toBe('Smartphones');

    expect(resPage1.body.nextCursor).toBeDefined();
    expect(resPage1.body.nextCursor).not.toBeNull();

    const cursor = resPage1.body.nextCursor;

    const resPage2 = await request(app).get(
      `/categories?limit=2&cursor=${cursor}`
    );

    expect(resPage2.status).toBe(200);

    expect(resPage2.body.data).toHaveLength(1);
    expect(resPage2.body.data[0].name).toBe('Tablets');

    expect(resPage2.body.nextCursor).toBeNull();
  });
});

describe('POST /categories', () => {
  it('Have to create a new category if category with this name does not exits', async () => {
    const newCategory = { name: 'Laptops' };

    const res = await request(app).post('/categories').send(newCategory);
    expect(res.status).toBe(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        name: 'Laptops',
      })
    );
  });

  it('Have to throw an error after try of creating category with the conflict name', async () => {
    await Category.create({ name: 'Laptops' });

    const newCategory = { name: 'Laptops' };

    const res = await request(app).post('/categories').send(newCategory);

    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Category with this name already exists',
      })
    );
  });
});

describe('PUT /categories', () => {
  it('Have to change name in the best scenario without conflicts', async () => {
    await Category.create({ name: 'Laptops' });

    const category_id = (await request(app).get('/categories')).body.data[0]
      ._id;
    console.log(category_id);
    const updateCategoryDto = {
      _id: category_id,
      newName: 'Phones',
    };

    const res = await request(app).put(`/categories`).send(updateCategoryDto);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        _id: updateCategoryDto._id,
        name: updateCategoryDto.newName,
      })
    );
  });

  it('Have to throw Not Found if no category with this _id', async () => {
    const updateCategoryDto = {
      _id: '6a1086bc3fbf67a9fb630fb4',
      newName: 'Phones',
    };
    const res = await request(app).put(`/categories`).send(updateCategoryDto);

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message:
          'Category with this _id 6a1086bc3fbf67a9fb630fb4 does not exists',
      })
    );
  });
});

describe('DELETE /categories', () => {
  it('Have to delete via id in the best scenario', async () => {
    await Category.create({ name: 'Laptops' });

    const category_id = (await request(app).get('/categories')).body.data[0]
      ._id;
    const updateCategoryDto = {
      _id: category_id,
      newName: 'Phones',
    };

    const res = await request(app).delete(`/categories/${category_id}`);
    expect(res.status).toBe(204);

    const allCategories = await request(app).get('/categories');

    expect(allCategories.status).toBe(200);
    expect(allCategories.body).toEqual(
      expect.objectContaining({
        data: [],
        nextCursor: null,
      })
    );
  });

  it('Have to throw Not Found if no category with this _id', async () => {
    const res = await request(app).delete(
      `/categories/6a1086bc3fbf67a9fb630fb4`
    );

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message:
          'Category with this _id 6a1086bc3fbf67a9fb630fb4 does not exists',
      })
    );
  });
});
