const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

// middlewares

function verifyUUID(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).send();
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  try {
    return response.json(repositories);
  } catch (error) {
    console.log(error);
  }
});

app.post("/repositories", (request, response) => {
  try {
    const { title, url, techs, likes } = request.body;
    const id = uuid();

    const newRepo = {
      id,
      title,
      url,
      techs,
      likes: 0,
    };

    repositories.push(newRepo);

    return response.status(200).json(newRepo);
  } catch (error) {
    console.log(error);
  }
});

app.put("/repositories/:id", (request, response) => {
  try {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    if (!isUuid(id)) {
      return response.status(400).send();
    }

    const repoFindIndex = repositories.findIndex((repo) => repo.id === id);

    if (repoFindIndex < 0) {
      return response.status(400).json({ erro: "Repositorie not found." });
    }

    const updateRepo = {
      id,
      title,
      url,
      techs,
      likes: 0,
    };

    repositories[repoFindIndex] = updateRepo;

    return response.status(200).json(updateRepo);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/repositories/:id", verifyUUID, (request, response) => {
  const { id } = request.params;

  const repoFindIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoFindIndex < 0) {
    return response.status(400).send();
  }

  repositories.splice(repoFindIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", verifyUUID, (request, response) => {
  try {
    const { id } = request.params;

    const repoFindIndex = repositories.findIndex((repo) => repo.id === id);

    if (repoFindIndex < 0) {
      return response.status(400).json({ erro: "Repositorie not found." });
    }

    repositories[repoFindIndex].likes++;
    const likes = { likes: repositories[repoFindIndex].likes };

    return response.status(200).json(likes);
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
