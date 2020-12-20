import React from "react";

const MenuItem = props => {
  return <div className="menu-item"  
       onClick={e => props.handleClick(e, props.text)}>
         {props.text}
         </div>;
};

export default class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    
  }

  handleClick(event, text) {
    console.log(text);
    this.props.handleClick(event, text);
  }

  render() {
    const items=this.props.items.map(item=>(
      <MenuItem text={item.name} 
      key={item.name} 
      handleClick={this.handleClick}
      />
      
    ));
    return (
      <div className="menu-bar">
        {items}
      </div>
    );
  }
}
