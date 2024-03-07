import React from "react" 

class Ellipses extends React.Component {
  constructor(props) {
    super(props) 
  }
  
  render() {
    let {maxLength, page, id, pagesQuantity} = this.props
    if (page <= maxLength - 5 && id == 0) {
      return null
    } else if (page >= pagesQuantity - maxLength + 3 && id == 1) {
      return null
    } 
    return <div className="ellipses">. . .</div>
  }
}

export default Ellipses