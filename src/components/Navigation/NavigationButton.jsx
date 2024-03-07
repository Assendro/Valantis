import React from "react"

class NavigationButton extends React.Component {
  constructor(props) {
    super(props) 
    this.state = {
      limit: 50
    }
  }

  countNumbers() {
    if (!this.props.lastPageQuantity) {
      return `${this.props.id * this.state.limit + 1} - ${this.props.id * this.state.limit + this.state.limit }`
    } else {
      return `${this.props.id * this.state.limit + 1} - ${this.props.lastPageQuantity}`
    }
  }

  render() {
    let {id, pagesQuantity, page } = this.props
    if (pagesQuantity > 0) {

      if (
      id == 0 || id == pagesQuantity - 1 //края всегда отображаются
      || (id < 10 && page < 5) // первые 11 страниц отображаются пока страница не пройдёт середину
      || (id > pagesQuantity - 12 && page > pagesQuantity - 7) // последние 11 страниц отображаются как только страница прошла середину 
      || (id >= page - 4 && id <= page + 5) // 4 страницы слева и 5 страниц справа от текущей страницы отображаются
      ) { 

        if (id == page) {
          return (
            <button className="current-navigation-button">
              {this.countNumbers()}
            </button>
          )
        }

        return (
          <button className="navigation-button">
            {this.countNumbers()}
          </button>
        )
      } 
    }
  }
}

export default NavigationButton