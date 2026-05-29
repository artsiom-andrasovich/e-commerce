import dotenv from "dotenv";
import app from "./app";

dotenv.config();
const PORT: number = 3005;

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Upload service started on port = ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
