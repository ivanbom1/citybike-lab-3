const { test, expect } = require('@playwright/test');

// MISSION 3 — Add two realistic tests:
// (a) invalid email gives visible error without a POST to /api/reservations
// (b) a successful reservation; intercept/mock POST /api/reservations and assert
//     the JSON request payload and success message.
test('invalid email blocks reservation', async ({ page }) => {
  let posted = false;
  await page.route('**/api/reservations', route => {
    posted = true;
    return route.abort();
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Reserve at Central Square' }).click();
  await page.getByLabel('Email').fill('not-an-email');                      
  await page.getByRole('button', { name: 'Confirm reservation' }).click();

  await expect(page.getByText('Enter a valid email')).toBeVisible();
  expect(posted).toBe(false);
});

test('reservation sends correct payload and confirms booking', async ({ page }) => {
  let payload;
  await page.route('**/api/reservations', async route => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: { reservationId: 'CB-DEMO-777' } });
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Reserve at Central Square' }).click();
  await page.getByLabel('Email').fill('student@example.com');               // CHECK
  await page.getByRole('button', { name: 'Confirm reservation' }).click();  // CHECK

  await expect(page.getByText('Reservation confirmed: CB-DEMO-777')).toBeVisible();
  expect(payload).toMatchObject({ stationId: 'central', email: 'student@example.com' });
});
