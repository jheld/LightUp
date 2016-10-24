import React from 'react';
import ReactDOM from 'react-dom';


class LightUp extends React.Component {
    constructor(props) {
	super(props)
	this.token = 'change_me';
	this.state = {'lights': []};
    }
    toggleClick(light) {
	var myHeaders = new Headers({"Authorization": "Bearer "+this.token});
	var myInit = { method: 'POST',
		       headers: myHeaders,
		       mode: 'cors',
		       cache: 'default'};

	fetch('https://api.lifx.com/v1/lights/label:'+light['label']+'/toggle', myInit).then(function (response) {
	    if (response.ok) {
		this.setState(Object.assign({}, this.state, {
		    lights: this.state.lights.map(function(originalLight) {
			if (originalLight !== light) {
			    return originalLight;
			}
			return Object.assign({}, originalLight, {
			    power: originalLight.power==='off' ? 'on' : 'off',
			});
		    })
		}));
	    }
	}.bind(this));
    }
    renderLights(lights) {
	return lights.map(function (light, index) {
	    return (<li key={index}>{light['label']}, is {light['power']}, <button onClick={this.toggleClick.bind(this, light)}>toggle</button></li>);
	}.bind(this));
    }
    componentDidMount() {
	var myHeaders = new Headers({"Authorization": "Bearer "+this.token});
	var myInit = { method: 'GET',
		       headers: myHeaders,
		       mode: 'cors',
		       cache: 'default'};
	fetch('https://api.lifx.com/v1/lights/all', {headers: myHeaders}).then(function(response) {
	    return response.json();
	}).then(function(json) {
	    this.setState({lights: json});
	}.bind(this)).catch(function(err) {
	    // Error :(
	    console.log(err);
	});
    }
    render() {
	return (<ul id="lights">{this.renderLights(this.state.lights)}</ul>);
    }
}

ReactDOM.render(<LightUp />, document.getElementById('container'));
