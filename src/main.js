import App from "./app";

function main() {
  const app = new App();
  app.init();
  app.run();
}

document.body.onload = () => main();
