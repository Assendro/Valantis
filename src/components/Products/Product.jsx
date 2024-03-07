import React from "react";

class Product extends React.Component {
  constructor(props) {
    super(props)
  }
  item = this.props.product
  correctPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
  render() {
    return (
      <a className="card" href="">
        <h2 className="cardHeader">{this.item.product}</h2>
        <p className="brand">Производитель: {(this.item.brand) ? this.item.brand : "Не указано"}</p>
        <p className="price">Цена: {this.correctPrice(this.item.price)} p.
        </p>
        <p className="id">id: {this.item.id}</p>
      </a>
    )
  }
}

export default Product