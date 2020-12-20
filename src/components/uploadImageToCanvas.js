import React from 'react'


export default class uploadImageToCanvas extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          selectedFile: null, // to store selected file
          handleResponse: null, // handle the API response
          imageUrl: null // to store uploaded image path
        };
    }
    onChangeFile (event) {
        this.setState({ selectedFile: event.target.files[0] });
      };

    handleUpload () {
        const { selectedFile } = this.state;
        if (!selectedFile) {
          this.setState({
            handleResponse: {
              isSuccess: false,
              message: "Please select image to upload."
            }
          });
          return false;
        }
    }


    render() {
        return(
            <div>
                <p>AAAAAAAA</p>
                <div style={{ marginBottom: 10 }}>
                    <input type="file" onChange={this.onChangeFile} />
                </div>
                <input type="button" value="Upload" onClick={this.handleUpload} />
                    {handleResponse && (
                        <p className={handleResponse.isSuccess ? "success" : "error"}>
                             {handleResponse.message}
                        </p>
                    )}
            </div>
        );   
    }
}