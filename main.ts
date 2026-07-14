throw new Error("紧急人工拉闸：暂停处理任何请求");

const roomkv = await Deno.openKv();

Deno.serve(async (request: Request) => {
  if (request.method === "POST") {
    const data = await request.json();
    await roomkv.set(["last_update"], data);
    return new Response("Data saved!");
  }

  const entry = await roomkv.get(["last_update"]);

  const defaultInfo = {
    TestName: "waiting...",
    RealName: "unknown",
    IPv4: "0.0.0.0",
    PublicIP: "0.0.0.0",
    Obtained: "never",
    LeaseTotal: "∞",
  };

  const info = (entry.value as Record<string, unknown>) ?? defaultInfo;

  const html = `
    <html>
      <head><meta charset="utf-8"></head>
      <body>
        <h1>Hello World!</h1>
        <hr>
        <h2>Office Network Status</h2>
        <p>test name: <span style="color:gray;">${info.TestName}</span></p>
        <p>real name: <strong style="color:green;">${info.RealName}</strong></p>
        <p>ipv4 addr: <strong style="color:orange;">${info.IPv4}</strong></p>
        <p>public ip: <strong style="color:purple;">${info.PublicIP}</strong></p>
        <p>obtained: <span style="color:blue;">${info.Obtained}</span></p>
        <p>lease total: <strong style="color:crimson;">${info.LeaseTotal}</strong></p>
      </body>
    </html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
});
