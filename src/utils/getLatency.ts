import axios from "axios";
export default async function (url: string) {
  try {
    const start = Date.now();
    await axios.get(url);
    const end = Date.now();
    return end - start;
  } catch (err) {
    console.error(err);
  }
}
