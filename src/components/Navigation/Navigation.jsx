import React from "react"
import NavigationButton from "./NavigationButton"
import Request from "../Request"
import Ellipses from "../Ellipses"
import filterDuplicates from "../FilterDuplicates"

class Navigation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      pagesQuantity: 0, 
      maxLength: 10, 
      limit: 50
    }


  }

  countPages(type) {
    switch (type) {
      case 'all':
          this.setState({
            pagesQuantity: Math.ceil(this.props.allUnfilteredProductsQuantity / this.state.limit),
            lastPageQuantity: this.props.allUnfilteredProductsQuantity - (this.props.allUnfilteredProductsQuantity % this.state.limit) 
          })
        break;

      case 'filtered':
        this.setState({
          pagesQuantity: Math.ceil(this.props.productQuantity / this.state.limit),
          lastPageQuantity: this.props.productQuantity 
        })
        break;
    
      default:
        break;
    }

  }

  createArray(length) {
    let arrOfPages = []
    for (let i = 0; i < length; i++) {
      arrOfPages.push(i)
    }
    return arrOfPages
  }  

  componentDidUpdate(prevProps) {
    if ((
    this.props.productQuantity !== prevProps.productQuantity) || 
    this.props.name !== prevProps.name ||
    this.props.price !== prevProps.price ||
    this.props.brand !== prevProps.brand ||
    this.props.page !== prevProps.page || 
    this.props.allUnfilteredProductsQuantity !== prevProps.allUnfilteredProductsQuantity
    ) {

      if (this.props.name == null && this.props.price == null && this.props.brand == null) {
        this.countPages('all')
      } else {
        this.countPages('filtered')
      }
      
    }
  }

  render() {
  let {pagesQuantity, lastPageQuantity} = this.state

  if (pagesQuantity == 1) {
      return (
      <nav className="navigation-container" >
        <NavigationButton key = {0} id = {0} pagesQuantity={pagesQuantity} lastPageQuantity={lastPageQuantity} />
      </nav>
      )
    } else if (pagesQuantity > 0) {
      let array = this.createArray(pagesQuantity)
      array.pop()
      array.shift()

      return (
      <nav className="navigation-container" >
        <NavigationButton key={0} id={0} page={this.props.page} pagesQuantity={pagesQuantity} />

        <Ellipses page={this.props.page} id={0} maxLength={this.state.maxLength} pagesQuantity={pagesQuantity}/>

        {array.map(item => (
                <NavigationButton page={this.props.page} key={item} id={item} pagesQuantity={pagesQuantity}/>
              ))}

        <Ellipses page={this.props.page} id={1} maxLength={this.state.maxLength} pagesQuantity={pagesQuantity}/>

        <NavigationButton key={pagesQuantity - 1} id={pagesQuantity - 1} page={this.props.page} pagesQuantity={pagesQuantity} lastPageQuantity={lastPageQuantity}/>
      </nav>
      )
    }
  }
}

export default Navigation