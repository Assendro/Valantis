import React from "react"
import Request from "./Request"
import filterDuplicates from "./FilterDuplicates"

class Input extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: null, 
      price: null, 
      brand: null,
      brandNames: [],
      error: null,
      isLoaded: null
    }
    this.handleChange = this.handleChange.bind(this)
  }
  changeState = (event) => {
    console.log(event.target.value)

    switch (event.target.className) {
      case "input-name":
        if (event.target.value.length > 0) {
          this.setState({
            name: event.target.value
          })
        } else {
          this.setState({
            name: null
          })
        }
        break;
      case "input-price":
        this.setState({
          price: +event.target.value
        })
        break;
      case "input-brand":
        if (event.target.value == 'Бренд') {
          this.setState({
            brand: null
          })
        } else {
          this.setState({
            brand: event.target.value
          })
        }
        break;
    
      default:
        break;
    }
  }
  async handleChange() {
    if (this.state.name || this.state.price || this.state.brand) {
      this.props.changeParentValue({name: this.state.name, price: this.state.price, brand: this.state.brand, page: 0, filterEnabled: true})
    } else {
      this.props.changeParentValue({name: null, price: null, brand: null, page: 0, filterEnabled: false})
    }

  }
  takeBrands() {
    let body = {
      field: 'brand',
      offset: 0
    }
    return Request('get_fields', body)
      .then((res) => {
        res = filterDuplicates(res)
        res.splice(0, 1)
        this.setState({
          brandNames: res,
          isLoaded: true
        }) 
      }, (e) => {
        console.log("ошибка в get_fields")
        return this.takeBrands()
      })

  } 
  componentDidMount() {
    this.takeBrands()   
  }




  render() {
    const {brandNames, error, isLoaded} = this.state
    if (error && !error.name == 'Server Error' && !error.name == 'Authorization Error' ) {
      console.log(error)
      return <div className="">Ошибка {error}</div>
    } else if (!isLoaded) {
      return <div className="loading">Загрузка...</div>
    } else  {
      return (
        <div className="input-container">
          <input className="input-name" type="text" placeholder="Название" onChange={this.changeState}/>
          <input className="input-price" type="number" placeholder="Цена" onChange={this.changeState} />
          <select  className="input-brand" type="text" onChange={this.changeState}>
            <option key={3} value="Бренд">Бренд</option>
            {brandNames.map((item) => {
              return <option key={item} value={item}>{item}</option>
            })
            }
          </select>
          <button className="input-button" onClick={this.handleChange}>Найти</button>
        </div>
      )
    }

  }
}

export default Input
