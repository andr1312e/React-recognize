import React from "react";
import 'C:/Users/Вадим/Desktop/1 — копия/1/src/styles/valuespanel.css';
export default class ValuesPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // BottomHistogram: 0,
            //TopHistogram:0,
            // MinimumX:0,
            // MaximumX:0,
            // MinimumY:0,
            // MaximumY:0,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(name, event) {
        console.log("handleChange");
        this.setState({ [name]: event.target.value });

    }
    render() {
        return (
            <form className="form">
                <p>
                    <label> Minimum Hist  value </label>
                    <input type="text" name="BottomHistogram"
                        onChange={(e) => this.props.valueChange(e)} value={this.state.BottomHistogram}
                        placeholder="BottomHistogram" />
                    <input type="text" name="TopHistogram"
                        onChange={(e) => this.props.valueChange(e)} value={this.state.TopHistogram}
                        placeholder="TopHistogram " />
                    <label>TopHistogram</label>
                </p>
                <p>
                    <label> Minimum Graph X value </label>
                    <input type="text" name="MinimumX"
                        onChange={(e) => this.props.valueChange(e)} value={this.state.MinimumX}
                        placeholder="Minimum Graph X value" />
                    <input type="text" name="MaximumX"
                        onChange={(e) => this.props.valueChange(e)} value={this.state.MaximumX}
                        placeholder="Maximum Graph X value " />
                    <label>Maximum Graph X value  </label>
                </p>
                <p>
                    <label> Minimum Graph Y value </label>
                    <input type="text" name="MinimumY"
                        onChange={(e) => this.props.valueChange(e)} value={this.state.MinimumY}
                        placeholder="Minimum Graph Y value" />
                    <input type="text" name="MaximumY"
                        onChange={(e) => this.props.valueChange(e)} value={this.state.MaximumY}
                        placeholder="Maximum Graph Y value " />
                    <label>Maximum Graph Y value  </label>
                </p>
            </form>
        );
    }
}