# From https://hub.docker.com/r/cypress/browsers/tags
FROM cypress/included:latest

WORKDIR /opt/test

COPY ./tests-cypress/package.json package.json
COPY ./tests-cypress/package-lock.json package-lock.json
COPY ./tests-cypress/cypress.config.ts cypress.config.ts

RUN npm install

ENTRYPOINT ["npm", "run", "test:headless"]
