import React from "react"
import Products from "./components/Products/Products"
import Navigation from "./components/Navigation/Navigation"
import Input from "./components/Input"
import "./css/style.css"

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = { // проще было бы конечно с redux
      page: 0, 
      isLoaded: false,
      name: null,
      price: null, 
      brand: null, 
      productQuantity: null,

      allUnfilteredProductsQuantity: 0, 
      filterEnabled: false,
    }

    this.changeParentValue = this.changeParentValue.bind(this)
  }

  changeParentValue(data) {
    this.setState(data)
  }

  render() {
    return (
      <main>
          <Input changeParentValue = {this.changeParentValue} />
          <Navigation changeParentValue = {this.changeParentValue} page = {this.state.page} productQuantity={this.state.productQuantity} allUnfilteredProductsQuantity={this.state.allUnfilteredProductsQuantity} isLoaded = {this.state.isLoaded} name = {this.state.name} price = {this.state.price} brand = {this.state.brand}/>
          <Products page = {this.state.page} isLoaded = {this.state.isLoaded} changeParentValue = {this.changeParentValue} name = {this.state.name} price = {this.state.price} brand = {this.state.brand} filterEnabled={this.state.filterEnabled}/>
          <Navigation changeParentValue = {this.changeParentValue} page = {this.state.page} productQuantity={this.state.productQuantity} allUnfilteredProductsQuantity={this.state.allUnfilteredProductsQuantity} isLoaded = {this.state.isLoaded} name = {this.state.name} price = {this.state.price} brand = {this.state.brand}/>
      </main>
    )
  }
}

export default App