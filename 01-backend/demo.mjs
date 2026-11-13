// Logs in, prints the Set-Cookie header from slide 005, then uses the cookie.
// Start the backend first: npm start
const base = process.env.API_URL ?? 'http://localhost:4000';

async function call(method, path, { body, cookie } = {}) {
  const res = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(cookie && { Cookie: cookie }) },
    body: body && JSON.stringify(body),
  });
  console.log(`${method.padEnd(5)} ${path.padEnd(22)} ${res.status}  ${await res.text()}`);
  return res;
}

try {
  await call('GET', '/auth/me');
  await call('POST', '/auth/login', { body: { email: 'ahmed@giu-uni.de', password: 'wrong' } });

  const login = await call('POST', '/auth/login', { body: { email: 'ahmed@giu-uni.de', password: 'student123' } });
  const setCookie = login.headers.get('set-cookie');
  console.log(`\nSet-Cookie: ${setCookie}\n`);

  const cookie = setCookie.split(';')[0];
  await call('GET', '/auth/me', { cookie });
  await call('GET', '/students/1/courses', { cookie });
  await call('GET', '/students/2/courses', { cookie });
  await call('GET', '/courses', { cookie });
} catch (error) {
  console.log(`Could not reach ${base}. Is the backend running? (${error.cause?.code ?? error.message})`);
}
