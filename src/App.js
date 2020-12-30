import "./App.css";
import Nav from "./components/Nav";
import { Component } from "react";
import Moment from "react-moment";
//import { BrowserRouter, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";

const url = "http://localhost:8080/movements";

class App extends Component {
  state = {
    data: [],
    modalInsert: false,
    modalDelete: false,
    form: {
      id: "",
      concept: "",
      amount: "",
      date: "",
      type: "",
      modalType: "",
    },
  };
  //Get action query's w/Axios
  queryGet = () => {
    axios
      .get(url)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  //Post action
  queryPost = async () => {
    delete this.state.form.id;
    await axios
      .post("http://localhost:8080/add", this.state.form)
      .then((res) => {
        this.modalInsert();
        this.queryGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  //Update action
  queryPut = () => {
    delete this.state.form.type;
    axios
      .put(
        "http://localhost:8080/update/" + this.state.form.id,
        this.state.form
      )
      .then((response) => {
        this.modalInsert();
        this.queryGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  //Delete action
  queryDelete = () => {
    axios
      .delete("http://localhost:8080/delete/" + this.state.form.id)
      .then((response) => {
        this.setState({ modalDelete: false });
        this.queryGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  //Open & Close Modal
  modalInsert = () => {
    this.setState({ modalInsert: !this.state.modalInsert });
  };

  //select by ID to edit
  selectMovement = (movements) => {
    this.setState({
      modalType: "update",
      form: {
        id: movements.id,
        concept: movements.concept,
        amount: movements.amount,
        date: movements.date,
      },
    });
  };

  //input capture
  handleChange = async (e) => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    console.log(this.state.form);
  };

  componentDidMount() {
    this.queryGet();
  }

  render() {
    const { form } = this.state;

    return (
      <div className="App">
        <Nav />
        <Table striped size="sm" className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Concept</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Type of</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((movements) => {
              return (
                <tr>
                  <td>{movements.id}</td>
                  <td>{movements.concept}</td>
                  <td>
                    {new Intl.NumberFormat("en-EN").format(movements.amount)}
                  </td>
                  <td>
                    <Moment format="DD-MM-YYYY HH:mm">{movements.date}</Moment>
                  </td>
                  <td>{movements.type}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        this.selectMovement(movements);
                        this.modalInsert();
                      }}
                    >
                      ✏
                    </button>
                    {"  "}
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        this.selectMovement(movements);
                        this.setState({ modalDelete: true });
                      }}
                    >
                      🧨
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="btnBox">
          <button
            className="btn btn-success"
            onClick={() => {
              this.setState({ form: null, modalType: "send" });
              this.modalInsert();
            }}
          >
            Add new
          </button>
        </div>

        <Modal isOpen={this.state.modalInsert}>
          <ModalHeader style={{ display: "block" }}>
            <span style={{ float: "right" }} onClick={() => this.modalInsert()}>
              ❎
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input
                className="form-control"
                type="text"
                name="id"
                id="id"
                readOnly
                onChange={this.handleChange}
                value={form ? form.id : this.state.data.length + 1}
              />
              <br />
              <label htmlFor="concept">Concept</label>
              <input
                className="form-control"
                type="text"
                name="concept"
                id="concept"
                onChange={this.handleChange}
                value={form ? form.concept : ""}
              />
              <br />
              <label htmlFor="amount">Amount</label>
              <input
                className="form-control"
                type="number"
                name="amount"
                id="amount"
                onChange={this.handleChange}
                value={form ? form.amount : ""}
              />
              <br />
              <label htmlFor="date">Date of</label>
              <input
                className="form-control"
                type="date"
                name="date"
                id="date"
                onChange={this.handleChange}
                value={form ? form.date : ""}
              />
              <br />
              <label htmlFor="type">Type: </label>
              <select
                name="type"
                id="type"
                onChange={this.handleChange}
                value={form ? form.type : ""}
              >
                <option value="Entry">Entry</option>
                <option value="Exit">Exit</option>
              </select>
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.modalType === "send" ? (
              <button
                className="btn btn-success"
                onClick={() => this.queryPost()}
              >
                Send
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.queryPut()}
              >
                Update
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={() => this.modalInsert()}
            >
              Cancel
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalDelete}>
          <ModalBody>
            Are sure you want to delete "{form && form.concept}"?
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={() => this.queryDelete()}
            >
              Yes
            </button>
            <button
              className="btn btn-secundary"
              onClick={() => this.setState({ modalDelete: false })}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;
