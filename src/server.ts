import app from "./app.js";


const PORT = process.env.PORT || 8000;
async function main() {
  try {
    app.listen(PORT, () => {
      console.log(`Assignment 6 is running ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
