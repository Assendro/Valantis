import md5 from "md5";
import DateNow from "./DateNow";

const password = 'Valantis';

function Key() {
  //return md5(`${password}_${DateNow()}`) // я не знаю часового пояса сервера, так что в 0:00 могут быть 401 запросы из-за этого расхождения 
  return "6b6cb1e55175afd4a78c2831ba83c4b9"
}


export default Key
