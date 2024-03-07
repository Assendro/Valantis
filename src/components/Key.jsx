import md5 from "md5";
import DateNow from "./DateNow";

const password = 'Valantis';

function Key() {
  return md5(`${password}_${DateNow()}`) // я не знаю часового пояса сервера, так что в 0:00 могут быть 401 запросы из-за этого расхождения 
}


export default Key