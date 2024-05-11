const { createServer } = require("http");

let db = [
  {
    id: 1,
    comedian: "Random Joke 1",
    title: "Why don't scientists trust atoms? Because they make up everything!",
    year: 2024,
  },
  {
    id: 2,
    comedian: "Random Joke 2",
    title:
      "Parallel lines have so much in common. It's a shame they'll never meet.",
    year: 2024,
  },
  {
    id: 3,
    comedian: "Random Joke 3",
    title:
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
    year: 2024,
  },
];

const server = createServer((req, res) => {
  console.log(req.url);
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(db));
  } else if (req.url === "/" && req.method === "POST") {
    let joke = "";
    req.on("data", (chunk) => {
      joke += chunk;
    });
    req.on("end", () => {
      try {
        joke = JSON.parse(joke);
        const id = db[db.length - 1].id + 1;
        const extractIdJokes = {
          id,
          ...joke,
        };
        db.push(extractIdJokes);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(db));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error Adding Data" }));
      }
    });
  } else if (req.url.startsWith("/jokes/") && req.method === "PATCH") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const convertedBuffer = Buffer.concat(body).toString();
      const id = +req.url.split("/")[2];

      let updatedJoke = db.find((joke) => joke.id === id);
      if (updatedJoke) {
        const parsedBody = JSON.parse(convertedBuffer);
        updatedJoke = { ...updatedJoke, ...parsedBody };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedJoke));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Joke not found" }));
      }
    });
  } else if (req.url.startsWith("/jokes/") && req.method === "DELETE") {
    const id = +req.url.split("/")[2];

    const deletedJoke = db.find((joke) => joke.id === id);

    if (deletedJoke) {
      db = db.filter((joke) => joke.id !== id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(deletedJoke));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Joke not found" }));
    }
  } else {
    res.end("failed the access db");
  }
});

server.listen(4000, "127.0.0.1", () => {
  console.log("listening on port 4000");
});
