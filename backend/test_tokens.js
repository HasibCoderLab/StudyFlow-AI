async function runTests() {
  const url = "http://localhost:5000/api/v1/auth";
  const testEmail = `tokenuser${Math.floor(1000 + Math.random() * 9000)}@example.com`;

  console.log("=== STEP 1: Registration ===");
  const regRes = await fetch(`${url}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Token User",
      email: testEmail,
      password: "password123",
      subjects: ["Math"],
    }),
  });

  console.log("Reg Status:", regRes.status);
  const regJson = await regRes.json();
  console.log("Reg Body:", JSON.stringify(regJson, null, 2));

  // Extract cookies from Set-Cookie header
  const rawCookies = regRes.headers.get("set-cookie");
  console.log("Set-Cookie Header:", rawCookies);
  
  if (!rawCookies) {
    console.error("❌ No cookies returned!");
    process.exit(1);
  }

  // Extract refreshToken cookie value
  const refreshTokenCookie = rawCookies.split(";")[0];
  const accessToken = regJson.data.accessToken;

  console.log("\n=== STEP 2: Fetch Me with Access Token ===");
  const meRes = await fetch(`${url}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  console.log("Me Status:", meRes.status);
  const meJson = await meRes.json();
  console.log("Me Response:", meJson.success ? "Success" : "Failed");

  console.log("\n=== STEP 3: Refresh Access Token ===");
  const refRes = await fetch(`${url}/refresh`, {
    method: "POST",
    headers: { Cookie: refreshTokenCookie },
  });

  console.log("Refresh Status:", refRes.status);
  const refJson = await refRes.json();
  console.log("Refresh Body:", JSON.stringify(refJson, null, 2));

  const newRawCookies = refRes.headers.get("set-cookie");
  const newRefreshTokenCookie = newRawCookies ? newRawCookies.split(";")[0] : null;
  const newAccessToken = refJson.data.accessToken;

  console.log("\n=== STEP 4: Fetch Me with New Access Token ===");
  const newMeRes = await fetch(`${url}/me`, {
    headers: { Authorization: `Bearer ${newAccessToken}` },
  });
  console.log("New Me Status:", newMeRes.status);

  console.log("\n=== STEP 5: Logout ===");
  const logRes = await fetch(`${url}/logout`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${newAccessToken}`,
      Cookie: newRefreshTokenCookie 
    },
  });
  console.log("Logout Status:", logRes.status);
  console.log("Logout Set-Cookie Header:", logRes.headers.get("set-cookie"));

  console.log("\n=== STEP 6: Refresh Again (Should fail after logout revocation) ===");
  const refFailRes = await fetch(`${url}/refresh`, {
    method: "POST",
    headers: { Cookie: newRefreshTokenCookie },
  });
  console.log("Refresh Again Status (Expected 401):", refFailRes.status);
  const refFailJson = await refFailRes.json();
  console.log("Refresh Again Body:", JSON.stringify(refFailJson, null, 2));
}

runTests().catch(console.error);
