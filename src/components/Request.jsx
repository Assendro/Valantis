import Key from "./Key";
import ServerError from "./ServerError";
import AuthorizationError from "./AuthorizationError";

function Request(action, params) {
  const body = {
    action: action, 
    params: params
  }
  const response = fetch('https://api.valantis.store:41000/',
    { method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'X-Auth': Key()
    },
    body: JSON.stringify(body)
    }
  ).then((res) => { //обрабатываем ответ сервера (не ошибка для then)
    if(!res.ok) {
      console.log(`Ошибка запроса ${body.action == "get_ids" ? 'id товаров': 'данных о товарах'} . Код: ${res.status}`)
      switch (res.status) {
        case 500:
          throw new ServerError
          break;
        case 401:
          throw new AuthorizationError
          break;
      
        default:
          throw new Error
          break;
      }
    } else {
      return res
    }
  }, (e) => { throw e }).then((res) => { //приводим строку ответа к объекту 
    return res.json() 
  }, (e) => { throw e; }).then((res) => { // фильтруем дубликаты для ответов в виде массивов с объектами
    if (body.action == "get_ids" || body.action == "filter" || body.action == "get_fields") {
      return res.result
    } else {
      const tempArr = []
      const uniqueRes = []
      res.result.map((item) => {
        if (!tempArr.find(tempItem => tempItem == item.id)) {
          tempArr.push(item.id)
          uniqueRes.push(item)
        }
      })
      
      return uniqueRes
    }    
  }, (e) => { throw e; })

  return response
}

export default Request