import React from "react";
import Key from "../Key";
import ServerError from "../ServerError";
import AuthorizationError from "../AuthorizationError";
import Product from "./Product";
import Request from "../Request";
import filterDuplicates from "../FilterDuplicates";

class Products extends React.Component {
  constructor(props) {
    super(props);
 
    this.state = {
      error: null,
      ids: [],
      items: [],
      limit: 50,
      offset: 0
    };

    this.inputClick = this.inputClick.bind(this)    
    this.takeData = this.takeData.bind(this)
    this.takeProducts = this.takeProducts.bind(this)
    this.takeIds = this.takeIds.bind(this)
    this.updateData = this.updateData.bind(this)

  }
  cashItems = []
  cashIds = []
  beenFiltered = false
  additive = 0
  changable = false
  allUnfilteredProductsQuantity = 0

  filterFromCash(data) {
    if (this.cashItems.length > 0) {
      data.map((dataId) => {
        this.cashItems.map((page) => {
          page.map((product) => {
            if (product.id == dataId) {
              data.splice(data.indexOf(dataId), 1)
            }
          })
        })
      })
    } 
    return data
  }

  takeIds(offset, limit, request) {
    if (this.cashItems[this.props.page]) {
      const temp = []
      this.cashItems[this.props.page].forEach((item) => {
        temp.push(item.id)
      })
      return temp
    } else {
      return Request('get_ids', {offset: offset, limit: limit})
        .then((res) => {
          res = this.filterFromCash(res)
          return res
        }, (e) => {
          console.log("ошибка в get_ids")
          return this.takeIds(offset, limit, request)
        })
    }
  }
  takeFilteredIds(body) {
      return Request('filter', body)
        .then((res) => {
          return res
        }, (e) => {
          console.log("ошибка в filter")
          return this.takeFilteredIds(body)
        })

  }
  takeFields(offset, limit, request) {
      let body = {
        field: 'brand',
        offset: offset,
        limit: limit
      }
      return Request('get_fields', body)
        .then((res) => {
          return res
        }, (e) => {
          console.log("ошибка в get_fields")
          return this.takeFields(offset, limit, request)
        })

  }
  async filterBy(filterType) {
    let res
    switch (filterType) {
      case 'brand':
        res = await this.takeFilteredIds({brand: this.state.brand} )
        break;
      case 'price':
        res = await this.takeFilteredIds({price: this.state.price} )
        break;
      case 'name':
        res = await this.takeFilteredIds({product: this.state.product} )
        break;
    
      default:
        break;
    }
    return res
  }
  takeProducts() {
    if (this.cashItems[this.props.page]) {
      this.setState({
        items: this.cashItems[this.props.page]
      }, () => {
        this.handleChange(this.props.page, true) 
      })
    } else if (this.cashIds[this.props.page]) {
      Request('get_items', {ids: this.cashIds[this.props.page]})
      .then((res) => {
        this.setState({
          items: res
        }, () => {
          this.handleChange(this.props.page, true) 
        })
      }, (e) => {
        console.log("ошибка в get_items")
        this.takeProducts()
      })
    } else {
      Request('get_items', {ids: this.state.ids})
        .then((res) => {
          this.setState({
            items: res
          }, () => {

            this.cashItems[this.props.page] = []
            this.cashItems[this.props.page] = this.cashItems[this.props.page].concat(res)


            this.handleChange(this.props.page, true) 
          })
      }, (e) => {
        console.log("ошибка в get_items")
        this.takeProducts()
      })
    }        
  }

  async handleChange(page, isLoaded) {
    this.props.changeParentValue({page: page, isLoaded: isLoaded, allUnfilteredProductsQuantity: this.allUnfilteredProductsQuantity.length })
  }

  completeFilterCash(array) {
    let tempArray = []
    for (let i = 0;i < Math.trunc(array.length / this.state.limit) + 1; i++) {
      let tempArray2 = []
      for (let j = 0; j < this.state.limit ;j++) {
        if (array[i * this.state.limit + j]) {
          tempArray2.push(array[i * this.state.limit + j])
        }
      } 
      tempArray.push(tempArray2)
    }
    this.cashIds = tempArray
  }
  filterOutCashIds(array) {
    let tempArray = []

    this.cashIds.forEach((page) => {
      page.forEach((cashId) => {
        array.forEach((id) => {
          if (id == cashId) {
            tempArray.push(id)
          }
        })
  
      })
    })

    if (tempArray.length > this.state.limit) {
      this.completeFilterCash(tempArray)
    } else {
      this.cashIds = [tempArray]
    }
  }

  async launchRequests() {
    if (this.state.brand) {
      let pool = await this.filterBy('brand') //запрашиваем

      pool = filterDuplicates(pool) //фильтруем дубликаты
      
      if (pool.length > this.state.limit) {
        this.completeFilterCash(pool) //дополняем и кладём в кеш отфильтрованных
      } else {
        this.cashIds[0] = pool //кладём в кеш отфильтрованных 
      }

    } 
    if (this.state.price) {
      let pool = await this.filterBy('price')

      pool = filterDuplicates(pool)

      if (!this.cashIds.length) {
        if (pool.length > this.state.limit) {
          this.completeFilterCash(pool)
        } else {
          this.cashIds[0] = pool
        }
      } else {
        this.filterOutCashIds(pool)
      }
    } 
    if (this.state.name) {
      let pool = await this.filterBy('name')

      pool = filterDuplicates(pool)
      if (!this.cashIds.length) {
        if (pool.length > this.state.limit) {
          this.completeFilterCash(pool)
        } else {
          this.cashIds[0] = pool
        }
      } else {
        this.filterOutCashIds(pool)
      }

    } 
    if (!this.props.filterEnabled) { //запрос в случае если фильтр не применён 
      let pool = await this.takeIds(this.state.offset + this.additive, this.state.limit, "takeIds")

      pool = filterDuplicates(pool)

      let previousLength = this.state.limit
      let completed = pool.length

      while (pool.length < this.state.limit) { // заполняем страницу до 50 или до 0го ответа от сервера
        const offset2 = this.state.offset + this.state.limit + this.additive
        let pool2 = await this.takeIds(offset2, this.state.limit - completed, 'completeIds')  
        previousLength = pool2.length

        if (previousLength == 0) {
          break // если длинна до фильтрации = 0 - прекратить процесс
        }
        pool2 = filterDuplicates(pool2)
        
        pool = pool.concat(pool2)   
        pool = filterDuplicates(pool)
        completed = pool.length
        
        this.additive = this.additive + previousLength //прибавка отступа для того, чтобы не запрашивать одни и те же товары
      } 
      
      this.setState({ //запрашиваем данные по полученым id и выводим их
        ids: pool
      }, () => {
        this.takeProducts()
      })
    } 
  }

  async countAllUnfilteredProducts() { //считаем количество товаров на всех страницах (когда фильтр не применён)
      Request('get_ids', {offset: 0})
        .then((res) => {
          res = filterDuplicates(res)
          this.allUnfilteredProductsQuantity = res

          this.handleChange(this.props.page, false) 
          this.takeData()

        }, (e) => {
          console.log("ошибка в get_ids")
          this.countAllUnfilteredProducts()
        })
  }
  
  takeData() {
    const page = this.props.page
    if (page === 0) {
      this.additive = 0
    }
    if (this.props.name || this.props.price ||this.props.brand ) {
      this.cashItems = []
      this.beenFiltered = true
    } else if (this.beenFiltered == true) {
      this.cashItems = []
      this.beenFiltered = false
    }

    this.setState({
      offset:  page * this.state.limit,
      ids: [], 
      price: this.props.price,
      brand: this.props.brand,
      name: this.props.name

    }, async () => {
      let result = await this.launchRequests()
      if (this.cashIds.length) {

        this.takeProducts()

        if (this.changable) {
          let tempArray = []
          this.cashIds.forEach((page) => {
            page.forEach((cashId) => {
              tempArray.push(cashId)
            })
          })
          this.props.changeParentValue({productQuantity: tempArray.length})
        }
      }
    })

  }
  updateData() {
    this.handleChange(this.props.page, false) 
      .then(() => {
        this.takeData()
      }) 
    

  }
  inputClick(direction) {
    
    if(
      (direction.target.className == 'buttonRight' && this.props.page + 1 < 160 && this.cashIds.length == 0) ||
      (direction.target.className == 'buttonRight' && this.props.page + 1 < this.cashIds.length)
    ) {
      this.changable = false
      this.handleChange(this.props.page + 1, false) 
        .then(() => {this.takeData()})    
    } else if(direction.target.className == 'buttonLeft' && this.props.page > 0) {
      this.changable = false
      this.handleChange(this.props.page - 1, false) 
        .then(() => {this.takeData()}) 
    }
  }

  componentDidMount() {
    this.countAllUnfilteredProducts()
  }
  componentWillUnmount() { 
    this.countAllUnfilteredProducts()
  }

  componentDidUpdate(prevProps) {
    if (((this.props.page !== prevProps.page) && this.props.isLoaded) || 
      this.props.name !== prevProps.name ||
      this.props.price !== prevProps.price ||
      this.props.brand !== prevProps.brand) {

      if (this.props.name !== prevProps.name ||
        this.props.price !== prevProps.price ||
        this.props.brand !== prevProps.brand) {

        this.cashIds = [] //сброс кеша фильтров в случае изменений настроек фильтрации
        this.changable = true
      }
      this.handleChange(this.props.page, false) 
      this.updateData();
      
    }
  }


  render() {
    let { error, items} = this.state;
    let isLoaded = this.props.isLoaded

    if (error && !error.name == 'Server Error' && !error.name == 'Authorization Error' ) { //в случае неописанной ошибки вывести её
      return <div className="">Ошибка {error}</div>
    } else if (!isLoaded ) { // пока грузятся запросы
      return (
        <div className="wrapper">
          <button className="buttonLeft" >&lt;</button>
            <div className="container">
              <div className="loading">Загрузка...</div>
            </div>
          <button className="buttonRight">&gt;</button>
        </div>
      );

    } else if (items.length == 0 ) { // если по таким запросам пустой ответ
      return (
        <div className="wrapper">
          <button className="buttonLeft" >&lt;</button>
            <div className="container">
              <div className="loading">Нет таких товаров</div>
            </div>
          <button className="buttonRight">&gt;</button>
        </div>
      );

    } else { // вывод товаров
      return (
        <div className="wrapper">
          <button className="buttonLeft" onClick={this.inputClick}>&lt;</button>
            <div className="container">
              {items.map(item => (
                <Product key={item.id} product={item}/>
              ))}
            </div>
          <button className="buttonRight" onClick={this.inputClick}>&gt;</button>
        </div>
      );    }
  }
}

export default Products