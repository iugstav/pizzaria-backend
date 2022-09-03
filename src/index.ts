import { config } from "dotenv-flow";
import { app } from "./server";

config({ silent: true });

app.listen(3000, () => console.log("hello doidao, tamo rodando"));
