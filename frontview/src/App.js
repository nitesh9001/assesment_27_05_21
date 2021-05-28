import "./App.css";
import data from "./constant/jsonTwo.json";
import dataOne from "./constant/jsonOne.json";
import React, { Component } from "react";
const dataFormap = data.data[0].result;

class App extends Component {
  state = {
    selectFilter: "",
  };
  componentDidMount() {
    this.setState({
      data: data.data[0],
      dataOne: dataOne,
      dataLengthOne: dataOne.data.result.length,
      dataLength: data.data[0].result.length,
    });
  }
  handleChange = (e) => {
    const dataFIlter = dataFormap.filter(function (i, n) {
      return i.marketId === e.target.value;
    });
    this.setState({
      [e.target.name]: e.target.value,
      data: dataFIlter,
      dataLength: dataFIlter.length,
    });
  };
  handleDateChange = (e) => {
    const date = new Date();
    var dataOneNew;
    if (e.target.value === "0") {
      dataOneNew = dataOne.data.result.filter(function (i, n) {
        console.log(new Date(i.event.openDate).getTime(), date.getTime());
        return new Date(i.event.openDate).getTime() === date.getTime();
      });
      console.log(dataOneNew);
    }
    if (e.target.value === "1") {
      dataOneNew = dataOne.data.result.filter(function (i, n) {
        console.log(new Date(i.event.openDate).getTime(), date.getTime());
        return new Date(i.event.openDate).getTime() > date.getTime();
      });
      console.log(dataOneNew);
    }
    if (e.target.value === "-1") {
      dataOneNew = dataOne.data.result.filter(function (i, n) {
        console.log(new Date(i.event.openDate).getTime(), date.getTime());
        return new Date(i.event.openDate).getTime() < date.getTime();
      });
      console.log(dataOneNew);
    }
    this.setState({
      dataOne: dataOneNew,
      dataLengthOne: dataOneNew.length,
    });
  };
  render() {
    return (
      <div>
        <div className="App">
          <div className="App-header">
            <h1>Assignment on JSON</h1>
          </div>
          <div>
            <div>
              <div>
                <h2 className="App-link">
                  Filter Data based on OpenDate Name JSON 1
                </h2>

                <div>
                  <label className="label"> Date Filter :</label>
                  <select
                    name="selectDateFilter"
                    value={this.state.selectFilter}
                    onChange={this.handleDateChange}
                  >
                    <option value="">Date</option>
                    <option value={0}>Today Date</option>
                    <option value={-1}>Past Date</option>
                    <option value={1}>Upcoming Date</option>
                  </select>
                  <div className="displayJosn">
                    <strong>
                      JSON 1 FILE : {this.state.dataLengthOne} results
                    </strong>
                    <pre>{JSON.stringify(this.state.dataOne, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div>
              <h2 className="App-link">
                Filter Data based on Market Name JSON 2
              </h2>

              <div>
                <label className="label"> Market Name :</label>
                <select
                  name="selectFilter"
                  value={this.state.selectFilter}
                  onChange={this.handleChange}
                >
                  {dataFormap !== null && dataFormap !== undefined ? (
                    dataFormap.map((res) => (
                      <option value={res.marketId} key={res.marketId}>
                        {res.marketName}
                      </option>
                    ))
                  ) : (
                    <option>No data</option>
                  )}
                </select>
                <div className="displayJosn">
                  <strong>JSON 2 FILE : {this.state.dataLength} results</strong>
                  <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
