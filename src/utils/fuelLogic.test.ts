import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isBorOrOutskirts,
  isNagornayaWhitelist,
  isLeninskyDistrict,
  check95Fuel,
  formatQueueTrafficLight,
  parseLimit,
  parsePrice,
  getBrandInfo,
  getFreshnessText
} from './fuelLogic.ts';

test('isBorOrOutskirts detects stop words and outskirt coordinates', () => {
  assert.equal(isBorOrOutskirts({ addr: 'г. Бор, ул. Ленина' }), true);
  assert.equal(isBorOrOutskirts({ addr: 'пос. Неклюдово, Шоссейная' }), true);
  assert.equal(isBorOrOutskirts({ addr: 'Нижний Новгород, ул. Родионова 163', lat: 56.31, lon: 44.02 }), false);
  assert.equal(isBorOrOutskirts({ addr: 'Лесной массив', lat: 56.36, lon: 44.05 }), true);
});

test('isNagornayaWhitelist matches exactly the 17 allowed stations', () => {
  // Lukoil / Teboil addresses
  assert.equal(isNagornayaWhitelist({ brand: 'Лукойл', addr: 'Слобода Печёры, 10' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Лукойл', addr: 'ул. Родионова, 163' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Teboil', addr: 'Казанское шоссе, 6' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Лукойл', addr: 'Казанское шоссе, 16' }), false); // excluded
  assert.equal(isNagornayaWhitelist({ brand: 'Лукойл', addr: 'ул. Надежды Сусловой, 21' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Лукойл', addr: 'ул. Ванеева, 110' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Лукойл', addr: 'ул. Ванеева, 247' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Лукойл', addr: 'пр. Гагарина, 23в' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Лукойл', addr: 'пр. Гагарина, 31а' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Лукойл', addr: 'ул. Магистральная, 6' }), true);

  // Gazpromneft addresses
  assert.equal(isNagornayaWhitelist({ brand: 'Газпромнефть', addr: 'ул. Тимирязева, 11' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Газпромнефть', addr: 'пл. Юбилейная, 3' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Газпромнефть', addr: 'пр. Академика Сахарова, 8' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Газпромнефть', addr: 'ул. Магистральная, 10' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Газпромнефть', addr: 'ул. Школьная, 70а' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Газпромнефть', addr: 'ул. Школьная, 70б' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Газпромнефть', addr: 'ул. Ларина, 32' }), true);
  assert.equal(isNagornayaWhitelist({ brand: 'Газпромнефть', addr: 'ул. Ларина, 2' }), true);

  // Non-matching
  assert.equal(isNagornayaWhitelist({ brand: 'Газпромнефть', addr: 'ул. Бекетова, 5' }), false);
  assert.equal(isNagornayaWhitelist({ brand: 'Нефтегаз', addr: 'ул. Родионова, 163' }), false);
});

test('isLeninskyDistrict matches correct streets and target brands', () => {
  assert.equal(isLeninskyDistrict({ brand: 'Газпромнефть', addr: 'пр. Ленина, 88' }), true);
  assert.equal(isLeninskyDistrict({ brand: 'Лукойл', addr: 'Комсомольское шоссе, 1б' }), true);
  assert.equal(isLeninskyDistrict({ brand: 'Лукойл', addr: 'ул. Новикова-Прибоя, 22' }), true);
  assert.equal(isLeninskyDistrict({ brand: 'Газпромнефть', addr: 'ул. Героя Попова, 35' }), true);
  assert.equal(isLeninskyDistrict({ brand: 'Teboil', addr: 'ул. Баумана, 48' }), true);
  assert.equal(isLeninskyDistrict({ brand: 'Татнефть', addr: 'пр. Ленина, 88' }), false); // Not target brand
});

test('check95Fuel correctly determines fuel availability and queue', () => {
  assert.deepEqual(check95Fuel({ status: 'no' }), { state: 'none', has95: false, has95Plus: false });
  assert.deepEqual(check95Fuel({ fuels_now: '92, ДТ' }), { state: 'none', has95: false, has95Plus: false });
  
  // 95 available
  const res1 = check95Fuel({ fuels_now: '92, 95, 100', status: 'available' });
  assert.equal(res1.state, 'available');
  assert.equal(res1.has95, true);

  // 95 with queue
  const res2 = check95Fuel({ fuels_now: '95', status: 'queue', detail: 'Очередь: 15-30 мин' });
  assert.equal(res2.state, 'queue');
  assert.equal(res2.has95, true);

  // 95+ / Экто / G-Drive in detail with queue mentioned
  const res3 = check95Fuel({ detail: 'АИ-95 Экто в наличии. Очередь до 15 мин' });
  assert.equal(res3.has95Plus, true);
  assert.equal(res3.state, 'queue');

  // 95+ available without queue
  const res4 = check95Fuel({ detail: 'АИ-95 Экто в наличии. Свободно' });
  assert.equal(res4.has95Plus, true);
  assert.equal(res4.state, 'available');

  // svc: only (automated payment terminal ping without driver confirmation)
  const res5 = check95Fuel({ status: 'yes', svc: 'only', confidence_base: 0.35 });
  assert.equal(res5.state, 'none');
});

test('formatQueueTrafficLight returns green, yellow or red indicator', () => {
  const q1 = formatQueueTrafficLight('Очередь: до 15 мин');
  assert.equal(q1?.level, 'green');

  const q2 = formatQueueTrafficLight('Очередь: 15-30 мин');
  assert.equal(q2?.level, 'yellow');

  const q3 = formatQueueTrafficLight('Очередь: 1–2 часа');
  assert.equal(q3?.level, 'red');

  const q4 = formatQueueTrafficLight('Очередь: больше 2 часов');
  assert.equal(q4?.level, 'red');
});

test('parseLimit and parsePrice extract data accurately', () => {
  assert.equal(parseLimit('Лимит: 30 л в бак · Очередь до 15 мин'), '30 л в бак');
  assert.equal(parsePrice(undefined, 'Цена 59,20 ₽ за литр'), '59.20');
  assert.equal(parsePrice(61.5), '61.5');
});

test('getBrandInfo classifies known brands', () => {
  assert.equal(getBrandInfo('Лукойл').displayName, 'Лукойл');
  assert.equal(getBrandInfo('Лукойл').premiumFuelName, '95 Экто');
  assert.equal(getBrandInfo('Газпромнефть').displayName, 'Газпромнефть');
  assert.equal(getBrandInfo('Газпромнефть').premiumFuelName, '95 G-Drive');
  assert.equal(getBrandInfo('Teboil').displayName, 'Teboil');
});

test('FALLBACK_STATIONS contains 17 Nagornaya and 11 Leninsky stations', async () => {
  const { FALLBACK_STATIONS } = await import('../data/mockStations.ts');
  const nagornaya = FALLBACK_STATIONS.filter(isNagornayaWhitelist);
  const leninsky = FALLBACK_STATIONS.filter(isLeninskyDistrict);
  assert.equal(nagornaya.length, 17, 'Nagornaya part should have exactly 17 stations');
  assert.equal(leninsky.length, 11, 'Leninsky district should have exactly 11 stations');
});

test('calculateWhereBenzConfidence matches WhereBenz decaying formula exactly', async () => {
  const { calculateWhereBenzConfidence } = await import('./fuelLogic.ts');
  // At 1 hour ago with base 0.8795, decay drops it to 85% with 5% rounding (exactly matching WhereBenz)
  const d = new Date(Date.now() - 1 * 3600 * 1000).toISOString();
  const res = calculateWhereBenzConfidence(0.8795, d);
  assert.equal(res, 85);
});
