import request from 'supertest';
import app from '../app';
import { Category } from './model';

describe('GET /categories', () => {
  it('Have to send status 200 and return empty array if db is empty', async () => {
    const res = await request(app).get('/categories');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('Have to return array of categories, only if they are into DB', async () => {
    await Category.create({ name: 'Laptops' });
    await Category.create({ name: 'Phones' });

    const res = await request(app).get('/categories');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);

    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Laptops' }),
        expect.objectContaining({ name: 'Phones' }),
      ])
    );
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

    const category_id = (await request(app).get('/categories')).body[0]._id;
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

    const category_id = (await request(app).get('/categories')).body[0]._id;
    console.log(category_id);
    const updateCategoryDto = {
      _id: category_id,
      newName: 'Phones',
    };

    const res = await request(app).delete(`/categories/${category_id}`);
    expect(res.status).toBe(204);

    const allCategories = await request(app).get('/categories');

    expect(allCategories.status).toBe(200);
    expect(allCategories.body).toEqual([]);
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
